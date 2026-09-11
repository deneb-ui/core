import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { TestimonialItem } from './EditableTestimonialCard';

export interface TestimonialSectionItem extends TestimonialItem {
  tag?: string;
  [key: string]: unknown;
}

export interface EditableTestimonialSectionProps extends React.HTMLAttributes<HTMLElement> {
  basePath?: string;
  badge?: string;
  heading?: string;
  subheading?: string;
  testimonials?: TestimonialSectionItem[];
  maxStars?: number;
  className?: string;
  cardClassName?: string;
}

const DEFAULT_TESTIMONIALS: TestimonialSectionItem[] = [
  {
    id: 1,
    quote: 'The thermal profile Liceria achieves on their refurbished drum is revelatory. You get bright floral acidity harmonized with unprecedented chocolate depth.',
    author: 'Chef Antoine Laurent',
    role: 'Michelin Star Restaurateur & Sommelier',
    avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    tag: 'Culinary Master',
  },
  {
    id: 2,
    quote: 'Manual spring-lever extraction pulled at 93.5°C with mineralized volcanic water. This is not just coffee; this is pure thermodynamic equilibrium.',
    author: 'Clara Sorensen',
    role: 'World Barista Championship Sensory Judge',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    tag: 'Sensory Panel',
  },
  {
    id: 3,
    quote: 'The flagship parlor is our neighborhood sanctuary. Whether for a quiet morning espresso or meeting international bean importers, there is nowhere else quite like it.',
    author: 'Maximilian Sterling',
    role: 'Architecture & Design Critic, Urban Loft',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    tag: 'Design & Culture',
  },
];

function StarSvg({ filled = true, size = 16 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fill: filled ? '#fa7014' : '#dadce0',
        color: filled ? '#fa7014' : '#dadce0',
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function TestimonialCard({
  item,
  index,
  basePath,
  maxStars,
  cardClassName,
}: {
  item: TestimonialItem;
  index: number;
  basePath: string;
  maxStars: number;
  cardClassName?: string;
}) {
  const currentItem = item || {};
  const rawRating = currentItem.rating != null && (currentItem.rating as unknown) !== '' ? currentItem.rating : 5;
  const initialRating = Math.min(Math.max(Math.round(Number(rawRating) || 5), 1), maxStars);

  const [currentRating, setCurrentRating] = useState<number>(initialRating);
  const ratingRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setCurrentRating(initialRating);
  }, [initialRating]);

  useEffect(() => {
    const el = ratingRef.current;
    if (!el) return;

    const parseValue = () => {
      const text = el.textContent?.trim() ?? '';
      if (!text) return;
      const num = Number(text);
      if (!Number.isNaN(num) && Number.isFinite(num)) {
        const clamped = Math.min(Math.max(Math.round(num), 1), maxStars);
        setCurrentRating(clamped);
      }
    };

    const observer = new MutationObserver(parseValue);
    observer.observe(el, { characterData: true, childList: true, subtree: true });
    return () => observer.disconnect();
  }, [maxStars]);

  const handleFocusRating = () => {
    if (ratingRef.current) {
      ratingRef.current.focus();
      ratingRef.current.click();
    }
  };

  const quoteText = String(currentItem.quote || '');
  const authorName = String(currentItem.author || 'Anonymous');
  const authorRole = String(currentItem.role || '');
  const authorAvatar = String(
    currentItem.avatar ||
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300&auto=format&fit=crop',
  );
  const tagText = String(currentItem.tag || '');

  return (
    <div
      data-preview-item-path={`testimonials.testimonials[${index}]`}
      className={`relative p-7 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#3d2114]/12 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 ${cardClassName || ''}`.trim()}
    >
      <div className="space-y-4">
        {/* Category Tag & Rating Stars */}
        <div className="flex items-center justify-between gap-2">
          {Boolean(currentItem.tag) && (
            <span
              data-preview-field-path={`testimonials.testimonials[${index}].tag`}
              className="px-3 py-1 rounded-full bg-[#f5ebe1] text-[#84431b] text-[11px] uppercase tracking-wider font-extrabold border border-[#3d2114]/10"
            >
              {tagText}
            </span>
          )}

          <div
            className="inline-flex items-center gap-2 p-1 -mr-1 rounded-lg cursor-pointer transition-all hover:bg-[#fa7014]/10 group ml-auto"
            onClick={handleFocusRating}
            title={`Rating: ${currentRating} of ${maxStars} (Click to edit)`}
          >
            <div className="flex items-center gap-[2px]" data-fivora-stars-row="true">
              {Array.from({ length: maxStars }).map((_, sIdx) => (
                <StarSvg key={sIdx} filled={sIdx < currentRating} size={16} />
              ))}
            </div>
            <span
              ref={ratingRef}
              data-preview-field-path={`testimonials.testimonials[${index}].rating`}
              data-fivora-rating-text="true"
              className="text-xs font-black text-[#fa7014] bg-[#fa7014]/10 px-1.5 py-0.5 rounded-md border border-[#fa7014]/20 group-hover:bg-[#fa7014]/20 transition-colors tabular-nums"
              title="Star count (1-5)"
            >
              {currentRating}
            </span>
          </div>
        </div>

        {/* Quote Body */}
        <blockquote
          data-preview-field-path={`testimonials.testimonials[${index}].quote`}
          className="font-serif-italic text-base sm:text-lg text-[#2b170e] leading-relaxed"
        >
          &ldquo;{quoteText}&rdquo;
        </blockquote>
      </div>

      {/* Author Info */}
      <div className="pt-4 border-t border-[#3d2114]/10 flex items-center gap-3.5">
        <img
          src={authorAvatar}
          alt={authorName}
          data-preview-field-path={`testimonials.testimonials[${index}].avatar`}
          className="w-12 h-12 rounded-full object-cover border border-[#3d2114]/15 shadow-sm"
        />
        <div>
          <h4
            data-preview-field-path={`testimonials.testimonials[${index}].author`}
            className="font-heading font-black text-sm sm:text-base text-[#2b170e]"
          >
            {authorName}
          </h4>
          <p
            data-preview-field-path={`testimonials.testimonials[${index}].role`}
            className="text-xs text-[#786154] font-medium leading-snug"
          >
            {authorRole}
          </p>
        </div>
      </div>
    </div>
  );
}

