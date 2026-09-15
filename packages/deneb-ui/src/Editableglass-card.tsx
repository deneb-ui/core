import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableglassCardProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  glowColor?: 'cyan' | 'blue' | 'violet' | 'white';
  spotlight?: boolean;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableglassCard({
  itemPath,
  glowColor = 'cyan',
  spotlight = true,
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}: EditableglassCardProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative rounded-2xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_20px_45px_rgba(0,240,255,0.18)] overflow-clip group ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: 1,
            background: `radial-gradient(400px circle at 0px 0px, rgba(0, 240, 255, 0.25), transparent 70%)`,
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      <div className="relative z-10">
        <EditableText itemPath={`${itemPath}.text`} data-preview-field-path={`${itemPath}.text`} />
        <EditableImage itemPath={`${itemPath}.image`} data-preview-field-path={`${itemPath}.image`} />
        {children}
      </div>
    </Component>
  );
}