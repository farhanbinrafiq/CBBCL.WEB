import { RoutePath } from "../types";
import { Facebook, Twitter, Linkedin, Instagram, ShieldCheck } from "lucide-react";
import LogoSvg from "./LogoSvg";

interface FooterProps {
  navigate: (path: RoutePath) => void;
}

export default function Footer({ navigate }: FooterProps) {
  const handleLinkClick = (path: RoutePath) => {
    navigate(path);
  };

  return (
    <footer id="cbbcl-footer" className="bg-[#111625] text-slate-300 font-sans pt-16 pb-12 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Responsive Grid Layout. Split order ensures the Logo remains centered and first on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.6fr_1.2fr] gap-12 lg:gap-8 xl:gap-14 items-center">
          
          {/* LEFT SIDE CONTENT (order-2 on mobile, lg:order-1 on desktop) */}
          <div className="order-2 lg:order-1 flex flex-col justify-between h-full space-y-8">
            <div className="space-y-4">
              <h3 className="font-display text-lg tracking-[0.2em] text-gold uppercase font-semibold">
                Cox's Bazar Boat Club
              </h3>
              <p className="text-slate-400 text-xs font-light tracking-wide leading-relaxed max-w-[340px]">
                Bangladesh’s premier coastal sanctuary and private social club, incorporated as a Non-Profit Company under The Companies Act, 1994. Elevating nautical culture and oceanfront companionship.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full pt-2">
              {/* Explore Section */}
              <div className="space-y-3">
                <h4 className="font-display text-[10px] tracking-widest text-[#a1a1aa] font-medium uppercase border-b border-white/[0.08] pb-1.5 mb-3">
                  Explore the Club
                </h4>
                <ul className="space-y-2 text-xs font-light">
                  {[
                    { label: "Home Base", path: "/" as RoutePath },
                    { label: "About Our Story", path: "/about.html" as RoutePath },
                    { label: "Facilities Showcase", path: "/facilities.html" as RoutePath },
                    { label: "Board of Directors", path: "/board.html" as RoutePath },
                    { label: "Club News Feed", path: "/news-feed.html" as RoutePath },
                    { label: "Affiliations", path: "/affiliations.html" as RoutePath }
                  ].map((link, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleLinkClick(link.path)}
                        className="hover:text-gold transition-colors text-left text-slate-400 hover:text-gold-light text-xs font-light block"
                      >
                        → {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Membership Section */}
              <div className="space-y-3">
                <h4 className="font-display text-[10px] tracking-widest text-[#a1a1aa] font-medium uppercase border-b border-white/[0.08] pb-1.5 mb-3">
                  Membership Categories
                </h4>
                <ul className="space-y-2 text-xs font-light text-slate-400">
                  <li className="flex items-center space-x-2">
                    <span className="text-gold text-xs">🏆</span> <span>Donor Membership</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-gold text-xs">🏵️</span> <span>Life Membership</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-gold text-xs">🛡️</span> <span>Permanent Membership</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-gold text-xs">⚓</span> <span>Associate Membership</span>
                  </li>
                </ul>
                <div className="pt-3">
                  <button
                    onClick={() => handleLinkClick("/membership.html" as RoutePath)}
                    className="text-[9px] font-sans font-semibold tracking-widest uppercase text-white bg-gold border border-gold hover:bg-gold-light hover:border-gold-light px-3 py-1.5 rounded-sm transition-all cursor-pointer block text-center"
                  >
                    View Qualifications
                  </button>
                </div>
              </div>
            </div>

            {/* Solid Horizontal Separator + Left Copyright Sub-footer */}
            <div className="border-t border-white/[0.08] pt-4 mt-6">
              <p className="text-[10px] text-slate-500 font-light tracking-wider leading-relaxed">
                © 2026 Cox's Bazar Boat Club Limited. All Rights Reserved. Incorporated under The Companies Act, 1994, Bangladesh.
              </p>
            </div>
          </div>

          {/* CENTER DESIGN ELEMENT: Monumental SVG Logo Emblem (order-1 on mobile, lg:order-2 on desktop) */}
          <div className="order-1 lg:order-2 flex flex-col justify-center items-center py-6 lg:py-0 w-full">
            <div className="relative group transition-all duration-500 hover:scale-[1.02]">
              {/* Perfectly centered, large premium circular shield/crest layout */}
              <LogoSvg className="h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] md:h-[400px] md:w-[400px] lg:h-[470px] lg:w-[470px] block" />
            </div>
          </div>

          {/* RIGHT SIDE CONTENT (order-3 on mobile, lg:order-3 on desktop) */}
          <div className="order-3 lg:order-3 flex flex-col justify-between h-full space-y-8 text-left lg:text-right lg:items-end">
            <div className="space-y-4 w-full">
              <h4 className="font-display text-[10px] tracking-widest text-[#a1a1aa] font-medium uppercase border-b border-white/[0.08] pb-1.5 mb-3 inline-block lg:block lg:text-right">
                Contact Registry
              </h4>
              <ul className="space-y-4 text-xs font-light text-slate-400">
                <li>
                  <span className="text-gold font-semibold tracking-wider block text-xs uppercase mb-0.5">CLUBSPACE SECRETARIAT</span>
                  <span className="leading-relaxed">Coastal Point Bypass, Marine Drive Boulevard,<br className="hidden lg:inline" /> Cox's Bazar, Bangladesh.</span>
                </li>
                <li>
                  <span className="text-gold font-semibold tracking-wider block text-xs uppercase mb-0.5">REGISTRY EMAIL</span>
                  <span className="block">registry@cbbcl.org / admin@cbbcl.org</span>
                </li>
                <li>
                  <span className="text-gold font-semibold tracking-wider block text-xs uppercase mb-0.5">RESERVATION HOTLINE</span>
                  <span className="block">+880 1711-223344 (Registry Desk)</span>
                </li>
              </ul>
            </div>

            {/* Social media container aligned right */}
            <div className="pt-2 w-full flex lg:justify-end">
              <div className="flex space-x-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/[0.02] border border-white/[0.08] rounded-sm text-gold hover:text-white hover:border-gold-light hover:bg-[#9e7f46]/10 transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/[0.02] border border-white/[0.08] rounded-sm text-gold hover:text-white hover:border-gold-light hover:bg-[#9e7f46]/10 transition-colors" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/[0.02] border border-white/[0.08] rounded-sm text-gold hover:text-white hover:border-gold-light hover:bg-[#9e7f46]/10 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/[0.02] border border-white/[0.08] rounded-sm text-gold hover:text-white hover:border-gold-light hover:bg-[#9e7f46]/10 transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Solid Horizontal Separator + Right Guarantee Sub-footer */}
            <div className="border-t border-white/[0.08] pt-4 mt-6 w-full flex lg:justify-end items-center">
              <div className="flex items-center space-x-2 text-slate-500 text-[10px] font-light tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Guaranteed Non-Profit Social Club Limited by Guarantee</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
