import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface TrustStat {
  number?: string;
  label?: string;
  detail?: string;
}

export interface TrustPillar {
  icon: React.ElementType;
  title?: string;
  desc?: string;
}

export interface EditabletrustStatsProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  stats: TrustStat[];
  pillars: TrustPillar[];
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditabletrustStats({
  itemPath,
  stats,
  pillars,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  ...props
}: EditabletrustStatsProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative py-24 sm:py-32 overflow-clip bg-white border-t border-black/[0.06] ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[600px] rounded-full bg-cyan-400/10 blur-[150px]" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <EditableText
              as="span"
              id={`${itemPath}.uncompromisingIntegrityLabel`}
              data-preview-field-path={`${itemPath}.uncompromisingIntegrityLabel`}
              defaultValue="Uncompromising Integrity"
            />
          </div>
          <EditableText
            as="h2"
            id={`${itemPath}.heading3`}
            data-preview-field-path={`${itemPath}.heading3`}
            defaultValue="Engineered for Trust."
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 tracking-tight"
          />
          <EditableText
            as="p"
            id={`${itemPath}.description3`}
            data-preview-field-path={`${itemPath}.description3`}
            defaultValue="We operate at the intersection of Swiss-watchmaker precision, clinical cleanroom environments, and hospitality-first customer care."
            className="mt-4 text-sm sm:text-base text-zinc-600 max-w-xl mx-auto"
          />
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-20"
          data-preview-list-path={`${itemPath}.STATS`}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              data-preview-item-path={`${itemPath}.STATS[${index}]`}
              className="p-8 rounded-3xl border border-black/[0.08] bg-white/95 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(0,240,255,0.15)]"
            >
              <div>
                <EditableText
                  as="p"
                  id={`${itemPath}.STATS[${index}].number`}
                  data-preview-field-path={`${itemPath}.STATS[${index}].number`}
                  defaultValue={stat.number}
                  className="text-4xl sm:text-5xl font-black text-zinc-950 font-mono tracking-tight"
                />
                <EditableText
                  as="h4"
                  id={`${itemPath}.STATS[${index}].label`}
                  data-preview-field-path={`${itemPath}.STATS[${index}].label`}
                  defaultValue={stat.label}
                  className="mt-3 text-sm font-bold text-cyan-600 tracking-wide"
                />
              </div>
              <EditableText
                as="p"
                id={`${itemPath}.STATS[${index}].detail`}
                data-preview-field-path={`${itemPath}.STATS[${index}].detail`}
                defaultValue={stat.detail}
                className="mt-3 text-xs text-zinc-600 leading-relaxed border-t border-black/[0.06] pt-3"
              />
            </div>
          ))}
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <li
                key={pillar.title}
                data-preview-item-path={`${itemPath}.PILLARS[${pillar.title}]`}
                className="rounded-3xl border border-black/[0.08] bg-white/95 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,240,255,0.15)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 border border-cyan-400/30 text-cyan-600 mb-5 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                  <Icon className="h-6 w-6" />
                </div>
                <EditableText
                  as="h3"
                  id={`${itemPath}.PILLARS[${pillar.title}].title`}
                  data-preview-field-path={`${itemPath}.PILLARS[${pillar.title}].title`}
                  defaultValue={pillar.title}
                  className="text-base font-bold text-zinc-950 tracking-tight"
                />
                <EditableText
                  as="p"
                  id={`${itemPath}.PILLARS[${pillar.title}].desc`}
                  data-preview-field-path={`${itemPath}.PILLARS[${pillar.title}].desc`}
                  defaultValue={pillar.desc}
                  className="mt-2 text-xs text-zinc-600 leading-relaxed"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </Component>
  );
}