import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface FaqItem {
  q?: string;
  a?: string;
  [key: string]: unknown;
}

export interface EditablefaqSectionProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  faqs: FaqItem[];
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditablefaqSection({
  itemPath,
  faqs,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditablefaqSectionProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative py-24 sm:py-32 overflow-clip bg-slate-50/70 border-t border-black/[0.06] ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="pointer-events-none absolute bottom-1/4 left-1/3 h-[450px] w-[450px] rounded-full bg-cyan-400/10 blur-[140px]" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <EditableText
              as="span"
              id={`${itemPath}.transparencyAnswersLabel`}
              data-preview-field-path={`${itemPath}.transparencyAnswersLabel`}
              defaultValue="Transparency & Answers"
            />
          </div>
          <EditableText
            as="h2"
            id={`${itemPath}.heading`}
            data-preview-field-path={`${itemPath}.heading`}
            defaultValue="Frequently Answered Questions."
            className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight"
          />
          <EditableText
            as="p"
            id={`${itemPath}.description`}
            data-preview-field-path={`${itemPath}.description`}
            defaultValue="Everything you need to know about our repair warranties, turnaround timelines, and trade-in criteria."
            className="mt-3 text-sm sm:text-base text-zinc-600"
          />
        </div>
        <div
          className="space-y-4"
          data-preview-list-path={`${itemPath}.faqs`}
        >
          {faqs.map((faq, idx) => {
            return (
              <div
                key={faq.q}
                className={`rounded-2xl border transition-all duration-300 backdrop-blur-xl overflow-clip border-black/[0.08] bg-white/95 hover:border-cyan-400/40 shadow-sm`}
                data-preview-item-path={`${itemPath}.faqs[${idx}]`}
              >
                <button
                  type="button"
                  className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors"
                >
                  <EditableText
                    as="span"
                    id={`${itemPath}.faqs[${idx}].q`}
                    data-preview-field-path={`${itemPath}.faqs[${idx}].q`}
                    defaultValue={faq.q}
                    className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight"
                  />
                </button>
                <EditableText
                  as="p"
                  id={`${itemPath}.faqs[${idx}].a`}
                  data-preview-field-path={`${itemPath}.faqs[${idx}].a`}
                  defaultValue={faq.a}
                  className="px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-black/[0.06]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </Component>
  );
}