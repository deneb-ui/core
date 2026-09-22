import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableflagshipShowcaseProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: {
    engineeredMoreTitaniumLab?: string;
    showcaseExcellenceLabel?: string;
    heading9?: string;
    description9?: string;
    engineeredMoreFlagshipDeviceImage?: string;
    imageAlt4?: string;
    clickInspectHardwareLabel?: string;
  };
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableflagshipShowcase({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditableflagshipShowcaseProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative min-h-screen py-24 sm:py-32 overflow-clip bg-slate-50/70 flex flex-col justify-center border-y border-black/[0.06] ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 left-0 right-0 select-none whitespace-nowrap text-[15vw] font-black uppercase tracking-tighter text-black/[0.03] leading-none"
      >
        <EditableText
          as="span"
          id={`${itemPath}.engineeredMoreTitaniumLab`}
          data-preview-field-path={`${itemPath}.engineeredMoreTitaniumLab`}
          defaultValue={data.engineeredMoreTitaniumLab ?? "ENGINEERED FOR MORE · TITANIUM LAB"}
        />
      </div>

      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] sm:h-[700px] sm:w-[700px] rounded-full bg-gradient-to-b from-cyan-400/20 via-blue-500/15 to-transparent blur-[140px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-4">
            <span>
              <EditableText
                as="span"
                id={`${itemPath}.showcaseExcellenceLabel`}
                data-preview-field-path={`${itemPath}.showcaseExcellenceLabel`}
                defaultValue={data.showcaseExcellenceLabel ?? "Showcase of Excellence"}
              />
            </span>
          </div>
          <EditableText
            as="h2"
            id={`${itemPath}.heading9`}
            data-preview-field-path={`${itemPath}.heading9`}
            defaultValue={data.heading9 ?? "Engineered for More."}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 tracking-tight"
          />
          <EditableText
            as="p"
            id={`${itemPath}.description9`}
            data-preview-field-path={`${itemPath}.description9`}
            defaultValue={data.description9 ?? "A symphony of aerospace-grade materials, groundbreaking silicon efficiency, and surgical repairability. Tested and certified in our precision laboratory."}
            className="mt-4 text-sm sm:text-base text-zinc-600 max-w-xl mx-auto"
          />
        </div>

        <div className="relative max-w-5xl mx-auto flex items-center justify-center min-h-[520px] sm:min-h-[620px]">
          <div
            className="relative w-full max-w-[360px] sm:max-w-[440px] aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-clip border border-black/10 bg-[#090b10] shadow-[0_30px_90px_rgba(0,0,0,0.2)] group cursor-pointer"
          >
            <EditableImage
              id={`${itemPath}.engineeredMoreFlagshipDeviceImage`}
              data-preview-field-path={`${itemPath}.engineeredMoreFlagshipDeviceImage`}
              src={data.engineeredMoreFlagshipDeviceImage ?? "/images/showcase-phone.jpg"}
              fallbackSrc={imageFallback}
              alt={data.imageAlt4 ?? "Engineered For More Flagship Device"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-black/10 bg-white/90 px-4 py-1.5 text-xs font-bold text-zinc-900 backdrop-blur-md flex items-center gap-1.5 shadow-lg group-hover:border-cyan-400 group-hover:text-cyan-600 transition-colors">
              <span>
                <EditableText
                  as="span"
                  id={`${itemPath}.clickInspectHardwareLabel`}
                  data-preview-field-path={`${itemPath}.clickInspectHardwareLabel`}
                  defaultValue={data.clickInspectHardwareLabel ?? "Click to Inspect Hardware"}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}