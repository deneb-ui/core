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
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableShopPageContent({
  itemPath,
  filters,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  children,
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
          id={`${itemPath}.title`}
          data-preview-field-path={`${itemPath}.title`}
          defaultValue={pageTitle}
          className="shop-page-title"
        />
        <EditableText
          as="p"
          id={`${itemPath}.description`}
          data-preview-field-path={`${itemPath}.description`}
          defaultValue={filters.saleOnly
            ? 'Your saved pairs — ready to order when you are.'
            : 'Explore our full range of performance runners, street sneakers, and lifestyle silhouettes.'}
          className="shop-page-desc"
        />
      </header>

      <div className="shop-layout">
        {children}
      </div>
    </Component>
  );
}