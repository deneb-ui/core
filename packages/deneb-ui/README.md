<p align="center">
  <a href="https://deneb.fivora.site">
    <img src="https://img.shields.io/badge/DENEB_UI-Visual--First_React_Components-6366F1?style=for-the-badge&labelColor=0f172a" alt="DENEB UI" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@deneb-ui/ui"><img src="https://img.shields.io/npm/v/@deneb-ui/ui.svg?style=flat-square&color=6366F1" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@deneb-ui/ui"><img src="https://img.shields.io/npm/dm/@deneb-ui/ui.svg?style=flat-square&color=6366F1" alt="npm downloads" /></a>
  <img src="https://img.shields.io/badge/React-18%20%7C%2019-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="MIT License" /></a>
</p>

<p align="center">
  <strong>Build beautiful, editable storefronts — on mobile, tablet, and desktop.</strong><br />
  The visual-first React component library for Next.js commerce, ARC Engine, and Fivora live visual editing.
</p>

<p align="center">
  <a href="https://deneb.fivora.site/docs/introduction"><strong>Documentation</strong></a> ·
  <a href="https://deneb.fivora.site/docs/components/button"><strong>Components</strong></a> ·
  <a href="https://deneb.fivora.site/docs/responsive-design"><strong>Responsive Design</strong></a> ·
  <a href="https://github.com/deneb-ui/core"><strong>GitHub</strong></a>
</p>

---

## Getting Started

### Editable countdown timer

Render inside the existing `SiteDataProvider`:

```tsx
import { EditableCountdownTimer } from '@deneb-ui/ui';

<EditableCountdownTimer fieldPath="home.countdown" />
```

Example provider/site-data snapshot (paths are relative to `content`):

```json
{
  "content": {
    "home": {
      "countdown": {
        "heading": "Our next launch",
        "deadline": "2030-12-31T23:59:59+05:30",
        "expiryMessage": "The launch is here!",
        "ctaLabel": "Explore the collection",
        "ctaUrl": "/collections"
      }
    }
  },
  "styles": {
    "home.countdown.card": { "backgroundColor": "#0f172a" },
    "home.countdown.text": { "color": "#ffffff" }
  }
}
```

All content fields have `data-preview-field-path` bindings, including an optional
`subtitle` (defaults to “Hurry! Offers end soon.”). The URL is
bound to the anchor and its label to the nested span. Content updates from
`useSiteData()` drive the rendered text, link, and timer. `fieldPath` defaults
to `countdown` and supports array indexes. Optional `defaults` supplies fallback
content; an explicitly empty saved string takes precedence. `className` and
`style` customize the outer container.

Colors use `useComponentStyle` with existing card/text style targets, as shown
above; they are style settings rather than additional content fields. The card
consumes `--deneb-card-bg`; its inner text container consumes `--deneb-color`.
Additional style targets are `<fieldPath>.heading` (text color),
`<fieldPath>.digits.card` (backgroundColor, borderRadius for all four number boxes),
`<fieldPath>.digits.text` (digit color), and `<fieldPath>.cta` (button backgroundColor,
textColor, borderRadius). The main card also consumes borderRadius. No editor
infrastructure or dependencies are added.

ISO deadlines must include `T` and either uppercase `Z` or an explicit `+HH:MM` /
`-HH:MM` offset. Seconds are optional; fractional seconds support 1–3 digits.
The same deadline field also accepts the readable format
`01 Dec 2026, 11:59 PM +05:30` (optional seconds before AM/PM) for compatibility.
The editable deadline always displays ISO text, with its supplied offset and
precision, so copying it back into Fivora preserves the same timestamp. For
example, `2026-12-01T23:59+05:30` stays exactly that; no seconds or non-ISO suffix
are added. Readable legacy input is normalized to ISO for display. The current
editor schema uses a text field with an ISO example rather than a native picker.
Invalid calendar dates are rejected. Missing/invalid deadlines show a prompt
and `--` digits without starting a timer. SSR and the first browser render also
use `--`; the clock starts after mount. Expired deadlines show zero in every
unit and the expiry message, with no running interval. Editing the deadline
restarts the clock; unmounting clears it. The expiry message appears when the
deadline is reached; edit it through the schema's Expiry message field at any
time, or select it visually after setting a past deadline. The CTA remains available after
expiry; empty/unsafe URLs have no navigable `href`.

#### Verify in Fivora Developer Portal

These are manual acceptance steps; actual editor behavior has **not** been verified.
The Next.js starter includes a separate `/countdown-preview/` route with
`home.countdown` sample content and its own editor schema/page entry. The original
`/announcement-bar-preview/` page and its announcement strip remain separate.
The countdown route imports `@deneb-ui/ui` and uses the layout's existing
`SiteDataProvider`; it does not import source outside the template or install
another editor message listener. With an older package that lacks this export,
only this optional route shows an availability message; other pages keep working.

For local testing, the linked package's `dist` output must contain the new
component and barrel export. Recompile those outputs after changing the component;
the preview no longer follows library source edits directly. A standalone copy
needs an installed package version that exports `EditableCountdownTimer` to show
the countdown (the currently declared version range does not guarantee that).
No dependency/version changes are included here.

From the repository root, start the existing Lab workflow:

```powershell
node .\cli\deneb-cli\bin\index.js lab .\templates\nextjs
```

Connect the printed controller URL/token in **Developer Portal > Local Test Lab**,
then choose **Countdown Preview**. The direct URL with default ports is
`http://127.0.0.1:4174/countdown-preview/`.

1. Confirm the Countdown Preview route renders the timer rather than the
   availability message, using the locally compiled package export.
