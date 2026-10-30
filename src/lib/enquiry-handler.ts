import 'server-only';
import { createHmac } from 'node:crypto';
import { enquirySchema, type Enquiry } from './validation/enquiry';
import type { EnquiryMode } from './integrations/config';
type Dependencies = {
  mode: EnquiryMode;
  siteUrl: string;
  rateLimit: (key: string) => Promise<boolean>;
  save: (data: Enquiry) => Promise<string>;
  deliver: (id: string) => Promise<unknown>;
  report: (error: unknown) => void;
};
const json = (data: unknown, status = 200, extra: Record<string, string> = {}) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...extra } });
async function readBody(request: Request) {
  if (Number(request.headers.get('content-length')) > 16000) throw new Error('body_limit');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid_json');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 16000) {
      await reader.cancel();
      throw new Error('body_limit');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
export async function handleEnquiry(request: Request, deps: Dependencies) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(deps.siteUrl).origin)
    return json({ error: 'This request origin is not allowed.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return json({ error: 'Send a JSON request.' }, 415);
  if (deps.mode === 'unconfigured')
    return json(
      {
        error:
          'Project enquiries are not available yet. Please try again once the studio has enabled this form.',
      },
      503,
    );
  const requestHostname =
    request.headers.get('host')?.split(':')[0] || new URL(request.url).hostname;
  if (deps.mode === 'local' && !['localhost', '127.0.0.1'].includes(requestHostname))
    return json({ error: 'Local test mode is only available on localhost.' }, 503);
  let raw: unknown;
  try {
    raw = await readBody(request);
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error && error.message === 'body_limit'
            ? 'The enquiry is too large.'
            : 'Unable to read the request.',
      },
      error instanceof Error && error.message === 'body_limit' ? 413 : 400,
    );
  }
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success)
    return json(
      { error: 'Please check the highlighted fields.', fields: parsed.error.flatten().fieldErrors },
      422,
    );
  const key = createHmac('sha256', process.env.RATE_LIMIT_SALT || 'local-testing-only')
    .update(parsed.data.email)
    .digest('hex');
  try {
    if (!(await deps.rateLimit(key)))
      return json({ error: 'Too many enquiries. Please wait before trying again.' }, 429, {
        'Retry-After': '600',
      });
    const id = await deps.save(parsed.data);
    try {
      await deps.deliver(id);
    } catch (error) {
      deps.report(error); /* lead and delivery tasks are durable; retry separately */
    }
    return json({ ok: true, reference: id, mode: deps.mode }, 201);
  } catch (error) {
    deps.report(error);
    return json(
      {
        error:
          'We could not save your enquiry. Your details are still in the form. Please try again.',
      },
      503,
    );
  }
}
