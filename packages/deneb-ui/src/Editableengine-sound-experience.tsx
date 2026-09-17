import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EngineProfile {
  name?: string;
  description?: string;
  [key: string]: unknown;
}

export interface EditableengineSoundExperienceProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  siteData: {
    content: {
      home: {
        exhaustAcousticChamberImage?: string;
        imageAlt2?: string;
        acousticHarmonicsLabel?: string;
        heading3?: string;
        performanceLabel?: string;
        description2?: string;
        powertrainLabel?: string;
        tachometerTelemetryLabel?: string;
        rpmLabel?: string;
        cutIgnitionLabel?: string;
        startEngineLabel?: string;
        revThrottleBlipLabel?: string;
      };
    };
  };
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableengineSoundExperience({
  itemPath,
  siteData,
  as: Component = 'section',
  className = '',
  style,
  ...props
}: EditableengineSoundExperienceProps) {
  const engineProfiles: Record<string, EngineProfile> = {
    v12: {
      name: '6.5L Naturally Aspirated V12',
      description: 'Screaming 12-cylinder acoustic crescendo tuned to resonant Le Mans harmonics.',
    },
    flat6: {
      name: '4.0L Atmospheric Flat-Six',
      description: 'Razor-sharp motorsport intake pulse with titanium center exhaust crackle.',
    },
    v8: {
      name: '4.0L Twin-Turbo Flat-Plane V8',
      description: 'Deep staccato flat-plane crank firing order with supersonic wastegate flutter.',
    },
  };

  const currentProfile = engineProfiles['v12'];

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative w-full py-28 bg-[#050608] overflow-hidden select-none ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="absolute inset-0 z-0 opacity-25">
        <EditableImage
          id={`${itemPath}.exhaustAcousticChamberImage`}
          data-preview-field-path={`${itemPath}.exhaustAcousticChamberImage`}
          src={siteData?.content?.home?.exhaustAcousticChamberImage ?? "/images/cars/engine-detail.jpg"}
          fallbackSrc="/placeholder.svg"
          alt={siteData?.content?.home?.imageAlt2 ?? "Exhaust Acoustic Chamber"}
          className="object-cover object-center brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/90 to-[#050608]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase font-semibold"
                  data-preview-field-path={`${itemPath}.acousticHarmonicsLabel`}
                  data-preview-style-target={`${itemPath}.acousticHarmonicsLabel`}
                  data-preview-style-type="text">
                  <EditableText
                    as="span"
                    id={`${itemPath}.acousticHarmonicsLabel`}
                    data-preview-field-path={`${itemPath}.acousticHarmonicsLabel`}
                    defaultValue={siteData?.content?.home?.acousticHarmonicsLabel ?? "ACOUSTIC HARMONICS"}
                  />
                </span>
              </div>

              <h2
                className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-tight mb-4"
                data-preview-field-path={`${itemPath}.heading3`}
                data-preview-style-target={`${itemPath}.heading3`}
                data-preview-style-type="text">
                <EditableText
                  as="span"
                  id={`${itemPath}.heading3`}
                  data-preview-field-path={`${itemPath}.heading3`}
                  defaultValue={siteData?.content?.home?.heading3 ?? "HEAR THE"}
                /><br />
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400"
                  data-preview-field-path={`${itemPath}.performanceLabel`}
                  data-preview-style-target={`${itemPath}.performanceLabel`}
                  data-preview-style-type="text">
                  <EditableText
                    as="span"
                    id={`${itemPath}.performanceLabel`}
                    data-preview-field-path={`${itemPath}.performanceLabel`}
                    defaultValue={siteData?.content?.home?.performanceLabel ?? "PERFORMANCE."}
                  />
                </span>
              </h2>

              <p
                className="text-sm text-neutral-300 font-light leading-relaxed mb-6"
                data-preview-field-path={`${itemPath}.description2`}
                data-preview-style-target={`${itemPath}.description2`}
                data-preview-style-type="text">
                <EditableText
                  as="span"
                  id={`${itemPath}.description2`}
                  data-preview-field-path={`${itemPath}.description2`}
                  defaultValue={siteData?.content?.home?.description2 ?? "Automotive emotion is sculpted in titanium exhaust acoustics and high-rev harmonic overtones. Test our real-time interactive engine synthesizer below."}
                />
              </p>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-6">
                <span className="text-xs font-display font-bold text-white uppercase block mb-1">
                  <EditableText
                    as="span"
                    id={`${itemPath}.currentProfileName`}
                    data-preview-field-path={`${itemPath}.currentProfileName`}
                    defaultValue={currentProfile.name}
                  />
                </span>
                <span className="text-xs font-mono text-neutral-400 block">
                  <EditableText
                    as="span"
                    id={`${itemPath}.currentProfileDescription`}
                    data-preview-field-path={`${itemPath}.currentProfileDescription`}
                    defaultValue={currentProfile.description}
                  />
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
              <div className="w-full flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase"
                    data-preview-field-path={`${itemPath}.tachometerTelemetryLabel`}
                    data-preview-style-target={`${itemPath}.tachometerTelemetryLabel`}
                    data-preview-style-type="text">
                    <EditableText
                      as="span"
                      id={`${itemPath}.tachometerTelemetryLabel`}
                      data-preview-field-path={`${itemPath}.tachometerTelemetryLabel`}
                      defaultValue={siteData?.content?.home?.tachometerTelemetryLabel ?? "TACHOMETER TELEMETRY"}
                    />
                  </span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-white font-bold text-lg">1200</span>
                  <span
                    className="text-neutral-500 text-xs ml-1"
                    data-preview-field-path={`${itemPath}.rpmLabel`}
                    data-preview-style-target={`${itemPath}.rpmLabel`}
                    data-preview-style-type="text">
                    <EditableText
                      as="span"
                      id={`${itemPath}.rpmLabel`}
                      data-preview-field-path={`${itemPath}.rpmLabel`}
                      defaultValue={siteData?.content?.home?.rpmLabel ?? "RPM"}
                    />
                  </span>
                </div>
              </div>

              <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                <button
                  className={`w-full sm:w-1/2 py-3.5 rounded-xl font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer bg-red-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]`}
                  data-cursor="PLAY">
                  <span
                    data-preview-field-path={`${itemPath}.startEngineLabel`}
                    data-preview-style-target={`${itemPath}.startEngineLabel`}
                    data-preview-style-type="text">
                    <EditableText
                      as="span"
                      id={`${itemPath}.startEngineLabel`}
                      data-preview-field-path={`${itemPath}.startEngineLabel`}
                      defaultValue={siteData?.content?.home?.startEngineLabel ?? "START ENGINE"}
                    />
                  </span>
                </button>

                <button
                  className="w-full sm:w-1/2 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-red-500/40 text-white font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                  data-cursor="REV">
                  <span
                    data-preview-field-path={`${itemPath}.revThrottleBlipLabel`}
                    data-preview-style-target={`${itemPath}.revThrottleBlipLabel`}
                    data-preview-style-type="text">
                    <EditableText
                      as="span"
                      id={`${itemPath}.revThrottleBlipLabel`}
                      data-preview-field-path={`${itemPath}.revThrottleBlipLabel`}
                      defaultValue={siteData?.content?.home?.revThrottleBlipLabel ?? "REV THROTTLE (BLIP)"}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}