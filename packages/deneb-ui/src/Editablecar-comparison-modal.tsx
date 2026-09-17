import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface CarSpec {
  id: string;
  name: string;
  brand: string;
  image: string;
  formattedPrice: string;
  horsepower: number;
  acceleration: number;
  topSpeed: number;
  torque: number;
  engine: string;
  transmission: string;
  drivetrain: string;
  weight: number;
}

export interface EditablecarComparisonModalProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  compareCars: CarSpec[];
  imageFallback?: string;
  as?: React.ElementType;
  onClose: () => void;
  onRemoveFromCompare: (carId: string) => void;
  onClearAll: () => void;
  onSelectCar: (car: CarSpec) => void;
}

export function EditablecarComparisonModal({
  itemPath,
  compareCars,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  onClose,
  onRemoveFromCompare,
  onClearAll,
  onSelectCar,
  className = '',
  style,
  ...props
}: EditablecarComparisonModalProps) {
  const maxHp = Math.max(...compareCars.map((c) => c.horsepower), 1);
  const min0to100 = Math.min(...compareCars.map((c) => c.acceleration), 1);
  const maxSpeed = Math.max(...compareCars.map((c) => c.topSpeed), 1);

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-car-comparison-modal ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <EditableText
            as="h2"
            id={`${itemPath}.heading`}
            data-preview-field-path={`${itemPath}.heading`}
            defaultValue="BENCHMARK COMPARISON"
            className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight"
          />
          <EditableText
            as="span"
            id={`${itemPath}.sideSideTechnicalTelemetryEvaluation`}
            data-preview-field-path={`${itemPath}.sideSideTechnicalTelemetryEvaluation`}
            defaultValue="SIDE-BY-SIDE TECHNICAL TELEMETRY EVALUATION"
            className="text-xs font-mono text-neutral-400"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClearAll}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-neutral-400 hover:text-red-400 bg-white/[0.03] border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span
              data-preview-field-path={`${itemPath}.clearAllLabel`}
              data-preview-style-target={`${itemPath}.clearAllLabel`}
              data-preview-style-type="text">CLEAR ALL</span>
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <span className="w-5 h-5" />
          </button>
        </div>
      </div>

      {compareCars.length === 0 ? (
        <div className="py-20 text-center">
          <EditableText
            as="p"
            id={`${itemPath}.subtitle`}
            data-preview-field-path={`${itemPath}.subtitle`}
            defaultValue="No vehicles selected for comparison. Add up to 3 machines from the inventory."
            className="text-sm font-mono text-neutral-400 mb-4"
          />
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-red-600 text-white font-mono text-xs uppercase cursor-pointer"
            data-preview-field-path={`${itemPath}.exploreInventoryLabel`}
            data-preview-style-target={`${itemPath}.exploreInventoryLabel`}
            data-preview-style-type="button">EXPLORE INVENTORY</button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {compareCars.map((car) => (
              <div
                key={car.id}
                className="relative rounded-2xl overflow-hidden glass-card border border-white/10 p-5 flex flex-col justify-between h-72"
                data-preview-item-path={`${itemPath}.car.${car.id}`}
              >
                <EditableImage
                  id={`${itemPath}.car.${car.id}.image`}
                  data-preview-field-path={`${itemPath}.car.${car.id}.image`}
                  src={car.image}
                  fallbackSrc={imageFallback}
                  alt={car.name}
                  className="object-cover object-center brightness-75"
                />
                <div className="relative z-10 flex justify-between items-start">
                  <EditableText
                    as="span"
                    id={`${itemPath}.car.${car.id}.brand`}
                    data-preview-field-path={`${itemPath}.car.${car.id}.brand`}
                    defaultValue={car.brand}
                    className="text-[10px] font-mono tracking-widest text-red-400 uppercase font-bold"
                  />
                  <button
                    onClick={() => onRemoveFromCompare(car.id)}
                    className="p-1.5 rounded-full bg-black/60 hover:bg-red-600 text-white transition-colors cursor-pointer"
                    title="Remove machine"
                  >
                    <span className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="relative z-10 mt-auto">
                  <EditableText
                    as="h4"
                    id={`${itemPath}.car.${car.id}.name`}
                    data-preview-field-path={`${itemPath}.car.${car.id}.name`}
                    defaultValue={car.name}
                    className="font-display font-black text-xl text-white uppercase leading-tight mb-1"
                  />
                  <EditableText
                    as="span"
                    id={`${itemPath}.car.${car.id}.formattedPrice`}
                    data-preview-field-path={`${itemPath}.car.${car.id}.formattedPrice`}
                    defaultValue={car.formattedPrice}
                    className="font-tech text-lg font-bold text-red-400 block mb-3"
                  />
                  <button
                    onClick={() => {
                      onClose();
                      onSelectCar(car);
                    }}
                    className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <EditableText
                      as="span"
                      id={`${itemPath}.car.${car.id}.inspectSpecLabel`}
                      data-preview-field-path={`${itemPath}.car.${car.id}.inspectSpecLabel`}
                      defaultValue="INSPECT SPEC"
                      className="flex items-center justify-center"
                    />
                    <span className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Component>
  );
}