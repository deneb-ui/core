import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface QuickViewProduct {
  badge?: string;
  brand?: string;
  name?: string;
  subtitle?: string;
  price?: string | number;
  originalPrice?: string | number;
  description?: string;
  condition?: string;
  image?: string;
  colors?: { name: string; hex: string }[];
  storageOptions?: string[];
  specs?: { label: string; value: string }[];
}

export interface EditableQuickViewModalProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  product: QuickViewProduct;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableQuickViewModal({
  itemPath,
  product,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  ...props
}: EditableQuickViewModalProps) {
  const name = String(product?.name || '');
  const description = String(product?.description || '');
  const imageUrl = String(product?.image || '');

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-quick-view-modal ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative flex flex-col items-center justify-center rounded-2xl border border-black/[0.08] bg-slate-50 p-6 min-h-[300px] overflow-hidden group">
          {product.badge && (
            <span className="absolute top-3 left-3 rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700 border border-cyan-500/30 backdrop-blur-md">
              <EditableText
                as="span"
                id={`${itemPath}.badge`}
                data-preview-field-path={`${itemPath}.badge`}
                defaultValue={product.badge}
              />
            </span>
          )}
          <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-100">
            <EditableImage
              id={`${itemPath}.image`}
              data-preview-field-path={`${itemPath}.image`}
              src={imageUrl}
              fallbackSrc={imageFallback}
              alt={name}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-600">
            <span>
              <EditableText
                as="span"
                id={`${itemPath}.condition`}
                data-preview-field-path={`${itemPath}.condition`}
                defaultValue={product.condition}
              />
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
            <EditableText
              as="span"
              id={`${itemPath}.brand`}
              data-preview-field-path={`${itemPath}.brand`}
              defaultValue={product.brand}
            />
          </span>
          <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
            <EditableText
              as="h3"
              id={`${itemPath}.name`}
              data-preview-field-path={`${itemPath}.name`}
              defaultValue={name}
            />
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            <EditableText
              as="p"
              id={`${itemPath}.subtitle`}
              data-preview-field-path={`${itemPath}.subtitle`}
              defaultValue={product.subtitle}
            />
          </p>
          <div className="mt-3 flex items-baseline gap-3">
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-lg font-bold text-zinc-600">
                <EditableText
                  as="span"
                  id={`${itemPath}.priceLabel`}
                  data-preview-field-path={`${itemPath}.priceLabel`}
                  defaultValue="Rs"
                />
              </span>
              <p className="text-3xl font-extrabold text-zinc-950 tracking-tight">
                <EditableText
                  as="span"
                  id={`${itemPath}.price`}
                  data-preview-field-path={`${itemPath}.price`}
                  defaultValue={product.price}
                />
              </p>
            </div>
            {product.originalPrice && (
              <div className="flex items-baseline gap-1 text-sm text-zinc-400 line-through font-mono">
                <span className="text-xs font-medium text-zinc-600">
                  <EditableText
                    as="span"
                    id={`${itemPath}.originalPriceLabel`}
                    data-preview-field-path={`${itemPath}.originalPriceLabel`}
                    defaultValue="Rs"
                  />
                </span>
                <p>
                  <EditableText
                    as="span"
                    id={`${itemPath}.originalPrice`}
                    data-preview-field-path={`${itemPath}.originalPrice`}
                    defaultValue={product.originalPrice}
                  />
                </p>
              </div>
            )}
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-500/30">
              <EditableText
                as="span"
                id={`${itemPath}.inStockLabel`}
                data-preview-field-path={`${itemPath}.inStockLabel`}
                defaultValue="In Stock & Tested"
              />
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-zinc-600">
            <EditableText
              as="p"
              id={`${itemPath}.description`}
              data-preview-field-path={`${itemPath}.description`}
              defaultValue={description}
            />
          </p>
          {product.colors && product.colors.length > 0 && (
            <div className="mt-4">
              <label className="text-xs font-medium text-zinc-600">
                <EditableText
                  as="span"
                  id={`${itemPath}.finishLabel`}
                  data-preview-field-path={`${itemPath}.finishLabel`}
                  defaultValue="Finish:"
                />
                <span className="text-zinc-950 font-semibold">
                  <EditableText
                    as="span"
                    id={`${itemPath}.selectedColor`}
                    data-preview-field-path={`${itemPath}.selectedColor`}
                    defaultValue={product.colors[0]?.name}
                  />
                </span>
              </label>
              <div className="mt-2 flex items-center gap-2.5">
                {product.colors.map((c, idx) => (
                  <button
                    key={c.name}
                    type="button"
                    className={`h-7 w-7 rounded-full transition-transform border border-black/10`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}
          {product.storageOptions && (
            <div className="mt-4">
              <label className="text-xs font-medium text-zinc-600">
                <EditableText
                  as="span"
                  id={`${itemPath}.capacityLabel`}
                  data-preview-field-path={`${itemPath}.capacityLabel`}
                  defaultValue="Capacity"
                />
              </label>
              <div className="mt-2 flex items-center gap-2">
                {product.storageOptions.map((storage) => (
                  <button
                    key={storage}
                    type="button"
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all`}
                  >
                    <EditableText
                      as="span"
                      id={`${itemPath}.storageOption`}
                      data-preview-field-path={`${itemPath}.storageOption`}
                      defaultValue={storage}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2 border-y border-black/[0.06] py-3">
            {product.specs?.slice(0, 4).map((spec) => (
              <div key={spec.label} className="text-[11px]">
                <span className="text-zinc-500 block">
                  <EditableText
                    as="span"
                    id={`${itemPath}.specLabel`}
                    data-preview-field-path={`${itemPath}.specLabel`}
                    defaultValue={spec.label}
                  />
                </span>
                <span className="text-zinc-800 font-medium">
                  <EditableText
                    as="span"
                    id={`${itemPath}.specValue`}
                    data-preview-field-path={`${itemPath}.specValue`}
                    defaultValue={spec.value}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Component>
  );
}