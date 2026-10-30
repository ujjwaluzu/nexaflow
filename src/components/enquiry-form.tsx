'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, LoaderCircle } from 'lucide-react';
import {
  budgetOptions,
  enquirySchema,
  serviceOptions,
  timelineOptions,
} from '@/lib/validation/enquiry';
type FieldErrors = Record<string, string[] | undefined>;
export function EnquiryForm({
  mode,
  initialService,
}: {
  mode: 'local' | 'production' | 'unconfigured';
  initialService?: string;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  const [currency, setCurrency] = useState<keyof typeof budgetOptions>('Unsure');
  const form = useRef<HTMLFormElement>(null);
  const id = useRef('');
  const router = useRouter();
  const error = (name: string) => errors[name]?.[0];
  const props = (name: string) => ({
    'aria-invalid': Boolean(error(name)),
    'aria-describedby': error(name) ? `${name}-error` : undefined,
  });
  const message = (name: string) =>
    error(name) ? (
      <p className="field-error" id={`${name}-error`}>
        {error(name)}
      </p>
    ) : null;
  const focusError = (fields: FieldErrors) => {
    requestAnimationFrame(() => {
      const first = Object.keys(fields)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    });
  };
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setStatus('');
    setErrors({});
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (!id.current) id.current = crypto.randomUUID();
    const result = enquirySchema.safeParse({
      ...data,
      id: id.current,
      consent: data.consent === 'on',
    });
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      setErrors(fields);
      focusError(fields);
      return;
    }
    setPending(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const body = await response.json();
      if (!response.ok) {
        if (body.fields) {
          setErrors(body.fields);
          focusError(body.fields);
        }
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      router.push(
        `/thank-you?reference=${encodeURIComponent(body.reference)}${body.mode === 'local' ? '&mode=local' : ''}`,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to send. Please try again.');
      setPending(false);
    }
  }
  return (
    <form ref={form} className="enquiry-form" onSubmit={submit} noValidate aria-busy={pending}>
      {mode === 'local' && (
        <p className="form-note">
          <strong>Local testing mode.</strong> Submissions are saved on this development machine.
          Emails are simulated; no enquiry is sent to a live studio inbox.
        </p>
      )}
      {mode === 'unconfigured' && (
        <p className="form-note">
          The studio has not enabled live enquiries yet. Submission will be available once the
          secure delivery connection is configured.
        </p>
      )}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="honeypot">Leave this field empty</label>
        <input id="honeypot" name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">
            Full name <span>(required)</span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            maxLength={100}
            required
            {...props('name')}
          />
          {message('name')}
        </div>
        <div className="field">
          <label htmlFor="email">
            Email <span>(required)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            maxLength={254}
            required
            {...props('email')}
          />
          {message('email')}
        </div>
        <div className="field">
          <label htmlFor="company">
            Company name <span>(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            placeholder="Your company"
            maxLength={150}
            {...props('company')}
          />
          {message('company')}
        </div>
        <div className="field">
          <label htmlFor="country">
            Country <span>(required)</span>
          </label>
          <input
            id="country"
            name="country"
            autoComplete="country-name"
            placeholder="Where you’re based"
            maxLength={80}
            required
            {...props('country')}
          />
          {message('country')}
        </div>
        <div className="field field-wide">
          <label htmlFor="service">
            What can we help with? <span>(required)</span>
          </label>
          <select
            id="service"
            name="service"
            defaultValue={
              serviceOptions.includes(initialService as (typeof serviceOptions)[number])
                ? initialService
                : ''
            }
            required
            {...props('service')}
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          {message('service')}
        </div>
        <div className="field field-wide">
          <label htmlFor="description">
            Tell us about your project <span>(required)</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="What are you trying to achieve? What’s getting in the way? Share the context, even if the idea is still taking shape."
            minLength={30}
            maxLength={5000}
            required
            {...props('description')}
          />
          {message('description')}
        </div>
        <div className="field field-wide">
          <div className="field-label">
            Approximate budget <span className="muted">(required)</span>
          </div>
          <div className="budget-controls">
            <select
              aria-label="Budget currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value as keyof typeof budgetOptions)}
            >
              {Object.keys(budgetOptions).map((option) => (
                <option key={option} value={option}>
                  {option === 'Other'
                    ? 'Other currency'
                    : option === 'Unsure'
                      ? 'Not sure'
                      : option}
                </option>
              ))}
            </select>
            <div>
              <label className="sr-only" htmlFor="budget">
                Budget range
              </label>
              <select
                id="budget"
                name="budget"
                key={currency}
                defaultValue={`${currency}: ${budgetOptions[currency][0]}`}
                {...props('budget')}
              >
                {budgetOptions[currency].map((option) => (
                  <option key={option} value={`${currency}: ${option}`}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {message('budget')}
          <p className="small muted" style={{ marginTop: 8, fontSize: 11 }}>
            A planning range, not a quote. Choose another currency or “Not sure” if that fits
            better.
          </p>
        </div>
        <div className="field">
          <label htmlFor="timeline">
            Expected timeline <span>(required)</span>
          </label>
          <select id="timeline" name="timeline" defaultValue="" required {...props('timeline')}>
            <option disabled value="">
              Select a timeline
            </option>
            {timelineOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          {message('timeline')}
        </div>
        <div className="field">
          <label htmlFor="website_url">
            Existing website <span>(optional)</span>
          </label>
          <input
            id="website_url"
            name="website_url"
            type="url"
            autoComplete="url"
            placeholder="https://"
            maxLength={2048}
            {...props('website_url')}
          />
          {message('website_url')}
        </div>
      </div>
      <div className="consent-field">
        <input type="checkbox" name="consent" id="consent" required {...props('consent')} />
        <label htmlFor="consent">
          I agree that my details may be used to respond to this enquiry as described in the{' '}
          <Link href="/privacy">privacy notice</Link>. Please don’t include passwords or sensitive
          personal information.
        </label>
      </div>
      {message('consent')}
      <div aria-live="polite" aria-atomic="true">
        {status && (
          <p className="form-status" role="alert">
            {status}
          </p>
        )}
      </div>
      <div className="form-actions">
        <button
          className="button button-primary"
          type="submit"
          disabled={pending || mode === 'unconfigured'}
        >
          {pending ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Saving your enquiry…
            </>
          ) : (
            <>
              Send project enquiry
              <ArrowUpRight size={18} />
            </>
          )}
        </button>
        <p>No obligation. Just a starting point.</p>
      </div>
    </form>
  );
}
