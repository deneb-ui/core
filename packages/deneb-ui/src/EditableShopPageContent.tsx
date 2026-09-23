import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface ShopFilters {
  category: string;
  gender: string;
  sizes: string[];
  priceMin: number;
  priceMax: number;
  sort: string;
  saleOnly: boolean;
  search: string;
}

export interface EditableShopPageContentProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  filters: ShopFilters;
  maxPrice: number;
  availableSizes: string[];
  filteredProducts: unknown[];
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableShopPageContent({
  itemPath,
  filters,
  maxPrice,
  availableSizes,
  filteredProducts,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  ...props
}: EditableShopPageContentProps) {
  const pageTitle = filters.saleOnly
    ? 'Sale'
    : filters.category
      ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
      : 'Shop All';

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`shop-page ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <header className="shop-header">
        <EditableText
          as="h1"
          id={`${itemPath}.pageTitle`}
          data-preview-field-path={`${itemPath}.pageTitle`}
          defaultValue={pageTitle}
          className="shop-page-title"
        />
        <EditableText
          as="p"
          id={`${itemPath}.pageDesc`}
          data-preview-field-path={`${itemPath}.pageDesc`}
          defaultValue={filters.saleOnly
            ? 'Your saved pairs — ready to order when you are.'
            : 'Explore our full range of performance runners, street sneakers, and lifestyle silhouettes.'}
          className="shop-page-desc"
        />
      </header>

      <div className="shop-layout">
        <div className="shop-sidebar">
          {/* FilterPanel component would go here */}
        </div>

        <div>
          {/* FilterMobileBar component would go here */}

          <input
            type="search"
            className="shop-search"
            placeholder="Search products..."
            aria-label="Search products"
            data-preview-field-path={`${itemPath}.searchProductsPlaceholder`}
          />

          {/* ProductGrid component would go here */}
        </div>
      </div>

      {/* QuickViewModal component would go here */}
    </Component>
  );
}