2. Open the preview in Fivora Developer Portal's visual editor. Select the
   heading and change `home.countdown.heading`; confirm both rendered text and
   saved content change. Repeat for `subtitle` and `ctaLabel`. Edit `expiryMessage`
   through its schema field or select it visually with a past deadline.
3. Select the visible deadline and set it to an explicit-zone ISO timestamp
   about two minutes in the future. Confirm the digits restart and seconds tick.
   Change to a past timestamp: confirm zeros and the expiry message. Try an
   invalid date and a date without a timezone: confirm the prompt and `--` digits.
4. Select the CTA anchor/URL field (`home.countdown.ctaUrl`), distinct from its
   nested label. Set `/collections`; verify navigation in the regular preview.
   Try `javascript:alert(1)` and an empty URL; neither should navigate.
5. Select style target `home.countdown.card` and change `backgroundColor`.
   Select `home.countdown.text` and change `color`. Confirm both apply immediately.
6. Save, reload the preview, and reselect each field/style target. Confirm values
   persist and the countdown still uses the saved deadline. Check narrow mobile
   and desktop widths for wrapping and overflow.
7. Check the browser console for hydration warnings. With a future deadline,
   navigate away/unmount and back; confirm the old timer stops and a single
   countdown resumes. If any field cannot be selected or persisted, record it as
   an editor integration failure; source bindings alone are not verification.

### Styling the whole editable navbar

`EditableNavbar` (also exported as `Navbar` and `Header`) accepts shared
`navbarStyles` settings for desktop and mobile:

```tsx
<EditableNavbar
  navbarStyles={{
    fontSize: '18px',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 600,
    color: '#172554',
    backgroundColor: '#eff6ff',
    padding: '16px 24px',
    gap: '24px',
    linkGap: '12px',
    border: '1px solid #bfdbfe',
    borderRadius: '12px',
    itemBorderRadius: '8px',
    maxWidth: '1440px',
  }}
  partStyles={{ title: { fontSize: '24px' }, cta: { color: '#fff' } }}
/>
```

Shared typography includes text size, family, weight, line height, letter spacing,
text transform, and color. It applies to the title, links, search, CTA, and cart
badge. A shared color also changes icon colors. Keep CTA/badge contrast readable
when changing the shared color. `padding` controls the inner bar and mobile drawer;
`gap` controls bar/action spacing, and `linkGap` controls navigation/drawer spacing.

For saved site data and live previews, place the same settings at
`content.common.header.navbarStyles`, and per-element styles at
`content.common.header.navbarPartStyles`. Component props override saved settings;
`partStyles` overrides shared styles. Supported parts are `inner`, `brand`, `logo`,
`title`, `links`, `link`, `search`, `actions`, `icon`, `badge`, `cta`, `toggle`, and
`drawer`. The `link` and `cta` parts apply to both desktop and mobile. Existing
appearance is preserved when settings are omitted. The standard `style` prop
continues to style the outer header. In the visual editor, click navbar background
space to select its container, or select a navbar item and choose the `Whole navbar`
style scope. Editor styles use the stable `common.header.navbar` target (customizable
with `stylePath`) and update shared typography on desktop and mobile.

### Installation

```bash
npm install @deneb-ui/ui
# or
pnpm add @deneb-ui/ui
# or
yarn add @deneb-ui/ui
```

### Quick Start Example

```tsx
import { 
  SiteDataProvider, 
  Navbar, 
  Hero, 
  GoogleFeedback, 
  TestimonialSection, 
  Map, 
  Footer 
} from "@deneb-ui/ui";
import siteData from "@/data/site-data.json";

export default function Page() {
  return (
    <SiteDataProvider initialSiteData={siteData}>
      <Navbar />
      <Hero />
      <GoogleFeedback basePath="feedback" />
      <TestimonialSection basePath="testimonials" />
      <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg">
        <Map mapUrl={siteData.content.contact?.mapUrl} />
      </div>
      <Footer />
    </SiteDataProvider>
  );
}
```

`SiteDataProvider` automatically injects **ResponsiveBaseStyles** — every component adapts seamlessly across phone, tablet, and desktop without extra configuration.

---

## Canonical Component Catalog & Aliases

`@deneb-ui/ui` provides both canonical shorthand aliases (shadcn / HeroUI style) and full `Editable*` identifiers across all commerce categories:

### 1. Foundational & Layout Primitives
| Canonical Alias | Full Component Identifier | Visual Editing Support | Description |
| :--- | :--- | :--- | :--- |
| `Button` | `EditableButton` | `data-preview-field-path`, `style-target` | Visual action button with ripple feedback & glow variants |
| `Card` | `EditableCard` | `data-preview-item-path`, `style-target` | Obsidian glass container with luminous border hover effects |
| `Badge` | `EditableBadge` | `data-preview-field-path` | Status tags, indicator pills, and glowing metadata markers |
| `Heading` | `EditableHeading` | `data-preview-field-path`, `style-target` | Semantic typography heading with instant DOM sync |
| `Paragraph` | `EditableParagraph` | `data-preview-field-path`, `style-target` | Body text copy linked to Fivora theme tokens |
| `Text` | `EditableText` | `data-preview-field-path`, `style-target` | Inline editable text primitive with live typing sync |
| `Quote` | `EditableQuote` | `data-preview-field-path` | Editorial quotation block with left accent line |
| `Dialog` | `EditableDialog` | `data-preview-static` | Accessible modal dialog with backdrop blur & ESC dismiss |
| `Grid` | `EditableGrid` | `data-preview-list-path`, `style-target` | Auto-fit responsive grid with `minCardWidth` support |
| `Box` | `EditableBox` | `data-preview-field-path`, `data-preview-item-path` | Flexible layout container with style token bindings |
| `Section` | `EditableSection` | `data-preview-style-target` | Full-width page section wrapper with spacing presets |
| `List` | `EditableList` | `data-preview-list-path`, `data-preview-item-path` | Dynamic collection container with list item paths |
| `Image` | `EditableImage` | `data-preview-field-path` | Responsive image with aspect ratio preservation & zoom |

