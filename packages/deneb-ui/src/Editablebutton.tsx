import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditablebuttonProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  label?: string;
  imageUrl?: string;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Editablebutton({
  itemPath,
  label,
  imageUrl,
  imageFallback = '/placeholder.svg',
  as: Component = 'button',
  className = '',
  style,
  children,
  ...props
}: EditablebuttonProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-button ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      {imageUrl && (
        <EditableImage
          id={`${itemPath}.imageUrl`}
          data-preview-field-path={`${itemPath}.imageUrl`}
          src={imageUrl}
          fallbackSrc={imageFallback}
          alt={label}
          className="button-image"
        />
      )}
      {label && (
        <EditableText
          as="span"
          id={`${itemPath}.label`}
          data-preview-field-path={`${itemPath}.label`}
          defaultValue={label}
          className="button-label"
        />
      )}
      {children}
    </Component>
  );
}