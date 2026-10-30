'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Wordmark } from './brand';
import { brand } from '@/config/brand';
import { site } from '@/config/site';
export function Navigation() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === 'Tab') {
        const links = panel.current?.querySelectorAll<HTMLAnchorElement>('a');
        const last = links?.[links.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          toggle.current?.focus();
        } else if (event.shiftKey && document.activeElement === toggle.current) {
          event.preventDefault();
          last?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 900px)');
    const close = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, []);
  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link
          href="/"
          className="brand-link"
          aria-label={`${brand.name} home`}
          onClick={() => setOpen(false)}
        >
          <Wordmark />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {site.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={path.startsWith(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="nav-cta">
          Start a project <ArrowUpRight size={16} />
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div id="mobile-navigation" className="mobile-nav" ref={panel} hidden={!open}>
        <nav className="shell" aria-label="Mobile navigation">
          {site.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={path.startsWith(item.href) ? 'page' : undefined}
            >
              {item.label}
              <ArrowUpRight size={20} />
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}>
            Start a project
            <ArrowUpRight size={20} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
