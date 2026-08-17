import { Router, Request, Response } from 'express';
import { AIService } from '../services/aiService.js';
import { SearchService } from '../services/searchService.js';
import { ChatStreamRequest } from '../types/chat.js';

const router = Router();

/**
 * POST /api/chat/stream
 * Production-ready Server-Sent Events (SSE) streaming endpoint with decoupled services,
 * client abort handling, token filtering, and automatic search fallback.
 */
router.post('/stream', async (req: Request, res: Response) => {
  const { messages, enableWebSearch = false }: ChatStreamRequest = req.body;

  // 1. Configure Server-Sent Events headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  // 2. Request Payload Validation
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.write(`data: ${JSON.stringify({ error: 'A valid non-empty messages array is required.' })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  const tavilyApiKey = process.env.TAVILY_API_KEY;

  if (!groqApiKey) {
    res.write(
      `data: ${JSON.stringify({
        error: 'AI service API key is not configured in backend/.env.'
      })}\n\n`
    );
    res.write('data: [DONE]\n\n');
    return res.end();
  }

  // 3. Client Abort Controller to prevent orphaned streams on socket disconnect
  const abortController = new AbortController();
  res.on('close', () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  });

  try {
    const latestUserMsg = messages[messages.length - 1]?.content || '';

    // 4. Live Search Orchestration (SearchService)
    let searchContext = '';
    const shouldSearch = SearchService.shouldTriggerSearch(latestUserMsg, enableWebSearch);
    if (shouldSearch && tavilyApiKey) {
      searchContext = await SearchService.executeSearch(latestUserMsg, tavilyApiKey);
    }

    // 5. Context Window & Sliding Memory (AIService)
    const conversation = AIService.buildConversationContext(messages, searchContext);

    // 6. Upstream Inference Dispatch with Failover (AIService)
    const groqResponse = await AIService.fetchCompletionStream(
      conversation,
      groqApiKey,
      abortController.signal
    );

    const reader = groqResponse.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    if (!reader) {
      throw new Error('No readable stream returned by inference provider.');
    }

    // 7. Streaming Response Loop with Sanitation
    let buffer = '';
    const streamState = { isFilteringThink: false };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        if (trimmed === 'data: [DONE]') {
          res.write('data: [DONE]\n\n');
          return res.end();
        }

        try {
          const jsonStr = trimmed.replace(/^data:\s*/, '');
          const parsed = JSON.parse(jsonStr);
          const rawDelta = parsed.choices?.[0]?.delta?.content || '';

          if (rawDelta) {
            const cleanContent = AIService.processStreamDelta(rawDelta, streamState);
            if (cleanContent) {
              res.write(`data: ${JSON.stringify({ content: cleanContent })}\n\n`);
            }
          }
        } catch {
          // Ignore partial chunk parse errors
        }
      }
    }

    res.write('data: [DONE]\n\n');
    return res.end();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Client closed connection; stream aborted.');
      return res.end();
    }

    console.error('Chat streaming error:', error);
    res.write(
      `data: ${JSON.stringify({
        error: error.message || 'An unexpected error occurred during inference.'
      })}\n\n`
    );
    res.write('data: [DONE]\n\n');
    return res.end();
  }
});

/**
 * GET /api/chat/status
 * Healthcheck endpoint for Neo AI subsystem
 */
router.get('/status', (_req: Request, res: Response) => {
  return res.status(200).json({
    status: 'ok',
    aiEngine: 'Neo AI Production Service Active'
  });
});

export default router;
