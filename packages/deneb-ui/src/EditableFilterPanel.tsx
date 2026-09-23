import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface ShopFilters {
  category: string;
  gender: string;
  sizes: number[];
  priceMin: number;
  priceMax: number;
  sort: string;
  saleOnly: boolean;
  search: string;
}

export interface EditableFilterPanelProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  filters: ShopFilters;
  availableSizes: number[];
  maxPrice: number;
  mobileOpen: boolean;
  resultCount: number;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableFilterPanel({
  itemPath,
  filters,
  availableSizes,
  maxPrice,
  mobileOpen,
  resultCount,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}: EditableFilterPanelProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-filter-panel ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="filter-panel__header">
        <EditableText
          as="h2"
          id={`${itemPath}.heading`}
          data-preview-field-path={`${itemPath}.heading`}
          defaultValue="Filters"
          className="filter-panel__title"
        />
        <button
          type="button"
          className="filter-panel__clear"
          data-preview-field-path={`${itemPath}.clearAllLabel`}
        >
          <EditableText
            as="span"
            id={`${itemPath}.clearAllLabel`}
            data-preview-field-path={`${itemPath}.clearAllLabel`}
            defaultValue="Clear all"
          />
        </button>
      </div>

      <div className="filter-group">
        <EditableText
          as="label"
          id={`${itemPath}.sort`}
          data-preview-field-path={`${itemPath}.sort`}
          defaultValue="Sort by"
          className="filter-label"
        />
        <select
          id="sort-select"
          className="filter-select"
          value={filters.sort}
          onChange={(e) => update({ sort: e.target.value })}
          data-preview-list-path={`${itemPath}.SORT_OPTIONS`}
        >
          {sortOptions.map((o, index) => (
            <option
              key={o.value}
              value={o.value}
              data-preview-item-path={`${itemPath}.SORT_OPTIONS[${index}]`}
              data-preview-field-path={`${itemPath}.SORT_OPTIONS[${index}].label`}
            >
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <EditableText
          as="span"
          id={`${itemPath}.categoryLabel`}
          data-preview-field-path={`${itemPath}.categoryLabel`}
          defaultValue="Category"
          className="filter-label"
        />
        <div className="filter-pills">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`filter-pill ${filters.category === c.value ? 'filter-pill--active' : ''}`}
              onClick={() => update({ category: c.value })}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <EditableText
          as="span"
          id={`${itemPath}.genderLabel`}
          data-preview-field-path={`${itemPath}.genderLabel`}
          defaultValue="Gender"
          className="filter-label"
        />
        <div className="filter-pills">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              type="button"
              className={`filter-pill ${filters.gender === g.value ? 'filter-pill--active' : ''}`}
              onClick={() => update({ gender: g.value })}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <EditableText
          as="span"
          id={`${itemPath}.sizeEuLabel`}
          data-preview-field-path={`${itemPath}.sizeEuLabel`}
          defaultValue="Size (EU)"
          className="filter-label"
        />
        <div className="size-grid size-grid--filter">
          {availableSizes.map((s) => (
            <button
              key={s}
              type="button"
              className={`size-btn size-btn--sm ${filters.sizes.includes(s) ? 'size-btn--active' : ''}`}
              onClick={() => toggleSize(s)}
              aria-pressed={filters.sizes.includes(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <EditableText
          as="span"
          id={`${itemPath}.priceLkrLabel`}
          data-preview-field-path={`${itemPath}.priceLkrLabel`}
          defaultValue="Price (LKR): "
          className="filter-label"
        />
        <span>
          {filters.priceMin.toLocaleString()} – {filters.priceMax.toLocaleString()}
        </span>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={500}
          value={filters.priceMax}
          onChange={(e) => update({ priceMax: Number(e.target.value) })}
          aria-label="Maximum price"
        />
      </div>

      <label className="filter-checkbox">
        <input
          type="checkbox"
          checked={filters.saleOnly}
          onChange={(e) => update({ saleOnly: e.target.checked })}
        />
        <EditableText
          as="span"
          id={`${itemPath}.saleItemsOnlyLabel`}
          data-preview-field-path={`${itemPath}.saleItemsOnlyLabel`}
          defaultValue="Sale items only"
        />
      </label>
    </Component>
  );
}