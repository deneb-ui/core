import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface Review {
  name?: string;
  role?: string;
  rating?: number;
  date?: string;
  verifiedService?: string;
  comment?: string;
  device?: string;
}

export interface EditableTestimonialsProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  reviews: Review[];
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableTestimonials({
  itemPath,
  reviews,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditableTestimonialsProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative py-24 sm:py-32 overflow-clip bg-white border-t border-black/[0.06] ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="pointer-events-none absolute top-1/2 right-1/4 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-cyan-400/10 blur-[130px]" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <EditableText
            as="span"
            id={`${itemPath}.clientExperiencesLabel`}
            data-preview-field-path={`${itemPath}.clientExperiencesLabel`}
            defaultValue="Client Experiences"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          />
          <EditableText
            as="h2"
            id={`${itemPath}.heading`}
            data-preview-field-path={`${itemPath}.heading`}
            defaultValue="Loved by Connoisseurs."
            className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight"
          />
          <EditableText
            as="p"
            id={`${itemPath}.description`}
            data-preview-field-path={`${itemPath}.description`}
            defaultValue="Read authentic reviews from clients who demand perfection for their mobile devices."
            className="mt-3 text-sm sm:text-base text-zinc-600"
          />
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          data-preview-list-path={`${itemPath}.REVIEWS`}
        >
          {reviews.map((rev, index) => (
            <div
              key={rev.name}
              data-preview-item-path={`${itemPath}.REVIEWS[${index}]`}
              className="p-7 flex flex-col justify-between rounded-3xl border border-black/[0.08] bg-white/95 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(0,240,255,0.15)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <span key={i} className="h-4 w-4 fill-amber-400">★</span>
                      ))}
                    </div>
                    <span
                      className="text-xs font-bold font-mono text-amber-600"
                      data-preview-field-path={`${itemPath}.REVIEWS[${index}].rating`}
                    >
                      {rev.rating}.0
                    </span>
                  </div>
                  <EditableText
                    as="span"
                    id={`${itemPath}.verifiedClientLabel`}
                    data-preview-field-path={`${itemPath}.verifiedClientLabel`}
                    defaultValue="Verified Client"
                    className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-500/30"
                  />
                </div>
                <EditableText
                  as="p"
                  id={`${itemPath}.REVIEWS[${index}].comment`}
                  data-preview-field-path={`${itemPath}.REVIEWS[${index}].comment`}
                  defaultValue={rev.comment}
                  className="mt-5 text-xs sm:text-sm text-zinc-700 leading-relaxed italic"
                />
              </div>
              <div className="mt-6 pt-5 border-t border-black/[0.06]">
                <div className="flex items-center justify-between">
                  <div>
                    <EditableText
                      as="h4"
                      id={`${itemPath}.REVIEWS[${index}].name`}
                      data-preview-field-path={`${itemPath}.REVIEWS[${index}].name`}
                      defaultValue={rev.name}
                      className="text-sm font-bold text-zinc-950 tracking-wide"
                    />
                    <EditableText
                      as="p"
                      id={`${itemPath}.REVIEWS[${index}].role`}
                      data-preview-field-path={`${itemPath}.REVIEWS[${index}].role`}
                      defaultValue={rev.role}
                      className="text-[11px] text-zinc-500"
                    />
                    <EditableText
                      as="span"
                      id={`${itemPath}.REVIEWS[${index}].device`}
                      data-preview-field-path={`${itemPath}.REVIEWS[${index}].device`}
                      defaultValue={rev.device}
                      className="inline-block mt-0.5 text-[10px] text-zinc-400 font-mono"
                    />
                  </div>
                  <EditableText
                    as="span"
                    id={`${itemPath}.REVIEWS[${index}].date`}
                    data-preview-field-path={`${itemPath}.REVIEWS[${index}].date`}
                    defaultValue={rev.date}
                    className="text-[10px] text-zinc-400 font-mono"
                  />
                </div>
                <EditableText
                  as="p"
                  id={`${itemPath}.REVIEWS[${index}].verifiedService`}
                  data-preview-field-path={`${itemPath}.REVIEWS[${index}].verifiedService`}
                  defaultValue={rev.verifiedService}
                  className="mt-2 text-[11px] text-cyan-600 font-mono font-medium truncate"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Component>
  );
}