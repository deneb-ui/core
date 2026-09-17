import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface CarSpec {
  id: string;
  name: string;
  brand: string;
  year: number;
  image: string;
  horsepower: number;
  acceleration: number;
  topSpeed: number;
  formattedPrice: string;
}

export interface EditableCuratedPerformanceProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  featuredCars: CarSpec[];
  imageFallback?: string;
  as?: React.ElementType;
  compareList: string[];
  onSelectCar: (car: CarSpec) => void;
  onToggleCompare: (carId: string) => void;
}

export function EditableCuratedPerformance({
  itemPath,
  featuredCars,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  compareList,
  onSelectCar,
  onToggleCompare,
  className = '',
  style,
  ...props
}: EditableCuratedPerformanceProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative w-full py-28 bg-[#050608] select-none ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/[0.08]">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <EditableText
                as="span"
                id={`${itemPath}.theShowroomPortfolioLabel`}
                data-preview-field-path={`${itemPath}.theShowroomPortfolioLabel`}
                defaultValue="THE SHOWROOM PORTFOLIO"
                className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase font-semibold"
              />
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight">
              <EditableText
                as="span"
                id={`${itemPath}.heading`}
                data-preview-field-path={`${itemPath}.heading`}
                defaultValue="CURATED"
                className=""
              />
              <br />
              <EditableText
                as="span"
                id={`${itemPath}.performanceLabel`}
                data-preview-field-path={`${itemPath}.performanceLabel`}
                defaultValue="PERFORMANCE."
                className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400"
              />
            </h2>
          </div>

          <EditableText
            as="p"
            id={`${itemPath}.description`}
            data-preview-field-path={`${itemPath}.description`}
            defaultValue="A handpicked collection of extraordinary machines created for drivers who demand more. Each vehicle is authenticated, track-inspected, and bespoke-commissioned."
            className="text-sm sm:text-base text-neutral-400 max-w-md font-light mt-4 md:mt-0 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featuredCars.map((car, index) => {
            const isCompared = compareList.includes(car.id);

            return (
              <div
                key={car.id}
                className="group relative rounded-2xl overflow-hidden glass-card border border-white/[0.08] hover:border-red-500/40 transition-all duration-500 flex flex-col justify-between h-[520px] cursor-pointer"
                onClick={() => onSelectCar(car)}
                data-cursor="VIEW"
              >
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="w-full h-full relative">
                    <EditableImage
                      id={`${itemPath}.cars.${index}.image`}
                      data-preview-field-path={`${itemPath}.cars.${index}.image`}
                      src={car.image}
                      fallbackSrc={imageFallback}
                      alt={car.name}
                      className="object-cover object-center brightness-[0.88] contrast-[1.05]"
                    />
                  </div>
                </div>

                <div className="relative z-10 p-6 flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-red-400 uppercase font-bold" data-preview-static="chrome">
                      {car.brand} · {car.year}
                    </span>
                    <h3 className="font-display font-extrabold text-2xl text-white tracking-tight mt-0.5 group-hover:text-red-300 transition-colors">
                      <EditableText
                        as="span"
                        id={`${itemPath}.cars.${index}.name`}
                        data-preview-field-path={`${itemPath}.cars.${index}.name`}
                        defaultValue={car.name}
                      />
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompare(car.id);
                    }}
                    className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                      isCompared
                        ? 'bg-red-600 border-red-500 text-white'
                        : 'bg-black/40 border-white/15 text-neutral-300 hover:text-white hover:bg-black/60'
                    }`}
                    title={isCompared ? 'Remove from compare' : 'Add to compare'}
                    data-cursor="COMPARE"
                  >
                    {isCompared ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="relative z-10 p-6 mt-auto">
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/50 backdrop-blur-xl border border-white/[0.08] mb-4">
                    <div className="flex flex-col">
                      <EditableText
                        as="span"
                        id={`${itemPath}.cars.${index}.powerLabel`}
                        data-preview-field-path={`${itemPath}.cars.${index}.powerLabel`}
                        defaultValue="POWER"
                        className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase"
                      />
                      <span className="font-tech text-base font-bold text-white">
                        {car.horsepower} <span className="text-[10px] text-red-400 font-normal" data-preview-static="decorative-copy">HP</span>
                      </span>
                    </div>

                    <div className="flex flex-col border-x border-white/10 px-2">
                      <EditableText
                        as="span"
                        id={`${itemPath}.cars.${index}.secLabel`}
                        data-preview-field-path={`${itemPath}.cars.${index}.secLabel`}
                        defaultValue="0-100"
                        className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase"
                      />
                      <span className="font-tech text-base font-bold text-white">
                        {car.acceleration} <span className="text-[10px] text-red-400 font-normal">{siteData?.content?.home?.form?.secLabel ?? "SEC"}</span>
                      </span>
                    </div>

                    <div className="flex flex-col pl-1">
                      <EditableText
                        as="span"
                        id={`${itemPath}.cars.${index}.speedLabel`}
                        data-preview-field-path={`${itemPath}.cars.${index}.speedLabel`}
                        defaultValue="SPEED"
                        className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase"
                      />
                      <span className="font-tech text-base font-bold text-white">
                        {car.topSpeed} <span className="text-[10px] text-red-400 font-normal">{siteData?.content?.home?.form?.kmHLabel ?? "KM/H"}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                      <EditableText
                        as="span"
                        id={`${itemPath}.cars.${index}.acquisitionLabel`}
                        data-preview-field-path={`${itemPath}.cars.${index}.acquisitionLabel`}
                        defaultValue="ACQUISITION"
                        className="text-[9px] font-mono tracking-[0.2em] text-neutral-500 uppercase"
                      />
                      <span className="font-tech text-xl font-bold text-white">
                        {car.formattedPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-white group-hover:text-red-400 transition-colors">
                      <EditableText
                        as="span"
                        id={`${itemPath}.cars.${index}.viewMachineLabel`}
                        data-preview-field-path={`${itemPath}.cars.${index}.viewMachineLabel`}
                        defaultValue="VIEW MACHINE"
                      />
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Component>
  );
}