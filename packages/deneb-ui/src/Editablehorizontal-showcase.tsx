import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface CarSpec {
  id: string;
  name: string;
  brand: string;
  year: string;
  image: string;
  description: string;
  horsepower: number;
  acceleration: number;
  topSpeed: number;
  formattedPrice: string;
}

export interface EditablehorizontalShowcaseProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  showcaseCars: CarSpec[];
  currentIndex: number;
  imageFallback?: string;
  as?: React.ElementType;
  onSelectCar: (car: CarSpec) => void;
}

export function EditablehorizontalShowcase({
  itemPath,
  showcaseCars,
  currentIndex,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  onSelectCar,
  className = '',
  style,
  ...props
}: EditablehorizontalShowcaseProps) {
  const activeCar = showcaseCars[currentIndex];

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative w-full min-h-[90vh] py-24 bg-[#050608] overflow-hidden flex flex-col justify-between select-none ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <EditableText
                as="span"
                id={`${itemPath}.horizontalRevealExperienceLabel`}
                data-preview-field-path={`${itemPath}.horizontalRevealExperienceLabel`}
                defaultValue="HORIZONTAL REVEAL EXPERIENCE"
                className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase font-semibold"
              />
            </div>
            <EditableText
              as="h2"
              id={`${itemPath}.heading5`}
              data-preview-field-path={`${itemPath}.heading5`}
              defaultValue="ENGINEERED"
              className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight"
            />
            <EditableText
              as="span"
              id={`${itemPath}.withoutCompromiseLabel`}
              data-preview-field-path={`${itemPath}.withoutCompromiseLabel`}
              defaultValue="WITHOUT COMPROMISE."
              className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400"
            />
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 h-[540px] flex items-center">
        <div className="relative w-full h-full rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex flex-col md:flex-row">
          <div className="relative w-full md:w-3/5 h-64 md:h-full overflow-hidden">
            <EditableImage
              id={`${itemPath}.image`}
              data-preview-field-path={`${itemPath}.image`}
              src={activeCar.image}
              fallbackSrc={imageFallback}
              alt={activeCar.name}
              className="object-cover object-center brightness-[0.9] contrast-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#0B0D12]/20 to-[#0B0D12]" />
            <div className="absolute top-6 left-6 font-display font-black text-6xl md:text-8xl text-white/10 select-none">
              <span>0</span>{currentIndex + 1}
            </div>
          </div>

          <div className="relative w-full md:w-2/5 p-6 sm:p-10 flex flex-col justify-between bg-[#0B0D12]/90 backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <EditableText
                  as="span"
                  id={`${itemPath}.brand`}
                  data-preview-field-path={`${itemPath}.brand`}
                  defaultValue={activeCar.brand}
                  className="text-[11px] font-mono tracking-[0.25em] text-red-400 uppercase font-semibold"
                />
                <span className="text-neutral-600">/</span>
                <EditableText
                  as="span"
                  id={`${itemPath}.year`}
                  data-preview-field-path={`${itemPath}.year`}
                  defaultValue={activeCar.year}
                  className="text-[11px] font-mono text-neutral-400"
                />
              </div>

              <EditableText
                as="h3"
                id={`${itemPath}.name`}
                data-preview-field-path={`${itemPath}.name`}
                defaultValue={activeCar.name}
                className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight uppercase leading-tight mb-4"
              />

              <EditableText
                as="p"
                id={`${itemPath}.description`}
                data-preview-field-path={`${itemPath}.description`}
                defaultValue={activeCar.description}
                className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed mb-6 line-clamp-3"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <EditableText
                  as="span"
                  id={`${itemPath}.priceLabel`}
                  data-preview-field-path={`${itemPath}.priceLabel`}
                  defaultValue="PRICE"
                  className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block"
                />
                <EditableText
                  as="span"
                  id={`${itemPath}.formattedPrice`}
                  data-preview-field-path={`${itemPath}.formattedPrice`}
                  defaultValue={activeCar.formattedPrice}
                  className="font-tech text-xl font-bold text-white"
                />
              </div>

              <button
                onClick={() => onSelectCar(activeCar)}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-red-600 border border-white/15 hover:border-red-500 text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
                data-cursor="EXPLORE"
              >
                <EditableText
                  as="span"
                  id={`${itemPath}.inspectSpecLabel`}
                  data-preview-field-path={`${itemPath}.inspectSpecLabel`}
                  defaultValue="INSPECT SPEC"
                />
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}