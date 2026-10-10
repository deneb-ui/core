'use client';

import React, { useState } from 'react';
import { useSiteData } from './SiteDataProvider';

export interface NavLinkItem {
  id: string;
  label: string;
  route: string;
}

export interface EditableNavbarProps extends React.HTMLAttributes<HTMLElement> {
  defaultLinks?: NavLinkItem[];
  sticky?: boolean;
  activeRoute?: string;
  basePath?: string;
  showSearch?: boolean;
  searchFieldPath?: string;
  searchLabel?: string;
  onSearchClick?: () => void;
  searchUrl?: string;
  showCart?: boolean;
  cartCount?: number;
  onCartClick?: () => void;
  showWishlist?: boolean;
  wishlistCount?: number;
  onWishlistClick?: () => void;
}

const DEFAULT_PAGES: NavLinkItem[] = [
  { id: 'home', label: 'Home', route: '/' },
  { id: 'about_us', label: 'About', route: '/about_us' },
  { id: 'services', label: 'Services', route: '/services' },
  { id: 'contact', label: 'Contact', route: '/contact' },
];

/**
 * Next-Level DENEB UI Navbar / Header
 * 
 * Features:
 * - High-end Shadcn glassmorphism design (backdrop-blur-md)
 * - Automatic real-time state synchronization with Footer (Logo, Title, Nav labels)
 * - Strict visual editing compliance (`common.logoUrl`, `common.websiteTitle`, `common.navLabels.*`, `common.headerCtaLabel`)
 * - Selected-page filtering (`data-target-page`)
 * - Responsive mobile toggle and drawer menu
 * - Tailwind CSS classes + resilient inline CSS fallbacks
 * 
 * Created by Chamika Gayashan & Induranga Kawishwara
 */