### 2. Commerce & Storefront Components
| Canonical Alias | Full Component Identifier | Visual Editing Support | Description |
| :--- | :--- | :--- | :--- |
| `ProductCard` | `EditableProductCard` | `data-preview-field-path`, `data-preview-item-path` | Product card with LKR/currency formatting, badge, & WhatsApp CTA |
| `ProductGrid` | `EditableProductGrid` | `data-preview-list-path`, `data-preview-item-path` | Catalog grid with quick-view modal hook & filter integration |
| `ProductShowcase` | `EditableProductShowcase` | `data-preview-field-path`, `data-preview-list-path`, `color` swatch | Flagship product showcase with color swatches, filter tabs, quick-view & WhatsApp order |
| `ProductDetail` | `EditableProductDetail` | `data-preview-page-key`, `data-preview-field-path` | Full single-product view with gallery, specs, & inquiry actions |
| `PlatformProductDetail` | `PlatformProductDetail` | `useProducts`, live catalog API | Stable static-export product page with URL lookup, retries, and fallback states |
| `ProductQuickView` | `ProductQuickView` | `data-preview-field-path` | Instant lightbox modal product inspection with quantity counter |
| `CartDrawer` | `EditableCartDrawer` | `data-preview-list-path`, `data-preview-item-path` | Slide-over cart drawer with 1-click unified WhatsApp order compilation |
| `FilterSidebar` | `EditableFilterSidebar` | `data-preview-field-path`, `useSiteData` | Faceted catalog filter sidebar (categories, price range, sizes) |
| `CategoryPills` | `EditableCategoryPills` | `data-preview-field-path`, `useSiteData` | Scrollable horizontal filter pills for instant catalog filtering |

### 3. Hero & Marketing Sections
| Canonical Alias | Full Component Identifier | Visual Editing Support | Description |
| :--- | :--- | :--- | :--- |
| `Hero` | `EditableHeroCentered` | `data-preview-field-path`, `useSiteData` | High-converting centered storefront hero banner with dual CTAs |
| `HeroSplit` | `EditableHeroSplit` | `data-preview-field-path`, `useSiteData` | Split-layout storefront hero banner with featured image |
| `AnnouncementBar` | `EditableAnnouncementBar` | `data-preview-field-path`, `data-preview-static` | Top promo strip for flash sales, coupons, & free shipping |
| `StickyMobileBar` | `StickyMobileBar` | `data-preview-field-path`, `useSiteData` | Sticky bottom navigation bar for high-converting mobile commerce |
| `TrustBadges` | `TrustBadges` | `data-preview-field-path` | Security and conversion guarantee strip (SSL, delivery, returns) |
| `CookieConsentBanner` | `CookieConsentBanner` | `data-preview-field-path` | Regulatory cookie consent banner with live policy link |

### 4. Social Proof & Customer Reviews
| Canonical Alias | Full Component Identifier | Visual Editing Support | Description |
| :--- | :--- | :--- | :--- |
| `GoogleFeedback` | `EditableGoogleFeedback` | `data-preview-field-path`, `data-preview-list-path`, Dual-Layer Star Repaint | Official Google review badge, aggregate rating, & review cards |
| `TestimonialSection` | `EditableTestimonialSection` | `data-preview-field-path`, `data-preview-list-path`, Star Sync | Editorial critic testimonials with typography & star ratings |
| `Testimonials` | `EditableTestimonialSection` | `data-preview-field-path`, `data-preview-list-path` | Alias for `EditableTestimonialSection` |
| `TestimonialCard` | `EditableTestimonialCard` | `data-preview-item-path`, `data-preview-static` | Single customer testimonial card with avatar & 5-star rating |
| `CustomerReviews` | `EditableCustomerReviews` | `data-preview-page-key`, `data-preview-field-path` | Customer review summary & rating breakdown |

### 5. Services, Pricing & Navigation
| Canonical Alias | Full Component Identifier | Visual Editing Support | Description |
| :--- | :--- | :--- | :--- |
| `ServiceCard` | `EditableServiceCard` | `data-preview-field-path`, `data-preview-item-path` | Storefront service card with icon, price tag, & action button |
| `PricingCard` | `EditablePricingCard` | `data-preview-field-path`, `data-preview-item-path` | Tiered pricing card with feature list & popular tier highlight |
| `Accordion` / `FAQ` | `EditableFAQAccordion` | `data-preview-item-path`, `data-preview-list-path` | Collapsible FAQ accordion with Fivora list markers |
| `ContactForm` | `EditableContactForm` | `data-preview-field-path`, `useSiteData` | Lead generation & inquiry form with custom endpoint support |
| `Navbar` / `Header` | `EditableNavbar` | `data-preview-field-path`, `data-preview-static` | Storefront navigation header with mobile drawer & cart badge |
| `Footer` | `EditableFooter` | `data-preview-field-path`, `data-preview-static` | Multi-column storefront footer with social & policy links |

