'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import {
  DENEB_PREVIEW_FOCUS_MESSAGE,
  LEGACY_PREVIEW_FOCUS_MESSAGE,
  PREVIEW_FOCUS_MESSAGE,
  resolveParentOrigin,
  useSiteData,
} from './SiteDataProvider';

export interface RotatingAnnouncementItem {
  text: string;
  badge?: string;
  /** Plain text or emoji; never interpreted as HTML. */
  icon?: string;
  linkLabel?: string;
  linkUrl?: string;
}

export interface EditableRotatingAnnouncementBarProps {
  /** Content-relative list path, using the same convention as EditableList. */
  listPath?: string;
  /** Controlled items take precedence over SiteDataContext, including an empty array. */
  items?: RotatingAnnouncementItem[];
  autoRotate?: boolean;
  intervalMs?: number;
  showControls?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

function readList(content: unknown, path: string): RotatingAnnouncementItem[] {
  let value = content;
  for (const part of path.replace(/\[(\d+)\]/g, '.$1').split('.')) {
    if (!value || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, part)) return [];
    value = (value as Record<string, unknown>)[part];
  }
  // Keep indexes stable even if an incoming preview snapshot contains an incomplete item.
  return Array.isArray(value) ? value.map((item) => {
    const record = item && typeof item === 'object' ? item : {};
    const text = (key: string) => typeof record[key] === 'string' ? record[key] : '';
    return { text: text('text'), badge: text('badge'), icon: text('icon'), linkLabel: text('linkLabel'), linkUrl: text('linkUrl') };
  }) : [];
}

function safeHref(value?: string): string | undefined {
  const href = value?.trim();
  if (!href || /[\u0000-\u0020\u007f]/.test(href)) return undefined;
  // Allow local links and common web/contact schemes, never executable URLs.
  if (/^[a-z][a-z\d+.-]*:/i.test(href) && !/^(https?:|mailto:|tel:)/i.test(href)) return undefined;
  return href;
}

