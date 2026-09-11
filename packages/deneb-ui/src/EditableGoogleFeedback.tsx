import React, { useMemo, useState, useRef, useEffect } from 'react';

export interface FeedbackItem {
  id?: string | number;
  name?: string;
  avatar?: string;
  rating?: number | string;
  date?: string;
  comment?: string;
  verified?: boolean;
  [key: string]: unknown;
}

export interface EditableGoogleFeedbackProps extends React.HTMLAttributes<HTMLElement> {
  basePath?: string;
  badgeIcon?: string;
  badgeTitle?: string;
  badgeRating?: string | number;
  badgeReviewsCount?: string | number;
  heading?: string;
  subheading?: string;
  feedbacks?: FeedbackItem[];
  maxStars?: number;
  className?: string;
  cardClassName?: string;
}

const DEFAULT_GOOGLE_ICON = 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg';

const DEFAULT_FEEDBACKS: FeedbackItem[] = [
  {
    id: 1,
    name: 'Elena Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    date: '3 days ago',
    comment: 'The Yirgacheffe pour-over is unmatched. You can taste the jasmine and wild bergamot notes immediately. The atmosphere of the salon is pure serenity.',
    verified: true,
  },
  {
    id: 2,
    name: 'Julian Thorne',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    date: '1 week ago',
    comment: 'Hands down the best flat white on the island. The milk texture was like velvet and the single-origin espresso cut through with rich cacao sweetness.',
    verified: true,
  },
  {
    id: 3,
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Ordered 2 bags of the cast-iron roasted beans for my home setup. Shipping was lightning-fast and the roast profile was exceptionally dialed in.',
    verified: true,
  },
  {
    id: 4,
    name: 'David Sterling',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    date: '3 weeks ago',
    comment: 'The 9-bar manual lever pull is pure art. Wonderful baristas who genuinely know and love their craft. Liceria & Co. has set a whole new standard.',
    verified: true,
  },
  {
    id: 5,
    name: 'Sophia Aris',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    date: '1 month ago',
    comment: 'Attended the private cupping session on Saturday. Educational, welcoming, and deeply flavorful. Easily our favorite coffee destination in the country.',
    verified: true,
  },
];

