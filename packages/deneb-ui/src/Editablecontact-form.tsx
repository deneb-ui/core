import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface ContactFormData {
  name?: string;
  email?: string;
  message?: string;
}

export interface EditableContactFormProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: ContactFormData;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableContactForm({
  itemPath,
  data,
  imageFallback = '/placeholder.svg',
  as: Component = 'form',
  className = '',
  style,
  ...props
}: EditableContactFormProps) {
  const nameLabel = String(data?.name || 'Name');
  const emailLabel = String(data?.email || 'Email');
  const messageLabel = String(data?.message || 'Message');
  const namePlaceholder = String(data?.name || 'John Doe');
  const emailPlaceholder = String(data?.email || 'john@example.com');
  const messagePlaceholder = String(data?.message || 'Your message...');

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-contact-form space-y-4 max-w-md mx-auto border p-6 rounded-lg ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className="flex flex-col gap-2" data-preview-list-path={`${itemPath}.fields`}>
        <label
          htmlFor="name"
          className="text-sm font-medium"
          data-preview-field-path={`${itemPath}.nameLabel`}
        >
          <EditableText
            as="span"
            id={`${itemPath}.nameLabel`}
            data-preview-field-path={`${itemPath}.nameLabel`}
            defaultValue={nameLabel}
          />
        </label>
        <input
          id="name"
          className="border p-2 rounded"
          placeholder={namePlaceholder}
          data-preview-field-path={`${itemPath}.johnDoePlaceholder`}
        />
      </div>

      <div className="flex flex-col gap-2" data-preview-list-path={`${itemPath}.fields`}>
        <label
          htmlFor="email"
          className="text-sm font-medium"
          data-preview-field-path={`${itemPath}.emailLabel`}
        >
          <EditableText
            as="span"
            id={`${itemPath}.emailLabel`}
            data-preview-field-path={`${itemPath}.emailLabel`}
            defaultValue={emailLabel}
          />
        </label>
        <input
          id="email"
          type="email"
          className="border p-2 rounded"
          placeholder={emailPlaceholder}
          data-preview-field-path={`${itemPath}.johnExampleComPlaceholder`}
        />
      </div>

      <div className="flex flex-col gap-2" data-preview-list-path={`${itemPath}.fields`}>
        <label
          htmlFor="message"
          className="text-sm font-medium"
          data-preview-field-path={`${itemPath}.messageLabel`}
        >
          <EditableText
            as="span"
            id={`${itemPath}.messageLabel`}
            data-preview-field-path={`${itemPath}.messageLabel`}
            defaultValue={messageLabel}
          />
        </label>
        <textarea
          id="message"
          className="border p-2 rounded"
          placeholder={messagePlaceholder}
          data-preview-field-path={`${itemPath}.yourMessagePlaceholder`}
        />
      </div>

      <button
        type="submit"
        className="bg-black text-white p-2 rounded hover:bg-gray-800"
      >
        <EditableText
          as="span"
          id={`${itemPath}.submitButton`}
          data-preview-field-path={`${itemPath}.submitButton`}
          defaultValue="Send Message"
        />
      </button>
    </Component>
  );
}