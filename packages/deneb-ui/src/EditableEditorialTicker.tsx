import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableEditorialTickerProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  items: string[];
  as?: React.ElementType;
}

export function EditableEditorialTicker({
  itemPath,
  items,
  as: Component = 'div',
  className = '',
  style,
  ...props
}: EditableEditorialTickerProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editorial-ticker ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="editorial-ticker__track" data-preview-list-path={`${itemPath}.items`}>
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="editorial-ticker__item"
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