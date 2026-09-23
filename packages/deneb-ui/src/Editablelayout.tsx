import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditablelayoutProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    imageFallback?: string;
  };
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Editablelayout({
  itemPath,
  data,
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}: EditablelayoutProps) {
  const title = String(data.title || '');
  const description = String(data.description || '');
  const imageUrl = String(data.imageUrl || '');
  const imageFallback = String(data.imageFallback || '/placeholder.svg');

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-layout ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      {imageUrl && (
        <EditableImage
          id={`${itemPath}.imageUrl`}
          data-preview-field-path={`${itemPath}.imageUrl`}
          src={imageUrl}
          fallbackSrc={imageFallback}
          alt={title}
          className="layout-image"
        />
      )}
      <EditableText
        as="h1"
        id={`${itemPath}.title`}
        data-preview-field-path={`${itemPath}.title`}
        defaultValue={title}
        className="layout-title"
      />
      <EditableText
        as="p"
        id={`${itemPath}.description`}
        data-preview-field-path={`${itemPath}.description`}
        defaultValue={description}
        className="layout-description"
      />
      {children}
    </Component>
  );
}