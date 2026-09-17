import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface FeaturedCinematicProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  onDiscover: (car: CarSpec) => void;
  imageFallback?: string;
  as?: React.ElementType;
}

export function EditableFeaturedCinematic({
  itemPath,
  onDiscover,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: FeaturedCinematicProps) {
  const siteData = {}; // Placeholder for site data
  const porsche = {}; // Placeholder for car data

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative w-full min-h-screen py-24 bg-[#050608] flex items-center overflow-hidden select-none ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="absolute inset-0 z-0">
        <EditableImage
          id={`${itemPath}.imageUrl`}
          data-preview-field-path={`${itemPath}.imageUrl`}
          src={siteData?.content?.home?.featuredProducts?.porsche911Gt3RsAlpine ?? "/images/cars/porsche-gt3rs-mountain.jpg"}
          fallbackSrc={imageFallback}
          alt={siteData?.content?.home?.featuredProducts?.imageAlt ?? "Porsche 911 GT3 RS on Alpine Pass"}
          className="object-cover object-center brightness-[0.75] contrast-[1.1] scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-[#050608]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/85 via-[#050608]/30 to-transparent" />
      </div>

      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <EditableText
          as="span"
          id={`${itemPath}.gt3RsLabel`}
          data-preview-field-path={`${itemPath}.gt3RsLabel`}
          defaultValue={siteData?.content?.home?.featuredProducts?.gt3RsLabel ?? "GT3 RS"}
          className="font-display font-black text-[22vw] leading-none tracking-tighter text-white/[0.04] uppercase select-none"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <EditableText
              as="span"
              id={`${itemPath}.theTrackBenchmarkLabel`}
              data-preview-field-path={`${itemPath}.theTrackBenchmarkLabel`}
              defaultValue={siteData?.content?.home?.featuredProducts?.theTrackBenchmarkLabel ?? "THE TRACK BENCHMARK"}
              className="text-xs font-mono tracking-[0.35em] text-red-400 uppercase font-bold"
            />
          </div>

          <EditableText
            as="h2"
            id={`${itemPath}.heading`}
            data-preview-field-path={`${itemPath}.heading`}
            defaultValue={siteData?.content?.home?.featuredProducts?.heading ?? "THE 911"}
            className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white uppercase tracking-tight leading-[0.92] mb-6"
          />
          <EditableText
            as="p"
            id={`${itemPath}.description`}
            data-preview-field-path={`${itemPath}.description`}
            defaultValue={siteData?.content?.home?.featuredProducts?.description ?? "Engineered with a single central radiator concept borrowed directly from the Le Mans-winning 911 RSR. Continuously adjustable aerodynamics deliver up to 860 kg of downforce at track speeds."}
            className="text-sm sm:text-base text-neutral-300 font-light max-w-lg mb-10 leading-relaxed"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            <div className="p-4 rounded-xl glass-panel border border-white/10">
              <EditableText
                as="span"
                id={`${itemPath}.aerodynamicsLabel`}
                data-preview-field-path={`${itemPath}.aerodynamicsLabel`}
                defaultValue={siteData?.content?.home?.featuredProducts?.aerodynamicsLabel ?? "AERODYNAMICS"}
                className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase block mb-1"
              />
              <EditableText
                as="span"
                id={`${itemPath}.activeDrsLabel`}
                data-preview-field-path={`${itemPath}.activeDrsLabel`}
                defaultValue={siteData?.content?.home?.featuredProducts?.activeDrsLabel ?? "ACTIVE DRS"}
                className="font-display font-bold text-lg text-white"
              />
              <EditableText
                as="span"
                id={`${itemPath}.item860KgDownforceLabel`}
                data-preview-field-path={`${itemPath}.item860KgDownforceLabel`}
                defaultValue={siteData?.content?.home?.featuredProducts?.item860KgDownforceLabel ?? "860 KG DOWNFORCE"}
                className="text-[11px] font-mono text-red-400 block mt-0.5"
              />
            </div>

            <div className="p-4 rounded-xl glass-panel border border-white/10">
              <EditableText
                as="span"
                id={`${itemPath}.powertrainLabel`}
                data-preview-field-path={`${itemPath}.powertrainLabel`}
                defaultValue={siteData?.content?.home?.featuredProducts?.powertrainLabel ?? "POWERTRAIN"}
                className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase block mb-1"
              />
              <EditableText
                as="span"
                id={`${itemPath}.item518HpLabel`}
                data-preview-field-path={`${itemPath}.item518HpLabel`}
                defaultValue={siteData?.content?.home?.featuredProducts?.item518HpLabel ?? "518 HP"}
                className="font-display font-bold text-lg text-white"
              />
              <EditableText
                as="span"
                id={`${itemPath}.item40lFlatSixLabel`}
                data-preview-field-path={`${itemPath}.item40lFlatSixLabel`}
                defaultValue={siteData?.content?.home?.featuredProducts?.item40lFlatSixLabel ?? "4.0L FLAT-SIX"}
                className="text-[11px] font-mono text-neutral-400 block mt-0.5"
              />
            </div>

            <div className="p-4 rounded-xl glass-panel border border-white/10 col-span-2 sm:col-span-1">
              <EditableText
                as="span"
                id={`${itemPath}.redlineLabel`}
                data-preview-field-path={`${itemPath}.redlineLabel`}
                defaultValue={siteData?.content?.home?.featuredProducts?.redlineLabel ?? "REDLINE"}
                className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase block mb-1"
              />
              <EditableText
                as="span"
                id={`${itemPath}.item9000RpmLabel`}
                data-preview-field-path={`${itemPath}.item9000RpmLabel`}
                defaultValue={siteData?.content?.home?.featuredProducts?.item9000RpmLabel ?? "9,000 RPM"}
                className="font-display font-bold text-lg text-white"
              />
              <EditableText
                as="span"
                id={`${itemPath}.atmosphericSoundLabel`}
                data-preview-field-path={`${itemPath}.atmosphericSoundLabel`}
                defaultValue={siteData?.content?.home?.featuredProducts?.atmosphericSoundLabel ?? "ATMOSPHERIC SOUND"}
                className="text-[11px] font-mono text-neutral-400 block mt-0.5"
              />
            </div>
          </div>

          <button
            onClick={() => onDiscover(porsche)}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:shadow-[0_0_50px_rgba(225,29,72,0.7)] transition-all flex items-center gap-3 cursor-pointer"
            data-cursor="DISCOVER"
          >
            <EditableText
              as="span"
              id={`${itemPath}.discoverMachineLabel`}
              data-preview-field-path={`${itemPath}.discoverMachineLabel`}
              defaultValue={siteData?.content?.home?.featuredProducts?.discoverMachineLabel ?? "DISCOVER THE MACHINE"}
            />
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
          </button>
        </div>
      </div>
    </Component>
  );
}