'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import Script from 'next/script';
type Consent = 'accepted' | 'declined' | null;
const key = 'analytics-consent-v1';
const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  window.addEventListener('analytics-consent-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('analytics-consent-change', callback);
  };
};
const snapshot = (): Consent => {
  try {
    const saved = localStorage.getItem(key);
    return saved === 'accepted' || saved === 'declined' ? saved : null;
  } catch {
    return null;
  }
};
const serverSnapshot = () => null;
const readySnapshot = () => true;
const serverReadySnapshot = () => false;
export function CookieSettingsButton() {
  return process.env.NEXT_PUBLIC_GA_ID ? (
    <button
      className="cookie-settings"
      onClick={() => window.dispatchEvent(new Event('open-privacy-settings'))}
    >
      Cookie settings
    </button>
  ) : null;
}
export function PrivacyControls() {
  const consent = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const ready = useSyncExternalStore(subscribe, readySnapshot, serverReadySnapshot);
  const [open, setOpen] = useState(false);
  const id = process.env.NEXT_PUBLIC_GA_ID;
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener('open-privacy-settings', show);
    return () => window.removeEventListener('open-privacy-settings', show);
  }, []);
  const choose = (value: Exclude<Consent, null>) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
    window.dispatchEvent(new Event('analytics-consent-change'));
    setOpen(false);
    if (consent === 'accepted' && value === 'declined') {
      document.cookie.split(';').forEach((part) => {
        const name = part.trim().split('=')[0];
        if (name.startsWith('_ga')) {
          for (const domain of [
            '',
            `; domain=${location.hostname}`,
            `; domain=.${location.hostname.split('.').slice(-2).join('.')}`,
          ])
            document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
        }
      });
      window.location.reload();
    }
  };
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  return (
    <>
      {consent === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
            strategy="afterInteractive"
          />
          <Script
            id="analytics"
            strategy="afterInteractive"
          >{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(id)},{anonymize_ip:true});`}</Script>
        </>
      )}
      {(open || (ready && consent === null)) && (
        <aside className="consent-banner" aria-label="Analytics preferences">
          <p>
            Allow optional analytics to help us understand how this website is used? Your enquiry
            works either way.
          </p>
          <div>
            <button className="button button-primary" onClick={() => choose('accepted')}>
              Allow analytics
            </button>
            <button className="button button-secondary" onClick={() => choose('declined')}>
              Decline
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
