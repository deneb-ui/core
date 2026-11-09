import {
  buildUniversalTemplateThemeCss,
  replaceTemplateColorLiterals,
  UNIVERSAL_TEMPLATE_THEME_STYLE_ID,
} from './universal-template-theme';
import { enforceSelectedTemplatePages } from './universal-page-selection';
import { installUniversalSectionNavigation } from './universal-section-navigation';

export const TEMPLATE_PREVIEW_FOCUS_BRIDGE_FILE =
  '__fivora-preview-focus-bridge.js';
export const TEMPLATE_PREVIEW_FOCUS_BRIDGE_VERSION = '55';

const PREVIOUS_PREVIEW_BRIDGE_ATTRIBUTE = `data-${['market', 'place'].join('')}-preview-focus-bridge`;

export function upsertTemplatePreviewFocusBridgeTag(
  html: string,
  scriptSource: string,
) {
  const scriptTag = `<script src="${scriptSource}" data-fivora-preview-focus-bridge></script>`;
  const existingBridgeTag = new RegExp(
    `<script\\b(?=[^>]*\\b(?:data-fivora-preview-focus-bridge|${PREVIOUS_PREVIEW_BRIDGE_ATTRIBUTE})\\b)[^>]*>\\s*<\\/script>`,
    'i',
  );

  if (existingBridgeTag.test(html)) {
    return html.replace(existingBridgeTag, scriptTag);
  }

  return /<\/body>/i.test(html)
    ? html.replace(/<\/body>/i, `${scriptTag}</body>`)
    : `${html}${scriptTag}`;
}

export function resolveTemplatePreviewParentOrigin(input: {
  currentOrigin: string;
  referrer?: string | null;
  rememberedOrigin?: string | null;
  ancestorOrigin?: string | null;
  accessibleParentOrigin?: string | null;
}) {
  const normalizeOrigin = (
    value?: string | null,
    baseOrigin?: string | null,
  ) => {
    if (!value || value.trim() === 'null') return null;
    try {
      const origin = new URL(value, baseOrigin ?? undefined).origin;
      return origin === 'null' ? null : origin;
    } catch {
      return null;
    }
  };

  const currentOrigin = normalizeOrigin(input.currentOrigin);
  const ancestorOrigin = normalizeOrigin(input.ancestorOrigin, currentOrigin);
  const accessibleParentOrigin = normalizeOrigin(
    input.accessibleParentOrigin,
    currentOrigin,
  );
  const referrerOrigin = normalizeOrigin(input.referrer, currentOrigin);
  const rememberedOrigin = normalizeOrigin(input.rememberedOrigin);

  // ancestorOrigins and an accessible parent window describe the current
  // embedder directly. A cross-origin referrer does too on the first document
  // load. During a full in-frame navigation the referrer becomes the previous
  // preview page, so retain the parent origin captured by the first page.
  return (
    ancestorOrigin ??
    accessibleParentOrigin ??
    (referrerOrigin && referrerOrigin !== currentOrigin
      ? referrerOrigin
      : null) ??
    rememberedOrigin ??
    referrerOrigin
  );
}

export function normalizeTemplatePreviewNavigationPath(pathname: string) {
  const root = pathname.match(
    /^(\/uploads\/generated-sites\/(?:template-preview|preview|live)\/[^/]+)/,
  )?.[1];
  if (!root) return pathname;

  let normalized = pathname;
  const duplicatedRoot = `${root}${root}`;
  while (normalized.startsWith(duplicatedRoot)) {
    normalized = `${root}${normalized.slice(duplicatedRoot.length)}`;
  }
  return normalized;
}

