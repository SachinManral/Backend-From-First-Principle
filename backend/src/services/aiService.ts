import { ChatMessage, ModelFailoverConfig } from '../types/chat.js';

/**
 * Service responsible for LLM orchestration, model failovers, prompt building, and stream transformations
 */
export class AIService {
  private static readonly CONFIG: ModelFailoverConfig = {
    primaryModel: 'openai/gpt-oss-120b',
    fallbackModels: [
      'openai/gpt-oss-20b'
    ],
    maxTokens: 1400,
    temperature: 0.25
  };

  private static readonly RESPONSE_CONTRACT = `You are Neo AI, a clear, practical backend engineering mentor inside Backend First Principles.

Answer behavior:
- Start with the answer. Do not repeat the user's question or open with a title.
- Prefer crisp paragraphs and short bullets. Use headings only for multi-part answers.
- Match depth to the question:
  - Greeting or simple factual question: 1-3 sentences.
  - Concept explanation: direct definition, first-principles intuition, then one practical example.
  - Debugging/design help: diagnosis, recommended fix, and tradeoff.
  - Code request: minimal working code, then only the important notes.
- Keep most answers under 180 words unless the user asks for depth, code, comparisons, or a plan.
- Avoid filler, hype, long intros, and generic closing lines.
- Ask one concise clarifying question only when missing details would make the answer misleading.

Backend focus:
- Prioritize backend architecture, APIs, databases, caching, networking, auth, distributed systems, concurrency, and clean architecture.
- Casual or non-backend questions are allowed; answer naturally without forcing backend analogies.
- Maintain continuity with the current chat history and remember details the user shared in this session.

Formatting:
- Use Markdown sparingly.
- Use bullets for lists, not long numbered essays unless order matters.
- Put all code, commands, routes, payloads, and ASCII diagrams inside fenced code blocks with a language tag.
- Keep code examples self-contained and under 20 lines when possible.
- Never output "Copy code", standalone language labels, or decorative symbols.`;

  private static readonly MAX_CONTEXT_MESSAGES = 12;
  private static readonly MAX_MESSAGE_CHARS = 4000;

  public static normalizeMessages(messages: ChatMessage[]): ChatMessage[] {
    return messages
      .filter(msg => msg && (msg.role === 'user' || msg.role === 'assistant'))
      .map(msg => ({
        role: msg.role,
        content: this.compactContent(msg.content)
      }))
      .filter(msg => msg.content.length > 0);
  }

  /**
   * Prepares the bounded context window (system prompt + sliding history + enriched user query)
   */
  public static buildConversationContext(
    messages: ChatMessage[],
    searchContext: string = ''
  ): { role: string; content: string }[] {
    const normalizedMessages = this.normalizeMessages(messages);
    const now = new Date();
    const currentDateTimeStr = now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const systemPromptWithContext = `${this.RESPONSE_CONTRACT}\n\nCurrent date and time: ${currentDateTimeStr}`;

    const conversation: { role: string; content: string }[] = [
      { role: 'system', content: systemPromptWithContext }
    ];

    // Keep recent messages to control context size
    if (normalizedMessages.length > 1) {
      const historySlice = normalizedMessages.slice(0, -1).slice(-this.MAX_CONTEXT_MESSAGES);
      for (const msg of historySlice) {
        conversation.push({ role: msg.role, content: msg.content });
      }
    }

    // Latest user message enriched with search context if available
    const latestUserMsg = normalizedMessages[normalizedMessages.length - 1]?.content || '';
    const enrichedUserContent = searchContext
      ? this.buildGroundedUserPrompt(latestUserMsg, searchContext)
      : this.buildCleanUserPrompt(latestUserMsg);

    conversation.push({ role: 'user', content: enrichedUserContent });

    return conversation;
  }

  /**
   * Dispatches the chat completion request to Groq with automated model failover
   */
  public static async fetchCompletionStream(
    conversation: { role: string; content: string }[],
    apiKey: string,
    signal?: AbortSignal
  ): Promise<Response> {
    const candidateModels = [this.CONFIG.primaryModel, ...this.CONFIG.fallbackModels];
    let lastError: Error | null = null;

    for (const model of candidateModels) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages: conversation,
            temperature: this.CONFIG.temperature,
            max_tokens: this.CONFIG.maxTokens,
            stream: true
          }),
          signal
        });

        if (response.ok) {
          return response;
        }

        const errorText = await response.text();
        console.warn(`Model ${model} failed (${response.status}): ${errorText}`);

        // Only retry transient errors (rate limit, server downtime)
        if (![429, 500, 502, 503, 504].includes(response.status)) {
          try {
            const parsed = JSON.parse(errorText);
            throw new Error(parsed.error?.message || errorText);
          } catch {
            throw new Error(errorText);
          }
        }

        try {
          const parsed = JSON.parse(errorText);
          lastError = new Error(parsed.error?.message || errorText);
        } catch {
          lastError = new Error(errorText);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') throw err;
        // Re-throw if error was generated from non-retryable response
        if (err.message && !candidateModels.some(m => err.message.includes(m))) {
          throw err;
        }
        console.warn(`Model ${model} network error:`, err?.message);
        lastError = err;
      }
    }

    throw lastError || new Error('All configured AI models failed to respond.');
  }

  /**
   * Sanitizes streaming chunks by stripping internal reasoning <think> tokens
   */
  public static processStreamDelta(
    rawContent: string,
    state: { isFilteringThink: boolean }
  ): string {
    let content = rawContent;

    if (content.includes('<think>')) {
      state.isFilteringThink = true;
      content = content.replace(/<think>[\s\S]*/, '');
    }

    if (state.isFilteringThink) {
      if (content.includes('</think>')) {
        state.isFilteringThink = false;
        content = content.replace(/[\s\S]*<\/think>/, '');
      } else {
        content = '';
      }
    }

    return content.replace(/<\/?think>/g, '');
  }

  private static compactContent(content: string = ''): string {
    return content
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{4,}/g, '\n\n\n')
      .trim()
      .slice(0, this.MAX_MESSAGE_CHARS);
  }

  private static buildCleanUserPrompt(userMessage: string): string {
    return `User message:
${userMessage}

Respond cleanly. Use the shortest useful structure for this request.`;
  }

  private static buildGroundedUserPrompt(userMessage: string, searchContext: string): string {
    return `User message:
${userMessage}

Reference context:
${this.compactContent(searchContext)}

Use the reference context only when it directly helps. If it is irrelevant or conflicts with the conversation, say so briefly and answer from fundamentals.`;
  }
}
