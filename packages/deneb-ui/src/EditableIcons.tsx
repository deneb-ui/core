import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableIconsProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  icons: {
    name: string;
    description: string;
    imageUrl: string;
    [key: string]: unknown;
  }[];
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableIcons({
  itemPath,
  icons,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}: EditableIconsProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-icons ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div data-preview-list-path={`${itemPath}.icons`}>
        {icons.map((icon, index) => {
          const iconPath = `${itemPath}.icons.${index}`;
          return (
            <div key={index} data-preview-item-path={iconPath}>
              <EditableImage
                id={`${iconPath}.imageUrl`}
                data-preview-field-path={`${iconPath}.imageUrl`}
                src={icon.imageUrl}
                fallbackSrc={imageFallback}
                alt={icon.name}
                className="icon-image"
              />
              <EditableText
                as="h3"
                id={`${iconPath}.name`}
                data-preview-field-path={`${iconPath}.name`}
                defaultValue={icon.name}
                className="icon-name"
              />
              <EditableText
                as="p"
                id={`${iconPath}.description`}
                data-preview-field-path={`${iconPath}.description`}
                defaultValue={icon.description}
                className="icon-description"
              />
            </div>
          );
        })}
      </div>
      {children}
    </Component>
  );
}