import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface EditablepageProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  data: any;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Editablepage({
  itemPath,
  data,
  as: Component = 'main',
  className = '',
  style,
  children,
  ...props
}: EditablepageProps) {
  const aboutVanta = String(data?.about?.aboutVanta || "About VANTA");
  const engineeredMotion = String(data?.about?.engineeredMotion || "Engineered for Motion");
  const aFootwearLaboratoryObsessedIntersection = String(data?.about?.aFootwearLaboratoryObsessedIntersection || "A footwear laboratory obsessed with the intersection of performance, design, and everyday wearability.");
  const aboutImageSrc = String(data?.about?.vantaSneakerDesignCraftsmanshipImage || "/placeholder.svg");
  const imageAlt = String(data?.about?.imageAlt || "VANTA sneaker design and craftsmanship");
  const theLab = String(data?.about?.theLab || "The Lab");
  const whereIdeasTakeShape = String(data?.about?.whereIdeasTakeShape || "Where Ideas Take Shape");
  const fromInitialSketchFinalStitch = String(data?.about?.fromInitialSketchFinalStitch || "From initial sketch to final stitch, every VANTA silhouette passes through our Colombo design studio. We prototype locally, test on real streets, and refine until the fit feels inevitable.");
  const founded = String(data?.about?.founded || "Founded");
  const colombo = String(data?.about?.colombo || "Colombo");
  const designStudio = String(data?.about?.designStudio || "Design Studio");
  const pairsDelivered = String(data?.about?.pairsDelivered || "Pairs Delivered");
  const exploreCollectionLabel = String(data?.about?.exploreCollectionLabel || "Explore Collection");
  const exploreCollectionUrl = String(data?.about?.exploreCollectionUrl || "/shop");

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-page ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <header className="page-hero">
        <EditableText
          as="span"
          id={`${itemPath}.aboutVanta`}
          data-preview-field-path={`${itemPath}.aboutVanta`}
          defaultValue={aboutVanta}
          className="section-label"
        />
        <EditableText
          as="h1"
          id={`${itemPath}.engineeredMotion`}
          data-preview-field-path={`${itemPath}.engineeredMotion`}
          defaultValue={engineeredMotion}
        />
        <EditableText
          as="p"
          id={`${itemPath}.aFootwearLaboratoryObsessedIntersection`}
          data-preview-field-path={`${itemPath}.aFootwearLaboratoryObsessedIntersection`}
          defaultValue={aFootwearLaboratoryObsessedIntersection}
        />
      </header>

      <div className="page-content">
        <EditableText
          as="p"
          id={`${itemPath}.vantaWasFoundedClearMission`}
          data-preview-field-path={`${itemPath}.vantaWasFoundedClearMission`}
          defaultValue={data?.about?.vantaWasFoundedClearMission || "VANTA was founded with a clear mission: create original footwear that performs as beautifully as it looks. Based in Colombo, our design team develops every silhouette from the ground up — no licensing, no imitations, just considered design."}
        />
        <EditableText
          as="p"
          id={`${itemPath}.eachModelGoesThroughRigorous`}
          data-preview-field-path={`${itemPath}.eachModelGoesThroughRigorous`}
          defaultValue={data?.about?.eachModelGoesThroughRigorous || "Each model goes through rigorous prototyping and street testing before reaching our collection. We believe premium doesn't mean inaccessible — it means honest materials, thoughtful construction, and silhouettes that earn their place in your rotation."}
        />
        <EditableText
          as="p"
          id={`${itemPath}.ourOrderingProcessDeliberatelySimple`}
          data-preview-field-path={`${itemPath}.ourOrderingProcessDeliberatelySimple`}
          defaultValue={data?.about?.ourOrderingProcessDeliberatelySimple || "Our ordering process is deliberately simple. Browse the collection, select your size, and send your order via WhatsApp. No accounts, no checkout friction — just a direct line to our team."}
        />
      </div>

      <section className="section-block">
        <div className="container">
          <div className="brand-story">
            <EditableImage
              id={`${itemPath}.vantaSneakerDesignCraftsmanshipImage`}
              data-preview-field-path={`${itemPath}.vantaSneakerDesignCraftsmanshipImage`}
              src={aboutImageSrc}
              fallbackSrc="/placeholder.svg"
              alt={imageAlt}
              className="brand-story-image"
            />
            <div>
              <EditableText
                as="span"
                id={`${itemPath}.theLab`}
                data-preview-field-path={`${itemPath}.theLab`}
                defaultValue={theLab}
                className="section-label"
              />
              <EditableText
                as="h2"
                id={`${itemPath}.whereIdeasTakeShape`}
                data-preview-field-path={`${itemPath}.whereIdeasTakeShape`}
                defaultValue={whereIdeasTakeShape}
                className="section-title"
              />
              <EditableText
                as="p"
                id={`${itemPath}.fromInitialSketchFinalStitch`}
                data-preview-field-path={`${itemPath}.fromInitialSketchFinalStitch`}
                defaultValue={fromInitialSketchFinalStitch}
                className="section-desc"
                style={{ marginTop: '1rem' }}
              />
              <div className="brand-story__stats">
                <div>
                  <EditableText
                    as="span"
                    id={`${itemPath}.founded`}
                    data-preview-field-path={`${itemPath}.founded`}
                    defaultValue={founded}
                    className="brand-story__stat-label"
                  />
                </div>
                <div>
                  <EditableText
                    as="span"
                    id={`${itemPath}.colombo`}
                    data-preview-field-path={`${itemPath}.colombo`}
                    defaultValue={colombo}
                    className="brand-story__stat-label"
                  />
                  <EditableText
                    as="span"
                    id={`${itemPath}.designStudio`}
                    data-preview-field-path={`${itemPath}.designStudio`}
                    defaultValue={designStudio}
                    className="brand-story__stat-label"
                  />
                </div>
                <div>
                  <EditableText
                    as="span"
                    id={`${itemPath}.pairsDelivered`}
                    data-preview-field-path={`${itemPath}.pairsDelivered`}
                    defaultValue={pairsDelivered}
                    className="brand-story__stat-label"
                  />
                </div>
              </div>
              <RequiredPageLink
                pageId="shop"
                className="btn btn-primary"
                style={{ marginTop: '2rem' }}
                staticId="about-shop-cta"
                href={exploreCollectionUrl}
                data-preview-field-path={`${itemPath}.exploreCollectionUrl`}
                data-preview-style-target={`${itemPath}.exploreCollectionLabel`}
                data-preview-style-type="text"
              >
                <EditableText
                  as="span"
                  id={`${itemPath}.exploreCollectionLabel`}
                  data-preview-field-path={`${itemPath}.exploreCollectionLabel`}
                  defaultValue={exploreCollectionLabel}
                />
              </RequiredPageLink>
            </div>
          </div>
        </div>
      </section>
    </Component>
  );
}