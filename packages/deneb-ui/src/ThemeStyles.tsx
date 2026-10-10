import React from 'react';
import { isDarkColor, getAutoContrastTextColor, generateThemeVariables } from '@deneb-ui/core';
import { ResponsiveBaseStyles } from './ResponsiveBaseStyles';

export interface TemplateTheme {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  headingColor?: string;
  mutedTextColor?: string;
  linkColor?: string;
  heroMinHeight?: string;
  sectionPadding?: string;
  baseSize?: string;
  headingFont?: string;
  bodyFont?: string;
  borderRadius?: string;
  align?: 'left' | 'center' | 'right';
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  dark?: Partial<TemplateTheme>;
  light?: Partial<TemplateTheme>;
  [key: string]: unknown;
}

/**
 * Pre-configured, high-converting theme presets tailored for different business categories.
 * Allows developers and AI agents to instantly generate distinct designs without copy-pasting styles.
 */
export const THEME_PRESETS: Record<string, TemplateTheme> = {
  restaurant: {
    primaryColor: '#b45309', // Warm amber
    secondaryColor: '#1c1917', // Deep charcoal
    accentColor: '#f59e0b', // Golden yellow
    backgroundColor: '#0c0a09', // Dark atmospheric background
    textColor: '#f5f5f4', // Off-white
    headingFont: 'Playfair Display, Georgia, serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '12px',
    align: 'left',
  },
  medical: {
    primaryColor: '#0284c7', // Serene ocean blue
    secondaryColor: '#0f172a', // Deep slate
    accentColor: '#0d9488', // Teal accent
    backgroundColor: '#ffffff', // Pure clean white
    textColor: '#334155', // Slate body text
    headingFont: 'Plus Jakarta Sans, sans-serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '8px',
    align: 'left',
  },
  luxury: {
    primaryColor: '#d4af37', // Metallic gold
    secondaryColor: '#000000', // Jet black
    accentColor: '#e5e5e5', // Platinum silver
    backgroundColor: '#0a0a0a', // Obsidian dark
    textColor: '#ffffff',
    headingFont: 'Cormorant Garamond, serif',
    bodyFont: 'Montserrat, sans-serif',
    borderRadius: '4px',
    align: 'center',
  },
  tech: {
    primaryColor: '#6366f1', // Electric indigo
    secondaryColor: '#0f172a', // Dark slate
    accentColor: '#06b6d4', // Neon cyan
    backgroundColor: '#030712', // Midnight abyss
    textColor: '#f8fafc',
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '16px',
    align: 'left',
  },
  retail: {
    primaryColor: '#e11d48', // Vibrant rose/coral
    secondaryColor: '#18181b', // Zinc
    accentColor: '#fbbf24', // Sunny amber
    backgroundColor: '#ffffff',
    textColor: '#27272a',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '12px',
    align: 'left',
  },
  corporate: {
    primaryColor: '#1e3a8a', // Corporate navy
    secondaryColor: '#0f172a', // Slate
    accentColor: '#3b82f6', // Bright cobalt
    backgroundColor: '#f8fafc', // Soft light gray
    textColor: '#1e293b',
    headingFont: 'Merriweather, serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '6px',
    align: 'left',
  },
  cyberpunk: {
    primaryColor: '#f43f5e', // Neon crimson
    secondaryColor: '#09090b', // Deep zinc
    accentColor: '#06b6d4', // Electric cyan
    backgroundColor: '#09090b', // Dark void
    textColor: '#f4f4f5',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '4px',
    align: 'left',
  },
  minimalDark: {
    primaryColor: '#e2e8f0', // Clean silver
    secondaryColor: '#000000', // Pitch black
    accentColor: '#38bdf8', // Sky accent
    backgroundColor: '#0c0a09', // Dark basalt
    textColor: '#f1f5f9',
    headingFont: 'Plus Jakarta Sans, sans-serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '12px',
    align: 'left',
  },
  nordicPastel: {
    primaryColor: '#0f766e', // Nordic pine
    secondaryColor: '#1e293b', // Deep slate
    accentColor: '#f59e0b', // Amber sun
    backgroundColor: '#fafaf9', // Crisp stone
    textColor: '#334155',
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Inter, sans-serif',
    borderRadius: '16px',
    align: 'left',
  },
  emeraldGold: {
    primaryColor: '#059669', // Emerald
    secondaryColor: '#064e3b', // Deep forest
    accentColor: '#d97706', // Imperial gold
    backgroundColor: '#022c22', // Emerald dark
    textColor: '#ecfdf5',
    headingFont: 'Cormorant Garamond, serif',
    bodyFont: 'Montserrat, sans-serif',
    borderRadius: '10px',
    align: 'center',
  },
};


