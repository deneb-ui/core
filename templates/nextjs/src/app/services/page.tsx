'use client';

import { contentObject, contentText, useServices, useSiteData } from '@/lib/siteDataContext';
import { EditableServiceCard, EditableText } from '@deneb-ui/ui';

export default function ServicesPage() {
  const siteData = useSiteData();
  const content = contentObject(siteData.content);
  const page = contentObject(content.servicesPage);
  const services = useServices();

  return (
    <div data-preview-page-key="services">
      <section className="page-section page-heading" data-design-section="services-heading">
        <EditableText
          as="h1"
          variant="h1"
          size="4xl"
          weight="bold"
          color="heading"
          data-preview-field-path="servicesPage.heading"
          defaultValue={contentText(page.heading)}
        />
        <EditableText
          as="p"
          variant="lead"
          color="muted"
          data-preview-field-path="servicesPage.intro"
          defaultValue={contentText(page.intro)}
        />
      </section>
      <section className="page-section alt" data-design-section="services-list">
        <div className="card-grid" data-preview-list-path="services">
          {services.map((service, index) => (
            <EditableServiceCard
              key={contentText(service.id) || index}
              itemPath={`services[${index}]`}
              service={service}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
