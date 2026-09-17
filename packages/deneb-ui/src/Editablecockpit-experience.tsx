import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  tag: string;
  description: string;
}

export interface EditableCockpitExperienceProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  hotspots: Hotspot[];
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableCockpitExperience({
  itemPath,
  hotspots,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  ...props
}: EditableCockpitExperienceProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative w-full py-28 bg-[#050608] overflow-hidden select-none ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <EditableText
              as="span"
              id={`${itemPath}.cabinArchitectureLabel`}
              data-preview-field-path={`${itemPath}.cabinArchitectureLabel`}
              defaultValue="CABIN ARCHITECTURE"
              className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase font-semibold"
            />
          </div>
          <EditableText
            as="h2"
            id={`${itemPath}.heading2`}
            data-preview-field-path={`${itemPath}.heading2`}
            defaultValue="BUILT AROUND"
            className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight"
          />
          <EditableText
            as="span"
            id={`${itemPath}.theDriverLabel`}
            data-preview-field-path={`${itemPath}.theDriverLabel`}
            defaultValue="THE DRIVER."
            className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500"
          />
          <EditableText
            as="p"
            id={`${itemPath}.description`}
            data-preview-field-path={`${itemPath}.description`}
            defaultValue="An uncompromising cockpit fusing aerospace ergonomics, tactile mechanical switchgear, and bespoke luxury materials designed to connect driver and machine as one."
            className="text-sm sm:text-base text-neutral-400 font-light mt-4"
          />
        </div>

        <div
          className="relative w-full h-[520px] sm:h-[650px] rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl"
          data-preview-list-path={`${itemPath}.hotspots`}
        >
          <EditableImage
            id={`${itemPath}.supercarCockpitInteriorImage`}
            data-preview-field-path={`${itemPath}.supercarCockpitInteriorImage`}
            src="/images/cars/cockpit-interior.jpg"
            fallbackSrc={imageFallback}
            alt="Supercar Cockpit Interior"
            className="object-cover object-center brightness-[0.88] contrast-[1.05]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/90 via-transparent to-[#050608]/40" />

          {hotspots.map((spot, index) => (
            <button
              key={spot.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              title={spot.title}
              data-preview-item-path={`${itemPath}.hotspots[${index}]`}
            >
              <div className="relative flex items-center justify-center">
                <span className={`absolute w-8 h-8 rounded-full bg-red-500/40 scale-150 animate-ping`} />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-black/60 border-white/60 text-white`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Component>
  );
}