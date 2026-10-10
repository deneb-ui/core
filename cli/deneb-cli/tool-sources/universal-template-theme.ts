import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const UNIVERSAL_TEMPLATE_THEME_STYLE_ID =
  'fivora-universal-design-overrides';

export type TemplateColorPaletteEntry = {
  color: string;
  usageCount: number;
};

export function extractTemplateColorPalette(
  sourceTexts: readonly string[],
): TemplateColorPaletteEntry[] {
  const colors = new Map<string, { usageCount: number; order: number }>();
  const authoredUtilityColors = new Set<string>();
  let order = 0;
  const record = (color: string) => {
    const normalized = color.toLowerCase();
    const existing = colors.get(normalized);
    if (existing) {
      existing.usageCount += 1;
      return;
    }
    colors.set(normalized, { usageCount: 1, order: order++ });
  };
  const toHex = (red: number, green: number, blue: number) =>
    `#${[red, green, blue]
      .map((channel) => channel.toString(16).padStart(2, '0'))
      .join('')}`;

  for (const source of sourceTexts) {
    const authoredPattern = /\\#([0-9a-f]{6}|[0-9a-f]{3})(?![0-9a-f])/gi;
    for (const match of source.matchAll(authoredPattern)) {
      const value = match[1].toLowerCase();
      authoredUtilityColors.add(
        value.length === 3
          ? `#${[...value].map((digit) => digit.repeat(2)).join('')}`
          : `#${value}`,
      );
    }
    const hexPattern = /(?<!\\)#([0-9a-f]{6}|[0-9a-f]{3})(?![0-9a-f])/gi;
    for (const match of source.matchAll(hexPattern)) {
      const value = match[1].toLowerCase();
      record(
        value.length === 3
          ? `#${[...value].map((digit) => digit.repeat(2)).join('')}`
          : `#${value}`,
      );
    }
    const rgbPattern =
      /rgba?\(\s*(\d{1,3})(?:\s+|,\s*)(\d{1,3})(?:\s+|,\s*)(\d{1,3})/gi;
    for (const match of source.matchAll(rgbPattern)) {
      const channels = match.slice(1, 4).map(Number);
      if (channels.some((channel) => channel < 0 || channel > 255)) continue;
      record(toHex(channels[0], channels[1], channels[2]));
    }
  }

  return [...colors.entries()]
    .map(([color, metadata]) => ({ color, ...metadata }))
    .filter(
      (entry) =>
        authoredUtilityColors.size === 0 ||
        authoredUtilityColors.has(entry.color),
    )
    .sort(
      (left, right) =>
        right.usageCount - left.usageCount || left.order - right.order,
    )
    .slice(0, 40)
    .map(({ color, usageCount }) => ({ color, usageCount }));
}

export async function collectTemplateColorPaletteFromDirectory(
  root: string,
  options?: { includeSourceFiles?: boolean },
) {
  const colorFiles: string[] = [];
  const extensions = options?.includeSourceFiles
    ? /\.(?:css|js|jsx|ts|tsx)$/i
    : /\.css$/i;
  const ignoredDirectories = new Set(['node_modules', '.next', 'out', 'dist']);
  const visit = async (directory: string) => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
        await visit(path);
      } else if (entry.isFile() && extensions.test(entry.name)) {
        colorFiles.push(path);
      }
    }
  };
  await visit(root);
  const contents = await Promise.all(
    colorFiles.map((filePath) => readFile(filePath, 'utf8')),
  );
  return extractTemplateColorPalette(contents);
}

