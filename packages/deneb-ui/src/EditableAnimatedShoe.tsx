import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface AnimatedShoeProps {
  src: string;
  alt: string;
  className?: string;
  variant?: 'default' | 'hero';
}

export interface EditableAnimatedShoeProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  shoe: AnimatedShoeProps;
  imageFallback?: string;
  as?: React.ElementType;
}

export function EditableAnimatedShoe({
  itemPath,
  shoe,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  ...props
}: EditableAnimatedShoeProps) {
  const { src, alt, variant = 'default' } = shoe;

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-animated-shoe ${variant} ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <EditableImage
        id={`${itemPath}.src`}
        data-preview-field-path={`${itemPath}.src`}
        src={src}
        fallbackSrc={imageFallback}
        alt={alt}
        className="animated-shoe__image"
      />
      <EditableText
        as="span"
        id={`${itemPath}.alt`}
        data-preview-field-path={`${itemPath}.alt`}
        defaultValue={alt}
        className="animated-shoe__alt"
      />
    </Component>
  );
}