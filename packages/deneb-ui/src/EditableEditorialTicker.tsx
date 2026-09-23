import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

const TICKER_ITEMS = [
  'Free Delivery Colombo',
  'New Arrivals Weekly',
  'Order via WhatsApp',
  'Premium Materials',
  'Engineered for Motion',
  'Limited Collections',
  '14-Day Exchanges',
];

export interface EditableEditorialTickerProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableEditorialTicker({
  itemPath,
  as: Component = 'div',
  className = '',
  style,
  ...props
}: EditableEditorialTickerProps) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editorial-ticker ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="editorial-ticker__track">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="editorial-ticker__item"
            data-preview-list-path={`${itemPath}.items`}
            data-preview-item-path={`${itemPath}.items.${i}`}
          >
            <EditableText
              as="span"
              id={`${itemPath}.items.${i}`}
              data-preview-field-path={`${itemPath}.items.${i}`}
              defaultValue={item}
            />
            <span className="editorial-ticker__dot" data-preview-static="decorative-copy">◆</span>
          </span>
        ))}
      </div>
    </Component>
  );
}