### 6. Smart Actions, Location & Business
| Component | Module Path | Visual Editing Support | Description |
| :--- | :--- | :--- | :--- |
| `Map` | `EditableMap` | `data-preview-field-path` | Universal Google Maps embed with automatic URL/coordinate parsing |
| `MapEmbed` | `location/MapEmbed` | `data-preview-field-path` | Responsive Google Maps iframe embed with fallback placeholder |
| `MapLink` | `location/MapLink` | `data-preview-field-path` | Direct link to Google Maps directions |
| `LocationCard` | `location/LocationCard` | `data-preview-static` | Storefront location card with map directions button |
| `LocationLink` | `location/LocationLink` | `data-preview-field-path` | Interactive map address trigger with directions |
| `Address` | `location/Address` | `data-preview-field-path` | Structured semantic address component |
| `ContactActions` | `contact/ContactActions` | `data-preview-field-path` | Multi-channel contact bar (Phone, WhatsApp, Email) |
| `ContactButton` | `contact/ContactButton` | `data-preview-field-path` | Configurable contact button with phone/email/WhatsApp presets |
| `WhatsAppButton` | `contact/WhatsAppButton` | `data-preview-field-path` | One-click WhatsApp chat launcher with dynamic link resolution |
| `PhoneButton` | `contact/PhoneButton` | `data-preview-field-path` | Direct call action with tel: protocol and visual editing bindings |
| `EmailButton` | `contact/EmailButton` | `data-preview-field-path` | Pre-formatted mailto action with subject line support |
| `FloatingContactWidget`| `contact/FloatingContactWidget` | `data-preview-field-path` | Sticky bottom-corner conversion widget |
| `BusinessHours` | `business/BusinessHours` | `data-preview-field-path` | Weekly schedule renderer with dynamic live Open/Closed badge |
| `HeritageCollage` | `business/HeritageCollage` | `data-preview-field-path`, `data-preview-item-path` | Visual brand story collage with historical milestone cards |
| `SocialLinks` | `social/SocialLinks` | `data-preview-field-path` | Filtered social channel container with brand icons |
| `SocialButton` | `social/SocialButton` | `data-preview-field-path` | Individual branded social media button |

### 7. Runtime State & Theming Primitives
| Component / Hook | Module Path | Purpose |
| :--- | :--- | :--- |
| `SiteDataProvider` / `DenebDataProvider` | `SiteDataProvider` | Real-time backend catalog fetcher & `postMessage` preview state synchronizer |
| `useProducts` | `SiteDataProvider` | React hook to access live synchronized products list (`content.products`) |
| `usePlatformProductDetail` | `PlatformProductDetail` | Resolves `?id=` against live data and the catalog API for a custom detail design |
| `useServices` | `SiteDataProvider` | React hook to access live synchronized services list (`content.services`) |
| `useSiteCatalog` | `SiteDataProvider` | Returns `{ products, services, project, siteInstance, api }` in one call |
| `useSiteApi` | `SiteDataProvider` | Returns official Fivora backend endpoints (`catalogUrl`, `contactUrl`, `analyticsUrl`) |
| `useSiteData` / `useDenebData` | `SiteDataProvider` | React hook to access full live synchronized `siteData` |
| `ThemeStyles` | `ThemeStyles` | Dynamic CSS variable injector for colors, fonts, and radii |
| `ResponsiveBaseStyles`| `ResponsiveBaseStyles` | Universal fluid typography & responsive baseline styles |
| `DenebComponentStyles`| `DenebComponentStyles` | Scoped component style definitions |
| `FontLoader` | `fonts/FontLoader` | Google Fonts pre-fetch & dynamic injection engine |
| `useDenebFonts` | `fonts/useDenebFonts` | Hook for checking active font definitions |
| `CartProvider` / `useCart`| `cart/useCart` | Global cart state management with persistent storage |

## Safe product detail routes for static exports

Never link live products to `/products/${product.id}`. A product created after
the template build has no matching static directory, so that URL can return a
404. Export one stable page and pass the product ID in the query string.

```tsx
// src/app/products/detail/page.tsx
import { PlatformProductDetail } from '@deneb-ui/ui';

export default function ProductDetailPage() {
  return <PlatformProductDetail />;
}
```

Build product links with the matching helper:

```tsx
import { platformProductDetailHref } from '@deneb-ui/ui';

<a href={platformProductDetailHref(product.id)}>View product</a>
```

For a template-specific design, keep the platform data behavior and replace
only the renderer:

```tsx
import { PlatformProductDetail } from '@deneb-ui/ui';

export default function ProductDetailPage() {
  return (
    <PlatformProductDetail
      renderProduct={(product, { productIndex }) => (
        <MyProductDetail product={product} index={productIndex} />
      )}
    />
  );
}
```

`PlatformProductDetail` reads `/products/detail/?id=PRODUCT_ID`, checks the
reactive `SiteDataProvider` catalog, retries `api.catalogUrl`, and renders safe
loading, network-error, and not-found states. `usePlatformProductDetail()` is
also exported for developers who need complete control of the page markup.

If the template already has a native `/products/[id]` design, the stable page
must reuse that renderer through `renderProduct` (or render the same component
from `usePlatformProductDetail`). The validator rejects a generic stable page
next to a different native detail layout because newly-created products would
otherwise look different from products present at build time.

---

## Data Fetching & Backend Integration Hooks

### 1. `useProducts(fallback?: ProductItem[])`
Retrieves the live products list from the site data. Automatically resolves top-level `content.products`, nested `content.home.products`, and live backend rehydration updates from `api.catalogUrl`.

