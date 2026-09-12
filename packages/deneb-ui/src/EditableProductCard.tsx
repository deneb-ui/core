import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { EditableBadge } from './EditableText';
import { MeasurementUnit } from './utils/productOptions';

export interface ProductItem {
  id?: string | number;
  name?: string;
  title?: string;
  brand?: string;
  price?: string | number;
  originalPrice?: string | number;
  description?: string;
  category?: string;
  imageUrl?: string;
  image?: string;
  images?: string[];
  badge?: string;
  rating?: number | string;
  reviewsCount?: number | string;
  isNew?: boolean;
  isBestSeller?: boolean;

  // Variants & Measurements System
  unit?: MeasurementUnit;
  measurement?: string;
  optionsLabel?: string;
  options?: (string | number)[] | string;
  optionsText?: string;
  sizes?: (string | number)[] | string;
  sizesText?: string;
  sizesLabel?: string;
  colors?: Array<string | { name: string; hex?: string }> | string;
  colorsText?: string;
  colorsLabel?: string;

  [key: string]: unknown;
}

export type ProductCardVariant = 'modern-glass' | 'classic' | 'minimal' | 'horizontal';

export interface EditableProductCardProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The item path for the product, e.g. "products[0]" or "featuredProducts[1]".
   */
  itemPath: string;

  /**
   * The product data object.
   */
  product: ProductItem;

  /**
   * Design variant: 'modern-glass' | 'classic' | 'minimal' | 'horizontal'
   */
  cardVariant?: ProductCardVariant;

  /**
   * Fallback image URL if product image is empty.
   */
  imageFallback?: string;

  /**
   * HTML wrapper tag (default: 'article').
   */
  as?: React.ElementType;

  /**
   * Whether to display the price field (default: true).
   */
  showPrice?: boolean;

  /**
   * Whether to display the description field (default: true).
   */
  showDescription?: boolean;

  /**
   * Whether to display category pill (default: true if present).
   */
  showCategory?: boolean;

  /**
   * Optional custom action slot (e.g. Add to Cart button).
   */
  actionSlot?: React.ReactNode;

  /**
   * Label for the action button (default: 'Buy Now' or product.buttonText).
   */
  actionLabel?: string;

  /**
   * Custom field path for the action button label.
   */
  actionLabelPath?: string;
}

/**
 * EditableProductCard is an elite, auto-balancing commerce card supporting
 * four visual variants (modern-glass, classic, minimal, horizontal) and
 * strict Fivora visual editing synchronization.
 */
export function EditableProductCard({
  itemPath,
  product,
  cardVariant = 'modern-glass',
  imageFallback,
  as: Component = 'article',
  showPrice = true,
  showDescription = true,
  showCategory = true,
  actionSlot,
  actionLabel,
  actionLabelPath,
  className = '',
  style,
  ...props
}: EditableProductCardProps) {
  const name = String(product?.name || product?.title || '');
  const price = product?.price !== undefined ? String(product.price) : '';
  const originalPrice = product?.originalPrice !== undefined ? String(product.originalPrice) : '';
  const description = String(product?.description || '');
  const category = String(product?.category || '');
  const badge = String(product?.badge || '');
  const imageUrl = String(product?.imageUrl || product?.image || '');

  const isHorizontal = cardVariant === 'horizontal';

  const variantStyles: Record<ProductCardVariant, React.CSSProperties> = {
    'modern-glass': {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderRadius: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      overflow: 'hidden',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    },
    classic: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      transition: 'transform 0.2s ease',
    },
    minimal: {
      backgroundColor: 'transparent',
      border: 'none',
      overflow: 'hidden',
    },
    horizontal: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '14px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  };

  return (
    <Component
      data-preview-item-path={itemPath}
      style={{
        ...variantStyles[cardVariant],
        ...style,
      }}
      className={`editable-product-card group ${isHorizontal ? 'is-horizontal' : ''} ${className}`.trim()}
      {...(props as any)}
    >
      {/* Image Wrap */}
      <div
        className="deneb-product-card-media"
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: isHorizontal ? '100%' : '100%',
          flexShrink: 0,
        }}
      >
        <EditableImage
          id={`${itemPath}.imageUrl`}
          src={imageUrl}
          fallbackSrc={imageFallback}
          alt={name}
          aspectRatio={isHorizontal ? 'square' : '4/3'}
          fit="cover"
          hoverZoom
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Floating Sale/Badge */}
        {badge && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
            <EditableBadge
              id={`${itemPath}.badge`}
              defaultValue={badge}
              badgeVariant="primary"
            />
          </div>
        )}
      </div>

      {/* Body Wrap */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Category Pill */}
          {showCategory && (
            <EditableText
              as="span"
              id={`${itemPath}.category`}
              defaultValue={category}
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--brand-accent, #14b8a6)',
                fontWeight: 600,
                display: 'inline-block',
                marginBottom: '0.375rem',
              }}
            />
          )}

          {/* Product Title */}
          <EditableText
            as="h3"
            id={`${itemPath}.name`}
            defaultValue={name}
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              lineHeight: 1.3,
              color: 'var(--heading-color, #0f172a)',
              marginBottom: '0.375rem',
            }}
          />

          {/* Description */}
          {showDescription && (
            <EditableText
              as="p"
              id={`${itemPath}.description`}
              defaultValue={description}
              style={{
                fontSize: '0.875rem',
                color: 'var(--muted-text, #64748b)',
                lineHeight: 1.5,
                marginBottom: '0.75rem',
              }}
            />
          )}
        </div>

        {/* Pricing and Action Footer */}
        <div
          style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: cardVariant === 'minimal' ? 'none' : '1px solid rgba(226, 232, 240, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          {showPrice && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
              <EditableText
                as="span"
                id={`${itemPath}.price`}
                defaultValue={price}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--brand-color, #2563eb)',
                }}
              />
              {originalPrice ? (
                <EditableText
                  as="span"
                  id={`${itemPath}.originalPrice`}
                  defaultValue={originalPrice}
                  style={{
                    fontSize: '0.875rem',
                    textDecoration: 'line-through',
                    color: 'var(--muted-text, #94a3b8)',
                  }}
                />
              ) : null}
              {product?.measurement ? (
                <EditableText
                  as="span"
                  id={`${itemPath}.measurement`}
                  defaultValue={`/ ${String(product.measurement)}`}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: 'var(--muted-text, #64748b)',
                    marginLeft: '0.25rem',
                  }}
                />
              ) : null}
            </div>
          )}

          {actionSlot ? (
            <div>{actionSlot}</div>
          ) : (
            <button
              type="button"
              style={{
                backgroundColor: 'var(--brand-color, #2563eb)',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
            >
              <EditableText
                as="span"
                id={actionLabelPath || `${itemPath}.buttonText`}
                defaultValue={actionLabel || (product as any)?.buttonText || 'Buy Now'}
                style={{ color: '#ffffff', fontWeight: 600 }}
              />
            </button>
          )}
        </div>
      </div>
    </Component>
  );
}

