import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface RepairService {
  id?: string;
  title?: string;
  tagline?: string;
  desc?: string;
  time?: string;
  price?: string;
  warranty?: string;
  icon?: React.ElementType;
  glow?: 'cyan' | 'blue' | 'violet';
}

export interface EditableRepairServicesProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  services: RepairService[];
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableRepairServices({
  itemPath,
  services,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  ...props
}: EditableRepairServicesProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-repair-services ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 sm:mb-20 text-left">
          <EditableText
            as="h2"
            id={`${itemPath}.heading`}
            data-preview-field-path={`${itemPath}.heading`}
            defaultValue="Broken Phone?"
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 tracking-tight"
          />
          <EditableText
            as="p"
            id={`${itemPath}.description`}
            data-preview-field-path={`${itemPath}.description`}
            defaultValue="From cracked OLED screens to board-level micro-soldering, our technicians provide fast, professional repairs using high-quality components and aerospace-grade tooling."
            className="mt-4 text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed"
          />
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" data-preview-list-path={`${itemPath}.services`}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <li
                key={service.id}
                data-preview-item-path={`${itemPath}.services.${service.id}`}
                className="p-7 flex flex-col justify-between rounded-3xl border border-black/[0.08] bg-white/95 hover:border-cyan-400/50 hover:shadow-[0_15px_35px_rgba(0,240,255,0.15)] transition-all duration-300 hover:-translate-y-1 group shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 border border-cyan-400/30 text-cyan-600 shadow-[0_0_20px_rgba(0,240,255,0.2)] group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all">
                      {Icon && <Icon className="h-6 w-6" />}
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-slate-100/80 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur-md">
                      <EditableText
                        as="span"
                        id={`${itemPath}.services.${service.id}.time`}
                        data-preview-field-path={`${itemPath}.services.${service.id}.time`}
                        defaultValue={service.time}
                      />
                    </div>
                  </div>

                  <EditableText
                    as="h3"
                    id={`${itemPath}.services.${service.id}.title`}
                    data-preview-field-path={`${itemPath}.services.${service.id}.title`}
                    defaultValue={service.title}
                    className="mt-6 text-xl font-bold text-zinc-950 tracking-tight group-hover:text-cyan-600 transition-colors"
                  />
                  <EditableText
                    as="p"
                    id={`${itemPath}.services.${service.id}.tagline`}
                    data-preview-field-path={`${itemPath}.services.${service.id}.tagline`}
                    defaultValue={service.tagline}
                    className="mt-1 text-xs font-semibold text-cyan-600 font-mono"
                  />
                  <EditableText
                    as="p"
                    id={`${itemPath}.services.${service.id}.desc`}
                    data-preview-field-path={`${itemPath}.services.${service.id}.desc`}
                    defaultValue={service.desc}
                    className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed"
                  />
                </div>

                <div className="mt-8 pt-5 border-t border-black/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Estimated Cost</span>
                    <EditableText
                      as="span"
                      id={`${itemPath}.services.${service.id}.price`}
                      data-preview-field-path={`${itemPath}.services.${service.id}.price`}
                      defaultValue={service.price}
                      className="text-lg font-black text-zinc-950 font-mono"
                    />
                  </div>

                  <button
                    onClick={() => {}}
                    className="group/btn inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-700 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-600 hover:text-white hover:border-transparent transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                  >
                    <span>Book Repair</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Component>
  );
}