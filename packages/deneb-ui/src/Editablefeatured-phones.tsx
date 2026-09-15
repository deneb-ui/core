import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface PhoneItem {
  id?: string | number;
  name?: string;
  brand?: string;
  subtitle?: string;
  price?: string | number;
  originalPrice?: string | number;
  condition?: string;
  storageOptions?: string[];
  selectedStorage?: string;
  colors?: { name: string; hex: string }[];
  image?: string;
  badge?: string;
  description?: string;
  [key: string]: unknown;
}

export interface EditableFeaturedPhonesProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  phones: PhoneItem[];
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableFeaturedPhones({
  itemPath,
  phones,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  ...props
}: EditableFeaturedPhonesProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-featured-phones ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" data-preview-list-path={`${itemPath}.phones`}>
          {phones.map((phone) => (
            <li key={phone.id} data-preview-item-path={`${itemPath}.phones.${phone.id}`} className="group cursor-pointer flex flex-col justify-between p-6 rounded-3xl border border-black/[0.08] hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-600 font-mono">
                      <EditableText
                        as="span"
                        id={`${itemPath}.phones.${phone.id}.brand`}
                        data-preview-field-path={`${itemPath}.phones.${phone.id}.brand`}
                        defaultValue={phone.brand}
                      />
                    </span>
                    <EditableText
                      as="h3"
                      id={`${itemPath}.phones.${phone.id}.name`}
                      data-preview-field-path={`${itemPath}.phones.${phone.id}.name`}
                      defaultValue={phone.name}
                      className="mt-1 text-xl font-bold text-zinc-950 tracking-tight group-hover:text-cyan-600 transition-colors"
                    />
                    <EditableText
                      as="p"
                      id={`${itemPath}.phones.${phone.id}.subtitle`}
                      data-preview-field-path={`${itemPath}.phones.${phone.id}.subtitle`}
                      defaultValue={phone.subtitle}
                      className="text-xs text-zinc-500 mt-0.5"
                    />
                  </div>
                  {phone.badge && (
                    <span className="shrink-0 rounded-full border border-black/[0.08] bg-black/[0.03] px-2.5 py-0.5 text-[10px] font-semibold text-zinc-700 backdrop-blur-md">
                      <EditableText
                        as="span"
                        id={`${itemPath}.phones.${phone.id}.badge`}
                        data-preview-field-path={`${itemPath}.phones.${phone.id}.badge`}
                        defaultValue={phone.badge}
                      />
                    </span>
                  )}
                </div>
                <div className="relative my-6 h-60 w-full overflow-clip rounded-2xl border border-black/[0.06] bg-slate-100">
                  <EditableImage
                    id={`${itemPath}.phones.${phone.id}.image`}
                    data-preview-field-path={`${itemPath}.phones.${phone.id}.image`}
                    src={phone.image}
                    fallbackSrc={imageFallback}
                    alt={phone.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-sm sm:text-base font-bold text-zinc-900">Rs</span>
                        <EditableText
                          as="p"
                          id={`${itemPath}.phones.${phone.id}.price`}
                          data-preview-field-path={`${itemPath}.phones.${phone.id}.price`}
                          defaultValue={phone.price}
                          className="text-2xl font-black text-zinc-950"
                        />
                      </div>
                      {phone.originalPrice && (
                        <div className="flex items-baseline gap-0.5 text-xs text-zinc-400 line-through font-mono">
                          <span>Rs</span>
                          <EditableText
                            as="p"
                            id={`${itemPath}.phones.${phone.id}.originalPrice`}
                            data-preview-field-path={`${itemPath}.phones.${phone.id}.originalPrice`}
                            defaultValue={phone.originalPrice}
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500">Free Insured Courier</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Component>
  );
}