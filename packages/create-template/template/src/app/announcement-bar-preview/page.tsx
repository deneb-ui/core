export default function AnnouncementBarPreviewPage() {
  return (
    <section id="preview-details" data-preview-page-key="announcement_bar_preview"
      style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(3rem, 8vw, 7rem) 1.5rem', textAlign: 'center' }}>
      <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>A fresh perspective</p>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: 1.15, marginBottom: 24 }}>Good things, thoughtfully chosen.</h1>
      <p style={{ maxWidth: 540, margin: '0 auto', lineHeight: 1.8 }}>Discover the latest arrivals, enjoy a little extra with every order, and find something to make your day.</p>
    </section>
  );
}
