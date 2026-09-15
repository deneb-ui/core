import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface Brand {
  name?: string;
  subtitle?: string;
  [key: string]: unknown;
}

export interface EditablebrandMarqueeProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  brands: Brand[];
  as?: React.ElementType;
}

export function EditablebrandMarquee({
  itemPath,
  brands,
  as: Component = 'section',
  className = '',
  style,
  ...props
}: EditablebrandMarqueeProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative py-14 sm:py-20 border-y border-black/[0.06] bg-white overflow-clip ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <EditableText
            as="span"
            id={`${itemPath}.certifiedAcrossIndustryLeadingMobile`}
            data-preview-field-path={`${itemPath}.certifiedAcrossIndustryLeadingMobile`}
            defaultValue="Certified Across Industry-Leading Mobile Ecosystems"
            className="text-xs uppercase font-mono tracking-widest text-zinc-500 font-semibold"
          />
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 lg:gap-16 opacity-75 hover:opacity-100 transition-opacity duration-300"
          data-preview-list-path={`${itemPath}.BRANDS`}
        >
          {brands.map((b: Brand, index: number) => (
            <div
              key={b.name}
              className="group flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
              data-preview-item-path={`${itemPath}.BRANDS[${index}]`}
            >
              <EditableText
                as="span"
                id={`${itemPath}.BRANDS[${index}].name`}
                data-preview-field-path={`${itemPath}.BRANDS[${index}].name`}
                defaultValue={b.name}
                className="text-xl sm:text-2xl font-extrabold tracking-wider text-zinc-700 group-hover:text-black group-hover:drop-shadow-[0_0_15px_rgba(0,240,255,0.7)] transition-all"
              />
              <EditableText
                as="span"
                id={`${itemPath}.BRANDS[${index}].subtitle`}
                data-preview-field-path={`${itemPath}.BRANDS[${index}].subtitle`}
                defaultValue={b.subtitle ?? "Lab Certified"}
                className="text-[9px] uppercase font-mono tracking-wider text-zinc-400 group-hover:text-cyan-600 transition-colors mt-0.5 font-bold"
              />
            </div>
          ))}
        </div>
      </div>
    </Component>
  );
}