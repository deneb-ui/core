import React, { useState } from 'react';
import { withBasePath } from './utils';
import { resolveProductOptions, MeasurementUnit } from './utils/productOptions';
import { createWhatsAppUrl } from './utils/urls';

export interface ProductDetailItem {
  id?: string;
  name?: string;
  title?: string;
  brand?: string;
  category?: string;
  price?: string | number;
  originalPrice?: string | number;
  description?: string;
  badge?: string;
  featuredImage?: string;
  imageUrl?: string;
  gallery?: string[];
  addToSelectionLabel?: string;
  specsTitle?: string;
  specs?: Array<{ label: string; value: string }>;
  shippingTitle?: string;
  shippingSummary?: string;
  shippingReturns?: string;
  relatedLabel?: string;
  relatedTitle?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;

  // Variants & Measurements System
  unit?: MeasurementUnit;
  measurement?: string;
  optionsLabel?: string;
  options?: (string | number)[];
  optionsText?: string;
  sizes?: (string | number)[] | string;
  sizesText?: string;
  sizesLabel?: string;
  colors?: Array<string | { name: string; hex?: string }> | string;
  colorsText?: string;
  colorsLabel?: string;

  [key: string]: unknown;
}

export interface EditableProductDetailProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Field path prefix for live Fivora Visual Editing synchronization (e.g. "product").
   */
  sectionPath?: string;

  /**
   * Product data object.
   */
  product: ProductDetailItem;

  /**
   * Available sizes (e.g. ['40', '41', '42', '43', '44', '45', '46']).
   */
  sizes?: string[];

  /**
   * Available color swatches.
   */
  colors?: Array<{ name: string; hex: string }>;

  /**
   * Callback on adding product to selection or cart.
   */
  onAddToSelection?: (product: ProductDetailItem, selectedSize?: string, selectedColor?: string) => void;

  /**
   * Optional custom WhatsApp order URL.
   */
  whatsappUrl?: string;

  className?: string;
}

/**
 * EditableProductDetail is an elite, fully calibrated Single Product View component
 * engineered for high-conversion commerce and 100% compliant with Fivora Visual Editing.
 *
 * Features:
 * - Multi-image gallery with active thumbnail selector and basePath resolution
 * - Floating badges with conditional rendering (zero hidden marker contract violations)
 * - Live synchronized field paths for Title, Price, Description, CTAs, and Policies
 * - Interactive size & color pickers
 * - Direct WhatsApp Click-to-Order integration
 * - Specifications and Shipping & Returns tabs
 *
 * Created by Chamika Gayashan & Induranga Kawishwara
 */
