import { RoutePath } from "../types";
import { Facebook, Twitter, Linkedin, Instagram, Anchor, ShieldCheck } from "lucide-react";
// @ts-ignore
import cbbclLogo from "../assets/logo.png";

interface FooterProps {
  navigate: (path: RoutePath) => void;
}

export default function Footer({ navigate }: FooterProps) {
  const handleLinkClick = (path: RoutePath) => {
    navigate(path);
  };

  return (
    <footer id="cbbcl-footer" className="bg-navy text-slate-300 font-sans border-t border-navy-light pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Column 1: Logo, Tagline, Social */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleLinkClick("/")}>
              <img
                src={cbbclLogo}
                alt="Cox's Bazar Boat Club Limited Logo"
                className="object-contain h-[42px]"
                style={{ imageRendering: "auto" }}
              />
            </div>
            
            <p className="text-slate-400 text-xs font-light tracking-wide leading-relaxed pt-2">
              Bangladesh’s premier coastal sanctuary and private social club, incorporated as a Non-Profit Company under The Companies Act, 1994. Elevating nautical culture and oceanfront companionship.
            </p>
            
            <div className="flex space-x-4 pt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-navy-mid border border-navy-light rounded-sm text-gold hover:text-white hover:border-gold transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-navy-mid border border-navy-light rounded-sm text-gold hover:text-white hover:border-gold transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-navy-mid border border-navy-light rounded-sm text-gold hover:text-white hover:border-gold transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-navy-mid border border-navy-light rounded-sm text-gold hover:text-white hover:border-gold transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-sm tracking-widest text-gold uppercase border-b border-navy-light pb-2">
              Explore the Club
            </h4>
            <ul className="space-y-2 text-xs font-light">
              {[
                { label: "Home Base", path: "/" as RoutePath },
                { label: "About Our Story", path: "/about.html" as RoutePath },
                { label: "Club Facilities Showcase", path: "/facilities.html" as RoutePath },
                { label: "Board of Directors", path: "/board.html" as RoutePath },
                { label: "Club News Feed", path: "/news-feed.html" as RoutePath },
                { label: "Affiliations", path: "/affiliations.html" as RoutePath }
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleLinkClick(link.path)}
                    className="hover:text-gold transition-colors text-left"
                  >
                    → {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Membership Tiers */}
          <div className="space-y-4">
            <h4 className="font-display text-sm tracking-widest text-gold uppercase border-b border-navy-light pb-2">
              Membership Categories
            </h4>
            <ul className="space-y-1.5 text-xs font-light text-slate-400">
              <li>🏆 Donor Membership</li>
              <li>🏵️ Life Membership</li>
              <li>🛡️ Permanent Membership</li>
              <li>⚓ Associate Membership</li>
              <li>🌍 Diplomat & Foreign Cadet</li>
              <li>🏢 Corporate Patronage</li>
              <li>🤝 Honorary Board Membership</li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleLinkClick("/membership.html" as RoutePath)}
                className="text-[10px] font-sans font-semibold tracking-widest uppercase text-white bg-gold-dark hover:bg-gold px-4 py-2 rounded-sm transition-colors"
              >
                Category Qualifications
              </button>
            </div>
          </div>

          {/* Column 4: Contact Details */}
          <div className="space-y-4">
            <h4 className="font-display text-sm tracking-widest text-gold uppercase border-b border-navy-light pb-2">
              Contact Registry
            </h4>
            <ul className="space-y-3 text-xs font-light text-slate-400">
              <li>
                <span className="text-gold font-medium block">CLUBSPACE SECRETARIAT:</span>
                Coastal Point Bypass, Marine Drive Boulevard, Cox's Bazar, Bangladesh.
              </li>
              <li>
                <span className="text-gold font-medium block">REGISTRY EMAIL:</span>
                registry@cbbcl.org / admin@cbbcl.org
              </li>
              <li>
                <span className="text-gold font-medium block">RESERVATION HOTLINE:</span>
                +880 1711-223344 (Registry Desk)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar footer copyright */}
        <div className="border-t border-navy-light pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 font-light tracking-wider">
          <div className="mb-4 md:mb-0">
            © 2026 Cox's Bazar Boat Club Limited. All Rights Reserved. Incorporated under The Companies Act, 1994, Bangladesh.
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>Guaranteed Non-Profit Social Club Limited by Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
