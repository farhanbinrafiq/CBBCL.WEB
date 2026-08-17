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
  const [isDesktop, setIsDesktop] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth >= 1280 : true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerRef = useRef<HTMLElement>(null);
  const [headerBottom, setHeaderBottom] = useState(78);

  const isHome = currentPath === "/" || currentPath === "/index" || currentPath === "/index.html";

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

  const currentLogo = navCms.navbarLogo || navCms.logo || cbbclLogo;
  const isDefaultLogo =
    currentLogo === cbbclLogo ||
    !navCms.navbarLogo ||
    navCms.navbarLogo === "" ||
    navCms.navbarLogo.includes("logo.png") ||
    navCms.navbarLogo.includes("Logo");

  const checkIsActive = (itemPath: string) => {
    const cleanPath = itemPath.replace(/\.html$/, "");
    const cleanCurrent = currentPath.replace(/\.html$/, "");

    const profileId = (cleanCurrent.startsWith("/profile/"))
      ? cleanCurrent.replace("/profile/", "")
      : null;
    
    const isOnBoard = profileId
      ? (getBoardMembers().some(d => d.id === profileId) || DIRECTORS_DATA.some(d => d.id === profileId))
      : false;

    return (
      cleanCurrent === cleanPath ||
      ((cleanPath === "/" || cleanPath === "/index") && (cleanCurrent === "/" || cleanCurrent === "/index")) ||
      (cleanPath === "/board" && (cleanCurrent.startsWith("/board/") || (profileId && isOnBoard))) ||
      (cleanPath === "/members" && (cleanCurrent.startsWith("/members/") || (profileId && !isOnBoard)))
    );
  };

  const getOrderedMenuItems = () => {
    const rawItems = navCms.menuItems || [];
    
    const findItem = (label: string) => {
      return rawItems.find(item => 
        item.label.toLowerCase() === label.toLowerCase() || 
        (label === "Home" && (item.path === "/" || item.path === "/index" || item.path === "/index.html"))
      );
    };

    const homeItem = findItem("Home") || { label: "Home", path: "/" as RoutePath };
    const facilitiesItem = findItem("Facilities") || { label: "Facilities", path: "/facilities" as RoutePath };
    const membershipItem = findItem("Membership") || { label: "Membership", path: "/membership" as RoutePath };
    const boardItem = findItem("Board of Directors") || { label: "Board of Directors", path: "/board" as RoutePath };
    const membersItem = findItem("Club Members") || { label: "Club Members", path: "/members" as RoutePath };
    const eventsItem = findItem("Events") || { label: "Events", path: "/events" as RoutePath };
    const newsItem = findItem("News Feed") || { label: "News Feed", path: "/news-feed" as RoutePath };
    const affiliationsItem = findItem("Affiliations") || { label: "Affiliations", path: "/affiliations" as RoutePath };
    const contactItem = findItem("Contact") || { label: "Contact", path: "/contact" as RoutePath };
    const aboutItem = findItem("About") || { label: "About", path: "/about" as RoutePath };
    const plainAbout = { label: aboutItem.label, path: aboutItem.path };

    return {
      left: [
        homeItem,
        facilitiesItem,
        membershipItem,
        boardItem,
        membersItem,
        eventsItem
      ],
      right: [
        newsItem,
        affiliationsItem,
        contactItem,
        plainAbout
      ]
    };
  };

  const orderedNav = getOrderedMenuItems();
  const orderedList = [...orderedNav.left, ...orderedNav.right];

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
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span>📍 Level 9, House 28, Block A, Kolatoli R/A., 4700 Cox's Bazar, Bangladesh</span>
            <span>📞 +880 13328 86688</span>
          </div>
          <div className="flex items-center space-x-6">
            <span>✉️ registration@cbbcl.org, info@cbbcl.org</span>
            <span>🌐 www.cbbcl.org</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        ref={headerRef}
        id="cbbcl-header"
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isHome ? "is-home-header" : ""
        } ${
          isScrolled
            ? "py-3"
            : "py-4"
        }`}
      >
        <div className="container navbar relative flex xl:flex-nowrap items-center justify-between w-full"> {/* LAYOUT FIX */}
          {/* Desktop Left Group: maps to Column 1 of our custom CSS grid layout */}
          {isDesktop ? (
            <nav className="nav-left">
              {orderedNav.left.map((item, idx) => {
                const isActive = checkIsActive(item.path);

                return (
                  <div key={item.label} className="flex items-center">
                    <div
                      className="relative group py-2"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className={`flex items-center space-x-1 px-1 xl:px-1 2xl:px-2 py-1 font-sans text-[10px] xl:text-[10px] 2xl:text-[11px] font-semibold uppercase tracking-wide xl:tracking-wider 2xl:tracking-widest whitespace-nowrap border-b border-transparent transition-all ${ /* LAYOUT FIX */
                          isActive
                            ? "text-gold !border-gold"
                            : "text-white hover:text-gold hover:border-gold"
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.dropdown && <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 text-gold" />}
                      </button>

                      {/* Dropdown element */}
                      {item.dropdown && activeDropdown === item.label && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-[#1a2744] border border-white/[0.08] shadow-xl rounded-sm py-2 z-50 animate-fadeIn">
                          {item.dropdown.map((subItem, index) => (
                            <button
                              key={index}
                              onClick={() => handleNavClick(subItem.path || item.path, subItem.sub)}
                              className="w-full text-left px-5 py-2 hover:bg-white/[0.03] text-white hover:text-gold font-sans text-xs font-medium transition-colors border-b border-white/[0.05] last:border-0"
                            >
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </nav>
          ) : (
            /* Mirroring spacer container to occupy Column 1 on mobile/tablet elements for absolute symmetry */
            <div className="nav-left pointer-events-none" />
          )}

          {/* Centered Website Logo */}
          <div
            id="cbbcl-logo"
            onClick={() => handleNavClick("/" as RoutePath)}
            className="navbar-logo flex items-center justify-center cursor-pointer group shrink-0 z-10"
          >
            <div className="relative h-[56px] sm:h-[68px] lg:h-[82px] aspect-[3000/2500] flex items-center shrink-0"> {/* LAYOUT FIX */}
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

          {/* Right Side Block: maps to Column 3 of our custom CSS grid layout */}
          <div className="nav-right relative lg:static">
            {isDesktop ? (
              <div className="flex items-center gap-0">
                {/* Desktop Right Navigation Links */}
                <nav className="flex items-center">
                  {orderedNav.right.map((item, idx) => {
                    const isActive = checkIsActive(item.path);

                    return (
                      <div key={item.label} className="flex items-center">
                        <div
                          className="relative group py-2"
                          onMouseEnter={() => setActiveDropdown(item.label)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <button
                            onClick={() => handleNavClick(item.path)}
                            className={`flex items-center space-x-1 px-1 xl:px-1 2xl:px-2 py-1 font-sans text-[10px] xl:text-[10px] 2xl:text-[11px] font-semibold uppercase tracking-wide xl:tracking-wider 2xl:tracking-widest whitespace-nowrap border-b border-transparent transition-all ${ /* LAYOUT FIX */
                              isActive
                                ? "text-gold !border-gold"
                                : "text-white hover:text-gold hover:border-gold"
                            }`}
                          >
                            <span>{item.label}</span>
                            {item.dropdown && <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 text-gold" />}
                          </button>

                          {/* Dropdown element */}
                          {item.dropdown && activeDropdown === item.label && (
                            <div className="absolute top-full left-0 mt-1 w-64 bg-[#1a2744] border border-white/[0.08] shadow-xl rounded-sm py-2 z-50 animate-fadeIn">
                              {item.dropdown.map((subItem, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleNavClick(subItem.path || item.path, subItem.sub)}
                                  className="w-full text-left px-5 py-2 hover:bg-white/[0.03] text-white hover:text-gold font-sans text-xs font-medium transition-colors border-b border-white/[0.05] last:border-0"
                                >
                                  {subItem.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </nav>

                {/* CTA Member Button for Desktop */}
                <div className="flex items-center whitespace-nowrap shrink-0 lg:pr-0 pl-3">
                  {currentUser ? (
                    <div className="flex items-center whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleNavClick(currentUser.role === "admin" ? "/admin-dashboard" : "/dashboard")}
                        className="text-gold hover:text-gold-light border-b border-transparent hover:border-gold py-1 px-1 xl:px-1 2xl:px-2 transition-colors text-[10px] xl:text-[10px] 2xl:text-[11px] font-sans font-bold uppercase tracking-widest flex items-center space-x-1 text-center whitespace-nowrap shrink-0" /* LAYOUT FIX */
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span className="whitespace-nowrap">{currentUser.role === "admin" ? "Admin Terminal" : "My Console"}</span>
                      </button>
                      <button
                        onClick={() => {
                          if (onLogout) onLogout();
                          handleNavClick("/login");
                        }}
                        className="text-slate-200 hover:text-rose-455 px-1 xl:px-1 2xl:px-2 py-1 font-sans text-[10px] xl:text-[10px] 2xl:text-[11px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap" /* LAYOUT FIX */
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleNavClick("/login" as RoutePath)}
                        className="text-white hover:text-gold px-1 xl:px-1 2xl:px-2 py-1 font-sans text-[10px] xl:text-[10px] 2xl:text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 whitespace-nowrap transition-colors" /* LAYOUT FIX */
                      >
                        <LogIn className="w-3.5 h-3.5 mt-0.5 text-gold shrink-0" />
                        <span className="whitespace-nowrap">Sign In</span>
                      </button>
                      <button
                        onClick={() => handleNavClick("/membership" as RoutePath)}
                        className="text-gold hover:text-gold-light border-b border-transparent hover:border-gold-light px-1 xl:px-1 2xl:px-2 py-1 font-sans text-[10px] xl:text-[10px] 2xl:text-[11px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap" /* LAYOUT FIX */
                      >
                        Become a Member
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Mobile/Tablet: Render ONLY the Hamburger button trigger - no desktop elements are mounted in the DOM */
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-200 hover:text-gold p-1"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {!isDesktop && isOpen && (
          <div
            style={{
              top: `${headerBottom}px`,
              height: `calc(100vh - ${headerBottom}px)`
            }}
            className="fixed left-0 right-0 z-40 bg-[#1a2744] border-t border-white/[0.08] flex flex-col overflow-y-auto px-6 py-6 space-y-4 shadow-inner pb-12"
          >
            {orderedList.map((item) => {
              const isActive = checkIsActive(item.path);

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
                    <div className="pl-4 border-l-2 border-gold/30 flex flex-col space-y-2 py-2 bg-transparent rounded-r-md">
                      {item.dropdown.map((subItem, index) => (
                        <button
                          key={index}
                          onClick={() => handleNavClick(subItem.path || item.path, subItem.sub)}
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
                  onClick={() => handleNavClick(currentUser.role === "admin" ? "/admin-dashboard" : "/dashboard")}
                  className="bg-transparent text-gold text-xs font-bold uppercase tracking-wider py-2.5 rounded-sm text-center transition-colors border border-gold hover:bg-gold hover:text-navy"
                >
                  {currentUser.role === "admin" ? "Admin Terminal" : "My Console"}
                </button>
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    handleNavClick("/login");
                  }}
                  className="bg-red-500/10 text-red-100 hover:bg-red-500/20 text-xs font-bold uppercase tracking-wider py-2.5 rounded-sm text-center transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/[0.08]">
                <button
                  onClick={() => handleNavClick("/login" as RoutePath)}
                  className="bg-white/[0.03] border border-white/[0.1] text-slate-100 text-xs font-semibold uppercase tracking-wider py-2.5 rounded-xs text-center transition-all hover:bg-white/[0.06]"
                >
                  Sign In to Registry
                </button>
                <button
                  onClick={() => handleNavClick("/membership" as RoutePath)}
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
