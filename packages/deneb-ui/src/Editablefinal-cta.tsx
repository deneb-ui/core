import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditablefinalCtaProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  siteData: any;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditablefinalCta({
  itemPath,
  siteData,
  imageFallback = '/images/showcase-phone.jpg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditablefinalCtaProps) {
  const phoneSilhouetteImage = String(siteData?.content?.home?.phoneSilhouetteImage || imageFallback);
  const imageAlt = String(siteData?.content?.home?.imageAlt || 'Phone Silhouette');
  
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative py-28 sm:py-36 overflow-clip bg-white border-t border-black/[0.06] text-center ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] sm:h-[800px] sm:w-[800px] rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/15 to-indigo-500/15 blur-[160px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
        <div className="relative h-[550px] w-[550px]">
          <EditableImage
            id={`${itemPath}.phoneSilhouetteImage`}
            data-preview-field-path={`${itemPath}.phoneSilhouetteImage`}
            src={phoneSilhouetteImage}
            fallbackSrc={imageFallback}
            alt={imageAlt}
            className="object-contain"
          />
        </div>
      </div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <span
            data-preview-field-path={`${itemPath}.theNextStandardMobileCare`}
            data-preview-style-target={`${itemPath}.theNextStandardMobileCare`}
            data-preview-style-type="text">
            <EditableText
              as="span"
              id={`${itemPath}.theNextStandardMobileCare`}
              data-preview-field-path={`${itemPath}.theNextStandardMobileCare`}
              defaultValue={siteData?.content?.home?.theNextStandardMobileCare || "The Next Standard in Mobile Care"}
            />
          </span>
        </div>
        <EditableText
          as="h2"
          id={`${itemPath}.heading2`}
          data-preview-field-path={`${itemPath}.heading2`}
          defaultValue={siteData?.content?.home?.heading2 || "Your Phone Deserves Better."}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-zinc-950 tracking-tight leading-[1.08]"
        />
        <EditableText
          as="p"
          id={`${itemPath}.subtitle4`}
          data-preview-field-path={`${itemPath}.subtitle4`}
          defaultValue={siteData?.content?.home?.subtitle4 || "Upgrade it. Repair it. Protect it."}
          className="mt-6 text-lg sm:text-2xl font-light text-zinc-800 tracking-wide"
        />
        <EditableText
          as="p"
          id={`${itemPath}.description2`}
          data-preview-field-path={`${itemPath}.description2`}
          defaultValue={siteData?.content?.home?.description2 || "Experience precision engineering, authentic parts, and surgical craftsmanship designed to keep you seamlessly connected."}
          className="mt-2 text-sm sm:text-base text-zinc-600 max-w-lg mx-auto"
        />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#shop"
            data-preview-field-path={`${itemPath}.shopPhonesUrl`}
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(0,240,255,0.45)] hover:shadow-[0_0_45px_rgba(0,240,255,0.65)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="h-5 w-5" />
            <EditableText
              as="span"
              id={`${itemPath}.shopPhonesLabel`}
              data-preview-field-path={`${itemPath}.shopPhonesLabel`}
              defaultValue={siteData?.content?.home?.shopPhonesLabel || "Shop Phones"}
            />
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            onClick={() => openRepairModal()}
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border border-black/[0.08] bg-white/95 px-8 py-4 text-base font-semibold text-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:border-cyan-400 hover:text-cyan-600 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Wrench className="h-5 w-5 text-cyan-600" />
            <EditableText
              as="span"
              id={`${itemPath}.bookRepairLabel`}
              data-preview-field-path={`${itemPath}.bookRepairLabel`}
              defaultValue={siteData?.content?.home?.bookRepairLabel || "Book a Repair"}
            />
          </button>
        </div>
        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-zinc-600">
          <span
            className="flex items-center gap-1.5"
            data-preview-field-path={`${itemPath}.lifetimeScreenWarrantyLabel`}
            data-preview-style-target={`${itemPath}.lifetimeScreenWarrantyLabel`}
            data-preview-style-type="text">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <EditableText
              as="span"
              id={`${itemPath}.lifetimeScreenWarrantyLabel`}
              data-preview-field-path={`${itemPath}.lifetimeScreenWarrantyLabel`}
              defaultValue={siteData?.content?.home?.lifetimeScreenWarrantyLabel || "Lifetime Screen Warranty"}
            />
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-300" />
          <EditableText
            as="span"
            id={`${itemPath}.noObligationFreeDiagnosticsLabel`}
            data-preview-field-path={`${itemPath}.noObligationFreeDiagnosticsLabel`}
            defaultValue={siteData?.content?.home?.noObligationFreeDiagnosticsLabel || "No-Obligation Free Diagnostics"}
          />
          <span className="h-1 w-1 rounded-full bg-zinc-300" />
          <EditableText
            as="span"
            id={`${itemPath}.sameDayTurnaroundLabel`}
            data-preview-field-path={`${itemPath}.sameDayTurnaroundLabel`}
            defaultValue={siteData?.content?.home?.sameDayTurnaroundLabel || "Same-Day Turnaround"}
          />
        </div>
      </div>
    </Component>
  );
}