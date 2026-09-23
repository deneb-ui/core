import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface Product {
  id?: string | number;
  name?: string;
  category?: string;
  shortDescription?: string;
  images?: string[];
  colors?: { name: string; hex: string }[];
  sizes?: number[];
  [key: string]: unknown;
}

export interface EditableQuickViewModalProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  product: Product | null;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableQuickViewModal({
  itemPath,
  product,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  ...props
}: EditableQuickViewModalProps) {
  if (!product) return null;

  const name = String(product.name || '');
  const category = String(product.category || '');
  const shortDescription = String(product.shortDescription || '');
  const imageUrl = String(product.images?.[0] || '');

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`quick-view ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="quick-view__media">
        <EditableImage
          id={`${itemPath}.imageUrl`}
          data-preview-field-path={`${itemPath}.imageUrl`}
          src={imageUrl}
          fallbackSrc={imageFallback}
          alt={name}
          className="quick-view__image"
        />
      </div>
      <div className="quick-view__info">
        <EditableText
          as="span"
          id={`${itemPath}.category`}
          data-preview-field-path={`${itemPath}.category`}
          defaultValue={category}
          className="quick-view__category"
        />
        <EditableText
          as="h2"
          id={`${itemPath}.name`}
          data-preview-field-path={`${itemPath}.name`}
          defaultValue={name}
          className="quick-view__name"
        />
        <EditableText
          as="p"
          id={`${itemPath}.shortDescription`}
          data-preview-field-path={`${itemPath}.shortDescription`}
          defaultValue={shortDescription}
          className="quick-view__desc"
        />
      </div>
    </Component>
  );
}