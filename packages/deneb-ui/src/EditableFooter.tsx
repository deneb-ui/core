'use client';

import React, { useState } from 'react';
import { useSiteData } from './SiteDataProvider';
import { EditableText } from './EditableText';

export interface FooterLink {
  id: string;
  label: string;
  route: string;
}

export interface EditableFooterProps extends React.HTMLAttributes<HTMLElement> {
  defaultLinks?: FooterLink[];
  links?: FooterLink[];
  basePath?: string;
  showNewsletter?: boolean;
  socialMedia?: Record<string, string>;
  whatsappUrl?: string;
  directMessageText?: string;
}

const DEFAULT_FOOTER_PAGES: FooterLink[] = [
  { id: 'home', label: 'Home', route: '/' },
  { id: 'about_us', label: 'About', route: '/about_us' },
  { id: 'services', label: 'Services', route: '/services' },
  { id: 'contact', label: 'Contact', route: '/contact' },
];

const SOCIAL_ICONS: Record<string, { label: string; icon: React.ReactNode }> = {
  twitter: {
    label: 'X (Twitter)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  x: {
    label: 'X (Twitter)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  github: {
    label: 'GitHub',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  linkedin: {
    label: 'LinkedIn',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  instagram: {
    label: 'Instagram',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  facebook: {
    label: 'Facebook',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  youtube: {
    label: 'YouTube',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.072-1.849-.434-1.464-.61-2.41-2.096-2.484-2.195-.072-.099-.6-0.798-.6-1.523 0-.726.379-1.084.514-1.231.135-.148.297-.185.396-.185.099 0 .198.002.284.006.091.004.213-.035.333.253.123.297.42 1.024.457 1.099.037.074.062.16.012.259-.049.099-.074.16-.148.247-.074.086-.156.193-.223.259-.074.074-.152.155-.065.304.086.148.384.633.824 1.024.567.505 1.045.661 1.194.735.148.074.235.062.321-.037.086-.099.37-.432.469-.58.099-.148.198-.123.333-.074.135.049.864.407 1.012.481.148.074.247.111.284.173.037.062.037.358-.107.763z" />
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.16-1.32c1.42.8 3.06 1.32 4.84 1.32 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.59 0-3.07-.46-4.32-1.26l-.31-.2-3.06.78.82-2.98-.22-.33C4.05 14.93 3.6 13.51 3.6 12c0-4.63 3.77-8.4 8.4-8.4s8.4 3.77 8.4 8.4-3.77 8.4-8.4 8.4z" />
      </svg>
    ),
  },
};

/**
 * Next-Level DENEB UI Footer
 * 
 * Features:
 * - High-end Shadcn-inspired dark aesthetic with subtle borders and ambient highlights
 * - 100% Real-Time Auto-Synchronization with Header (Logo, Website Title, Nav labels)
 * - 4-Column Responsive Layout:
 *    Col 1: Synced Brand (Logo + Site Name + Short Description + Social Icons)
 *    Col 2: Synced Explore Navigation (Routes dynamically synced with Header nav items)
 *    Col 3: Contact & Support (Direct contact shortcuts, address, email, phone)
 *    Col 4: Dynamic Footer Heading & Sleek Interactive Newsletter Card
 * - Strict Visual Editing Marker Support (`common.shortDescription`, `common.footerHeading`, `common.copyright`)
 * - Route Filtering Compliance (`data-target-page` wrappers)
 * - Tailored Tailwind CSS utility classes + resilient inline CSS fallbacks
 * 
 * Created by Chamika Gayashan & Induranga Kawishwara
 */
export function EditableFooter({
  defaultLinks = DEFAULT_FOOTER_PAGES,
  links,
  basePath = '',
  showNewsletter = true,
  className = '',
  style,
  ...props
}: EditableFooterProps) {
  const siteData = useSiteData();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const content = (siteData?.content || {}) as Record<string, any>;
  const common = (content?.common || {}) as Record<string, any>;
  const contact = (content?.contact || {}) as Record<string, any>;
  const business = (common?.business || {}) as Record<string, any>;
  const shop = (siteData?.shop || {}) as Record<string, any>;
  const shopContact = (shop?.contact || {}) as Record<string, any>;

  // Auto-synchronized with Header
  const siteName = String(common?.websiteTitle || common?.siteName || shop?.businessName || 'Storefront');
  const logoUrl = String(common?.logoUrl || shop?.logoUrl || '');
  const navLabels = (common?.navLabels || {}) as Record<string, string>;

  // Footer-specific editable fields
  const shortDescription = String(
    common?.shortDescription || 'A modern digital storefront engineered for high conversion and seamless visual editing.'
  );
  const footerHeading = String(common?.footerHeading || 'Stay Connected');
  const copyright = String(common?.copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`);

  // Contact / business values
  const phone = String(shopContact?.phone || shop?.businessPhone || business?.phone || common?.phone || contact?.phone || '');
  const emailContact = String(shopContact?.email || shop?.businessEmail || business?.email || common?.email || contact?.email || '');
  const address = String(shop?.address?.line1 || business?.location?.address || common?.address || contact?.address || '');

  // Social media mapping with live editable URL bindings
  const rawSocial = (common?.socialMedia || content?.socialMedia || props.socialMedia || {}) as Record<string, string>;
  const socialPlatforms = Object.keys(rawSocial).length > 0
    ? Object.keys(rawSocial)
    : ['twitter', 'github', 'linkedin', 'instagram'];

  // Direct message / WhatsApp action
  const directMessageLabel = String(contact?.directMessageText || common?.directMessageText || props.directMessageText || 'Send us a direct message');
  const liveWhatsapp =
    shopContact?.whatsapp ||
    shop?.businessWhatsapp ||
    shop?.whatsappNumber ||
    shop?.whatsapp;
  const rawWhatsapp = String(
    liveWhatsapp ||
    contact?.whatsapp ||
    contact?.whatsappUrl ||
    common?.whatsapp ||
    common?.whatsappNumber ||
    business?.whatsapp ||
    props.whatsappUrl ||
    phone ||
    '94771234567'
  );
  const cleanDigits = rawWhatsapp.replace(/[^\d]/g, '');
  const whatsappHref = rawWhatsapp.startsWith('http')
    ? (rawWhatsapp.includes('wa.me') && cleanDigits ? `https://wa.me/${cleanDigits}` : rawWhatsapp)
    : cleanDigits
      ? `https://wa.me/${cleanDigits}`
      : 'https://wa.me/94771234567';

  // Route filtering
  const navigationItems = links || defaultLinks;
  const requiredPages = Array.isArray(siteData?.requirements?.requiredPages)
    ? siteData.requirements.requiredPages
    : (siteData?.template?.structure?.pages as string[]) || ['home', 'contact'];

  const activeLinks = navigationItems.filter((item) =>
    item.id === 'home' || requiredPages.includes(item.id)
  );

  const hasContact = requiredPages.includes('contact');

  const basePathEnv =
    typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_BASE_PATH
      ? process.env.NEXT_PUBLIC_SITE_BASE_PATH
      : '';
  const effectiveBasePath = basePath || basePathEnv;

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      const cleanBase = effectiveBasePath.replace(/\/$/, '');
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      window.location.href = `${cleanBase}${cleanPath}` || '/';
    }
  };

  const withBase = (path: string) => {
    if (!path || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
    const cleanBase = effectiveBasePath.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}` || '/';
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: 'var(--footer-bg, var(--page-background, #020617))',
        color: 'var(--color-text, #f8fafc)',
        borderTop: '1px solid var(--color-border, rgba(255, 255, 255, 0.08))',
        padding: '4.5rem 1.5rem 2rem',
        ...style,
      }}
      className={`deneb-footer relative w-full border-t border-slate-800/80 bg-slate-950 text-slate-100 ${className}`.trim()}
      {...(props as any)}
    >
      {/* Subtle top ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.4), transparent)',
        }}
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}
        className="max-w-7xl mx-auto"
      >
        {/* 4-Column Grid Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
          className="deneb-footer-grid grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 mb-16"
        >
          {/* Column 1: Brand (Auto-Synced Logo & Title) */}
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'transparent',
                border: 0,
                padding: 0,
                cursor: 'pointer',
                textAlign: 'left',
              }}
              className="inline-flex items-center gap-3 group border-0 bg-transparent p-0 cursor-pointer"
            >
              {/* Auto-synced Logo */}
              <img
                src={withBase(logoUrl || '/placeholder.svg')}
                alt={siteName}
                data-preview-field-path="common.logoUrl"
                style={{
                  height: '32px',
                  width: 'auto',
                  maxWidth: '120px',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  filter: 'brightness(1.1)',
                }}
                className="h-8 w-auto max-w-[120px] object-contain rounded-md group-hover:scale-105 transition-transform"
              />

              {/* Auto-synced Website Title */}
              <span
                data-preview-field-path="common.websiteTitle"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: '#ffffff',
                }}
                className="text-xl font-bold tracking-tight text-white"
              >
                {siteName}
              </span>
            </button>

            {/* Editable Short Description */}
            <p
              data-preview-field-path="common.shortDescription"
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: '#94a3b8', // slate-400
                margin: 0,
                maxWidth: '320px',
              }}
              className="text-sm text-slate-400 leading-relaxed max-w-sm mt-1"
            >
              {shortDescription}
            </p>

            {/* Social Links Row (100% Live-Editable URL Bindings in Fivora) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.625rem',
                marginTop: '0.75rem',
              }}
              className="flex items-center flex-wrap gap-2.5 mt-3"
            >
              {socialPlatforms.map((platformKey) => {
                const key = platformKey.toLowerCase();
                const iconConfig = SOCIAL_ICONS[key] || {
                  label: platformKey,
                  icon: (
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                      {platformKey.slice(0, 2)}
                    </span>
                  ),
                };
                const url = rawSocial[platformKey] || rawSocial[key] || `https://${key}.com`;

                return (
                  <a
                    key={platformKey}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-preview-field-path={`common.socialMedia.${key}`}
                    aria-label={iconConfig.label}
                    title={`Edit ${iconConfig.label} URL in Fivora`}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all"
                  >
                    {iconConfig.icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Navigation Links (AUTO-SYNCED WITH HEADER NAVBAR!) */}
          <div>
            <h4
              data-preview-static="footer-explore-heading"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#f1f5f9',
                marginBottom: '1.25rem',
              }}
              className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-5"
            >
              Explore
            </h4>

            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
              className="flex flex-col gap-3"
            >
              {navigationItems.map((link) => {
                const isSelected = activeLinks.some((al) => al.id === link.id);
                // Synchronized in real-time with Header navLabels!
                const label = navLabels[link.id] || link.label;

                if (isSelected) {
                  return (
                    <li key={link.id}>
                      <span data-target-page={link.id}>
                        <button
                          type="button"
                          onClick={() => navigate(link.route)}
                          style={{
                            color: '#94a3b8',
                            fontSize: '0.875rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'transparent',
                            border: 0,
                            padding: 0,
                            cursor: 'pointer',
                            transition: 'color 0.15s ease',
                          }}
                          className="text-sm text-slate-400 hover:text-white transition-colors duration-150 inline-flex items-center gap-2 group cursor-pointer border-0 bg-transparent p-0"
                        >
                          <span
                            data-preview-static="nav-bullet"
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '9999px',
                              backgroundColor: '#475569',
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-400 group-hover:scale-125 transition-all duration-200"
                          />
                          <span data-preview-field-path={`common.navLabels.${link.id}`}>{label}</span>
                        </button>
                      </span>
                    </li>
                  );
                }

                // Unselected route marker fallback (visible for strict schema coverage without route link)
                return (
                  <li key={link.id} className="unavailable">
                    <span data-target-page={link.id}>
                      <span data-preview-field-path={`common.navLabels.${link.id}`}>{label}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div>
            <h4
              data-preview-static="footer-contact-heading"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#f1f5f9',
                marginBottom: '1.25rem',
              }}
              className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-5"
            >
              Contact & Support
            </h4>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                fontSize: '0.875rem',
                color: '#94a3b8',
              }}
              className="flex flex-col gap-3.5 text-sm text-slate-400"
            >
              {emailContact && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a href={`mailto:${emailContact}`} data-preview-field-path="contact.email" className="hover:text-white transition-colors" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {emailContact}
                  </a>
                </div>
              )}

              {phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href={`tel:${phone}`} data-preview-field-path="contact.phone" className="hover:text-white transition-colors" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {phone}
                  </a>
                </div>
              )}

              {address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 mt-0.5">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span data-preview-field-path="contact.address">{address}</span>
                </div>
              )}

              {hasContact && (
                <div style={{ marginTop: '0.5rem' }}>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-preview-field-path="contact.whatsapp"
                    aria-label="Direct message on WhatsApp"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#34d399', // emerald-400
                      background: 'transparent',
                      border: 0,
                      padding: 0,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors border-0 bg-transparent p-0 cursor-pointer"
                  >
                    {/* WhatsApp Icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.072-1.849-.434-1.464-.61-2.41-2.096-2.484-2.195-.072-.099-.6-0.798-.6-1.523 0-.726.379-1.084.514-1.231.135-.148.297-.185.396-.185.099 0 .198.002.284.006.091.004.213-.035.333.253.123.297.42 1.024.457 1.099.037.074.062.16.012.259-.049.099-.074.16-.148.247-.074.086-.156.193-.223.259-.074.074-.152.155-.065.304.086.148.384.633.824 1.024.567.505 1.045.661 1.194.735.148.074.235.062.321-.037.086-.099.37-.432.469-.58.099-.148.198-.123.333-.074.135.049.864.407 1.012.481.148.074.247.111.284.173.037.062.037.358-.107.763z" />
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.16-1.32c1.42.8 3.06 1.32 4.84 1.32 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.59 0-3.07-.46-4.32-1.26l-.31-.2-3.06.78.82-2.98-.22-.33C4.05 14.93 3.6 13.51 3.6 12c0-4.63 3.77-8.4 8.4-8.4s8.4 3.77 8.4 8.4-3.77 8.4-8.4 8.4z" />
                    </svg>
                    <EditableText
                      as="span"
                      id="contact.directMessageText"
                      defaultValue={directMessageLabel}
                      style={{ color: 'inherit', fontWeight: 600 }}
                    />
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Footer Heading & Newsletter Subscription (Shadcn style) */}
          <div>
            <h4
              data-preview-field-path="common.footerHeading"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#f1f5f9',
                marginBottom: '1rem',
              }}
              className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4"
            >
              {footerHeading}
            </h4>

            {showNewsletter && (
              <div className="flex flex-col gap-3">
                <p
                  data-preview-static="newsletter-description"
                  style={{
                    fontSize: '0.8125rem',
                    color: '#94a3b8',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                  className="text-xs text-slate-400 leading-relaxed"
                >
                  Join our exclusive community for releases, updates, and special perks.
                </p>

                {subscribed ? (
                  <p
                    data-preview-static="newsletter-success"
                    style={{
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(34, 197, 94, 0.12)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#4ade80',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                    }}
                    className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium"
                  >
                    ✓ Thank you for subscribing!
                  </p>
                ) : (
                  <form
                    onSubmit={handleSubscribe}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                    className="flex flex-col gap-2"
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      <input
                        type="email"
                        required
                        data-preview-static="newsletter-input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: '#0f172a', // slate-900
                          border: '1px solid #1e293b', // slate-800
                          borderRadius: '8px',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.8125rem',
                          color: '#ffffff',
                          outline: 'none',
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      data-preview-static="newsletter-btn"
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.875rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      className="bg-white text-slate-900 hover:bg-slate-200 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Subscribe
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
          className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400"
        >
          {/* Copyright text */}
          <p
            data-preview-field-path="common.copyright"
            style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}
            className="text-xs text-slate-500"
          >
            {copyright}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Powered by Fivora Badge (Strictly uneditable) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                color: '#64748b',
              }}
              className="flex items-center gap-1.5 text-xs text-slate-500"
            >
              <span data-preview-static="powered-by-label">Powered by</span>
              <span
                data-preview-static="powered-by-brand"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px',
                  letterSpacing: '0.025em',
                }}
                className="inline-flex items-center gap-1 font-semibold text-slate-200 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md text-xs shadow-inner"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-400">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Fivora
              </span>
            </div>

            {/* Back to top button */}
            <button
              type="button"
              data-preview-static="back-to-top"
              onClick={scrollToTop}
              aria-label="Back to top"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                color: '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const Footer = EditableFooter;
