import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableRequiredPageLinkProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  pageId: string;
  href?: string;
  className?: string;
  staticId?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function EditableRequiredPageLink({
  itemPath,
  pageId,
  href,
  className = '',
  staticId,
  style,
  children,
  ...props
}: EditableRequiredPageLinkProps) {
  const resolvedHref = href || `/pages/${pageId}`;

  return (
    <a
      href={resolvedHref}
      className={`editable-required-page-link ${className}`.trim()}
      style={style}
      data-preview-item-path={itemPath}
      {...(staticId ? { 'data-static-id': staticId } : {})}
      {...(props as any)}
    >
      <EditableText
        as="span"
        id={`${itemPath}.children`}
        data-preview-field-path={`${itemPath}.children`}
        defaultValue={String(children)}
      />
    </a>
  );
}