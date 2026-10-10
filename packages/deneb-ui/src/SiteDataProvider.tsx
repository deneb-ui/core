'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DENEB_STYLE_PATCH_MESSAGE,
  patchStyleByPath,
  STYLE_PATCH_MESSAGE,
  generateThemeVariables,
} from '@deneb-ui/core';
import { DenebComponentStyles } from './DenebComponentStyles';
import { FontLoader } from './fonts/FontLoader';
import { ResponsiveBaseStyles } from './ResponsiveBaseStyles';
import type { ProductItem } from './EditableProductCard';
import type { ServiceItem } from './EditableServiceCard';
import { ThemeStyles, type TemplateTheme } from './ThemeStyles';

export const DENEB_PREVIEW_DATA_MESSAGE = 'DENEB_PREVIEW_SITE_DATA';
export const PREVIEW_DATA_MESSAGE = 'FIVORA_PREVIEW_SITE_DATA';
const PREVIOUS_PREVIEW_PREFIX = `${['MARKET', 'PLACE'].join('')}_PREVIEW_`;
const previousPreviewMessage = (suffix: string) =>
  `${PREVIOUS_PREVIEW_PREFIX}${suffix}`;
const previousPreviewStorageKey = (suffix: string) =>
  `__${PREVIOUS_PREVIEW_PREFIX}${suffix}__`;
export const LEGACY_PREVIEW_DATA_MESSAGE =
  previousPreviewMessage('SITE_DATA');
export const DENEB_PREVIEW_READY_MESSAGE = 'DENEB_PREVIEW_READY';
export const PREVIEW_READY_MESSAGE = 'FIVORA_PREVIEW_READY';
export const LEGACY_PREVIEW_READY_MESSAGE = previousPreviewMessage('READY');
export const DENEB_PREVIEW_FOCUS_MESSAGE = 'DENEB_PREVIEW_FOCUS_PAGE';
export const PREVIEW_FOCUS_MESSAGE = 'FIVORA_PREVIEW_FOCUS_PAGE';
export const LEGACY_PREVIEW_FOCUS_MESSAGE =
  previousPreviewMessage('FOCUS_PAGE');
export const PREVIEW_FIELD_ATTRIBUTE = 'data-preview-field-path';
export { STYLE_PATCH_MESSAGE, DENEB_STYLE_PATCH_MESSAGE } from '@deneb-ui/core';

const PARENT_ORIGIN_KEY = '__FIVORA_PREVIEW_PARENT_ORIGIN__';
const LEGACY_PARENT_ORIGIN_KEY = previousPreviewStorageKey('PARENT_ORIGIN');
const SITE_DATA_CACHE_KEY = '__FIVORA_PREVIEW_SITE_DATA_CACHE__';
const LEGACY_SITE_DATA_CACHE_KEY = previousPreviewStorageKey('SITE_DATA_CACHE');
const SITE_DATA_GLOBAL_KEY = '__FIVORA_PREVIEW_SITE_DATA__';
const LEGACY_SITE_DATA_GLOBAL_KEY = previousPreviewStorageKey('SITE_DATA');

export type GenericRecord = Record<string, any>;

export interface SiteDataApiConfig {
  baseUrl?: string | null;
  catalogUrl?: string | null;
  contactUrl?: string | null;
  analyticsUrl?: string | null;
  [key: string]: unknown;
}

export interface SiteDataProject {
  id?: string | null;
  slug?: string | null;
  title?: string | null;
  status?: string | null;
  [key: string]: unknown;
}

export interface SiteInstanceData {
  id?: string | null;
  slug?: string | null;
  domain?: string | null;
  subdomain?: string | null;
  customDomain?: string | null;
  liveUrl?: string | null;
  [key: string]: unknown;
}

export type SiteData = {
  project?: SiteDataProject | null;
  siteInstance?: SiteInstanceData | null;
  api?: SiteDataApiConfig | null;
  shop?: GenericRecord | null;
  merchant?: GenericRecord | null;
  template?: {
    structure?: {
      pages?: string[] | null;
      theme?: GenericRecord | null;
    } | null;
  } | null;
  requirements?: { requiredPages?: string[] | null } | null;
  content?: GenericRecord | null;
  media?: Record<string, string[]> | null;
  seo?: GenericRecord | null;
  styles?: GenericRecord | null;
  [key: string]: unknown;
};

const UNINITIALIZED_SITE_DATA = Symbol('DENEB_UNINITIALIZED_SITE_DATA');
export const SiteDataContext = createContext<SiteData | typeof UNINITIALIZED_SITE_DATA>(
  UNINITIALIZED_SITE_DATA as any
);

