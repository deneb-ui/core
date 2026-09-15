import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface RepairStep {
  step?: string;
  title?: string;
  desc?: string;
  icon?: React.ElementType;
  time?: string;
  [key: string]: unknown;
}

export interface EditablerepairProcessProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  steps: RepairStep[];
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditablerepairProcess({
  itemPath,
  steps,
  as: Component = 'section',
  className = '',
  style,
  ...props
}: EditablerepairProcessProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative py-24 sm:py-32 overflow-clip bg-slate-50/70 border-t border-black/[0.06] ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <EditableText
            as="h2"
            id={`${itemPath}.heading`}
            data-preview-field-path={`${itemPath}.heading`}
            defaultValue="Precision in 4 Simple Steps."
            className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight"
          />
          <EditableText
            as="p"
            id={`${itemPath}.description`}
            data-preview-field-path={`${itemPath}.description`}
            defaultValue="From initial symptom check to final testing, our streamlined process ensures maximum transparency and rapid turnaround."
            className="mt-3 text-sm sm:text-base text-zinc-600"
          />
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10" data-preview-list-path={`${itemPath}.steps`}>
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <li
                key={item.step}
                data-preview-item-path={`${itemPath}.steps.${index}`}
                className="process-card group relative flex flex-col justify-between rounded-3xl border border-black/[0.08] bg-white/95 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400 hover:-translate-y-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(0,240,255,0.2)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <EditableText
                      as="span"
                      id={`${itemPath}.steps.${index}.step`}
                      data-preview-field-path={`${itemPath}.steps.${index}.step`}
                      defaultValue={item.step}
                      className="text-2xl font-black font-mono tracking-tight text-slate-300 group-hover:text-cyan-500 transition-colors"
                    />
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 border border-cyan-400/30 text-cyan-600 shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all">
                      {Icon && <Icon className="h-5 w-5" />}
                    </div>
                  </div>

                  <EditableText
                    as="h3"
                    id={`${itemPath}.steps.${index}.title`}
                    data-preview-field-path={`${itemPath}.steps.${index}.title`}
                    defaultValue={item.title}
                    className="text-lg font-bold text-zinc-950 tracking-tight group-hover:text-cyan-600 transition-colors"
                  />
                  <EditableText
                    as="p"
                    id={`${itemPath}.steps.${index}.desc`}
                    data-preview-field-path={`${itemPath}.steps.${index}.desc`}
                    defaultValue={item.desc}
                    className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed"
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs">
                  <EditableText
                    as="span"
                    id={`${itemPath}.steps.${index}.time`}
                    data-preview-field-path={`${itemPath}.steps.${index}.time`}
                    defaultValue={item.time}
                    className="text-[11px] text-zinc-500 font-medium"
                  />
                  <EditableText
                    as="span"
                    id={`${itemPath}.steps.${index}.duration`}
                    data-preview-field-path={`${itemPath}.steps.${index}.duration`}
                    defaultValue="Duration"
                    className="font-mono text-cyan-600 font-bold"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Component>
  );
}