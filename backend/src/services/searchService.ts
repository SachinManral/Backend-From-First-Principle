import { TavilySearchResultItem, TavilySearchResponse } from '../types/chat.js';

/**
 * Service for handling live search integrations with Tavily API
 */
export class SearchService {
  private static readonly GENERAL_SEARCH_KEYWORDS = [
    'time', 'date', 'today', 'now', 'current', 'clock',
    'weather', 'temperature', 'forecast', 'rain', 'sunny',
    'news', 'latest', 'recent', 'update', 'happened', 'event',
    'prime minister', 'president', 'who is', 'who are', 'where is',
    'capital', 'population', 'country', 'city',
    'version', 'documentation', 'release', 'changelog',
    'search', 'find', 'look up', 'google'
  ];

  /**
   * Evaluates if a user prompt necessitates live web retrieval
   */
  public static shouldTriggerSearch(query: string, explicitlyEnabled: boolean): boolean {
    if (explicitlyEnabled) return true;
    const lowerQuery = query.toLowerCase();
    return this.GENERAL_SEARCH_KEYWORDS.some(kw => lowerQuery.includes(kw));
  }

  /**
   * Performs an asynchronous search query against the Tavily API
   */
  public static async executeSearch(query: string, apiKey?: string): Promise<string> {
    if (!apiKey || !query.trim()) return '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          max_results: 3,
          search_depth: 'basic'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`Tavily search API responded with status ${res.status}`);
        return '';
      }

      const data = (await res.json()) as TavilySearchResponse;
      if (data.results && data.results.length > 0) {
        const snippets = data.results
          .map((r: TavilySearchResultItem) => `• ${r.title}: ${r.content?.slice(0, 300)}`)
          .join('\n');
        return `\n\n[Web Search Results — Tavily]:\n${snippets}\n`;
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn('Tavily search request timed out after 8s');
      } else {
        console.warn('Tavily search exception:', err?.message);
      }
    }

    return '';
  }
}
