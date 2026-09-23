import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface NotFoundProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: {
    title?: string;
    subtitle?: string;
    returnHomeUrl?: string;
    returnHomeLabel?: string;
  };
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableNotFound({
  itemPath,
  data,
  as: Component = 'div',
  className = '',
  style,
  ...props
}: NotFoundProps) {
  const title = String(data?.title ?? "404");
  const subtitle = String(data?.subtitle ?? "Page Not Found");
  const returnHomeUrl = String(data?.returnHomeUrl ?? "/");
  const returnHomeLabel = String(data?.returnHomeLabel ?? "Return Home");

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-not-found ${className}`.trim()}
      style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', ...style }}
      {...(props as any)}
    >
      <EditableText
        as="h1"
        id={`${itemPath}.title`}
        data-preview-field-path={`${itemPath}.title`}
        defaultValue={title}
        className="not-found-title"
        style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}
      />
      <EditableText
        as="p"
        id={`${itemPath}.subtitle`}
        data-preview-field-path={`${itemPath}.subtitle`}
        defaultValue={subtitle}
        className="not-found-subtitle"
        style={{ fontSize: '1.25rem', marginBottom: '1.5rem', opacity: 0.8 }}
      />
      <a
        href={returnHomeUrl}
        style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--brand-accent, #c9f031)', color: '#000', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}
        data-preview-field-path={`${itemPath}.returnHomeUrl`}
      >
        <EditableText
          as="span"
          id={`${itemPath}.returnHomeLabel`}
          data-preview-field-path={`${itemPath}.returnHomeLabel`}
          defaultValue={returnHomeLabel}
          className="not-found-return-home-label"
        />
      </a>
    </Component>
  );
}