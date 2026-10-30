import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { brand } from '@/config/brand';
import { services } from '@/data/services';
import { Wordmark } from './brand';
import { CookieSettingsButton } from './privacy-controls';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" aria-label={`${brand.name} home`}>
              <Wordmark />
            </Link>
            <p>{brand.description}</p>
            <span className="mono">
              Independent by design.
              <br />
              Connected by engineering.
            </span>
          </div>
          <div>
            <h2>Capabilities</h2>
            {services.map((service) => (
              <Link href={`/services/${service.slug}`} key={service.slug}>
                {service.name}
              </Link>
            ))}
          </div>
          <div>
            <h2>Studio</h2>
            {[
              { label: 'Our approach', href: '/about' },
              { label: 'Selected work', href: '/work' },
              { label: 'How we work', href: '/process' },
              { label: 'Insights', href: '/insights' },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <h2>Let’s talk</h2>
            <Link href="/contact">
              Start a project <ArrowUpRight size={14} />
            </Link>
            {brand.email && <a href={`mailto:${brand.email}`}>{brand.email}</a>}
            {brand.socialLinks.map((link) => (
              <a key={link.url} href={link.url} rel="noopener noreferrer" target="_blank">
                {link.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
            <p className="small muted">
              Based on clear thinking.
              <br />
              Built for what comes next.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {brand.copyrightYear} {brand.name}
          </span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <CookieSettingsButton />
          </div>
          <span className="footer-tagline">{brand.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
