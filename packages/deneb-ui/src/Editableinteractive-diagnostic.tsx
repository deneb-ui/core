import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

interface DiagnosticIssue {
  id: string;
  title: string;
  symptom: string;
  likelyCause: string;
  estimatedFixTime: string;
  priceRange: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  icon: any;
}

const DIAGNOSTIC_ISSUES: DiagnosticIssue[] = [
  {
    id: 'cracked-screen',
    title: 'Cracked Screen / OLED Lines',
    symptom: 'Glass fracture, vertical green lines, or unresponsive touch zone',
    likelyCause: 'OLED digitizer or front glass laminate failure',
    estimatedFixTime: '30 mins',
    priceRange: 'RS 129 - RS 279',
    urgency: 'Medium',
    icon: 'Smartphone',
  },
  {
    id: 'battery-drain',
    title: 'Battery Drains Rapidly',
    symptom: 'Drops by 20% in an hour, shuts down at 30%, or back glass feels swollen',
    likelyCause: 'Lithium-ion chemical depletion / degraded cathode cycles',
    estimatedFixTime: '20 mins',
    priceRange: 'RS 79 - RS 119',
    urgency: 'High',
    icon: 'BatteryLow',
  },
  {
    id: 'wont-charge',
    title: 'Won’t Charge / Loose Cable',
    symptom: 'Must hold cable at an angle, slow charging, or no power response',
    likelyCause: 'Debris compaction, broken pin trace, or power IC short',
    estimatedFixTime: '35 mins',
    priceRange: 'RS 69 - RS 119',
    urgency: 'Medium',
    icon: 'ZapOff',
  },
  {
    id: 'camera-blur',
    title: 'Camera Blurry / Shaking',
    symptom: 'Camera buzzes loudly, cannot focus on text, or purple flare dots',
    likelyCause: 'Optical image stabilization (OIS) actuator breakdown',
    estimatedFixTime: '45 mins',
    priceRange: 'RS 89 - RS 169',
    urgency: 'Low',
    icon: 'CameraOff',
  },
  {
    id: 'liquid-damage',
    title: 'Water or Liquid Ingress',
    symptom: 'Dropped in water, condensation in camera lens, or speaker distortion',
    likelyCause: 'Capillary fluid ingress causing rapid electrolytic oxidation',
    estimatedFixTime: '2 hours',
    priceRange: 'RS 119 - RS 199',
    urgency: 'Critical',
    icon: 'Droplet',
  },
  {
    id: 'overheating',
    title: 'Device Overheating',
    symptom: 'Gets unusually hot during idle state or camera shuts down automatically',
    likelyCause: 'CPU thermal paste degradation or shorted power amplifier capacitor',
    estimatedFixTime: '45 mins',
    priceRange: 'RS 79 - RS 149',
    urgency: 'High',
    icon: 'Flame',
  },
];

export interface EditableInteractiveDiagnosticProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableInteractiveDiagnostic({
  itemPath,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  ...props
}: EditableInteractiveDiagnosticProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative py-24 sm:py-32 overflow-clip bg-white border-t border-black/[0.06] ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-cyan-400/10 blur-[140px]" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span
              data-preview-field-path={`${itemPath}.interactiveSelfDiagnosticLabel`}
              data-preview-style-target={`${itemPath}.interactiveSelfDiagnosticLabel`}
              data-preview-style-type="text">
              <EditableText
                as="span"
                id={`${itemPath}.interactiveSelfDiagnosticLabel`}
                data-preview-field-path={`${itemPath}.interactiveSelfDiagnosticLabel`}
                defaultValue="Interactive Self-Diagnostic"
              />
            </span>
          </div>
          <EditableText
            as="h2"
            id={`${itemPath}.heading5`}
            data-preview-field-path={`${itemPath}.heading5`}
            defaultValue="Not Sure What’s Wrong?"
            className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight"
          />
          <EditableText
            as="p"
            id={`${itemPath}.description5`}
            data-preview-field-path={`${itemPath}.description5`}
            defaultValue="Select your symptom below. Our interactive diagnostic system instantly estimates the root cause, turnaround time, and repair quote."
            className="mt-3 text-sm sm:text-base text-zinc-600"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {DIAGNOSTIC_ISSUES.map((issue) => {
              const isSelected = false; // Placeholder for selection logic
              return (
                <button
                  key={issue.id}
                  type="button"
                  data-preview-static="diagnostic symptom option button"
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 backdrop-blur-xl flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/90 shadow-[0_0_25px_rgba(0,240,255,0.25)] scale-[1.02]'
                      : 'border-black/[0.08] bg-white hover:border-cyan-400/50 hover:bg-cyan-50/30 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isSelected ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-md' : 'bg-slate-100 text-zinc-600 border border-black/[0.06]'}`}>
                      <span className={`h-5 w-5`}>{issue.icon}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${issue.urgency === 'Critical' ? 'text-red-600 border-red-500/30 bg-red-50' : issue.urgency === 'High' ? 'text-amber-600 border-amber-500/30 bg-amber-50' : 'text-zinc-600 border-black/[0.08] bg-slate-50'}`}>
                      {issue.urgency} Priority
                    </span>
                  </div>
                  <div className="mt-4">
                    <EditableText
                      as="h4"
                      id={`${itemPath}.${issue.id}.title`}
                      data-preview-field-path={`${itemPath}.${issue.id}.title`}
                      defaultValue={issue.title}
                      className="text-sm font-bold text-zinc-950 tracking-tight"
                    />
                    <EditableText
                      as="p"
                      id={`${itemPath}.${issue.id}.symptom`}
                      data-preview-field-path={`${itemPath}.${issue.id}.symptom`}
                      defaultValue={issue.symptom}
                      className="mt-1 text-xs text-zinc-600 line-clamp-2 leading-relaxed"
                    />
                  </div>
                </button>
              );
            })}
          </div>
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl border border-black/[0.08] bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600">
                <span className="h-4 w-4" />
                <EditableText
                  as="span"
                  id={`${itemPath}.diagnosticAssessmentLabel`}
                  data-preview-field-path={`${itemPath}.diagnosticAssessmentLabel`}
                  defaultValue="Diagnostic Assessment"
                />
              </div>
              <EditableText
                as="h3"
                id={`${itemPath}.activeIssue.title`}
                data-preview-static="active diagnostic title"
                defaultValue="Active Diagnostic Title"
                className="mt-2 text-2xl font-bold text-zinc-950 tracking-tight"
              />
              <div className="mt-6 space-y-4 text-xs sm:text-sm">
                <div className="rounded-2xl border border-black/[0.06] bg-slate-50 p-4">
                  <EditableText
                    as="span"
                    id={`${itemPath}.laboratoryRootCauseLabel`}
                    data-preview-field-path={`${itemPath}.laboratoryRootCauseLabel`}
                    defaultValue="Laboratory Root Cause:"
                    className="text-zinc-500 text-xs block mb-1 font-medium"
                  />
                  <EditableText
                    as="p"
                    id={`${itemPath}.activeIssue.likelyCause`}
                    data-preview-static="active diagnostic root cause"
                    defaultValue="Active Diagnostic Likely Cause"
                    className="text-zinc-800 font-medium leading-relaxed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-black/[0.06] bg-slate-50 p-4">
                    <EditableText
                      as="span"
                      id={`${itemPath}.turnaroundTimeLabel`}
                      data-preview-field-path={`${itemPath}.turnaroundTimeLabel`}
                      defaultValue="Turnaround Time"
                      className="text-[11px] text-zinc-500 block mb-1 font-medium"
                    />
                    <div className="flex items-center gap-1.5 text-zinc-950 font-bold text-base">
                      <span className="h-4 w-4 text-cyan-600" />
                      <EditableText
                        as="span"
                        id={`${itemPath}.activeIssue.estimatedFixTime`}
                        data-preview-static="active diagnostic fix time"
                        defaultValue="Active Diagnostic Estimated Fix Time"
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-black/[0.06] bg-slate-50 p-4">
                    <EditableText
                      as="span"
                      id={`${itemPath}.estRepairRangeLabel`}
                      data-preview-field-path={`${itemPath}.estRepairRangeLabel`}
                      defaultValue="Est. Repair Range"
                      className="text-[11px] text-zinc-500 block mb-1 font-medium"
                    />
                    <EditableText
                      as="span"
                      id={`${itemPath}.activeIssue.priceRange`}
                      data-preview-static="active diagnostic price range"
                      defaultValue="Active Diagnostic Price Range"
                      className="text-base font-extrabold text-cyan-600 font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-2xl bg-cyan-50 p-4 border border-cyan-500/30 text-xs text-cyan-900">
                  <span className="h-4 w-4 shrink-0 text-cyan-600 mt-0.5" />
                  <EditableText
                    as="span"
                    id={`${itemPath}.includesComplimentaryInteriorUltrasonicCleaning`}
                    data-preview-field-path={`${itemPath}.includesComplimentaryInteriorUltrasonicCleaning`}
                    defaultValue="Includes complimentary interior ultrasonic cleaning and new high-adhesion liquid seals."
                  />
                </div>
              </div>
              <div className="mt-8">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <EditableText
                    as="span"
                    id={`${itemPath}.scheduleFixIssueLabel`}
                    data-preview-field-path={`${itemPath}.scheduleFixIssueLabel`}
                    defaultValue="Schedule Fix for This Issue"
                  />
                  <span className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}