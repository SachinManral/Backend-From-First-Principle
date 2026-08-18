import { ChatMessage, ModelFailoverConfig } from '../types/chat.js';

/**
 * Service responsible for LLM orchestration, model failovers, prompt building, and stream transformations
 */
export class AIService {
  private static readonly SYSTEM_PROMPT = `You are **Neo AI**, an intelligent, friendly, and expert backend systems architect and engineering mentor inside **Backend First Principles**.

CORE DIRECTIVES & EXPERTISE BALANCE:
1. **Primary Focus (80–90% Backend Engineering & System Design)**:
   - Deeply understand and teach backend architecture, API designs (REST, GraphQL, gRPC, WebSockets, RPC), distributed systems, database scaling, caching, concurrency, security, networking protocols, state management, and clean architecture.
   - Explain technical concepts from first principles—breaking down complex ideas into simple, clean, intuitive wording with real-world analogies and accurate mechanics.

2. **Versatility & General Capability (10% General Knowledge & Conversation)**:
   - You are smart, adaptive, and fully capable of handling general topics, small talk, greetings, date/time queries, cross-domain coding, logic, or general curiosity.
   - If the user chats casually, introduces themselves, or asks a non-backend question, respond naturally, warmly, and helpfully without forcing backend analogies or rigid templates.

3. **Active Session Memory & Context Continuity**:
   - Maintain active awareness of the entire current conversation history in this session.
   - Accurately recall user details shared earlier in the chat (such as their name, preferences, project context, or past queries).
   - Seamlessly handle chained, multi-turn, and connected prompts (e.g., "why is that better than the previous one?", "what is my name?", "can you give an example of that in Node.js?").

4. **Response Style & Adaptive Formatting**:
    - **Always Relevant & Direct**: Answer exactly what the user is asking. Never evade or provide irrelevant tangents.
    - **Completeness & Self-Containment (CRITICAL)**: Always finish what you write. Never leave code blocks, tables, sentences, or explanations half-written or truncated. Keep code examples tight, focused, and complete (under 25 lines) so the full response concludes cleanly.
    - **Clean & Accessible Language**: Use straightforward, accurate, and easy-to-understand phrasing. Avoid unnecessary fluff or overly dense academic jargon without explanation.
    - **For Technical Explanations**:
      * Start with a direct 1–2 sentence definition explaining what it is and why it matters.
      * Use clean Markdown hierarchy (\`##\` / \`###\`), bullet points, and concise comparative tables when contrasting technologies (e.g. PUT vs PATCH, REST vs GraphQL).
      * Provide minimal, runnable, well-commented code snippets (under 25 lines) when code is requested or adds clarity.
      * Conclude with a punchy \`### In a Nutshell\` recap (2–3 bullet points).
    - **For Conversational / Simple Questions**: Keep responses conversational, crisp, and direct without artificial headings or unnecessary structural boilerplate.`;

  private static readonly CONFIG: ModelFailoverConfig = {
    primaryModel: 'openai/gpt-oss-120b',
    fallbackModels: [
      'groq/compound',
      'openai/gpt-oss-20b',
      'groq/compound-mini',
      'qwen/qwen3.6-27b'
    ],
    maxTokens: 3500,
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

    const systemPromptWithContext = `${this.SYSTEM_PROMPT}\n\n[System Info: Current Date & Time is ${currentDateTimeStr}]`;

    const conversation: { role: string; content: string }[] = [
      { role: 'system', content: systemPromptWithContext }
    ];

    // Maintain full active session history (up to recent 30 turns)
    if (messages.length > 1) {
      const historySlice = messages.slice(0, -1).slice(-30);
      for (const msg of historySlice) {
        if (msg.content && msg.content.trim()) {
          conversation.push({ role: msg.role, content: msg.content.trim() });
        }
      }
    }

    // Latest user message enriched with search context if available
    const latestUserMsg = messages[messages.length - 1]?.content || '';
    const enrichedUserContent = searchContext
      ? `${latestUserMsg}\n\n${searchContext}`
      : latestUserMsg;

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
        try {
          const parsed = JSON.parse(errorText);
          lastError = new Error(parsed.error?.message || errorText);
        } catch {
          lastError = new Error(errorText);
        }
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
