import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface BrandInfo {
  id: string | number;
  name: string;
  origin: string;
  bannerImage: string;
  badge: string;
  motto: string;
  horsepowerRange: string;
  flagshipModel: string;
}

export interface EditablebrandSelectorProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  brands: BrandInfo[];
  selectedBrand: BrandInfo;
  onSelectBrand: (brandName: string) => void;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditablebrandSelector({
  itemPath,
  brands,
  selectedBrand,
  onSelectBrand,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  ...props
}: EditablebrandSelectorProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative w-full min-h-screen py-28 bg-[#050608] flex flex-col justify-between overflow-hidden select-none ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="absolute inset-0 z-0">
        <EditableImage
          id={`${itemPath}.bannerImage`}
          data-preview-field-path={`${itemPath}.bannerImage`}
          src={selectedBrand.bannerImage}
          fallbackSrc={imageFallback}
          alt={selectedBrand.name}
          className="relative w-full h-full object-cover object-center brightness-[0.4] contrast-[1.12]"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <EditableText
              as="span"
              id={`${itemPath}.marqueSelectionLabel`}
              data-preview-field-path={`${itemPath}.marqueSelectionLabel`}
              defaultValue="MARQUE SELECTION"
              className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase font-semibold"
            />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
            <EditableText
              as="span"
              id={`${itemPath}.heading`}
              data-preview-field-path={`${itemPath}.heading`}
              defaultValue="CHOOSE"
            />
            <br />
            <EditableText
              as="span"
              id={`${itemPath}.yourObsessionLabel`}
              data-preview-field-path={`${itemPath}.yourObsessionLabel`}
              defaultValue="YOUR OBSESSION."
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300"
            />
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col divide-y divide-white/[0.08]">
            {brands.map((brand) => {
              const isSelected = selectedBrand.id === brand.id;
              return (
                <div
                  key={brand.id}
                  onMouseEnter={() => onSelectBrand(brand.name)}
                  onClick={() => onSelectBrand(brand.name)}
                  className="group py-5 sm:py-6 flex items-center justify-between cursor-pointer transition-all"
                  data-cursor="SELECT"
                  data-preview-item-path={`${itemPath}.brands.${brand.id}`}
                >
                  <div className="flex items-center gap-5">
                    <EditableText
                      as="span"
                      id={`${itemPath}.origin`}
                      data-preview-field-path={`${itemPath}.origin`}
                      defaultValue={brand.origin.split(',')[0]}
                      className="font-mono text-xs text-neutral-500 group-hover:text-red-400 transition-colors"
                    />
                    <EditableText
                      as="h3"
                      id={`${itemPath}.name`}
                      data-preview-field-path={`${itemPath}.name`}
                      defaultValue={brand.name}
                      className={`font-display font-black text-2xl sm:text-4xl uppercase tracking-tight transition-all duration-300 ${
                        isSelected
                          ? 'text-white translate-x-3'
                          : 'text-neutral-400 group-hover:text-neutral-200 group-hover:translate-x-2'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl glass-panel border border-white/15 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <EditableText
                  as="span"
                  id={`${itemPath}.badge`}
                  data-preview-field-path={`${itemPath}.badge`}
                  defaultValue={selectedBrand.badge}
                  className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-white/10 text-neutral-300 border border-white/10"
                />
                <EditableText
                  as="span"
                  id={`${itemPath}.origin`}
                  data-preview-field-path={`${itemPath}.origin`}
                  defaultValue={selectedBrand.origin}
                  className="text-xs font-mono text-neutral-400"
                />
              </div>
              <EditableText
                as="h4"
                id={`${itemPath}.name`}
                data-preview-field-path={`${itemPath}.name`}
                defaultValue={selectedBrand.name}
                className="font-display font-extrabold text-3xl text-white uppercase mb-2"
              />
              <EditableText
                as="p"
                id={`${itemPath}.motto`}
                data-preview-field-path={`${itemPath}.motto`}
                defaultValue={selectedBrand.motto}
                className="text-xs font-mono text-red-400 uppercase tracking-wider mb-4"
              />
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                <EditableText
                  as="span"
                  id={`${itemPath}.flagshipCurationLabel`}
                  data-preview-field-path={`${itemPath}.flagshipCurationLabel`}
                  defaultValue="FLAGSHIP CURATION"
                  className="text-[10px] font-mono text-neutral-400 uppercase block mb-1"
                />
                <EditableText
                  as="span"
                  id={`${itemPath}.flagshipModel`}
                  data-preview-field-path={`${itemPath}.flagshipModel`}
                  defaultValue={selectedBrand.flagshipModel}
                  className="font-display font-bold text-lg text-white"
                />
                <EditableText
                  as="span"
                  id={`${itemPath}.powerOutputLabel`}
                  data-preview-field-path={`${itemPath}.powerOutputLabel`}
                  defaultValue={`Power Output: ${selectedBrand.horsepowerRange}`}
                  className="block text-xs font-mono text-neutral-400 mt-1"
                />
              </div>
              <button
                onClick={() => onSelectBrand(selectedBrand.name)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-lg flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] transition-all cursor-pointer"
                data-cursor="INSPECT"
              >
                <EditableText
                  as="span"
                  id={`${itemPath}.exploreInventoryLabel`}
                  data-preview-field-path={`${itemPath}.exploreInventoryLabel`}
                  defaultValue={`EXPLORE INVENTORY ${selectedBrand.name.toUpperCase()}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}