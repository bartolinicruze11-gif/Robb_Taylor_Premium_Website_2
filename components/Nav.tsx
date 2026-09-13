'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ArrowRight, ChevronDown } from 'lucide-react';
import RobbTaylorLogo from './RobbTaylorLogo';

const serviceLinks = [
  { href: '/services/civil-construction', label: 'Civil Construction' },
  { href: '/services/retaining-piling', label: 'Retaining & Piling Works' },
  { href: '/services/earthworks', label: 'Earthworks & Pavements' },

  { href: '/services/trenching', label: 'Trenching' },
];

const topLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setServicesOpen(false); }, [pathname]);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  const isServicesActive = pathname.startsWith('/services');

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-black/98 backdrop-blur-md border-b border-white/[0.08]'
          : 'bg-black/90 backdrop-blur-sm'
      }`}>
        <div className="w-full">
          <div className="flex items-center justify-between h-16 lg:h-48">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 self-stretch flex items-stretch">
              <RobbTaylorLogo variant="nav" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center pr-8">

              <Link
                href="/"
                className={`relative px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-150 ${
                  pathname === '/' ? 'text-white' : 'text-[#7a95ae] hover:text-white'
                }`}
              >
                Home
                {pathname === '/' && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-blue-500" />
                )}
              </Link>

              {/* Services dropdown */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`relative flex items-center gap-1.5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-150 ${
                    isServicesActive ? 'text-white' : 'text-[#7a95ae] hover:text-white'
                  }`}
                >
                  Services
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                  {isServicesActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-blue-500" />
                  )}
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-[#040f1e] border border-white/[0.07] shadow-2xl"
                    >
                      <div className="py-2">
                        <Link
                          href="/services"
                          className="block px-5 py-2.5 text-[11px] font-bold tracking-[0.18em] uppercase text-[#3d5668] hover:text-white hover:bg-white/[0.04] transition-colors border-b border-white/[0.05] mb-1"
                        >
                          All Services
                        </Link>
                        {serviceLinks.map(s => (
                          <Link
                            key={s.href}
                            href={s.href}
                            className={`block px-5 py-2.5 text-[12px] font-medium transition-colors hover:bg-white/[0.04] ${
                              pathname === s.href ? 'text-blue-400' : 'text-[#7a95ae] hover:text-white'
                            }`}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {topLinks.slice(1).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-150 ${
                      isActive ? 'text-white' : 'text-[#7a95ae] hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-px bg-blue-500" />
                    )}
                  </Link>
                );
              })}

              <div className="w-px h-4 bg-white/[0.08] mx-4" />

              <a
                href="tel:+64210274447"
                className="flex items-center gap-2 text-[#7a95ae] hover:text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-colors px-4 py-2"
              >
                <Phone className="w-3 h-3" />
                +64 21 027 4447
              </a>

              <Link
                href="/contact"
                className="ml-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-150"
              >
                Get a Quote
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-[#7a95ae] hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 left-0 right-0 z-[99] bg-[#020c18] border-b border-white/[0.06] lg:hidden overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-0.5">
              <Link
                href="/"
                className={`text-sm font-bold uppercase tracking-[0.18em] py-3.5 border-b border-white/[0.04] transition-colors ${pathname === '/' ? 'text-white' : 'text-[#7a95ae]'}`}
              >
                Home
              </Link>

              {/* Mobile services accordion */}
              <div className="border-b border-white/[0.04]">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className={`w-full flex items-center justify-between text-sm font-bold uppercase tracking-[0.18em] py-3.5 transition-colors ${isServicesActive ? 'text-white' : 'text-[#7a95ae]'}`}
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-3 flex flex-col gap-0.5">
                        <Link href="/services" className="text-sm font-semibold text-[#5a7a8e] py-2 pl-4 hover:text-white transition-colors">
                          All Services
                        </Link>
                        {serviceLinks.map(s => (
                          <Link
                            key={s.href}
                            href={s.href}
                            className={`text-sm py-2 pl-4 transition-colors ${pathname === s.href ? 'text-blue-400 font-semibold' : 'text-[#5a7a8e] hover:text-white'}`}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/about" className={`text-sm font-bold uppercase tracking-[0.18em] py-3.5 border-b border-white/[0.04] transition-colors ${pathname === '/about' ? 'text-white' : 'text-[#7a95ae]'}`}>About</Link>
              <Link href="/contact" className={`text-sm font-bold uppercase tracking-[0.18em] py-3.5 border-b border-white/[0.04] transition-colors ${pathname === '/contact' ? 'text-white' : 'text-[#7a95ae]'}`}>Contact</Link>

              <div className="flex flex-col gap-3 pt-5">
                <a
                  href="tel:+64210274447"
                  className="flex items-center justify-center gap-2 border border-white/[0.08] text-white text-sm font-bold tracking-widest uppercase py-3.5"
                >
                  <Phone className="w-4 h-4 text-blue-500" />
                  +64 21 027 4447
                </a>
                <Link
                  href="/contact"
                  className="bg-blue-600 hover:bg-blue-500 text-white py-3.5 text-sm font-bold uppercase tracking-wider text-center transition-colors"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
