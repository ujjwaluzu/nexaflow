import { afterEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  context: vi.fn(),
  mode: vi.fn(() => 'production'),
  save: vi.fn(),
  database: vi.fn(),
}));
vi.mock('@opennextjs/cloudflare', () => ({ getCloudflareContext: mocks.context }));
vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn() }));
vi.mock('next/server', () => ({ after: vi.fn() }));
vi.mock('@/lib/integrations/config', () => ({ enquiryMode: mocks.mode }));
vi.mock('@/lib/integrations/database', () => ({ database: mocks.database, saveLead: mocks.save }));
import { POST } from '@/app/api/enquiries/route';
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});
describe('production route security boundary', () => {
  it('does not trust a forged Cloudflare IP header outside the Worker runtime', async () => {
    mocks.context.mockImplementation(() => {
      throw new Error('no_worker_context');
    });
    const result = await POST(
      new Request('https://studio.example.test/api/enquiries', {
        method: 'POST',
        headers: { 'cf-connecting-ip': '127.0.0.1' },
      }),
    );
    expect(result.status).toBe(503);
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it('rejects a denied native limiter before reading or saving a lead', async () => {
    vi.stubEnv('RATE_LIMIT_SALT', 'test-salt');
    const limit = vi.fn().mockResolvedValue({ success: false });
    mocks.context.mockReturnValue({ env: { ENQUIRY_RATE_LIMITER: { limit } } });
    const result = await POST(
      new Request('https://studio.example.test/api/enquiries', {
        method: 'POST',
        headers: { 'cf-connecting-ip': '192.0.2.1' },
      }),
    );
    expect(result.status).toBe(429);
    expect(limit.mock.calls[0][0].key).toMatch(/^[a-f0-9]{64}$/);
    expect(mocks.save).not.toHaveBeenCalled();
    expect(mocks.database).not.toHaveBeenCalled();
  });
});
