import { z } from 'zod';
export const serviceOptions = [
  'Web Engineering',
  'Software Engineering',
  'AI & Automation',
  'Digital Infrastructure',
  'Multiple services',
  'Not sure yet',
] as const;
export const timelineOptions = [
  'As soon as practical',
  'Within 1–3 months',
  'Within 3–6 months',
  'Exploring options',
] as const;
export const budgetOptions = {
  INR: ['Under ₹50,000', '₹50,000–₹1,50,000', '₹1,50,000–₹5,00,000', '₹5,00,000+'],
  USD: ['Under $1,000', '$1,000–$3,000', '$3,000–$10,000', '$10,000+'],
  Other: ['I’ll share my currency and range in the description'],
  Unsure: ['Not sure yet'],
} as const;
export const budgets = Object.entries(budgetOptions).flatMap(([currency, ranges]) =>
  ranges.map((range) => `${currency}: ${range}`),
);
const text = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} needs at least ${min} characters.`)
    .max(max, `${label} must be under ${max} characters.`)
    .refine(
      (value) => !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value),
      'Please remove unsupported control characters.',
    );
export const enquirySchema = z
  .object({
    id: z.uuid(),
    name: text(2, 100, 'Your name'),
    email: z
      .email('Enter a valid email address.')
      .max(254)
      .transform((value) => value.toLowerCase()),
    company: z.string().trim().max(150, 'Company name must be under 150 characters.').default(''),
    country: text(2, 80, 'Country'),
    service: z.enum(serviceOptions, { error: 'Choose a service.' }),
    description: text(30, 5000, 'Project description'),
    budget: z.string().refine((value) => budgets.includes(value), 'Choose a budget range.'),
    timeline: z.enum(timelineOptions, { error: 'Choose an expected timeline.' }),
    website_url: z
      .union([
        z.literal(''),
        z
          .url()
          .max(2048)
          .refine(
            (value) => ['http:', 'https:'].includes(new URL(value).protocol),
            'Use an http or https URL.',
          ),
      ])
      .default(''),
    consent: z.literal(true, {
      error: 'Please confirm that we may use this information to respond.',
    }),
    honeypot: z.string().max(0, 'Unable to accept this submission.').default(''),
  })
  .strict();
export type Enquiry = z.infer<typeof enquirySchema>;