```tsx
import { useProducts, ProductGrid } from '@deneb-ui/ui';

export default function CatalogSection() {
  const products = useProducts();

  return (
    <ProductGrid
      title="Featured Collection"
      subtitle="Handpicked Styles"
      products={products}
      categories={['All', 'Accessories', 'Apparel']}
      cardVariant="modern-glass" // 'modern-glass' | 'classic' | 'minimal' | 'horizontal'
      columns={{ mobile: 1, tablet: 2, desktop: 3 }}
    />
  );
}
```

### 2. `useSiteApi()`
Returns the official backend API configuration object (`SiteDataApiConfig`) defined in `site-data.json`. Use this hook whenever you need to connect custom forms or direct API calls to the backend:

```tsx
import { useSiteApi } from '@deneb-ui/ui';

export default function ApiDemo() {
  const api = useSiteApi();

  // api?.baseUrl      -> "https://api.fivora.site"
  // api?.catalogUrl   -> "https://api.fivora.site/site-catalog/:slug/live-data"
  // api?.contactUrl   -> "https://api.fivora.site/site-contact"
  // api?.analyticsUrl -> "https://api.fivora.site/site-analytics/page-view"
  
  return null;
}
```

### 3. `useSiteCatalog()`
Convenience hook that bundles catalog metadata and live status together:

```tsx
import { useSiteCatalog } from '@deneb-ui/ui';

export default function CatalogOverview() {
  const { products, services, project, siteInstance, api } = useSiteCatalog();

  return (
    <div>
      <h3>{project?.title}</h3>
      <p>Active live products: {products.length}</p>
      <p>Active live services: {services.length}</p>
    </div>
  );
}
```

### 4. `useServices(fallback?: ServiceItem[])`
Retrieves the live services list from `content.services` or `content.home.services`:

```tsx
import { useServices, ServiceCard } from '@deneb-ui/ui';

export default function ServicesList() {
  const services = useServices();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service, index) => (
        <ServiceCard
          key={service.id || index}
          itemPath={`services[${index}]`}
          service={service}
        />
      ))}
    </div>
  );
}
```

---

## Component Guides & API Reference

### 1. `GoogleFeedback` (`EditableGoogleFeedback`)

The **`GoogleFeedback`** component renders an authentic Google Reviews card experience. It features the official Google multi-colored badge, aggregate rating pill, verified buyer checks, and a responsive grid of customer reviews.

#### Key Capabilities
- **Google Design Fidelity**: Uses Google Material star vectors with authentic warm gold (`#fa7014`) and neutral grey (`#dadce0`).
- **Live 1–5 Star DOM Sync**: Typing numbers `1` through `5` into the Fivora live inspector immediately recalculates and repaints the star fills in real time via an internal `MutationObserver`.
- **Zero-Latency Visual Editing**: Built-in `data-preview-field-path` and `data-preview-list-path` attributes compliant with the Fivora Strict Visual Editing Contract.
- **Auto-Fallbacks**: Provides elegant fallback review data if no `feedbacks` array is passed.

#### Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `basePath` | `string` | `'feedback'` | Root key in `site-data.json` (`content[basePath]`) |
| `badgeIcon` | `string` | Google G SVG | URL or SVG data URI for the review platform badge |
| `badgeTitle` | `string` | `'Google'` | Review platform label displayed next to badge icon |
| `badgeRating` | `string \| number` | `'4.9'` | Aggregate rating number shown in the top header |
| `badgeReviewsCount` | `string \| number` | `'128 reviews'` | Total review count label (e.g., `'128 reviews'`) |
| `heading` | `string` | `'Loved by Coffee Lovers...'` | Section main heading |
| `subheading` | `string` | `'Real stories and reviews...'` | Section introductory paragraph |
| `feedbacks` | `FeedbackItem[]` | `DEFAULT_FEEDBACKS` | Array of customer review items |
| `maxStars` | `number` | `5` | Maximum number of rating stars to render per card |
| `className` | `string` | `''` | Custom CSS / Tailwind classes for section wrapper |
| `cardClassName` | `string` | `''` | Custom CSS / Tailwind classes for review cards |

#### `FeedbackItem` Schema

```typescript
export interface FeedbackItem {
  id?: string | number;
  name?: string;              // Reviewer full name
  avatar?: string;            // Avatar image URL
  rating?: number | string;   // Star rating value (1 to 5)
  date?: string;              // Relative date (e.g. "2 days ago")
  comment?: string;           // Review body text
  verified?: boolean;         // Verified customer badge
}
```

#### Fivora Data Contract (`site-data.json`)

```json
{
  "content": {
    "feedback": {
      "badgeIcon": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
      "badgeTitle": "Google",
      "badgeRating": "4.9",
      "badgeReviewsCount": "128 reviews",
      "heading": "Loved by Coffee Lovers Across the World",
      "subheading": "Real stories and reviews from our community of coffee purists and daily ritualists.",
      "feedbacks": [
        {
          "id": "1",
          "name": "Elena Vance",
          "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
          "rating": 5,
          "date": "3 days ago",
          "comment": "The Yirgacheffe pour-over is unmatched. Clean notes of jasmine and bergamot.",
          "verified": true
        }
      ]
    }
  }
}
```

#### Fivora `editorSchema` Section