export function isRecord(value: unknown): value is GenericRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function isDarkColor(color?: unknown): boolean {
  if (typeof color !== "string" || !color) return false;
  const hex = color.trim().toLowerCase();
  if (!/^#[0-9a-f]{3,6}$/.test(hex)) return false;
  const fullHex =
    hex.length === 4
      ? "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
      : hex;
  const r = Number.parseInt(fullHex.slice(1, 3), 16);
  const g = Number.parseInt(fullHex.slice(3, 5), 16);
  const b = Number.parseInt(fullHex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 130;
}

export function syncThemeToDocument(theme: unknown) {
  if (typeof document === "undefined" || !isRecord(theme)) return;
  const vars = generateThemeVariables(theme as any);
  const rootStyle = document.documentElement.style;
  const isDark = isDarkColor(theme.backgroundColor);

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  rootStyle.colorScheme = isDark ? "dark" : "light";

  for (const [key, val] of Object.entries(vars)) {
    if (key.startsWith("--")) {
      rootStyle.setProperty(key, val);
    }
  }
}

export function mergeSiteData(
  current: unknown,
  incoming: unknown,
  depth = 0,
  seen = new WeakSet<object>(),
): unknown {
  if (depth > 50) return incoming;
  if (Array.isArray(incoming)) return incoming;
  if (!isRecord(incoming)) return incoming;
  if (seen.has(incoming)) return incoming;
  seen.add(incoming);

  const base = isRecord(current) ? current : {};
  const next: GenericRecord = { ...base };
  for (const key of Object.keys(incoming)) {
    // Parent preview always sends complete content/media snapshots. Replacing
    // them wholesale avoids deep-cloning large collections on every keystroke.
    if (key === 'content' || key === 'media' || key === 'styles') {
      next[key] = incoming[key];
      continue;
    }
    next[key] = mergeSiteData(base[key], incoming[key], depth + 1, seen);
  }
  return next;
}

export function normalizeOrigin(value?: string | null, baseOrigin?: string | null): string | null {
  if (!value || value.trim() === 'null') return null;
  try {
    const origin = new URL(value, baseOrigin ?? undefined).origin;
    return origin === 'null' ? null : origin;
  } catch {
    return null;
  }
}

function readRememberedParentOrigin(): string | null {
  try {
    return (
      window.sessionStorage.getItem(PARENT_ORIGIN_KEY) ||
      window.sessionStorage.getItem(LEGACY_PARENT_ORIGIN_KEY)
    );
  } catch {
    return null;
  }
}

function rememberParentOrigin(origin: string | null): void {
  if (!origin) return;
  try {
    window.sessionStorage.setItem(PARENT_ORIGIN_KEY, origin);
    window.sessionStorage.setItem(LEGACY_PARENT_ORIGIN_KEY, origin);
  } catch {
    // Messaging still works without session storage.
  }
}

/**
 * Match the injected preview focus bridge: after in-iframe navigations,
 * document.referrer becomes the previous preview page (same origin), so we
 * must retain the real parent origin from the first embed.
 */
export function resolveParentOrigin(): string | null {
  if (typeof window === 'undefined') return null;

  const currentOrigin = normalizeOrigin(window.location.origin);
  let ancestorOrigin: string | null = null;
  try {
    ancestorOrigin = normalizeOrigin(
      (window.location as unknown as { ancestorOrigins?: { item: (i: number) => string } })
        .ancestorOrigins?.item(0),
      currentOrigin,
    );
  } catch {
    ancestorOrigin = null;
  }

  let accessibleParentOrigin: string | null = null;
  try {
    accessibleParentOrigin =
      window.parent !== window
        ? normalizeOrigin(window.parent.location.origin, currentOrigin)
        : null;
  } catch {
    accessibleParentOrigin = null;
  }

  const referrerOrigin = normalizeOrigin(document.referrer, currentOrigin);
  const rememberedOrigin = normalizeOrigin(readRememberedParentOrigin());

  const resolved =
    ancestorOrigin ??
    accessibleParentOrigin ??
    (referrerOrigin && referrerOrigin !== currentOrigin
      ? referrerOrigin
      : null) ??
    rememberedOrigin ??
    referrerOrigin;

  rememberParentOrigin(resolved);
  return resolved;
}

export function readCachedSiteData<T = SiteData>(): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const globalStore = window as unknown as Record<string, unknown>;
    const globalData =
      globalStore[SITE_DATA_GLOBAL_KEY] ??
      globalStore[LEGACY_SITE_DATA_GLOBAL_KEY];
    if (isRecord(globalData)) {
      return globalData as T;
    }
  } catch {
    // Ignore non-extensible window environments.
  }

  try {
    const raw =
      window.sessionStorage.getItem(SITE_DATA_CACHE_KEY) ||
      window.sessionStorage.getItem(LEGACY_SITE_DATA_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? (parsed as T) : null;
  } catch {
    return null;
  }
}

export interface SiteDataProviderProps<T = SiteData> {
  children: ReactNode;
  initialSiteData?: T;
  fallbackSiteData?: T;
  /**
   * Optional custom live catalog endpoint.
   * If omitted, defaults to `/api/site-catalog/${slug}/live-data`.
   */
  liveCatalogEndpoint?: string;
  /**
   * Optional site slug for live rehydration. If omitted, resolved from initialSiteData.
   */
  siteSlug?: string;
}

export function SiteDataProvider<T extends SiteData = SiteData>({
  children,
  initialSiteData,
  fallbackSiteData,
  liveCatalogEndpoint,
  siteSlug,
}: SiteDataProviderProps<T>) {
  // SSR HTML and the first client paint must match. Reading sessionStorage here
  // causes React hydration error #418 when a previous preview left merchant
  // content in the cache. Cache is applied after mount in useEffect instead.
  const [siteData, setSiteData] = useState<T>(() => {
    return (initialSiteData ?? fallbackSiteData ?? ({} as T));
  });

  // Real-time catalog & theme hydration for standalone live sites
  useEffect(() => {
    if (typeof window === "undefined" || window.parent !== window) return;

    const candidateSlug =
      siteSlug ||
      initialSiteData?.siteInstance?.slug ||
      initialSiteData?.project?.slug ||
      initialSiteData?.project?.id;

    if (
      !candidateSlug ||
      candidateSlug === 'template-validation' ||
      (typeof window !== 'undefined' &&
        (window.location.pathname.includes('/template-preview/') ||
          window.location.pathname.includes('/preview/')))
    ) {
      return;
    }

    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

    const endpoint =
      liveCatalogEndpoint ||
      (isLocalhost &&
      initialSiteData?.api?.catalogUrl &&
      initialSiteData.api.catalogUrl.includes('api.fivora.site')
        ? `http://localhost:3000/site-catalog/${candidateSlug}/live-data`
        : initialSiteData?.api?.catalogUrl ||
          (candidateSlug && initialSiteData?.api?.baseUrl
            ? `${initialSiteData.api.baseUrl.replace(/\/+$/, '')}/site-catalog/${candidateSlug}/live-data`
            : candidateSlug
              ? `/site-catalog/${candidateSlug}/live-data`
              : null));

    if (!endpoint) return;

    let stopped = false;
    let activeController: AbortController | null = null;
    let retryTimer: number | null = null;
    let lastSuccessfulFetchAt = 0;
    const retryDelays = [750, 2_000, 5_000];

    const applyLiveCatalog = (live: GenericRecord) => {
      setSiteData((current) => {
        const currentContent = isRecord(current.content) ? current.content : {};
        const currentHome = isRecord(currentContent.home) ? currentContent.home : null;
        const currentCommon = isRecord(currentContent.common) ? currentContent.common : {};
        const currentContact = isRecord(currentContent.contact) ? currentContent.contact : {};

        const rawLiveProducts = Array.isArray(live.products) ? live.products : currentContent.products;
        const nextProducts = Array.isArray(rawLiveProducts) ? rawLiveProducts.map(normalizeProductItem) : rawLiveProducts;
        const nextServices = Array.isArray(live.services) ? (live.services as unknown[]).map(normalizeServiceItem) : currentContent.services;
        const nextReviews = Array.isArray(live.reviews)
          ? live.reviews
          : null;

        // Shop / Merchant profile live synchronization
        let nextShop = isRecord(current.shop) ? { ...current.shop } : {};
        let nextMerchant = isRecord(current.merchant) ? { ...current.merchant } : {};
        const nextCommon = { ...currentCommon };
        const nextContact = { ...currentContact };
        const nextHome = currentHome ? { ...currentHome } : {};

        if (isRecord(live.shop)) {
          nextShop = mergeSiteData(nextShop, live.shop) as GenericRecord;
          nextMerchant = mergeSiteData(nextMerchant, live.shop) as GenericRecord;

          const contact = isRecord(live.shop.contact) ? live.shop.contact : null;
          const address = isRecord(live.shop.address) ? live.shop.address : null;

          const phoneVal =
            (contact && typeof contact.phone === 'string' && contact.phone.trim()) ||
            (typeof live.shop.businessPhone === 'string' && live.shop.businessPhone.trim()) ||
            null;
          if (phoneVal) {
            nextContact.phone = phoneVal;
            nextContact.contactNumber = phoneVal;
            nextCommon.contactNumber = phoneVal;
            nextCommon.phone = phoneVal;
          }

          const whatsappVal =
            (contact && typeof contact.whatsapp === 'string' && contact.whatsapp.trim()) ||
            (typeof live.shop.businessWhatsapp === 'string' && live.shop.businessWhatsapp.trim()) ||
            null;
          if (whatsappVal) {
            nextContact.whatsapp = whatsappVal;
            nextCommon.whatsapp = whatsappVal;
            const cleanWa = whatsappVal.replace(/\D/g, '');
            if (cleanWa) {
              nextContact.whatsappNumber = cleanWa;
              nextCommon.whatsappNumber = cleanWa;
              nextHome.whatsappNumber = cleanWa;

              // Dynamically update any hardcoded or static wa.me URLs across home and common
              const waRegex = /(https?:\/\/(?:wa\.me|api\.whatsapp\.com\/send\?phone=))\d+/gi;
              for (const key of ['whatsappCtaUrl', 'whatsappOrderUrl', 'whatsappUrl']) {
                if (typeof nextHome[key] === 'string' && waRegex.test(nextHome[key])) {
                  nextHome[key] = nextHome[key].replace(waRegex, `$1${cleanWa}`);
                }
                if (typeof nextCommon[key] === 'string' && waRegex.test(nextCommon[key])) {
                  nextCommon[key] = nextCommon[key].replace(waRegex, `$1${cleanWa}`);
                }
              }
              if (!nextCommon.whatsappUrl || waRegex.test(nextCommon.whatsappUrl)) {
                nextCommon.whatsappUrl = `https://wa.me/${cleanWa}`;
              }
            }
          }

          const emailVal =
            (contact && typeof contact.email === 'string' && contact.email.trim()) ||
            (typeof live.shop.businessEmail === 'string' && live.shop.businessEmail.trim()) ||
            null;
          if (emailVal) {
            nextContact.email = emailVal;
            nextCommon.email = emailVal;
          }

          if (typeof live.shop.businessName === 'string' && live.shop.businessName.trim()) {
            nextCommon.websiteTitle = live.shop.businessName.trim();
          }

          if (address) {
            const street = address.street || address.line1;
            if (typeof street === 'string' && street.trim()) {
              nextContact.address = street;
              nextCommon.address = street;
              nextCommon.footerAddress = street;
            }
            if (typeof address.mapLocation === 'string' && address.mapLocation.trim()) {
              nextContact.googleMapLink = address.mapLocation;
              nextContact.mapLocation = address.mapLocation;
              nextContact.mapUrl = address.mapLocation;
            }
          }

          if (live.shop.openingHours) {
            const hoursStr = formatWeeklyHoursToString(live.shop.openingHours);
            const liveText = hoursStr || (typeof live.shop.openingHours === "string" ? live.shop.openingHours : "");
            nextContact.hours = live.shop.openingHours;
            nextContact.openingHours = liveText;
            nextCommon.openingHours = liveText;
            nextCommon.hours = live.shop.openingHours;
            nextHome.businessHours = live.shop.openingHours;
          }

          if (typeof live.shop.businessName === 'string' && live.shop.businessName.trim()) {
            nextCommon.websiteTitle = live.shop.businessName;
          }

          if (typeof live.shop.logoUrl === 'string' && live.shop.logoUrl.trim()) {
            nextCommon.logoUrl = live.shop.logoUrl;
          }
        }

        // Reviews / Testimonials live synchronization
        if (nextReviews) {
          nextHome.reviews = nextReviews;
          nextHome.testimonials = nextReviews;
          nextHome.feedbacks = nextReviews;
        }

        return {
          ...current,
          shop: nextShop,
          merchant: nextMerchant,
          reviews: nextReviews ?? (current as any).reviews,
          content: {
            ...currentContent,
            common: nextCommon,
            contact: nextContact,
            ...(nextProducts !== undefined ? { products: nextProducts } : {}),
            ...(nextServices !== undefined ? { services: nextServices } : {}),
            ...(nextReviews !== null ? { reviews: nextReviews, testimonials: nextReviews, feedbacks: nextReviews } : {}),
            ...(currentContent?.shop && typeof currentContent.shop === 'object' && nextProducts !== undefined
              ? { shop: { ...currentContent.shop, products: nextProducts } }
              : {}),
            ...(currentContent?.catalog && typeof currentContent.catalog === 'object' && nextProducts !== undefined
              ? { catalog: { ...currentContent.catalog, products: nextProducts } }
              : {}),
            ...(currentContent?.menu && typeof currentContent.menu === 'object' && nextProducts !== undefined
              ? { menu: { ...currentContent.menu, items: nextProducts, products: nextProducts } }
              : {}),
            ...(currentContent?.store && typeof currentContent.store === 'object' && nextProducts !== undefined
              ? { store: { ...currentContent.store, products: nextProducts } }
              : {}),
            ...(currentHome || Object.keys(nextHome).length > 0
              ? {
                  home: {
                    ...nextHome,
                    ...(nextProducts !== undefined && 'products' in (currentHome || {})
                      ? { products: nextProducts }
                      : {}),
                    ...(nextServices !== undefined && 'services' in (currentHome || {})
                      ? { services: nextServices }
                      : {}),
                    ...(nextProducts !== undefined && 'featuredProducts' in (currentHome || {})
                      ? { featuredProducts: nextProducts }
                      : {}),
                    ...(nextServices !== undefined && 'featuredServices' in (currentHome || {})
                      ? { featuredServices: nextServices }
                      : {}),
                  },
                }
              : {}),
          },
        } as T;
      });

      // Dynamic theme variable injection for instant color updates
      if (isRecord(live.theme)) {
        syncThemeToDocument(live.theme);
      }
    };

    const loadLiveCatalog = async (attempt = 0) => {
      if (stopped) return;
      activeController?.abort();
      const controller = new AbortController();
      activeController = controller;

      try {
        const response = await fetch(endpoint, {
          signal: controller.signal,
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Live catalog request failed with ${response.status}`);
        }
        const live: unknown = await response.json();
        if (stopped || !isRecord(live)) return;
        applyLiveCatalog(live);
        lastSuccessfulFetchAt = Date.now();
      } catch (error) {
        if (
          stopped ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }
        const retryDelay = retryDelays[attempt];
        if (retryDelay !== undefined) {
          retryTimer = window.setTimeout(() => {
            void loadLiveCatalog(attempt + 1);
          }, retryDelay);
        }
      }
    };

    const refreshIfStale = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastSuccessfulFetchAt >= 30_000
      ) {
        if (retryTimer !== null) window.clearTimeout(retryTimer);
        retryTimer = null;
        void loadLiveCatalog();
      }
    };

    void loadLiveCatalog();
    window.addEventListener("focus", refreshIfStale);
    window.addEventListener("online", refreshIfStale);
    document.addEventListener("visibilitychange", refreshIfStale);

    return () => {
      stopped = true;
      activeController?.abort();
      if (retryTimer !== null) window.clearTimeout(retryTimer);
      window.removeEventListener("focus", refreshIfStale);
      window.removeEventListener("online", refreshIfStale);
      document.removeEventListener("visibilitychange", refreshIfStale);
    };
  }, [liveCatalogEndpoint, siteSlug, initialSiteData]);

  useEffect(() => {
    let parentOrigin = resolveParentOrigin();

    const applyIncomingSiteData = (incoming: unknown) => {
      if (!isRecord(incoming)) return;
      setSiteData((current) => mergeSiteData(current, incoming) as T);
      try {
        const inc = incoming as GenericRecord;
        const theme = (isRecord(inc.template) && isRecord((inc.template as GenericRecord).structure))
          ? (inc.template as GenericRecord).structure?.theme
          : inc.theme;
        if (theme) syncThemeToDocument(theme);
      } catch {
        // Best-effort
      }
      try {
        (window as unknown as Record<string, unknown>)[SITE_DATA_GLOBAL_KEY] =
          incoming;
        (window as unknown as Record<string, unknown>)[
          LEGACY_SITE_DATA_GLOBAL_KEY
        ] = incoming;
      } catch {
        // Ignore non-extensible window environments.
      }
      // Debounce session cache writes — stringify of large templates is costly.
      const win = window as unknown as {
        __fivoraSiteDataPersistTimer?: number;
      };
      window.clearTimeout(win.__fivoraSiteDataPersistTimer);
      win.__fivoraSiteDataPersistTimer = window.setTimeout(() => {
        try {
          const serialized = JSON.stringify(incoming);
          window.sessionStorage.setItem(SITE_DATA_CACHE_KEY, serialized);
          window.sessionStorage.setItem(LEGACY_SITE_DATA_CACHE_KEY, serialized);
        } catch {
          // Cache is best-effort.
        }
      }, 750);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      if (!isRecord(event.data)) return;
      const isData =
        event.data.type === DENEB_PREVIEW_DATA_MESSAGE ||
        event.data.type === PREVIEW_DATA_MESSAGE ||
        event.data.type === LEGACY_PREVIEW_DATA_MESSAGE;
      const isFocus =
        event.data.type === DENEB_PREVIEW_FOCUS_MESSAGE ||
        event.data.type === PREVIEW_FOCUS_MESSAGE ||
        event.data.type === LEGACY_PREVIEW_FOCUS_MESSAGE;
      const isStylePatch =
        event.data.type === STYLE_PATCH_MESSAGE ||
        event.data.type === DENEB_STYLE_PATCH_MESSAGE;
      if (!isData && !isFocus && !isStylePatch) {
        return;
      }

      // Pin the first concrete parent origin when referrer was suppressed.
      if (!parentOrigin) {
        try {
          const candidateOrigin = new URL(event.origin).origin;
          if (candidateOrigin !== 'null') {
            parentOrigin = candidateOrigin;
            rememberParentOrigin(candidateOrigin);
          }
        } catch {
          return;
        }
      }

      // Accept the remembered/resolved parent origin, or a same-origin relay
      // from the injected focus bridge (used after in-iframe navigations).
      const trustedOrigins = new Set(
        [parentOrigin, window.location.origin].filter(Boolean) as string[],
      );
      if (!trustedOrigins.has(event.origin)) return;

      if (isData && isRecord(event.data.siteData)) {
        applyIncomingSiteData(event.data.siteData);
        try {
          const target = parentOrigin && parentOrigin !== 'null' ? parentOrigin : '*';
          const appliedFull = (event.data as Record<string, unknown>).full !== false;
          window.parent.postMessage(
            { type: 'FIVORA_PREVIEW_SITE_DATA_APPLIED', full: appliedFull },
            target,
          );
        } catch {
          // ignore
        }
        return;
      }

      if (isStylePatch) {
        const targetPath =
          typeof event.data.targetPath === 'string' ? event.data.targetPath : '';
        const styleType =
          typeof event.data.styleType === 'string' ? event.data.styleType : 'text';
        const properties = isRecord(event.data.properties) ? event.data.properties : {};
        if (targetPath) {
          patchStyleByPath(
            targetPath,
            styleType as 'text' | 'card' | 'button' | 'grid' | 'section',
            properties,
          );
        }
        return;
      }

      if (isFocus) {
        const fieldPath =
          typeof event.data.fieldPath === 'string' ? event.data.fieldPath : '';
        if (!fieldPath) return;
        requestAnimationFrame(() => {
          const target = document.querySelector<HTMLElement>(
            `[${PREVIEW_FIELD_ATTRIBUTE}="${CSS.escape(fieldPath)}"]`,
          );
          target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    };

    window.addEventListener('message', onMessage);

    // Re-apply cache after mount in case the bridge published between
    // useState init and listener registration.
    const cached = readCachedSiteData<T>();
    if (cached) {
      applyIncomingSiteData(cached);
    }

    window.parent.postMessage(
      { type: DENEB_PREVIEW_READY_MESSAGE, pathname: window.location.pathname },
      parentOrigin ?? '*',
    );
    window.parent.postMessage(
      { type: PREVIEW_READY_MESSAGE, pathname: window.location.pathname },
      parentOrigin ?? '*',
    );
    window.parent.postMessage(
      { type: LEGACY_PREVIEW_READY_MESSAGE, pathname: window.location.pathname },
      parentOrigin ?? '*',
    );
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Synchronize document.title and favicon in client environments (both preview and live)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const sd = siteData as unknown as GenericRecord;
    const common = isRecord(sd?.content?.common) ? (sd.content.common as GenericRecord) : null;
    const shop = isRecord(sd?.shop) ? (sd.shop as GenericRecord) : null;
    const site = isRecord(sd?.site) ? (sd.site as GenericRecord) : null;

    const candidateTitle =
      (typeof common?.websiteTitle === "string" && common.websiteTitle.trim()) ||
      (typeof shop?.businessName === "string" && shop.businessName.trim()) ||
      (typeof site?.name === "string" && site.name.trim());

    if (candidateTitle) {
      document.title = candidateTitle;
    }

    const candidateIcon =
      (typeof common?.logoUrl === "string" && common.logoUrl.trim()) ||
      (typeof shop?.logoUrl === "string" && shop.logoUrl.trim()) ||
      (typeof site?.logoUrl === "string" && site.logoUrl.trim());

    if (candidateIcon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      if (link.href !== candidateIcon) {
        link.href = candidateIcon;
      }
    }
  }, [siteData]);

  const resolvedTheme = useMemo(() => {
    const raw = siteData as unknown as GenericRecord;
    return (raw?.theme as TemplateTheme) ||
      ((raw?.template as GenericRecord)?.structure?.theme as TemplateTheme) ||
      ((initialSiteData as unknown as GenericRecord)?.theme as TemplateTheme) ||
      (((initialSiteData as unknown as GenericRecord)?.template as GenericRecord)?.structure?.theme as TemplateTheme) ||
      undefined;
  }, [siteData, initialSiteData]);

  useEffect(() => {
    if (resolvedTheme) {
      syncThemeToDocument(resolvedTheme);
    }
  }, [resolvedTheme]);

  const value = useMemo(() => siteData as SiteData, [siteData]);
  return (
    <SiteDataContext.Provider value={value}>
      <ThemeStyles theme={resolvedTheme} />
      <FontLoader />
      <ResponsiveBaseStyles />
      <DenebComponentStyles />
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData<T = SiteData>(): T {
  const ctx = useContext(SiteDataContext);
  if (ctx === UNINITIALIZED_SITE_DATA) {
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn(
        '[Deneb UI] useSiteData() was called outside of <SiteDataProvider>. ' +
        'Ensure your root layout.tsx or _app.tsx wraps the tree with: ' +
        '<SiteDataProvider initialSiteData={initialSiteData}>. Falling back to empty data.'
      );
    }
    return {} as T;
  }
  return ctx as T;
}

export function contentObject(value: unknown): GenericRecord {
  return isRecord(value) ? value : {};
}

export function contentText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function contentList<Item = unknown>(value: unknown): Item[] {
  return Array.isArray(value) ? (value as Item[]) : [];
}

export function contentNumber(value: unknown, fallback: number = 0): number {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
}

export function parseFieldPath(path: string): Array<string | number> {
  if (!path) return [];
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean)
    .map((part) => (/^\d+$/.test(part) ? Number(part) : part));
}

export function getFieldStyle(
  content: unknown,
  path?: string,
): GenericRecord | null {
  if (!content || !path || typeof content !== "object") return null;
  const parts = parseFieldPath(path);
  if (parts.length === 0) return null;

  const last = parts.pop();
  if (last === undefined) return null;

  let current: unknown = content;
  for (const part of parts) {
    if (typeof part === "number") {
      if (!Array.isArray(current)) return null;
      current = current[part];
    } else {
      if (!isRecord(current)) return null;
      current = current[part];
    }
  }

  if (!isRecord(current)) return null;
  const styleKey = `${String(last)}Style`;
  const styleObj = current[styleKey];
  return isRecord(styleObj) ? (styleObj as GenericRecord) : null;
}

export function useFieldStyle(path?: string): GenericRecord | null {
  const siteData = useSiteData();
  const content = siteData?.content;
  return useMemo(() => {
    if (!path || !content) return null;
    return getFieldStyle(content, path);
  }, [content, path]);
}

/**
 * Official DENEB UI data aliases for modern storefront development.
 * Fully compatible with Fivora visual editing engine and marketplace preview.
 */
export const DenebDataProvider = SiteDataProvider;
export const useDenebData = useSiteData;
export const DenebDataContext = SiteDataContext;
export type DenebData = SiteData;


/**
 * Hook to retrieve products cleanly from SiteData, supporting both
 * top-level content.products and nested content.home.products.
 */

/**
 * Universal Bidirectional Product Normalizer:
 * Ensures every product object has both canonical and alias keys simultaneously populated
 * with clean numbers and resolved image URLs, so any template component code works flawlessly
 * regardless of whether the developer wrote .title or .name, .cost or .price, .image or .imageUrl.
 */

function formatTime12(timeStr?: string | null): string {
  if (!timeStr) return "";
  const clean = timeStr.trim();
  if (/am|pm/i.test(clean)) return clean;
  const [hourStr, minStr = "00"] = clean.split(":");
  const hour = parseInt(hourStr, 10);
  if (isNaN(hour)) return clean;
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minStr.padStart(2, "0")} ${ampm}`;
}

export function formatWeeklyHoursToString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";

  const days = [
    ["monday", "Mon"],
    ["tuesday", "Tue"],
    ["wednesday", "Wed"],
    ["thursday", "Thu"],
    ["friday", "Fri"],
    ["saturday", "Sat"],
    ["sunday", "Sun"],
  ] as const;

  const entries: Array<{ label: string; hours: string }> = [];
  const rec = value as Record<string, any>;

  for (const [key, label] of days) {
    const day = rec[key];
    if (!day) continue;
    if (typeof day === "string") {
      const trimmed = day.trim();
      if (trimmed) entries.push({ label, hours: trimmed });
      continue;
    }
    if (day.closed === true) {
      entries.push({ label, hours: "Closed" });
      continue;
    }
    const open = typeof day.open === "string" ? formatTime12(day.open) : "";
    const close = typeof day.close === "string" ? formatTime12(day.close) : "";
    if (open && close) {
      entries.push({ label, hours: `${open} – ${close}` });
    } else if (open) {
      entries.push({ label, hours: `From ${open}` });
    }
  }

  if (entries.length === 0) return "";

  const groups: Array<{ first: string; last: string; hours: string }> = [];
  for (const entry of entries) {
    const prev = groups[groups.length - 1];
    if (prev && prev.hours === entry.hours) {
      prev.last = entry.label;
    } else {
      groups.push({ first: entry.label, last: entry.label, hours: entry.hours });
    }
  }

  const activeGroups = groups.filter((g) => g.hours && g.hours !== "Closed");
  if (activeGroups.length === 0) return "Closed";
  return activeGroups
    .map((g) => (g.first === g.last ? `${g.first}: ${g.hours}` : `${g.first} – ${g.last}: ${g.hours}`))
    .join(", ");
}

export function normalizeProductItem(p: unknown): ProductItem {
  if (!isRecord(p)) return p as ProductItem;
  const customData = isRecord(p.customData) ? p.customData : {};

  const nameCandidate = p.name ?? p.title ?? p.productName ?? p.itemTitle ?? p.heading ?? p.label;
  const titleCandidate = p.title ?? p.name ?? p.itemTitle ?? p.productName ?? p.heading ?? p.label;

  const rawPrice =
    p.price !== undefined
      ? p.price
      : p.cost !== undefined
        ? p.cost
        : p.amount !== undefined
          ? p.amount
          : p.productPrice !== undefined
            ? p.productPrice
            : p.currentPrice !== undefined
              ? p.currentPrice
              : p.rate;
  let numPrice: number | string | undefined = rawPrice as any;
  if (typeof rawPrice === "string" && rawPrice.trim()) {
    const isRangeStr = rawPrice.includes("-") || rawPrice.includes("–") || rawPrice.includes("—") || /\bto\b/i.test(rawPrice);
    if (!isRangeStr) {
      const match = rawPrice.match(/-?\d+(?:,\d{3})*(?:\.\d+)?|-?\d+(?:\.\d+)?/);
      if (match) {
        const parsed = parseFloat(match[0].replace(/,/g, ""));
        if (!isNaN(parsed) && Number.isFinite(parsed)) {
          numPrice = parsed;
        }
      }
    }
  }

  const rawCompare =
    p.compareAtPrice !== undefined
      ? p.compareAtPrice
      : p.originalPrice !== undefined
        ? p.originalPrice
        : p.oldPrice !== undefined
          ? p.oldPrice
          : p.regularPrice !== undefined
            ? p.regularPrice
            : p.strikePrice;
  let numCompare: number | string | undefined = rawCompare as any;
  if (typeof rawCompare === "string" && rawCompare.trim()) {
    const match = rawCompare.match(/-?\d+(?:,\d{3})*(?:\.\d+)?|-?\d+(?:\.\d+)?/);
    if (match) {
      const parsed = parseFloat(match[0].replace(/,/g, ""));
      if (!isNaN(parsed) && Number.isFinite(parsed)) {
        numCompare = parsed;
      }
    }
  }

  const imageCandidate =
    p.imageUrl ??
    p.image ??
    p.photo ??
    p.thumbnail ??
    p.picture ??
    p.img ??
    p.src ??
    p.productImage ??
    (Array.isArray(p.gallery) ? p.gallery[0] : undefined) ??
    (Array.isArray(p.images) ? p.images[0] : undefined);

  const badgeCandidate = p.badge ?? p.tag ?? p.label ?? p.badgeText ?? p.chip;
  const descCandidate = p.description ?? p.desc ?? p.details ?? p.shortDescription ?? p.subtitle;

  const explicitMin = p.minPrice ?? customData.minPrice;
  const explicitMax = p.maxPrice ?? customData.maxPrice;
  const explicitRange = p.priceRange ?? customData.priceRange;
  const isRange = Boolean(p.isPriceRange || customData.isPriceRange || (explicitMax && explicitMin));

  return {
    ...customData,
    ...p,
    name: nameCandidate as string | undefined,
    title: titleCandidate as string | undefined,
    productName: (titleCandidate ?? nameCandidate) as string | undefined,
    itemTitle: (titleCandidate ?? nameCandidate) as string | undefined,
    minPrice: explicitMin !== undefined ? explicitMin : undefined,
    priceMin: (explicitMin ?? p.priceMin) !== undefined ? (explicitMin ?? p.priceMin) : undefined,
    maxPrice: explicitMax !== undefined ? explicitMax : undefined,
    priceMax: (explicitMax ?? p.priceMax) !== undefined ? (explicitMax ?? p.priceMax) : undefined,
    priceRange: explicitRange !== undefined ? explicitRange : undefined,
    isPriceRange: isRange,
    ...(numPrice !== undefined
      ? {
          price: numPrice,
          cost: numPrice,
          amount: numPrice,
          productPrice: numPrice,
        }
      : {}),
    ...(numCompare !== undefined
      ? {
          compareAtPrice: numCompare,
          originalPrice: numCompare,
        }
      : {}),
    ...(imageCandidate !== undefined
      ? {
          imageUrl: imageCandidate as string,
          image: imageCandidate as string,
          photo: imageCandidate as string,
          thumbnail: imageCandidate as string,
          productImage: imageCandidate as string,
        }
      : {}),
    ...(badgeCandidate !== undefined
      ? {
          badge: badgeCandidate as string,
          tag: badgeCandidate as string,
        }
      : {}),
    ...(descCandidate !== undefined
      ? {
          description: descCandidate as string,
          desc: descCandidate as string,
          details: descCandidate as string,
        }
      : {}),
  } as ProductItem;
}

/**
 * Universal Service Normalizer
 */
export function normalizeServiceItem(s: unknown): ServiceItem {
  if (!isRecord(s)) return s as ServiceItem;
  const customData = isRecord(s.customData) ? s.customData : {};

  const nameCandidate = s.name ?? s.title ?? s.serviceName ?? s.heading;
  const titleCandidate = s.title ?? s.name ?? s.serviceName ?? s.heading;
  const descCandidate = s.description ?? s.desc ?? s.details ?? s.shortDescription;
  const imageCandidate = s.imageUrl ?? s.image ?? s.photo ?? s.thumbnail ?? s.picture;

  return {
    ...customData,
    ...s,
    name: nameCandidate as string | undefined,
    title: titleCandidate as string | undefined,
    ...(descCandidate !== undefined ? { description: descCandidate as string, desc: descCandidate as string, details: descCandidate as string } : {}),
    ...(imageCandidate !== undefined ? { imageUrl: imageCandidate as string, image: imageCandidate as string, photo: imageCandidate as string } : {}),
  } as ServiceItem;
}

export function useProducts(fallback: ProductItem[] = []): ProductItem[] {
  const siteData = useSiteData();
  const content = isRecord(siteData?.content) ? (siteData.content as Record<string, unknown>) : null;
  if (!content) return fallback;

  let rawList: ProductItem[] | null = null;
  const candidates: unknown[] = [
    content.products,
    (content.shop as Record<string, unknown> | undefined)?.products,
    (content.home as Record<string, unknown> | undefined)?.products,
    (content.home as Record<string, unknown> | undefined)?.featuredProducts,
    (content.catalog as Record<string, unknown> | undefined)?.products,
    (content.menu as Record<string, unknown> | undefined)?.items,
    (content.menu as Record<string, unknown> | undefined)?.products,
    (content.store as Record<string, unknown> | undefined)?.products,
    (content.shop as Record<string, unknown> | undefined)?.items,
    (siteData.shop as Record<string, unknown> | undefined)?.products,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      rawList = candidate as ProductItem[];
      break;
    }
  }

  if (!rawList) return fallback;

  return rawList.map(normalizeProductItem);
}

/**
 * Hook to retrieve services cleanly from SiteData, supporting both
 * top-level content.services and nested content.home.services.
 */
export function useServices(fallback: ServiceItem[] = []): ServiceItem[] {
  const siteData = useSiteData();
  const content = isRecord(siteData?.content) ? (siteData.content as Record<string, unknown>) : null;
  if (!content) return fallback;

  const candidates: unknown[] = [
    content.services,
    (content.servicesPage as Record<string, unknown> | undefined)?.services,
    (content.home as Record<string, unknown> | undefined)?.services,
    (content.home as Record<string, unknown> | undefined)?.featuredServices,
    (content.company as Record<string, unknown> | undefined)?.services,
    (content.business as Record<string, unknown> | undefined)?.services,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return (candidate as unknown[]).map(normalizeServiceItem);
    }
  }

  return fallback;
}

/**
 * Hook to access official Fivora backend API endpoints (catalogUrl, contactUrl, analyticsUrl).
 */
export function useSiteApi(): SiteDataApiConfig | null {
  const siteData = useSiteData();
  return (siteData?.api as SiteDataApiConfig) ?? null;
}

/**
 * Hook to access full catalog metadata and live status.
 */
export function useSiteCatalog() {
  const products = useProducts();
  const services = useServices();
  const siteData = useSiteData();
  return {
    products,
    services,
    project: siteData?.project ?? null,
    siteInstance: siteData?.siteInstance ?? null,
    api: siteData?.api ?? null,
  };
}


/**
 * Hook to retrieve shop profile cleanly from SiteData, supporting both
 * top-level siteData.shop and siteData.merchant.
 */
export function useShop(fallback: GenericRecord = {}): GenericRecord {
  const siteData = useSiteData();
  if (isRecord(siteData?.shop)) return siteData.shop;
  if (isRecord(siteData?.merchant)) return siteData.merchant;
  return fallback;
}

/**
 * Hook to retrieve customer reviews / testimonials cleanly from SiteData.
 */
export function useReviews(fallback: GenericRecord[] = []): GenericRecord[] {
  const siteData = useSiteData();
  const content = isRecord(siteData?.content) ? siteData.content : null;
  if (content) {
    if (Array.isArray(content.reviews) && content.reviews.length > 0) {
      return content.reviews as GenericRecord[];
    }
    if (Array.isArray(content.testimonials) && content.testimonials.length > 0) {
      return content.testimonials as GenericRecord[];
    }
    if (Array.isArray(content.customerReviews) && content.customerReviews.length > 0) {
      return content.customerReviews as GenericRecord[];
    }
    const home = isRecord(content.home) ? content.home : null;
    if (home) {
      if (Array.isArray(home.reviews) && home.reviews.length > 0) {
        return home.reviews as GenericRecord[];
      }
      if (Array.isArray(home.testimonials) && home.testimonials.length > 0) {
        return home.testimonials as GenericRecord[];
      }
      if (Array.isArray(home.feedbacks) && home.feedbacks.length > 0) {
        return home.feedbacks as GenericRecord[];
      }
    }
  }
  if (Array.isArray((siteData as any)?.reviews) && (siteData as any).reviews.length > 0) {
    return (siteData as any).reviews as GenericRecord[];
  }
  return fallback;
}


/**
 * Hook to retrieve common storefront metadata (website title, slogan, branding, etc.)
 * with safe hierarchical fallbacks across content.common, shop profile, and user fallbacks.
 * Never throws ReferenceError or crashes on missing data.
 */

export const DUMMY_PREVIEW_PHONE = '+94 11 234 5678';
export const DUMMY_PREVIEW_WHATSAPP = '94771234567';
export const DUMMY_PREVIEW_EMAIL = 'info@store.com';
export const DUMMY_PREVIEW_ADDRESS = 'Flagship Studio: Galle Face Promenade, Colombo 03, Sri Lanka';
export const DUMMY_PREVIEW_SHOP_NAME = 'Storefront';

/**
 * Checks whether the active storefront runtime is running in visual editor preview,
 * template authoring frame, or automated template validation.
 */
export function isPreviewValidation(siteData?: any): boolean {
  if (!siteData) return true;
  const slug = siteData?.project?.slug || siteData?.siteInstance?.slug;
  const id = siteData?.project?.id;
  if (slug === 'template-validation' || id === 'template-validation' || slug === 'preview' || id === 'preview') {
    return true;
  }
  if (typeof window !== 'undefined') {
    // If running in an iframe (Visual Editor preview in Shop Owner / Website Agent panel)
    if (window.parent !== window) {
      return true;
    }
    const path = window.location.pathname || '';
    if (path.includes('/template-validation') || path.includes('/template-preview') || path.includes('/preview/') || path.includes('/preview')) {
      return true;
    }
  }
  return false;
}

export function useCommon(fallback: GenericRecord = {}): GenericRecord {
  const siteData = useSiteData();
  const content = isRecord(siteData?.content) ? siteData.content : null;
  const common = isRecord(content?.common) ? content.common : {};
  const contact = isRecord(content?.contact) ? content.contact : {};
  const shop = useShop();

  const websiteTitle =
    (typeof common.websiteTitle === 'string' && common.websiteTitle.trim()) ||
    (typeof shop.name === 'string' && shop.name.trim()) ||
    (typeof shop.businessName === 'string' && shop.businessName.trim()) ||
    (typeof fallback.websiteTitle === 'string' && fallback.websiteTitle.trim()) ||
    'Store';

  const whatsappNumber =
    (typeof common.whatsappNumber === 'string' && common.whatsappNumber.trim()) ||
    (typeof contact.whatsappNumber === 'string' && contact.whatsappNumber.trim()) ||
    (typeof shop.whatsappNumber === 'string' && shop.whatsappNumber.trim()) ||
    (typeof shop.phone === 'string' && shop.phone.trim()) ||
    (typeof fallback.whatsappNumber === 'string' && fallback.whatsappNumber.trim()) ||
    '';

  const cleanWa = whatsappNumber.replace(/\D+/g, '');
  const whatsappUrl =
    (typeof common.whatsappUrl === 'string' && common.whatsappUrl.trim()) ||
    (cleanWa ? `https://wa.me/${cleanWa}` : '') ||
    (typeof fallback.whatsappUrl === 'string' && fallback.whatsappUrl.trim()) ||
    '';

  const address =
    (typeof common.address === 'string' && common.address.trim()) ||
    (typeof common.footerAddress === 'string' && common.footerAddress.trim()) ||
    (typeof contact.address === 'string' && contact.address.trim()) ||
    (typeof shop.address === 'string' && shop.address.trim()) ||
    (typeof fallback.address === 'string' && fallback.address.trim()) ||
    '';

  const logoUrl =
    (typeof common.logoUrl === 'string' && common.logoUrl.trim()) ||
    (typeof shop.logoUrl === 'string' && shop.logoUrl.trim()) ||
    (typeof fallback.logoUrl === 'string' && fallback.logoUrl.trim()) ||
    '';

  return {
    ...fallback,
    ...common,
    websiteTitle,
    whatsappNumber,
    whatsappUrl,
    address,
    logoUrl,
  };
}

/**
 * Hook to retrieve contact information (WhatsApp, phone, address, email, map link)
 * with robust fallbacks across contact, common, and shop profile.
 */
export function useContact(fallback: GenericRecord = {}): GenericRecord {
  const siteData = useSiteData();
  const content = isRecord(siteData?.content) ? siteData.content : null;
  const contact = isRecord(content?.contact) ? content.contact : {};
  const common = isRecord(content?.common) ? content.common : {};
  const shop = useShop();

  const whatsappNumber =
    (typeof contact.whatsappNumber === 'string' && contact.whatsappNumber.trim()) ||
    (typeof common.whatsappNumber === 'string' && common.whatsappNumber.trim()) ||
    (typeof shop.whatsappNumber === 'string' && shop.whatsappNumber.trim()) ||
    (typeof shop.phone === 'string' && shop.phone.trim()) ||
    (typeof fallback.whatsappNumber === 'string' && fallback.whatsappNumber.trim()) ||
    '';

  const cleanWa = whatsappNumber.replace(/\D+/g, '');
  const whatsappUrl =
    (typeof contact.whatsappUrl === 'string' && contact.whatsappUrl.trim()) ||
    (typeof common.whatsappUrl === 'string' && common.whatsappUrl.trim()) ||
    (cleanWa ? `https://wa.me/${cleanWa}` : '') ||
    '';

  const address =
    (typeof contact.address === 'string' && contact.address.trim()) ||
    (typeof common.address === 'string' && common.address.trim()) ||
    (typeof shop.address === 'string' && shop.address.trim()) ||
    (typeof fallback.address === 'string' && fallback.address.trim()) ||
    '';

  const email =
    (typeof contact.email === 'string' && contact.email.trim()) ||
    (typeof shop.email === 'string' && shop.email.trim()) ||
    (typeof fallback.email === 'string' && fallback.email.trim()) ||
    '';

  const googleMapLink =
    (typeof contact.googleMapLink === 'string' && contact.googleMapLink.trim()) ||
    (typeof fallback.googleMapLink === 'string' && fallback.googleMapLink.trim()) ||
    '';

  return {
    ...fallback,
    ...contact,
    whatsappNumber,
    whatsappUrl,
    address,
    email,
    googleMapLink,
  };
}


export interface SyncedBranding {
  logoUrl: string;
  websiteTitle: string;
  brandSubtext: string;
  slogan: string;
  faviconUrl: string;
}

/**
 * Universal Synced Branding Hook:
 * Guarantees real-time live synchronization for brand identity across visual editor preview,
 * merchant DB profile, and template defaults.
 * Hierarchy: Visual Editor Edits (content.common) -> Live Merchant Shop Profile -> Template Fallback.
 */
export function useSyncedBranding(fallback: Partial<SyncedBranding> = {}): SyncedBranding {
  const siteData = useSiteData();
  const content = isRecord(siteData?.content) ? siteData.content : null;
  const common = isRecord(content?.common) ? content.common : {};
  const shop = useShop();

  const websiteTitle =
    (typeof common.websiteTitle === 'string' && common.websiteTitle.trim()) ||
    (typeof common.siteName === 'string' && common.siteName.trim()) ||
    (typeof shop.businessName === 'string' && shop.businessName.trim()) ||
    (typeof shop.name === 'string' && shop.name.trim()) ||
    (typeof fallback.websiteTitle === 'string' && fallback.websiteTitle.trim()) ||
    'Storefront';

  const logoUrl =
    (typeof common.logoUrl === 'string' && common.logoUrl.trim()) ||
    (typeof shop.logoUrl === 'string' && shop.logoUrl.trim()) ||
    (typeof fallback.logoUrl === 'string' && fallback.logoUrl.trim()) ||
    '';

  const brandSubtext =
    (typeof common.brandSubtext === 'string' && common.brandSubtext.trim()) ||
    (typeof common.slogan === 'string' && common.slogan.trim()) ||
    (typeof fallback.brandSubtext === 'string' && fallback.brandSubtext.trim()) ||
    '';

  const faviconUrl = logoUrl || fallback.faviconUrl || '';

  return {
    logoUrl,
    websiteTitle,
    brandSubtext,
    slogan: brandSubtext,
    faviconUrl,
  };
}
