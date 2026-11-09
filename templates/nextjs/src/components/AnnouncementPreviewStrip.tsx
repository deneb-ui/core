'use client';

import { useSiteData } from '@/lib/siteDataContext';
// Source import keeps this local preview usable without rebuilding the UI package.
import { EditableRotatingAnnouncementBar } from '../../../../packages/deneb-ui/src/EditableRotatingAnnouncementBar';
import { SiteDataContext } from '../../../../packages/deneb-ui/src/SiteDataProvider';

export default function AnnouncementPreviewStrip() {
  const siteData = useSiteData();

  // Share the existing provider's live data with the source component's context.
  // Do not mount another provider with its own API or editor message handlers.
  return (
    <div data-preview-page-key="announcement_bar_preview">
      <SiteDataContext.Provider value={siteData}>
        <EditableRotatingAnnouncementBar listPath="announcementBarPreview.announcements" />
      </SiteDataContext.Provider>
    </div>
  );
}