```json
{
  "id": "feedback",
  "path": "feedback",
  "type": "object",
  "label": "Google Customer Feedback",
  "pageKey": "home",
  "fields": [
    { "key": "badgeIcon", "type": "image", "label": "Badge Icon URL" },
    { "key": "badgeTitle", "type": "text", "label": "Badge Title" },
    { "key": "badgeRating", "type": "text", "label": "Aggregate Rating" },
    { "key": "badgeReviewsCount", "type": "text", "label": "Reviews Count" },
    { "key": "heading", "type": "text", "label": "Section Heading" },
    { "key": "subheading", "type": "textarea", "label": "Section Subheading" },
    {
      "key": "feedbacks",
      "type": "list",
      "label": "Customer Reviews",
      "itemLabel": "Review",
      "minItems": 1,
      "maxItems": 12,
      "fields": [
        { "key": "name", "type": "text", "label": "Reviewer Name", "required": true },
        { "key": "avatar", "type": "image", "label": "Profile Picture" },
        { "key": "rating", "type": "number", "label": "Star Rating (1-5)" },
        { "key": "date", "type": "text", "label": "Review Date" },
        { "key": "comment", "type": "textarea", "label": "Review Comment", "required": true }
      ]
    }
  ]
}
```

#### Usage Example

```tsx
import { GoogleFeedback, useSiteData } from "@deneb-ui/ui";

export function FeedbackSection() {
  const { siteData } = useSiteData();
  const feedbackData = siteData?.content?.feedback || {};

  return (
    <section className="py-20 bg-amber-50/40">
      <GoogleFeedback
        basePath="feedback"
        badgeIcon={feedbackData.badgeIcon}
        badgeTitle={feedbackData.badgeTitle}
        badgeRating={feedbackData.badgeRating}
        badgeReviewsCount={feedbackData.badgeReviewsCount}
        heading={feedbackData.heading}
        subheading={feedbackData.subheading}
        feedbacks={feedbackData.feedbacks}
      />
    </section>
  );
}
```

---

### 2. `TestimonialSection` (`EditableTestimonialSection`)

The **`TestimonialSection`** component provides an editorial, magazine-grade layout for connoisseur quotes, culinary critics, and press reviews.

#### Key Capabilities
- **Editorial Typography**: Large quotation marks, serif italic styling, and prominent author metadata.
- **Accreditation Tags**: Includes specialty tags (e.g. *"Michelin Guide"*, *"World Barista Judge"*).
- **Synchronized Star Ratings**: Dynamic star rating with live inspector sync.
- **Clean Layout**: Fluid responsive grid adapting from 1 column on mobile to 3 columns on desktop.

#### Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `basePath` | `string` | `'testimonials'` | Root key in `site-data.json` (`content[basePath]`) |
| `badge` | `string` | `'Critic Acclaim'` | Small uppercase pill badge text |
| `heading` | `string` | `'What Connoisseurs Say'` | Main section title |
| `subheading` | `string` | `'Unfiltered impressions...'` | Subtitle description text |
| `testimonials` | `TestimonialSectionItem[]` | `DEFAULT_TESTIMONIALS` | Array of testimonial items |
| `maxStars` | `number` | `5` | Maximum number of stars per card |
| `className` | `string` | `''` | Section container CSS classes |
| `cardClassName` | `string` | `''` | Individual testimonial card CSS classes |

#### `TestimonialSectionItem` Schema

```typescript
export interface TestimonialSectionItem {
  id?: string | number;
  quote?: string;             // Testimonial quote text
  author?: string;            // Author full name
  role?: string;              // Profession, publication, or title
  avatar?: string;            // Author portrait URL
  tag?: string;               // Category or accreditation badge
  rating?: number | string;   // Star rating (1 to 5)
}
```

#### Usage Example

```tsx
import { TestimonialSection, useSiteData } from "@deneb-ui/ui";

export function EditorialReviews() {
  const { siteData } = useSiteData();
  const data = siteData?.content?.testimonials || {};

  return (
    <TestimonialSection
      basePath="testimonials"
      badge={data.badge}
      heading={data.heading}
      subheading={data.subheading}
      testimonials={data.testimonials}
    />
  );
}
```

---

### 3. `Map` (`EditableMap`)

The **`Map`** component is an intelligent universal Google Maps embedder. It converts any format of Google Maps URL or search query into a high-performance, responsive iframe embed.

#### Universal Link Parser Features
The underlying `parseGoogleMapsEmbedUrl` engine seamlessly processes:
1. **Full `<iframe>` Snippets**: Extracts the `src` attribute automatically when developers or merchants paste standard Google Maps embed HTML.
2. **Standard Embed URLs**: Passes through existing `google.com/maps/embed?...` URLs directly.
3. **Coordinate URLs**: Parses `@lat,lng` patterns (e.g. `google.com/maps/@6.9271,79.8612,15z`).
4. **Place URLs**: Extracts place names from `/maps/place/Name` paths.
5. **Search Query URLs**: Parses `?q=...` parameters.
6. **Short Links**: Handles `maps.app.goo.gl` links with automatic fallback to merchant address.
7. **Raw Search Strings**: Directly wraps street addresses or city names into valid Google Maps embed queries.

#### Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mapUrl` | `string` | `undefined` | Google Maps URL, share link, coordinate link, or embed code |
| `address` | `string` | `'Sri Lanka'` | Fallback physical address when `mapUrl` is empty or unresolved |
| `defaultLocation` | `string` | `undefined` | Additional location fallback |
| `data-preview-field-path` | `string` | `undefined` | Fivora visual editing binding path |
| `className` | `string` | `'w-full h-full border-0'` | CSS classes for the iframe element |
| `title` | `string` | `'Google Map Location'` | Accessibility title for the iframe |

#### Usage Example

```tsx
import { Map } from "@deneb-ui/ui";

export function ContactMapSection({ mapUrl, address }: { mapUrl?: string; address?: string }) {
  return (
    <div className="w-full h-96 sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
      <Map
        data-preview-field-path="contact.mapUrl"
        mapUrl={mapUrl}
        address={address}
        className="w-full h-full border-0"
      />
    </div>
  );
}
```

