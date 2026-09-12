'use client';

import {
  contentList,
  contentObject,
  contentText,
  useSiteData,
  useProducts,
} from '@/lib/siteDataContext';
import { pageRoute, withBasePath } from '@/lib/utils';
import {
  EditableText,
  EditableList,
  EditableCard,
  EditableProductCard,
  ListActionCta,
} from '@deneb-ui/ui';


function navigate(pageKey: string) {
  window.location.href = withBasePath(pageRoute(pageKey));
}

export default function HomePage() {
  const siteData = useSiteData();
  const content = contentObject(siteData.content);
  const home = contentObject(content.home);
  const features = contentList(home.features);
  const products = useProducts();
  const demoCta = contentObject(
    (contentList(home.demoPreOrderCta)[0] as Record<string, unknown> | undefined) ?? {}
  );
  const demoCtaLabel = contentText(demoCta.buttonLabel) || 'Book a Demo';
  const demoCtaUrl = contentText(demoCta.buttonUrl) || '';
  const selectedPages =
    siteData.requirements?.requiredPages ??
    siteData.template?.structure?.pages ??
    [];

  return (
    <div data-preview-page-key="home">
      <section className="hero" data-design-section="home-hero">
        <div className="hero-copy">
          <EditableText
            variant="eyebrow"
            color="primary"
            className="eyebrow"
            data-preview-field-path="home.heroEyebrow"
            defaultValue={contentText(home.heroEyebrow)}
          />
          <EditableText
            variant="h1"
            size="5xl"
            weight="bold"
            align="left"
            color="heading"
            data-preview-field-path="home.heroTitle"
            defaultValue={contentText(home.heroTitle)}
          />
          <EditableText
            variant="lead"
            color="muted"
            data-preview-field-path="home.heroSummary"
            defaultValue={contentText(home.heroSummary)}
          />
          <div className="cta-row">
            {selectedPages.includes('contact') ? (
              <button
                type="button"
                data-target-page="contact"
                className="button-primary"
                onClick={() => navigate('contact')}
              >
                <span data-preview-field-path="home.primaryCtaLabel">
                  {contentText(home.primaryCtaLabel)}
                </span>
              </button>
            ) : (
              <span
                data-target-page="contact"
                className="button-primary unavailable"
                data-preview-field-path="home.primaryCtaLabel"
              >
                {contentText(home.primaryCtaLabel)}
              </span>
            )}
            {selectedPages.includes('about_us') ? (
              <button
                type="button"
                data-target-page="about_us"
                className="button-secondary"
                onClick={() => navigate('about_us')}
              >
                <span data-preview-field-path="home.secondaryCtaLabel">
                  {contentText(home.secondaryCtaLabel)}
                </span>
              </button>
            ) : (
              <span
                data-target-page="about_us"
                className="button-secondary unavailable"
                data-preview-field-path="home.secondaryCtaLabel"
              >
                {contentText(home.secondaryCtaLabel)}
              </span>
            )}
          </div>
        </div>
        <div className="hero-fivora-wrap">
          <img
            className="hero-image"
            src={withBasePath(
              contentText(home.bannerImageUrl) || '/fivora-icon.svg',
            )}
            alt="Fivora"
            data-preview-field-path="home.bannerImageUrl"
          />
        </div>
      </section>

      <section
        className="page-section"
        data-design-section="home-introduction"
      >
        <div className="home-intro-copy">
          <EditableText
            variant="h2"
            size="3xl"
            weight="bold"
            align="center"
            color="heading"
            data-preview-field-path="home.introTitle"
            defaultValue={contentText(home.introTitle)}
          />
          <EditableText
            variant="lead"
            align="center"
            color="muted"
            data-preview-field-path="home.introBody"
            defaultValue={contentText(home.introBody)}
          />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <ListActionCta
              listPath="home.demoPreOrderCta"
              editable
              buttonLabel={demoCtaLabel}
              buttonUrl={demoCtaUrl}
              className="button-primary"
            />
          </div>
        </div>
      </section>

      <section
        className="page-section alt"
        data-design-section="home-features"
      >
        <div className="section-header">
          <EditableText
            variant="h2"
            size="3xl"
            weight="bold"
            align="center"
            color="heading"
            className="section-title"
            data-preview-field-path="home.featuresHeading"
            defaultValue={contentText(home.featuresHeading)}
          />
        </div>
        <EditableList
          data-preview-list-path="home.features"
          items={features}
          className="card-grid"
          itemAs={false}
        >
          {(rawFeature, index) => {
            const feature = contentObject(rawFeature);
            return (
              <EditableCard
                className="card"
                key={index}
                itemPath={`home.features[${index}]`}
                data-preview-item-path={`home.features[${index}]`}
                item={feature as any}
                balance
                minHeight="220px"
                radius="16px"
              >
                <EditableText
                  variant="h3"
                  color="heading"
                  data-preview-field-path={`home.features[${index}].title`}
                  defaultValue={contentText(feature.title)}
                />
                <EditableText
                  variant="p"
                  color="muted"
                  data-preview-field-path={`home.features[${index}].body`}
                  defaultValue={contentText(feature.body)}
                />
              </EditableCard>
            );
          }}
        </EditableList>
      </section>
    </div>
  );
}
