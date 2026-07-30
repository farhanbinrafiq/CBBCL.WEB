import { useState, useEffect } from "react";
import { RoutePath, FooterSettings } from "../types";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, ShieldCheck } from "lucide-react";
import { fetchFooterSettings, getFooterSettingsSync, getNavCMS } from "../utils/cmsStorage";
import LogoSvg from "./LogoSvg";

interface FooterProps {
  navigate: (path: RoutePath) => void;
}

export default function Footer({ navigate }: FooterProps) {
  const [data, setData] = useState<FooterSettings>(() => getFooterSettingsSync());

  useEffect(() => {
    fetchFooterSettings().then((res) => {
      if (res && res.socialLinks) {
        setData(res);
      }
    });

    const handleFooterUpdate = () => {
      setData(getFooterSettingsSync());
    };
    window.addEventListener("cbbcl-footer-updated", handleFooterUpdate);
    return () => window.removeEventListener("cbbcl-footer-updated", handleFooterUpdate);
  }, []);

  const handleLinkClick = (path: RoutePath) => {
    const clean = path ? (path.replace(/\.html$/, "") as RoutePath) : "/";
    navigate(clean);
  };

  return (
    <footer id="cbbcl-footer" className="relative bg-navy text-slate-300 font-sans pt-16 pb-12 overflow-hidden select-none">
      <div className="container">

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.6fr_1.2fr] gap-12 lg:gap-8 xl:gap-14 items-center">

          {/* LEFT SIDE */}
          <div className="order-2 lg:order-1 flex flex-col justify-between h-full space-y-8">
            <div className="space-y-4">
              <h3 className="font-display text-lg tracking-[0.2em] text-gold uppercase font-semibold">
                Cox's Bazar Boat Club
              </h3>
              <p className="text-slate-400 text-xs font-light tracking-wide leading-relaxed max-w-[340px]">
                Bangladesh's premier coastal sanctuary and private social club, incorporated as a Non-Profit Company under The Companies Act, 1994. Elevating nautical culture and oceanfront companionship.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full pt-2">
              {data.footerLinks && data.footerLinks.slice(0, 2).map((group, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="font-display text-[10px] tracking-widest text-[#a1a1aa] font-medium uppercase border-b border-white/[0.08] pb-1.5 mb-3">
                    {group.title}
                  </h4>
                  <ul className="space-y-2 text-xs font-light">
                    {group.links && group.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        <button
                          onClick={() => handleLinkClick(link.url as RoutePath)}
                          className="hover:text-gold transition-colors text-left text-slate-400 hover:text-gold-light text-xs font-light block"
                        >
                          → {link.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.08] pt-4 mt-6">
              <p className="text-[10px] text-slate-500 font-light tracking-wider leading-relaxed">
                {data.copyright || "© 2026 Cox's Bazar Boat Club Limited. All Rights Reserved."}
              </p>
            </div>
          </div>

          {/* CENTER — SEAL LOGO */}
          <div className="footer-logo order-1 lg:order-2 flex flex-col justify-center items-center py-6 lg:py-0 w-full">
            <div className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] lg:w-[380px] lg:h-[380px]">
              <LogoSvg className="h-full w-full block" />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="order-3 lg:order-3 flex flex-col justify-between h-full space-y-8 text-left lg:text-right lg:items-end">
            <div className="space-y-4 w-full">
              <h4 className="font-display text-[10px] tracking-widest text-[#a1a1aa] font-medium uppercase border-b border-white/[0.08] pb-1.5 mb-3 inline-block lg:block lg:text-right">
                Contact Registry
              </h4>
              <ul className="space-y-4 text-xs font-light text-slate-400">
                {data.contact && (
                  <>
                    <li>
                      <span className="text-gold font-semibold tracking-wider block text-xs uppercase mb-0.5">CLUB HOUSE LAND MARK</span>
                      <span className="leading-relaxed whitespace-pre-line">{data.contact.address}</span>
                    </li>
                    <li>
                      <span className="text-gold font-semibold tracking-wider block text-xs uppercase mb-0.5">OFFICIAL EMAIL</span>
                      {data.contact.email.split(",").map((email) => email.trim()).filter(Boolean).map((email) => (
                        <span key={email} className="block">{email}</span>
                      ))}
                    </li>
                    <li>
                      <span className="text-gold font-semibold tracking-wider block text-xs uppercase mb-0.5">SECRETARIAT HOTLINE</span>
                      <span className="block">{data.contact.phone}</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="pt-2 w-full flex lg:justify-end">
              <div className="flex space-x-3">
                {data.socialLinks && (
                  <>
                    {data.socialLinks.facebook && (
                      <a href={data.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/[0.02] border border-white/[0.08] rounded-sm text-gold hover:text-white hover:border-gold-light hover:bg-[#9e7f46]/10 transition-colors" aria-label="Facebook">
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {data.socialLinks.twitter && (
                      <a href={data.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/[0.02] border border-white/[0.08] rounded-sm text-gold hover:text-white hover:border-gold-light hover:bg-[#9e7f46]/10 transition-colors" aria-label="Twitter">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {data.socialLinks.linkedin && (
                      <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/[0.02] border border-white/[0.08] rounded-sm text-gold hover:text-white hover:border-gold-light hover:bg-[#9e7f46]/10 transition-colors" aria-label="LinkedIn">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {data.socialLinks.instagram && (
                      <a href={data.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/[0.02] border border-white/[0.08] rounded-sm text-gold hover:text-white hover:border-gold-light hover:bg-[#9e7f46]/10 transition-colors" aria-label="Instagram">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {data.socialLinks.youtube && (
                      <a href={data.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/[0.02] border border-white/[0.08] rounded-sm text-gold hover:text-white hover:border-gold-light hover:bg-[#9e7f46]/10 transition-colors" aria-label="YouTube">
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-4 mt-6 w-full flex flex-wrap lg:justify-end gap-x-4 gap-y-1 items-center">
              {data.legalLinks && data.legalLinks.map((legal, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLinkClick(legal.url as RoutePath)}
                  className="text-slate-500 hover:text-gold text-[10px] font-light tracking-wider uppercase transition-colors cursor-pointer"
                >
                  {legal.name}
                </button>
              ))}
              <div className="flex items-center space-x-2 text-slate-500 text-[10px] font-light tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Incorporated Company Limited by Guarantee</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
