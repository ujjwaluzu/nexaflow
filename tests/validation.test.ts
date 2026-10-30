import { describe, it, expect } from 'vitest';
import { enquirySchema, budgetOptions } from '@/lib/validation/enquiry';
export const validEnquiry = {
  id: 'cf9277fc-947a-4c76-8ded-c9180140a589',
  name: 'Test Founder',
  email: 'founder@example.test',
  company: 'Test business',
  country: 'India',
  service: 'Web Engineering',
  description:
    'We need a clear business website connected to our existing customer enquiry workflow.',
  budget: 'Unsure: Not sure yet',
  timeline: 'Exploring options',
  website_url: '',
  consent: true,
  honeypot: '',
};
describe('enquiry validation', () => {
  it('accepts international country names and normalises email', () => {
    expect(enquirySchema.parse({ ...validEnquiry, email: 'FOUNDER@example.test' }).email).toBe(
      'founder@example.test',
    );
    expect(enquirySchema.safeParse({ ...validEnquiry, country: '日本' }).success).toBe(true);
  });
  it.each(['name', 'email', 'country', 'service', 'description', 'timeline'])(
    'rejects missing %s',
    (field) => {
      expect(enquirySchema.safeParse({ ...validEnquiry, [field]: '' }).success).toBe(false);
    },
  );
  it('rejects unsupported protocols, missing consent and bot input', () => {
    for (const change of [
      { website_url: 'javascript:alert(1)' },
      { website_url: 'ftp://example.test' },
      { consent: false },
      { honeypot: 'bot' },
      { description: 'x'.repeat(5001) },
      { email: 'invalid' },
      { id: 'not-a-uuid' },
    ])
      expect(enquirySchema.safeParse({ ...validEnquiry, ...change }).success).toBe(false);
  });
  it('accepts every configured currency range without assuming USD', () => {
    for (const [currency, ranges] of Object.entries(budgetOptions))
      for (const range of ranges)
        expect(
          enquirySchema.safeParse({ ...validEnquiry, budget: `${currency}: ${range}` }).success,
        ).toBe(true);
  });
  it('rejects unrecognised fields and unlisted budgets', () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, status: 'qualified' }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...validEnquiry, budget: 'free' }).success).toBe(false);
  });
});