export function EditableNavbar({
  defaultLinks = DEFAULT_PAGES,
  sticky = true,
  activeRoute,
  basePath = "",
  showSearch = true,
  searchFieldPath = "common.header.searchFramesLabel",
  searchLabel: customSearchLabel,
  onSearchClick,
  searchUrl = "/shop",
  showCart = false,
  cartCount,
  onCartClick,
  showWishlist = false,
  wishlistCount,
  onWishlistClick,
  className = "",
  style,
  ...props
}: EditableNavbarProps) {
  const siteData = useSiteData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const content = (siteData?.content || {}) as Record<string, any>;
  const common = (content?.common || {}) as Record<string, any>;
  const shop = (siteData?.shop || {}) as Record<string, any>;

  const siteName = String(common?.websiteTitle || common?.siteName || shop?.businessName || 'Storefront');
  const logoUrl = String(common?.logoUrl || shop?.logoUrl || '');
  const headerCtaLabel = String(common?.headerCtaLabel || 'Get in Touch');
  const navLabels = (common?.navLabels || {}) as Record<string, string>;
  const searchLabel = String(
    customSearchLabel ||
    common?.header?.searchFramesLabel ||
    common?.searchFramesLabel ||
    common?.searchPlaceholder ||
    "Search frames"
  );

  const requiredPages = Array.isArray(siteData?.requirements?.requiredPages)
    ? siteData.requirements.requiredPages
    : (siteData?.template?.structure?.pages as string[]) || ['home', 'contact'];

  const activeLinks = defaultLinks.filter((item) =>
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

  return (
    <header
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: 'var(--header-bg, rgba(255, 255, 255, 0.82))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border, rgba(226, 232, 240, 0.8))',
        transition: 'all 0.2s ease',
        ...style,
      }}
      className={`deneb-navbar sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 ${className}`.trim()}
      {...(props as any)}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.875rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
        className="deneb-navbar-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6"
      >
        {/* Brand Section: Logo + Website Title */}
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'transparent',
            border: 0,
            padding: 0,
            cursor: 'pointer',
            textAlign: 'left',
          }}
          className="deneb-brand-btn flex items-center gap-3 group cursor-pointer border-0 bg-transparent p-0"
        >
          {/* Logo with visual editing marker */}
          <img
            src={withBase(logoUrl || '/placeholder.svg')}
            alt={siteName}
            data-preview-field-path="common.logoUrl"
            style={{
              height: '36px',
              width: 'auto',
              maxWidth: '140px',
              objectFit: 'contain',
              borderRadius: '8px',
              transition: 'transform 0.2s ease',
            }}
            className="deneb-logo h-9 w-auto max-w-[140px] object-contain rounded-lg group-hover:scale-105 transition-transform"
          />

          {/* Website Title with visual editing marker */}
          <span
            data-preview-field-path="common.websiteTitle"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--color-text, #0f172a)',
            }}
            className="deneb-site-title text-xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            {siteName}
          </span>
        </button>

        {/* Desktop Navigation Links (auto-synced with navLabels) */}
        <nav
          style={{
            alignItems: 'center',
            gap: '0.375rem',
          }}
          className="deneb-desktop-nav flex items-center gap-1.5"
        >
          {showSearch && (
            <div style={{ marginBottom: "0.5rem" }}>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSearchClick) onSearchClick();
                  else navigate(searchUrl);
                }}
                data-preview-static="header-search-toggle"
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border, #e2e8f0)",
                  backgroundColor: "transparent",
                  color: "var(--color-text-muted, #64748b)",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-preview-static="decorative-icon">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span data-preview-field-path={searchFieldPath}>{searchLabel}</span>
              </button>
            </div>
          )}
          {activeLinks.map((link) => {
            const label = navLabels[link.id] || link.label;
            const isActive = activeRoute === link.route;

            return (
              <span key={link.id} data-target-page={link.id}>
                <button
                  type="button"
                  onClick={() => navigate(link.route)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.45rem 0.875rem',
                    borderRadius: '9999px',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-primary, #0f172a)' : 'var(--color-text-muted, #475569)',
                    backgroundColor: isActive ? 'var(--color-secondary, #f1f5f9)' : 'transparent',
                    border: 0,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  className={`deneb-nav-item px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white'
                      : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/70'
                  }`}
                >
                  <span data-preview-field-path={`common.navLabels.${link.id}`}>{label}</span>
                </button>
              </span>
            );
          })}
        </nav>

        {/* Right Section: Header CTA & Mobile Hamburger */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          className="flex items-center gap-3"
        >
          {hasContact ? (
            <span data-target-page="contact">
              <button
                type="button"
                onClick={() => navigate('/contact')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--color-primary, #0f172a)',
                  color: '#ffffff',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 0,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className="deneb-header-cta inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold bg-slate-900 text-white shadow-sm hover:bg-slate-800 hover:shadow-md transition-all border-0 cursor-pointer dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                <span data-preview-field-path="common.headerCtaLabel">{headerCtaLabel}</span>
              </button>
            </span>
          ) : (
            <span
              data-target-page="contact"
              className="deneb-header-cta unavailable"
              data-preview-field-path="common.headerCtaLabel"
            >
              {headerCtaLabel}
            </span>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            data-preview-static="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid var(--color-border, #e2e8f0)',
              backgroundColor: 'transparent',
              color: 'var(--color-text, #0f172a)',
              cursor: 'pointer',
            }}
            className="deneb-mobile-toggle md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--color-border, #e2e8f0)',
            backgroundColor: 'var(--card-bg, var(--page-background, rgba(255, 255, 255, 0.98)))',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
          }}
          className="deneb-mobile-drawer md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-4 py-5 flex flex-col gap-2.5 dark:border-slate-800 dark:bg-slate-950/95"
        >
          {activeLinks.map((link) => {
            const label = navLabels[link.id] || link.label;
            const isActive = activeRoute === link.route;

            return (
              <span key={`mobile-${link.id}`} data-target-page={link.id}>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(link.route);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-primary, #0f172a)' : 'var(--color-text, #0f172a)',
                    backgroundColor: isActive ? 'var(--color-secondary, #f1f5f9)' : 'transparent',
                    border: 0,
                    cursor: 'pointer',
                  }}
                  className={`block w-full text-left px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors border-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white'
                      : 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span data-preview-field-path={`common.navLabels.${link.id}`}>{label}</span>
                </button>
              </span>
            );
          })}

          {hasContact ? (
            <span data-target-page="contact" style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border, rgba(226, 232, 240, 0.8))' }}>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/contact');
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  backgroundColor: 'var(--color-primary, #0f172a)',
                  color: '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  border: 0,
                  cursor: 'pointer',
                }}
                className="deneb-mobile-drawer-cta w-full text-center px-4 py-3 rounded-full text-base font-semibold bg-slate-900 text-white border-0 cursor-pointer"
              >
                <span data-preview-field-path="common.headerCtaLabel">{headerCtaLabel}</span>
              </button>
            </span>
          ) : null}
        </div>
      )}
    </header>
  );
}

export const Navbar = EditableNavbar;
export const Header = EditableNavbar;
