'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Wordmark } from './brand';
import { brand } from '@/config/brand';
import { site } from '@/config/site';
import { services } from '@/data/services';
import { industries } from '@/data/industries';

const menuContent: Record<string, { eyebrow: string; description: string; links: { label: string; href: string }[] }> = {
  '/services': {
    eyebrow: 'What we do',
    description: 'Thoughtful engineering for better digital experiences and smoother operations.',
    links: services.map(({ name, slug }) => ({ label: name, href: `/services/${slug}` })),
  },
  '/industries': {
    eyebrow: 'Who we work with',
    description: 'Digital systems shaped around the realities of your business and sector.',
    links: industries.map(({ name, slug }) => ({ label: name, href: `/industries/${slug}` })),
  },
  '/work': {
    eyebrow: 'Selected work',
    description: 'A closer look at the decisions, craft and engineering behind each project.',
    links: [{ label: 'Studio website', href: '/work/studio-website' }],
  },
  '/about': {
    eyebrow: 'The studio',
    description: 'An independent engineering studio built around clear thinking and considered delivery.',
    links: [
      { label: 'About Nexora', href: '/about' },
      { label: 'How we work', href: '/process' },
    ],
  },
  '/insights': {
    eyebrow: 'Notes & ideas',
    description: 'Practical thinking on software, automation and dependable digital systems.',
    links: [
      { label: 'Automate the handoff, not the whole business.', href: '/insights/automate-the-handoff' },
      { label: 'What belongs in a useful MVP?', href: '/insights/scope-a-useful-mvp' },
      { label: 'The form is only the beginning.', href: '/insights/reliable-enquiry-forms' },
    ],
  },
};

export function Navigation() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeItem = site.navigation.find((item) => item.href === activeHref);
  const activeContent = activeHref ? menuContent[activeHref] : null;

  const cancelScheduledClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelScheduledClose();
    closeTimer.current = setTimeout(() => setActiveHref(null), 240);
  };
  const closeMenu = () => {
    cancelScheduledClose();
    setActiveHref(null);
    setOpen(false);
  };

  useEffect(() => {
    if (!activeHref) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveHref(null);
        header.current?.querySelector<HTMLButtonElement>('.nav-menu-trigger.is-active')?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setActiveHref(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [activeHref]);

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
      else setActiveHref(null);
    };
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, []);

  return (
    <header className="site-header" ref={header} onMouseEnter={cancelScheduledClose} onMouseLeave={scheduleClose}>
      <div className="shell nav-shell">
        <Link href="/" className="brand-link" aria-label={`${brand.name} home`} onClick={closeMenu}>
          <Wordmark />
        </Link>
        <nav className="nav-menu" aria-label="Main navigation">
          {site.navigation.map((item) => {
            const selected = activeHref === item.href;
            return (
              <button
                key={item.href}
                type="button"
                className={`nav-menu-trigger${selected ? ' is-active' : ''}`}
                aria-expanded={selected}
                aria-controls="nav-mega-panel"
                aria-current={path === item.href || path.startsWith(`${item.href}/`) ? 'page' : undefined}
                onMouseEnter={() => setActiveHref(item.href)}
                onFocus={() => setActiveHref(item.href)}
                onClick={() => {
                  if (window.matchMedia('(hover: none)').matches && selected) setActiveHref(null);
                  else setActiveHref(item.href);
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
        <Link href="/contact" className="nav-cta" onClick={closeMenu}>
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
      <div
        id="nav-mega-panel"
        className={`nav-mega-panel${activeContent ? ' is-open' : ''}`}
        aria-label={activeItem ? `${activeItem.label} navigation` : undefined}
        aria-hidden={!activeContent}
        inert={!activeContent}
      >
        <div className="nav-mega-reveal">
          {activeItem && activeContent && (
            <div className="nav-mega-content">
              <div className="nav-mega-intro">
                <span className="nav-mega-eyebrow">{activeContent.eyebrow}</span>
                <h2>{activeItem.label}</h2>
                <p>{activeContent.description}</p>
                <Link href={activeItem.href} className="nav-mega-all" onClick={closeMenu}>
                  Explore {activeItem.label} <ArrowUpRight size={15} />
                </Link>
              </div>
              <nav className="nav-mega-links" aria-label={`${activeItem.label} links`}>
                {activeContent.links.map((link) => (
                  <Link href={link.href} key={link.href} onClick={closeMenu}>
                    {link.label}<ArrowUpRight size={15} />
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
      <div id="mobile-navigation" className="mobile-nav" ref={panel} hidden={!open}>
        <nav className="shell" aria-label="Mobile navigation">
          {site.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              aria-current={path === item.href || path.startsWith(`${item.href}/`) ? 'page' : undefined}
            >
              {item.label}
              <ArrowUpRight size={20} />
            </Link>
          ))}
          <Link href="/contact" onClick={closeMenu}>
            Start a project
            <ArrowUpRight size={20} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
