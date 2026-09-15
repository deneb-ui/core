import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditablepromoBannerProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: any;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditablepromoBanner({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditablepromoBannerProps) {
  const limitedShowroomUpgradeBonusLabel = String(data?.content?.home?.hero?.limitedShowroomUpgradeBonusLabel || "Limited Showroom Upgrade Bonus");
  const heading = String(data?.content?.home?.hero?.heading || "Your Next Upgrade");
  const startsHereLabel = String(data?.content?.home?.hero?.startsHereLabel || "Starts Here.");
  const description2 = String(data?.content?.home?.hero?.description2 || "Receive an extra when trading up to any iPhone 16 Pro or Galaxy S25 Ultra this week. Includes complimentary data migration.");
  const exploreLatestPhonesLabel = String(data?.content?.home?.hero?.exploreLatestPhonesLabel || "Explore Latest Phones");
  const calculateTradeLabel = String(data?.content?.home?.hero?.calculateTradeLabel || "Calculate Trade-In");
  const auraUpgradeBannerPhonesImage = String(data?.content?.home?.hero?.auraUpgradeBannerPhonesImage || "/images/hero-phones.jpg");
  const imageAlt2 = String(data?.content?.home?.hero?.imageAlt2 || "AURA Upgrade Banner Phones");

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative py-16 sm:py-24 overflow-clip bg-slate-50/70 border-t border-black/[0.06] ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-clip rounded-3xl border border-black/[0.08] bg-white/95 p-8 sm:p-14 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <span
                  data-preview-field-path={`${itemPath}.limitedShowroomUpgradeBonusLabel`}
                  data-preview-style-target={`${itemPath}.limitedShowroomUpgradeBonusLabel`}
                  data-preview-style-type="text">
                  <EditableText
                    as="span"
                    id={`${itemPath}.limitedShowroomUpgradeBonusLabel`}
                    data-preview-field-path={`${itemPath}.limitedShowroomUpgradeBonusLabel`}
                    defaultValue={limitedShowroomUpgradeBonusLabel}
                  />
                </span>
              </div>
              <EditableText
                as="h2"
                id={`${itemPath}.heading`}
                data-preview-field-path={`${itemPath}.heading`}
                defaultValue={heading}
                className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-tight"
              />
              <span
                data-preview-field-path={`${itemPath}.startsHereLabel`}
                data-preview-style-target={`${itemPath}.startsHereLabel`}
                data-preview-style-type="text">
                <EditableText
                  as="span"
                  id={`${itemPath}.startsHereLabel`}
                  data-preview-field-path={`${itemPath}.startsHereLabel`}
                  defaultValue={startsHereLabel}
                  className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 bg-clip-text text-transparent"
                />
              </span>
              <EditableText
                as="p"
                id={`${itemPath}.description2`}
                data-preview-field-path={`${itemPath}.description2`}
                defaultValue={description2}
                className="mt-4 text-sm sm:text-base text-zinc-600 max-w-lg leading-relaxed"
              />
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#shop"
                  data-preview-field-path={`${itemPath}.exploreLatestPhonesUrl`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 px-7 py-3.5 text-sm font-bold text-white transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span
                    data-preview-field-path={`${itemPath}.exploreLatestPhonesLabel`}
                    data-preview-style-target={`${itemPath}.exploreLatestPhonesLabel`}
                    data-preview-style-type="text">
                    <EditableText
                      as="span"
                      id={`${itemPath}.exploreLatestPhonesLabel`}
                      data-preview-field-path={`${itemPath}.exploreLatestPhonesLabel`}
                      defaultValue={exploreLatestPhonesLabel}
                    />
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#tradein"
                  data-preview-field-path={`${itemPath}.calculateTradeUrl`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-black/[0.08] bg-slate-100 px-6 py-3.5 text-sm font-semibold text-zinc-800 backdrop-blur-md hover:bg-slate-200 transition-all"
                >
                  <Zap className="h-4 w-4 text-cyan-600" />
                  <span
                    data-preview-field-path={`${itemPath}.calculateTradeLabel`}
                    data-preview-style-target={`${itemPath}.calculateTradeLabel`}
                    data-preview-style-type="text">
                    <EditableText
                      as="span"
                      id={`${itemPath}.calculateTradeLabel`}
                      data-preview-field-path={`${itemPath}.calculateTradeLabel`}
                      defaultValue={calculateTradeLabel}
                    />
                  </span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative h-64 sm:h-80 w-full max-w-[400px] rounded-2xl overflow-clip border border-black/[0.08] bg-slate-100 shadow-xl transition-transform duration-700 hover:scale-105">
                <EditableImage
                  id={`${itemPath}.auraUpgradeBannerPhonesImage`}
                  data-preview-field-path={`${itemPath}.auraUpgradeBannerPhonesImage`}
                  src={auraUpgradeBannerPhonesImage}
                  fallbackSrc={imageFallback}
                  alt={imageAlt2}
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}