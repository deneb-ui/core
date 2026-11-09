'use client';

import React, { useEffect, useState } from 'react';
import { useSiteData } from './SiteDataProvider';
import { useComponentStyle } from './hooks/useComponentStyle';
import { isSafeExternalLink, withBasePath } from './utils/urls';

export interface CountdownTimerContent {
  heading?: string;
  subtitle?: string;
  /** ISO date-time, or e.g. 01 Dec 2026, 11:59 PM +05:30. Timezone is required. */
  deadline?: string;
  expiryMessage?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface EditableCountdownTimerProps {
  /** Path relative to siteData.content; supports nested objects and array indexes. */
  fieldPath?: string;
  defaults?: CountdownTimerContent;
  className?: string;
  style?: React.CSSProperties;
}

function readContent(content: unknown, path: string): CountdownTimerContent {
  let value = content;
  for (const key of path.replace(/\[(\d+)\]/g, '.$1').split('.')) {
    if (!value || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, key)) return {};
    value = (value as Record<string, unknown>)[key];
  }
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function normalizeDeadline(value: string): string {
  const match = value.trim().match(/^(\d{1,2}) ([a-z]{3}) (\d{4}), (\d{1,2}):(\d{2})(?::(\d{2}))? (AM|PM) (Z|[+-]\d{2}:\d{2})$/i);
  if (!match) return value.trim();
  const [, day, month, year, hour, minute, second = '00', period, offset] = match;
  const monthIndex = MONTHS.findIndex((name) => name.toLowerCase() === month.toLowerCase());
  if (monthIndex < 0 || Number(hour) < 1 || Number(hour) > 12) return '';
  const h = Number(hour) % 12 + (period.toUpperCase() === 'PM' ? 12 : 0);
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day.padStart(2, '0')}T${String(h).padStart(2, '0')}:${minute}:${second}${offset.toUpperCase()}`;
}

function parseDeadline(value: string): number | null {
  value = normalizeDeadline(value);
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-](\d{2}):(\d{2}))$/);
  if (!match) return null;
  const [, year, month, day, hour, minute, second, , , offsetHour, offsetMinute] = match;
  const y = Number(year), m = Number(month), d = Number(day);
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (m < 1 || m > 12 || d < 1 || d > days[m - 1] || Number(hour) > 23 ||
      Number(minute) > 59 || Number(second ?? 0) > 59 || Number(offsetHour ?? 0) > 23 ||
      Number(offsetMinute ?? 0) > 59) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function displayDeadline(value: string): string {
  // Keep the editable leaf valid ISO, including its original precision and offset.
  // In particular, timezone digits must never be mistaken for omitted seconds.
  return normalizeDeadline(value);
}

/** Opt-in countdown using the existing content preview and style patch contracts. */
export function EditableCountdownTimer({
  fieldPath = 'countdown', defaults = {}, className, style,
}: EditableCountdownTimerProps) {
  const siteData = useSiteData();
  const content = readContent(siteData?.content, fieldPath);
  const text = (key: keyof CountdownTimerContent, fallback = '') =>
    typeof content[key] === 'string' ? content[key] as string : defaults[key] ?? fallback;
  const heading = text('heading', 'Flash Sale');
  const subtitle = text('subtitle', 'Hurry! Offers end soon.');
  const deadline = text('deadline');
  const expiryMessage = text('expiryMessage', 'The countdown has ended.');
  const ctaLabel = text('ctaLabel', 'Learn more');
  const ctaUrl = text('ctaUrl').trim();
  const href = isSafeExternalLink(ctaUrl) && !/[\u0000-\u0020\u007f\\]/.test(ctaUrl)
    ? withBasePath(ctaUrl) : undefined;
  const target = parseDeadline(deadline);
  // Neither SSR nor the first hydration render reads the clock.
  const [clock, setClock] = useState<{ target: number; remaining: number } | null>(null);
  const remaining = target !== null && clock?.target === target ? clock.remaining : null;
  const expired = remaining === 0;
  const { cssVars: cardVars } = useComponentStyle(`${fieldPath}.card`, 'card');
  const { cssVars: textVars } = useComponentStyle(`${fieldPath}.text`, 'text');
  const { cssVars: headingVars } = useComponentStyle(`${fieldPath}.heading`, 'text', { color: '#ff570a' });
  const { cssVars: digitCardVars } = useComponentStyle(`${fieldPath}.digits.card`, 'card', { backgroundColor: '#ffffff', borderRadius: 16 });
  const { cssVars: digitTextVars } = useComponentStyle(`${fieldPath}.digits.text`, 'text', { color: '#181a1d' });
  const { cssVars: ctaVars } = useComponentStyle(`${fieldPath}.cta`, 'button', { backgroundColor: '#ff570a', textColor: '#ffffff', borderRadius: 999 });

  useEffect(() => {
    if (target === null) {
      setClock(null);
      return;
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      const seconds = Math.max(0, Math.ceil((target - Date.now()) / 1000));
      setClock({ target, remaining: seconds });
      if (seconds === 0 && timer !== undefined) clearInterval(timer);
      return seconds;
    };
    if (update() > 0) timer = setInterval(update, 1000);
    return () => { if (timer !== undefined) clearInterval(timer); };
  }, [target]);

  const seconds = remaining ?? 0;
  const units = [
    ['Days', Math.floor(seconds / 86400)],
    ['Hours', Math.floor(seconds / 3600) % 24],
    ['Minutes', Math.floor(seconds / 60) % 60],
    ['Seconds', seconds % 60],
  ] as const;

  return (
    <section className={className} data-preview-item-path={fieldPath}
      data-preview-style-target={`${fieldPath}.card`} data-preview-style-type="card"
      style={{ boxSizing: 'border-box', width: '100%', minWidth: 0,
        paddingTop: 'var(--deneb-card-pt, clamp(2rem, 5vw, 3rem))', paddingBottom: 'var(--deneb-card-pb, clamp(2rem, 5vw, 3rem))',
        paddingLeft: 'var(--deneb-card-pl, clamp(1rem, 3vw, 2rem))', paddingRight: 'var(--deneb-card-pr, clamp(1rem, 3vw, 2rem))',
        borderRadius: 'var(--deneb-card-radius, 24px)', background: 'var(--deneb-card-bg, #24272d)', ...cardVars, ...style }}>
      <div data-preview-style-target={`${fieldPath}.text`} data-preview-style-type="text"
        style={{ ...textVars, color: 'var(--deneb-color, #ffffff)', textAlign: 'center', overflowWrap: 'anywhere' }}>
        <h2 data-preview-field-path={`${fieldPath}.heading`} data-preview-style-target={`${fieldPath}.heading`} data-preview-style-type="text"
          style={{ ...headingVars, margin: '0 0 1rem', color: 'var(--deneb-color, #ff570a)', fontSize: 'var(--deneb-font-size, clamp(2rem, 5vw, 3.5rem))', fontWeight: 750, letterSpacing: '-0.035em', lineHeight: 1.1 }}>{heading}</h2>
        <p data-preview-field-path={`${fieldPath}.subtitle`} style={{ fontSize: 'clamp(1rem, 2.5vw, 1.35rem)', margin: '0 0 2rem' }}>{subtitle}</p>
        <div role="timer" aria-label="Time remaining" aria-live="off"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(0.65rem, 2.5vw, 1.5rem)', maxWidth: 480, margin: '0 auto 1.25rem' }}>
          {units.map(([label, value], index) => (
            <div key={label} style={{ minWidth: 0, position: 'relative' }}>
              {index > 0 && <span aria-hidden="true" style={{ position: 'absolute', left: 'calc(clamp(0.65rem, 2.5vw, 1.5rem) / -2)', transform: 'translateX(-50%)', top: '0.65rem', fontSize: 'clamp(1.3rem, 4vw, 2rem)', opacity: 0.75 }}>:</span>}
              <div data-preview-style-target={`${fieldPath}.digits.card`} data-preview-style-type="card"
                style={{ ...digitCardVars, background: 'var(--deneb-card-bg, #ffffff)', borderRadius: 'var(--deneb-card-radius, 16px)', padding: '1rem 0.2rem', boxShadow: '0 4px 12px #00000012' }}>
                <span data-preview-style-target={`${fieldPath}.digits.text`} data-preview-style-type="text"
                  style={{ ...digitTextVars, display: 'block', color: 'var(--deneb-color, #181a1d)', fontSize: 'clamp(1.25rem, 4vw, 2.25rem)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                  {remaining === null ? '--' : String(value).padStart(2, '0')}
                </span>
              </div>
              <span style={{ display: 'block', marginTop: 10, fontSize: 'clamp(0.65rem, 2vw, 0.85rem)', opacity: 0.8 }}>{label}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, opacity: 0.7, margin: '0 0 1.75rem' }}>Ends <span data-preview-field-path={`${fieldPath}.deadline`}>{target === null ? deadline || 'Set a deadline' : displayDeadline(deadline)}</span></p>
        {target === null && <p role="status">Use e.g. 01 Dec 2026, 11:59 PM +05:30, or an ISO date with a timezone.</p>}
        <p hidden={!expired} role={expired ? 'status' : undefined}>
          <span data-preview-field-path={`${fieldPath}.expiryMessage`}>{expiryMessage}</span>
        </p>
        <a href={href} aria-disabled={!href || undefined} data-preview-field-path={`${fieldPath}.ctaUrl`}
          data-preview-style-target={`${fieldPath}.cta`} data-preview-style-type="button"
          style={{ ...ctaVars, display: 'inline-block', maxWidth: '100%', background: 'var(--deneb-btn-bg, #ff570a)', color: 'var(--deneb-btn-color, #ffffff)', padding: 'var(--deneb-btn-py, 1rem) var(--deneb-btn-px, 2rem)', borderRadius: 'var(--deneb-btn-radius, 999px)', fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 20px #00000020' }}>
          <span data-preview-field-path={`${fieldPath}.ctaLabel`}>{ctaLabel}</span>
        </a>
      </div>
    </section>
  );
}
