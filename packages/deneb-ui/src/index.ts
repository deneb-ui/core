/**
 * DENEB UI — The Visual-First React Framework for High-Converting Storefronts
 * Created by Chamika Gayashan & Induranga Kawishwara
 */

export * from './PreviewField';
export * from './EditableText';
export * from './EditableCountdownTimer';
export * from './EditableImage';
export * from './DenebImage';
export * from './EditableIcon';
export * from './EditableMap';
export * from './EditableList';
export * from './EditableBox';
export * from './EditableGrid';
export * from './EditableSection';
export * from './EditableProductCard';
export * from './EditableVehicleCard';
export * from './EditableUniversalCard';
export * from './EditableProductGrid';
export * from './EditableProductShowcase';
export * from './EditableProductDetail';
export * from './PlatformProductDetail';
export * from './EditableCustomerReviews';
export * from './EditableGoogleFeedback';
export * from './EditableServiceCard';
export * from './EditableCard';
export * from './EditablePricingCard';
export * from './EditableTestimonialCard';
export * from './EditableTestimonialSection';
export * from './EditableTestimonialCarousel';
export * from './EditableBeforeAfterSlider';
export * from './EditableBookingModal';
export * from './EditableFAQAccordion';
export * from './EditableContactForm';
export * from './EditableNavbar';
export * from './EditableFooter';
export * from './EditableHero';
export * from './EditableDialog';
export * from './EditableAnnouncementBar';
export * from './EditableRotatingAnnouncementBar';
export * from './EditableCategoryPills';
export * from './StickyMobileBar';
export * from './TrustBadges';
export * from './ProductQuickView';
export * from './CookieConsentBanner';
export * from './cart/useCart';
export * from './EditableCartDrawer';
export * from './EditableCheckout';
export * from './EditableOrderSuccess';
export * from './EditableFilterSidebar';
export * from './SiteDataProvider';
export * from './ThemeStyles';
export * from './ThemeToggle';
export { ResponsiveBaseStyles } from './ResponsiveBaseStyles';
export { DenebComponentStyles } from './DenebComponentStyles';
export { FontLoader, DENEB_FONTS_LINK_ID } from './fonts/FontLoader';
export { useDenebFonts } from './fonts/useDenebFonts';
export * from './hooks/useComponentStyle';
export * from './hooks/useWhatsAppForm';
export {
  DENEB_FONT_REGISTRY,
  DENEB_GOOGLE_FONT_COUNT,
  buildGoogleFontsStylesheetUrl,
  collectFontIdsFromSiteData,
  listFontsByCategory,
  lookupFontDefinition,
  normalizeFontId,
  resolveInstallableFont,
  formatResponsiveFontSize,
} from '@deneb-ui/core';
export {
  STYLE_PATCH_MESSAGE,
  DENEB_STYLE_PATCH_MESSAGE,
  STYLE_TARGET_ATTRIBUTE,
  STYLE_TYPE_ATTRIBUTE,
  patchElementStyle,
  patchStyleByPath,
  styleToCssVariables,
  validateStyleTree,
  collectStyleTargetsFromHtml,
} from '@deneb-ui/core';

// Smart template components & actions
export * from './utils';
export * from './core';
export * from './contact';
export * from './location';
export * from './social';
export * from './business';