function fivoraPreviewFocusBridge(
  resolveParentOrigin: typeof resolveTemplatePreviewParentOrigin,
  buildUniversalThemeCss: typeof buildUniversalTemplateThemeCss,
  replaceColorLiterals: typeof replaceTemplateColorLiterals,
  universalThemeStyleId: string,
  enforceSelectedPages: typeof enforceSelectedTemplatePages,
  normalizePreviewNavigationPath: typeof normalizeTemplatePreviewNavigationPath,
  installSectionNavigation: typeof installUniversalSectionNavigation,
) {
  try {
    if (typeof Node !== 'undefined' && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(
        this: Node,
        child: T,
      ): T {
        if (child && child.parentNode !== this) {
          if (
            typeof console !== 'undefined' &&
            typeof console.warn === 'function'
          ) {
            console.warn(
              'PreviewBridge: removeChild on non-child node prevented from crashing React',
              child,
            );
          }
          return child;
        }
        return originalRemoveChild.apply(
          this,
          arguments as unknown as [T],
        ) as T;
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(
        this: Node,
        newNode: T,
        referenceNode: Node | null,
      ): T {
        if (referenceNode && referenceNode.parentNode !== this) {
          if (
            typeof console !== 'undefined' &&
            typeof console.warn === 'function'
          ) {
            console.warn(
              'PreviewBridge: insertBefore on non-child reference node prevented from crashing React',
              referenceNode,
            );
          }
          return newNode;
        }
        return originalInsertBefore.apply(
          this,
          arguments as unknown as [T, Node | null],
        ) as T;
      };
    }

    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-gramm', 'false');
      document.documentElement.setAttribute('data-gramm_editor', 'false');
      document.documentElement.setAttribute('data-enable-grammarly', 'false');
      document.documentElement.setAttribute('translate', 'no');
    }
  } catch {}
  const PREVIOUS_PREVIEW_PREFIX = `${['MARKET', 'PLACE'].join('')}_PREVIEW_`;
  const previousPreviewMessage = (suffix: string) =>
    `${PREVIOUS_PREVIEW_PREFIX}${suffix}`;
  const previousPreviewStorageKey = (suffix: string) =>
    `__${PREVIOUS_PREVIEW_PREFIX}${suffix}__`;
  const FOCUS_MESSAGE = 'FIVORA_PREVIEW_FOCUS_PAGE';
  const LEGACY_FOCUS_MESSAGE = previousPreviewMessage('FOCUS_PAGE');
  const FOCUS_RESULT_MESSAGE = 'FIVORA_PREVIEW_FOCUS_RESULT';
  const LEGACY_FOCUS_RESULT_MESSAGE = previousPreviewMessage('FOCUS_RESULT');
  const READY_MESSAGE = 'FIVORA_PREVIEW_READY';
  const LEGACY_READY_MESSAGE = previousPreviewMessage('READY');
  const ACTIVE_ATTRIBUTE = 'data-fivora-preview-active-field';
  const RESOLVED_PATH_ATTRIBUTE = 'data-fivora-resolved-field-path';
  const EMPTY_EDITABLE_ATTRIBUTE = 'data-fivora-empty-editable';
  const EMPTY_COLLECTION_ATTRIBUTE = 'data-fivora-empty-collection';
  const LIST_PATH_ATTRIBUTE = 'data-preview-list-path';
  const ITEM_PATH_ATTRIBUTE = 'data-preview-item-path';
  const STATIC_ATTRIBUTE = 'data-preview-static';
  const PENDING_KEY = '__FIVORA_UNIVERSAL_PREVIEW_FOCUS__';
  const RESOLVED_TARGETS_KEY = '__FIVORA_VISUAL_EDITOR_TARGETS__';
  const PARENT_ORIGIN_KEY = '__FIVORA_PREVIEW_PARENT_ORIGIN__';
  const LEGACY_PARENT_ORIGIN_KEY = previousPreviewStorageKey('PARENT_ORIGIN');
  const SITE_DATA_CACHE_KEY = '__FIVORA_PREVIEW_SITE_DATA_CACHE__';
  const LEGACY_SITE_DATA_CACHE_KEY =
    previousPreviewStorageKey('SITE_DATA_CACHE');
  const SITE_DATA_GLOBAL_KEY = '__FIVORA_PREVIEW_SITE_DATA__';
  const LEGACY_SITE_DATA_GLOBAL_KEY = previousPreviewStorageKey('SITE_DATA');
  const DATA_MESSAGE = 'FIVORA_PREVIEW_SITE_DATA';
  const LEGACY_DATA_MESSAGE = previousPreviewMessage('SITE_DATA');
  const DATA_APPLIED_MESSAGE = 'FIVORA_PREVIEW_SITE_DATA_APPLIED';
  const LEGACY_DATA_APPLIED_MESSAGE =
    previousPreviewMessage('SITE_DATA_APPLIED');
  const CONTENT_PATCH_MESSAGE = 'FIVORA_PREVIEW_CONTENT_PATCH';
  const LEGACY_CONTENT_PATCH_MESSAGE = previousPreviewMessage('CONTENT_PATCH');
  const STYLE_PATCH_MESSAGE = 'FIVORA_PREVIEW_STYLE_PATCH';
  const COLOR_REPLACEMENT_STYLE_ID = 'fivora-template-color-replacements';
  // One delayed relay is enough for late-mounting SiteDataProviders; more
  // relays re-merge large content payloads and freeze heavy templates.
  const SITE_DATA_RELAY_DELAYS_MS = [200];
  const SITE_DATA_PERSIST_DELAY_MS = 2500;
  // While typing, keep React/template relays rare. DOM patches carry live preview.
  const CONTENT_ONLY_RELAY_DELAY_MS = 1600;
  const CONTENT_ONLY_PERSIST_DELAY_MS = 12000;
  class TargetRegistry {
    private elementToPath = new WeakMap<Element, string>();
    private pathToElements = new Map<string, Set<Element>>();
    private dynamicTargets = new Set<Element>();

    getPath(element: Element): string | undefined {
      return this.elementToPath.get(element);
    }
    findTargets(path: string): Element[] {
      return Array.from(this.pathToElements.get(path) ?? []);
    }
    getDynamicTargets(): Element[] {
      return Array.from(this.dynamicTargets);
    }
    register(element: Element, path: string) {
      this.elementToPath.set(element, path);
      if (!this.pathToElements.has(path)) {
        this.pathToElements.set(path, new Set());
      }
      this.pathToElements.get(path)!.add(element);
      this.dynamicTargets.add(element);
    }
    clear() {
      this.pathToElements.clear();
      this.dynamicTargets.clear();
    }
  }

  const targetRegistry = new TargetRegistry();

  const TEXT_SELECTOR =
    'h1, h2, h3, h4, h5, h6, p, span, a, button, address, li, dt, dd, label, strong, em, small';
  let activeHighlights: Array<{
    target: HTMLElement;
    outline: string;
    outlineOffset: string;
    boxShadow: string;
    transition: string;
    scrollMarginTop: string;
    borderRadius: string;
  }> = [];
  const originalStylesheetCss = new Map<string, string>();
  let colorReplacementRequest = 0;
  let applyingSiteData = false;
  let pendingSiteData: unknown = null;
  let pendingSiteDataOptions:
    | {
        scheduleRelays?: boolean;
        persistImmediate?: boolean;
        fanOut?: boolean;
        colorReplacements?: boolean;
        contentOnly?: boolean;
      }
    | undefined;
  let siteDataRelayTimers: number[] = [];
  let siteDataPersistTimer: number | null = null;
  let latestPublishedSiteData: unknown = null;
  let lastAppliedThemeSignature = '';
  let lastColorReplacementSignature = '';
  let lastAppliedPagesSignature = '';

  type FocusContextValue = { key?: string; value?: string };
  type FocusContext = {
    collectionPath?: string;
    fieldKey?: string;
    itemIndex?: number;
    itemValues?: FocusContextValue[];
  };
  type FocusPayload = {
    type?: string;
    requestId?: string;
    pageKey?: string;
    pageLabel?: string;
    pageRoute?: string;
    fieldPath?: string;
    /** Equivalent schema paths (e.g. common.email + contact.email). */
    fieldPaths?: string[];
    fieldValue?: string | number | boolean;
    fieldMatchValues?: Array<string | number | boolean>;
    fieldContext?: FocusContext;
    focusOnly?: boolean;
    awaitingNavigation?: boolean;
  };

  function clearPendingFocus() {
    try {
      window.sessionStorage.removeItem(PENDING_KEY);
    } catch {
      // Storage may be disabled.
    }
  }
  function readRememberedParentOrigin() {
    try {
      return (
        window.sessionStorage.getItem(PARENT_ORIGIN_KEY) ||
        window.sessionStorage.getItem(LEGACY_PARENT_ORIGIN_KEY)
      );
    } catch {
      return null;
    }
  }

  function rememberParentOrigin(origin: string | null) {
    if (!origin) return;
    try {
      window.sessionStorage.setItem(PARENT_ORIGIN_KEY, origin);
    } catch {
      // The direct parent/source checks still work without session storage.
    }
  }

  function clearSiteDataRelayTimers() {
    for (const timer of siteDataRelayTimers) {
      window.clearTimeout(timer);
    }
    siteDataRelayTimers = [];
  }

  function collectSiteDataRelayOrigins() {
    const origins = new Set<string>();
    if (parentOrigin) origins.add(parentOrigin);
    origins.add(window.location.origin);
    const remembered = readRememberedParentOrigin();
    if (remembered) origins.add(remembered);
    try {
      if (document.referrer) {
        const referrerOrigin = new URL(document.referrer).origin;
        if (referrerOrigin && referrerOrigin !== 'null') {
          origins.add(referrerOrigin);
        }
      }
    } catch {
      // Referrer may be opaque or unparsable.
    }
    try {
      const ancestor = window.location.ancestorOrigins?.item(0);
      if (ancestor) origins.add(ancestor);
    } catch {
      // ancestorOrigins is not available in every browser.
    }
    return Array.from(origins);
  }

  function relaySiteDataToTemplateRuntime(
    siteData: unknown,
    options?: { fanOut?: boolean },
  ) {
    // Prefer a single-origin relay on the hydrate critical path. Full fan-out
    // is delayed so we avoid N structured clones before first paint.
    const allOrigins = collectSiteDataRelayOrigins();
    const origins = options?.fanOut ? allOrigins : allOrigins.slice(0, 1);
    for (const origin of origins) {
      // Approved packages can contain either the current Fivora runtime or
      // the legacy Fivora runtime. Relay both protocol names so updating
      // the injected bridge never strands an already-approved template on its
      // bundled demo data.
      for (const type of [DATA_MESSAGE, LEGACY_DATA_MESSAGE]) {
        try {
          window.dispatchEvent(
            new MessageEvent('message', {
              // Mark relays so this bridge never re-enters publishSiteData on
              // its own synthetic events (that caused recursive publishes).
              data: {
                type,
                siteData,
                __fivoraBridgeRelay: true,
              },
              origin,
              source: window.parent,
            }),
          );
        } catch {
          // Some environments reject synthetic MessageEvent construction.
        }
      }
    }
  }

  function persistSiteData(
    siteData: unknown,
    options?: { immediate?: boolean },
  ) {
    latestPublishedSiteData = siteData;
    try {
      (window as unknown as Record<string, unknown>)[SITE_DATA_GLOBAL_KEY] =
        siteData;
      (window as unknown as Record<string, unknown>)[
        LEGACY_SITE_DATA_GLOBAL_KEY
      ] = siteData;
    } catch {
      // Window may be non-extensible in locked-down embeds.
    }

    const writeSessionCache = () => {
      siteDataPersistTimer = null;
      try {
        const serialized = JSON.stringify(latestPublishedSiteData);
        window.sessionStorage.setItem(SITE_DATA_CACHE_KEY, serialized);
        window.sessionStorage.setItem(LEGACY_SITE_DATA_CACHE_KEY, serialized);
      } catch {
        // Storage may be disabled or over quota for large templates.
      }
    };

    if (options?.immediate) {
      if (siteDataPersistTimer !== null) {
        window.clearTimeout(siteDataPersistTimer);
        siteDataPersistTimer = null;
      }
      writeSessionCache();
      return;
    }

    if (siteDataPersistTimer !== null) {
      window.clearTimeout(siteDataPersistTimer);
    }
    siteDataPersistTimer = window.setTimeout(
      writeSessionCache,
      SITE_DATA_PERSIST_DELAY_MS,
    );
  }

  function pagesSignature(siteData: unknown) {
    const record =
      siteData && typeof siteData === 'object' && !Array.isArray(siteData)
        ? (siteData as Record<string, unknown>)
        : null;
    const requirements =
      record?.requirements &&
      typeof record.requirements === 'object' &&
      !Array.isArray(record.requirements)
        ? (record.requirements as Record<string, unknown>)
        : null;
    const template =
      record?.template &&
      typeof record.template === 'object' &&
      !Array.isArray(record.template)
        ? (record.template as Record<string, unknown>)
        : null;
    const structure =
      template?.structure &&
      typeof template.structure === 'object' &&
      !Array.isArray(template.structure)
        ? (template.structure as Record<string, unknown>)
        : null;
    try {
      return JSON.stringify({
        requiredPages: requirements?.requiredPages ?? null,
        pages: structure?.pages ?? null,
        pageDefinitions:
          template?.pageDefinitions ?? structure?.pageDefinitions ?? null,
      });
    } catch {
      return String(Date.now());
    }
  }

  let contentOnlyRelayTimer: number | null = null;
  let contentOnlyPersistTimer: number | null = null;

  function parseFieldPath(path: string): Array<string | number> {
    const parts: Array<string | number> = [];
    for (const match of path.matchAll(/([^.[\]]+)|\[(\d+)\]/g)) {
      if (match[2] !== undefined) {
        parts.push(Number(match[2]));
      } else if (match[1]) {
        parts.push(match[1]);
      }
    }
    return parts;
  }

  function setValueAtPath(
    content: unknown,
    path: Array<string | number>,
    value: unknown,
  ): unknown {
    if (path.length === 0) return content;
    const setAt = (node: unknown, depth: number): unknown => {
      const part = path[depth];
      const isLast = depth === path.length - 1;
      const nextPart = isLast ? undefined : path[depth + 1];
      if (typeof part === 'number') {
        const source = Array.isArray(node) ? node : [];
        const copy = source.slice();
        if (isLast) {
          copy[part] = value;
          return copy;
        }
        const child = copy[part];
        copy[part] =
          child === undefined || child === null || typeof child !== 'object'
            ? setAt(typeof nextPart === 'number' ? [] : {}, depth + 1)
            : setAt(child, depth + 1);
        return copy;
      }
      const source =
        node && typeof node === 'object' && !Array.isArray(node)
          ? (node as Record<string, unknown>)
          : {};
      const copy: Record<string, unknown> = { ...source };
      if (isLast) {
        copy[part] = value;
        return copy;
      }
      const child = copy[part];
      copy[part] =
        child === undefined || child === null || typeof child !== 'object'
          ? setAt(typeof nextPart === 'number' ? [] : {}, depth + 1)
          : setAt(child, depth + 1);
      return copy;
    };
    return setAt(content, 0);
  }

  function readPublishedContent(): unknown {
    const previous =
      latestPublishedSiteData &&
      typeof latestPublishedSiteData === 'object' &&
      !Array.isArray(latestPublishedSiteData)
        ? (latestPublishedSiteData as Record<string, unknown>)
        : {};
    return previous.content ?? {};
  }

  function writePublishedContent(content: unknown) {
    const previous =
      latestPublishedSiteData &&
      typeof latestPublishedSiteData === 'object' &&
      !Array.isArray(latestPublishedSiteData)
        ? (latestPublishedSiteData as Record<string, unknown>)
        : {};
    const nextSiteData = { ...previous, content };
    latestPublishedSiteData = nextSiteData;
    try {
      (window as unknown as Record<string, unknown>)[SITE_DATA_GLOBAL_KEY] =
        nextSiteData;
      (window as unknown as Record<string, unknown>)[
        LEGACY_SITE_DATA_GLOBAL_KEY
      ] = nextSiteData;
    } catch {
      // Window may be non-extensible in locked-down embeds.
    }
    return nextSiteData;
  }

  function scheduleContentOnlyRelay() {
    if (contentOnlyRelayTimer !== null) {
      window.clearTimeout(contentOnlyRelayTimer);
    }
    contentOnlyRelayTimer = window.setTimeout(() => {
      contentOnlyRelayTimer = null;
      if (latestPublishedSiteData == null) return;
      relaySiteDataToTemplateRuntime(latestPublishedSiteData, {
        fanOut: false,
      });
    }, CONTENT_ONLY_RELAY_DELAY_MS);
  }

  function scheduleContentOnlyPersist() {
    if (contentOnlyPersistTimer !== null) {
      window.clearTimeout(contentOnlyPersistTimer);
    }
    contentOnlyPersistTimer = window.setTimeout(() => {
      contentOnlyPersistTimer = null;
      if (latestPublishedSiteData == null) return;
      const idleWindow = window as Window & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
          options?: IdleRequestOptions,
        ) => number;
      };
      if (typeof idleWindow.requestIdleCallback === 'function') {
        idleWindow.requestIdleCallback(
          () => {
            if (latestPublishedSiteData == null) return;
            persistSiteData(latestPublishedSiteData, { immediate: true });
          },
          { timeout: 4000 },
        );
        return;
      }
      persistSiteData(latestPublishedSiteData, { immediate: true });
    }, CONTENT_ONLY_PERSIST_DELAY_MS);
  }

  function applyDomFieldValue(fieldPath: string, value: unknown) {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        `[data-preview-field-path="${CSS.escape(fieldPath)}"], ` +
          `[${RESOLVED_PATH_ATTRIBUTE}="${CSS.escape(fieldPath)}"]`,
      ),
    );
    for (const target of targets) {
      if (activeInlineEdit?.target === target) continue;
      // Icon names are data, not SVG text. The provider relay renders the glyph.
      if (target.getAttribute('data-preview-control') === 'icon-picker') continue;
      if (target.tagName === 'IMG') {
        if (typeof value === 'string' && value.trim()) {
          target.setAttribute('src', value);
        }
        continue;
      }
      if (
        typeof value !== 'string' &&
        typeof value !== 'number' &&
        typeof value !== 'boolean'
      ) {
        continue;
      }
      const text =
        (target.getAttribute('data-fivora-value-prefix') ?? '') +
        String(value) +
        (target.getAttribute('data-fivora-value-suffix') ?? '');
      if (target.childElementCount === 0) {
        target.textContent = text;
      } else {
        // Keep simple leaf updates cheap; full React relay reconciles structure later.
        const textNode = Array.from(target.childNodes).find(
          (node) =>
            node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
        );
        if (textNode) {
          textNode.textContent = text;
        } else {
          target.textContent = text;
        }
      }
      if (editModeActive) {
        const isEmpty = text.trim().length === 0;
        if (isEmpty) {
          target.setAttribute(EMPTY_EDITABLE_ATTRIBUTE, 'true');
        } else {
          target.removeAttribute(EMPTY_EDITABLE_ATTRIBUTE);
        }
      }
    }
  }

  function publishContentPatches(
    patches: Array<{ path: string; value: unknown }>,
  ) {
    if (!Array.isArray(patches) || patches.length === 0) return;
    let content = readPublishedContent();
    for (const patch of patches) {
      if (!patch || typeof patch.path !== 'string' || !patch.path.trim()) {
        continue;
      }
      const pathParts = parseFieldPath(patch.path);
      if (pathParts.length === 0) continue;
      content = setValueAtPath(content, pathParts, patch.value);
      applyDomFieldValue(patch.path, patch.value);
    }
    writePublishedContent(content);
    // DOM already shows the edit. Coalesce the expensive template React sync.
    scheduleContentOnlyRelay();
    scheduleContentOnlyPersist();
  }

  function publishContentOnly(content: unknown) {
    writePublishedContent(content);
    // Do not relay on every keystroke — structured-clone + full SPA reconcile
    // freezes low-end phones and mid-range PCs. DOM patches + delayed relay.
    scheduleContentOnlyRelay();
    scheduleContentOnlyPersist();
  }

  function publishElementStylePatch(fieldPath: string, styles: unknown) {
    if (
      !/^[a-zA-Z0-9_.:\[\]-]{1,180}$/.test(fieldPath) ||
      !styles ||
      typeof styles !== 'object' ||
      Array.isArray(styles)
    ) {
      return;
    }
    const previous =
      latestPublishedSiteData &&
      typeof latestPublishedSiteData === 'object' &&
      !Array.isArray(latestPublishedSiteData)
        ? (latestPublishedSiteData as Record<string, unknown>)
        : {};
    const template =
      previous.template &&
      typeof previous.template === 'object' &&
      !Array.isArray(previous.template)
        ? (previous.template as Record<string, unknown>)
        : {};
    const structure =
      template.structure &&
      typeof template.structure === 'object' &&
      !Array.isArray(template.structure)
        ? (template.structure as Record<string, unknown>)
        : {};
    const theme =
      (structure.theme &&
      typeof structure.theme === 'object' &&
      !Array.isArray(structure.theme)
        ? (structure.theme as Record<string, unknown>)
        : template.theme &&
          typeof template.theme === 'object' &&
          !Array.isArray(template.theme)
        ? (template.theme as Record<string, unknown>)
        : {}) || {};
    const elementStyles =
      theme.elementStyles &&
      typeof theme.elementStyles === 'object' &&
      !Array.isArray(theme.elementStyles)
        ? (theme.elementStyles as Record<string, unknown>)
        : {};
    const hasAnyProp =
      styles &&
      typeof styles === 'object' &&
      Object.values(styles).some(
        (v) => v !== undefined && v !== null && v !== '',
      );
    const nextElementStyles = { ...elementStyles };
    if (hasAnyProp) {
      nextElementStyles[fieldPath] = styles;
    } else {
      delete nextElementStyles[fieldPath];
    }
    const nextTheme = {
      ...theme,
      designCustomizationVersion: 1,
      elementStyles: nextElementStyles,
    };
    const nextTemplate = {
      ...template,
      theme: nextTheme,
      structure: { ...structure, theme: nextTheme },
    };
    const nextSiteData = { ...previous, template: nextTemplate };
    latestPublishedSiteData = nextSiteData;
    applyUniversalTheme(nextSiteData);
    applyElementStyleDirectly(fieldPath, styles);
    scheduleContentOnlyPersist();
  }

  function applyElementStyleDirectly(fieldPath: string, styles: unknown) {
    if (!fieldPath || !styles || typeof styles !== 'object' || Array.isArray(styles)) {
      return;
    }
    const raw = styles as Record<string, unknown>;
    let targets: HTMLElement[] = [];
    if (fieldPath.includes(':')) {
      const [listPrefix, subPart] = fieldPath.split(':');
      if (subPart === 'card') {
        targets = Array.from(
          document.querySelectorAll<HTMLElement>(
            `[data-preview-list-path="${CSS.escape(listPrefix)}"] [data-preview-item-path], ` +
            `[data-preview-list-path="${CSS.escape(listPrefix)}"] .card, ` +
            `[data-preview-list-path="${CSS.escape(listPrefix)}"] article`
          )
        );
      } else if (subPart) {
        targets = Array.from(
          document.querySelectorAll<HTMLElement>(
            `[data-preview-list-path="${CSS.escape(listPrefix)}"] [data-preview-field-path$=".${CSS.escape(subPart)}"], ` +
            `[data-preview-list-path="${CSS.escape(listPrefix)}"] [data-field-path$=".${CSS.escape(subPart)}"]`
          )
        );
      }
    } else {
      targets = Array.from(
        document.querySelectorAll<HTMLElement>(
          `[data-preview-field-path="${CSS.escape(fieldPath)}"], ` +
          `[data-preview-item-path="${CSS.escape(fieldPath)}"], ` +
          `[data-preview-style-target="${CSS.escape(fieldPath)}"], ` +
          `[data-field-path="${CSS.escape(fieldPath)}"], ` +
          `[data-content-path="${CSS.escape(fieldPath)}"]`
        )
      );
    }
    const toCssVal = (v: unknown) => {
      if (v === undefined || v === null || v === '') return '';
      if (typeof v === 'number') return `${v}px`;
      return String(v);
    };
    for (const el of targets) {
      if (raw.color) {
        el.style.setProperty('color', String(raw.color), 'important');
        el.style.setProperty('--deneb-color', String(raw.color));
      } else {
        el.style.removeProperty('color');
        el.style.removeProperty('--deneb-color');
      }
      if (raw.textAlign) {
        el.style.setProperty('text-align', String(raw.textAlign), 'important');
        el.style.setProperty('--deneb-text-align', String(raw.textAlign));
      } else {
        el.style.removeProperty('text-align');
        el.style.removeProperty('--deneb-text-align');
      }
      if (raw.fontSize) {
        const sz = toCssVal(raw.fontSize);
        el.style.setProperty('font-size', sz, 'important');
        el.style.setProperty('--deneb-font-size', sz);
      } else {
        el.style.removeProperty('font-size');
        el.style.removeProperty('--deneb-font-size');
      }
      if (raw.fontFamily) {
        el.style.setProperty('font-family', String(raw.fontFamily), 'important');
        el.style.setProperty('--deneb-font-family', String(raw.fontFamily));
      } else {
        el.style.removeProperty('font-family');
        el.style.removeProperty('--deneb-font-family');
      }
      if (raw.lineHeight) {
        el.style.setProperty('line-height', String(raw.lineHeight), 'important');
        el.style.setProperty('--deneb-line-height', String(raw.lineHeight));
      } else {
        el.style.removeProperty('line-height');
        el.style.removeProperty('--deneb-line-height');
      }
      if (raw.fontWeight) {
        el.style.setProperty('font-weight', String(raw.fontWeight), 'important');
        el.style.setProperty('--deneb-font-weight', String(raw.fontWeight));
      } else {
        el.style.removeProperty('font-weight');
        el.style.removeProperty('--deneb-font-weight');
      }
      if (raw.letterSpacing) {
        el.style.setProperty('letter-spacing', toCssVal(raw.letterSpacing), 'important');
        el.style.setProperty('--deneb-letter-spacing', toCssVal(raw.letterSpacing));
      } else {
        el.style.removeProperty('letter-spacing');
        el.style.removeProperty('--deneb-letter-spacing');
      }
      if (raw.textTransform) {
        el.style.setProperty('text-transform', String(raw.textTransform), 'important');
        el.style.setProperty('--deneb-text-transform', String(raw.textTransform));
      } else {
        el.style.removeProperty('text-transform');
        el.style.removeProperty('--deneb-text-transform');
      }
      if (raw.backgroundColor) {
        el.style.setProperty('background-color', String(raw.backgroundColor), 'important');
        el.style.setProperty('background', String(raw.backgroundColor), 'important');
        el.style.setProperty('--deneb-card-bg', String(raw.backgroundColor));
      } else {
        el.style.removeProperty('background-color');
        el.style.removeProperty('background');
        el.style.removeProperty('--deneb-card-bg');
      }
      if (raw.borderRadius) {
        const rad = toCssVal(raw.borderRadius);
        el.style.setProperty('border-radius', rad, 'important');
        el.style.setProperty('--deneb-card-radius', rad);
      } else {
        el.style.removeProperty('border-radius');
        el.style.removeProperty('--deneb-card-radius');
      }
      if (raw.padding !== undefined) {
        const p = toCssVal(raw.padding);
        el.style.setProperty('padding', p, 'important');
        el.style.setProperty('--deneb-card-pt', p);
      } else {
        el.style.removeProperty('padding');
        el.style.removeProperty('--deneb-card-pt');
      }
      if (raw.paddingTop !== undefined) el.style.setProperty('padding-top', toCssVal(raw.paddingTop), 'important');
      else el.style.removeProperty('padding-top');
      if (raw.paddingBottom !== undefined) el.style.setProperty('padding-bottom', toCssVal(raw.paddingBottom), 'important');
      else el.style.removeProperty('padding-bottom');
      if (raw.paddingLeft !== undefined) el.style.setProperty('padding-left', toCssVal(raw.paddingLeft), 'important');
      else el.style.removeProperty('padding-left');
      if (raw.paddingRight !== undefined) el.style.setProperty('padding-right', toCssVal(raw.paddingRight), 'important');
      else el.style.removeProperty('padding-right');

      if (raw.boxShadow) {
        el.style.setProperty('box-shadow', String(raw.boxShadow), 'important');
        el.style.setProperty('--deneb-card-shadow', String(raw.boxShadow));
      } else {
        el.style.removeProperty('box-shadow');
        el.style.removeProperty('--deneb-card-shadow');
      }
      if (raw.borderColor) {
        el.style.setProperty('border-color', String(raw.borderColor), 'important');
        el.style.setProperty('--deneb-card-border-c', String(raw.borderColor));
      } else {
        el.style.removeProperty('border-color');
        el.style.removeProperty('--deneb-card-border-c');
      }
      if (raw.borderWidth) {
        const bw = toCssVal(raw.borderWidth);
        el.style.setProperty('border-width', bw, 'important');
        el.style.setProperty('border-style', 'solid', 'important');
        el.style.setProperty('--deneb-card-border-w', bw);
      } else {
        el.style.removeProperty('border-width');
        el.style.removeProperty('border-style');
        el.style.removeProperty('--deneb-card-border-w');
      }
      if (raw.marginTop !== undefined) el.style.setProperty('margin-top', toCssVal(raw.marginTop), 'important');
      else el.style.removeProperty('margin-top');
      if (raw.marginBottom !== undefined) el.style.setProperty('margin-bottom', toCssVal(raw.marginBottom), 'important');
      else el.style.removeProperty('margin-bottom');
      if (raw.marginLeft !== undefined) el.style.setProperty('margin-left', toCssVal(raw.marginLeft), 'important');
      else el.style.removeProperty('margin-left');
      if (raw.marginRight !== undefined) el.style.setProperty('margin-right', toCssVal(raw.marginRight), 'important');
      else el.style.removeProperty('margin-right');
      if (raw.gap !== undefined) el.style.setProperty('gap', toCssVal(raw.gap), 'important');
      else el.style.removeProperty('gap');
      if (raw.display) el.style.setProperty('display', String(raw.display), 'important');
      else el.style.removeProperty('display');
      if (raw.order !== undefined && raw.order !== null && raw.order !== '') el.style.setProperty('order', String(raw.order), 'important');
      else el.style.removeProperty('order');
    }
  }

  function publishSiteData(
    siteData: unknown,
    options?: {
      scheduleRelays?: boolean;
      persistImmediate?: boolean;
      fanOut?: boolean;
      colorReplacements?: boolean;
      contentOnly?: boolean;
    },
  ) {
    if (options?.contentOnly) {
      const record =
        siteData && typeof siteData === 'object' && !Array.isArray(siteData)
          ? (siteData as Record<string, unknown>)
          : null;
      publishContentOnly(record?.content ?? siteData);
      return;
    }
    if (contentOnlyRelayTimer !== null) {
      window.clearTimeout(contentOnlyRelayTimer);
      contentOnlyRelayTimer = null;
    }
    if (contentOnlyPersistTimer !== null) {
      window.clearTimeout(contentOnlyPersistTimer);
      contentOnlyPersistTimer = null;
    }
    // Coalesce to the latest payload instead of dropping concurrent applies.
    // Rapid READY + retries + live edits used to lose the newest site data.
    if (applyingSiteData) {
      pendingSiteData = siteData;
      pendingSiteDataOptions = options;
      return;
    }
    applyingSiteData = true;
    try {
      persistSiteData(siteData, { immediate: options?.persistImmediate });
      applySelectedPages(siteData);
      applyUniversalTheme(siteData, {
        colorReplacements: options?.colorReplacements === true,
      });
      relaySiteDataToTemplateRuntime(siteData, {
        fanOut: options?.fanOut === true,
      });
      if (options?.scheduleRelays !== false) {
        clearSiteDataRelayTimers();
        for (const delay of SITE_DATA_RELAY_DELAYS_MS) {
          siteDataRelayTimers.push(
            window.setTimeout(() => {
              if (latestPublishedSiteData == null) return;
              relaySiteDataToTemplateRuntime(latestPublishedSiteData, {
                fanOut: true,
              });
            }, delay),
          );
        }
      }
    } finally {
      applyingSiteData = false;
      if (pendingSiteData != null) {
        const nextSiteData = pendingSiteData;
        const nextOptions = pendingSiteDataOptions;
        pendingSiteData = null;
        pendingSiteDataOptions = undefined;
        // Defer so a same-tick relay cannot recurse through finally forever.
        window.setTimeout(() => {
          publishSiteData(nextSiteData, nextOptions);
        }, 0);
      }
    }
  }

  function acknowledgeSiteDataApplied(options?: { full?: boolean }) {
    // Ack only after the next paint so React SiteDataProvider can commit
    // merchant content before the parent clears the hydrate lock.
    const full = options?.full !== false;
    const deferColorPolish =
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator.hardwareConcurrency != null &&
          navigator.hardwareConcurrency <= 4)) === true;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        try {
          postToParent({ type: DATA_APPLIED_MESSAGE, full });
          postToParent({ type: LEGACY_DATA_APPLIED_MESSAGE, full });
        } catch {
          // Parent overlay still clears on a timeout fallback.
        }
        // Literal stylesheet color rewrites are polish — run after unlock.
        const polished = latestPublishedSiteData;
        if (polished == null) return;
        const run = () =>
          applyUniversalTheme(polished, { colorReplacements: true });
        if (!deferColorPolish) {
          window.setTimeout(run, 0);
          return;
        }
        const requestIdle = (
          window as Window & {
            requestIdleCallback?: (
              callback: () => void,
              options?: { timeout: number },
            ) => number;
          }
        ).requestIdleCallback;
        if (typeof requestIdle === 'function') {
          requestIdle(run, { timeout: 4000 });
        } else {
          window.setTimeout(run, 1200);
        }
      });
    });
  }

  const ancestorOrigin = (() => {
    try {
      return window.location.ancestorOrigins?.item(0) ?? null;
    } catch {
      return null;
    }
  })();
  const accessibleParentOrigin = (() => {
    try {
      return window.parent !== window ? window.parent.location.origin : null;
    } catch {
      return null;
    }
  })();
  let parentOrigin = resolveParentOrigin({
    currentOrigin: window.location.origin,
    referrer: document.referrer,
    rememberedOrigin: readRememberedParentOrigin(),
    ancestorOrigin,
    accessibleParentOrigin,
  });
  rememberParentOrigin(parentOrigin);

  function isTrustedParentMessage(event: MessageEvent) {
    if (event.source !== window.parent) return false;
    if (parentOrigin) return event.origin === parentOrigin;

    // Referrer information can be intentionally suppressed. In that case,
    // trust only the direct parent window, reject opaque origins, and pin the
    // first concrete parent origin for every later command.
    try {
      const candidateOrigin = new URL(event.origin).origin;
      if (candidateOrigin === 'null') return false;
      parentOrigin = candidateOrigin;
      rememberParentOrigin(candidateOrigin);
      return true;
    } catch {
      return false;
    }
  }

  function postToParent(message: unknown) {
    window.parent.postMessage(message, parentOrigin ?? '*');
  }

  function postFocusResult(
    payload: FocusPayload,
    result: 'exact' | 'heuristic' | 'page' | 'missing',
    occurrences = 0,
  ) {
    if (!payload.requestId) return;
    postToParent({
      type: FOCUS_RESULT_MESSAGE,
      requestId: payload.requestId,
      result,
      fieldPath: payload.fieldPath ?? null,
      pageRoute: payload.pageRoute ?? null,
      occurrences,
    });
    postToParent({
      type: LEGACY_FOCUS_RESULT_MESSAGE,
      requestId: payload.requestId,
      result,
      fieldPath: payload.fieldPath ?? null,
      pageRoute: payload.pageRoute ?? null,
      occurrences,
    });
  }

  function announceReady() {
    try {
      postToParent({
        type: READY_MESSAGE,
        pathname: window.location.pathname,
      });
      postToParent({
        type: LEGACY_READY_MESSAGE,
        pathname: window.location.pathname,
      });
    } catch {
      // The preview still works when embedded messaging is unavailable.
    }
  }

  async function applyTemplateColorReplacements(theme: unknown) {
    const request = ++colorReplacementRequest;
    const record =
      theme && typeof theme === 'object' && !Array.isArray(theme)
        ? (theme as Record<string, unknown>)
        : null;
    const replacements = record?.colorReplacements;
    const existing = document.getElementById(COLOR_REPLACEMENT_STYLE_ID);
    if (
      !replacements ||
      typeof replacements !== 'object' ||
      Array.isArray(replacements) ||
      Object.keys(replacements).length === 0
    ) {
      existing?.remove();
      return;
    }

    const stylesheets = Array.from(
      document.querySelectorAll<HTMLLinkElement>(
        'link[rel="stylesheet"][href]',
      ),
    );
    const transformed = await Promise.all(
      stylesheets.map(async (link) => {
        const href = link.href;
        let source = originalStylesheetCss.get(href);
        if (source === undefined) {
          const response = await fetch(href, { credentials: 'same-origin' });
          if (!response.ok) return '';
          source = await response.text();
          originalStylesheetCss.set(href, source);
        }
        const replaced = replaceColorLiterals(source, replacements);
        return replaced === source ? '' : replaced;
      }),
    );
    if (request !== colorReplacementRequest) return;

    const css = transformed.filter(Boolean).join('\n');
    if (!css) {
      existing?.remove();
      return;
    }
    const style =
      existing instanceof HTMLStyleElement
        ? existing
        : document.createElement('style');
    style.id = COLOR_REPLACEMENT_STYLE_ID;
    style.textContent = css;
    if (!style.isConnected) document.head.appendChild(style);
  }

  function applyUniversalTheme(
    siteData: unknown,
    options?: { colorReplacements?: boolean },
  ) {
    const record =
      siteData && typeof siteData === 'object' && !Array.isArray(siteData)
        ? (siteData as Record<string, unknown>)
        : null;
    const template =
      record?.template &&
      typeof record.template === 'object' &&
      !Array.isArray(record.template)
        ? (record.template as Record<string, unknown>)
        : null;
    const structure =
      template?.structure &&
      typeof template.structure === 'object' &&
      !Array.isArray(template.structure)
        ? (template.structure as Record<string, unknown>)
        : null;
    const theme =
      structure?.theme &&
      typeof structure.theme === 'object' &&
      !Array.isArray(structure.theme)
        ? structure.theme
        : template?.theme &&
          typeof template.theme === 'object' &&
          !Array.isArray(template.theme)
        ? template.theme
        : null;
    const themeSignature = (() => {
      try {
        return JSON.stringify(theme ?? null);
      } catch {
        return String(Date.now());
      }
    })();
    const themeChanged = themeSignature !== lastAppliedThemeSignature;
    if (themeChanged) {
      lastAppliedThemeSignature = themeSignature;
      const themeRecord =
        theme && typeof theme === 'object' && !Array.isArray(theme)
          ? (theme as Record<string, unknown>)
          : null;
      const themeBg =
        typeof themeRecord?.backgroundColor === 'string'
          ? themeRecord.backgroundColor
          : typeof themeRecord?.background === 'string'
            ? themeRecord.background
            : '';
      const isThemeDark =
        themeBg && /^#[0-9a-f]{3,6}$/i.test(themeBg.trim())
          ? (() => {
              const h = themeBg.trim().toLowerCase();
              const f =
                h.length === 4
                  ? `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`
                  : h;
              const r = Number.parseInt(f.slice(1, 3), 16);
              const g = Number.parseInt(f.slice(3, 5), 16);
              const b = Number.parseInt(f.slice(5, 7), 16);
              return (r * 299 + g * 587 + b * 114) / 1000 < 130;
            })()
          : false;

      if (isThemeDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        if (document.body) {
          document.body.classList.add('dark');
          document.body.setAttribute('data-theme', 'dark');
        }
      } else if (themeBg) {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        if (document.body) {
          document.body.classList.remove('dark');
          document.body.setAttribute('data-theme', 'light');
        }
      }

      const css = buildUniversalThemeCss(theme);
      const existing = document.getElementById(universalThemeStyleId);
      if (!css) {
        existing?.remove();
      } else {
        const style =
          existing instanceof HTMLStyleElement
            ? existing
            : document.createElement('style');
        style.id = universalThemeStyleId;
        style.textContent = css;
        if (!style.isConnected) document.head.appendChild(style);
      }
    }
    if (options?.colorReplacements) {
      if (themeSignature === lastColorReplacementSignature) {
        return;
      }
      lastColorReplacementSignature = themeSignature;
      void applyTemplateColorReplacements(theme).catch(() => {
        // Semantic token overrides still work if a stylesheet cannot be read.
      });
    }
  }

  function applySelectedPages(siteData: unknown) {
    const signature = pagesSignature(siteData);
    if (signature === lastAppliedPagesSignature) {
      return;
    }
    lastAppliedPagesSignature = signature;
    enforceSelectedPages(siteData, document);
    window.setTimeout(() => enforceSelectedPages(siteData, document), 300);
  }

  function normalizeText(value: unknown) {
    return String(value ?? '')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  function valueFragments(value: unknown) {
    const original = String(value ?? '').trim();
    if (!original) return [];

    const fragments = original
      .split(/[,;|\n\r]+/)
      .map((part) => normalizeText(part))
      .filter((part) => part.length >= 3);

    return Array.from(new Set([normalizeText(original), ...fragments])).filter(
      (part) => part.length >= 2,
    );
  }

  function isImageValue(value: unknown, key?: string) {
    const normalizedKey = normalizeText(key);
    const normalizedValue = normalizeText(value);
    return (
      /image|photo|logo|banner|thumbnail|cover/.test(normalizedKey) ||
      /^(https?:|data:|blob:|\/)/.test(normalizedValue)
    );
  }

  function extractImageCandidates(
    image: HTMLElement | HTMLImageElement,
  ): string[] {
    const candidates = new Set<string>();
    const raw = image.getAttribute('src') || '';
    if (raw) candidates.add(raw);
    if ('src' in image && (image as HTMLImageElement).src) {
      candidates.add((image as HTMLImageElement).src);
    }
    if ('currentSrc' in image && (image as HTMLImageElement).currentSrc) {
      candidates.add((image as HTMLImageElement).currentSrc);
    }
    const srcset = image.getAttribute('srcset');
    if (srcset) {
      srcset.split(',').forEach((part) => {
        const url = part.trim().split(/\s+/)[0];
        if (url) candidates.add(url);
      });
    }
    for (const attr of [
      'data-src',
      'data-original',
      'data-fallback',
      'data-nimg',
      'data-image',
      'data-url',
    ]) {
      const val = image.getAttribute(attr);
      if (val && val !== '1') candidates.add(val);
    }
    if (image.style.backgroundImage) {
      const bgMatch = image.style.backgroundImage.match(
        /url\(["']?([^"']+)["']?\)/i,
      );
      if (bgMatch?.[1]) candidates.add(bgMatch[1]);
    }
    for (const urlStr of Array.from(candidates)) {
      try {
        const parsed = new URL(urlStr, window.location.href);
        const nextUrl = parsed.searchParams.get('url');
        if (nextUrl) {
          candidates.add(nextUrl);
          try {
            candidates.add(decodeURIComponent(nextUrl));
          } catch {}
        }
      } catch {}
    }
    return Array.from(candidates).filter(Boolean);
  }

  function imageMatchesValue(image: HTMLImageElement, value: unknown) {
    const expected = String(value ?? '').trim();
    if (!expected) return false;

    const candidates = extractImageCandidates(image);
    if (candidates.length === 0) return false;

    const expectedClean = expected.split('?')[0].replace(/\\/g, '/');
    const expectedFile = expectedClean.split('/').pop()?.toLowerCase();

    for (const candidate of candidates) {
      if (candidate === expected) return true;
      try {
        if (
          new URL(candidate, window.location.href).href ===
          new URL(expected, window.location.href).href
        ) {
          return true;
        }
      } catch {}
      if (candidate.includes(expected) || expected.includes(candidate)) {
        return true;
      }
      try {
        const decoded = decodeURIComponent(candidate);
        if (decoded.includes(expected) || expected.includes(decoded)) {
          return true;
        }
      } catch {}
      const candidateClean = candidate.split('?')[0].replace(/\\/g, '/');
      const candidateFile = candidateClean.split('/').pop()?.toLowerCase();
      if (
        candidateFile &&
        expectedFile &&
        candidateFile.length >= 3 &&
        candidateFile === expectedFile
      ) {
        return true;
      }
    }
    return false;
  }

  function findImageMatches(root: ParentNode, value: unknown) {
    return Array.from(root.querySelectorAll<HTMLImageElement>('img')).filter(
      (image) => imageMatchesValue(image, value),
    );
  }

  function attributeMatchesValue(element: HTMLElement, value: unknown) {
    const expected = String(value ?? '').trim();
    if (!expected) return false;

    const candidates = [
      element.getAttribute('href'),
      element.getAttribute('src'),
      element.getAttribute('poster'),
      element.getAttribute('srcset'),
      element.style.backgroundImage,
    ].filter((candidate): candidate is string => Boolean(candidate));

    return candidates.some((candidate) => {
      if (candidate === expected || candidate.includes(expected)) return true;
      try {
        return (
          new URL(candidate, window.location.href).href ===
          new URL(expected, window.location.href).href
        );
      } catch {
        return false;
      }
    });
  }

  function findAttributeMatches(root: ParentNode, value: unknown) {
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], img[src], source[src], video[poster], [style*="background-image"]',
      ),
    ).filter((element) => attributeMatchesValue(element, value));
  }

  function findTextMatches(root: ParentNode, value: unknown) {
    const fragments = valueFragments(value);
    if (fragments.length === 0) return [];

    const elements = Array.from(
      root.querySelectorAll<HTMLElement>(TEXT_SELECTOR),
    );
    const exact = elements.filter((element) => {
      const text = normalizeText(element.textContent);
      return fragments.some((fragment) => text === fragment);
    });
    if (exact.length > 0) return exact;

    return elements.filter((element) => {
      const text = normalizeText(element.textContent);
      return fragments.some(
        (fragment) => text.includes(fragment) || fragment.includes(text),
      );
    });
  }

  function findValueMatches(
    root: ParentNode,
    value: unknown,
    key?: string,
  ): HTMLElement[] {
    if (isImageValue(value, key)) {
      const images = findImageMatches(root, value);
      if (images.length > 0) return images;
    }
    return findTextMatches(root, value);
  }

  function subtreeContainsValue(
    element: HTMLElement,
    value: unknown,
    key?: string,
  ) {
    if (
      isImageValue(value, key) &&
      findImageMatches(element, value).length > 0
    ) {
      return true;
    }

    const text = normalizeText(element.textContent);
    return valueFragments(value).some((fragment) => text.includes(fragment));
  }

  function lowestCommonAncestor(
    elements: HTMLElement[],
    boundary?: HTMLElement | null,
  ) {
    const first = elements[0];
    if (!first) return null;

    let candidate: HTMLElement | null = first;
    while (candidate) {
      if (elements.every((element) => candidate?.contains(element))) {
        return candidate;
      }
      if (candidate === boundary) break;
      candidate = candidate.parentElement;
    }
    return boundary ?? first;
  }

  function pathVariants(path?: string) {
    const original = String(path ?? '').trim();
    if (!original) return [];
    const dotted = original.replace(/\[(\d+)\]/g, '.$1');
    const bracketed = dotted.replace(/\.(\d+)(?=\.|$)/g, '[$1]');
    return Array.from(new Set([original, dotted, bracketed]));
  }

  function focusPathCandidates(payload: FocusPayload) {
    return Array.from(
      new Set(
        [payload.fieldPath, ...(payload.fieldPaths ?? [])]
          .filter((path): path is string => Boolean(path && path.trim()))
          .flatMap((path) => pathVariants(path)),
      ),
    );
  }

  /**
   * Eye-preview must outline something the agent can actually see. Templates
   * often keep duplicate markers in closed mobile drawers, 1×1 contract
   * spans, or opacity-0 chrome — those exact matches must not win.
   */
  function isVisuallyHighlightable(element: HTMLElement) {
    if (element.closest('[hidden]')) return false;
    let node: HTMLElement | null = element;
    while (node && node !== document.documentElement) {
      const style = window.getComputedStyle(node);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        Number(style.opacity) === 0
      ) {
        return false;
      }
      if (style.maxHeight === '0px' || style.maxHeight === '0') {
        return false;
      }
      const rect = node.getBoundingClientRect();
      if (
        (style.overflow === 'hidden' || style.overflow === 'clip') &&
        (rect.width < 2 || rect.height < 2)
      ) {
        return false;
      }
      node = node.parentElement;
    }
    const selfRect = element.getBoundingClientRect();
    return selfRect.width >= 2 && selfRect.height >= 2;
  }

  function highlightTargetScore(element: HTMLElement) {
    let score = 0;
    if (isVisuallyHighlightable(element)) score += 100;
    const text = normalizeText(element.textContent);
    if (text.length >= 2) score += 40;
    if (element.tagName === 'IMG') score += 35;
    if (element.closest('main, footer, header, [data-preview-page-key]')) {
      score += 20;
    }
    // Icon-only floating CTAs are valid fallbacks but weaker than labeled copy.
    if (
      element.closest('.fixed, [class*="fixed"]') &&
      text.length < 2 &&
      element.tagName !== 'IMG'
    ) {
      score -= 25;
    }
    const rect = element.getBoundingClientRect();
    score += Math.min(15, Math.floor((rect.width * rect.height) / 400));
    return score;
  }

  function rankHighlightTargets(targets: HTMLElement[]) {
    return [...targets].sort(
      (left, right) => highlightTargetScore(right) - highlightTargetScore(left),
    );
  }

  function findExplicitTargets(path?: string, extraPaths?: string[]) {
    const targets: HTMLElement[] = [];
    const paths = Array.from(
      new Set(
        [path, ...(extraPaths ?? [])]
          .filter((candidate): candidate is string => Boolean(candidate))
          .flatMap((candidate) => pathVariants(candidate)),
      ),
    );
    for (const variant of paths) {
      const escaped = CSS.escape(variant);
      document
        .querySelectorAll<HTMLElement>(
          '[data-preview-field-path="' +
            escaped +
            '"], [data-preview-list-path="' +
            escaped +
            '"], [data-content-path="' +
            escaped +
            '"]',
        )
        .forEach((target) => {
          if (!targets.includes(target)) targets.push(target);
        });
    }
    const visible = rankHighlightTargets(
      targets.filter((target) => isVisuallyHighlightable(target)),
    );
    // Prefer leaf markers when both a parent and child share the same path.
    const leaves = visible.filter(
      (target) =>
        !visible.some((other) => other !== target && target.contains(other)),
    );
    return leaves.length > 0 ? leaves : visible;
  }

  function findItemContainer(context?: FocusContext) {
    const values = (context?.itemValues ?? []).filter(
      (entry) => normalizeText(entry.value).length >= 2 && entry.key !== 'id',
    );
    if (values.length === 0) return null;

    const anchors: HTMLElement[] = [];
    for (const entry of values) {
      for (const match of findValueMatches(
        document,
        entry.value,
        entry.key,
      ).slice(0, 8)) {
        if (!anchors.includes(match)) anchors.push(match);
      }
    }

    let best: { target: HTMLElement; score: number; area: number } | null =
      null;
    for (const anchor of anchors) {
      let candidate: HTMLElement | null = anchor;
      let levels = 0;
      while (candidate && candidate !== document.body && levels < 12) {
        const score = values.reduce(
          (total, entry) =>
            total +
            (subtreeContainsValue(
              candidate as HTMLElement,
              entry.value,
              entry.key,
            )
              ? 1
              : 0),
          0,
        );
        const rect = candidate.getBoundingClientRect();
        const area = Math.max(1, rect.width * rect.height);
        if (
          !best ||
          score > best.score ||
          (score === best.score && area < best.area)
        ) {
          best = { target: candidate, score, area };
        }
        candidate = candidate.parentElement;
        levels += 1;
      }
    }

    const requiredScore = Math.min(2, values.length);
    return best && best.score >= requiredScore ? best.target : null;
  }

  function findFieldTarget(root: ParentNode, value: unknown, key?: string) {
    const matches = findValueMatches(root, value, key);
    if (matches.length === 0) return null;

    const fragments = valueFragments(value);
    if (fragments.length > 1 && !isImageValue(value, key)) {
      const fragmentMatches = matches.filter((element) => {
        const text = normalizeText(element.textContent);
        return fragments.slice(1).some((fragment) => text === fragment);
      });
      if (fragmentMatches.length > 1) {
        return lowestCommonAncestor(
          fragmentMatches,
          root instanceof HTMLElement ? root : null,
        );
      }
    }

    return matches.sort(
      (left, right) =>
        normalizeText(left.textContent).length -
        normalizeText(right.textContent).length,
    )[0];
  }

  function normalizePageKey(pageKey?: string, pageLabel?: string) {
    const normalized = String(pageKey ?? pageLabel ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');
    if (!normalized || normalized === 'common') return 'home';
    return normalized === 'about' ? 'about_us' : normalized;
  }

  function findPageTarget(pageKey: string) {
    const baseKey = pageKey.replace(/_us$/, '');
    const selectors = [
      '[data-preview-page-key="' + CSS.escape(pageKey) + '"]',
      '[data-preview-page-key="' + CSS.escape(baseKey) + '"]',
      '#' + CSS.escape(pageKey) + '_view',
      '#' + CSS.escape(baseKey) + '_view',
      '#' + CSS.escape(pageKey),
      '#' + CSS.escape(baseKey),
      'main',
      'body',
    ];
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element instanceof HTMLElement) return element;
    }
    return null;
  }

  function resolvePath(pageKey: string, pageRoute?: string) {
    const match = window.location.pathname.match(
      /^(\/uploads\/generated-sites\/(?:template-preview|preview|live)\/[^/]+)/,
    );
    const requestedRoute = String(pageRoute ?? '').trim();
    const normalizedRoute = requestedRoute
      ? '/' + requestedRoute.replace(/^\/+|\/+$/g, '')
      : null;
    const suffix =
      normalizedRoute !== null
        ? normalizedRoute === '/'
          ? ''
          : normalizedRoute
        : pageKey === 'home'
          ? ''
          : '/' + pageKey.replace(/^\/+/, '');
    return match ? match[1] + suffix : suffix || '/';
  }

  function clearHighlight() {
    for (const snapshot of activeHighlights) {
      snapshot.target.style.outline = snapshot.outline;
      snapshot.target.style.outlineOffset = snapshot.outlineOffset;
      snapshot.target.style.boxShadow = snapshot.boxShadow;
      snapshot.target.style.transition = snapshot.transition;
      snapshot.target.style.scrollMarginTop = snapshot.scrollMarginTop;
      snapshot.target.style.borderRadius = snapshot.borderRadius;
      snapshot.target.removeAttribute(ACTIVE_ATTRIBUTE);
    }
    activeHighlights = [];
  }

  function highlightTargets(targets: HTMLElement[], isPageTarget: boolean) {
    clearHighlight();
    activeHighlights = targets.map((target) => ({
      target,
      outline: target.style.outline,
      outlineOffset: target.style.outlineOffset,
      boxShadow: target.style.boxShadow,
      transition: target.style.transition,
      scrollMarginTop: target.style.scrollMarginTop,
      borderRadius: target.style.borderRadius,
    }));
    for (const target of targets) {
      target.setAttribute(ACTIVE_ATTRIBUTE, 'true');
      target.style.scrollMarginTop = '72px';
      target.style.transition = 'outline-color 0.2s ease, box-shadow 0.2s ease';
      target.style.outline = '2px solid rgba(34, 197, 94, 0.98)';
      target.style.outlineOffset = '4px';
      target.style.boxShadow = '0 0 0 7px rgba(34, 197, 94, 0.2)';
      if (!target.style.borderRadius) target.style.borderRadius = '4px';
    }
    targets[0]?.scrollIntoView({
      behavior: 'smooth',
      block: isPageTarget ? 'start' : 'center',
      inline: 'nearest',
    });
  }

  function highlight(target: HTMLElement, isPageTarget: boolean) {
    highlightTargets([target], isPageTarget);
  }

  function focusMatchValues(payload: FocusPayload) {
    return Array.from(
      new Set(
        [payload.fieldValue, ...(payload.fieldMatchValues ?? [])]
          .filter(
            (value): value is string | number | boolean =>
              typeof value === 'boolean' ||
              typeof value === 'number' ||
              (typeof value === 'string' && value.trim().length > 0),
          )
          .map((value) => String(value)),
      ),
    );
  }

  function findRememberedFocusTarget(payload: FocusPayload) {
    const pathCandidates = focusPathCandidates(payload);
    if (pathCandidates.length === 0) return null;
    try {
      const selectors = JSON.parse(
        window.sessionStorage.getItem(RESOLVED_TARGETS_KEY) ?? '{}',
      ) as Record<string, string>;
      for (const fieldPath of pathCandidates) {
        const selector = selectors[`${window.location.pathname}|${fieldPath}`];
        if (!selector) continue;
        const target = document.querySelector<HTMLElement>(selector);
        if (!target) continue;
        const expectedValues = focusMatchValues(payload).map(normalizeText);
        const targetText = normalizeText(target.textContent);
        if (
          expectedValues.length > 0 &&
          targetText &&
          !expectedValues.some(
            (value) =>
              targetText === value ||
              targetText.includes(value) ||
              attributeMatchesValue(target, value),
          )
        ) {
          continue;
        }
        return target;
      }
      return null;
    } catch {
      return null;
    }
  }

  function pickVisibleHeuristicTarget(target: HTMLElement | null) {
    if (!target) return null;
    if (isVisuallyHighlightable(target)) return target;
    let node: HTMLElement | null = target.parentElement;
    while (node && node !== document.body) {
      if (isVisuallyHighlightable(node)) return node;
      node = node.parentElement;
    }
    return null;
  }

  function resolveFieldTarget(payload: FocusPayload): {
    targets: HTMLElement[];
    result: 'exact' | 'heuristic';
  } | null {
    const pathCandidates = focusPathCandidates(payload);
    const explicit = findExplicitTargets(
      payload.fieldPath,
      pathCandidates.filter((path) => path !== payload.fieldPath),
    );
    if (explicit.length > 0) return { targets: explicit, result: 'exact' };

    const remembered = pickVisibleHeuristicTarget(
      findRememberedFocusTarget(payload),
    );
    if (remembered) return { targets: [remembered], result: 'heuristic' };

    const itemContainer = findItemContainer(payload.fieldContext);
    const fieldKey = payload.fieldContext?.fieldKey;
    if (itemContainer) {
      for (const value of focusMatchValues(payload)) {
        const insideItem = pickVisibleHeuristicTarget(
          findAttributeMatches(itemContainer, value)[0] ??
            findFieldTarget(itemContainer, value, fieldKey),
        );
        if (insideItem) {
          return { targets: [insideItem], result: 'heuristic' };
        }
      }
      const visibleContainer = pickVisibleHeuristicTarget(itemContainer);
      if (visibleContainer) {
        return { targets: [visibleContainer], result: 'heuristic' };
      }
    }

    for (const value of focusMatchValues(payload)) {
      const attributeMatches = findAttributeMatches(document, value);
      const textMatch = findFieldTarget(document, value, fieldKey);
      const matches = textMatch
        ? [...attributeMatches, textMatch]
        : attributeMatches;
      const visibleMatches = rankHighlightTargets(
        matches
          .map((match) => pickVisibleHeuristicTarget(match))
          .filter((match): match is HTMLElement => Boolean(match)),
      );
      if (visibleMatches.length > 0) {
        return { targets: [visibleMatches[0]], result: 'heuristic' };
      }
    }
    return null;
  }

  function activateRevealNodes() {
    // Templates often register IntersectionObserver once on mount. Live
    // preview data updates (especially image URL changes that remount cards)
    // leave new .reveal-on-scroll nodes at opacity:0. Eye-preview focus and
    // edit mode both need those nodes visible.
    document.documentElement.dataset.fivoraPreview = 'true';
    document
      .querySelectorAll<HTMLElement>('.reveal-on-scroll:not(.reveal-active)')
      .forEach((element) => element.classList.add('reveal-active'));
  }

  function applyFocus(payload: FocusPayload, attempt = 0) {
    activateRevealNodes();
    const hasField = Boolean(payload.fieldPath);
    if (payload.focusOnly && hasField) {
      const resolution = resolveFieldTarget(payload);
      if (resolution) {
        highlightTargets(resolution.targets, false);
        postFocusResult(payload, resolution.result, resolution.targets.length);
        return;
      }
      if (attempt < 12) {
        window.setTimeout(() => applyFocus(payload, attempt + 1), 120);
        return;
      }
      postFocusResult(payload, 'missing');
      return;
    }

    const pageKey = normalizePageKey(payload.pageKey, payload.pageLabel);
    const pageTarget = findPageTarget(pageKey);
    if (!pageTarget) {
      if (attempt < 12) {
        window.setTimeout(() => applyFocus(payload, attempt + 1), 120);
      } else {
        postFocusResult(payload, 'missing');
      }
      return;
    }

    const resolution = hasField ? resolveFieldTarget(payload) : null;
    if (hasField && !resolution && attempt < 12) {
      window.setTimeout(() => applyFocus(payload, attempt + 1), 120);
      return;
    }

    if (resolution) {
      highlightTargets(resolution.targets, false);
      postFocusResult(payload, resolution.result, resolution.targets.length);
    } else {
      highlight(pageTarget, true);
      postFocusResult(payload, 'page', 1);
    }
  }

  function handleFocus(payload: FocusPayload) {
    if (payload.focusOnly) {
      clearPendingFocus();
      window.setTimeout(() => applyFocus(payload), 80);
      return;
    }

    const pageKey = normalizePageKey(payload.pageKey, payload.pageLabel);
    const targetPath = resolvePath(pageKey, payload.pageRoute);
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    if (currentPath !== targetPath) {
      try {
        window.sessionStorage.setItem(
          PENDING_KEY,
          JSON.stringify({ ...payload, awaitingNavigation: true }),
        );
      } catch {
        // Storage may be disabled; navigation recovery falls back to parent.
      }
      window.location.assign(targetPath);
      return;
    }

    clearPendingFocus();
    window.setTimeout(() => applyFocus(payload), 80);
  }

  type EditableField = {
    kind?: 'field' | 'collection';
    path: string;
    label?: string;
    type?: string;
    control?: string;
    value: string | number | boolean;
    matchValues?: Array<string | number>;
    collection?: {
      listPath?: string;
      path?: string;
      itemIndex?: number;
      length: number;
      minItems?: number;
      maxItems?: number;
      itemLabel?: string;
    };
    context?: {
      collectionPath: string;
      itemPath?: string;
      itemIndex: number;
      fieldKey?: string;
      itemValues: Array<{ key: string; value: string }>;
    };
  };

  function normalizeRouteToken(value: string) {
    return normalizeText(value)
      .replace(/\.html$/i, '')
      .replace(/[^a-z0-9]+/g, '-');
  }

  /**
   * Older strict packages sometimes marked server-rendered collection-detail
   * values as static even though the same object is editable on its listing
   * page. Promote only leaves belonging to the item identified by the current
   * route; genuinely decorative/static content remains untouched.
   */
  function promoteActiveRouteDetailFields() {
    const segments = window.location.pathname
      .split('/')
      .map((part) => decodeURIComponent(part).trim())
      .filter(Boolean);
    if (segments.length < 2 || editableFields.length === 0) return;

    const activeFields = editableFields.filter((field) => {
      const context = field.context;
      if (!context?.collectionPath || !context.fieldKey) return false;
      const collectionKey = context.collectionPath.split('.').at(-1) ?? '';
      const collectionPosition = segments.lastIndexOf(collectionKey);
      if (collectionPosition < 0 || collectionPosition >= segments.length - 1) {
        return false;
      }
      const activeToken = normalizeRouteToken(segments.at(-1) ?? '');
      return context.itemValues.some(({ key, value }) => {
        const normalizedKey = normalizeText(key).replace(/[^a-z0-9]/g, '');
        if (
          normalizedKey !== 'id' &&
          !normalizedKey.endsWith('id') &&
          normalizedKey !== 'slug' &&
          normalizedKey !== 'name' &&
          normalizedKey !== 'title'
        ) {
          return false;
        }
        return normalizeRouteToken(value) === activeToken;
      });
    });
    if (activeFields.length === 0) return;

    const staticElements = Array.from(
      document.querySelectorAll<HTMLElement>(`[${STATIC_ATTRIBUTE}]`),
    );
    const pairs: Array<{
      element: HTMLElement;
      field: EditableField;
      score: number;
    }> = [];
    for (const field of activeFields) {
      const context = field.context!;
      const fieldKey = context.fieldKey!;
      const normalizedFieldKey = normalizeText(fieldKey).replace(
        /[^a-z0-9]/g,
        '',
      );
      if (
        normalizedFieldKey === 'slug' ||
        normalizedFieldKey === 'identifier' ||
        normalizedFieldKey.endsWith('id')
      ) {
        continue;
      }
      const collectionKey = context.collectionPath.split('.').at(-1) ?? '';
      const collectionToken = normalizeText(collectionKey).replace(/s$/, '');
      const fieldTokens = fieldKey
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .split(/[^a-z0-9]+/i)
        .map(normalizeText)
        .filter((token) => token && !['url', 'text', 'value'].includes(token));
      const normalizedValue = normalizeText(field.value);

      for (const element of staticElements) {
        const reason = normalizeText(element.getAttribute(STATIC_ATTRIBUTE));
        if (!reason || !reason.includes(collectionToken)) continue;
        let score = 0;
        const reasonHits = fieldTokens.filter((token) =>
          reason.includes(token),
        );
        if (reasonHits.length > 0) score += 40 + reasonHits.length * 5;
        const visibleValue =
          element.tagName === 'IMG'
            ? normalizeText(
                element.getAttribute('src') ?? element.getAttribute('alt'),
              )
            : normalizeText(element.textContent);
        if (normalizedValue && visibleValue === normalizedValue) score += 120;
        else if (
          normalizedValue.length >= 3 &&
          visibleValue.includes(normalizedValue)
        ) {
          score += 80;
        }
        const imageField = /image|photo|logo|banner|thumbnail|cover/i.test(
          fieldKey,
        );
        if (
          imageField &&
          element.tagName === 'IMG' &&
          reason.includes('image')
        ) {
          score += 120;
        }
        if (score >= 40) pairs.push({ element, field, score });
      }
    }

    pairs.sort((left, right) => right.score - left.score);
    const claimed = new Set<HTMLElement>();
    for (const { element, field } of pairs) {
      if (claimed.has(element)) continue;
      claimed.add(element);
      if (element.tagName !== 'IMG') {
        const currentText = element.textContent ?? '';
        const fieldText = String(field.value ?? '');
        const valuePosition = currentText
          .toLowerCase()
          .indexOf(fieldText.toLowerCase());
        if (fieldText && valuePosition >= 0 && currentText !== fieldText) {
          element.setAttribute(
            'data-fivora-value-prefix',
            currentText.slice(0, valuePosition),
          );
          element.setAttribute(
            'data-fivora-value-suffix',
            currentText.slice(valuePosition + fieldText.length),
          );
        }
      }
      element.removeAttribute(STATIC_ATTRIBUTE);
      element.setAttribute('data-preview-field-path', field.path);
      applyDomFieldValue(field.path, field.value);
    }
  }
  const CLICK_MESSAGE = 'FIVORA_PREVIEW_ELEMENT_CLICKED';
  const LEGACY_CLICK_MESSAGE = previousPreviewMessage('ELEMENT_CLICKED');
  const CHANGE_MESSAGE = 'FIVORA_PREVIEW_FIELD_CHANGED';
  const LEGACY_CHANGE_MESSAGE = previousPreviewMessage('FIELD_CHANGED');
  const EDIT_MODE_MESSAGE = 'FIVORA_PREVIEW_EDIT_MODE';
  const LEGACY_EDIT_MODE_MESSAGE = previousPreviewMessage('EDIT_MODE');
  const FLUSH_EDIT_MESSAGE = 'FIVORA_PREVIEW_FLUSH_EDIT';
  const LEGACY_FLUSH_EDIT_MESSAGE = previousPreviewMessage('FLUSH_EDIT');
  const EDIT_FLUSHED_MESSAGE = 'FIVORA_PREVIEW_EDIT_FLUSHED';
  const LEGACY_EDIT_FLUSHED_MESSAGE = previousPreviewMessage('EDIT_FLUSHED');
  const EDITABLE_SELECTOR =
    'h1, h2, h3, h4, h5, h6, p, span, a, button, address, li, dt, dd, label, strong, em, small, img';
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  // WebKit/Safari and many iOS browsers reject or ignore
  // contenteditable="plaintext-only". Prefer the parent popover there.
  const isSafariLike = (() => {
    const ua = navigator.userAgent || '';
    const vendor = navigator.vendor || '';
    if (/iP(ad|hone|od)/i.test(ua)) return true;
    if (
      /Safari/i.test(ua) &&
      /Apple Computer/i.test(vendor) &&
      !/Chrom(e|ium)/i.test(ua)
    ) {
      return true;
    }
    try {
      return Boolean((window as unknown as { safari?: unknown }).safari);
    } catch {
      return false;
    }
  })();
  const supportsPlaintextOnlyContentEditable = (() => {
    try {
      const probe = document.createElement('div');
      probe.setAttribute('contenteditable', 'plaintext-only');
      return probe.contentEditable === 'plaintext-only';
    } catch {
      return false;
    }
  })();
  const isLowPowerPreview =
    isTouchDevice ||
    (navigator.hardwareConcurrency != null &&
      navigator.hardwareConcurrency <= 4) ||
    (typeof (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory === 'number' &&
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ??
        8) <= 4);
  // Prefer the parent portal popover on every device — inline contenteditable
  // is unreliable on WebKit and still expensive on desktop while typing.
  const preferParentPopover = true;
  let editableFields: EditableField[] = [];

  window.addEventListener(
    'message',
    (
      event: MessageEvent<
        FocusPayload & {
          type?: string;
          editMode?: boolean;
          fields?: EditableField[];
          requestId?: string;
          siteData?: unknown;
        }
      >,
    ) => {
      if (!isTrustedParentMessage(event)) {
        return;
      }
      // Relays are synthetic MessageEvents for the template SiteDataProvider.
      // Never re-enter publishSiteData from them — that recurses until stack overflow.
      if (
        event.data &&
        typeof event.data === 'object' &&
        (event.data as { __fivoraBridgeRelay?: boolean })
          .__fivoraBridgeRelay === true
      ) {
        return;
      }
      const isFocusMsg =
        event.data?.type === FOCUS_MESSAGE ||
        event.data?.type === LEGACY_FOCUS_MESSAGE;
      if (isFocusMsg) {
        event.stopImmediatePropagation();
        handleFocus(event.data);
        return;
      }
      const isDataMsg =
        event.data?.type === DATA_MESSAGE ||
        event.data?.type === LEGACY_DATA_MESSAGE;
      if (isDataMsg && event.data.siteData) {
        const isFullPayload = (event.data as { full?: boolean }).full !== false;
        const contentOnly =
          (event.data as { contentOnly?: boolean }).contentOnly === true;
        if (contentOnly) {
          publishSiteData(event.data.siteData, { contentOnly: true });
          return;
        }
        publishSiteData(event.data.siteData, {
          fanOut: false,
          colorReplacements: false,
        });
        acknowledgeSiteDataApplied({ full: isFullPayload });
        return;
      }
      const isPatchMsg =
        event.data?.type === CONTENT_PATCH_MESSAGE ||
        event.data?.type === LEGACY_CONTENT_PATCH_MESSAGE;
      if (isPatchMsg) {
        const patches = (event.data as { patches?: unknown }).patches;
        if (Array.isArray(patches)) {
          publishContentPatches(
            patches as Array<{ path: string; value: unknown }>,
          );
        }
        return;
      }
      if (
        event.data?.type === STYLE_PATCH_MESSAGE ||
        event.data?.type === 'DENEB_PREVIEW_STYLE_PATCH'
      ) {
        const stylePatch = event.data as {
          fieldPath?: unknown;
          targetPath?: unknown;
          styles?: unknown;
          properties?: unknown;
        };
        const path =
          typeof stylePatch.fieldPath === 'string'
            ? stylePatch.fieldPath
            : typeof stylePatch.targetPath === 'string'
              ? stylePatch.targetPath
              : '';
        const styles = (stylePatch.styles ?? stylePatch.properties) as
          | Record<string, unknown>
          | undefined;
        if (path && styles) {
          publishElementStylePatch(path, styles);
        }
        return;
      }
      const isEditModeMsg =
        event.data?.type === EDIT_MODE_MESSAGE ||
        event.data?.type === LEGACY_EDIT_MODE_MESSAGE;
      if (isEditModeMsg) {
        editableFields = Array.isArray(event.data.fields)
          ? event.data.fields
          : [];
        promoteActiveRouteDetailFields();
        if (event.data.editMode) {
          enterEditMode();
          // Defer heavy indexing so the saved content can paint first.
          window.setTimeout(() => scheduleEditableTargetIndex(), 50);
        } else {
          exitEditMode();
        }
        return;
      }
      const isFlushMsg =
        event.data?.type === FLUSH_EDIT_MESSAGE ||
        event.data?.type === LEGACY_FLUSH_EDIT_MESSAGE;
      if (isFlushMsg) {
        finishInlineEdit(true);
        postToParent({
          type: EDIT_FLUSHED_MESSAGE,
          requestId: event.data.requestId,
        });
        postToParent({
          type: LEGACY_EDIT_FLUSHED_MESSAGE,
          requestId: event.data.requestId,
        });
      }
    },
    true,
  );

  try {
    const pending = JSON.parse(
      window.sessionStorage.getItem(PENDING_KEY) ?? 'null',
    ) as FocusPayload | null;
    if (pending?.awaitingNavigation) {
      const pageKey = normalizePageKey(pending.pageKey, pending.pageLabel);
      const targetPath = resolvePath(pageKey, pending.pageRoute);
      const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
      clearPendingFocus();
      if (currentPath === targetPath) {
        window.setTimeout(() => applyFocus(pending), 220);
      }
    } else if (pending) {
      // Drop stale focus from a previous preview session. Replaying it after a
      // fresh iframe load overwrote the newly requested field highlight.
      clearPendingFocus();
    }
  } catch {
    clearPendingFocus();
  }

  try {
    // Soft restore can flash stale demo content and block the parent payload on
    // low-power WebKit. Only restore the global/session pointers there.
    const cachedSiteData = JSON.parse(
      window.sessionStorage.getItem(SITE_DATA_CACHE_KEY) ??
        window.sessionStorage.getItem(LEGACY_SITE_DATA_CACHE_KEY) ??
        'null',
    ) as unknown;
    if (cachedSiteData) {
      latestPublishedSiteData = cachedSiteData;
      try {
        (window as unknown as Record<string, unknown>)[SITE_DATA_GLOBAL_KEY] =
          cachedSiteData;
        (window as unknown as Record<string, unknown>)[
          LEGACY_SITE_DATA_GLOBAL_KEY
        ] = cachedSiteData;
      } catch {
        // Ignore non-extensible window environments.
      }
      if (!isLowPowerPreview) {
        applySelectedPages(cachedSiteData);
        applyUniversalTheme(cachedSiteData, { colorReplacements: false });
      }
    }
  } catch {
    // The next live-data message will restore the universal design layer.
  }

  // ── Edit mode: hover overlay + pencil badge + click-to-edit ────────────

  let editModeActive = false;
  let hoverBadge: HTMLElement | null = null;
  let hoveredElement: HTMLElement | null = null;
  let hoverOutlineCleanup: (() => void) | null = null;
  let activeInlineEdit: {
    target: HTMLElement;
    field: EditableField;
    originalText: string;
    originalHtml: string;
    contentEditable: string | null;
    spellcheck: string | null;
    outline: string;
    outlineOffset: string;
    cursor: string;
    userSelect: string;
    textTransform: string;
    keydown: (event: KeyboardEvent) => void;
    blur: () => void;
  } | null = null;
  let indexTimeouts: number[] = [];
  let indexIdleHandle: number | null = null;

  function ensureEmptyEditableStyles() {
    if (document.querySelector('[data-fivora-empty-editable-styles]')) {
      return;
    }
    const style = document.createElement('style');
    style.setAttribute('data-fivora-empty-editable-styles', 'true');
    style.textContent = `
      [${EMPTY_EDITABLE_ATTRIBUTE}="true"] {
        min-width: 7rem !important;
        min-height: 1.25em !important;
        outline: 1px dashed rgba(37, 99, 235, 0.28) !important;
        outline-offset: 3px !important;
      }
      span[${EMPTY_EDITABLE_ATTRIBUTE}="true"],
      a[${EMPTY_EDITABLE_ATTRIBUTE}="true"],
      strong[${EMPTY_EDITABLE_ATTRIBUTE}="true"],
      em[${EMPTY_EDITABLE_ATTRIBUTE}="true"],
      small[${EMPTY_EDITABLE_ATTRIBUTE}="true"],
      label[${EMPTY_EDITABLE_ATTRIBUTE}="true"] {
        display: inline-block !important;
      }
      [${EMPTY_EDITABLE_ATTRIBUTE}="true"]:empty::before {
        content: "";
        color: rgba(37, 99, 235, 0.78);
        font: 500 12px/1.4 system-ui, sans-serif;
        letter-spacing: normal;
        text-transform: none;
        white-space: nowrap;
      }
      [${EMPTY_EDITABLE_ATTRIBUTE}="true"]:empty:hover::before {
        content: "Click to add text";
      }
      [${EMPTY_COLLECTION_ATTRIBUTE}="true"] {
        min-width: 10rem !important;
        min-height: 3.5rem !important;
        outline: 1px dashed rgba(37, 99, 235, 0.28) !important;
        outline-offset: 3px !important;
      }
      [${EMPTY_COLLECTION_ATTRIBUTE}="true"]:empty::before {
        content: "";
        display: inline-flex;
        align-items: center;
        min-height: 3.5rem;
        color: rgba(37, 99, 235, 0.78);
        font: 500 12px/1.4 system-ui, sans-serif;
        letter-spacing: normal;
        text-transform: none;
        white-space: nowrap;
      }
      [${EMPTY_COLLECTION_ATTRIBUTE}="true"]:empty:hover::before {
        content: "Click to add the first item";
      }
    `;
    document.head.appendChild(style);
  }

  function buildStructuralSelector(element: HTMLElement) {
    if (element.id) {
      return '#' + CSS.escape(element.id);
    }
    const parts: string[] = [];
    let current: HTMLElement | null = element;
    while (current && current !== document.body) {
      const tag = current.tagName.toLowerCase();
      const siblings = current.parentElement
        ? Array.from(current.parentElement.children).filter(
            (sibling) => sibling.tagName === current?.tagName,
          )
        : [];
      const position = siblings.indexOf(current) + 1;
      parts.unshift(
        siblings.length > 1 ? `${tag}:nth-of-type(${position})` : tag,
      );
      current = current.parentElement;
    }
    return parts.length > 0 ? `body > ${parts.join(' > ')}` : '';
  }

  function readResolvedTargetSelectors() {
    try {
      const parsed = JSON.parse(
        window.sessionStorage.getItem(RESOLVED_TARGETS_KEY) ?? '{}',
      ) as Record<string, string>;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {} as Record<string, string>;
    }
  }

  function rememberResolvedTarget(element: HTMLElement, fieldPath: string) {
    const selector = buildStructuralSelector(element);
    if (!selector) return;
    const selectors = readResolvedTargetSelectors();
    selectors[`${window.location.pathname}|${fieldPath}`] = selector;
    try {
      window.sessionStorage.setItem(
        RESOLVED_TARGETS_KEY,
        JSON.stringify(selectors),
      );
    } catch {
      // The live DOM annotation still works when storage is unavailable.
    }
  }

  function forgetResolvedTargetsForCurrentPage() {
    const selectors = readResolvedTargetSelectors();
    const prefix = `${window.location.pathname}|`;
    let changed = false;
    for (const key of Object.keys(selectors)) {
      if (key.startsWith(prefix)) {
        delete selectors[key];
        changed = true;
      }
    }
    if (!changed) return;
    try {
      window.sessionStorage.setItem(
        RESOLVED_TARGETS_KEY,
        JSON.stringify(selectors),
      );
    } catch {
      // Fresh DOM inference still works when storage is unavailable.
    }
  }

  function clearResolvedEditableTargets() {
    document
      .querySelectorAll<HTMLElement>(`[${RESOLVED_PATH_ATTRIBUTE}]`)
      .forEach((element) => {
        if (activeInlineEdit?.target === element) return;
        element.removeAttribute(RESOLVED_PATH_ATTRIBUTE);
        element.removeAttribute(EMPTY_EDITABLE_ATTRIBUTE);
        element.removeAttribute(EMPTY_COLLECTION_ATTRIBUTE);
      });
  }

  function annotateEditableTarget(
    element: HTMLElement,
    field: EditableField,
    remember = true,
  ) {
    const existingPath = element.getAttribute(RESOLVED_PATH_ATTRIBUTE);
    const authoredPath =
      element.getAttribute('data-preview-field-path') ??
      element.getAttribute(LIST_PATH_ATTRIBUTE) ??
      element.getAttribute('data-content-path') ??
      element.getAttribute('data-field-path');
    if (
      existingPath &&
      existingPath !== field.path &&
      authoredPath !== field.path
    ) {
      return false;
    }
    element.setAttribute(RESOLVED_PATH_ATTRIBUTE, field.path);
    targetRegistry.register(element, field.path);
    const isEmpty =
      String(field.value ?? '').trim().length === 0 &&
      normalizeText(element.textContent).length === 0;
    if (editModeActive && isEmpty && element.tagName !== 'IMG') {
      element.setAttribute(EMPTY_EDITABLE_ATTRIBUTE, 'true');
    } else {
      element.removeAttribute(EMPTY_EDITABLE_ATTRIBUTE);
    }
    const isCollection = field.kind === 'collection' || field.type === 'list';
    const collectionLength = field.collection?.length;
    if (
      editModeActive &&
      isCollection &&
      (collectionLength === 0 || element.childElementCount === 0)
    ) {
      element.setAttribute(EMPTY_COLLECTION_ATTRIBUTE, 'true');
      element.removeAttribute(EMPTY_EDITABLE_ATTRIBUTE);
    } else {
      element.removeAttribute(EMPTY_COLLECTION_ATTRIBUTE);
    }
    if (remember && !isCollection) {
      rememberResolvedTarget(element, field.path);
    }
    return true;
  }

  function editableFieldMatchValues(field: EditableField) {
    const values = [field.value, ...(field.matchValues ?? [])].filter(
      (value): value is string | number =>
        typeof value === 'number' ||
        (typeof value === 'string' && value.trim().length > 0),
    );
    return Array.from(new Set(values.map((value) => String(value))));
  }

  function findExplicitEditableTarget(fieldPath: string) {
    for (const variant of pathVariants(fieldPath)) {
      const escaped = CSS.escape(variant);
      const target = document.querySelector<HTMLElement>(
        `[data-preview-field-path="${escaped}"], ` +
          `[${LIST_PATH_ATTRIBUTE}="${escaped}"], ` +
          `[data-content-path="${escaped}"], ` +
          `[data-field-path="${escaped}"], ` +
          `[${RESOLVED_PATH_ATTRIBUTE}="${escaped}"]`,
      );
      if (target) return target;
    }
    return null;
  }

  function restoreRememberedTarget(field: EditableField) {
    // A collection container must be explicitly authored. Remembering an
    // inferred ancestor can make an unrelated section (or the whole page)
    // reopen the collection after a reorder.
    if (field.kind === 'collection' || field.type === 'list') {
      return null;
    }
    const selectors = readResolvedTargetSelectors();
    const selector = selectors[`${window.location.pathname}|${field.path}`];
    if (!selector) return null;
    try {
      const target = document.querySelector<HTMLElement>(selector);
      if (!target) return null;
      const expectedValues = editableFieldMatchValues(field).map(normalizeText);
      const actual = normalizeText(target.textContent);
      if (
        expectedValues.length > 0 &&
        actual &&
        !expectedValues.includes(actual)
      ) {
        return null;
      }
      annotateEditableTarget(target, field, false);
      return target;
    } catch {
      return null;
    }
  }

  function inferEditableTarget(field: EditableField) {
    if (field.kind === 'collection' || field.type === 'list') {
      // Exact list and item markers are resolved before inference. Legacy
      // member leaves still expose collection CRUD through their context, but
      // no common ancestor is annotated: that ancestor can include headings,
      // navigation, or even the whole page in an unfamiliar template.
      return null;
    }
    const itemContainer = field.context
      ? findItemContainer({
          collectionPath: field.context.collectionPath,
          itemIndex: field.context.itemIndex,
          fieldKey: field.context.fieldKey,
          itemValues: field.context.itemValues,
        })
      : null;
    const root: ParentNode = itemContainer ?? document;
    for (const matchValue of editableFieldMatchValues(field)) {
      const preferred = findFieldTarget(
        root,
        matchValue,
        field.context?.fieldKey,
      );
      const candidates = [
        ...findAttributeMatches(root, matchValue),
        ...(preferred ? [preferred] : []),
        ...findValueMatches(root, matchValue, field.context?.fieldKey),
      ];
      for (const target of candidates) {
        if (target.closest(`[${STATIC_ATTRIBUTE}]`)) {
          continue;
        }
        const resolvedPath = target.getAttribute(RESOLVED_PATH_ATTRIBUTE);
        if (!resolvedPath || resolvedPath === field.path) {
          return target;
        }
      }
    }
    return null;
  }

  function indexEditableTargets(options?: { explicitOnly?: boolean }) {
    if (!editModeActive) return;
    ensureEmptyEditableStyles();
    activateRevealNodes();
    for (const field of editableFields) {
      const target =
        findExplicitEditableTarget(field.path) ??
        restoreRememberedTarget(field) ??
        (options?.explicitOnly ? null : inferEditableTarget(field));
      if (target) {
        annotateEditableTarget(target, field);
      }
    }
  }

  let indexScheduled = false;
  function scheduleEditableTargetIndex() {
    for (const timeout of indexTimeouts) {
      window.clearTimeout(timeout);
    }
    indexTimeouts = [];
    if (indexIdleHandle !== null) {
      const cancelIdle = (
        window as Window & {
          cancelIdleCallback?: (handle: number) => void;
        }
      ).cancelIdleCallback;
      if (typeof cancelIdle === 'function') {
        cancelIdle(indexIdleHandle);
      } else {
        window.clearTimeout(indexIdleHandle);
      }
      indexIdleHandle = null;
    }
    if (indexScheduled) return;
    indexScheduled = true;
    // Markers-only on every device. Full-text inference freezes the editor SPA
    // on large templates (phones and typical PCs alike).
    const runPass = (explicitOnly: boolean, isLast: boolean) => {
      if (isLast) indexScheduled = false;
      if (explicitOnly) {
        clearResolvedEditableTargets();
      }
      indexEditableTargets({ explicitOnly });
    };

    indexTimeouts = [
      window.setTimeout(() => {
        runPass(true, true);
      }, 0),
    ];
  }

  function createHoverBadge() {
    const badge = document.createElement('div');
    badge.setAttribute('data-fivora-edit-badge', 'true');
    badge.innerHTML = '✏️';
    Object.assign(badge.style, {
      position: 'fixed',
      zIndex: '2147483647',
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      borderRadius: '8px',
      background: 'rgba(37, 99, 235, 0.92)',
      color: '#fff',
      cursor: 'pointer',
      pointerEvents: 'auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      opacity: '0',
      transition: 'opacity 0.15s ease',
      userSelect: 'none',
    });
    badge.setAttribute('title', 'Edit this content');
    badge.setAttribute('aria-label', 'Edit this content');
    document.body.appendChild(badge);
    return badge;
  }

  function positionBadge(target: Element) {
    if (!hoverBadge) return;
    const rect = target.getBoundingClientRect();
    hoverBadge.style.top = `${Math.max(4, rect.top - 4)}px`;
    hoverBadge.style.left = `${Math.min(window.innerWidth - 36, rect.right - 32)}px`;
    hoverBadge.style.opacity = '1';
  }

  function clearHoverOverlay() {
    if (hoverOutlineCleanup) {
      hoverOutlineCleanup();
      hoverOutlineCleanup = null;
    }
    if (hoverBadge) {
      hoverBadge.style.opacity = '0';
    }
    hoveredElement = null;
  }

  function applyHoverOverlay(target: HTMLElement) {
    if (target === hoveredElement) return;
    clearHoverOverlay();
    hoveredElement = target;

    const htmlOrSvg = target as HTMLElement | SVGElement;
    const prevOutline = htmlOrSvg.style?.outline ?? '';
    const prevOutlineOffset = htmlOrSvg.style?.outlineOffset ?? '';
    const prevCursor = htmlOrSvg.style?.cursor ?? '';

    if (htmlOrSvg.style) {
      htmlOrSvg.style.outline = '2px dashed rgba(37, 99, 235, 0.6)';
      htmlOrSvg.style.outlineOffset = '2px';
      htmlOrSvg.style.cursor = 'pointer';
    }

    hoverOutlineCleanup = () => {
      if (htmlOrSvg.style) {
        htmlOrSvg.style.outline = prevOutline;
        htmlOrSvg.style.outlineOffset = prevOutlineOffset;
        htmlOrSvg.style.cursor = prevCursor;
      }
    };

    positionBadge(target);
  }

  function findEditableTarget(
    target: EventTarget | null,
  ): { element: HTMLElement; field: EditableField } | null {
    let currentElement = target instanceof Element ? target : null;
    while (currentElement && !(currentElement instanceof HTMLElement) &&
      currentElement.getAttribute('data-preview-control') !== 'icon-picker') {
      currentElement = currentElement.parentElement;
    }
    let current = currentElement as HTMLElement | null;
    while (current && current !== document.body) {
      if (current.hasAttribute(STATIC_ATTRIBUTE)) {
        // A template can place a full-card static navigation link above an
        // editable collection row. Skip the fixed control itself and keep
        // walking so the exact authored item/list marker can open its editor.
        current = current.parentElement;
        continue;
      }
      const isCandidate =
        current.hasAttribute('data-preview-style-target') ||
        current.hasAttribute('data-preview-field-path') ||
        current.hasAttribute(LIST_PATH_ATTRIBUTE) ||
        current.hasAttribute(ITEM_PATH_ATTRIBUTE) ||
        current.hasAttribute('data-content-path') ||
        current.hasAttribute('data-field-path') ||
        current.hasAttribute(RESOLVED_PATH_ATTRIBUTE) ||
        Boolean(targetRegistry.getPath(current)) ||
        current.matches(EDITABLE_SELECTOR);
      if (isCandidate) {
        const field = resolveEditableField(current);
        if (field) {
          return { element: current, field };
        }
      }
      current = current.parentElement instanceof HTMLElement ? current.parentElement : null;
    }
    return null;
  }

  function resolveEditableField(element: HTMLElement): EditableField | null {
    if (element.closest(`[${STATIC_ATTRIBUTE}]`)) {
      return null;
    }

    // A primitive-list leaf commonly owns both an item marker and a field
    // marker. Resolve the concrete field first so the value remains editable;
    // its descriptor context still exposes collection CRUD in the popover.
    const explicitPath =
      element.getAttribute('data-preview-field-path') ??
      element.getAttribute('data-content-path') ??
      element.getAttribute('data-field-path') ??
      element.getAttribute(RESOLVED_PATH_ATTRIBUTE);
    if (explicitPath) {
      const explicitField = editableFields.find((field) =>
        pathVariants(field.path).includes(explicitPath),
      );
      return (
        explicitField ?? {
          path: explicitPath,
          label: explicitPath.split('.').pop() ?? 'Content',
          type: element.tagName === 'IMG' ? 'image' : 'text',
          value:
            element.tagName === 'IMG'
              ? (element as HTMLImageElement).src
              : (element.textContent?.trim() ?? ''),
        }
      );
    }

    // A container can own styles without pretending its children are one text field.
    const containerStylePath = element.getAttribute('data-preview-style-target');
    if (containerStylePath && element.getAttribute('data-preview-style-type') === 'card' &&
      !element.hasAttribute(ITEM_PATH_ATTRIBUTE) && !element.hasAttribute(LIST_PATH_ATTRIBUTE)) {
      return { path: containerStylePath, label: element.getAttribute('data-preview-style-label') || 'Container', type: 'object', value: '' };
    }

    const itemPath = element.getAttribute(ITEM_PATH_ATTRIBUTE);
    if (itemPath) {
      const itemMatch = itemPath.match(/^(.+)\[(\d+)\]$/);
      if (itemMatch) {
        const collectionPath = itemMatch[1];
        const itemIndex = Number(itemMatch[2]);
        const collectionField = editableFields.find(
          (field) =>
            (field.kind === 'collection' || field.type === 'list') &&
            pathVariants(field.path).includes(collectionPath),
        );
        if (collectionField) {
          return {
            ...collectionField,
            collection: {
              listPath: collectionPath,
              itemIndex,
              length: collectionField.collection?.length ?? 0,
              minItems: collectionField.collection?.minItems,
              maxItems: collectionField.collection?.maxItems,
              itemLabel: collectionField.collection?.itemLabel,
            },
          };
        }
      }
    }

    const listPath = element.getAttribute(LIST_PATH_ATTRIBUTE);
    if (listPath) {
      const collectionField = editableFields.find(
        (field) =>
          (field.kind === 'collection' || field.type === 'list') &&
          pathVariants(field.path).includes(listPath),
      );
      return (
        collectionField ?? {
          kind: 'collection',
          path: listPath,
          label: listPath.split('.').pop() ?? 'Collection',
          type: 'list',
          value: 0,
          collection: {
            listPath,
            length: element.children.length,
          },
        }
      );
    }

    const imgElement =
      element.tagName === 'IMG'
        ? (element as HTMLImageElement)
        : element.querySelector<HTMLImageElement>('img');
    if (imgElement) {
      const directImageField = editableFields.find(
        (field) =>
          field.type === 'image' &&
          editableFieldMatchValues(field).some((value) =>
            imageMatchesValue(imgElement, value),
          ),
      );
      if (directImageField) return directImageField;

      const extractedCtx = extractCollectionContext(imgElement);
      if (
        extractedCtx.collectionPath &&
        typeof extractedCtx.itemIndex === 'number'
      ) {
        const itemImage = editableFields.find(
          (field) =>
            field.type === 'image' &&
            field.context?.collectionPath === extractedCtx.collectionPath &&
            field.context?.itemIndex === extractedCtx.itemIndex,
        );
        if (itemImage) return itemImage;
      }

      const container = imgElement.closest(
        'section, article, [data-preview-page-key], main, header, footer, .card, [class*="section"]',
      );
      if (container) {
        const containerHint =
          container.getAttribute('data-preview-field-path') ||
          container.getAttribute('data-content-path') ||
          container.getAttribute('data-field-path') ||
          container.getAttribute(RESOLVED_PATH_ATTRIBUTE);
        if (containerHint) {
          const prefix = containerHint.split('.')[0];
          const sectionImage = editableFields.find(
            (field) =>
              field.type === 'image' &&
              (field.path.startsWith(`${prefix}.`) ||
                field.path.startsWith(`${containerHint}.`)),
          );
          if (sectionImage) return sectionImage;
        }
      }

      if (element.tagName === 'IMG') {
        const imageFields = editableFields.filter((f) => f.type === 'image');
        if (imageFields.length === 1) return imageFields[0];

        const rawSrc = imgElement.getAttribute('src') || imgElement.src || '';
        return {
          path: explicitPath || 'image',
          label: (explicitPath || '').split('.').pop() || 'Image',
          type: 'image',
          value: rawSrc,
        };
      }
    }

    const attributeFields = editableFields.filter((field) =>
      editableFieldMatchValues(field).some((value) =>
        attributeMatchesValue(element, value),
      ),
    );
    if (attributeFields.length === 1) return attributeFields[0];

    const elementText = normalizeText(element.textContent);
    if (!elementText) return null;

    const exact = editableFields.filter(
      (field) =>
        typeof field.value !== 'boolean' &&
        editableFieldMatchValues(field).some(
          (value) => normalizeText(value) === elementText,
        ),
    );
    if (exact.length === 1) return exact[0];

    const contained = editableFields
      .filter((field) => {
        if (typeof field.value === 'boolean') return false;
        return editableFieldMatchValues(field).some((matchValue) => {
          const value = normalizeText(matchValue);
          return value.length >= 3 && elementText.includes(value);
        });
      })
      .sort(
        (left, right) =>
          Math.max(
            ...editableFieldMatchValues(right).map(
              (value) => normalizeText(value).length,
            ),
            0,
          ) -
          Math.max(
            ...editableFieldMatchValues(left).map(
              (value) => normalizeText(value).length,
            ),
            0,
          ),
      );
    return contained.length === 1 ? contained[0] : null;
  }

  function canEditInline(element: HTMLElement, field: EditableField) {
    return (
      element.getAttribute('data-preview-control') !== 'icon-picker' &&
      element.tagName !== 'IMG' &&
      element.childElementCount === 0 &&
      ![
        'INPUT',
        'TEXTAREA',
        'SELECT',
        'OPTION',
        'VIDEO',
        'AUDIO',
        'IFRAME',
      ].includes(element.tagName) &&
      !field.context &&
      !['image', 'color', 'boolean', 'select', 'list', 'object'].includes(
        field.type ?? 'text',
      )
    );
  }

  function extractFieldPath(element: HTMLElement): string | null {
    let current: HTMLElement | null = element;
    while (current && current !== document.body) {
      const path =
        current.getAttribute('data-preview-field-path') ??
        current.getAttribute(LIST_PATH_ATTRIBUTE) ??
        current.getAttribute('data-content-path') ??
        current.getAttribute('data-field-path') ??
        current.getAttribute(RESOLVED_PATH_ATTRIBUTE);
      if (path) return path;
      current = current.parentElement;
    }
    return null;
  }

  function extractCollectionContext(element: HTMLElement): {
    collectionPath: string | null;
    itemIndex: number | null;
  } {
    let current: HTMLElement | null = element;
    while (current && current !== document.body) {
      const itemPath = current.getAttribute(ITEM_PATH_ATTRIBUTE);
      if (itemPath) {
        const itemMatch = itemPath.match(/^(.+)\[(\d+)\]$/);
        if (itemMatch) {
          return {
            collectionPath: itemMatch[1],
            itemIndex: Number(itemMatch[2]),
          };
        }
      }
      const path =
        current.getAttribute('data-preview-field-path') ??
        current.getAttribute('data-content-path') ??
        current.getAttribute('data-field-path') ??
        current.getAttribute(RESOLVED_PATH_ATTRIBUTE);
      if (path) {
        const match = path.match(/^(.+)\[(\d+)\]/);
        if (match) {
          return { collectionPath: match[1], itemIndex: Number(match[2]) };
        }
      }
      const listPath = current.getAttribute(LIST_PATH_ATTRIBUTE);
      if (listPath) {
        return { collectionPath: listPath, itemIndex: null };
      }
      current = current.parentElement;
    }
    return { collectionPath: null, itemIndex: null };
  }

  function findRelatedAncestorFields(
    element: HTMLElement,
    activeField?: EditableField | null,
  ) {
    const related: Array<{
      path: string;
      label: string;
      type: string;
    }> = [];
    const seenPaths = new Set<string>(
      activeField?.path ? [activeField.path] : [],
    );

    let current: HTMLElement | null = element;
    let depth = 0;
    while (current && current !== document.body && depth < 3) {
      if (current.hasAttribute(STATIC_ATTRIBUTE)) {
        break;
      }
      if (
        depth > 0 &&
        (current.hasAttribute(ITEM_PATH_ATTRIBUTE) ||
          current.hasAttribute(LIST_PATH_ATTRIBUTE) ||
          current.tagName === 'SECTION')
      ) {
        break;
      }
      if (
        current.hasAttribute('data-preview-field-path') ||
        current.hasAttribute('data-content-path') ||
        current.hasAttribute('data-field-path') ||
        current.hasAttribute(RESOLVED_PATH_ATTRIBUTE)
      ) {
        const candidate = resolveEditableField(current);
        if (
          candidate?.path &&
          candidate.kind !== 'collection' &&
          candidate.type !== 'list' &&
          !seenPaths.has(candidate.path)
        ) {
          seenPaths.add(candidate.path);
          related.push({
            path: candidate.path,
            label:
              candidate.label ?? candidate.path.split('.').pop() ?? 'Content',
            type: candidate.type ?? 'text',
          });
        }
      }
      current = current.parentElement;
      depth += 1;
    }

    return related;
  }

  function emitClickEvent(
    element: HTMLElement,
    field?: EditableField | null,
    relatedFields = findRelatedAncestorFields(element, field),
  ) {
    const rect = element.getBoundingClientRect();
    const computed = window.getComputedStyle(element);
    const isImage = element.tagName === 'IMG';
    const isInputOrTextarea = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
    const fieldPath = field?.path ?? extractFieldPath(element);
    const fieldValue = element.getAttribute('data-preview-control') === 'icon-picker'
      ? (element.getAttribute('data-preview-icon') ?? field?.value ?? '')
      : isImage
      ? (element as HTMLImageElement).src
      : isInputOrTextarea
      ? ((element as HTMLInputElement | HTMLTextAreaElement).placeholder || (element as HTMLInputElement | HTMLTextAreaElement).value || '')
      : (element.textContent?.trim() ?? '');
    const extractedContext = extractCollectionContext(element);
    let collectionPath =
      field?.collection?.listPath ??
      field?.collection?.path ??
      field?.context?.collectionPath ??
      extractedContext.collectionPath;
    let itemIndex =
      field?.collection?.itemIndex ??
      field?.context?.itemIndex ??
      extractedContext.itemIndex;

    if (
      collectionPath &&
      fieldPath &&
      field?.kind !== 'collection' &&
      !fieldPath.startsWith(`${collectionPath}[`) &&
      !fieldPath.startsWith(`${collectionPath}.`) &&
      fieldPath !== collectionPath
    ) {
      collectionPath = null;
      itemIndex = null;
    }

    const itemPath =
      field?.context?.itemPath ??
      (collectionPath && typeof itemIndex === 'number'
        ? `${collectionPath}[${itemIndex}]`
        : null);

    const safeScopePart = (value: string | null | undefined) =>
      String(value ?? '')
        .trim()
        .replace(/[^a-zA-Z0-9_.-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 64);
    const styleScopes: Array<{
      kind: 'element' | 'card' | 'grid' | 'section' | 'page' | 'site';
      key: string;
      label: string;
    }> = [];
    const pushStyleScope = (
      kind: 'element' | 'card' | 'grid' | 'section' | 'page' | 'site',
      key: string | null | undefined,
      label: string,
    ) => {
      if (!key || styleScopes.some((scope) => scope.key === key)) return;
      styleScopes.push({ kind, key, label });
    };
    pushStyleScope('element', fieldPath, 'This element');
    const navbarElement = element.closest<HTMLElement>('[data-design-section="navbar"][data-preview-style-target]');
    pushStyleScope('card', navbarElement?.getAttribute('data-preview-style-target'), 'Whole navbar');
    const cardElement = element.closest<HTMLElement>(
      `[${ITEM_PATH_ATTRIBUTE}]`,
    );
    pushStyleScope(
      'card',
      cardElement?.getAttribute(ITEM_PATH_ATTRIBUTE) ?? itemPath,
      'This card',
    );
    const gridElement = element.closest<HTMLElement>(
      `[${LIST_PATH_ATTRIBUTE}]`,
    );
    pushStyleScope(
      'grid',
      gridElement?.getAttribute(LIST_PATH_ATTRIBUTE) ?? collectionPath,
      'Entire grid',
    );
    const pageElement = element.closest<HTMLElement>(
      '[data-preview-page-key]',
    );
    const pageKey = safeScopePart(
      pageElement?.getAttribute('data-preview-page-key'),
    );
    const sectionElement = element.closest<HTMLElement>(
      'section,[data-design-section],[data-section-id]',
    );
    if (sectionElement) {
      const explicitSectionKey = safeScopePart(
        sectionElement.getAttribute('data-design-section') ??
          sectionElement.getAttribute('data-section-id') ??
          sectionElement.id,
      );
      const sectionSiblings = sectionElement.parentElement
        ? Array.from(sectionElement.parentElement.children).filter(
            (candidate) => candidate.tagName === 'SECTION',
          )
        : [];
      const sectionIndex = sectionSiblings.indexOf(sectionElement) + 1;
      const sectionKey =
        explicitSectionKey || (sectionIndex > 0 ? `nth-${sectionIndex}` : '');
      pushStyleScope(
        'section',
        sectionKey
          ? `section:${pageKey || 'all'}:${sectionKey}`
          : null,
        'This section',
      );
    }
    pushStyleScope(
      'page',
      pageKey ? `page:${pageKey}` : null,
      'Current page',
    );
    pushStyleScope('site', 'site:all', 'Whole website');

    const clickPayload = {
      type: CLICK_MESSAGE,
      fieldPath,
      descriptorKind: field?.kind ?? 'field',
      ...(element.getAttribute('data-preview-style-type') ? {
        styleType: element.getAttribute('data-preview-style-type'),
      } : {}),
      fieldValue,
      // Storage type alone cannot distinguish icon-name strings from copy.
      // Preserve the same control hint used in editorSchema and EditableIcon.
      ...(element.getAttribute('data-preview-control') || field?.control ? {
        control: element.getAttribute('data-preview-control') || field?.control,
      } : {}),
      ...(element.getAttribute('data-preview-control') === 'icon-picker' ? {
        iconType: element.getAttribute('data-preview-icon-type') ?? 'lucide',
        iconName: element.getAttribute('data-preview-icon') ?? field?.value ?? '',
      } : {}),
      elementTag: element.tagName.toLowerCase(),
      isImage,
      boundingRect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      computedStyle: {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        lineHeight: computed.lineHeight,
        fontWeight: computed.fontWeight,
        letterSpacing: computed.letterSpacing,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        textAlign: computed.textAlign,
        width: computed.width,
        height: computed.height,
        minWidth: computed.minWidth,
        minHeight: computed.minHeight,
        maxWidth: computed.maxWidth,
        maxHeight: computed.maxHeight,
        marginTop: computed.marginTop,
        marginRight: computed.marginRight,
        marginBottom: computed.marginBottom,
        marginLeft: computed.marginLeft,
        paddingTop: computed.paddingTop,
        paddingRight: computed.paddingRight,
        paddingBottom: computed.paddingBottom,
        paddingLeft: computed.paddingLeft,
        borderRadius: computed.borderRadius,
      },
      listPath: collectionPath,
      itemPath,
      collectionPath,
      itemIndex,
      relatedFields,
      styleScopes,
    };
    postToParent(clickPayload);
    postToParent({ ...clickPayload, type: LEGACY_CLICK_MESSAGE });
  }

  function emitFieldChange(fieldPath: string, value: string) {
    postToParent({
      type: CHANGE_MESSAGE,
      fieldPath,
      value,
    });
    postToParent({
      type: LEGACY_CHANGE_MESSAGE,
      fieldPath,
      value,
    });
  }

  function finishInlineEdit(commit: boolean) {
    const edit = activeInlineEdit;
    if (!edit) return;
    activeInlineEdit = null;

    edit.target.removeEventListener('keydown', edit.keydown);
    edit.target.removeEventListener('blur', edit.blur);
    const nextValue = commit
      ? (edit.target.innerText ?? edit.target.textContent ?? '')
          .replace(/\u00a0/g, ' ')
          .trim()
      : '';
    if (edit.contentEditable === null) {
      edit.target.removeAttribute('contenteditable');
    } else {
      edit.target.setAttribute('contenteditable', edit.contentEditable);
    }
    if (edit.spellcheck === null) {
      edit.target.removeAttribute('spellcheck');
    } else {
      edit.target.setAttribute('spellcheck', edit.spellcheck);
    }
    edit.target.style.outline = edit.outline;
    edit.target.style.outlineOffset = edit.outlineOffset;
    edit.target.style.cursor = edit.cursor;
    edit.target.style.userSelect = edit.userSelect;
    edit.target.style.textTransform = edit.textTransform;
    // Restore the framework-authored DOM before notifying the host. React (or
    // another renderer) can then apply the value update without reconciling
    // against text nodes that the bridge created.
    edit.target.innerHTML = edit.originalHtml;

    if (!commit) {
      return;
    }

    if (nextValue !== edit.originalText.trim()) {
      edit.field.value = nextValue;
      annotateEditableTarget(edit.target, edit.field);
      emitFieldChange(edit.field.path, nextValue);
    } else if (!nextValue) {
      annotateEditableTarget(edit.target, edit.field);
    }
  }

  function beginInlineEdit(
    target: HTMLElement,
    field: EditableField,
    pointer?: { x: number; y: number },
  ) {
    if (activeInlineEdit?.target === target) return;
    finishInlineEdit(true);
    clearHoverOverlay();
    annotateEditableTarget(target, field);
    target.removeAttribute(EMPTY_EDITABLE_ATTRIBUTE);

    const originalText =
      typeof field.value === 'string' || typeof field.value === 'number'
        ? String(field.value)
        : (target.textContent ?? '');
    const originalHtml = target.innerHTML;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        finishInlineEdit(false);
        return;
      }
      if (
        event.key === 'Enter' &&
        field.type !== 'textarea' &&
        !event.shiftKey
      ) {
        event.preventDefault();
        finishInlineEdit(true);
      }
    };
    const blur = () => finishInlineEdit(true);

    activeInlineEdit = {
      target,
      field,
      originalText,
      originalHtml,
      contentEditable: target.getAttribute('contenteditable'),
      spellcheck: target.getAttribute('spellcheck'),
      outline: target.style.outline,
      outlineOffset: target.style.outlineOffset,
      cursor: target.style.cursor,
      userSelect: target.style.userSelect,
      textTransform: target.style.textTransform,
      keydown,
      blur,
    };

    target.setAttribute(
      'contenteditable',
      supportsPlaintextOnlyContentEditable ? 'plaintext-only' : 'true',
    );
    target.setAttribute('spellcheck', 'true');
    // Inline editing is limited to leaf elements, and finishInlineEdit restores
    // this authored markup before emitting the changed value.
    target.textContent = originalText;
    target.style.outline = '2px solid rgba(37, 99, 235, 0.95)';
    target.style.outlineOffset = '3px';
    target.style.cursor = 'text';
    target.style.userSelect = 'text';
    target.style.textTransform = 'none';
    target.addEventListener('keydown', keydown);
    target.addEventListener('blur', blur);
    target.focus();

    if (pointer) {
      const documentWithCaret = document as Document & {
        caretPositionFromPoint?: (
          x: number,
          y: number,
        ) => { offsetNode: Node; offset: number } | null;
        caretRangeFromPoint?: (x: number, y: number) => Range | null;
      };
      const caretPosition = documentWithCaret.caretPositionFromPoint?.(
        pointer.x,
        pointer.y,
      );
      const range = caretPosition
        ? (() => {
            const nextRange = document.createRange();
            nextRange.setStart(caretPosition.offsetNode, caretPosition.offset);
            nextRange.collapse(true);
            return nextRange;
          })()
        : documentWithCaret.caretRangeFromPoint?.(pointer.x, pointer.y);
      if (range) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    } else {
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  let hoverRafId: number | null = null;
  function onEditMouseOver(event: MouseEvent) {
    if (!editModeActive) return;
    if (activeInlineEdit) return;
    if (isTouchDevice) return;
    if (hoverRafId !== null) return;
    const target = event.target;
    hoverRafId = requestAnimationFrame(() => {
      hoverRafId = null;
      if (!editModeActive || activeInlineEdit) return;
      const editableTarget = findEditableTarget(target);
      if (
        editableTarget &&
        !editableTarget.element.hasAttribute('data-fivora-edit-badge')
      ) {
        applyHoverOverlay(editableTarget.element);
      }
    });
  }

  function onEditMouseOut(event: MouseEvent) {
    if (!editModeActive) return;
    const related =
      event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null;
    if (
      related &&
      (related === hoverBadge ||
        related === hoveredElement ||
        hoveredElement?.contains(related))
    ) {
      return;
    }
    clearHoverOverlay();
  }

  function onEditClick(event: MouseEvent) {
    if (!editModeActive) return;
    if (
      activeInlineEdit &&
      event.target instanceof Node &&
      activeInlineEdit.target.contains(event.target)
    ) {
      return;
    }

    const badge =
      event.target instanceof HTMLElement &&
      event.target.hasAttribute('data-fivora-edit-badge')
        ? event.target
        : null;

    const editableTarget = badge
      ? hoveredElement
        ? {
            element: hoveredElement,
            field: resolveEditableField(hoveredElement),
          }
        : null
      : findEditableTarget(event.target);
    const target = editableTarget?.element;
    const field = editableTarget?.field;
    // Let real CTAs / nav / non-editable controls work. Only intercept
    // clicks that hit an editable field (or its hover badge).
    if (!target || !field) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const relatedFields = findRelatedAncestorFields(target, field);
    if (
      !preferParentPopover &&
      canEditInline(target, field) &&
      relatedFields.length === 0
    ) {
      beginInlineEdit(
        target,
        field,
        badge ? undefined : { x: event.clientX, y: event.clientY },
      );
    } else {
      emitClickEvent(target, field, relatedFields);
    }
  }

  function enterEditMode() {
    if (editModeActive) return;
    editModeActive = true;
    clearHighlight();
    ensureEmptyEditableStyles();
    if (!isTouchDevice && !hoverBadge) {
      hoverBadge = createHoverBadge();
    }
    if (!isTouchDevice) {
      document.addEventListener('mouseover', onEditMouseOver, true);
      document.addEventListener('mouseout', onEditMouseOut, true);
    }
    document.addEventListener('click', onEditClick, true);
    document.addEventListener('submit', preventEditModeSubmit, true);
    scheduleEditableTargetIndex();
  }

  function preventEditModeSubmit(event: Event) {
    if (!editModeActive) return;
    event.preventDefault();
    event.stopPropagation();
  }

  function exitEditMode() {
    if (!editModeActive) return;
    editModeActive = false;
    indexScheduled = false;
    finishInlineEdit(true);
    clearHoverOverlay();
    if (hoverRafId !== null) {
      cancelAnimationFrame(hoverRafId);
      hoverRafId = null;
    }
    for (const timeout of indexTimeouts) {
      window.clearTimeout(timeout);
    }
    indexTimeouts = [];
    if (indexIdleHandle !== null) {
      const cancelIdle = (
        window as Window & {
          cancelIdleCallback?: (handle: number) => void;
        }
      ).cancelIdleCallback;
      if (typeof cancelIdle === 'function') {
        cancelIdle(indexIdleHandle);
      } else {
        window.clearTimeout(indexIdleHandle);
      }
      indexIdleHandle = null;
    }
    clearResolvedEditableTargets();
    document
      .querySelectorAll(
        `[${EMPTY_EDITABLE_ATTRIBUTE}], [${EMPTY_COLLECTION_ATTRIBUTE}]`,
      )
      .forEach((element) => {
        element.removeAttribute(EMPTY_EDITABLE_ATTRIBUTE);
        element.removeAttribute(EMPTY_COLLECTION_ATTRIBUTE);
      });
    document.removeEventListener('mouseover', onEditMouseOver, true);
    document.removeEventListener('mouseout', onEditMouseOut, true);
    document.removeEventListener('click', onEditClick, true);
    document.removeEventListener('submit', preventEditModeSubmit, true);
  }

  // Restore live data/edit mode and tell the host which page is open after
  // both full document loads and client-side router navigation.
  function normalizePreviewHistoryUrl(url?: string | URL | null) {
    if (url == null) return url;
    try {
      const parsed = new URL(String(url), window.location.href);
      if (parsed.origin !== window.location.origin) return url;
      const pathname = normalizePreviewNavigationPath(parsed.pathname);
      if (pathname === parsed.pathname) return url;
      return `${pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return url;
    }
  }

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);
  window.history.pushState = (data, unused, url) => {
    originalPushState(data, unused, normalizePreviewHistoryUrl(url));
    window.setTimeout(announceReady, 0);
  };
  window.history.replaceState = (data, unused, url) => {
    originalReplaceState(data, unused, normalizePreviewHistoryUrl(url));
    window.setTimeout(announceReady, 0);
  };
  window.addEventListener('popstate', announceReady);

  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const rawUrl =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : null;
    if (!rawUrl) return originalFetch(input, init);
    try {
      const parsed = new URL(rawUrl, window.location.href);
      if (parsed.origin !== window.location.origin) {
        return originalFetch(input, init);
      }
      const pathname = normalizePreviewNavigationPath(parsed.pathname);
      if (pathname === parsed.pathname) return originalFetch(input, init);
      parsed.pathname = pathname;
      return originalFetch(parsed.href, init);
    } catch {
      return originalFetch(input, init);
    }
  };

  // Template/design previews are inert sandboxes. Forms can be exercised
  // visually, but must not create enquiries, reservations, orders, or open
  // third-party actions using validation/demo data.
  const isInertPreview =
    /^\/uploads\/generated-sites\/(?:template-preview|preview)\//.test(
      window.location.pathname,
    );
  if (isInertPreview) {
    window.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const form = event.target;
        if (!(form instanceof HTMLFormElement)) return;
        let status = form.parentElement?.querySelector<HTMLElement>(
          '[data-fivora-preview-action-status]',
        );
        if (!status) {
          status = document.createElement('p');
          status.setAttribute('data-fivora-preview-action-status', 'true');
          status.setAttribute('role', 'status');
          status.style.marginTop = '0.75rem';
          form.insertAdjacentElement('afterend', status);
        }
        status.textContent =
          'Preview only — this form was not submitted. It becomes active on the published website.';
      },
      true,
    );
  }

  // Static template previews are HTML exports — Next.js soft navigation tries
  // to fetch missing RSC `.txt` payloads (404 spam) and glitches the preview.
  // Force same-site internal links to full document loads; cached site data
  // prevents demo-content flash on remount.
  installSectionNavigation();

  function resolvePreviewRootPrefix() {
    const match = window.location.pathname.match(
      /^(\/uploads\/generated-sites\/(?:template-preview|[^/]+)\/[^/]+)/,
    );
    return match?.[1] ?? '';
  }

  function resolveInternalPreviewNavigation(anchor: HTMLAnchorElement) {
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('download')) return false;
    const rawHref = anchor.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#')) return false;
    if (/^(mailto:|tel:|sms:|whatsapp:|javascript:)/i.test(rawHref)) {
      return false;
    }
    const root = resolvePreviewRootPrefix();
    // Some templates accidentally emit the configured basePath without its
    // leading slash. Browsers then append the whole path to the current page,
    // producing /template-preview/<id>/uploads/generated-sites/... . Repair
    // that package-level mistake at the preview boundary so customer design
    // previews remain navigable while the developer fixes the template.
    const candidateHref = rawHref.startsWith('uploads/generated-sites/')
      ? `/${rawHref}`
      : root && rawHref.startsWith(root.slice(1))
        ? `/${rawHref}`
        : rawHref;
    let url: URL;
    try {
      url = new URL(candidateHref, window.location.href);
    } catch {
      return false;
    }
    if (url.origin !== window.location.origin) return false;
    if (root && !url.pathname.startsWith(root)) return false;
    const current = window.location.pathname.replace(/\/+$/, '') || '/';
    const next = url.pathname.replace(/\/+$/, '') || '/';
    return current !== next || url.search !== window.location.search
      ? url
      : false;
  }

  document.addEventListener(
    'click',
    (event) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.(
        'a[href]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const target = resolveInternalPreviewNavigation(anchor);
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(target.href);
    },
    true,
  );

  announceReady();
}

const NAME_SHIM =
  "var __name = typeof __name === 'function' ? __name : ((target, value) => (typeof Object.defineProperty === 'function' ? Object.defineProperty(target, 'name', { value, configurable: true }) : target));\n";

export const TEMPLATE_PREVIEW_FOCUS_BRIDGE_SCRIPT =
  NAME_SHIM +
  `;(${fivoraPreviewFocusBridge.toString()})` +
  `(${resolveTemplatePreviewParentOrigin.toString()},` +
  `${buildUniversalTemplateThemeCss.toString()},` +
  `${replaceTemplateColorLiterals.toString()},` +
  `${JSON.stringify(UNIVERSAL_TEMPLATE_THEME_STYLE_ID)},` +
  `${enforceSelectedTemplatePages.toString()},` +
  `${normalizeTemplatePreviewNavigationPath.toString()},` +
  `${installUniversalSectionNavigation.toString()});`;
