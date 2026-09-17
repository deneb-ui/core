import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface CarSpec {
  heroImage?: string;
  image?: string;
  name?: string;
  tagline?: string;
  year?: string;
  formattedPrice?: string;
  description?: string;
  horsepower?: string;
  acceleration?: string;
  topSpeed?: string;
  torque?: string;
  weight?: string;
  bodyType?: string;
  colorName?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  soundProfile?: {
    exhaustNoteDescription?: string;
  };
  features?: string[];
  gallery?: string[];
  [key: string]: unknown;
}

export interface EditablevehicleModalDetailProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  car: CarSpec | null;
  imageFallback?: string;
  as?: React.ElementType;
  onClose: () => void;
  onBookTestDrive: (car: CarSpec) => void;
  onReserve: (car: CarSpec) => void;
}

export function EditablevehicleModalDetail({
  itemPath,
  car,
  onClose,
  onBookTestDrive,
  onReserve,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  ...props
}: EditablevehicleModalDetailProps) {
  if (!car) return null;

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-vehicle-modal-detail ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="relative w-full h-80 sm:h-[420px] overflow-hidden rounded-t-3xl">
        <EditableImage
          id={`${itemPath}.heroImage`}
          data-preview-field-path={`${itemPath}.heroImage`}
          src={car.heroImage || car.image}
          fallbackSrc={imageFallback}
          alt={car.name}
          className="object-cover object-center brightness-[0.85] contrast-[1.08]"
        />
        <div className="absolute bottom-6 left-6 sm:left-10 max-w-2xl">
          <EditableText
            as="span"
            id={`${itemPath}.brand`}
            data-preview-field-path={`${itemPath}.brand`}
            defaultValue={`${car.brand} · OFFICIAL ALLOCATION ${car.year}`}
            className="text-[11px] font-mono tracking-[0.3em] text-red-400 uppercase font-bold"
          />
          <EditableText
            as="h1"
            id={`${itemPath}.name`}
            data-preview-field-path={`${itemPath}.name`}
            defaultValue={car.name}
            className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight mt-1"
          />
          <EditableText
            as="p"
            id={`${itemPath}.tagline`}
            data-preview-field-path={`${itemPath}.tagline`}
            defaultValue={car.tagline}
            className="text-xs sm:text-sm font-mono text-neutral-300 mt-2"
          />
        </div>
      </div>

      <div className="p-6 sm:p-10">
        <div>
          <h3
            className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-3"
            data-preview-field-path={`${itemPath}.chassisPowertrainSummarySubheading`}
          >
            <EditableText
              as="span"
              id={`${itemPath}.chassisPowertrainSummarySubheading`}
              data-preview-field-path={`${itemPath}.chassisPowertrainSummarySubheading`}
              defaultValue="CHASSIS & POWERTRAIN SUMMARY"
            />
          </h3>
          <EditableText
            as="p"
            id={`${itemPath}.description`}
            data-preview-field-path={`${itemPath}.description`}
            defaultValue={car.description}
            className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
          <div className="p-3">
            <EditableText
              as="span"
              id={`${itemPath}.horsepowerLabel`}
              data-preview-field-path={`${itemPath}.horsepowerLabel`}
              defaultValue="HORSEPOWER"
              className="text-[10px] font-mono text-neutral-400 uppercase block"
            />
            <EditableText
              as="span"
              id={`${itemPath}.horsepower`}
              data-preview-field-path={`${itemPath}.horsepower`}
              defaultValue={car.horsepower}
              className="font-tech text-2xl font-bold text-white"
            />
          </div>
          <div className="p-3 border-l border-white/10">
            <EditableText
              as="span"
              id={`${itemPath}.accelerationLabel`}
              data-preview-field-path={`${itemPath}.accelerationLabel`}
              defaultValue="0-100 KM/H"
              className="text-[10px] font-mono text-neutral-400 uppercase block"
            />
            <EditableText
              as="span"
              id={`${itemPath}.acceleration`}
              data-preview-field-path={`${itemPath}.acceleration`}
              defaultValue={car.acceleration}
              className="font-tech text-2xl font-bold text-white"
            />
          </div>
          <div className="p-3 border-l border-white/10">
            <EditableText
              as="span"
              id={`${itemPath}.topSpeedLabel`}
              data-preview-field-path={`${itemPath}.topSpeedLabel`}
              defaultValue="TOP SPEED"
              className="text-[10px] font-mono text-neutral-400 uppercase block"
            />
            <EditableText
              as="span"
              id={`${itemPath}.topSpeed`}
              data-preview-field-path={`${itemPath}.topSpeed`}
              defaultValue={car.topSpeed}
              className="font-tech text-2xl font-bold text-white"
            />
          </div>
          <div className="p-3 border-l border-white/10">
            <EditableText
              as="span"
              id={`${itemPath}.torqueLabel`}
              data-preview-field-path={`${itemPath}.torqueLabel`}
              defaultValue="TORQUE"
              className="text-[10px] font-mono text-neutral-400 uppercase block"
            />
            <EditableText
              as="span"
              id={`${itemPath}.torque`}
              data-preview-field-path={`${itemPath}.torque`}
              defaultValue={car.torque}
              className="font-tech text-2xl font-bold text-white"
            />
          </div>
        </div>

        <div>
          <h3
            className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-4"
            data-preview-field-path={`${itemPath}.highResolutionGallerySubheading`}
          >
            <EditableText
              as="span"
              id={`${itemPath}.highResolutionGallerySubheading`}
              data-preview-field-path={`${itemPath}.highResolutionGallerySubheading`}
              defaultValue="HIGH-RESOLUTION GALLERY"
            />
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {car.gallery.map((img, i) => (
              <div
                key={i}
                className="relative h-28 sm:h-36 rounded-xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all cursor-pointer group"
              >
                <EditableImage
                  id={`${itemPath}.gallery.${i}`}
                  data-preview-field-path={`${itemPath}.gallery.${i}`}
                  src={img}
                  fallbackSrc={imageFallback}
                  alt={`${car.name} gallery ${i + 1}`}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Component>
  );
}