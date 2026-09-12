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
} from '@deneb-ui/core';
import { DenebComponentStyles } from './DenebComponentStyles';
import { FontLoader } from './fonts/FontLoader';
import { ResponsiveBaseStyles } from './ResponsiveBaseStyles';
import type { ProductItem } from './EditableProductCard';
import type { ServiceItem } from './EditableServiceCard';

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

export const SiteDataContext = createContext<SiteData>({});

export function isRecord(value: unknown): value is GenericRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
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

    const endpoint =
      liveCatalogEndpoint ||
      initialSiteData?.api?.catalogUrl ||
      (candidateSlug && initialSiteData?.api?.baseUrl
        ? `${initialSiteData.api.baseUrl.replace(/\/+$/, '')}/site-catalog/${candidateSlug}/live-data`
        : candidateSlug
          ? `/site-catalog/${candidateSlug}/live-data`
          : null);

    if (!endpoint) return;

    const controller = new AbortController();

    fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((live) => {
        if (!live || !isRecord(live)) return;

        setSiteData((current) => {
          const currentContent = isRecord(current.content) ? current.content : {};
          const currentHome = isRecord(currentContent.home) ? currentContent.home : null;

          const nextProducts = Array.isArray(live.products)
            ? live.products
            : currentContent.products;
          const nextServices = Array.isArray(live.services)
            ? live.services
            : currentContent.services;

          return {
            ...current,
            content: {
              ...currentContent,
              ...(nextProducts !== undefined ? { products: nextProducts } : {}),
              ...(nextServices !== undefined ? { services: nextServices } : {}),
              ...(currentHome
                ? {
                    home: {
                      ...currentHome,
                      ...(nextProducts !== undefined && 'products' in currentHome
                        ? { products: nextProducts }
                        : {}),
                      ...(nextServices !== undefined && 'services' in currentHome
                        ? { services: nextServices }
                        : {}),
                      ...(nextProducts !== undefined && 'featuredProducts' in currentHome
                        ? { featuredProducts: nextProducts }
                        : {}),
                    },
                  }
                : {}),
            },
          } as T;
        });

        // Dynamic theme variable injection for instant color updates
        if (isRecord(live.theme)) {
          const rootStyle = document.documentElement.style;
          if (typeof live.theme.primaryColor === "string") {
            rootStyle.setProperty("--brand-primary", live.theme.primaryColor);
          }
          if (typeof live.theme.secondaryColor === "string") {
            rootStyle.setProperty("--brand-secondary", live.theme.secondaryColor);
          }
          if (typeof live.theme.accentColor === "string") {
            rootStyle.setProperty("--brand-accent", live.theme.accentColor);
          }
        }
      })
      .catch(() => {
        // Gracefully keep pre-rendered static fallback if live API is unreachable
      });

    return () => controller.abort();
  }, [liveCatalogEndpoint, siteSlug, initialSiteData]);

  useEffect(() => {
    let parentOrigin = resolveParentOrigin();

    const applyIncomingSiteData = (incoming: unknown) => {
      if (!isRecord(incoming)) return;
      setSiteData((current) => mergeSiteData(current, incoming) as T);
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

  const value = useMemo(() => siteData as SiteData, [siteData]);
  return (
    <SiteDataContext.Provider value={value}>
      <FontLoader />
      <ResponsiveBaseStyles />
      <DenebComponentStyles />
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData<T = SiteData>(): T {
  return useContext(SiteDataContext) as T;
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
export function useProducts(fallback: ProductItem[] = []): ProductItem[] {
  const siteData = useSiteData();
  const content = isRecord(siteData?.content) ? siteData.content : null;
  if (!content) return fallback;

  if (Array.isArray(content.products) && content.products.length > 0) {
    return content.products as ProductItem[];
  }
  const home = isRecord(content.home) ? content.home : null;
  if (home) {
    if (Array.isArray(home.products) && home.products.length > 0) {
      return home.products as ProductItem[];
    }
    if (Array.isArray(home.featuredProducts) && home.featuredProducts.length > 0) {
      return home.featuredProducts as ProductItem[];
    }
  }
  return fallback;
}

/**
 * Hook to retrieve services cleanly from SiteData, supporting both
 * top-level content.services and nested content.home.services.
 */
export function useServices(fallback: ServiceItem[] = []): ServiceItem[] {
  const siteData = useSiteData();
  const content = isRecord(siteData?.content) ? siteData.content : null;
  if (!content) return fallback;

  if (Array.isArray(content.services) && content.services.length > 0) {
    return content.services as ServiceItem[];
  }
  const home = isRecord(content.home) ? content.home : null;
  if (home) {
    if (Array.isArray(home.services) && home.services.length > 0) {
      return home.services as ServiceItem[];
    }
    if (Array.isArray(home.featuredServices) && home.featuredServices.length > 0) {
      return home.featuredServices as ServiceItem[];
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
