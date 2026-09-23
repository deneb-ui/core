import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableEditorialSectionProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaLabel?: string;
  ctaHref?: string;
  reversed?: boolean;
  dark?: boolean;
}

export function EditableEditorialSection({
  itemPath,
  eyebrow = 'Editorial',
  title,
  description,
  image,
  imageAlt,
  ctaLabel = 'Discover',
  ctaHref = '/shop/',
  reversed = false,
  dark = false,
  className = '',
  style,
  ...props
}: EditableEditorialSectionProps) {
  return (
    <section
      data-preview-item-path={itemPath}
      className={`editorial-section section-reveal ${dark ? 'editorial-section--dark' : ''} ${reversed ? 'editorial-section--reversed' : ''} ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="editorial-section__media">
        <EditableImage
          id={`${itemPath}.image`}
          data-preview-field-path={`${itemPath}.image`}
          src={image}
          fallbackSrc="/placeholder.svg"
          alt={imageAlt}
          className="editorial-section__image"
        />
      </div>
      <div className="editorial-section__content">
        <EditableText
          as="span"
          id={`${itemPath}.eyebrow`}
          data-preview-field-path={`${itemPath}.eyebrow`}
          defaultValue={eyebrow}
          className="section-label"
        />
        <EditableText
          as="h2"
          id={`${itemPath}.title`}
          data-preview-field-path={`${itemPath}.title`}
          defaultValue={title}
          className="editorial-section__title"
        />
        <EditableText
          as="p"
          id={`${itemPath}.description`}
          data-preview-field-path={`${itemPath}.description`}
          defaultValue={description}
          className="editorial-section__desc"
        />
        <a href={ctaHref} className="btn btn-outline">
          <EditableText
            as="span"
            id={`${itemPath}.ctaLabel`}
            data-preview-field-path={`${itemPath}.ctaLabel`}
            defaultValue={ctaLabel}
          />
          <ArrowUpRightIcon data-preview-static="decorative-icon" />
        </a>
      </div>
    </section>
  );
}