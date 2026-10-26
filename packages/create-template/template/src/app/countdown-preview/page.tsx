'use client';

import type { ComponentType } from 'react';
import * as DenebUI from '@deneb-ui/ui';

// Older packages can still run the template without this optional preview export.
const CountdownTimer = Reflect.get(DenebUI, 'EditableCountdownTimer') as
  ComponentType<{ fieldPath: string }> | undefined;

export default function CountdownPreviewPage() {
  return (
      <div data-preview-page-key="countdown_preview" style={{ background: '#eff6ff', color: '#192e2c' }}>
        <section data-design-section="flash-sale" style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(2rem, 6vw, 5rem) 1.25rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'clamp(2rem, 5vw, 4rem)' }}>
            <div style={{ flex: '1 1 320px', minWidth: 0 }}>
              <p data-preview-static="sale-eyebrow" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>The seasonal edit · Limited time</p>
              <h1 data-preview-static="sale-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.06, letterSpacing: '-0.05em', margin: '1.25rem 0' }}>Everyday essentials.<br />Extraordinary prices.</h1>
              <p data-preview-static="sale-description" style={{ maxWidth: 460, fontSize: 18, lineHeight: 1.7, color: '#52625e' }}>Refresh your routine with thoughtfully selected pieces. Save up to 30% on our seasonal favourites while the offer lasts.</p>
              <div aria-hidden="true" style={{ marginTop: 28, padding: 32, borderRadius: 20, background: '#e4e9df', display: 'flex', justifyContent: 'center' }}>
                <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 400 }} fill="none">
                  <ellipse cx="200" cy="158" rx="155" ry="12" fill="#c5cec0" />
                  <path d="M56 56h83l12 91H44z" fill="#426b5d" />
                  <path d="M74 59V40c0-29 47-29 47 0v19" stroke="#264b3c" strokeWidth="8" />
                  <rect x="181" y="35" width="60" height="119" rx="22" fill="#c28c62" />
                  <rect x="194" y="20" width="34" height="23" rx="7" fill="#283f36" />
                  <path d="M279 84h65v61c0 16-65 16-65 0z" fill="#faf7ee" />
                  <path d="M344 95h13c24 0 24 37 0 37h-13" stroke="#faf7ee" strokeWidth="12" />
                  <path d="M293 65c-13-15 13-17 0-32M317 65c-13-15 13-17 0-32" stroke="#b4c1ae" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div style={{ flex: '1 1 320px', minWidth: 0 }}>
              {CountdownTimer ? <CountdownTimer fieldPath="home.countdown" /> : (
                <p role="status">This preview requires a Deneb UI package with EditableCountdownTimer.</p>
              )}
              <p data-preview-static="sale-terms" style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: '#52625e' }}>Selected styles only. Offer ends at the deadline shown. While stocks last.</p>
            </div>
          </div>
        </section>
        <section id="sale-collection" data-preview-static="sale-collection" style={{ padding: '2rem 1.25rem', textAlign: 'center', borderTop: '1px solid #d8ded4' }}>
          <h2 style={{ fontSize: 24, color: 'inherit' }}>Considered details. Everyday favourites.</h2>
          <p>Discover the seasonal collection: carry essentials, reusable drinkware, and home accessories.</p>
        </section>
      </div>
  );
}