// Canonical DENEB UI Component Aliases (shadcn / HeroUI style)
export { EditableButton as Button } from './EditableText';
export { EditableCard as Card } from './EditableCard';
export { EditableDialog as Dialog } from './EditableDialog';
export { EditableText as Text } from './EditableText';
export { EditableHeading as Heading } from './EditableText';
export { EditableParagraph as Paragraph } from './EditableText';
export { EditableBadge as Badge } from './EditableText';
export { EditableQuote as Quote } from './EditableText';
export { EditableImage as Image } from './EditableImage';
export { DenebImage, DenebImage as SafeImage } from './DenebImage';
export { EditableMap as Map } from './EditableMap';
export { EditableGrid as Grid } from './EditableGrid';
export { EditableSection as Section } from './EditableSection';
export { EditableBox as Box } from './EditableBox';
export { EditableList as List } from './EditableList';
export { EditableProductCard as ProductCard } from './EditableProductCard';
export { EditableVehicleCard as VehicleCard } from './EditableVehicleCard';
export { EditableUniversalCard as UniversalCard, EditableUniversalCard as ListingCard, EditableUniversalCard as EntityCard } from './EditableUniversalCard';
export { EditableProductGrid as ProductGrid } from './EditableProductGrid';
export { EditableProductShowcase as ProductShowcase } from './EditableProductShowcase';
export { EditableProductDetail as ProductDetail } from './EditableProductDetail';
export { EditableCustomerReviews as CustomerReviews } from './EditableCustomerReviews';
export { EditableGoogleFeedback as GoogleFeedback } from './EditableGoogleFeedback';
export { EditableServiceCard as ServiceCard } from './EditableServiceCard';
export { EditablePricingCard as PricingCard } from './EditablePricingCard';
export { EditableTestimonialCard as TestimonialCard } from './EditableTestimonialCard';
export { EditableTestimonialSection as TestimonialSection, EditableTestimonialSection as Testimonials } from './EditableTestimonialSection';
export { EditableFAQAccordion as Accordion, EditableFAQAccordion as FAQ } from './EditableFAQAccordion';
export { EditableContactForm as ContactForm } from './EditableContactForm';
export { EditableNavbar as Navbar, EditableNavbar as Header } from './EditableNavbar';
export { EditableFooter as Footer } from './EditableFooter';
export { EditableHeroCentered as Hero, EditableHeroSplit as HeroSplit } from './EditableHero';
export { EditableAnnouncementBar as AnnouncementBar } from './EditableAnnouncementBar';
export { EditableCategoryPills as CategoryPills } from './EditableCategoryPills';
export { EditableCartDrawer as CartDrawer } from './EditableCartDrawer';
export { EditableCheckout as Checkout } from './EditableCheckout';
export { EditableOrderSuccess as OrderSuccess } from './EditableOrderSuccess';
export { EditableFilterSidebar as FilterSidebar } from './EditableFilterSidebar';
export { EditableBeforeAfterSlider as BeforeAfterSlider } from './EditableBeforeAfterSlider';
export { EditableBookingModal as BookingModal } from './EditableBookingModal';
export { EditableTestimonialCarousel as TestimonialCarousel } from './EditableTestimonialCarousel';


export { PlatformAdditionalPages, AdditionalPagesNav } from './PlatformAdditionalPages';

/**
 * DENEB UI Framework Metadata
 * Developed by Chamika Gayashan & Induranga Kawishwara
 */
export const DENEB_FRAMEWORK_NAME = 'DENEB UI';
export const DENEB_FRAMEWORK_VERSION = '2.0.0';
export const DENEB_AUTHOR = 'Chamika Gayashan & Induranga Kawishwara';

export {
  THEME_PALETTES,
  GLOBAL_FONT_OPTIONS,
  FONT_PAIRINGS,
  isDarkColor,
  getAutoContrastTextColor,
  toHexColor,
  normalizeHexColor,
  parseVisualCustomization,
  customizationToTheme,
  mergeVisualCustomizationIntoTheme,
  generateThemeVariables,
} from '@deneb-ui/core';
export type {
  ThemePalette,
  FontPairing,
  GlobalFontOption,
  VisualCustomization,
  VisualCustomizationColors,
  VisualCustomizationTypography,
  VisualCustomizationSpacing,
  VisualCustomizationLayout,
  VisualCustomizationComponents,
  VisualCustomizationSectionOverride,
  VisualCustomizationElementStyle,
  TemplateThemeShape,
} from '@deneb-ui/core';

// Export reference examples
export * from './examples';