/**
 * Merges category presets with custom developer/agent overrides.
 */
export function getCategoryTheme(
  category: keyof typeof THEME_PRESETS | string,
  overrides?: Partial<TemplateTheme>,
): TemplateTheme {
  const base = THEME_PRESETS[category] || THEME_PRESETS.tech;
  return { ...base, ...overrides };
}

/**
 * Extracts a typed CSSProperties object containing both standard and custom theme tokens.
 * Any custom property defined by a developer in `theme` (e.g. cardBg: "#111")
 * is automatically converted to a CSS variable (e.g. --card-bg: #111).
 */
export function getThemeCssProperties(theme?: TemplateTheme | null): React.CSSProperties {
  const vars = generateThemeVariables(theme as any);
  return {
    ...vars,
    fontFamily: (theme?.bodyFont as string) || 'Inter, sans-serif',
  } as React.CSSProperties;
}

export interface ThemeStylesProps {
  theme?: TemplateTheme | null;
  defaultPrimary?: string;
  defaultSecondary?: string;
  defaultAccent?: string;
  defaultBg?: string;
  defaultText?: string;
  /**
   * Automatically generate opposite mode selectors (.dark / .light or [data-theme="..."])
   * so templates with theme switchers transition without writing manual CSS.
   * Default: true.
   */
  enableDualMode?: boolean;
}

/**
 * Automatically injects standard and custom fivora theme variables into the document.
 * Supports light-only, dark-only, and dual-mode (light & dark toggle) templates.
 */
export function ThemeStyles({
  theme,
  enableDualMode = true,
}: ThemeStylesProps) {
  const styleProps = getThemeCssProperties(theme);
  const baseLines = Object.entries(styleProps)
    .filter(([key]) => key.startsWith('--'))
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  let css = `
    :root {
${baseLines}
    }
    html, body {
      background-color: var(--page-background, var(--background, #ffffff));
      color: var(--page-text, var(--color-text, #0f172a));
    }
  `;

  if (enableDualMode) {
    const isDarkBase = isDarkColor(theme?.backgroundColor);
    if (isDarkBase) {
      // Base theme is dark. Generate light mode rules for .light or [data-theme="light"]
      const lightTheme: TemplateTheme = {
        ...theme,
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        mutedTextColor: '#64748b',
        ...(theme?.light || {}),
      };
      const lightProps = getThemeCssProperties(lightTheme);
      const lightLines = Object.entries(lightProps)
        .filter(([key]) => key.startsWith('--'))
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n');

      css += `
    .light, [data-theme="light"] {
${lightLines}
    }
    .light body, [data-theme="light"] body {
      background-color: var(--page-background, var(--background, #ffffff));
      color: var(--page-text, var(--color-text, #0f172a));
    }
      `;
    } else {
      // Base theme is light. Generate dark mode rules for .dark or [data-theme="dark"]
      const darkTheme: TemplateTheme = {
        ...theme,
        backgroundColor: '#090d1a',
        textColor: '#f8fafc',
        mutedTextColor: 'rgba(248, 250, 252, 0.7)',
        ...(theme?.dark || {}),
      };
      const darkProps = getThemeCssProperties(darkTheme);
      const darkLines = Object.entries(darkProps)
        .filter(([key]) => key.startsWith('--'))
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n');

      css += `
    .dark, [data-theme="dark"] {
${darkLines}
    }
    .dark body, [data-theme="dark"] body {
      background-color: var(--page-background, var(--background, #090d1a));
      color: var(--page-text, var(--color-text, #f8fafc));
    }
      `;
    }
  }

  return (
    <>
      <ResponsiveBaseStyles />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
