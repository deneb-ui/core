import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableEditorialAboutAndReviewsProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: any;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableEditorialAboutAndReviews({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'section',
  className = '',
  style,
  children,
  ...props
}: EditableEditorialAboutAndReviewsProps) {
  const siteData = data?.content?.home?.about || {};
  
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`relative w-full py-32 bg-[#050608] select-none overflow-hidden ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <EditableText
                as="span"
                id={`${itemPath}.heritagePhilosophyLabel`}
                data-preview-field-path={`${itemPath}.heritagePhilosophyLabel`}
                defaultValue={siteData?.heritagePhilosophyLabel ?? "HERITAGE & PHILOSOPHY"}
                className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase font-semibold"
              />
            </div>
            <EditableText
              as="h2"
              id={`${itemPath}.heading2`}
              data-preview-field-path={`${itemPath}.heading2`}
              defaultValue={siteData?.heading2 ?? "PASSION"}
              className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[0.95] mb-6"
            />
            <EditableText
              as="span"
              id={`${itemPath}.drivesUsLabel`}
              data-preview-field-path={`${itemPath}.drivesUsLabel`}
              defaultValue={siteData?.drivesUsLabel ?? "DRIVES US."}
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400"
            />
            <EditableText
              as="p"
              id={`${itemPath}.description`}
              data-preview-field-path={`${itemPath}.description`}
              defaultValue={siteData?.description ?? "Founded by endurance racers and dedicated hypercar collectors, APEX MOTORS rejects the formulaic dealership archetype. We curate only exceptional performance machines engineered for drivers who refuse compromises."}
              className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed mb-6"
            />
            <EditableText
              as="p"
              id={`${itemPath}.description2`}
              data-preview-field-path={`${itemPath}.description2`}
              defaultValue={siteData?.description2 ?? "Every chassis in our private collection undergoes comprehensive 200-point laser alignment, dynamometer verification, and provenance authentication before joining the showroom portfolio."}
              className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed mb-8"
            />
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'globalEnclosedAirFreightLabel', default: 'Global Enclosed Air-Freight' },
                { label: 'discretePrivateTransactionsLabel', default: 'Discrete Private Transactions' },
                { label: 'factoryAllocationAccessLabel', default: 'Factory Allocation Access' },
                { label: 'fiaTrackSupportConciergeLabel', default: 'FIA Track Support Concierge' },
              ].map(({ label, default: defaultValue }) => (
                <div key={label} className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                  <EditableText
                    as="span"
                    id={`${itemPath}.${label}`}
                    data-preview-field-path={`${itemPath}.${label}`}
                    defaultValue={siteData[label] ?? defaultValue}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 relative h-[450px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
            <EditableImage
              id={`${itemPath}.apexAtelierPrivateVillaCollection`}
              data-preview-field-path={`${itemPath}.apexAtelierPrivateVillaCollection`}
              src={siteData?.apexAtelierPrivateVillaCollection ?? "/images/cars/aston-martin-dbs-villa.jpg"}
              fallbackSrc={imageFallback}
              alt={siteData?.imageAlt ?? "APEX Atelier & Private Villa Collection"}
              className="object-cover object-center brightness-[0.85] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-xl border border-white/15 flex items-center justify-between">
              <div>
                <EditableText
                  as="span"
                  id={`${itemPath}.flagshipAtelierLabel`}
                  data-preview-field-path={`${itemPath}.flagshipAtelierLabel`}
                  defaultValue={siteData?.flagshipAtelierLabel ?? "FLAGSHIP ATELIER"}
                  className="text-[10px] font-mono text-red-400 uppercase tracking-wider block"
                />
                <EditableText
                  as="span"
                  id={`${itemPath}.zurichPrivateGalleryLabel`}
                  data-preview-field-path={`${itemPath}.zurichPrivateGalleryLabel`}
                  defaultValue={siteData?.zurichPrivateGalleryLabel ?? "ZURICH PRIVATE GALLERY"}
                  className="font-display font-bold text-sm text-white"
                />
              </div>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-28">
          {SHOWROOM_STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl glass-card border border-white/10 relative"
            >
              <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight block mb-1">
                {stat.value}
              </span>
              <span className="text-xs font-mono text-red-400 uppercase tracking-wider font-bold block mb-1">
                {stat.label}
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                {stat.detail}
              </span>
            </motion.div>
          ))}
        </div>
        <div>
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-xs font-mono tracking-widest uppercase mb-3">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <EditableText
                as="span"
                id={`${itemPath}.collectorExperiencesLabel`}
                data-preview-field-path={`${itemPath}.collectorExperiencesLabel`}
                defaultValue={siteData?.collectorExperiencesLabel ?? "COLLECTOR EXPERIENCES"}
              />
            </div>
            <EditableText
              as="h3"
              id={`${itemPath}.commissionedDeliveredSubheading`}
              data-preview-field-path={`${itemPath}.commissionedDeliveredSubheading`}
              defaultValue={siteData?.commissionedDeliveredSubheading ?? "COMMISSIONED & DELIVERED"}
              className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLIENT_REVIEWS.map((rev, idx) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="p-8 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between relative group hover:border-red-500/30 transition-all duration-300"
              >
                <Quote className="w-8 h-8 text-white/10 mb-4 group-hover:text-red-500/20 transition-colors" />
                <EditableText
                  as="p"
                  id={`${itemPath}.quote.${rev.id}`}
                  data-preview-static="decorative-copy"
                  defaultValue={`“${rev.quote}”`}
                  className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-6 italic"
                />
                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/15 flex items-center justify-center font-mono text-xs font-bold text-red-400">
                    {rev.avatarInitials}
                  </div>
                  <div>
                    <EditableText
                      as="h5"
                      id={`${itemPath}.name.${rev.id}`}
                      data-preview-field-path={`${itemPath}.name.${rev.id}`}
                      defaultValue={rev.name}
                      className="font-display font-bold text-sm text-white"
                    />
                    <EditableText
                      as="span"
                      id={`${itemPath}.car.${rev.id}`}
                      data-preview-field-path={`${itemPath}.car.${rev.id}`}
                      defaultValue={rev.car}
                      className="text-[10px] font-mono text-red-400 block"
                    />
                    <EditableText
                      as="span"
                      id={`${itemPath}.location.${rev.id}`}
                      data-preview-field-path={`${itemPath}.location.${rev.id}`}
                      defaultValue={rev.location}
                      className="text-[9px] font-mono text-neutral-500"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Component>
  );
}