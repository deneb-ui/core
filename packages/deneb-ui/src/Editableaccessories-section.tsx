import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface ProductItem {
  id?: string | number;
  name?: string;
  brand?: string;
  subtitle?: string;
  price?: string | number;
  originalPrice?: string | number;
  condition?: string;
  colors?: unknown[];
  image?: string;
  badge?: string;
  specs?: unknown[];
  description?: string;
  [key: string]: unknown;
}

export interface EditableaccessoriesSectionProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  accessories: ProductItem[];
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableaccessoriesSection({
  itemPath,
  accessories,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditableaccessoriesSectionProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative py-24 sm:py-32 overflow-clip bg-white border-t border-black/[0.06] ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-preview-list-path={`${itemPath}.accessories`}>
          {accessories.map((acc) => (
            <li key={acc.id} data-preview-item-path={`${itemPath}.accessories.${acc.id}`} className="group cursor-pointer flex flex-col justify-between p-5 rounded-3xl border border-black/[0.08] bg-white/95">
              <div>
                <EditableText
                  as="span"
                  id={`${itemPath}.accessories.${acc.id}.badge`}
                  data-preview-field-path={`${itemPath}.accessories.${acc.id}.badge`}
                  defaultValue={acc.badge}
                  className="text-[10px] font-mono uppercase font-bold text-cyan-600"
                />
                <div className="relative my-4 h-44 w-full rounded-2xl border border-black/[0.08] overflow-clip bg-slate-100">
                  <EditableImage
                    id={`${itemPath}.accessories.${acc.id}.image`}
                    data-preview-field-path={`${itemPath}.accessories.${acc.id}.image`}
                    src={acc.image}
                    fallbackSrc={imageFallback}
                    alt={acc.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                </div>
                <EditableText
                  as="h3"
                  id={`${itemPath}.accessories.${acc.id}.name`}
                  data-preview-field-path={`${itemPath}.accessories.${acc.id}.name`}
                  defaultValue={acc.name}
                  className="text-base font-bold text-zinc-950 tracking-tight group-hover:text-cyan-600 transition-colors line-clamp-1"
                />
                <EditableText
                  as="p"
                  id={`${itemPath}.accessories.${acc.id}.subtitle`}
                  data-preview-field-path={`${itemPath}.accessories.${acc.id}.subtitle`}
                  defaultValue={acc.subtitle}
                  className="mt-1 text-xs text-zinc-600 line-clamp-2 leading-relaxed"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Component>
  );
}