import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface ProductItem {
  id: string;
  name: string;
  brand: 'Apple' | 'Samsung' | 'Google' | 'Accessories';
  subtitle: string;
  price: number;
  originalPrice?: number;
  condition: 'Brand New' | 'Refurbished - Grade A+' | 'Certified Pre-Owned';
  storageOptions?: string[];
  selectedStorage?: string;
  colors: { name: string; hex: string }[];
  selectedColor?: string;
  image: string;
  badge?: string;
  specs: { label: string; value: string }[];
  description: string;
}

export interface EditableshopContextProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  product: ProductItem;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableshopContext({
  itemPath,
  product,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  ...props
}: EditableshopContextProps) {
  const name = String(product?.name || '');
  const subtitle = String(product?.subtitle || '');
  const description = String(product?.description || '');
  const imageUrl = String(product?.image || '');

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-shop-context ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="product-image-wrap">
        <EditableImage
          id={`${itemPath}.image`}
          data-preview-field-path={`${itemPath}.image`}
          src={imageUrl}
          fallbackSrc={imageFallback}
          alt={name}
          className="product-image"
        />
      </div>
      <div className="product-details">
        <EditableText
          as="h2"
          id={`${itemPath}.name`}
          data-preview-field-path={`${itemPath}.name`}
          defaultValue={name}
          className="product-name"
        />
        <EditableText
          as="h3"
          id={`${itemPath}.subtitle`}
          data-preview-field-path={`${itemPath}.subtitle`}
          defaultValue={subtitle}
          className="product-subtitle"
        />
        <EditableText
          as="p"
          id={`${itemPath}.description`}
          data-preview-field-path={`${itemPath}.description`}
          defaultValue={description}
          className="product-description"
        />
      </div>
    </Component>
  );
}