export function EditableTestimonialSection({
  basePath = 'testimonials',
  badge = 'WORDS OF ACCLAIM',
  heading = 'WHAT THE CRITICS ARE SAYING',
  subheading = 'Reflections from international cuppers, culinary masters, and dedicated regulars.',
  testimonials = DEFAULT_TESTIMONIALS,
  maxStars = 5,
  className = '',
  cardClassName = '',
  style,
  ...props
}: EditableTestimonialSectionProps) {
  const items = useMemo(() => {
    const list = Array.isArray(testimonials) ? testimonials : [];
    if (list.length === 0) {
      return DEFAULT_TESTIMONIALS;
    }
    return list.map((item, index) => {
      const fallback = DEFAULT_TESTIMONIALS[index % DEFAULT_TESTIMONIALS.length] || DEFAULT_TESTIMONIALS[0];
      if (!item || typeof item !== 'object') {
        return { ...fallback, id: `fallback-${index}` };
      }
      return {
        ...fallback,
        ...item,
        id: item.id || `testimonial-${index}`,
        rating: item.rating !== undefined && item.rating !== null ? item.rating : 5,
      };
    });
  }, [testimonials]);

  return (
    <section
      data-design-section="testimonials"
      className={`editable-testimonial-section w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-10 ${className}`.trim()}
      style={style}
      {...props}
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ede0d4] text-[#3d2114] text-xs uppercase tracking-widest font-black border border-[#3d2114]/15">
              <span data-preview-field-path={`testimonials.badge`}>{badge}</span>
            </div>
          )}
          <h2
            data-preview-field-path={`testimonials.heading`}
            className="font-heading text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#2b170e] tracking-tight"
          >
            {heading}
          </h2>
          <p
            data-preview-field-path={`testimonials.subheading`}
            className="text-xs sm:text-base text-[#5c493f] leading-relaxed"
          >
            {subheading}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          data-preview-list-path={`testimonials.testimonials`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {items.map((item, index) => (
            <TestimonialCard
              key={item.id || `testimonial-${index}`}
              item={item}
              index={index}
              basePath={basePath}
              maxStars={maxStars}
              cardClassName={cardClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
