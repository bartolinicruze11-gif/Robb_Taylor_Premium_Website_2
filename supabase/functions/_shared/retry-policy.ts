/** Only network failures, rate limits and provider 5xx are retried. */
export function retryDecision(status: number | null, attempt: number) {
 const transient = status === null || status === 408 || status === 429 || status >= 500;
 return { retry: transient && attempt < 8, delayMs: Math.min(60_000 * 2 ** Math.max(0,attempt-1),3_600_000),
  failureClass: status === null ? 'network_or_configuration' : transient ? 'provider_transient' : 'provider_permanent' };
}