---

## ARC Engine & Fivora Platform Architecture

`@deneb-ui/ui` is built from the ground up for the **ARC Engine** (`@deneb-ui/cli`) and the **Fivora Visual Commerce Platform**.

```
┌─────────────────────────────────────────────────────────────┐
│                    Fivora Admin Portal                      │
│                  (Inspector / Live Studio)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Live PostMessage Protocol
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Fivora Preview Focus Bridge                │
│    - Focus Target Identification (data-preview-field-path)  │
│    - Fast DOM Mutation & Star Fill Repainting               │
└──────────────────────────────┬──────────────────────────────┘
                               │ Instant DOM / Observer Sync
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       DENEB UI                              │
│    - GoogleFeedback (MutationObserver Dual-Layer Rating)    │
│    - TestimonialSection (Editorial Critic Cards)            │
│    - EditableMap (Universal URL Parsing Engine)             │
└─────────────────────────────────────────────────────────────┘
```

### Dual-Layer Live Rating Architecture

When editing ratings in visual site builders, updating an element's text content usually destroys child SVG icons. DENEB UI solves this through a dual-layer architecture:

1. **Inspector Target**: A dedicated `<span data-preview-field-path="...">` renders the numeric string (e.g. `"5"`).
2. **Visual Star Array**: A sibling `<div data-fivora-stars-row="true">` contains the 5 vector SVG stars with fill colors `#fa7014` (gold) and `#dadce0` (grey).
3. **`MutationObserver`**: An internal observer listens for inspector text mutations on the numeric span and immediately updates the SVG star fills without remounting or re-rendering errors.
4. **Focus Bridge Support**: The CLI preview bridge recognizes star rating containers and synchronizes fills directly during live keystrokes.

### ARC Engine Automated Scaffolding

When running the ARC Engine:
```bash
npx @deneb-ui/cli arc init
```

The engine automatically:
- Identifies `GoogleFeedback`, `TestimonialSection`, and `Map` components.
- Creates semantic field paths (`feedback.feedbacks`, `testimonials.testimonials`, `contact.mapUrl`).
- Generates typed `editorSchema` sections with proper numeric, image, and textarea descriptors.
- Adds non-editable internal IDs to `visualEditing.controlOnlyPaths` to guarantee 100% contract compliance with Fivora platform ingestion.

---

### Modular Section Architecture (`<section>` & `<Section>`)

DENEB UI introduces a modular `<section>` architecture designed specifically for visual website builders, enabling 1-click section deletion, full layout centering, and background styling.

#### Key Features
* **100% Contract Compliant**: Automatically sets `data-design-section`, `data-section-id`, and `id`.
* **1-Click Delete / Hide**: Supports `hidden={true}` or visual editor hide toggle (`display: none`).
* **Instant Centering**: One-prop horizontal and text centering with `center={true}` or `align="center"`.
* **Responsive Container**: `container={true}` wraps children in a responsive, max-width contained inner wrapper (`1280px`).

```tsx
import { Section, EditableSection, Heading, Paragraph, Button } from "@deneb-ui/ui";

export function PromoSection() {
  return (
    // Clean shorthand alias
    <Section 
      name="special-promo" 
      center={true} 
      container={true}
      bg="#f8fafc"
      padding="xl"
    >
      <Heading level={2} id="promo.title" defaultValue="Limited Time Offer" />
      <Paragraph id="promo.subtitle" defaultValue="Get 20% off all handcrafted items." />
      <Button id="promo.cta" defaultValue="Shop the Sale" />
    </Section>
  );
}
```

---

### Dual Product Pricing & Apparel Variants

DENEB UI commerce components natively support both **Single Fixed Prices** and **Dynamic Price Ranges**, as well as apparel clothing options (color swatches with image swapping and size chips).

Fivora uses one canonical catalog contract: `ProductCard` is the commerce
renderer, `ServiceCard` is the service/quote renderer, and `UniversalCard` is
reserved for other generic entity listings. Keep `imageUrl` as the primary
image and `additionalImages` as the ordered gallery; DENEB normalizes them to
`images`/`gallery` for detail and quick-view components.

Keep `price`, `compareAtPrice`, `minPrice`, `maxPrice`, and variant prices as
JSON numbers. Keep `currency` or a currency symbol as separate text. A formatted
`priceRange` string is display-only; numeric filters and sorting must use the
numeric amount fields.

#### 1. Single Fixed Price
```tsx
import { ProductCard } from "@deneb-ui/ui";

<ProductCard
  item={{
    id: "prod-1",
    name: "Classic Silk Shirt",
    price: 3500,
    compareAtPrice: 4500,
    currency: "LKR",
    imageUrl: "/images/shirt.jpg",
    additionalImages: ["/images/shirt-back.jpg", "/images/shirt-detail.jpg"]
  }}
  itemPath="products[0]"
/>
```

