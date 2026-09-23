import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableProductGalleryProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  images: string[];
  productName: string;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableProductGallery({
  itemPath,
  images,
  productName,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}: EditableProductGalleryProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`product-gallery ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className={`product-gallery__main`}>
        <EditableImage
          id={`${itemPath}.imageUrl`}
          data-preview-field-path={`${itemPath}.imageUrl`}
          src={images[0]}
          fallbackSrc={imageFallback}
          alt={`${productName} — view 1`}
          className="product-gallery__image"
        />
      </div>

      <EditableText
        as="span"
        id={`${itemPath}.productImagesLabel`}
        data-preview-field-path={`${itemPath}.productImagesLabel`}
        defaultValue="Product images"
        className="product-gallery__thumbs-label"
      />

      {images.length > 1 && (
        <div className="product-gallery__thumbs" role="tablist" data-preview-list-path={`${itemPath}.thumbs`}>
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              role="tab"
              aria-selected={i === 0}
              className={`product-gallery__thumb ${i === 0 ? 'product-gallery__thumb--active' : ''}`}
              data-preview-item-path={`${itemPath}.thumbs.${i}`}
              onClick={() => {}}
            >
              <EditableImage
                id={`${itemPath}.thumbs.${i}`}
                data-preview-field-path={`${itemPath}.thumbs.${i}`}
                src={img}
                fallbackSrc={imageFallback}
                alt=""
                className="product-gallery__thumb-image"
              />
            </button>
          ))}
        </div>
      )}
      {children}
    </Component>
  );
}