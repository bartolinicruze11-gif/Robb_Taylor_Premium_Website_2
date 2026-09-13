'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import RobbTaylorLogo from './RobbTaylorLogo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

const services = [
  { label: 'Civil Construction', href: '/services/civil-construction' },
  { label: 'Retaining & Piling Works', href: '/services/retaining-piling' },
  { label: 'Earthworks & Pavements', href: '/services/earthworks' },
  { label: 'Trenching', href: '/services/trenching' },
];

export default function Footer() {
  return (
    <footer className="bg-[#010a14] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-14 border-b border-white/[0.05]">

          {/* Brand column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block mb-7">
              <RobbTaylorLogo variant="footer" />
            </Link>

            <p className="text-[#4a6070] text-sm leading-relaxed mb-8 max-w-xs">
              Civil infrastructure specialists across the Lower North Island. Earthworks & pavements, retaining & piling, and civil construction.
            </p>

            <div className="flex flex-col gap-3">
              <a href="tel:+64210274447" className="flex items-center gap-3 text-[#5a7a8e] hover:text-blue-400 transition-colors text-sm group">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                +64 21 027 4447
              </a>
              <a href="mailto:Rene@RobbTaylor.co.nz" className="flex items-center gap-3 text-[#5a7a8e] hover:text-blue-400 transition-colors text-sm group">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                Rene@RobbTaylor.co.nz
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-3.5 h-3.5 text-[#3d5668] mt-0.5 flex-shrink-0" />
                <p className="text-[#3d5668] text-sm">Lower North Island, New Zealand</p>
              </div>
            </div>

          </div>

          {/* Quick links */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="text-white text-[10px] font-bold tracking-[0.25em] uppercase mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {navLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-1.5 text-[#4a6070] hover:text-white text-sm transition-colors group">
                    {l.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="text-white text-[10px] font-bold tracking-[0.25em] uppercase mb-6">Services</h4>
            <ul className="flex flex-col gap-3">
              {services.map(s => (
                <li key={s.label}>
                  <Link href={s.href} className="text-[#4a6070] hover:text-white text-sm transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#2d4455] text-[11px] font-medium tracking-[0.12em] uppercase" suppressHydrationWarning>
            © {new Date().getFullYear()} Robb &amp; Taylor Contracting Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[#2d4455] hover:text-[#5a7a8e] text-[11px] tracking-[0.1em] uppercase transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[#2d4455] hover:text-[#5a7a8e] text-[11px] tracking-[0.1em] uppercase transition-colors">Terms</Link>
            <span className="text-[#1e2f3a] text-[11px] font-semibold tracking-[0.15em] uppercase">Lower North Island, NZ</span>
          </div>
        </div>

        {/* Developer credit */}
        <div className="pt-5 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#1e3040] text-[10px] tracking-[0.1em]">
            Website designed &amp; developed by{' '}
            <a
              href="mailto:bartolinicruze11@gmail.com"
              className="text-[#2a4255] hover:text-[#4a6478] transition-colors"
            >
              Cruze Bartolini
            </a>
          </p>
          <a
            href="mailto:bartolinicruze11@gmail.com"
            className="text-[#1a2d3d] hover:text-[#3d5668] text-[10px] tracking-[0.08em] transition-colors italic"
          >
            Need a website like this? — bartolinicruze11@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
