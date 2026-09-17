import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditableTestDriveModalProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  siteData: any;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableTestDriveModal({
  itemPath,
  siteData,
  imageFallback = '/placeholder.svg',
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}: EditableTestDriveModalProps) {
  const confirmedSubheading = siteData?.content?.home?.testDriveConfirmedSubheading ?? "TEST DRIVE CONFIRMED";
  const subtitle = siteData?.content?.home?.subtitle3 ?? "Your VIP private test session for the has been secured at our atelier.";
  const reservationCodeLabel = siteData?.content?.home?.reservationCodeLabel ?? "RESERVATION CODE:";
  const reservationCode = siteData?.content?.home?.apxDrive202699 ?? "APX-DRIVE-2026-99";
  const returnShowroomLabel = siteData?.content?.home?.returnShowroomLabel ?? "RETURN TO SHOWROOM";
  const privateAppointmentLabel = siteData?.content?.home?.privateAppointmentLabel ?? "PRIVATE APPOINTMENT";
  const heading = siteData?.content?.home?.heading8 ?? "BOOK A TEST DRIVE";
  const experienceFormatLabel = siteData?.content?.home?.experienceFormatLabel ?? "EXPERIENCE FORMAT:";
  const atelierLocationLabel = siteData?.content?.home?.atelierLocationLabel ?? "ATELIER LOCATION:";
  const preferredDateLabel = siteData?.content?.home?.preferredDateLabel ?? "PREFERRED DATE:";
  const fullNamePlaceholder = siteData?.content?.home?.fullNamePlaceholder ?? "Full Name";
  const emailAddressPlaceholder = siteData?.content?.home?.emailAddressPlaceholder ?? "Email Address";
  const phoneNumberPlaceholder = siteData?.content?.home?.phoneNumberPlaceholder ?? "Phone Number";
  const confirmVipTestDriveLabel = siteData?.content?.home?.confirmVipTestDriveLabel ?? "CONFIRM VIP TEST DRIVE";
  const bookTestDriveLabel = siteData?.content?.home?.bookTestDriveLabel ?? "BOOK A TEST DRIVE";
  
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-test-drive-modal ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="py-12 text-center space-y-4">
        <EditableText
          as="h3"
          id={`${itemPath}.testDriveConfirmedSubheading`}
          data-preview-field-path={`${itemPath}.testDriveConfirmedSubheading`}
          defaultValue={confirmedSubheading}
          className="font-display font-black text-2xl sm:text-3xl text-white uppercase"
        />
        <EditableText
          as="p"
          id={`${itemPath}.subtitle3`}
          data-preview-field-path={`${itemPath}.subtitle3`}
          defaultValue={subtitle}
          className="text-sm font-mono text-neutral-300 max-w-md mx-auto"
        />
        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 max-w-sm mx-auto text-xs font-mono text-neutral-400">
          <EditableText
            as="span"
            id={`${itemPath}.reservationCodeLabel`}
            data-preview-field-path={`${itemPath}.reservationCodeLabel`}
            defaultValue={reservationCodeLabel}
          />
          <strong
            className="text-red-400"
            data-preview-field-path={`${itemPath}.apxDrive202699`}
            data-preview-style-target={`${itemPath}.apxDrive202699`}
            data-preview-style-type="text"
          >
            {reservationCode}
          </strong>
        </div>
        <EditableText
          as="button"
          id={`${itemPath}.returnShowroomLabel`}
          data-preview-field-path={`${itemPath}.returnShowroomLabel`}
          defaultValue={returnShowroomLabel}
          className="mt-4 px-8 py-3 rounded-xl bg-red-600 text-white font-mono text-xs uppercase cursor-pointer"
        />
      </div>
      {children}
    </Component>
  );
}