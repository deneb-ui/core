import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditablefooterProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: any;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Editablefooter({
  itemPath,
  data,
  as: Component = 'footer',
  className = '',
  style,
  children,
  ...props
}: EditablefooterProps) {
  const siteData = data;

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative pt-20 pb-12 overflow-clip bg-slate-50/80 border-t border-black/[0.08] ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-full max-w-4xl rounded-full bg-cyan-400/10 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-black/[0.06]">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 border border-cyan-400/30 text-cyan-600 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <EditableText
                  as="span"
                  id={`${itemPath}.auraCellularLabel`}
                  data-preview-field-path={`${itemPath}.auraCellularLabel`}
                  defaultValue={siteData?.content?.common?.footer?.auraCellularLabel ?? "AURA CELLULAR"}
                  className="text-lg font-extrabold tracking-wider text-zinc-950"
                />
                <EditableText
                  as="span"
                  id={`${itemPath}.precisionEngineeringRetailLabel`}
                  data-preview-field-path={`${itemPath}.precisionEngineeringRetailLabel`}
                  defaultValue={siteData?.content?.common?.footer?.precisionEngineeringRetailLabel ?? "Precision Engineering & Retail"}
                  className="text-[10px] uppercase font-mono tracking-widest text-cyan-600 font-semibold"
                />
              </div>
            </div>

            <EditableText
              as="p"
              id={`${itemPath}.description`}
              data-preview-field-path={`${itemPath}.description`}
              defaultValue={siteData?.content?.common?.footer?.description ?? "The premier destination for flagship smartphone acquisitions, certified restorations, and cleanroom hardware repairs. Swiss-watch precision applied to modern mobile technology."}
              className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm"
            />

            <div className="pt-2 flex items-center gap-4 text-xs text-zinc-600">
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <ShieldCheck className="h-4 w-4" />
                <EditableText
                  as="span"
                  id={`${itemPath}.certifiedOemLaboratoryLabel`}
                  data-preview-field-path={`${itemPath}.certifiedOemLaboratoryLabel`}
                  defaultValue={siteData?.content?.common?.footer?.certifiedOemLaboratoryLabel ?? "Certified OEM Laboratory"}
                />
              </div>
            </div>
          </div>

          <div>
            <EditableText
              as="h4"
              id={`${itemPath}.smartphoneShowroomSubheading`}
              data-preview-field-path={`${itemPath}.smartphoneShowroomSubheading`}
              defaultValue={siteData?.content?.common?.footer?.smartphoneShowroomSubheading ?? "Smartphone Showroom"}
              className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 mb-4"
            />
            <ul className="space-y-2.5 text-xs text-zinc-600" data-preview-list-path={`${itemPath}.smartphoneShowroom`}>
              {['iphone16ProProMax', 'samsungGalaxyS25UltraUrl', 'googlePixel9ProXl', 'certifiedRefurbishedGradeUrl', 'magsafeKevlarAccessoriesUrl', 'tradeUpgradesUrl'].map((item, index) => (
                <li key={index}>
                  <a
                    href={siteData?.content?.common?.footer?.[item] ?? "#shop"}
                    className="hover:text-cyan-600 transition-colors"
                    data-preview-field-path={`${item}.url`}
                  >
                    <EditableText
                      as="span"
                      id={`${item}.label`}
                      data-preview-field-path={`${item}.label`}
                      defaultValue={siteData?.content?.common?.footer?.[`${item}Label`] ?? item.replace(/([A-Z])/g, ' $1').trim()}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <EditableText
              as="h4"
              id={`${itemPath}.repairLaboratorySubheading`}
              data-preview-field-path={`${itemPath}.repairLaboratorySubheading`}
              defaultValue={siteData?.content?.common?.footer?.repairLaboratorySubheading ?? "Repair Laboratory"}
              className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 mb-4"
            />
            <ul className="space-y-2.5 text-xs text-zinc-600" data-preview-list-path={`${itemPath}.repairLaboratory`}>
              {['oemScreenOledReplacementUrl', 'highDensityBatterySwapsUrl', 'usbCMicroSolderingUrl', 'cameraSensorRealignmentUrl', 'ultrasonicLiquidIngressBathUrl', 'hardwareDiagnosticToolUrl'].map((item, index) => (
                <li key={index}>
                  <a
                    href={siteData?.content?.common?.footer?.[item] ?? "#repairs"}
                    className="hover:text-cyan-600 transition-colors"
                    data-preview-field-path={`${item}.url`}
                  >
                    <EditableText
                      as="span"
                      id={`${item}.label`}
                      data-preview-field-path={`${item}.label`}
                      defaultValue={siteData?.content?.common?.footer?.[`${item}Label`] ?? item.replace(/([A-Z])/g, ' $1').trim()}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <EditableText
              as="h4"
              id={`${itemPath}.flagshipLabHoursSubheading`}
              data-preview-field-path={`${itemPath}.flagshipLabHoursSubheading`}
              defaultValue={siteData?.content?.common?.footer?.flagshipLabHoursSubheading ?? "Flagship Lab & Hours"}
              className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 mb-4"
            />
            <div className="space-y-3 text-xs text-zinc-600">
              {['450LexingtonAvenueSuite1200', '1800840AuraLabel', 'conciergeAuraMobileTechLabel', 'monFri900Am', 'saturday1000Am7', 'sunday1100Am5'].map((item, index) => (
                <div className="flex items-start gap-2" key={index}>
                  {index === 0 && <MapPin className="h-4 w-4 shrink-0 text-cyan-600 mt-0.5" />}
                  {index === 1 && <Phone className="h-4 w-4 shrink-0 text-cyan-600" />}
                  {index === 2 && <Mail className="h-4 w-4 shrink-0 text-cyan-600" />}
                  {index >= 3 && <Clock className="h-3 w-3 text-cyan-600" />}
                  <EditableText
                    as={index < 3 ? 'span' : 'p'}
                    id={`${itemPath}.${item}`}
                    data-preview-field-path={`${itemPath}.${item}`}
                    defaultValue={siteData?.content?.common?.footer?.[item] ?? item.replace(/([A-Z])/g, ' $1').trim()}
                    className={index < 3 ? 'font-mono text-zinc-950 font-bold' : 'text-zinc-500 pl-4.5'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <EditableText
            as="p"
            id={`${itemPath}.auraCellularTechnologiesIncAll`}
            data-preview-field-path={`${itemPath}.auraCellularTechnologiesIncAll`}
            defaultValue={siteData?.content?.common?.footer?.auraCellularTechnologiesIncAll ?? `© ${new Date().getFullYear()} AURA Cellular Technologies Inc. All rights reserved.`}
          />

          <div className="flex items-center gap-6">
            {['privacyPolicyUrl', 'termsServiceUrl', 'lifetimeWarrantyTermsUrl', 'backTopUrl'].map((item, index) => (
              <a
                key={index}
                href={siteData?.content?.common?.footer?.[item] ?? "#faq"}
                className="hover:text-zinc-900 transition-colors"
                data-preview-field-path={`${item}.url`}
              >
                <EditableText
                  as="span"
                  id={`${itemPath}.${item}Label`}
                  data-preview-field-path={`${itemPath}.${item}Label`}
                  defaultValue={siteData?.content?.common?.footer?.[`${item}Label`] ?? item.replace(/([A-Z])/g, ' $1').trim()}
                />
              </a>
            ))}
            <a
              href="#hero"
              data-preview-field-path={`${itemPath}.backTopUrl`}
              className="hover:text-cyan-600 transition-colors flex items-center gap-1"
            >
              <EditableText
                as="span"
                id={`${itemPath}.backTopLabel`}
                data-preview-field-path={`${itemPath}.backTopLabel`}
                defaultValue={siteData?.content?.common?.footer?.backTopLabel ?? "Back to Top"}
              />
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center select-none overflow-clip">
          <EditableText
            as="span"
            id={`${itemPath}.auraCellularLabel2`}
            data-preview-field-path={`${itemPath}.auraCellularLabel2`}
            defaultValue={siteData?.content?.common?.footer?.auraCellularLabel2 ?? "AURA CELLULAR"}
            className="text-[13vw] font-black uppercase tracking-tighter text-black/[0.03] leading-none block"
          />
        </div>
      </div>
    </Component>
  );
}