import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableheroSectionProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: {
    flagshipSalesCertifiedPrecisionRepairs?: string;
    premiumPhonesLabel?: string;
    expertRepairsLabel?: string;
    oneDestinationLabel?: string;
    description?: string;
    shopPhonesUrl?: string;
    shopPhonesLabel?: string;
    bookRepairLabel?: string;
    auraLuxuryFlagshipSmartphonesImage?: string;
    imageAlt?: string;
    oemPartsLabel?: string;
    subtitle?: string;
    twentyFiveMinFixLabel?: string;
    subtitle2?: string;
    lifetimeLabel?: string;
    subtitle3?: string;
    subtitle4?: string;
    subtitle5?: string;
    subtitle6?: string;
    subtitle7?: string;
  };
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableheroSection({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditableheroSectionProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative min-h-screen flex flex-col justify-center overflow-clip pt-28 pb-16 lg:pt-36 lg:pb-24 bg-white ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0">
        <div className="h-[550px] w-[550px] lg:h-[750px] lg:w-[750px] rounded-full bg-gradient-to-tr from-cyan-400/25 via-sky-400/20 to-blue-500/15 blur-[120px]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-full max-w-5xl rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] px-3.5 py-1.5 backdrop-blur-xl mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <span className="text-xs font-semibold tracking-wide uppercase text-zinc-700">
                <EditableText
                  as="span"
                  id={`${itemPath}.flagshipSalesCertifiedPrecisionRepairs`}
                  data-preview-field-path={`${itemPath}.flagshipSalesCertifiedPrecisionRepairs`}
                  defaultValue={data.flagshipSalesCertifiedPrecisionRepairs ?? "Flagship Sales · Certified Precision Repairs"}
                />
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 leading-[1.08] lg:leading-[1.05]">
              <span className="hero-line block">
                <EditableText
                  as="span"
                  id={`${itemPath}.premiumPhonesLabel`}
                  data-preview-field-path={`${itemPath}.premiumPhonesLabel`}
                  defaultValue={data.premiumPhonesLabel ?? "Premium Phones."}
                />
              </span>
              <span className="hero-line block text-zinc-900">
                <EditableText
                  as="span"
                  id={`${itemPath}.expertRepairsLabel`}
                  data-preview-field-path={`${itemPath}.expertRepairsLabel`}
                  defaultValue={data.expertRepairsLabel ?? "Expert Repairs."}
                />
              </span>
              <span className="hero-line block bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">
                <EditableText
                  as="span"
                  id={`${itemPath}.oneDestinationLabel`}
                  data-preview-field-path={`${itemPath}.oneDestinationLabel`}
                  defaultValue={data.oneDestinationLabel ?? "One Destination."}
                />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
              <EditableText
                as="span"
                id={`${itemPath}.description`}
                data-preview-field-path={`${itemPath}.description`}
                defaultValue={data.description ?? "Discover the latest smartphones, pristine certified refurbishments, and master-grade hardware repairs—executed with surgical precision and backed by technicians you can trust."}
              />
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="#shop"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-zinc-950 px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>
                  <EditableText
                    as="span"
                    id={`${itemPath}.shopPhonesLabel`}
                    data-preview-field-path={`${itemPath}.shopPhonesLabel`}
                    defaultValue={data.shopPhonesLabel ?? "Shop Phones"}
                  />
                </span>
              </a>
              <button
                onClick={() => {}}
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 px-7 py-3.5 text-sm sm:text-base font-bold text-cyan-800 backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:bg-cyan-500/20 hover:border-cyan-400/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>
                  <EditableText
                    as="span"
                    id={`${itemPath}.bookRepairLabel`}
                    data-preview-field-path={`${itemPath}.bookRepairLabel`}
                    defaultValue={data.bookRepairLabel ?? "Book a Repair"}
                  />
                </span>
              </button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 pt-6 border-t border-black/[0.08] w-full max-w-lg text-left">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-700 font-bold text-sm">
                  <span>
                    <EditableText
                      as="span"
                      id={`${itemPath}.oemPartsLabel`}
                      data-preview-field-path={`${itemPath}.oemPartsLabel`}
                      defaultValue={data.oemPartsLabel ?? "OEM Parts"}
                    />
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  <EditableText
                    as="span"
                    id={`${itemPath}.subtitle`}
                    data-preview-field-path={`${itemPath}.subtitle`}
                    defaultValue={data.subtitle ?? "Original Grade Screens"}
                  />
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-zinc-950 font-bold text-sm">
                  <span>
                    <EditableText
                      as="span"
                      id={`${itemPath}.twentyFiveMinFixLabel`}
                      data-preview-field-path={`${itemPath}.twentyFiveMinFixLabel`}
                      defaultValue={data.twentyFiveMinFixLabel ?? "25-Min Fix"}
                    />
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  <EditableText
                    as="span"
                    id={`${itemPath}.subtitle2`}
                    data-preview-field-path={`${itemPath}.subtitle2`}
                    defaultValue={data.subtitle2 ?? "Express Walk-In Service"}
                  />
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-zinc-950 font-bold text-sm">
                  <span>
                    <EditableText
                      as="span"
                      id={`${itemPath}.lifetimeLabel`}
                      data-preview-field-path={`${itemPath}.lifetimeLabel`}
                      defaultValue={data.lifetimeLabel ?? "Lifetime"}
                    />
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  <EditableText
                    as="span"
                    id={`${itemPath}.subtitle3`}
                    data-preview-field-path={`${itemPath}.subtitle3`}
                    defaultValue={data.subtitle3 ?? "Warranty on Repairs"}
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-3xl overflow-clip border border-black/10 bg-[#0c0e15] shadow-[0_25px_80px rgba(0,0,0,0.18)] group">
              <EditableImage
                id={`${itemPath}.auraLuxuryFlagshipSmartphonesImage`}
                data-preview-field-path={`${itemPath}.auraLuxuryFlagshipSmartphonesImage`}
                src={data.auraLuxuryFlagshipSmartphonesImage ?? "/images/hero-phones.jpg"}
                fallbackSrc={imageFallback}
                alt={data.imageAlt ?? "AURA Luxury Flagship Smartphones"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}