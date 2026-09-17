import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface TelemetryStat {
  value?: string;
  unit?: string;
  label?: string;
  subtext?: string;
  icon?: React.ElementType;
}

export interface EditableperformanceTelemetryProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  telemetryStats: TelemetryStat[];
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableperformanceTelemetry({
  itemPath,
  telemetryStats,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  ...props
}: EditableperformanceTelemetryProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative w-full py-32 bg-[#050608] overflow-hidden select-none ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="absolute inset-0 z-0">
        <EditableImage
          id={`${itemPath}.backgroundImage`}
          data-preview-field-path={`${itemPath}.backgroundImage`}
          src="/images/cars/engine-detail.jpg"
          fallbackSrc={imageFallback}
          alt="Twin-Turbocharged Hypercar Engine Detail"
          className="object-cover object-center brightness-[0.25] contrast-[1.2] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/80 to-[#050608]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050608_90%)]" />
        <div className="absolute inset-0 cad-grid opacity-30 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono tracking-[0.25em] uppercase mb-4">
            <span
              data-preview-field-path={`${itemPath}.telemetryBenchmarkDataLabel`}
              data-preview-style-target={`${itemPath}.telemetryBenchmarkDataLabel`}
              data-preview-style-type="text">
              <EditableText
                as="span"
                id={`${itemPath}.telemetryBenchmarkDataLabel`}
                data-preview-field-path={`${itemPath}.telemetryBenchmarkDataLabel`}
                defaultValue="TELEMETRY BENCHMARK DATA"
              />
            </span>
          </div>
          <h2
            className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-none mb-6"
            data-preview-field-path={`${itemPath}.heading2`}
            data-preview-style-target={`${itemPath}.heading2`}
            data-preview-style-type="text">
            <EditableText
              as="span"
              id={`${itemPath}.heading2`}
              data-preview-field-path={`${itemPath}.heading2`}
              defaultValue="PERFORMANCE"
            />
            <br />
            <EditableText
              as="span"
              id={`${itemPath}.withoutLimitsLabel`}
              data-preview-field-path={`${itemPath}.withoutLimitsLabel`}
              defaultValue="WITHOUT LIMITS."
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400"
            />
          </h2>
          <p
            className="text-sm sm:text-base text-neutral-400 font-light max-w-xl mx-auto"
            data-preview-field-path={`${itemPath}.description2`}
            data-preview-style-target={`${itemPath}.description2`}
            data-preview-style-type="text">
            <EditableText
              as="span"
              id={`${itemPath}.description2`}
              data-preview-field-path={`${itemPath}.description2`}
              defaultValue="Every millimeter of chassis engineering, carbon fiber weave, and thermal mapping is optimized for unmatched lap times and pure mechanical euphoria."
            />
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          data-preview-list-path={`${itemPath}.telemetryStats`}
          data-preview-style-target={`${itemPath}.telemetryStats.grid`}
          data-preview-style-type="grid">
          {telemetryStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative p-7 rounded-2xl bg-[#0B0D12]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-red-500/40 transition-all duration-300 group shadow-xl"
                data-preview-item-path={`${itemPath}.telemetryStats[${index}]`}
                data-preview-style-target={`${itemPath}.telemetryStats[${index}].card`}
                data-preview-style-type="card">
                <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-white/20 group-hover:border-red-500 transition-colors" />
                <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-white/20 group-hover:border-red-500 transition-colors" />

                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase font-semibold"
                    data-preview-field-path={`${itemPath}.telemetryStats[${index}].label`}>
                    <EditableText
                      as="span"
                      id={`${itemPath}.telemetryStats[${index}].label`}
                      data-preview-field-path={`${itemPath}.telemetryStats[${index}].label`}
                      defaultValue={stat.label}
                    />
                  </span>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-red-500 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" data-preview-static="decorative-icon" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight group-hover:text-red-300 transition-colors"
                    data-preview-field-path={`${itemPath}.telemetryStats[${index}].value`}>
                    <EditableText
                      as="span"
                      id={`${itemPath}.telemetryStats[${index}].value`}
                      data-preview-field-path={`${itemPath}.telemetryStats[${index}].value`}
                      defaultValue={stat.value}
                    />
                  </span>
                  <span
                    className="font-mono text-sm sm:text-base font-bold text-red-500"
                    data-preview-field-path={`${itemPath}.telemetryStats[${index}].unit`}>
                    <EditableText
                      as="span"
                      id={`${itemPath}.telemetryStats[${index}].unit`}
                      data-preview-field-path={`${itemPath}.telemetryStats[${index}].unit`}
                      defaultValue={stat.unit}
                    />
                  </span>
                </div>

                <p
                  className="text-xs text-neutral-400 font-light leading-relaxed"
                  data-preview-field-path={`${itemPath}.telemetryStats[${index}].subtext`}>
                  <EditableText
                    as="span"
                    id={`${itemPath}.telemetryStats[${index}].subtext`}
                    data-preview-field-path={`${itemPath}.telemetryStats[${index}].subtext`}
                    defaultValue={stat.subtext}
                  />
                </p>

                <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md flex flex-wrap items-center justify-between gap-6 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-red-500">
              <Disc className="w-4 h-4" />
            </span>
            <EditableText
              as="span"
              id={`${itemPath}.brakeSystem420mmCarbonCeramic`}
              data-preview-field-path={`${itemPath}.brakeSystem420mmCarbonCeramic`}
              defaultValue="BRAKE SYSTEM: 420MM CARBON CERAMIC ROTORS WITH 10-PISTON MONOBLOC CALIPERS"
            />
          </div>
          <div className="flex items-center gap-4">
            <EditableText
              as="span"
              id={`${itemPath}.torsionalRigidity40000Nm`}
              data-preview-field-path={`${itemPath}.torsionalRigidity40000Nm`}
              defaultValue="TORSIONAL RIGIDITY: 40,000 NM/DEG"
            />
            <span className="text-neutral-700" data-preview-static="chrome">|</span>
            <EditableText
              as="span"
              id={`${itemPath}.aerodynamicCoefficient031Cd`}
              data-preview-field-path={`${itemPath}.aerodynamicCoefficient031Cd`}
              defaultValue="AERODYNAMIC COEFFICIENT: 0.31 CD"
            />
          </div>
        </div>
      </div>
    </Component>
  );
}