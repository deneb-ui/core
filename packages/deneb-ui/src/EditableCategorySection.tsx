import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface Category {
  id?: string | number;
  label?: string;
  image?: string;
  [key: string]: unknown;
}

export interface EditableCategorySectionProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  categories: Category[];
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableCategorySection({
  itemPath,
  categories,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  ...props
}: EditableCategorySectionProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`category-section section-block section-reveal ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="container">
        <div className="section-header section-header--split">
          <div>
            <EditableText
              as="span"
              id={`${itemPath}.categories2`}
              data-preview-field-path={`${itemPath}.categories2`}
              defaultValue="Categories"
              className="section-label"
            />
            <EditableText
              as="h2"
              id={`${itemPath}.findYoursilhouette`}
              data-preview-field-path={`${itemPath}.findYoursilhouette`}
              defaultValue="Find YourSilhouette"
              className="section-title"
            />
            <EditableText
              as="span"
              id={`${itemPath}.silhouette`}
              data-preview-field-path={`${itemPath}.silhouette`}
              defaultValue="Silhouette"
            />
          </div>
          <EditableText
            as="p"
            id={`${itemPath}.fromPerformanceRunnersStreetReady`}
            data-preview-field-path={`${itemPath}.fromPerformanceRunnersStreetReady`}
            defaultValue="From performance runners to street-ready classics — explore categories built for every movement."
            className="section-desc"
          />
        </div>

        <div
          className="category-grid"
          data-preview-list-path={`${itemPath}.categories`}
        >
          {categories.map((cat, i) => (
            <a
              key={cat.id || `category-${i}`}
              href={`/shop/?category=${cat.id || cat.label}`}
              className="category-card"
              style={{ '--cat-delay': `${i * 100}ms` } as React.CSSProperties}
              data-preview-item-path={`${itemPath}.categories[${i}]`}
            >
              <EditableImage
                id={`${itemPath}.categories[${i}].image`}
                data-preview-field-path={`${itemPath}.categories[${i}].image`}
                src={cat.image}
                fallbackSrc={imageFallback}
                alt=""
                loading="lazy"
                width={600}
                height={400}
              />
              <div className="category-card__overlay">
                <EditableText
                  as="span"
                  id={`${itemPath}.categories[${i}].label`}
                  data-preview-field-path={`${itemPath}.categories[${i}].label`}
                  defaultValue={cat.label}
                  className="category-card__label"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </Component>
  );
}