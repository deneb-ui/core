import {
  buildStyleFallbackSelectors,
  STYLE_TARGET_ATTRIBUTE,
  STYLE_TYPE_ATTRIBUTE,
} from "../types/markers";
import type { StyleKind } from "../types/styles";
import { deepMerge } from "./deepMerge";
import { formatUnit, styleToCssVariables } from "./cssVariables";
import { resolveFontFamily } from "../fonts/resolve";
import { resolveThemeToken } from "./tokenResolver";

const liveStyleCache = new Map<string, Record<string, unknown>>();

export function getLiveStyleCache(): Map<string, Record<string, unknown>> {
  return liveStyleCache;
}

export function applyCssVariablesToElement(
  element: HTMLElement,
  cssVars: Record<string, string>,
): void {
  for (const [varName, varVal] of Object.entries(cssVars)) {
    if (varVal) {
      element.style.setProperty(varName, varVal);
    } else {
      element.style.removeProperty(varName);
    }
  }
}

export function findStyleTargetElement(
  targetPath: string,
  styleType?: StyleKind,
): HTMLElement | null {
  if (typeof document === "undefined" || !targetPath) return null;
  for (const selector of buildStyleFallbackSelectors(targetPath, styleType)) {
    const match = document.querySelector<HTMLElement>(selector);
    if (match) return match;
  }
  return null;
}

export function patchElementStyle(
  element: HTMLElement,
  styleKind: StyleKind,
  updates: Record<string, unknown>,
): void {
  const targetPath = element.getAttribute(STYLE_TARGET_ATTRIBUTE) ?? "";
  const cacheKey = targetPath || element.getAttribute("data-preview-field-path") || "";
  const previous = cacheKey ? liveStyleCache.get(cacheKey) ?? {} : {};
  const merged = deepMerge(previous, updates);
  if (cacheKey) liveStyleCache.set(cacheKey, merged);

  const cssVars = {
    ...styleToCssVariables(styleKind, merged),
    ...(element.getAttribute('data-design-section') === 'navbar'
      ? { ...styleToCssVariables('text', merged), ...styleToCssVariables('card', merged) }
      : {}),
  };
  applyCssVariablesToElement(element, cssVars);

  // Directly set standard CSS properties on inline style for instant rendering
  if (styleKind === "text") {
    if (merged.color) {
      const c = resolveThemeToken(String(merged.color)) || String(merged.color);
      element.style.setProperty("color", c, "important");
    }
    if (merged.textAlign) {
      element.style.setProperty("text-align", String(merged.textAlign), "important");
    }
    if (merged.fontSize !== undefined) {
      const s = formatUnit(merged.fontSize as string | number) || String(merged.fontSize);
      element.style.setProperty("font-size", s, "important");
    }
    if (merged.lineHeight !== undefined) {
      element.style.setProperty("line-height", String(merged.lineHeight), "important");
    }
    if (merged.fontFamily) {
      const f = resolveFontFamily(String(merged.fontFamily)) || String(merged.fontFamily);
      element.style.setProperty("font-family", f, "important");
    }
    if (merged.fontWeight !== undefined) {
      element.style.setProperty("font-weight", String(merged.fontWeight), "important");
    }
    if (merged.marginTop !== undefined || merged.spacingTop !== undefined) {
      const top = formatUnit((merged.marginTop ?? merged.spacingTop) as string | number);
      if (top) element.style.setProperty("margin-top", top, "important");
    }
    if (merged.marginBottom !== undefined || merged.spacingBottom !== undefined) {
      const bottom = formatUnit((merged.marginBottom ?? merged.spacingBottom) as string | number);
      if (bottom) element.style.setProperty("margin-bottom", bottom, "important");
    }
    if (merged.marginLeft !== undefined || merged.spacingLeft !== undefined) {
      const left = formatUnit((merged.marginLeft ?? merged.spacingLeft) as string | number);
      if (left) element.style.setProperty("margin-left", left, "important");
    }
    if (merged.marginRight !== undefined || merged.spacingRight !== undefined) {
      const right = formatUnit((merged.marginRight ?? merged.spacingRight) as string | number);
      if (right) element.style.setProperty("margin-right", right, "important");
    }
  } else if (styleKind === "card") {
    if (merged.backgroundColor) {
      const bg = resolveThemeToken(String(merged.backgroundColor)) || String(merged.backgroundColor);
      element.style.setProperty("background-color", bg, "important");
      element.style.setProperty("background", bg, "important");
    }
    if (merged.borderRadius !== undefined) {
      const r = formatUnit(merged.borderRadius as string | number) || String(merged.borderRadius);
      element.style.setProperty("border-radius", r, "important");
    }
    if (merged.padding !== undefined) {
      const pad = formatUnit(merged.padding as string | number);
      if (pad) element.style.setProperty("padding", pad, "important");
    }
    // Preserve independent edges; paddingTop must not change all four sides.
    for (const edge of ['Top', 'Bottom', 'Left', 'Right'] as const) {
      const paddingValue = merged[`padding${edge}`];
      if (paddingValue !== undefined) {
        const value = formatUnit(paddingValue as string | number);
        if (value) element.style.setProperty(`padding-${edge.toLowerCase()}`, value, 'important');
      }
      const marginValue = merged[`margin${edge}`] ?? merged[`spacing${edge}`];
      if (marginValue !== undefined) {
        const value = formatUnit(marginValue as string | number);
        if (value) element.style.setProperty(`margin-${edge.toLowerCase()}`, value, 'important');
      }
    }
    if (merged.gap !== undefined) {
      const value = formatUnit(merged.gap as string | number);
      if (value) element.style.setProperty('gap', value, 'important');
    }
    if (merged.boxShadow) {
      element.style.setProperty("box-shadow", String(merged.boxShadow), "important");
    }
    if (merged.borderColor) {
      element.style.setProperty("border-color", String(merged.borderColor), "important");
    }
    if (merged.borderWidth !== undefined) {
      const bw = formatUnit(merged.borderWidth as string | number) || String(merged.borderWidth);
      element.style.setProperty("border-width", bw, "important");
      element.style.setProperty("border-style", "solid", "important");
    }
  }

  if (!element.getAttribute(STYLE_TYPE_ATTRIBUTE)) {
    element.setAttribute(STYLE_TYPE_ATTRIBUTE, styleKind);
  }
}

export function patchStyleByPath(
  targetPath: string,
  styleKind: StyleKind,
  updates: Record<string, unknown>,
): boolean {
  if (typeof document === "undefined" || !targetPath) return false;
  let matched = false;
  for (const selector of buildStyleFallbackSelectors(targetPath, styleKind)) {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (elements.length > 0) {
      elements.forEach((el) => patchElementStyle(el, styleKind, updates));
      matched = true;
    }
  }
  return matched;
}
