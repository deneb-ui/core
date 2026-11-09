'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useSiteData } from '@/lib/siteDataContext';
import { Navbar, Footer, AnnouncementBar, FloatingContactWidget, getThemeCssProperties } from '@deneb-ui/ui';
import { ThemeToggle } from './ThemeToggle';

const AnnouncementPreviewStrip = dynamic(() => import('./AnnouncementPreviewStrip'));

export default function SiteChrome({ children }: { children: ReactNode }) {
  const siteData = useSiteData();
  const pathname = usePathname();
  const isAnnouncementPreview = pathname === '/announcement-bar-preview' || pathname === '/announcement-bar-preview/';
  const themeStyle = getThemeCssProperties(
    siteData?.template?.structure?.theme as any,
  );

  return (
    <div className="site-shell" style={themeStyle}>
      {isAnnouncementPreview ? <AnnouncementPreviewStrip /> : <AnnouncementBar />}
      <Navbar activeRoute={pathname} />
      <main>{children}</main>
      <Footer />
      <FloatingContactWidget />
      <div className="fixed bottom-6 left-6 z-40">
        <ThemeToggle showLabel className="shadow-lg backdrop-blur-md" />
      </div>
    </div>
  );
}
