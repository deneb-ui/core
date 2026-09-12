export type MeasurementUnit =
  | 'size'
  | 'g'
  | 'kg'
  | 'mg'
  | 'ml'
  | 'l'
  | 'pcs'
  | 'pack'
  | 'oz'
  | 'lb'
  | (string & {});

export interface ProductOptionInput {
  id?: string | number;
  name?: string;
  title?: string;
  unit?: MeasurementUnit;
  measurement?: string;
  optionsLabel?: string;
  options?: (string | number)[];
  optionsText?: string;
  sizes?: (string | number)[] | string;
  sizesText?: string;
  sizesLabel?: string;
  colors?: Array<string | { name: string; hex?: string }> | string;
  colorsText?: string;
  colorsLabel?: string;
  [key: string]: unknown;
}

export interface ResolvedProductOptions {
  /**
   * The detected or specified unit, e.g. "g", "ml", "size", "pcs".
   */
  unit: string;

  /**
   * The user-facing label for the options selector.
   * e.g. "Net Weight", "Volume", "Available Sizes", "Pack Size".
   */
  optionsLabel: string;

  /**
   * Normalized list of available option values (e.g. ["100g", "250g", "500g"] or ["40", "41", "42"]).
   */
  options: string[];

  /**
   * Default selected option (first option, or empty string).
   */
  defaultOption: string;

  /**
   * Whether this option represents a physical measurement (weight, volume, count).
   */
  isMeasurement: boolean;

  /**
   * Format option for button or badge rendering (e.g. "250g", "50ml", "42").
   */
  formatOption: (option: string | number) => string;

  /**
   * Format option for headline or summary display (e.g. "250g", "50ml", "Size 42").
   */
  formatSelectedDisplay: (option: string | number) => string;

  /**
   * Format an order snippet for WhatsApp or checkout (e.g. "(250g)" or "(Ivory, Size 42)").
   */
  formatOrderSnippet: (selectedOption?: string | number, selectedColor?: string) => string;

  /**
   * Available color names.
   */
  colors: string[];

  /**
   * Color selector label (e.g. "Available Colors").
   */
  colorsLabel: string;

  /**
   * Default selected color.
   */
  defaultColor: string;
}

function parseList(value: unknown): string[] {
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item == null) return '';
        if (typeof item === 'object' && 'name' in item && typeof (item as any).name === 'string') {
          return (item as any).name.trim();
        }
        return String(item).trim();
      })
      .filter(Boolean);
  }
  return [];
}

/**
 * Universal product option & measurement resolver.
 * Handles footwear/apparel sizes, food/grocery weights (g, kg, mg),
 * liquids/cosmetics volumes (ml, l), and counts (pcs, pack) seamlessly.
 */
export function resolveProductOptions(
  product?: ProductOptionInput | Record<string, unknown> | null,
): ResolvedProductOptions {
  const p = (product || {}) as ProductOptionInput;

  // 1. Resolve Colors
  let colors = parseList(p.colorsText);
  if (!colors.length) colors = parseList(p.colors);
  const colorsLabel = (typeof p.colorsLabel === 'string' && p.colorsLabel.trim()) || 'Available Colors';
  const defaultColor = colors[0] || 'Standard';

  // 2. Resolve Options / Sizes
  let options = parseList(p.optionsText);
  if (!options.length) options = parseList(p.options);
  if (!options.length) options = parseList(p.sizesText);
  if (!options.length) options = parseList(p.sizes);
  if (!options.length && typeof p.measurement === 'string' && p.measurement.trim()) {
    options = [p.measurement.trim()];
  }

  // 3. Detect Unit
  let unit = (typeof p.unit === 'string' ? p.unit.trim().toLowerCase() : '') as string;
  if (!unit) {
    // Auto-detect unit from options, measurement, or title
    const probe = [
      ...options,
      typeof p.measurement === 'string' ? p.measurement : '',
      typeof p.title === 'string' ? p.title : '',
      typeof p.name === 'string' ? p.name : '',
    ].join(' ');

    if (/\b(\d+)\s*(mg)\b/i.test(probe)) {
      unit = 'mg';
    } else if (/\b(\d+)\s*(kg)\b/i.test(probe)) {
      unit = 'kg';
    } else if (/\b(\d+)\s*(g|grams?)\b/i.test(probe)) {
      unit = 'g';
    } else if (/\b(\d+)\s*(ml)\b/i.test(probe)) {
      unit = 'ml';
    } else if (/\b(\d+)\s*(l|litres?|liters?)\b/i.test(probe)) {
      unit = 'l';
    } else if (/\b(\d+)\s*(pcs|pieces?|pack|packs?|boxes?)\b/i.test(probe)) {
      unit = 'pcs';
    } else if (/\b(\d+)\s*(oz|fl\s*oz)\b/i.test(probe)) {
      unit = 'oz';
    } else if (/\b(\d+)\s*(lb|lbs)\b/i.test(probe)) {
      unit = 'lb';
    } else {
      unit = 'size';
    }
  }

  const isMeasurement = unit !== 'size';

  // 4. Resolve Label
  let optionsLabel = (typeof p.optionsLabel === 'string' && p.optionsLabel.trim()) || '';
  if (!optionsLabel && typeof p.sizesLabel === 'string' && p.sizesLabel.trim()) {
    optionsLabel = p.sizesLabel.trim();
  }
  if (!optionsLabel) {
    switch (unit) {
      case 'g':
      case 'kg':
      case 'mg':
      case 'oz':
      case 'lb':
        optionsLabel = 'Net Weight';
        break;
      case 'ml':
      case 'l':
        optionsLabel = 'Volume';
        break;
      case 'pcs':
      case 'pack':
        optionsLabel = 'Pack Size';
        break;
      case 'size':
        optionsLabel = 'Available Sizes';
        break;
      default:
        optionsLabel = 'Available Options';
        break;
    }
  }

  const defaultOption = options[0] || '';

  // 5. Formatter helpers
  const formatOption = (option: string | number): string => {
    const raw = String(option ?? '').trim();
    if (!raw) return '';
    if (unit === 'size') return raw;

    // Check if raw already ends with unit
    const regex = new RegExp(`\\b(${unit})$`, 'i');
    if (regex.test(raw)) return raw;

    // If pure number and measurement unit
    if (/^\d+(\.\d+)?$/.test(raw)) {
      return `${raw}${unit}`;
    }
    return raw;
  };

  const formatSelectedDisplay = (option: string | number): string => {
    const formatted = formatOption(option);
    if (!formatted) return '';
    if (unit === 'size') {
      if (/^size\s+/i.test(formatted)) return formatted;
      return `Size ${formatted}`;
    }
    return formatted;
  };

  const formatOrderSnippet = (selectedOption?: string | number, selectedColor?: string): string => {
    const cleanColor =
      selectedColor && selectedColor !== 'Standard' ? String(selectedColor).trim() : '';
    const cleanOption = selectedOption ? formatSelectedDisplay(selectedOption) : '';

    if (cleanColor && cleanOption) {
      return `(${cleanColor}, ${cleanOption})`;
    }
    if (cleanOption) {
      return `(${cleanOption})`;
    }
    if (cleanColor) {
      return `(${cleanColor})`;
    }
    return '';
  };

  return {
    unit,
    optionsLabel,
    options,
    defaultOption,
    isMeasurement,
    formatOption,
    formatSelectedDisplay,
    formatOrderSnippet,
    colors,
    colorsLabel,
    defaultColor,
  };
}
