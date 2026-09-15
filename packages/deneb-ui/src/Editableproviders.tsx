import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableprovidersProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function Editableproviders({
  itemPath,
  children,
  as: Component = 'div',
  className = '',
  style,
  ...props
}: EditableprovidersProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-providers ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <EditableText
        as="h2"
        id={`${itemPath}.title`}
        data-preview-field-path={`${itemPath}.title`}
        defaultValue="Providers"
        className="providers-title"
      />
      <EditableText
        as="p"
        id={`${itemPath}.description`}
        data-preview-field-path={`${itemPath}.description`}
        defaultValue="This component provides context for the application."
        className="providers-description"
      />
      {children}
    </Component>
  );
}