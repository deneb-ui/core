import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableheaderProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  siteData: any;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Editableheader({
  itemPath,
  siteData,
  imageFallback = '/placeholder.svg',
  as: Component = 'header',
  className = '',
  style,
  children,
  ...props
}: EditableheaderProps) {
  const NAV_ITEMS = siteData?.content?.common?.NAV_ITEMS ?? [];
  
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`fixed top-0 left-0 right-0 z-40 flex justify-center px-4 pt-3.5 sm:pt-4 pointer-events-none transition-all duration-300 ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="pointer-events-auto flex items-center justify-between gap-2 sm:gap-6 rounded-full border transition-all duration-400">
        <a
          href="#hero"
          data-preview-field-path="common.header.auraHomeUrl"
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-violet-500/20 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,240,255,0.25)] group-hover:border-cyan-400/60 transition-colors">
            <EditableImage
              id={`${itemPath}.icon`}
              data-preview-field-path={`${itemPath}.icon`}
              src="/icon.svg"
              fallbackSrc={imageFallback}
              alt="Icon"
              className="h-4 w-4"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <EditableText
                as="span"
                id={`${itemPath}.auraLabel`}
                data-preview-field-path={`${itemPath}.auraLabel`}
                defaultValue={siteData?.content?.common?.header?.auraLabel ?? "AURA"}
                className="text-sm sm:text-base font-bold tracking-wider text-zinc-950"
              />
              <EditableText
                as="span"
                id={`${itemPath}.labLabel`}
                data-preview-field-path={`${itemPath}.labLabel`}
                defaultValue={siteData?.content?.common?.header?.labLabel ?? "LAB"}
                className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-600 border border-cyan-400/30 font-semibold tracking-normal inline-block"
              />
            </div>
            <EditableText
              as="span"
              id={`${itemPath}.precisionCellularLabel`}
              data-preview-field-path={`${itemPath}.precisionCellularLabel`}
              defaultValue={siteData?.content?.common?.header?.precisionCellularLabel ?? "Precision Cellular"}
              className="text-[9px] uppercase tracking-widest text-zinc-500 font-medium block"
            />
          </div>
        </a>
        <nav className="[display:none] lg:[display:block] relative">
          <ul
            className="relative flex items-center gap-1 rounded-full p-1 border border-black/[0.06] bg-black/[0.03] backdrop-blur-md"
            data-preview-list-path={`${itemPath}.NAV_ITEMS`}
          >
            {NAV_ITEMS.map((item, index) => (
              <li
                key={item.name}
                data-preview-item-path={`${itemPath}.NAV_ITEMS[${index}]`}
              >
                <a
                  href={item.href}
                  className={`relative block px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-200 select-none`}
                  data-preview-field-path={`${itemPath}.NAV_ITEMS[${index}].href`}
                >
                  <EditableText
                    as="span"
                    id={`${itemPath}.NAV_ITEMS[${index}].name`}
                    data-preview-field-path={`${itemPath}.NAV_ITEMS[${index}].name`}
                    defaultValue={item.name}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-zinc-800 hover:text-cyan-600 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
            title="Open Shopping Bag"
            aria-label="Open Shopping Bag"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
          <button
            className="relative group overflow-clip inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:shadow-[0_0_35px_rgba(0,240,255,0.65)] transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <Wrench className="h-3.5 w-3.5 shrink-0" />
            <EditableText
              as="span"
              id={`${itemPath}.bookRepairLabel`}
              data-preview-field-path={`${itemPath}.bookRepairLabel`}
              defaultValue={siteData?.content?.common?.header?.bookRepairLabel ?? "Book a Repair"}
              className="tracking-wide inline"
            />
          </button>
        </div>
      </div>
      {children}
    </Component>
  );
}