/** Opt-in rotating ribbon. Does not alter AnnouncementBar or install global styles. */
export function EditableRotatingAnnouncementBar({
  listPath = 'announcements', items, autoRotate = true, intervalMs = 5000,
  showControls = true, ariaLabel = 'Announcements', className, style,
}: EditableRotatingAnnouncementBarProps) {
  const siteData = useSiteData();
  const announcements = items ?? readList(siteData?.content, listPath);
  const count = announcements.length;
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inspectedPath, setInspectedPath] = useState<string | null>(null);
  // Start conservatively: do not rotate until the browser preference is known.
  const [reducedMotion, setReducedMotion] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const slidesId = useId();
  const activeIndex = count ? Math.min(index, count - 1) : 0;
  const inspectedIndex = inspectedPath?.startsWith(`${listPath}[`)
    ? Number(inspectedPath.slice(listPath.length + 1).split(']')[0]) : -1;
  const inspectorPaused = inspectedIndex >= 0 && inspectedIndex < count;
  const rotating = autoRotate && count > 1 && !hovered && !focused && !paused && !inspectorPaused && !reducedMotion;
  const delay = Number.isFinite(intervalMs) ? Math.max(1000, intervalMs) : 5000;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setIndex((current) => count ? Math.min(current, count - 1) : 0);
  }, [count, listPath]);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), delay);
    return () => window.clearInterval(timer);
  }, [rotating, delay, count]);

  useEffect(() => {
    let parentOrigin = resolveParentOrigin();
    let frame = 0;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || !event.data || typeof event.data !== 'object') return;
      if (![PREVIEW_FOCUS_MESSAGE, DENEB_PREVIEW_FOCUS_MESSAGE, LEGACY_PREVIEW_FOCUS_MESSAGE].includes(event.data.type)) return;
      // Match SiteDataProvider's parent-source/origin checks and same-origin relay support.
      if (!parentOrigin && event.origin !== 'null') parentOrigin = event.origin;
      if (event.origin !== parentOrigin && event.origin !== window.location.origin) return;
      const path = typeof event.data.fieldPath === 'string' ? event.data.fieldPath : '';
      const match = path.startsWith(`${listPath}[`)
        ? path.slice(listPath.length).match(/^\[(\d+)\](?:\.(?:text|badge|icon|linkLabel|linkUrl))?$/) : null;
      const selected = match ? Number(match[1]) : -1;
      if (selected < 0 || selected >= count) {
        setInspectedPath(null);
        return;
      }
      setIndex(selected);
      setInspectedPath(path);
      // The selected slide stays mounted; scroll after React removes its hidden attribute.
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        rootRef.current?.querySelector<HTMLElement>(`[data-preview-item-path="${CSS.escape(`${listPath}[${selected}]`)}"]`)
          ?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
      });
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      window.cancelAnimationFrame(frame);
    };
  }, [listPath, count]);

  if (!count) return null;

  const move = (direction: number) => {
    setInspectedPath(null);
    setIndex((current) => (Math.min(current, count - 1) + direction + count) % count);
  };
  const buttonStyle: React.CSSProperties = {
    color: 'inherit', background: 'transparent', border: 0,
    borderRadius: 4, padding: 4, cursor: 'pointer', font: 'inherit',
    minWidth: 28, minHeight: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div ref={rootRef} role="region" aria-roledescription="carousel" aria-label={ariaLabel}
      className={className} data-preview-list-path={listPath}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      style={{ background: '#102a43', color: '#fff', width: '100%', boxSizing: 'border-box',
        padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)', lineHeight: 1.5, ...style }}>
      <div id={slidesId} aria-live={rotating ? 'off' : 'polite'} aria-atomic="true" style={{ flex: 1, minWidth: 0 }}>
        {announcements.map((item, itemIndex) => {
          const path = `${listPath}[${itemIndex}]`;
          const href = safeHref(item.linkUrl);
          return (
            <div key={path} hidden={itemIndex !== activeIndex} data-preview-item-path={path}
              role="group" aria-roledescription="slide" aria-label={`${itemIndex + 1} of ${count}`}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', minHeight: 32, overflowWrap: 'anywhere', textAlign: 'center' }}>
                <span data-preview-field-path={`${path}.icon`} hidden={!item.icon} aria-hidden="true">{item.icon}</span>
                <span data-preview-field-path={`${path}.badge`} hidden={!item.badge}
                  style={{ border: '1px solid currentColor', borderRadius: 20, padding: '0.1rem 0.6rem', fontSize: '0.8em' }}>{item.badge}</span>
                <span data-preview-field-path={`${path}.text`}>{item.text}</span>
                {href && item.linkLabel ? (
                  <a href={href} data-preview-field-path={`${path}.linkUrl`} style={{ color: 'inherit', textDecoration: 'underline' }}>
                    <span data-preview-field-path={`${path}.linkLabel`}>{item.linkLabel}</span>
                  </a>
                ) : (
                  <span data-preview-field-path={`${path}.linkUrl`} hidden={!item.linkLabel}>
                    <span data-preview-field-path={`${path}.linkLabel`}>{item.linkLabel}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {count > 1 && (
        <div data-preview-static="announcement-controls" style={{ display: 'flex', gap: 2, alignItems: 'center', flexShrink: 0 }}>
          {showControls && <button type="button" style={buttonStyle} aria-label="Previous announcement" title="Previous announcement" aria-controls={slidesId} onClick={() => move(-1)}><span aria-hidden="true">‹</span></button>}
          {showControls && <button type="button" style={buttonStyle} aria-label="Next announcement" title="Next announcement" aria-controls={slidesId} onClick={() => move(1)}><span aria-hidden="true">›</span></button>}
          {autoRotate && !reducedMotion && (
            <button type="button" style={buttonStyle} aria-controls={slidesId}
              aria-label={paused || inspectorPaused ? 'Resume rotation' : 'Pause rotation'}
              title={paused || inspectorPaused ? 'Resume rotation' : 'Pause rotation'}
              onClick={() => { setPaused(!(paused || inspectorPaused)); setInspectedPath(null); }}>
              <span aria-hidden="true">{paused || inspectorPaused ? '▶' : 'Ⅱ'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
