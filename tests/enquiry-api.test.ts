import { describe, it, expect, vi } from 'vitest';
import { handleEnquiry } from '@/lib/enquiry-handler';
import { lead } from './fixtures';
function request(body: unknown = lead, headers: Record<string, string> = {}) {
  return new Request('http://localhost:3000/api/enquiries', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000', 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}
function dependencies() {
  return {
    mode: 'local' as 'local' | 'production' | 'unconfigured',
    siteUrl: 'http://localhost:3000',
    rateLimit: vi.fn().mockResolvedValue(true),
    save: vi.fn().mockResolvedValue(lead.id),
    deliver: vi.fn().mockResolvedValue(undefined),
    report: vi.fn(),
  };
}
describe('enquiry API integration boundaries', () => {
  it('validates, rate limits, persists, and dispatches delivery in order', async () => {
    const deps = dependencies();
    const result = await handleEnquiry(request(), deps);
    expect(result.status).toBe(201);
    expect(await result.json()).toMatchObject({ ok: true, reference: lead.id, mode: 'local' });
    expect(deps.save).toHaveBeenCalledOnce();
    expect(deps.deliver).toHaveBeenCalledWith(lead.id);
    expect(deps.rateLimit.mock.calls[0][0]).toMatch(/^[a-f0-9]{64}$/);
  });
  it('blocks cross-origin requests before persistence', async () => {
    const deps = dependencies();
    expect(
      (await handleEnquiry(request(lead, { origin: 'https://attacker.test' }), deps)).status,
    ).toBe(403);
    expect(deps.save).not.toHaveBeenCalled();
  });
  it('rejects invalid inputs and missing consent', async () => {
    const deps = dependencies();
    expect((await handleEnquiry(request({ ...lead, consent: false }), deps)).status).toBe(422);
    expect(deps.save).not.toHaveBeenCalled();
  });
  it('rejects oversized requests', async () => {
    const deps = dependencies();
    expect(
      (await handleEnquiry(request({ ...lead, description: 'x'.repeat(17000) }), deps)).status,
    ).toBe(413);
  });
  it('rejects malformed JSON and content types', async () => {
    const deps = dependencies();
    expect(
      (
        await handleEnquiry(
          new Request('http://localhost:3000/api/enquiries', {
            method: 'POST',
            headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' },
            body: '{',
          }),
          deps,
        )
      ).status,
    ).toBe(400);
    expect(
      (await handleEnquiry(request(lead, { 'content-type': 'text/plain' }), deps)).status,
    ).toBe(415);
  });
  it('returns 429 before saving when the shared limiter denies', async () => {
    const deps = dependencies();
    deps.rateLimit.mockResolvedValue(false);
    const response = await handleEnquiry(request(), deps);
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('600');
    expect(deps.save).not.toHaveBeenCalled();
  });
  it('retains a successful save when a notification fails', async () => {
    const deps = dependencies();
    deps.deliver.mockRejectedValue(new Error('provider unavailable'));
    expect((await handleEnquiry(request(), deps)).status).toBe(201);
    expect(deps.report).toHaveBeenCalledOnce();
  });
  it('reports a save failure without leaking provider errors', async () => {
    const deps = dependencies();
    deps.save.mockRejectedValue(new Error('secret-provider-detail'));
    const response = await handleEnquiry(request(), deps);
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toContain('secret-provider-detail');
    expect(deps.deliver).not.toHaveBeenCalled();
  });
  it('fails closed if production is not configured', async () => {
    const deps = dependencies();
    deps.mode = 'unconfigured';
    expect((await handleEnquiry(request(), deps)).status).toBe(503);
    expect(deps.save).not.toHaveBeenCalled();
  });
});
