'use client';

import { useOptionalCart } from './cart/useCart';


import React, { useState } from 'react';
import { useSiteData } from './SiteDataProvider';
import { useComponentStyle } from './hooks/useComponentStyle';
import { styleToCssVariables } from '@deneb-ui/core';

export interface NavLinkItem {
  id: string;
  label: string;
  route: string;
}

/** Shared appearance for desktop and mobile. CSS lengths accept numbers (px) or strings. */
export interface NavbarStyles extends Pick<React.CSSProperties,
  'fontSize' | 'fontFamily' | 'fontWeight' | 'lineHeight' | 'letterSpacing' |
  'textTransform' | 'color' | 'backgroundColor' | 'border' | 'borderRadius'> {
  padding?: React.CSSProperties['padding'];
  maxWidth?: React.CSSProperties['maxWidth'];
  gap?: React.CSSProperties['gap'];
  linkGap?: React.CSSProperties['gap'];
  itemBorderRadius?: React.CSSProperties['borderRadius'];
}

export type NavbarPart = 'inner' | 'brand' | 'logo' | 'title' | 'links' |
  'link' | 'search' | 'actions' | 'icon' | 'badge' | 'cta' | 'toggle' | 'drawer';

export interface EditableNavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual-editor target shared by this navbar's children. */
  stylePath?: string;
  /** Overrides content.common.header.navbarStyles. */
  navbarStyles?: NavbarStyles;
  /** Per-element overrides, applied after shared settings on desktop and mobile. */
  partStyles?: Partial<Record<NavbarPart, React.CSSProperties>>;
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
  navbarStyles,
  partStyles,
  stylePath = 'common.header.navbar',
  ...props
}: EditableNavbarProps) {
  const siteData = useSiteData();
  const cart = useOptionalCart();
  const effectiveCartCount = cartCount ?? cart?.totalCount ?? 0;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const content = (siteData?.content || {}) as Record<string, any>;
  const common = (content?.common || {}) as Record<string, any>;
  const { style: editorStyle } = useComponentStyle(stylePath, 'card');
  const theme = siteData?.template?.structure?.theme || (siteData?.template as any)?.theme;
  const savedEditorStyle = theme?.elementStyles?.[stylePath] || {};
  const visualStyle = { ...editorStyle, ...savedEditorStyle };
  const editorVars = {
    ...styleToCssVariables('text', visualStyle),
    ...styleToCssVariables('card', visualStyle),
  } as React.CSSProperties;
  const appearance: NavbarStyles = { ...common?.header?.navbarStyles, ...navbarStyles };
  const parts: Partial<Record<NavbarPart, React.CSSProperties>> = {
    ...common?.header?.navbarPartStyles,
    ...partStyles,
  };
  const typography: React.CSSProperties = {
    fontSize: appearance.fontSize,
    fontFamily: appearance.fontFamily,
    fontWeight: appearance.fontWeight,
    lineHeight: appearance.lineHeight,
    letterSpacing: appearance.letterSpacing,
    textTransform: appearance.textTransform,
    color: appearance.color,
  };
  // Omit unset values so the existing per-element defaults remain intact.
  const sharedText = Object.fromEntries(
    Object.entries(typography).filter(([, value]) => value !== undefined),
  ) as React.CSSProperties;
  const textStyle = (part: NavbarPart, active = false, mobile = false): React.CSSProperties => ({
    fontSize: `var(--deneb-font-size, ${part === 'title' ? '1.25rem' : part === 'badge' ? '11px' : mobile ? '0.95rem' : part === 'cta' ? '0.875rem' : '0.9rem'})`,
    fontFamily: 'var(--deneb-font-family, inherit)',
    fontWeight: `var(--deneb-font-weight, ${part === 'title' ? 700 : part === 'badge' ? 'bold' : part === 'cta' || active ? 600 : part === 'link' ? 500 : 'inherit'})` as React.CSSProperties['fontWeight'],
    lineHeight: 'var(--deneb-line-height, normal)',
    letterSpacing: `var(--deneb-letter-spacing, ${part === 'title' ? '-0.025em' : 'normal'})`,
    textTransform: 'var(--deneb-text-transform, none)' as React.CSSProperties['textTransform'],
    color: `var(--deneb-color, ${part === 'cta' || part === 'badge' ? '#ffffff' : active ? 'var(--color-primary, #0f172a)' : part === 'link' && !mobile ? 'var(--color-text-muted, #475569)' : part === 'search' ? 'var(--color-text-muted, #64748b)' : 'var(--color-text, #0f172a)'})`,
    ...sharedText,
    ...(appearance.itemBorderRadius !== undefined && part !== 'title' && part !== 'badge'
      ? { borderRadius: appearance.itemBorderRadius } : {}),
    ...parts[part],
  });
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
      data-preview-style-target={stylePath}
      data-preview-style-type="card"
      data-preview-style-label="Whole navbar"
      data-design-section="navbar"
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: 'var(--deneb-card-bg, var(--header-bg, rgba(255, 255, 255, 0.82)))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border, rgba(226, 232, 240, 0.8))',
        transition: 'all 0.2s ease',
        ...sharedText,
        ...editorVars,
        backgroundImage: 'var(--deneb-card-bg-gradient, none)',
        borderRadius: 'var(--deneb-card-radius, 0px)',
        borderWidth: 'var(--deneb-card-border-w, 0px 0px 1px)',
        borderStyle: 'var(--deneb-card-border-s, solid)' as React.CSSProperties['borderStyle'],
        borderColor: 'var(--deneb-card-border-c, var(--color-border, #e2e8f0))',
        paddingTop: 'var(--deneb-card-pt, 0px)',
        paddingBottom: 'var(--deneb-card-pb, 0px)',
        paddingLeft: 'var(--deneb-card-pl, 0px)',
        paddingRight: 'var(--deneb-card-pr, 0px)',
        boxShadow: 'var(--deneb-card-shadow, none)',
        ...(appearance.backgroundColor !== undefined ? { backgroundColor: appearance.backgroundColor } : {}),
        ...(appearance.border !== undefined ? { border: appearance.border } : {}),
        ...(appearance.borderRadius !== undefined ? { borderRadius: appearance.borderRadius } : {}),
        ...style,
      }}
      className={`deneb-navbar sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 ${className}`.trim()}
      {...(props as any)}
    >
      <div
        style={{
          maxWidth: 'var(--deneb-card-max-width, 1280px)',
          margin: '0 auto',
          padding: '0.875rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--deneb-card-gap, 1.5rem)',
          ...(appearance.maxWidth !== undefined ? { maxWidth: appearance.maxWidth } : {}),
          ...(appearance.padding !== undefined ? { padding: appearance.padding } : {}),
          ...(appearance.gap !== undefined ? { gap: appearance.gap } : {}),
          ...parts.inner,
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
            ...textStyle('brand'),
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
              ...parts.logo,
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
              ...textStyle('title'),
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
            gap: 'var(--deneb-card-gap, 0.375rem)',
            ...(appearance.linkGap !== undefined ? { gap: appearance.linkGap } : {}),
            ...parts.links,
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
                  ...textStyle('search'),
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
                    ...textStyle('link', isActive),
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
          style={{ display: 'flex', alignItems: 'center', gap: appearance.gap ?? '0.75rem', ...parts.actions }}
          className="flex items-center gap-3"
        >
          {/* Cart Trigger Button */}
          {(showCart || (cart && cart.totalCount > 0)) && (
            <button
              type="button"
              onClick={() => {
                if (onCartClick) onCartClick();
                else if (cart) cart.toggleCart();
              }}
              data-preview-static="header-cart-toggle"
              aria-label={`Shopping cart with ${effectiveCartCount} items`}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-secondary, #f1f5f9)',
                color: 'var(--color-text, #0f172a)',
                border: '1px solid var(--color-border, #e2e8f0)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                ...textStyle('icon'),
              }}
              className="deneb-cart-btn relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-preview-static="cart-icon">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {effectiveCartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    borderRadius: '9999px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    ...textStyle('badge'),
                  }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center shadow-sm"
                >
                  {effectiveCartCount > 99 ? '99+' : effectiveCartCount}
                </span>
              )}
            </button>
          )}
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
                  ...textStyle('cta'),
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
              style={textStyle('cta')}
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
              ...textStyle('toggle'),
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
            backgroundColor: 'var(--deneb-card-bg, var(--card-bg, var(--page-background, rgba(255, 255, 255, 0.98))))',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
            ...(appearance.backgroundColor !== undefined ? { backgroundColor: appearance.backgroundColor } : {}),
            ...(appearance.padding !== undefined ? { padding: appearance.padding } : {}),
            ...(appearance.linkGap !== undefined ? { gap: appearance.linkGap } : {}),
            ...parts.drawer,
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
                    ...textStyle('link', isActive, true),
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
                  ...textStyle('cta'),
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
