import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditablepageProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    [key: string]: unknown;
  };
  imageFallback?: string;
  as?: React.ElementType;
}

export function Editablepage({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'main',
  className = '',
  style,
  ...props
}: EditablepageProps) {
  const title = String(data?.title || '');
  const description = String(data?.description || '');
  const imageUrl = String(data?.imageUrl || '');

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-page ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <EditableText
        as="h1"
        id={`${itemPath}.title`}
        data-preview-field-path={`${itemPath}.title`}
        defaultValue={title}
        className="page-title"
      />
      <EditableText
        as="p"
        id={`${itemPath}.description`}
        data-preview-field-path={`${itemPath}.description`}
        defaultValue={description}
        className="page-description"
      />
      <div className="page-image-wrap">
        <EditableImage
          id={`${itemPath}.imageUrl`}
          data-preview-field-path={`${itemPath}.imageUrl`}
          src={imageUrl}
          fallbackSrc={imageFallback}
          alt={title}
          className="page-image"
        />
      </div>
    </Component>
  );
}