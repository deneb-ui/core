import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableShopPageFallbackProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  siteData: any;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableShopPageFallback({
  itemPath,
  siteData,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  ...props
}: EditableShopPageFallbackProps) {
  const title = String(siteData?.content?.shop?.shopAll ?? "Shop All");
  const description = String(siteData?.content?.shop?.exploreFullRangePerformanceRunners ?? "Explore our full range of performance runners, street sneakers, and lifestyle silhouettes.");
  const searchLabel = String(siteData?.content?.shop?.searchLabel ?? "Search");
  const searchProductsPlaceholder = String(siteData?.content?.shop?.searchProductsPlaceholder ?? 'Search products...');

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
          id={`${itemPath}.shopAll`}
          data-preview-field-path={`${itemPath}.shopAll`}
          defaultValue={title}
          className="shop-fallback-title"
        />
        <EditableText
          as="p"
          id={`${itemPath}.exploreFullRangePerformanceRunners`}
          data-preview-field-path={`${itemPath}.exploreFullRangePerformanceRunners`}
          defaultValue={description}
          className="shop-fallback-desc"
        />
      </header>

      <div className="shop-layout">
        {/* FilterPanel component is not editable, so it remains unchanged */}
        <FilterPanel
          filters={defaultFilters}
          onChange={() => {}}
          availableSizes={availableSizes}
          maxPrice={maxPrice}
          mobileOpen={false}
          onMobileClose={() => {}}
          resultCount={products.length}
        />

        <div className="shop-main">
          <FilterMobileBar onOpen={() => {}} resultCount={products.length} />
          <label className="shop-search">
            <EditableText
              as="span"
              id={`${itemPath}.searchLabel`}
              data-preview-field-path={`${itemPath}.searchLabel`}
              defaultValue={searchLabel}
              className="shop-search__label"
            />
            <input
              type="search"
              readOnly
              value=""
              placeholder={searchProductsPlaceholder}
              aria-label={searchProductsPlaceholder}
              data-preview-field-path={`${itemPath}.searchProductsPlaceholder`}
            />
          </label>
          <ProductGrid products={products.slice(0, 8)} columns={3} />
        </div>
      </div>
    </Component>
  );
}