#### 2. Dynamic Price Range & Apparel Color Swatches
```tsx
import { ProductCard } from "@deneb-ui/ui";

<ProductCard
  item={{
    id: "prod-2",
    name: "Linen Summer Tunic",
    minPrice: 2500,
    maxPrice: 4500,
    priceRange: "LKR 2,500 – LKR 4,500",
    isPriceRange: true,
    currency: "LKR",
    imageUrl: "/images/tunic-navy.jpg",
    additionalImages: ["/images/tunic-back.jpg", "/images/tunic-detail.jpg"],
    colors: [
      { name: "Navy Blue", hex: "#1e3a8a", imageUrl: "/images/tunic-navy.jpg" },
      { name: "Olive Green", hex: "#3f6212", imageUrl: "/images/tunic-olive.jpg" },
      { name: "Cream White", hex: "#f8fafc", imageUrl: "/images/tunic-white.jpg" }
    ],
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { color: "Navy Blue", size: "S", price: 2500 },
      { color: "Navy Blue", size: "XL", price: 3200 },
      { color: "Olive Green", size: "L", price: 4500 }
    ]
  }}
  itemPath="products[1]"
  whatsappPhone="+94771234567"
/>
```
* **Interactive Color Swatches**: Clicking a color automatically swaps the card's active product photo to that color's image.
* **Variant Price Resolution**: Displays the range (`LKR 2,500 – LKR 4,500`) initially, then resolves to the exact variant price when a size/color is selected.
* **Smart WhatsApp & Cart**: Automatically compiles `[Color: Navy Blue, Size: XL]` into the customer's WhatsApp order message and cart drawer line items.

---

## Reference Examples

DENEB UI includes full, ready-to-run reference examples demonstrating modular layouts, dual pricing, and complete storefront architecture:

```tsx
import {
  SectionLayoutExample,
  ProductPricingExample,
  CompleteStorefrontExample
} from "@deneb-ui/ui";

// 1. Modular section centering & hiding controls
export function SectionDemo() {
  return <SectionLayoutExample />;
}

// 2. Single price, price ranges, and apparel swatches with photo switching
export function CommerceDemo() {
  return <ProductPricingExample />;
}

// 3. Full production-ready Next.js storefront page
export function FullStorefrontDemo() {
  return <CompleteStorefrontExample />;
}
```

---

## Related Packages

| Package | Purpose |
| :--- | :--- |
| [`@deneb-ui/ui`](https://www.npmjs.com/package/@deneb-ui/ui) | Visual-First React component framework |
| [`@deneb-ui/cli`](https://www.npmjs.com/package/@deneb-ui/cli) | ARC Engine compiler, AST transformer & template lab |
| [`@deneb-ui/core`](https://www.npmjs.com/package/@deneb-ui/core) | Shared design tokens, typography registry & contracts |
| [`@deneb-ui/create-template`](https://www.npmjs.com/package/@deneb-ui/create-template) | Instant storefront generator |

---

## EditableBox container styles

Use `stylePath` to give a container its own card style target without treating
its child text as a single content field. Contact starter cards use
`contact.informationCard` and `contact.formCard` in both templates. For example,
`styles['contact.informationCard'] = { backgroundColor: '#f0fdf4', paddingTop: 0,
paddingBottom: 24, paddingLeft: 24, paddingRight: 24, marginTop: 8, gap: 16 }`.
These are root `styles` entries, not new content fields. Unedited boxes retain
their existing props and class-based appearance. Saved styles override defaults;
legacy content-suffix spacing remains supported. Gap affects a box's direct
flex/grid children, not a nested form's internal spacing.

In Local Lab, select the card's empty background/padding area to target its
container. Text remains independently editable. Test background, each padding
edge (including zero), margins, and flex/grid gap, then save/reload. The bridge
forwards card style metadata; actual Inspector controls depend on the connected
Fivora editor. Run `node scripts/box-editing.test.cjs` after building core/UI.

## Footer headings and contact icons

Built-in `EditableIcon` glyphs with a `fieldPath` now use an HTML span as their
editing boundary, matching the existing custom-icon branches. The SVG remains
inside it with its original size and SVG attributes; the field and icon-picker
markers occur only on the wrapper. This lets HTML-based editor selection resolve
clicks on SVG paths to the icon field rather than a neighboring text field.
Icons without a `fieldPath` continue to render a bare SVG.

`Footer` reuses `EditableText` for `common.footerExploreHeading` and
`common.footerContactHeading`, including text style targets. It reuses
`EditableIcon` for `common.footerEmailIcon`, `common.footerPhoneIcon`, and
`common.footerLocationIcon`. These are content-relative paths under
`content.common`; default icon names are `mail`, `phone`, and `map-pin`.
The starter schemas declare the icons as text with `control: 'icon-picker'`.
Contact icons appear alongside their corresponding nonempty contact values.
Missing fields retain the original headings/icons; blank headings remain
editable through placeholders. Verify heading text/typography and icon selection
in the Lab, then save/reload. Contact values and destinations are independent
of icon selection.

## Footer newsletter description

The newsletter also exposes `content.common.newsletterSubscribeLabel` and
`content.common.newsletterEmailPlaceholder`. The button label reuses
`EditableText`; the email input uses the existing input-placeholder field binding
pattern. The visitor's entered email remains separate from the editable
placeholder. Both starter schemas declare these as text fields. Original copy
is the fallback when fields are missing; blank placeholder values are preserved.
Verify edits and save/reload in Local Lab, plus newsletter submission in Preview.

`Footer` / `EditableFooter` reuses `EditableText` for
`content.common.newsletterDescription`. Its field and text style target are
`common.newsletterDescription`; saved typography lives at
`styles['common.newsletterDescription']`. Missing data uses the original copy;
an empty string keeps an editable placeholder. Both starter templates declare
the field as a textarea. With newsletters enabled, edit the paragraph in the
Lab, save, and reload to verify persistence.

## Authors

Created and maintained by **[Chamika Gayashan](https://github.com/chamikathereal)** and **[Induranga Kawishwara](https://github.com/Induranga-kawishwara)**.

Part of the **DENEB UI** ecosystem · In collaboration with **[Fivora](https://fivora.site)**.

<p align="center">
  <sub>MIT © DENEB UI — The Visual-First React Framework</sub>
</p>
