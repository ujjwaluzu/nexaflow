import 'server-only';
import type { Enquiry } from '@/lib/validation/enquiry';
export async function saveLocal(input: Enquiry) {
  // Development only. Dynamic import keeps filesystem operations out of live delivery.
  const { mkdir, writeFile } = await import('node:fs/promises');
  const directory = `${process.cwd()}/.local/enquiries`;
  await mkdir(directory, { recursive: true });
  const { honeypot: discarded, ...lead } = input;
  void discarded;
  try {
    await writeFile(
      `${directory}/${input.id}.json`,
      JSON.stringify(
        {
          lead,
          mode: 'local',
          created_at: new Date().toISOString(),
          deliveries: [
            { kind: 'client_email', status: 'simulated' },
            { kind: 'founder_email', status: 'simulated' },
            { kind: 'crm', status: 'not_contacted' },
          ],
        },
        null,
        2,
      ),
      { flag: 'wx' },
    );
  } catch (error) {
    if (!(error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST'))
      throw error;
  }
  return input.id;
}
