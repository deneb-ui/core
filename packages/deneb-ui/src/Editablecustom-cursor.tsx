import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditablecustomCursorProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  cursorText?: string;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditablecustomCursor({
  itemPath,
  cursorText = '',
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  ...props
}: EditablecustomCursorProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-custom-cursor ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="cursor-text-wrap">
        <EditableText
          as="span"
          id={`${itemPath}.cursorText`}
          data-preview-field-path={`${itemPath}.cursorText`}
          defaultValue={cursorText}
          className="cursor-text"
        />
      </div>
      <div className="cursor-image-wrap">
        <EditableImage
          id={`${itemPath}.cursorImage`}
          data-preview-field-path={`${itemPath}.cursorImage`}
          src={imageFallback}
          fallbackSrc={imageFallback}
          alt="Cursor Image"
          className="cursor-image"
        />
      </div>
    </Component>
  );
}