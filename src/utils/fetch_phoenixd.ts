import { PhoenixdMcpConfig } from '../types/index.js';

export type FetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function fetchPhoenixd<T = unknown>(
  config: PhoenixdMcpConfig,
  endpoint: string,
  options: {
    method: 'GET' | 'POST';
    body?: URLSearchParams;
    responseType?: 'json' | 'text';
  },
): Promise<FetchResult<T>> {
  const credentials = btoa(`:${config.httpPassword}`);
  const { method, body, responseType = 'json' } = options;

  try {
    const response = await fetch(
      `${config.httpProtocol}://${config.httpHost}:${config.httpPort}${endpoint}`,
      {
        method,
        headers: {
          'Content-Type': method === 'POST'
            ? 'application/x-www-form-urlencoded'
            : 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
        body: body?.toString(),
      },
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      return {
        ok: false,
        error: `HTTP ${response.status}: ${errorText || response.statusText}`,
      };
    }

    const data = responseType === 'text'
      ? await response.text()
      : await response.json();

    return { ok: true, data: data as T };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';
    return { ok: false, error: `Network error: ${message}` };
  }
}

export function formatToolResponse(data: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
      },
    ],
  };
}

export function formatToolError(error: string) {
  return {
    content: [
      {
        type: 'text' as const,
        text: error,
      },
    ],
    isError: true,
  };
}
