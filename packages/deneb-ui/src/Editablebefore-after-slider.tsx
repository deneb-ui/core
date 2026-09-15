import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableBeforeAfterSliderProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: {
    oemCleanroomRestorationLabel?: string;
    heading4?: string;
    description4?: string;
    repairedPristinePhoneImage?: string;
    factoryRestoredOemLabel?: string;
    shatteredDamagedScreenImage?: string;
    crackedDamagedLabel?: string;
    dragLeftRightCompare?: string;
    imageAlt2?: string;
    imageAlt3?: string;
  };
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableBeforeAfterSlider({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditableBeforeAfterSliderProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative py-24 sm:py-32 overflow-clip bg-slate-50/70 border-t border-black/[0.06] ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[140px]" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span
              data-preview-field-path={`${itemPath}.oemCleanroomRestorationLabel`}
              data-preview-style-target={`${itemPath}.oemCleanroomRestorationLabel`}
              data-preview-style-type="text">
              <EditableText
                as="span"
                id={`${itemPath}.oemCleanroomRestorationLabel`}
                data-preview-field-path={`${itemPath}.oemCleanroomRestorationLabel`}
                defaultValue={data.oemCleanroomRestorationLabel ?? "OEM Cleanroom Restoration"}
              />
            </span>
          </div>
          <EditableText
            as="h2"
            id={`${itemPath}.heading4`}
            data-preview-field-path={`${itemPath}.heading4`}
            defaultValue={data.heading4 ?? "From Damaged to Like-New."}
            className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight"
          />
          <EditableText
            as="p"
            id={`${itemPath}.description4`}
            data-preview-field-path={`${itemPath}.description4`}
            defaultValue={data.description4 ?? "Drag the interactive slider below to inspect our flawless OLED replacement and aerospace frame realignments."}
            className="mt-3 text-sm sm:text-base text-zinc-600"
          />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-clip border border-black/10 bg-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.18)] cursor-ew-resize select-none">
            <div className="absolute inset-0">
              <EditableImage
                id={`${itemPath}.repairedPristinePhoneImage`}
                data-preview-field-path={`${itemPath}.repairedPristinePhoneImage`}
                src={data.repairedPristinePhoneImage ?? "/images/screen-repaired.jpg"}
                fallbackSrc={imageFallback}
                alt={data.imageAlt2 ?? "Repaired Pristine Phone"}
                className="object-cover"
              />
              <div className="absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/80 px-4 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur-md shadow-lg">
                <span
                  data-preview-field-path={`${itemPath}.factoryRestoredOemLabel`}
                  data-preview-style-target={`${itemPath}.factoryRestoredOemLabel`}
                  data-preview-style-type="text">
                  <EditableText
                    as="span"
                    id={`${itemPath}.factoryRestoredOemLabel`}
                    data-preview-field-path={`${itemPath}.factoryRestoredOemLabel`}
                    defaultValue={data.factoryRestoredOemLabel ?? "FACTORY RESTORED (OEM)"}
                  />
                </span>
              </div>
            </div>
            <div className="absolute inset-0 overflow-clip">
              <EditableImage
                id={`${itemPath}.shatteredDamagedScreenImage`}
                data-preview-field-path={`${itemPath}.shatteredDamagedScreenImage`}
                src={data.shatteredDamagedScreenImage ?? "/images/screen-cracked.jpg"}
                fallbackSrc={imageFallback}
                alt={data.imageAlt3 ?? "Shattered Damaged Screen"}
                className="object-cover"
              />
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/80 px-4 py-1.5 text-xs font-bold text-red-300 backdrop-blur-md shadow-lg">
                <span
                  data-preview-field-path={`${itemPath}.crackedDamagedLabel`}
                  data-preview-style-target={`${itemPath}.crackedDamagedLabel`}
                  data-preview-style-type="text">
                  <EditableText
                    as="span"
                    id={`${itemPath}.crackedDamagedLabel`}
                    data-preview-field-path={`${itemPath}.crackedDamagedLabel`}
                    defaultValue={data.crackedDamagedLabel ?? "CRACKED / DAMAGED"}
                  />
                </span>
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1 text-[11px] font-medium text-white backdrop-blur-md border border-white/20">
              <span
                data-preview-field-path={`${itemPath}.dragLeftRightCompare`}
                data-preview-style-target={`${itemPath}.dragLeftRightCompare`}
                data-preview-style-type="text">
                <EditableText
                  as="span"
                  id={`${itemPath}.dragLeftRightCompare`}
                  data-preview-field-path={`${itemPath}.dragLeftRightCompare`}
                  defaultValue={data.dragLeftRightCompare ?? "Drag left or right to compare"}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}