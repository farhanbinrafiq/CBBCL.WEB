import { useState, useEffect, useRef } from "react";
import { RoutePath, User } from "../types";
import { Menu, X, ChevronDown, Compass, Award, LifeBuoy, FileText, Anchor, LogIn, UserCheck } from "lucide-react";
import { getNavCMS } from "../utils/cmsStorage";
import { getBoardMembers } from "../utils/storage";
import { DIRECTORS_DATA } from "../data";
import LogoSvg from "./LogoSvg";
// @ts-ignore
import cbbclLogo from "../assets/logo.png";

interface HeaderProps {
  currentPath: string;
  navigate: (path: RoutePath) => void;
  currentUser?: User | null;
  onLogout?: () => void;
}

export default function Header({ currentPath, navigate, currentUser, onLogout }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navCms, setNavCms] = useState(() => getNavCMS());

  const headerRef = useRef<HTMLElement>(null);
  const [headerBottom, setHeaderBottom] = useState(78);

  const isHome = currentPath === "/" || currentPath === "/index.html";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    setNavCms(getNavCMS());
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPath]);

  useEffect(() => {
    if (!isOpen) return;

    const measureHeader = () => {
      if (headerRef.current) {
        setHeaderBottom(headerRef.current.getBoundingClientRect().bottom);
      }
    };
    
    measureHeader();
    
    window.addEventListener("scroll", measureHeader, { passive: true });
    window.addEventListener("resize", measureHeader);

    let resizeObserver: ResizeObserver | null = null;
    if (headerRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        measureHeader();
      });
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", measureHeader);
      window.removeEventListener("resize", measureHeader);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isOpen, isScrolled]);

  const menuItems = navCms.menuItems;
  const currentLogo = navCms.navbarLogo || navCms.logo || cbbclLogo;
  const isDefaultLogo =
    currentLogo === cbbclLogo ||
    !navCms.navbarLogo ||
    navCms.navbarLogo === "" ||
    navCms.navbarLogo.includes("logo.png") ||
    navCms.navbarLogo.includes("Logo");

  const handleNavClick = (path: RoutePath, sub?: string) => {
    navigate(path);
    setIsOpen(false);
    setActiveDropdown(null);
    if (sub) {
      setTimeout(() => {
        const element = document.getElementById(sub);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  };

  return (
    <>
      {/* Top Bar according to PRD */}
      <div id="cbbcl-topbar" className="bg-navy py-2 px-6 text-slate-300 font-sans tracking-wide text-[11px] border-b border-navy-light hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span>📍 Coastal Point Bypass, Cox's Bazar, Bangladesh</span>
            <span>📞 +880 1711-223344</span>
          </div>
          <div className="flex items-center space-x-6">
            <span>✉️ registry@cbbcl.org</span>
            <span>🕒 Open Daily: 09:00 AM – 10:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        ref={headerRef}
        id="cbbcl-header"
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
          isHome ? "is-home-header" : ""
        } ${
          isScrolled
            ? "shadow-md py-3 border-white/[0.08]"
            : "py-4 border-white/[0.05]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1.5 whitespace-nowrap shrink-0">
            {menuItems.map((item) => {
              const profileId = (currentPath.startsWith("/profile/") && currentPath.endsWith(".html"))
                ? currentPath.slice(9, -5)
                : null;
              
              const isOnBoard = profileId
                ? (getBoardMembers().some(d => d.id === profileId) || DIRECTORS_DATA.some(d => d.id === profileId))
                : false;

              const isActive =
                currentPath === item.path ||
                (item.path === "/" && currentPath === "/index.html") ||
                (item.path === "/board.html" && (currentPath.startsWith("/board/") || (profileId && isOnBoard))) ||
                (item.path === "/members.html" && (currentPath.startsWith("/members/") || (profileId && !isOnBoard)));

              return (
                <div
                  key={item.label}
                  className="relative group py-2"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center space-x-1 px-1.5 xl:px-3 py-1 font-sans text-[10px] xl:text-[11px] font-semibold uppercase tracking-wider xl:tracking-widest whitespace-nowrap transition-colors ${
                      isActive
                        ? "text-gold border-b border-gold"
                        : "text-slate-300 hover:text-gold"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.dropdown && <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 text-gold" />}
                  </button>

                  {/* Dropdown element */}
                  {item.dropdown && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-[#111625] border border-white/[0.08] shadow-xl rounded-sm py-2 z-50 animate-fadeIn">
                      {item.dropdown.map((subItem, index) => (
                        <button
                          key={index}
                          onClick={() => handleNavClick(item.path, subItem.sub)}
                          className="w-full text-left px-5 py-2 hover:bg-white/[0.03] text-slate-300 hover:text-gold font-sans text-xs font-medium transition-colors border-b border-white/[0.05] last:border-0"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* CTA Member Button & Mobile Toggle */}
          <div
            className="flex items-center space-x-4 shrink-0"
            style={{
              width: "auto",
              minWidth: "max-content",
              paddingRight: "40px",
              paddingLeft: "0px",
              paddingBottom: "0px"
            }}
          >
            {currentUser ? (
              <div className="hidden md:flex items-center space-x-3 whitespace-nowrap">
                <button
                  onClick={() => handleNavClick(currentUser.role === "admin" ? "/admin-dashboard.html" : "/dashboard.html")}
                  className="bg-[#111625] text-gold text-[10px] font-sans font-bold uppercase tracking-widest px-4 py-2 border border-gold hover:bg-gold hover:text-navy transition-all duration-300 rounded-xs flex items-center space-x-1 text-center whitespace-nowrap shrink-0"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{currentUser.role === "admin" ? "Admin Terminal" : "My Console"}</span>
                </button>
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    handleNavClick("/login.html");
                  }}
                  className="text-slate-400 hover:text-rose-450 font-sans text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3 whitespace-nowrap">
                <button
                  onClick={() => handleNavClick("/login.html" as RoutePath)}
                  className="text-slate-200 hover:text-gold font-sans text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5 mt-0.5 text-gold shrink-0" />
                  <span className="whitespace-nowrap">Sign In</span>
                </button>
                <button
                  onClick={() => handleNavClick("/membership.html" as RoutePath)}
                  className="bg-gold text-navy text-[10px] font-sans font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm hover:bg-gold-light transition-all duration-300 shadow-sm whitespace-nowrap"
                >
                  Become a Member
                </button>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-slate-200 hover:text-gold p-1"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo Section on the Right */}
          <div
            id="cbbcl-logo"
            onClick={() => handleNavClick("/" as RoutePath)}
            className="navbar-logo flex items-center cursor-pointer group shrink-0 ml-2 sm:ml-4 lg:ml-6"
          >
            <div className="relative h-[38px] sm:h-[46px] lg:h-[52px] aspect-[3000/2500] flex items-center shrink-0">
              {isDefaultLogo ? (
                <LogoSvg className="h-full w-full block" />
              ) : (
                <img
                  src={currentLogo}
                  alt="Cox's Bazar Boat Club Limited"
                  className="object-contain h-full w-full block"
                  referrerPolicy="no-referrer"
                  style={{ imageRendering: "auto" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.parentElement?.querySelector(".cbbcl-logo-fallback");
                    if (fallback) fallback.classList.remove("hidden");
                  }}
                />
              )}
              <div className="cbbcl-logo-fallback hidden flex items-center space-x-2">
                <div className="bg-navy text-gold p-1.5 rounded-full border border-gold">
                  <Anchor className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex flex-col flex-shrink-0">
                  <span className="font-display text-[15px] font-bold text-slate-100 tracking-tight uppercase leading-tight">
                    C.B.B.C.L.
                  </span>
                  <span className="text-[8px] font-sans text-gold font-semibold uppercase tracking-widest leading-none">
                    Cox's Bazar Boat Club
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div
            style={{
              top: `${headerBottom}px`,
              height: `calc(100vh - ${headerBottom}px)`
            }}
            className="lg:hidden fixed left-0 right-0 z-40 bg-[#111625] border-t border-white/[0.08] flex flex-col overflow-y-auto px-6 py-6 space-y-4 shadow-inner pb-12"
          >
            {menuItems.map((item) => {
              const isActive =
                currentPath === item.path ||
                (item.path === "/" && currentPath === "/index.html");

              return (
                <div key={item.label} className="flex flex-col space-y-1">
                  <div className="flex justify-between items-center border-b border-white/[0.08] pb-2">
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`text-left text-sm font-sans font-medium uppercase tracking-wider ${
                        isActive ? "text-gold" : "text-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                    {item.dropdown && (
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.label ? null : item.label)
                        }
                        className="p-1 text-gold"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transform transition-transform ${
                            activeDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {item.dropdown && activeDropdown === item.label && (
                    <div className="pl-4 border-l-2 border-gold/30 flex flex-col space-y-2 py-2 bg-white/[0.02] rounded-r-md">
                      {item.dropdown.map((subItem, index) => (
                        <button
                          key={index}
                          onClick={() => handleNavClick(item.path, subItem.sub)}
                          className="text-left text-xs font-sans text-slate-300 hover:text-gold py-1"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {currentUser ? (
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/[0.08]">
                <button
                  onClick={() => handleNavClick(currentUser.role === "admin" ? "/admin-dashboard.html" : "/dashboard.html")}
                  className="bg-transparent text-gold text-xs font-bold uppercase tracking-wider py-2.5 rounded-sm text-center transition-colors border border-gold hover:bg-gold hover:text-navy"
                >
                  {currentUser.role === "admin" ? "Admin Terminal" : "My Console"}
                </button>
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    handleNavClick("/login.html");
                  }}
                  className="bg-red-500/10 text-red-450 hover:bg-red-500/20 text-xs font-bold uppercase tracking-wider py-2.5 rounded-sm text-center transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/[0.08]">
                <button
                  onClick={() => handleNavClick("/login.html" as RoutePath)}
                  className="bg-white/[0.03] border border-white/[0.1] text-slate-100 text-xs font-semibold uppercase tracking-wider py-2.5 rounded-xs text-center transition-all hover:bg-white/[0.06]"
                >
                  Sign In to Registry
                </button>
                <button
                  onClick={() => handleNavClick("/membership.html" as RoutePath)}
                  className="bg-gold text-navy text-xs font-semibold uppercase tracking-wider py-2.5 rounded-sm text-center shadow hover:bg-gold-light transition-all"
                >
                  Become a Member
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
