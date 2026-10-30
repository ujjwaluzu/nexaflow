import { brand } from '@/config/brand';
export function Symbol({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="30"
      height="32"
      viewBox="0 0 30 32"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 30V2h6l14 20V2h6v28h-6L8 10v20H2Z" fill="currentColor" />
      <path d="m8 2 20 28h-6L2 2h6Z" fill="currentColor" />
    </svg>
  );
}
export function Wordmark({ className = '' }: { className?: string }) {
  if (brand.name !== 'NEXORA')
    return <span className={`wordmark-fallback ${className}`}>{brand.name}</span>;
  return (
    <svg
      className={`wordmark ${className}`}
      viewBox="0 0 178 27"
      fill="none"
      role="img"
      aria-label={brand.name}
    >
      <path
        fill="currentColor"
        d="M0 25V2h4.8l13.7 15.8V2h4.8v23h-4.7L4.8 9.1V25H0ZM31 2h20v4.3H36v5h13v4.2H36v5.2h15V25H31V2ZM57 2h5.8l6.7 8 6.7-8H82L72.4 13.2 82.6 25h-5.9l-7.2-8.5-7.2 8.5h-5.9l10.2-11.8L57 2ZM99.5 1.5c8.4 0 13.5 5 13.5 12s-5.1 12-13.5 12S86 20.5 86 13.5s5.1-12 13.5-12Zm0 4.5c-5.5 0-8.3 3-8.3 7.5s2.8 7.5 8.3 7.5 8.3-3 8.3-7.5-2.8-7.5-8.3-7.5ZM120 2h12c6.2 0 9.8 2.8 9.8 7.4 0 3.5-2 5.9-5.6 6.9l6.6 8.7h-6l-5.9-8h-6v8H120V2Zm5 4.3v6.5h6.7c3.4 0 5.1-1.1 5.1-3.3s-1.7-3.2-5.1-3.2H125ZM157 2h5.3L178 25h-5.8l-3.2-5h-18.7l-3.1 5h-5.6L157 2Zm2.7 4.8-6.8 9h13.5l-6.7-9Z"
      />
    </svg>
  );
}
