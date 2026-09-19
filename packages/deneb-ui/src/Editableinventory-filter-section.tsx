import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableinventoryFilterSectionProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: any;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableinventoryFilterSection({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditableinventoryFilterSectionProps) {
  const siteData = data.siteData || {};
  const brands = ['All', 'Porsche', 'Ferrari', 'Lamborghini', 'McLaren', 'Aston Martin', 'Mercedes-AMG', 'Audi RS'];
  const bodyTypes = ['All', 'Supercar', 'Hypercar', 'Track Special', 'Grand Tourer'];

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative w-full py-28 bg-[#050608] select-none ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <EditableText
              as="span"
              id={`${itemPath}.completeInventoryRepositoryLabel`}
              data-preview-field-path={`${itemPath}.completeInventoryRepositoryLabel`}
              defaultValue={siteData?.content?.home?.completeInventoryRepositoryLabel ?? "COMPLETE INVENTORY REPOSITORY"}
              className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase font-semibold"
            />
          </div>
          <EditableText
            as="h2"
            id={`${itemPath}.heading7`}
            data-preview-field-path={`${itemPath}.heading7`}
            defaultValue={siteData?.content?.home?.heading7 ?? "FIND YOUR"}
            className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight"
          />
          <EditableText
            as="span"
            id={`${itemPath}.nextMachineLabel`}
            data-preview-field-path={`${itemPath}.nextMachineLabel`}
            defaultValue={siteData?.content?.home?.nextMachineLabel ?? "NEXT MACHINE."}
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400"
          />
          <EditableText
            as="p"
            id={`${itemPath}.description5`}
            data-preview-field-path={`${itemPath}.description5`}
            defaultValue={siteData?.content?.home?.description5 ?? "Filter our curated hypercar and sports car portfolio by powertrain, downforce, aerodynamic classification, and output."}
            className="text-sm text-neutral-400 font-light mt-4"
          />
        </div>

        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.08]">
            <div className="relative flex-1">
              <EditableText
                as="input"
                id={`${itemPath}.searchModelBrandPowertrainPlaceholder`}
                data-preview-field-path={`${itemPath}.searchModelBrandPowertrainPlaceholder`}
                defaultValue={siteData?.content?.home?.searchModelBrandPowertrainPlaceholder ?? "Search by model, brand, or powertrain..."}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-red-500 focus:outline-none text-white text-xs sm:text-sm font-mono placeholder:text-neutral-600 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <EditableText
                as="span"
                id={`${itemPath}.sortLabel`}
                data-preview-field-path={`${itemPath}.sortLabel`}
                defaultValue={siteData?.content?.home?.sortLabel ?? "SORT BY:"}
                className="text-xs font-mono text-neutral-400 uppercase whitespace-nowrap"
              />
              <select
                className="px-4 py-3 rounded-xl bg-[#0B0D12] border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="power">Most Powerful (HP)</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="newest">Newest Model Year</option>
              </select>
            </div>
          </div>

          <div className="mb-5">
            <EditableText
              as="span"
              id={`${itemPath}.marqueFilterLabel`}
              data-preview-field-path={`${itemPath}.marqueFilterLabel`}
              defaultValue={siteData?.content?.home?.marqueFilterLabel ?? "MARQUE FILTER:"}
              className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase block mb-2.5"
            />
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {brands.map((b) => (
                <button
                  key={b}
                  className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${b === 'All' ? 'bg-red-600 text-white font-bold' : 'bg-white/[0.04] text-neutral-400 hover:text-white border border-white/10'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/[0.08]">
            <div>
              <EditableText
                as="span"
                id={`${itemPath}.bodyClassificationLabel`}
                data-preview-field-path={`${itemPath}.bodyClassificationLabel`}
                defaultValue={siteData?.content?.home?.bodyClassificationLabel ?? "BODY CLASSIFICATION:"}
                className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase block mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {bodyTypes.map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all cursor-pointer ${type === 'All' ? 'bg-white text-black font-bold' : 'bg-white/[0.03] text-neutral-400 hover:text-white border border-white/10'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 px-2">
          <div className="text-xs font-mono text-neutral-400">
            <EditableText
              as="span"
              id={`${itemPath}.showingExtraordinaryMachines`}
              data-preview-field-path={`${itemPath}.showingExtraordinaryMachines`}
              defaultValue={siteData?.content?.home?.showingExtraordinaryMachines ?? "SHOWING EXTRAORDINARY MACHINES"}
            />
          </div>
        </div>

        {children}
      </div>
    </Component>
  );
}