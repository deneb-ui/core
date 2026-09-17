import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableloadingScreenProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: {
    apexLabel?: string;
    ignitingPerformanceLabel?: string;
    calibratingV12ChassisLabel?: string;
  };
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableloadingScreen({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}: EditableloadingScreenProps) {
  const apexLabel = String(data?.apexLabel || "APEX");
  const ignitingPerformanceLabel = String(data?.ignitingPerformanceLabel || "IGNITING PERFORMANCE");
  const calibratingV12ChassisLabel = String(data?.calibratingV12ChassisLabel || "CALIBRATING V12 CHASSIS");

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-loading-screen ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.5)]">
            <span className="font-display font-black text-lg text-white tracking-tighter" data-preview-static="decorative-copy">A</span>
          </div>
          <EditableText
            as="span"
            id={`${itemPath}.apexLabel`}
            data-preview-field-path={`${itemPath}.apexLabel`}
            defaultValue={apexLabel}
            className="font-display font-extrabold text-xl tracking-[0.25em] text-white"
          />
          <span className="text-red-500" data-preview-static="chrome">.</span>
        </div>

        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400 font-mono mb-6">
          <span className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <EditableText
            as="span"
            id={`${itemPath}.ignitingPerformanceLabel`}
            data-preview-field-path={`${itemPath}.ignitingPerformanceLabel`}
            defaultValue={ignitingPerformanceLabel}
          />
        </div>

        <div className="w-full bg-white/10 h-[2px] rounded-full overflow-hidden relative mb-3">
          <div className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-400" style={{ width: '0%' }} />
        </div>

        <div className="w-full flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <EditableText
            as="span"
            id={`${itemPath}.calibratingV12ChassisLabel`}
            data-preview-field-path={`${itemPath}.calibratingV12ChassisLabel`}
            defaultValue={calibratingV12ChassisLabel}
          />
          <span className="text-neutral-300 font-semibold" data-preview-static="decorative-copy">0%</span>
        </div>
      </div>
      {children}
    </Component>
  );
}