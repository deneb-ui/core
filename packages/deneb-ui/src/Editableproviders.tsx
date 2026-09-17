import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableprovidersProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: Record<string, unknown>;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Editableproviders({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}: EditableprovidersProps) {
  const name = String(data?.name || '');
  const description = String(data?.description || '');
  const imageUrl = String(data?.imageUrl || data?.image || '');

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-providers ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      {imageUrl && (
        <EditableImage
          id={`${itemPath}.imageUrl`}
          data-preview-field-path={`${itemPath}.imageUrl`}
          src={imageUrl}
          fallbackSrc={imageFallback}
          alt={name}
          className="providers-image"
        />
      )}
      <EditableText
        as="h2"
        id={`${itemPath}.name`}
        data-preview-field-path={`${itemPath}.name`}
        defaultValue={name}
        className="providers-title"
      />
      <EditableText
        as="p"
        id={`${itemPath}.description`}
        data-preview-field-path={`${itemPath}.description`}
        defaultValue={description}
        className="providers-description"
      />
      {children}
    </Component>
  );
}