import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditablebookRepairModalProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  siteData: any;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditablebookRepairModal({
  itemPath,
  siteData,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}: EditablebookRepairModalProps) {
  const model = String(siteData?.content?.home?.targetDeviceLabel || '');
  const selectedIssue = String(siteData?.content?.home?.serviceLabel || '');
  const date = String(siteData?.content?.home?.preferredSlot || '');

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-book-repair-modal ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
        />
        <div className="relative w-full max-w-2xl rounded-3xl border border-black/[0.1] bg-white/95 p-5 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto my-auto">
          <button
            className="absolute right-4 top-4 sm:right-5 sm:top-5 rounded-full p-2 text-zinc-400 hover:text-zinc-950 hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <EditableText
              as="span"
              id={`${itemPath}.closeButton`}
              data-preview-field-path={`${itemPath}.closeButton`}
              defaultValue="Close"
              className="h-5 w-5"
            />
          </button>
          <div>
            <div className="mb-6">
              <EditableText
                as="h3"
                id={`${itemPath}.schedulePriorityRepairSubheading`}
                data-preview-field-path={`${itemPath}.schedulePriorityRepairSubheading`}
                defaultValue={siteData?.content?.home?.schedulePriorityRepairSubheading ?? "Schedule Your Priority Repair"}
                className="mt-1 text-2xl font-bold text-zinc-950 tracking-tight"
              />
              <EditableText
                as="p"
                id={`${itemPath}.subtitle5`}
                data-preview-field-path={`${itemPath}.subtitle5`}
                defaultValue={siteData?.content?.home?.subtitle5 ?? "Genuine OEM parts. Average turnaround under 30 minutes with Lifetime Warranty."}
                className="mt-1 text-sm text-zinc-600"
              />
            </div>
            <div className="rounded-xl border border-black/[0.06] bg-slate-50 p-3.5 flex items-center justify-between text-xs">
              <div>
                <EditableText
                  as="span"
                  id={`${itemPath}.targetDeviceLabel`}
                  data-preview-field-path={`${itemPath}.targetDeviceLabel`}
                  defaultValue={siteData?.content?.home?.targetDeviceLabel ?? "Target Device:"}
                  className="text-zinc-500"
                />
                <strong className="text-zinc-950">{model}</strong>
              </div>
              <div>
                <EditableText
                  as="span"
                  id={`${itemPath}.serviceLabel`}
                  data-preview-field-path={`${itemPath}.serviceLabel`}
                  defaultValue={siteData?.content?.home?.serviceLabel ?? "Service:"}
                  className="text-zinc-500"
                />
                <strong className="text-cyan-600">{selectedIssue}</strong>
              </div>
            </div>
            <EditableText
              as="p"
              id={`${itemPath}.preferredSlot`}
              data-preview-field-path={`${itemPath}.preferredSlot`}
              defaultValue={siteData?.content?.home?.preferredSlot ?? "Preferred Slot"}
              className="text-xs font-medium text-zinc-600"
            />
            <EditableText
              as="p"
              id={`${itemPath}.noUpfrontPaymentRequiredPay`}
              data-preview-field-path={`${itemPath}.noUpfrontPaymentRequiredPay`}
              defaultValue={siteData?.content?.home?.noUpfrontPaymentRequiredPay ?? "No upfront payment required. Pay only upon inspection & testing."}
              className="text-xs font-medium text-zinc-600"
            />
          </div>
        </div>
      </div>
    </Component>
  );
}