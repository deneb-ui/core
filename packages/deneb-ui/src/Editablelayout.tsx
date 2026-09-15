import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditablelayoutProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Editablelayout({
  itemPath,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}: EditablelayoutProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-layout ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <EditableText
        as="h1"
        id={`${itemPath}.title`}
        data-preview-field-path={`${itemPath}.title`}
        defaultValue="AURA Mobile | Premium Smartphone Showroom & Certified Repair Lab"
        className="layout-title"
      />
      <EditableText
        as="p"
        id={`${itemPath}.description`}
        data-preview-field-path={`${itemPath}.description`}
        defaultValue="Flagship smartphone sales, certified OEM repairs, precision screen and battery replacements, and trade-in upgrades. Experience Apple-grade engineering and luxury care."
        className="layout-description"
      />
      <EditableText
        as="p"
        id={`${itemPath}.keywords`}
        data-preview-field-path={`${itemPath}.keywords`}
        defaultValue="iPhone 16 Pro, Samsung Galaxy Ultra, Phone Repair, Screen Replacement, Battery Replacement, Smartphone Trade-In, Refurbished Phones"
        className="layout-keywords"
      />
      <div className="layout-image-wrap">
        <EditableImage
          id={`${itemPath}.image`}
          data-preview-field-path={`${itemPath}.image`}
          src="/path/to/image.jpg"
          fallbackSrc={imageFallback}
          alt="AURA Mobile"
          className="layout-image"
        />
      </div>
      {children}
    </Component>
  );
}