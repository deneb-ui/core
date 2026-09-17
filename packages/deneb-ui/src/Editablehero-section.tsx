import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableHeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: any;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableHeroSection({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditableHeroSectionProps) {
  const imageUrl = String(data?.home?.hero?.exoticHypercarNightFrontModern || "/images/cars/hero-hypercar.jpg");
  const imageAlt = String(data?.home?.hero?.imageAlt || "Exotic Hypercar at Night in Front of Modern Architecture");
  const performance = String(data?.home?.hero?.performance || "PERFORMANCE");
  const title = String(data?.home?.hero?.title || "DRIVE ORDINARY");
  const beyondLabel = String(data?.home?.hero?.beyondLabel || "BEYOND");
  const discoverText = String(data?.home?.hero?.discoverExceptionalPerformanceMachinesEngineered || "Discover exceptional performance machines engineered for those who refuse to settle for ordinary. Uncompromising automotive artistry, sculpted in carbon fiber and motorsport heritage.");
  
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative w-full min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-[#050608] select-none ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="absolute inset-0 z-0">
        <EditableImage
          id={`${itemPath}.exoticHypercarNightFrontModern`}
          data-preview-field-path={`${itemPath}.exoticHypercarNightFrontModern`}
          src={imageUrl}
          fallbackSrc={imageFallback}
          alt={imageAlt}
          className="object-cover object-center brightness-[0.85] contrast-[1.08]"
        />
      </div>
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <EditableText
          as="span"
          id={`${itemPath}.performance`}
          data-preview-field-path={`${itemPath}.performance`}
          defaultValue={performance}
          className="font-display font-black text-[18vw] leading-none tracking-tighter text-white whitespace-nowrap select-none uppercase -translate-y-8"
        />
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 mt-auto mb-10 flex flex-col justify-end">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <EditableText
              as="span"
              id={`${itemPath}.theArtPerformanceLabel`}
              data-preview-field-path={`${itemPath}.theArtPerformanceLabel`}
              defaultValue={data?.home?.hero?.theArtPerformanceLabel || "THE ART OF PERFORMANCE"}
              className="text-[11px] sm:text-xs font-mono tracking-[0.35em] text-red-400 uppercase font-semibold"
            />
            <div className="h-[1px] w-12 bg-red-500/30" />
          </div>
          <div className="overflow-hidden mb-6">
            <EditableText
              as="h1"
              id={`${itemPath}.title`}
              data-preview-field-path={`${itemPath}.title`}
              defaultValue={title}
              className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.92]"
            />
            <EditableText
              as="span"
              id={`${itemPath}.beyondLabel`}
              data-preview-field-path={`${itemPath}.beyondLabel`}
              defaultValue={beyondLabel}
              className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500"
            />
          </div>
          <EditableText
            as="p"
            id={`${itemPath}.discoverExceptionalPerformanceMachinesEngineered`}
            data-preview-field-path={`${itemPath}.discoverExceptionalPerformanceMachinesEngineered`}
            defaultValue={discoverText}
            className="text-base sm:text-lg text-neutral-300 max-w-xl font-light leading-relaxed mb-8"
          />
          {children}
        </div>
      </div>
    </Component>
  );
}