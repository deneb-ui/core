import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface FloatingNavbarProps {
  onOpenTestDrive: () => void;
  onOpenSearch: () => void;
  compareCount: number;
  onOpenCompare: () => void;
}

export interface EditablefloatingNavbarProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  siteData: any;
  imageFallback?: string;
  as?: React.ElementType;
}

export function EditablefloatingNavbar({
  itemPath,
  siteData,
  imageFallback = '/placeholder.svg',
  as: Component = 'header',
  compareCount,
  onOpenTestDrive,
  onOpenSearch,
  onOpenCompare,
  className = '',
  style,
  ...props
}: EditablefloatingNavbarProps) {
  const navLinks = siteData?.content?.common?.navLinks ?? [
    { id: 'home', label: 'Home', href: '#hero' },
    { id: 'inventory', label: 'Inventory', href: '#inventory' },
    { id: 'brands', label: 'Brands', href: '#brands' },
    { id: 'showcase', label: 'Showcase', href: '#showcase' },
    { id: 'studio', label: '360° Studio', href: '#studio-360' },
    { id: 'performance', label: 'Performance', href: '#performance' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  return (
    <Component
      data-preview-item-path={itemPath}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out flex justify-center px-4 sm:px-8 ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      <div className={`w-full max-w-7xl flex items-center justify-between transition-all duration-500 rounded-2xl px-5 sm:px-7`}>
        <a
          href="#hero"
          className="group flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="relative w-8 h-8 rounded-md bg-gradient-to-br from-red-600 via-rose-600 to-neutral-900 p-[1px] shadow-[0_0_15px_rgba(225,29,72,0.4)] group-hover:shadow-[0_0_25px_rgba(225,29,72,0.8)] transition-shadow">
            <div className="w-full h-full bg-[#050608] rounded-md flex items-center justify-center">
              <span className="font-display font-black text-sm tracking-tighter text-white" data-preview-static="decorative-copy">A</span>
            </div>
          </div>
          <div className="flex flex-col">
            <EditableText
              as="span"
              id={`${itemPath}.header.apexLabel`}
              data-preview-field-path={`${itemPath}.header.apexLabel`}
              defaultValue={siteData?.content?.common?.header?.apexLabel ?? "APEX"}
              className="font-display font-extrabold text-base tracking-[0.25em] text-white group-hover:text-red-400 transition-colors"
            />
            <EditableText
              as="span"
              id={`${itemPath}.header.motorsLabel`}
              data-preview-field-path={`${itemPath}.header.motorsLabel`}
              defaultValue={siteData?.content?.common?.header?.motorsLabel ?? "MOTORS"}
              className="text-[8px] font-mono tracking-[0.35em] text-neutral-400 uppercase -mt-1"
            />
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06] backdrop-blur-md">
          {navLinks.map((link, index) => (
            <a
              key={link.id}
              href={link.href}
              className={`relative px-3.5 py-1.5 text-xs tracking-wider uppercase font-medium transition-all duration-300 rounded-full select-none`}
              data-preview-item-path={`${itemPath}.navLinks[${index}]`}
              data-preview-field-path={`${itemPath}.navLinks[${index}].href`}
            >
              <EditableText
                as="span"
                id={`${itemPath}.navLinks[${index}].label`}
                data-preview-field-path={`${itemPath}.navLinks[${index}].label`}
                defaultValue={link.label}
                className={`text-neutral-400 hover:text-neutral-200`}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
            title="Search inventory"
            data-cursor="SEARCH"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCompare}
            className="relative hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-medium text-white bg-red-600/20 border border-red-500/40 hover:bg-red-600/30 transition-all cursor-pointer shadow-[0_0_15px_rgba(225,29,72,0.3)]"
            data-cursor="COMPARE"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-400" />
            <EditableText
              as="span"
              id={`${itemPath}.header.compareLabel`}
              data-preview-field-path={`${itemPath}.header.compareLabel`}
              defaultValue={siteData?.content?.common?.header?.compareLabel ?? "Compare"}
            />
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
              {compareCount}
            </span>
          </button>

          <button
            onClick={onOpenTestDrive}
            className="relative group overflow-hidden px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(225,29,72,0.35)] hover:shadow-[0_0_30px_rgba(225,29,72,0.65)] transition-all cursor-pointer flex items-center gap-1.5"
            data-cursor="BOOK"
          >
            <EditableText
              as="span"
              id={`${itemPath}.header.bookTestDriveLabel`}
              data-preview-field-path={`${itemPath}.header.bookTestDriveLabel`}
              defaultValue={siteData?.content?.common?.header?.bookTestDriveLabel ?? "BOOK TEST DRIVE"}
            />
            <ArrowUpRight className="w-3.5 h-3.5 relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-neutral-300 bg-white/[0.04] border border-white/10 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </Component>
  );
}