export function replaceTemplateColorLiterals(
  sourceText: string,
  replacementsValue: unknown,
) {
  if (
    !replacementsValue ||
    typeof replacementsValue !== 'object' ||
    Array.isArray(replacementsValue)
  ) {
    return sourceText;
  }

  const normalize = (value: string) => {
    const color = value.trim().toLowerCase();
    const short = color.match(/^#([0-9a-f]{3})$/);
    if (short) {
      return `#${[...short[1]].map((digit) => digit.repeat(2)).join('')}`;
    }
    return /^#[0-9a-f]{6}$/.test(color) ? color : null;
  };
  const variants = new Map<string, string>();
  const rgbVariants = new Map<string, [number, number, number]>();
  for (const [rawSource, rawReplacement] of Object.entries(
    replacementsValue as Record<string, unknown>,
  ).slice(0, 64)) {
    if (typeof rawReplacement !== 'string') continue;
    const source = normalize(rawSource);
    const replacement = normalize(rawReplacement);
    if (!source || !replacement || source === replacement) continue;
    variants.set(source, replacement);
    const channels = (color: string) =>
      [
        Number.parseInt(color.slice(1, 3), 16),
        Number.parseInt(color.slice(3, 5), 16),
        Number.parseInt(color.slice(5, 7), 16),
      ] as [number, number, number];
    rgbVariants.set(channels(source).join(','), channels(replacement));
    if (
      source[1] === source[2] &&
      source[3] === source[4] &&
      source[5] === source[6]
    ) {
      variants.set(`#${source[1]}${source[3]}${source[5]}`, replacement);
    }
  }
  if (variants.size === 0) return sourceText;

  const alternatives = [...variants.keys()]
    .sort((left, right) => right.length - left.length)
    .map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(
    `(?<!\\\\)(?:${alternatives.join('|')})(?![0-9a-f])`,
    'gi',
  );
  const replacedHex = sourceText.replace(pattern, (match) => {
    const normalized = normalize(match);
    return normalized ? (variants.get(normalized) ?? match) : match;
  });
  const rgbPattern =
    /(rgba?\(\s*)(\d{1,3})(\s+|,\s*)(\d{1,3})(\s+|,\s*)(\d{1,3})/gi;
  return replacedHex.replace(
    rgbPattern,
    (match, prefix, red, firstSeparator, green, secondSeparator, blue) => {
      const replacement = rgbVariants.get(`${red},${green},${blue}`);
      if (!replacement) return match;
      return `${prefix}${replacement[0]}${firstSeparator}${replacement[1]}${secondSeparator}${replacement[2]}`;
    },
  );
}

/**
 * Builds the platform-owned fallback design layer used by all templates.
 * Keep this function self-contained: it is also serialized into the preview
 * iframe bridge, where imported helpers are not available.
 */
export function buildUniversalTemplateThemeCss(themeValue: unknown): string {
  const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  const hasCustomizations =
    isRecord(themeValue) &&
    (themeValue.designCustomizationVersion === 1 ||
      Boolean(themeValue.elementStyles) ||
      Boolean(themeValue.sections));
  if (!isRecord(themeValue) || !hasCustomizations) {
    return '';
  }

  const theme = themeValue;
  const safeValue = (value: unknown) => {
    if (typeof value === 'number') return `${value}px`;
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (
      !trimmed ||
      trimmed.length > 160 ||
      /[;{}<>\r\n]/.test(trimmed) ||
      /(?:url\s*\(|expression\s*\(|@import|javascript:)/i.test(trimmed)
    ) {
      return '';
    }
    return trimmed;
  };
  const read = (key: string) => safeValue(theme[key]);
  const declaration = (property: string, value: string) =>
    value ? `${property}:${value} !important;` : '';
  const rule = (selector: string, declarations: string[]) => {
    const body = declarations.filter(Boolean).join('');
    return body ? `${selector}{${body}}` : '';
  };
  const backgroundDeclarations = (value: string) =>
    value
      ? [
          declaration('background', value),
          declaration('background-color', value),
          'background-image:none !important;',
        ]
      : [];
  const alignItems = (value: string) => {
    if (value === 'start') return 'flex-start';
    if (value === 'end') return 'flex-end';
    if (value === 'center' || value === 'stretch') return value;
    return '';
  };
  const gridColumns = (value: string) => {
    const count = Number(value);
    return Number.isInteger(count) && count >= 1 && count <= 6
      ? `repeat(${count},minmax(0,1fr))`
      : '';
  };
  const scale = (() => {
    const value = Number(read('headingScale'));
    return Number.isFinite(value) && value >= 0.75 && value <= 2
      ? String(value)
      : '';
  })();
  const shadow = (value: string) => {
    const shadows: Record<string, string> = {
      none: 'none',
      subtle: '0 4px 14px rgba(15,23,42,.08)',
      medium: '0 12px 30px rgba(15,23,42,.14)',
      strong: '0 22px 55px rgba(15,23,42,.22)',
    };
    return shadows[value] ?? '';
  };

  const isDarkColor = (color: string) => {
    if (!color) return false;
    const hex = color.trim().toLowerCase();
    if (!/^#[0-9a-f]{3,6}$/.test(hex)) return false;
    const fullHex =
      hex.length === 4
        ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
        : hex;
    const r = Number.parseInt(fullHex.slice(1, 3), 16);
    const g = Number.parseInt(fullHex.slice(3, 5), 16);
    const b = Number.parseInt(fullHex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 130;
  };
  const isDark = isDarkColor(read('backgroundColor'));
  const effectiveHeadingColor = read('headingColor') || read('textColor');
  const effectiveTextColor = read('textColor');
  const effectiveMutedColor =
    read('mutedTextColor') ||
    (effectiveTextColor
      ? `color-mix(in srgb, ${effectiveTextColor} 72%, transparent)`
      : '');

  const colorVariables: Array<[string, string]> = [
    ['--brand-color', read('primaryColor')],
    ['--brand-primary', read('primaryColor')],
    ['--primary-color', read('primaryColor')],
    ['--color-primary', read('primaryColor')],
    ['--brand-secondary', read('secondaryColor')],
    ['--secondary-color', read('secondaryColor')],
    ['--brand-accent', read('accentColor')],
    ['--accent-color', read('accentColor')],
    ['--page-background', read('backgroundColor')],
    ['--page-bg', read('backgroundColor') || read('canvasColor')],
    ['--page-text', read('textColor')],
    ['--heading-color', effectiveHeadingColor],
    ['--color-heading', effectiveHeadingColor],
    ['--text-color', read('textColor')],
    ['--text', read('textColor')],
    ['--foreground', read('textColor')],
    ['--color-foreground', read('textColor')],
    ['--bg-primary', read('backgroundColor') || read('canvasColor')],
    ['--bg-secondary', read('cardBackgroundColor') || read('surfaceColor')],
    ['--surface', read('cardBackgroundColor') || read('surfaceColor')],
    ['--surface-color', read('cardBackgroundColor') || read('surfaceColor')],
    ['--card-bg', read('cardBackgroundColor') || read('surfaceColor')],
    ['--card-background', read('cardBackgroundColor') || read('surfaceColor')],
    ['--background', read('backgroundColor') || read('canvasColor')],
    ['--brand-primary', read('primaryColor') || read('brandPrimary')],
    ['--brand-secondary', read('secondaryColor') || read('brandSecondary')],
    ['--brand-accent', read('accentColor') || read('brandAccent')],
    ['--primary', read('primaryColor') || read('brandPrimary')],
    ['--secondary', read('secondaryColor') || read('brandSecondary')],
    ['--accent', read('accentColor') || read('brandAccent')],
    ['--text-primary', read('textColor') || read('textPrimary')],
    [
      '--text-secondary',
      read('mutedTextColor') || read('textSecondary') || read('textColor'),
    ],
    ['--text-muted', effectiveMutedColor],
    ['--muted', effectiveMutedColor],
    ['--muted-color', effectiveMutedColor],
    ['--muted-text', effectiveMutedColor],
    ['--border-primary', read('borderColor')],
    ['--border-secondary', read('borderColor')],
    ['--border', read('borderColor')],
    [
      '--color-border',
      isDark ? 'rgba(255, 255, 255, 0.1)' : read('borderColor') || '#e2e8f0',
    ],
    [
      '--card-border',
      isDark ? 'rgba(255, 255, 255, 0.09)' : read('borderColor') || '#e2e8f0',
    ],
    ['--color-text', effectiveTextColor],
    ['--color-text-muted', effectiveMutedColor],
    [
      '--header-bg',
      read('headerBackgroundColor') ||
        (isDark
          ? `color-mix(in srgb, ${read('backgroundColor') || '#090d16'} 85%, transparent)`
          : 'rgba(255, 255, 255, 0.85)'),
    ],
    [
      '--input-bg',
      isDark
        ? `color-mix(in srgb, ${read('backgroundColor') || '#090d16'} 60%, ${read('cardBackgroundColor') || '#131b2e'})`
        : '#ffffff',
    ],
    ['--input-color', effectiveTextColor],
    ['--input-border', isDark ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1'],
    ['--button-bg', read('buttonBackgroundColor') || read('primaryColor') || '#2563eb'],
    [
      '--button-text',
      read('buttonTextColor') ||
        (isDarkColor(read('buttonBackgroundColor') || read('primaryColor') || '#2563eb')
          ? '#ffffff'
          : '#0f172a'),
    ],
    ['--button-primary-bg', read('buttonBackgroundColor') || read('primaryColor') || '#2563eb'],
    [
      '--button-primary-text',
      read('buttonTextColor') ||
        (isDarkColor(read('buttonBackgroundColor') || read('primaryColor') || '#2563eb')
          ? '#ffffff'
          : '#0f172a'),
    ],
    [
      '--button-secondary-bg',
      isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : (read('secondaryColor') && !isDarkColor(read('secondaryColor'))
            ? read('secondaryColor')
            : '#f1f5f9'),
    ],
    ['--button-secondary-text', isDark ? '#f8fafc' : '#0f172a'],
    ['--button-outline-border', isDark ? 'rgba(255, 255, 255, 0.22)' : 'currentColor'],
    ['--button-outline-text', effectiveTextColor || (isDark ? '#f8fafc' : '#0f172a')],
    ['--button-ghost-text', effectiveTextColor || (isDark ? '#f8fafc' : '#0f172a')],
    ['--product-card-bg', read('cardBackgroundColor') || read('surfaceColor') || (isDark ? '#111a2e' : '#ffffff')],
    ['--product-card-border', isDark ? 'rgba(255, 255, 255, 0.09)' : read('borderColor') || '#e2e8f0'],
    ['--tag-bg', isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(241, 245, 249, 0.9)'],
    ['--tag-color', effectiveMutedColor || (isDark ? '#94a3b8' : '#64748b')],
    ['--card-shadow', isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.4)' : '0 10px 25px -5px rgba(0, 0, 0, 0.05)'],
    ['--card-radius', read('cardRadius')],
    ['--button-radius', read('buttonRadius')],
    ['--image-radius', read('imageRadius')],
  ];

  const NON_GOOGLE_FONTS = new Set([
    'sans-serif',
    'serif',
    'monospace',
    'inherit',
    'initial',
    'system-ui',
    'system sans',
    'editorial serif',
  ]);
  const customFonts = new Set<string>();
  const addFont = (f: unknown) => {
    if (typeof f === 'string' && f.trim()) {
      const cleanFont = f.split(',')[0].replace(/['"]/g, '').trim();
      if (
        cleanFont &&
        !NON_GOOGLE_FONTS.has(cleanFont.toLowerCase()) &&
        !cleanFont.toLowerCase().includes('system')
      ) {
        customFonts.add(cleanFont);
      }
    }
  };
  addFont(theme.headingFont);
  addFont(theme.bodyFont);
  const rawElementStyles = isRecord(theme.elementStyles)
    ? theme.elementStyles
    : {};
  for (const es of Object.values(rawElementStyles)) {
    if (isRecord(es)) addFont(es.fontFamily);
  }
  const fontImports = Array.from(customFonts).map((font) => {
    const fontParam = encodeURIComponent(font).replace(/%20/g, '+');
    return `@import url('https://fonts.googleapis.com/css2?family=${fontParam}:wght@300;400;500;600;700;800&display=swap');`;
  });

  const css: string[] = [
    ...fontImports,
    rule(':root,html,body', [
      declaration('color-scheme', isDark ? 'dark' : 'light'),
      ...colorVariables.map(([name, value]) => declaration(name, value)),
    ]),
    rule('html', [declaration('font-size', read('baseSize'))]),
    rule('body', [
      declaration(
        'font-family',
        read('bodyFont') ? `${read('bodyFont')},sans-serif` : '',
      ),
      declaration('font-weight', read('bodyWeight')),
      declaration('line-height', read('bodyLineHeight')),
      declaration('letter-spacing', read('letterSpacing')),
      ...backgroundDeclarations(read('backgroundColor')),
      declaration('color', effectiveTextColor),
    ]),
    rule(
      'body :where(h1,h2,h3,h4,h5,h6),[data-preview-field-path*="title"],[data-preview-field-path*="heading"],[data-field-path*="title"],[data-field-path*="heading"]',
      [
        declaration(
          'font-family',
          read('headingFont') ? `${read('headingFont')},sans-serif` : '',
        ),
        declaration('font-weight', read('headingWeight')),
        declaration('line-height', read('headingLineHeight')),
        declaration('color', effectiveHeadingColor),
      ],
    ),
    rule(
      'body :where(p,li,label,address,[data-preview-field-path*="description"],[data-preview-field-path*="subtitle"])',
      [declaration('color', effectiveTextColor)],
    ),
    rule('body :where(small,.muted,[class*="muted"])', [
      declaration('color', effectiveMutedColor),
    ]),
    scale
      ? `body h1{font-size:calc(2.5rem * ${scale}) !important}` +
        `body h2{font-size:calc(2rem * ${scale}) !important}` +
        `body h3{font-size:calc(1.5rem * ${scale}) !important}` +
        `body h4{font-size:calc(1.25rem * ${scale}) !important}`
      : '',
    rule('body header', [
      ...backgroundDeclarations(read('headerBackgroundColor')),
      declaration('min-height', read('headerHeight')),
    ]),
    rule('body footer', [
      ...backgroundDeclarations(read('footerBackgroundColor')),
    ]),
    rule('body main,body [data-preview-page-key]', [
      ...backgroundDeclarations(read('backgroundColor')),
      declaration('color', effectiveTextColor),
      declaration('display', 'flex'),
      declaration('flex-direction', 'column'),
    ]),
    rule('body main > section,body main [data-preview-page-key] > section', [
      declaration('padding-block', read('sectionPadding')),
      declaration('text-align', read('textAlign')),
    ]),
    rule(
      'body main :where(section,[data-design-section]) :where(h1,h2,h3,h4,h5,h6,p,[data-design-text])',
      [declaration('text-align', read('textAlign'))],
    ),
    rule(
      'body main > section + section,body main [data-preview-page-key] > section + section',
      [declaration('margin-top', read('sectionGap'))],
    ),
    rule(
      'body main :where([class*="flex"],[class*="grid"],[data-design-stack])',
      [declaration('gap', read('elementGap'))],
    ),
    rule(
      'body main > section:first-of-type,body main [data-preview-page-key] > section:first-of-type',
      [
        declaration('min-height', read('heroMinHeight')),
        declaration('text-align', read('heroTextAlign')),
      ],
    ),
    rule(
      'body main > section:first-of-type :where(h1,h2,h3,h4,h5,h6,p,[class*="container"],[data-design-text]),body main [data-preview-page-key] > section:first-of-type :where(h1,h2,h3,h4,h5,h6,p,[class*="container"],[data-design-text])',
      [declaration('text-align', read('heroTextAlign'))],
    ),
    rule(
      'body main :where([class*="container"],[class~="container"],[data-design-container])',
      [
        declaration('max-width', read('contentMaxWidth')),
        declaration('padding-inline', read('containerPadding')),
        read('contentMaxWidth') ? 'margin-inline:auto !important;' : '',
      ],
    ),
    rule(
      'body main :where(section,[data-design-section]) > :where([class*="flex"],[data-design-content])',
      [
        declaration('align-items', alignItems(read('contentAlign'))),
        declaration('justify-items', read('contentAlign')),
      ],
    ),
    rule('body main :where([data-preview-list-path],[data-design-grid])', [
      gridColumns(read('gridColumns')) ? 'display:grid !important;' : '',
      declaration('grid-template-columns', gridColumns(read('gridColumns'))),
      declaration('gap', read('gridGap')),
    ]),
    rule(
      'body main :where([data-preview-style-type="card"],[data-design-card],.card,[class*="card-"]:not([class*="card-list"]):not([class*="card-grid"]))',
      [
        declaration('width', read('cardWidth')),
        read('cardWidth') ? 'max-width:100% !important;' : '',
        declaration('min-height', read('cardMinHeight')),
        declaration('padding', read('cardPadding')),
        declaration('border-radius', read('cardRadius')),
        declaration('border-width', read('cardBorderWidth')),
        read('cardBorderWidth') ? 'border-style:solid !important;' : '',
        declaration('border-color', read('borderColor')),
        ...backgroundDeclarations(
          read('cardBackgroundColor') || read('surfaceColor'),
        ),
        declaration('box-shadow', shadow(read('cardShadow'))),
        declaration('text-align', read('cardTextAlign')),
      ],
    ),
    rule(
      'body main :where([data-preview-item-path],[data-design-card],.card,[class*="card-"]) :where(h1,h2,h3,h4,h5,h6,p,span,[data-design-text])',
      [declaration('text-align', read('cardTextAlign'))],
    ),
    rule(
      'body main :where([data-design-button],.btn-primary,.button-primary,a[class*="btn-primary"],a[class*="button-primary"],button:not([data-preview-static]):not([aria-label]):not([class*="icon"]):not([class*="close"]):not([class*="toggle"]):not([class*="nav"]))',
      [
        declaration('padding', read('buttonPadding')),
        declaration('border-radius', read('buttonRadius')),
        ...backgroundDeclarations(read('buttonBackgroundColor')),
        declaration('color', read('buttonTextColor')),
        declaration('box-shadow', shadow(read('buttonShadow'))),
      ],
    ),
    rule('body main img', [declaration('border-radius', read('imageRadius'))]),
    ...(isDark
      ? [
          /* Dark mode card styling */
          rule(
            'body :where([data-preview-item-path],[data-design-card],.card,[class*="card-"],.editable-product-card,.editable-pricing-card,.editable-testimonial-card,.editable-service-card)',
            [
              declaration(
                'background',
                read('cardBackgroundColor') || read('surfaceColor') || '#111a2e',
              ),
              declaration(
                'background-color',
                read('cardBackgroundColor') || read('surfaceColor') || '#111a2e',
              ),
              'border:1px solid rgba(255, 255, 255, 0.09) !important;',
              'box-shadow:0 10px 30px -10px rgba(0,0,0,0.5), 0 1px 3px 0 rgba(255,255,255,0.02) !important;',
              declaration('color', effectiveTextColor),
            ],
          ),
          /* Dark mode card headings & body text */
          rule(
            'body :where([data-preview-item-path],[data-design-card],.card,[class*="card-"],.editable-product-card,.editable-pricing-card,.editable-testimonial-card) :where(h1,h2,h3,h4,h5,h6,strong,b)',
            [declaration('color', effectiveHeadingColor)],
          ),
          rule(
            'body :where([data-preview-item-path],[data-design-card],.card,[class*="card-"],.editable-product-card,.editable-pricing-card,.editable-testimonial-card) :where(p,li,span:not([class*="badge"]):not([class*="tag"]):not([class*="pill"]))',
            [
              declaration(
                'color',
                effectiveMutedColor ||
                  `color-mix(in srgb, ${effectiveTextColor} 75%, transparent)`,
              ),
            ],
          ),
          /* Dark mode navbar / header */
          rule(
            'body header, body .deneb-navbar, body [class*="navbar"]',
            [
              declaration(
                'background-color',
                read('headerBackgroundColor') ||
                  `color-mix(in srgb, ${read('backgroundColor') || '#090d16'} 85%, transparent)`,
              ),
              'backdrop-filter:blur(16px) !important;',
              '-webkit-backdrop-filter:blur(16px) !important;',
              'border-bottom:1px solid rgba(255, 255, 255, 0.08) !important;',
            ],
          ),
          /* Dark mode nav items */
          rule('body .deneb-nav-item, body nav a, body nav button', [
            `color:color-mix(in srgb, ${effectiveTextColor} 75%, transparent) !important;`,
          ]),
          rule(
            'body .deneb-nav-item:hover, body nav a:hover, body nav button:hover',
            [
              'color:#ffffff !important;',
              'background-color:rgba(255, 255, 255, 0.08) !important;',
            ],
          ),
          rule(
            'body .deneb-nav-item.active, body nav a.active',
            [
              'color:#ffffff !important;',
              'background-color:rgba(255, 255, 255, 0.12) !important;',
            ],
          ),
          /* Dark mode inputs & textareas */
          rule(
            'body input:not([type="button"]):not([type="submit"]):not([type="color"]):not([type="checkbox"]):not([type="radio"]), body textarea, body select',
            [
              declaration(
                'background-color',
                `color-mix(in srgb, ${read('backgroundColor') || '#090d16'} 60%, ${read('cardBackgroundColor') || '#131b2e'})`,
              ),
              'border:1px solid rgba(255, 255, 255, 0.14) !important;',
              declaration('color', effectiveTextColor),
            ],
          ),
          /* Dark mode footer */
          rule('body footer, body .site-footer', [
            declaration(
              'background-color',
              read('footerBackgroundColor') ||
                `color-mix(in srgb, ${read('backgroundColor') || '#090d16'} 80%, #000000)`,
            ),
            'border-top:1px solid rgba(255, 255, 255, 0.08) !important;',
            declaration('color', effectiveTextColor),
          ]),
          /* Dark mode hero glow */
          rule('body .hero, body [class*="hero"]:not(button):not(a):not(span)', [
            `background:radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${read('primaryColor') || '#38bdf8'} 14%, transparent), transparent 70%), ${read('backgroundColor') || '#090d16'} !important;`,
          ]),
          /* Dark mode mobile drawer & dialog */
          rule('body .deneb-mobile-drawer, body .deneb-dialog-content', [
            declaration(
              'background-color',
              read('cardBackgroundColor') || read('surfaceColor') || '#111a2e',
            ),
            'border-color:rgba(255, 255, 255, 0.1) !important;',
            declaration('color', effectiveTextColor),
          ]),
          /* Dark mode badges & pills */
          rule('body :where(.eyebrow,[class*="badge"],[class*="pill"]:not(button))', [
            `background-color:color-mix(in srgb, ${read('primaryColor') || '#38bdf8'} 15%, transparent) !important;`,
            `color:${read('accentColor') || read('primaryColor') || '#38bdf8'} !important;`,
            `border-color:color-mix(in srgb, ${read('primaryColor') || '#38bdf8'} 28%, transparent) !important;`,
          ]),
          /* Dark mode card hover elevation */
          rule(
            'body :where([data-preview-item-path],[data-design-card],.card,[class*="card-"],.editable-product-card,.editable-pricing-card,.editable-testimonial-card):hover',
            [
              'border-color:rgba(255, 255, 255, 0.18) !important;',
              'box-shadow:0 16px 40px -10px rgba(0,0,0,0.65), 0 1px 3px 0 rgba(255,255,255,0.04) !important;',
            ],
          ),
          /* Dark mode dividers & rules */
          rule('body :where(hr,[class*="divider"],[class*="separator"])', [
            'border-color:rgba(255, 255, 255, 0.08) !important;',
          ]),
          /* Dark mode alternate sections subtle glow */
          rule('body :where(.page-section.alt,section.alt)', [
            `background:color-mix(in srgb, ${read('primaryColor') || '#38bdf8'} 3%, ${read('backgroundColor') || '#090d16'}) !important;`,
          ]),
          /* Dark mode button contrast harmony */
          rule(
            'body :where(.btn-secondary,[class*="btn-secondary"],[class*="button-secondary"],[data-variant="secondary"],.editable-btn-secondary)',
            [
              'background-color:rgba(255, 255, 255, 0.08) !important;',
              'color:#f8fafc !important;',
              'border:1px solid rgba(255, 255, 255, 0.14) !important;',
            ],
          ),
          rule(
            'body :where(.btn-outline,[class*="btn-outline"],[class*="button-outline"],[data-variant="outline"])',
            [
              'background-color:transparent !important;',
              'color:#f8fafc !important;',
              'border-color:rgba(255, 255, 255, 0.22) !important;',
            ],
          ),
          rule(
            'body :where(.btn-ghost,[class*="btn-ghost"],[class*="button-ghost"],[data-variant="ghost"])',
            [
              'background-color:transparent !important;',
              'color:#f8fafc !important;',
            ],
          ),
          rule(
            'body :where(.btn-primary,[class*="btn-primary"],[class*="button-primary"],[data-variant="primary"],.editable-btn-primary)',
            [
              `background-color:${read('buttonBackgroundColor') || read('primaryColor') || '#2563eb'} !important;`,
              `color:${read('buttonTextColor') || (isDarkColor(read('buttonBackgroundColor') || read('primaryColor') || '#2563eb') ? '#ffffff' : '#0f172a')} !important;`,
            ],
          ),
        ]
      : []),
  ];

  const sections = isRecord(theme.sections) ? theme.sections : {};
  for (const [key, rawSection] of Object.entries(sections)) {
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(key) || !isRecord(rawSection)) continue;
    const sectionRead = (property: string) => safeValue(rawSection[property]);
    const sectionBackground = sectionRead('backgroundColor');
    const fullBleedLayerSelector = [
      '[class*="absolute"][class*="inset-0"]',
      '[class*="fixed"][class*="inset-0"]',
      '[class*="absolute"][class*="inset-x-0"][class*="inset-y-0"]',
      '[class*="absolute"][class*="top-0"][class*="right-0"][class*="bottom-0"][class*="left-0"]',
    ].join(',');
    const specialSelectors: Record<string, string> = {
      all: 'body main section',
      hero: 'body main > section:first-of-type,body main [data-preview-page-key] > section:first-of-type',
      header: 'body header',
      footer: 'body footer',
      cards:
        'body main :where([data-preview-style-type="card"],[data-design-card],.card,[class*="card-"]:not([class*="card-list"]):not([class*="card-grid"]))',
    };
    const selector =
      specialSelectors[key] ??
      `body :where([data-preview-page-key="${key}"] > section,[data-design-section="${key}"],[data-section-id="${key}"],section#${key},section.${key})`;
    css.push(
      rule(selector, [
        rawSection.visible === false ? 'display:none !important;' : '',
        ...backgroundDeclarations(sectionBackground),
        declaration('color', sectionRead('textColor')),
        declaration('min-height', sectionRead('minHeight')),
        declaration('padding-block', sectionRead('padding')),
        declaration('max-width', sectionRead('contentMaxWidth')),
        declaration('gap', sectionRead('gap')),
        declaration('text-align', sectionRead('textAlign')),
        declaration('align-items', alignItems(sectionRead('contentAlign'))),
      ]),
      rule(`${selector} :where(h1,h2,h3,h4,h5,h6)`, [
        declaration('color', sectionRead('headingColor')),
        declaration('text-align', sectionRead('textAlign')),
      ]),
      rule(`${selector} :where(p,span,[data-design-text])`, [
        declaration('text-align', sectionRead('textAlign')),
      ]),
      rule(
        `${selector} :where([data-preview-item-path],[data-design-card],.card,[class*="card-"])`,
        [
          ...backgroundDeclarations(sectionRead('cardBackgroundColor')),
          declaration('width', sectionRead('cardWidth')),
          sectionRead('cardWidth') ? 'max-width:100% !important;' : '',
          declaration('min-height', sectionRead('cardMinHeight')),
          declaration('border-radius', sectionRead('cardRadius')),
        ],
      ),
      rule(`${selector} :where([data-preview-list-path],[data-design-grid])`, [
        gridColumns(sectionRead('gridColumns'))
          ? 'display:grid !important;'
          : '',
        declaration(
          'grid-template-columns',
          gridColumns(sectionRead('gridColumns')),
        ),
      ]),
      rule(
        `${selector}::before,${selector}::after`,
        sectionBackground
          ? [
              'background:none !important;',
              'background-image:none !important;',
              'opacity:0 !important;',
            ]
          : [],
      ),
      rule(
        `${selector} > :where(${fullBleedLayerSelector})`,
        sectionBackground
          ? [
              'background:none !important;',
              'background-image:none !important;',
              'box-shadow:none !important;',
              'mask-image:none !important;',
              '-webkit-mask-image:none !important;',
            ]
          : [],
      ),
      rule(
        `${selector} > :where(${fullBleedLayerSelector})::before,${selector} > :where(${fullBleedLayerSelector})::after`,
        sectionBackground
          ? [
              'background:none !important;',
              'background-image:none !important;',
              'opacity:0 !important;',
            ]
          : [],
      ),
      rule(
        `${selector} > :where(${fullBleedLayerSelector}) :where(img,video,canvas,picture)`,
        sectionBackground ? ['opacity:0.2 !important;'] : [],
      ),
    );
  }

  // Exact-path overrides power the click-to-style editor for every DENEB
  // component. Attribute selectors keep this independent from template CSS
  // classes and continue to work for inferred/legacy editable bindings.
  const elementStyles = isRecord(theme.elementStyles)
    ? theme.elementStyles
    : {};
  const elementProperties: Array<[string, string]> = [
    ['display', 'display'],
    ['order', 'order'],
    ['fontFamily', 'font-family'],
    ['fontSize', 'font-size'],
    ['lineHeight', 'line-height'],
    ['fontWeight', 'font-weight'],
    ['letterSpacing', 'letter-spacing'],
    ['color', 'color'],
    ['backgroundColor', 'background-color'],
    ['textAlign', 'text-align'],
    ['justifyContent', 'justify-content'],
    ['alignItems', 'align-items'],
    ['width', 'width'],
    ['height', 'height'],
    ['minWidth', 'min-width'],
    ['minHeight', 'min-height'],
    ['maxWidth', 'max-width'],
    ['maxHeight', 'max-height'],
    ['marginTop', 'margin-top'],
    ['marginRight', 'margin-right'],
    ['marginBottom', 'margin-bottom'],
    ['marginLeft', 'margin-left'],
    ['paddingTop', 'padding-top'],
    ['paddingRight', 'padding-right'],
    ['paddingBottom', 'padding-bottom'],
    ['paddingLeft', 'padding-left'],
    ['padding', 'padding'],
    ['borderRadius', 'border-radius'],
    ['borderWidth', 'border-width'],
    ['borderColor', 'border-color'],
    ['borderStyle', 'border-style'],
    ['boxShadow', 'box-shadow'],
  ];
  for (const [path, rawStyle] of Object.entries(elementStyles).slice(0, 256)) {
    if (!/^[a-zA-Z0-9_.:\[\]-]{1,180}$/.test(path) || !isRecord(rawStyle)) {
      continue;
    }
    const selectorPath = path.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const selector = (() => {
      if (path === 'site:all') return 'body';
      if (path.startsWith('page:')) {
        const pageKey = selectorPath.slice('page:'.length);
        return `body :where([data-preview-page-key="${pageKey}"])`;
      }
      if (path.startsWith('section:')) {
        const [, pageKey = 'all', sectionKey = ''] = selectorPath.split(':');
        const pagePrefix =
          pageKey === 'all'
            ? 'body'
            : `body :where([data-preview-page-key="${pageKey}"])`;
        const nth = sectionKey.match(/^nth-(\d+)$/)?.[1];
        if (nth) return `${pagePrefix} > section:nth-of-type(${nth})`;
        return `${pagePrefix} :where([data-design-section="${sectionKey}"],[data-section-id="${sectionKey}"],section#${sectionKey},section.${sectionKey})`;
      }
      if (path.includes(':')) {
        const [listPrefix, subPart] = selectorPath.split(':');
        if (subPart === 'card') {
          return `body [data-preview-list-path="${listPrefix}"] :is([data-preview-item-path],[data-design-card],.card,[class*="card-"])`;
        }
        if (subPart) {
          return `body [data-preview-list-path="${listPrefix}"] :is([data-preview-field-path$=".${subPart}"],[data-field-path$=".${subPart}"],[data-content-path$=".${subPart}"])`;
        }
      }
      return `body :is([data-preview-field-path="${selectorPath}"],[data-content-path="${selectorPath}"],[data-field-path="${selectorPath}"],[data-fivora-resolved-field-path="${selectorPath}"],[data-preview-list-path="${selectorPath}"],[data-preview-item-path="${selectorPath}"])`;
    })();
    css.push(
      rule(
        selector,
        elementProperties.map(([key, property]) =>
          declaration(property, safeValue(rawStyle[key])),
        ),
      ),
    );
  }

  return css.filter(Boolean).join('\n');
}

export function upsertUniversalTemplateThemeStyle(
  html: string,
  theme: unknown,
) {
  const css = buildUniversalTemplateThemeCss(theme);
  const pattern = new RegExp(
    `<style\\b[^>]*\\bid=["']${UNIVERSAL_TEMPLATE_THEME_STYLE_ID}["'][^>]*>[\\s\\S]*?<\\/style>`,
    'gi',
  );
  const withoutExisting = html.replace(pattern, '');
  if (!css) return withoutExisting;
  const style = `<style id="${UNIVERSAL_TEMPLATE_THEME_STYLE_ID}">${css}</style>`;
  if (/<\/head>/i.test(withoutExisting)) {
    return withoutExisting.replace(/<\/head>/i, `${style}</head>`);
  }
  return `${style}${withoutExisting}`;
}

export async function applyUniversalTemplateThemeToDirectory(input: {
  root: string;
  theme: unknown;
}) {
  const htmlFiles: string[] = [];
  const cssFiles: string[] = [];
  const visit = async (directory: string) => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
        htmlFiles.push(path);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.css')) {
        cssFiles.push(path);
      }
    }
  };
  await visit(input.root);
  const replacements =
    input.theme &&
    typeof input.theme === 'object' &&
    !Array.isArray(input.theme)
      ? (input.theme as Record<string, unknown>).colorReplacements
      : null;
  await Promise.all(
    cssFiles.map(async (filePath) => {
      const css = await readFile(filePath, 'utf8');
      await writeFile(
        filePath,
        replaceTemplateColorLiterals(css, replacements),
        'utf8',
      );
    }),
  );
  await Promise.all(
    htmlFiles.map(async (filePath) => {
      const html = await readFile(filePath, 'utf8');
      await writeFile(
        filePath,
        upsertUniversalTemplateThemeStyle(html, input.theme),
        'utf8',
      );
    }),
  );
  return { pageCount: htmlFiles.length };
}
