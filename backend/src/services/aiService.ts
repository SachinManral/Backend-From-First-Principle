import { ChatMessage, ModelFailoverConfig } from '../types/chat.js';

/**
 * Service responsible for LLM orchestration, model failovers, prompt building, and stream transformations
 */
export class AIService {
  private static readonly SYSTEM_PROMPT = `You are **Neo AI**, an expert backend systems architect and friendly engineering mentor inside **Backend First Principles**.

YOUR CORE MISSION:
Provide clear, simple-worded, and highly professional explanations that make complex backend concepts easy to understand for anyone, without sacrificing depth, accuracy, or essential technical details.

RESPONSE STRUCTURE & STYLE:
1. **Direct, Clear Opening**:
   - Start immediately with a simple, 1–2 sentence definition in plain English explaining what the concept is and why it exists.
   - Never repeat the user's question as a title.
2. **Proper & Varied Hierarchy (Never Monotone or Boring)**:
   - Use standard \`## Main Heading\` for primary sections and \`### Subheading\` for specific details.
   - Group related points under bold labels (e.g. \`* **Client-Side**:\` and \`* **Server-Side**:\`).
   - Use clean Markdown tables when comparing items or methods (e.g. PUT vs PATCH, REST vs GraphQL, SQL vs NoSQL).
3. **Comprehensive Yet Crisp**:
   - Cover all essential technical mechanics (data flow, status codes, state management, and edge cases) without writing bloated fluff.
4. **Clean & Minimal Code (When Relevant)**:
   - When code is requested or helps illustrate a point, provide ONE clean, minimal, runnable snippet (under 25 lines) with short comments.
5. **In a Nutshell**:
   - Always conclude with a clean \`### In a Nutshell\` section containing 2–3 punchy bullet points summarizing the key takeaway.`;

  private static readonly CONFIG: ModelFailoverConfig = {
    primaryModel: 'openai/gpt-oss-120b',
    fallbackModels: ['groq/compound', 'openai/gpt-oss-20b'],
    maxTokens: 1500,
    temperature: 0.3
  };

  /**
   * Prepares the bounded context window (system prompt + sliding history + enriched user query)
   */
  public static buildConversationContext(
    messages: ChatMessage[],
    searchContext: string = ''
  ): { role: string; content: string }[] {
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
    const dateTimeContext = `[Current Date & Time: ${currentDateTimeStr}]\n\n`;

    const conversation: { role: string; content: string }[] = [
      { role: 'system', content: this.SYSTEM_PROMPT }
    ];

    // Sliding window: keep up to the last 6 messages
    if (messages.length > 1) {
      const historySlice = messages.slice(0, -1).slice(-6);
      for (const msg of historySlice) {
        conversation.push({ role: msg.role, content: msg.content });
      }
    }

    // Latest user message enriched with live timestamp & search context
    const latestUserMsg = messages[messages.length - 1]?.content || '';
    const enrichedUserContent = dateTimeContext + latestUserMsg + searchContext;
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
      } catch (err: any) {
        if (err.name === 'AbortError') throw err;
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
}
