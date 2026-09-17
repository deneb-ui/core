import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface InteractiveStudio360Props extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: {
    angles: { id: string; label: string; image: string }[];
    finishes: { name: string; color: string; filter: string }[];
    activeFinish: string;
    studioLight: 'white' | 'amber' | 'cyan';
    siteData: {
      content: {
        home: {
          item360DigitalSpecificationSuiteLabel?: string;
          heading6?: string;
          everyAngleLabel?: string;
          description4?: string;
          dragOrbitAngleLabel?: string;
          paintLabel?: string;
          studioLightLabel?: string;
        };
      };
    };
  };
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export function EditableInteractiveStudio360({
  itemPath,
  data,
  className = '',
  style,
  as: Component = 'section',
  ...props
}: InteractiveStudio360Props) {
  const { angles, finishes, activeFinish, studioLight, siteData } = data;

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative w-full py-28 bg-[#050608] overflow-hidden select-none ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase font-semibold">
                <EditableText
                  as="span"
                  id={`${itemPath}.item360DigitalSpecificationSuiteLabel`}
                  data-preview-field-path={`${itemPath}.item360DigitalSpecificationSuiteLabel`}
                  defaultValue={siteData?.content?.home?.item360DigitalSpecificationSuiteLabel ?? "360° DIGITAL SPECIFICATION SUITE"}
                />
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
              <EditableText
                as="span"
                id={`${itemPath}.heading6`}
                data-preview-field-path={`${itemPath}.heading6`}
                defaultValue={siteData?.content?.home?.heading6 ?? "EXPLORE"}
              />
              <br />
              <EditableText
                as="span"
                id={`${itemPath}.everyAngleLabel`}
                data-preview-field-path={`${itemPath}.everyAngleLabel`}
                defaultValue={siteData?.content?.home?.everyAngleLabel ?? "EVERY ANGLE."}
                className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400"
              />
            </h2>
          </div>
          <EditableText
            as="p"
            id={`${itemPath}.description4`}
            data-preview-field-path={`${itemPath}.description4`}
            defaultValue={siteData?.content?.home?.description4 ?? "DRAG HORIZONTALLY ACROSS THE STAGE TO ROTATE CHASSIS. INTERACT WITH BESPOKE STUDIO LIGHTING PRESETS."}
            className="text-xs sm:text-sm font-mono text-neutral-400 max-w-sm mt-4 md:mt-0"
          />
        </div>
        <div className="relative w-full h-[520px] sm:h-[600px] rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex items-center justify-center cursor-ew-resize">
          <div className={`absolute top-0 inset-x-0 h-48 transition-colors duration-700 pointer-events-none ${studioLight === 'white' ? 'bg-gradient-to-b from-white/15 via-white/5 to-transparent' : studioLight === 'amber' ? 'bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent' : 'bg-gradient-to-b from-cyan-500/20 via-cyan-500/5 to-transparent'}`} />
          <div className="absolute bottom-10 w-[70%] h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={angles[0].id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full"
            >
              <EditableImage
                id={`${itemPath}.currentViewImage`}
                data-preview-field-path={`${itemPath}.currentViewImage`}
                src={angles[0].image}
                fallbackSrc="/placeholder.svg"
                alt={angles[0].label}
                className="object-cover sm:object-contain object-center transition-all duration-500"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-mono text-white">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <EditableText
              as="span"
              id={`${itemPath}.currentViewLabel`}
              data-preview-field-path={`${itemPath}.currentViewLabel`}
              defaultValue={angles[0].label}
              className="uppercase"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-neutral-400 flex items-center gap-2 pointer-events-none">
            <RotateCw className="w-3.5 h-3.5 text-neutral-300" />
            <EditableText
              as="span"
              id={`${itemPath}.dragOrbitAngleLabel`}
              data-preview-field-path={`${itemPath}.dragOrbitAngleLabel`}
              defaultValue={siteData?.content?.home?.dragOrbitAngleLabel ?? "DRAG TO ORBIT ANGLE"}
            />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0B0D12]/80 backdrop-blur-xl border border-white/10 flex items-center justify-between gap-1 overflow-x-auto">
            {angles.map((ang, idx) => (
              <button
                key={ang.id}
                onClick={() => {}}
                className={`px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${angles[0].id === ang.id ? 'bg-red-600 text-white font-bold shadow-[0_0_12px_rgba(225,29,72,0.4)]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
              >
                {ang.label.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-[#0B0D12]/80 backdrop-blur-xl border border-white/10 flex items-center justify-between px-6">
            <EditableText
              as="span"
              id={`${itemPath}.paintLabel`}
              data-preview-field-path={`${itemPath}.paintLabel`}
              defaultValue={siteData?.content?.home?.paintLabel ?? "PAINT:"}
              className="text-xs font-mono text-neutral-400 uppercase"
            />
            <strong className="text-white ml-1">{activeFinish}</strong>
            <div className="flex items-center gap-2" data-preview-style-target="home.finishes.grid" data-preview-style-type="grid">
              {finishes.map((f) => (
                <button
                  key={f.name}
                  onClick={() => {}}
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${activeFinish === f.name ? 'ring-2 ring-red-500 scale-110 border-white' : 'border-white/30 hover:scale-105'}`}
                  style={{ backgroundColor: f.color }}
                  title={f.name}
                  data-preview-style-target="home.finishes[*].card"
                  data-preview-style-type="card"
                />
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0B0D12]/80 backdrop-blur-xl border border-white/10 flex items-center justify-between px-6">
            <EditableText
              as="span"
              id={`${itemPath}.studioLightLabel`}
              data-preview-field-path={`${itemPath}.studioLightLabel`}
              defaultValue={siteData?.content?.home?.studioLightLabel ?? "STUDIO LIGHT"}
              className="text-xs font-mono text-neutral-400 uppercase"
            />
            <div className="flex items-center gap-2">
              {(['white', 'amber', 'cyan'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {}}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${studioLight === mode ? 'bg-white/20 text-white font-bold border border-white/30' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}