export function EditableProductDetail({
  sectionPath = 'product',
  product,
  sizes = ['40', '41', '42', '43', '44', '45', '46'],
  colors = [
    { name: 'Ivory', hex: '#F0EFEB' },
    { name: 'Obsidian', hex: '#1C2541' },
  ],
  onAddToSelection,
  whatsappUrl,
  className = '',
  style,
  ...props
}: EditableProductDetailProps) {
  const images = (product.gallery && product.gallery.length > 0)
    ? product.gallery
    : [product.featuredImage || product.imageUrl || '/products/vanta-aero-x.jpg'];

  const resolved = resolveProductOptions(product);
  const effectiveOptions =
    product.options || product.optionsText
      ? resolved.options
      : (product.sizes || product.sizesText)
        ? resolved.options
        : sizes;
  const effectiveOptionsLabel = resolved.optionsLabel || 'Available Sizes';

  const [activeImage, setActiveImage] = useState(images[0] || '');
  const [selectedSize, setSelectedSize] = useState(effectiveOptions[0] || '');
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping'>('specs');

  const name = String(product.name || product.title || 'Product Title');
  const price = product.price !== undefined ? String(product.price) : 'LKR 0';
  const description = String(product.description || '');
  const badge = String(product.badge || '');
  const addToSelectionLabel = String(product.addToSelectionLabel || 'Add to Selection');
  const specsTitle = String(product.specsTitle || 'Specifications');
  const shippingTitle = String(product.shippingTitle || 'Shipping & Returns');
  const shippingSummary = String(
    product.shippingSummary || 'Free Islandwide Delivery within 2-3 business days. Cash on delivery available.'
  );
  const shippingReturns = String(
    product.shippingReturns || '14-day hassle-free exchanges for unworn items in original packaging.'
  );

  const orderSnippet = resolved.formatOrderSnippet(selectedSize, selectedColor);
  const resolvedWhatsappUrl = whatsappUrl || (
    product.whatsappNumber
      ? createWhatsAppUrl(
          product.whatsappNumber,
          product.whatsappMessage || `Hi, I would like to order ${name}${orderSnippet ? ` ${orderSnippet}` : ''} - ${price}`
        )
      : ''
  );

  return (
    <section
      data-preview-page-key={sectionPath}
      className={`editable-product-detail max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="deneb-product-detail-gallery flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[580px] pb-2 md:pb-0 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-slate-900/40 p-2 ${
                    activeImage === img
                      ? 'border-brand-primary scale-98 shadow-md'
                      : 'border-slate-800/80 opacity-60 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={withBasePath(img)}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Showcase Image */}
          <div className="relative flex-1 aspect-square rounded-3xl bg-gradient-to-b from-slate-900/50 to-slate-950/80 border border-slate-800/80 p-8 flex items-center justify-center overflow-hidden group">
            {badge && (
              <span
                data-preview-field-path={`${sectionPath}.badge`}
                className="absolute top-6 left-6 z-10 px-3.5 py-1 text-xs font-black tracking-wider uppercase rounded-full bg-lime-400 text-slate-950 shadow-lg"
              >
                {badge}
              </span>
            )}

            <img
              data-preview-field-path={`${sectionPath}.featuredImage`}
              src={withBasePath(activeImage)}
              alt={name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Product Information Column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Title */}
            <h1
              data-preview-field-path={`${sectionPath}.name`}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight"
            >
              {name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span
                data-preview-field-path={`${sectionPath}.price`}
                className="text-3xl font-black text-lime-400 tracking-tight"
              >
                {price}
              </span>
              {product.originalPrice ? (
                <span className="text-lg font-medium text-slate-500 line-through">
                  {String(product.originalPrice)}
                </span>
              ) : null}
            </div>

            {/* Description */}
            {description && (
              <p
                data-preview-field-path={`${sectionPath}.description`}
                className="mt-6 text-base text-slate-300 leading-relaxed"
              >
                {description}
              </p>
            )}

            {/* Color Swatches */}
            {colors.length > 0 && (
              <div className="mt-8">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Color — <span className="text-white">{selectedColor}</span>
                </span>
                <div className="flex gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-9 h-9 rounded-full border-2 transition-all p-0.5 ${
                        selectedColor === c.name
                          ? 'border-lime-400 ring-2 ring-lime-400/30 scale-105'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Options / Size / Measurement Selector */}
            {effectiveOptions.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <span
                    data-preview-field-path={`${sectionPath}.${product.optionsLabel ? 'optionsLabel' : 'sizesLabel'}`}
                    className="block text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    {effectiveOptionsLabel}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {resolved.formatSelectedDisplay(selectedSize)}
                  </span>
                </div>
                <div className="deneb-product-detail-sizes grid grid-cols-3 sm:grid-cols-6 md:grid-cols-7 gap-2">
                  {effectiveOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 px-2 rounded-xl font-bold text-sm transition-all duration-150 ${
                        selectedSize === s
                          ? 'bg-white text-slate-950 shadow-md font-extrabold scale-102'
                          : 'bg-slate-900/60 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {resolved.formatOption(s)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onAddToSelection?.(product, selectedSize, selectedColor)}
                className="w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-lime-400 text-slate-950 hover:bg-lime-300 active:scale-98 transition-all duration-150 shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2"
              >
                <span data-preview-field-path={`${sectionPath}.addToSelectionLabel`}>
                  {addToSelectionLabel}
                </span>
              </button>

              {/* Direct WhatsApp CTA Button */}
              {resolvedWhatsappUrl && (
                <a
                  href={resolvedWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition-all duration-150 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.201.3-.78 0.98-.956 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.635-.93-2.242-.244-.592-.493-.512-.678-.521-.175-.009-.376-.009-.577-.009-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.23 3.113.15.201 2.124 3.243 5.145 4.548.718.311 1.279.497 1.716.636.722.23 1.378.197 1.898.12.579-.087 1.78-.728 2.03-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351zM12.004 2C6.48 2 2 6.48 2 12c0 1.82.49 3.52 1.34 4.99L2 22l5.14-1.35c1.42.78 3.04 1.22 4.86 1.22 5.52 0 10-4.48 10-10S17.524 2 12.004 2z" />
                  </svg>
                  <span>Order Directly via WhatsApp</span>
                </a>
              )}
            </div>

            {/* Specifications & Shipping Details */}
            <div className="mt-10 border-t border-slate-800/80 pt-6">
              <div className="flex gap-6 border-b border-slate-800 pb-3 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`text-sm font-bold tracking-wide transition-colors ${
                    activeTab === 'specs' ? 'text-lime-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span data-preview-field-path={`${sectionPath}.specsTitle`}>{specsTitle}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('shipping')}
                  className={`text-sm font-bold tracking-wide transition-colors ${
                    activeTab === 'shipping' ? 'text-lime-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span data-preview-field-path={`${sectionPath}.shippingTitle`}>{shippingTitle}</span>
                </button>
              </div>

              {activeTab === 'specs' ? (
                <div className="space-y-3">
                  {product.specs && product.specs.length > 0 ? (
                    product.specs.map((spec, i) => (
                      <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-900">
                        <span className="text-slate-400 font-medium">{spec.label}</span>
                        <span className="text-slate-200 font-semibold">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 space-y-2">
                      <div className="flex justify-between py-1 border-b border-slate-800/50">
                        <span>Upper Material</span>
                        <span className="text-slate-200 font-semibold">Engineered breathable mesh</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/50">
                        <span>Midsole Technology</span>
                        <span className="text-slate-200 font-semibold">Dual-density responsive foam</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/50">
                        <span>Outsole Grip</span>
                        <span className="text-slate-200 font-semibold">High-abrasion tactical rubber</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                  <p data-preview-field-path={`${sectionPath}.shippingSummary`}>
                    {shippingSummary}
                  </p>
                  <p data-preview-field-path={`${sectionPath}.shippingReturns`} className="text-slate-400">
                    {shippingReturns}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
