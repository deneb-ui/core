import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableFinancingCalculatorSectionProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: {
    bespokeFinancialSolutionsLabel?: string;
    heading4?: string;
    yoursLabel?: string;
    description3?: string;
    selectAllocationLabel?: string;
    downPaymentLabel?: string;
    label?: string;
    financingTermLabel?: string;
    tradeValuationEstimateLabel?: string;
    structuredEstimateLabel?: string;
    msrpPriceLabel?: string;
    downPaymentLabel2?: string;
    estimatedTradeCreditLabel?: string;
    estimatedAprLabel?: string;
    estimatedMonthlyPaymentLabel?: string;
    monthLabel?: string;
    excludesStateLuxuryTaxRegistration?: string;
    testDriveLabel?: string;
    contactVipLabel?: string;
    moLabel?: string;
  };
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableFinancingCalculatorSection({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditableFinancingCalculatorSectionProps) {
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
            <span className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase font-semibold">
              <EditableText
                as="span"
                id={`${itemPath}.bespokeFinancialSolutionsLabel`}
                data-preview-field-path={`${itemPath}.bespokeFinancialSolutionsLabel`}
                defaultValue={data.bespokeFinancialSolutionsLabel ?? "BESPOKE FINANCIAL SOLUTIONS"}
              />
            </span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
            <EditableText
              as="span"
              id={`${itemPath}.heading4`}
              data-preview-field-path={`${itemPath}.heading4`}
              defaultValue={data.heading4 ?? "MAKE IT"}
            />
            <br />
            <EditableText
              as="span"
              id={`${itemPath}.yoursLabel`}
              data-preview-field-path={`${itemPath}.yoursLabel`}
              defaultValue={data.yoursLabel ?? "YOURS."}
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400"
            />
          </h2>
          <p className="text-sm text-neutral-400 font-light mt-4">
            <EditableText
              as="span"
              id={`${itemPath}.description3`}
              data-preview-field-path={`${itemPath}.description3`}
              defaultValue={data.description3 ?? "Tailored private client financing, bespoke lease structures, and global discrete acquisition options tailored for collectors."}
            />
          </p>
        </div>
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <label className="text-xs font-mono tracking-wider text-neutral-400 uppercase block mb-2">
                  <EditableText
                    as="span"
                    id={`${itemPath}.selectAllocationLabel`}
                    data-preview-field-path={`${itemPath}.selectAllocationLabel`}
                    defaultValue={data.selectAllocationLabel ?? "SELECT ALLOCATION:"}
                  />
                </label>
                <select className="w-full p-3.5 rounded-xl bg-[#0B0D12] border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-red-500 cursor-pointer">
                  {/* Options would be populated here */}
                </select>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-neutral-400 uppercase">
                    <EditableText
                      as="span"
                      id={`${itemPath}.downPaymentLabel`}
                      data-preview-field-path={`${itemPath}.downPaymentLabel`}
                      defaultValue={data.downPaymentLabel ?? "DOWN PAYMENT"}
                    />
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    <EditableText
                      as="span"
                      id={`${itemPath}.label`}
                      data-preview-field-path={`${itemPath}.label`}
                      defaultValue={data.label ?? "% ($)"} 
                    />
                    {/* Value would be calculated and displayed here */}
                  </span>
                </div>
                <input type="range" min={10} max={60} step={5} className="w-full accent-red-600 cursor-pointer" />
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <span className="text-xs font-mono text-neutral-400 uppercase block mb-3">
                  <EditableText
                    as="span"
                    id={`${itemPath}.financingTermLabel`}
                    data-preview-field-path={`${itemPath}.financingTermLabel`}
                    defaultValue={data.financingTermLabel ?? "FINANCING TERM"}
                  />
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[24, 36, 48, 60].map((term) => (
                    <button key={term} className={`py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer`}>
                      <EditableText
                        as="span"
                        id={`${itemPath}.moLabel`}
                        data-preview-field-path={`${itemPath}.moLabel`}
                        defaultValue={data.moLabel ?? "MO"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-neutral-400 uppercase">
                    <EditableText
                      as="span"
                      id={`${itemPath}.tradeValuationEstimateLabel`}
                      data-preview-field-path={`${itemPath}.tradeValuationEstimateLabel`}
                      defaultValue={data.tradeValuationEstimateLabel ?? "TRADE-IN VALUATION ESTIMATE"}
                    />
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    {/* Value would be displayed here */}
                  </span>
                </div>
                <input type="range" min={0} max={120000} step={5000} className="w-full accent-red-600 cursor-pointer" />
              </div>
            </div>
            <div className="lg:col-span-5 p-8 rounded-3xl bg-[#0B0D12]/90 border border-white/15 shadow-2xl relative overflow-hidden">
              <span className="text-[10px] font-mono tracking-widest text-red-400 uppercase font-bold block mb-1">
                <EditableText
                  as="span"
                  id={`${itemPath}.structuredEstimateLabel`}
                  data-preview-field-path={`${itemPath}.structuredEstimateLabel`}
                  defaultValue={data.structuredEstimateLabel ?? "STRUCTURED ESTIMATE"}
                />
              </span>
              <h3 className="font-display font-black text-2xl text-white uppercase mb-6">
                {/* Selected car name would be displayed here */}
              </h3>
              <div className="space-y-3 pb-6 border-b border-white/10 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>
                    <EditableText
                      as="span"
                      id={`${itemPath}.msrpPriceLabel`}
                      data-preview-field-path={`${itemPath}.msrpPriceLabel`}
                      defaultValue={data.msrpPriceLabel ?? "MSRP Price"}
                    />
                  </span>
                  <span className="text-white font-bold">
                    {/* Selected car price would be displayed here */}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>
                    <EditableText
                      as="span"
                      id={`${itemPath}.downPaymentLabel2`}
                      data-preview-field-path={`${itemPath}.downPaymentLabel2`}
                      defaultValue={data.downPaymentLabel2 ?? "Down Payment (%)"}
                    />
                  </span>
                  <span className="text-white">
                    {/* Down payment value would be displayed here */}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>
                    <EditableText
                      as="span"
                      id={`${itemPath}.estimatedTradeCreditLabel`}
                      data-preview-field-path={`${itemPath}.estimatedTradeCreditLabel`}
                      defaultValue={data.estimatedTradeCreditLabel ?? "Estimated Trade-in Credit"}
                    />
                  </span>
                  <span className="text-emerald-400">
                    {/* Trade-in value would be displayed here */}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>
                    <EditableText
                      as="span"
                      id={`${itemPath}.estimatedAprLabel`}
                      data-preview-field-path={`${itemPath}.estimatedAprLabel`}
                      defaultValue={data.estimatedAprLabel ?? "Estimated APR"}
                    />
                  </span>
                  <span className="text-white">
                    {/* Interest rate would be displayed here */}
                  </span>
                </div>
              </div>
              <div className="py-6">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  <EditableText
                    as="span"
                    id={`${itemPath}.estimatedMonthlyPaymentLabel`}
                    data-preview-field-path={`${itemPath}.estimatedMonthlyPaymentLabel`}
                    defaultValue={data.estimatedMonthlyPaymentLabel ?? "ESTIMATED MONTHLY PAYMENT"}
                  />
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-tech text-4xl sm:text-5xl font-black text-white">
                    {/* Monthly payment value would be displayed here */}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    <EditableText
                      as="span"
                      id={`${itemPath}.monthLabel`}
                      data-preview-field-path={`${itemPath}.monthLabel`}
                      defaultValue={data.monthLabel ?? "/ month"}
                    />
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
                  <EditableText
                    as="span"
                    id={`${itemPath}.excludesStateLuxuryTaxRegistration`}
                    data-preview-field-path={`${itemPath}.excludesStateLuxuryTaxRegistration`}
                    defaultValue={data.excludesStateLuxuryTaxRegistration ?? "Excludes state luxury tax & registration. Subject to tier-1 credit approval."}
                  />
                </span>
              </div>
              <div className="space-y-3 pt-2">
                <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-lg hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2">
                  {/* Offer request button content */}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[11px] uppercase transition-all cursor-pointer">
                    <EditableText
                      as="span"
                      id={`${itemPath}.testDriveLabel`}
                      data-preview-field-path={`${itemPath}.testDriveLabel`}
                      defaultValue={data.testDriveLabel ?? "TEST DRIVE"}
                    />
                  </button>
                  <button className="py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[11px] uppercase transition-all cursor-pointer">
                    <EditableText
                      as="span"
                      id={`${itemPath}.contactVipLabel`}
                      data-preview-field-path={`${itemPath}.contactVipLabel`}
                      defaultValue={data.contactVipLabel ?? "CONTACT VIP"}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}