function GoogleStarSvg({ filled = true, size = 18 }: { filled?: boolean; size?: number }) {
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

function FeedbackCard({
  item,
  index,
  basePath,
  maxStars,
  badgeIcon,
  cardClassName,
}: {
  item: FeedbackItem;
  index: number;
  basePath: string;
  maxStars: number;
  badgeIcon?: string;
  cardClassName?: string;
}) {
  const currentItem = item || {};
  const rawRating = currentItem.rating != null && currentItem.rating !== '' ? currentItem.rating : 5;
  const initialRating = Math.min(Math.max(Math.round(Number(rawRating) || 5), 1), maxStars);

  const [currentRating, setCurrentRating] = useState<number>(initialRating);
  const ratingRef = useRef<HTMLSpanElement>(null);

  // Sync state when props change
  useEffect(() => {
    setCurrentRating(initialRating);
  }, [initialRating]);

  // Real-time MutationObserver to sync DOM live edits from Fivora inspector instantly
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

  const reviewerName = String(currentItem.name || 'Anonymous');
  const reviewerAvatar = String(
    currentItem.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  );
  const reviewerComment = String(currentItem.comment || '');
  const reviewerDate = String(currentItem.date || 'Recent review');

  return (
    <div
      data-preview-item-path={`feedback.feedbacks[${index}]`}
      className={`p-6 sm:p-7 rounded-3xl bg-[#ffffff] border border-[#3d2114]/12 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 ${cardClassName || ''}`.trim()}
    >
      <div className="space-y-3.5">
        {/* Author Profile Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={reviewerAvatar}
              alt={reviewerName}
              data-preview-field-path={`feedback.feedbacks[${index}].avatar`}
              className="w-11 h-11 rounded-full object-cover border border-[#3d2114]/15 shadow-sm"
            />
            <div>
              <span
                data-preview-field-path={`feedback.feedbacks[${index}].name`}
                className="block text-sm font-black text-[#2b170e]"
              >
                {reviewerName}
              </span>
              <span
                data-preview-field-path={`feedback.feedbacks[${index}].date`}
                className="block text-xs text-[#8c7a6e]"
              >
                {reviewerDate}
              </span>
            </div>
          </div>

          <img
            src={badgeIcon || DEFAULT_GOOGLE_ICON}
            alt="Google"
            className="w-5 h-5 object-contain opacity-90"
          />
        </div>

        {/* Star rating row & Google verified tag */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div
            className="inline-flex items-center gap-2 p-1 -ml-1 rounded-lg cursor-pointer transition-all hover:bg-[#fa7014]/10 group"
            onClick={handleFocusRating}
            title={`Rating: ${currentRating} of ${maxStars} (Click to edit)`}
          >
            <div className="flex items-center gap-[2px]" data-fivora-stars-row="true">
              {Array.from({ length: maxStars }).map((_, sIdx) => (
                <GoogleStarSvg key={sIdx} filled={sIdx < currentRating} size={18} />
              ))}
            </div>
            <span
              ref={ratingRef}
              data-preview-field-path={`feedback.feedbacks[${index}].rating`}
              data-fivora-rating-text="true"
              className="text-xs font-black text-[#fa7014] bg-[#fa7014]/10 px-1.5 py-0.5 rounded-md border border-[#fa7014]/20 group-hover:bg-[#fa7014]/20 transition-colors tabular-nums"
              title="Star count (1-5)"
            >
              {currentRating}
            </span>
          </div>

          {/* Google verified indicator */}
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-1 rounded-full border border-[#1a73e8]/20">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>Verified</span>
          </div>
        </div>

        {/* Comment / Review text */}
        <p
          data-preview-field-path={`feedback.feedbacks[${index}].comment`}
          className="text-sm sm:text-base text-[#3d2114] leading-relaxed italic font-normal pt-1"
        >
          &ldquo;{reviewerComment}&rdquo;
        </p>
      </div>
    </div>
  );
}

export function EditableGoogleFeedback({
  basePath = 'feedback',
  badgeIcon = DEFAULT_GOOGLE_ICON,
  badgeTitle = 'Google Reviews',
  badgeRating = '4.9',
  badgeReviewsCount = '340+ Verified Reviews',
  heading = 'PRAISED BY COFFEE LOVERS',
  subheading = 'Real experiences from patrons who visit our roastery parlor and brew our micro-lots.',
  feedbacks = DEFAULT_FEEDBACKS,
  maxStars = 5,
  className = '',
  cardClassName = '',
  style,
  ...props
}: EditableGoogleFeedbackProps) {
  const items = useMemo(() => {
    const list = Array.isArray(feedbacks) ? feedbacks : [];
    if (list.length === 0) {
      return DEFAULT_FEEDBACKS;
    }
    return list.map((item, index) => {
      const fallback = DEFAULT_FEEDBACKS[index % DEFAULT_FEEDBACKS.length] || DEFAULT_FEEDBACKS[0];
      if (!item || typeof item !== 'object') {
        return { ...fallback, id: `fallback-${index}` };
      }
      return {
        ...fallback,
        ...item,
        id: item.id || `feedback-${index}`,
        rating: item.rating !== undefined && item.rating !== null ? item.rating : 5,
      };
    });
  }, [feedbacks]);

  return (
    <section
      data-design-section="google-feedback"
      className={`editable-google-feedback w-full ${className}`.trim()}
      style={style}
      {...props}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header & Google Rating Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl space-y-3">
            {/* Google Rating Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#ede0d4]/80 border border-[#3d2114]/15 shadow-sm">
              <img
                src={badgeIcon || DEFAULT_GOOGLE_ICON}
                alt="Google"
                data-preview-field-path={`feedback.badgeIcon`}
                className="w-4 h-4 object-contain"
              />
              <span
                data-preview-field-path={`feedback.badgeTitle`}
                className="text-xs uppercase tracking-widest font-black text-[#3d2114]"
              >
                {badgeTitle}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#84431b]" />
              <div className="flex items-center gap-1.5">
                <span
                  data-preview-field-path={`feedback.badgeRating`}
                  className="text-xs font-black text-[#84431b]"
                >
                  {badgeRating}
                </span>
                <div className="flex items-center gap-[2px]">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <GoogleStarSvg key={sIdx} filled={true} size={14} />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-[#786154] font-medium hidden sm:inline">
                (<span data-preview-field-path={`feedback.badgeReviewsCount`}>{badgeReviewsCount}</span>)
              </span>
            </div>

            <h2
              data-preview-field-path={`feedback.heading`}
              className="font-heading text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#2b170e] tracking-tight"
            >
              {heading}
            </h2>
            <p
              data-preview-field-path={`feedback.subheading`}
              className="text-xs sm:text-base text-[#5c493f] leading-relaxed"
            >
              {subheading}
            </p>
          </div>

          {/* Aggregate Badge for Desktop */}
          <div className="hidden md:flex flex-col items-end text-right">
            <div className="flex items-center gap-2">
              <span
                data-preview-field-path={`feedback.badgeRating`}
                className="font-heading text-4xl font-black text-[#84431b]"
              >
                {badgeRating}
              </span>
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-[2px]">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <GoogleStarSvg key={sIdx} filled={true} size={16} />
                  ))}
                </div>
                <span
                  data-preview-field-path={`feedback.badgeReviewsCount`}
                  className="text-xs text-[#786154] font-bold"
                >
                  {badgeReviewsCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Cards List */}
        <div
          data-preview-list-path={`feedback.feedbacks`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item, index) => (
            <FeedbackCard
              key={item.id || `feedback-${index}`}
              item={item}
              index={index}
              basePath={basePath}
              maxStars={maxStars}
              badgeIcon={badgeIcon}
              cardClassName={cardClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
