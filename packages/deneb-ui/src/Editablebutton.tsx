import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditablebuttonProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: {
    label?: string;
    iconUrl?: string;
    fallbackIcon?: string;
  };
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Editablebutton({
  itemPath,
  data,
  as: Component = 'button',
  className = '',
  style,
  children,
  ...props
}: EditablebuttonProps) {
  const label = String(data?.label || '');
  const iconUrl = String(data?.iconUrl || '');
  const fallbackIcon = String(data?.fallbackIcon || '');

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-button ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      {iconUrl && (
        <EditableImage
          id={`${itemPath}.iconUrl`}
          data-preview-field-path={`${itemPath}.iconUrl`}
          src={iconUrl}
          fallbackSrc={fallbackIcon}
          alt={label}
          className="button-icon"
        />
      )}
      <EditableText
        as="span"
        id={`${itemPath}.label`}
        data-preview-field-path={`${itemPath}.label`}
        defaultValue={label}
        className="button-label"
      />
      {children}
    </Component>
  );
}