'use client';

import React from 'react';
import { Play, Heart, Shield, Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const browseLinks = [
  { label: 'Home', action: 'dashboard' },
  { label: 'Movies', action: 'dashboard' },
  { label: 'Series', action: 'dashboard' },
  { label: 'New Releases', action: 'dashboard' },
  { label: 'Top Rated', action: 'dashboard' },
];

const helpLinks = [
  { label: 'FAQ', href: '#' },
  { label: 'Contact Us', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Privacy Policy', href: '#' },
];

const connectLinks = [
  { label: 'Twitter / X', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: 'Discord', href: '#' },
  { label: 'Reddit', href: '#' },
];

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Features bar */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: Zap, label: 'Zero Latency', desc: 'Instant streaming' },
            { icon: Shield, label: 'Local & Secure', desc: 'No cloud dependency' },
            { icon: Heart, label: 'Made with Love', desc: 'Open source media center' },
          ].map((f) => (
            <div
              key={f.label}
              className="glass-card-hover glass-card glass-refraction flex items-center gap-3 p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-current)]/15">
                <f.icon className="h-4 w-4 text-[var(--accent-current)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{f.label}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main footer content */}
        <div className="glass-panel p-6 opacity-70 transition-opacity hover:opacity-90 md:p-8">
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent-current)]/20">
              <Play className="h-3.5 w-3.5 fill-[var(--accent-current)] text-[var(--accent-current)]" />
            </div>
            <span className="text-lg font-bold gradient-text">GemiFlix</span>
          </div>

          <Separator className="mb-6 bg-white/5" />

          {/* Links grid */}
          <nav className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8" aria-label="Footer navigation">
            {/* Browse column */}
            <div className="text-center sm:text-left">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
                Browse
              </h3>
              <ul className="flex flex-col gap-2">
                {browseLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href="#"
                      className="footer-link-enhanced text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help column */}
            <div className="text-center sm:text-left">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
                Help
              </h3>
              <ul className="flex flex-col gap-2">
                {helpLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="footer-link-enhanced text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect column */}
            <div className="text-center sm:text-left">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
                Connect
              </h3>
              <ul className="flex flex-col gap-2">
                {connectLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="footer-link-enhanced text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <Separator className="my-6 bg-white/5" />

          {/* Bottom bar */}
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <p className="text-xs text-white/25">
              &copy; {new Date().getFullYear()} GemiFlix. All rights reserved.
            </p>
            <p className="text-xs text-white/25">
              v2.3.0 &middot; Liquid Glass Premium &middot; Next.js 16
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
