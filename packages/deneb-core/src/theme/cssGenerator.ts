import { TemplateThemeShape } from './types';
import { isDarkColor, getAutoContrastTextColor } from './contrast';

/**
 * Computes all canonical CSS variables for a theme, automatically resolving
 * dark/light mode contrasts, button states, card surfaces, and input tokens.
 */
export function generateThemeVariables(
  theme?: TemplateThemeShape | null,
): Record<string, string> {
  const customVars: Record<string, string> = {};

  if (theme) {
    for (const [key, val] of Object.entries(theme)) {
      if (typeof val === 'string' || typeof val === 'number') {
        const cssVarName = `--${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
        customVars[cssVarName] = String(val);
      }
    }
  }

  const isDark = isDarkColor(theme?.backgroundColor);
  const bgColor = (theme?.backgroundColor as string) || (isDark ? '#0f172a' : '#ffffff');
  const textColor = (theme?.textColor as string) || (isDark ? '#f8fafc' : '#0f172a');
  const mutedColor =
    (theme?.mutedTextColor as string) ||
    (isDark ? 'rgba(248, 250, 252, 0.7)' : '#64748b');
  const borderColor =
    (theme?.borderColor as string) ||
    (isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0');
  const cardBg =
    (theme?.cardBackgroundColor as string) ||
    (theme?.surfaceColor as string) ||
    (isDark ? '#111a2e' : '#ffffff');
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.09)' : borderColor;

  const primaryColor = (theme?.primaryColor as string) || '#2563eb';
  const secondaryColor =
    (theme?.secondaryColor as string) || (isDark ? '#1e293b' : '#0f172a');
  const accentColor = (theme?.accentColor as string) || '#14b8a6';

  const buttonBg = (theme?.buttonBackgroundColor as string) || primaryColor;
  const autoButtonText = getAutoContrastTextColor(buttonBg);
  const buttonText = (theme?.buttonTextColor as string) || autoButtonText;

  const buttonSecondaryBg = isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : secondaryColor && !isDarkColor(secondaryColor)
      ? secondaryColor
      : '#f1f5f9';
  const buttonSecondaryText = isDark ? '#f8fafc' : '#0f172a';

  return {
    '--brand-color': primaryColor,
    '--brand-primary': primaryColor,
    '--primary-color': primaryColor,
    '--color-primary': primaryColor,
    '--primary': primaryColor,
    '--brand-secondary': secondaryColor,
    '--secondary-color': secondaryColor,
    '--color-secondary': buttonSecondaryBg,
    '--secondary': buttonSecondaryBg,
    '--brand-accent': accentColor,
    '--accent-color': accentColor,
    '--color-accent': accentColor,
    '--accent': accentColor,
    '--page-background': bgColor,
    '--page-bg': bgColor,
    '--background': bgColor,
    '--page-text': textColor,
    '--color-text': textColor,
    '--text-color': textColor,
    '--text': textColor,
    '--foreground': textColor,
    '--color-foreground': textColor,
    '--heading-color':
      (theme?.headingColor as string) || (isDark ? '#ffffff' : secondaryColor),
    '--color-heading':
      (theme?.headingColor as string) || (isDark ? '#ffffff' : secondaryColor),
    '--muted-text': mutedColor,
    '--text-muted': mutedColor,
    '--color-text-muted': mutedColor,
    '--muted': mutedColor,
    '--link-color': (theme?.linkColor as string) || primaryColor,
    '--border-primary': borderColor,
    '--border': borderColor,
    '--color-border': borderColor,
    '--color-surface': isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
    '--surface': isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
    '--card-bg': cardBg,
    '--card': cardBg,
    '--card-background': cardBg,
    '--card-border': cardBorder,
    '--product-card-bg': cardBg,
    '--product-card-border': cardBorder,
    '--tag-bg': isDark
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(241, 245, 249, 0.9)',
    '--tag-color': mutedColor,
    '--card-shadow': isDark
      ? '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
      : '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
    '--header-bg': (theme?.headerBackgroundColor as string) || (isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.82)'),
    '--footer-bg': (theme?.footerBackgroundColor as string) || (isDark ? '#0b0f19' : '#f8fafc'),
    '--input-bg': isDark ? '#1e293b' : '#ffffff',
    '--input-border': isDark ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1',
    '--input-color': textColor,
    // Dedicated Button Design Tokens
    '--button-bg': buttonBg,
    '--button-text': buttonText,
    '--button-primary-bg': buttonBg,
    '--button-primary-text': buttonText,
    '--button-secondary-bg': buttonSecondaryBg,
    '--button-secondary-text': buttonSecondaryText,
    '--button-outline-border': isDark ? 'rgba(255, 255, 255, 0.22)' : 'currentColor',
    '--button-outline-text': isDark ? '#f8fafc' : textColor,
    '--button-ghost-text': isDark ? '#f8fafc' : textColor,
    '--hero-min-height': (theme?.heroMinHeight as string) || '72vh',
    '--section-padding': (theme?.sectionPadding as string) || '5rem',
    '--base-size': (theme?.baseSize as string) || '16px',
    '--heading-font': (theme?.headingFont as string) || 'Inter, sans-serif',
    '--body-font': (theme?.bodyFont as string) || 'Inter, sans-serif',
    '--border-radius': (theme?.borderRadius as string) || '8px',
    '--content-align': (theme?.align as string) || 'left',
    ...customVars,
  };
}
