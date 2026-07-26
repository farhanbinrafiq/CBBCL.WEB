/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { RoutePath, User } from "./types";
import { getLoggedInUser, setLoggedInUser } from "./utils/storage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Facilities from "./components/pages/Facilities";
import Membership from "./components/pages/Membership";
import Governance from "./components/pages/Governance";
import Board from "./components/pages/Board";
import BoardProfile from "./components/pages/BoardProfile";
import NewsFeed from "./components/pages/NewsFeed";
import NewsFeedDetail from "./components/pages/NewsFeedDetail";
import Events from "./components/pages/Events";
import Affiliations from "./components/pages/Affiliations";
import Contact from "./components/pages/Contact";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Dashboard from "./components/pages/Dashboard";
import AdminDashboard from "./components/pages/AdminDashboard";
import Members from "./components/pages/Members";
import MembershipDetail from "./components/pages/MembershipDetail";
import MembershipApplicationForm from "./components/pages/MembershipApplicationForm";
import AffiliationDetail from "./components/pages/AffiliationDetail";
import AffiliationRequestForm from "./components/pages/AffiliationRequestForm";
import EZBookingPortal from "./components/pages/EZBookingPortal";
import { motion, AnimatePresence } from "motion/react";

function normalizePath(rawPath: string): string {
  if (!rawPath) return "/";
  let p = rawPath.trim();
  if (p.includes("?")) {
    p = p.split("?")[0];
  }
  if (p.includes("#")) {
    p = p.split("#")[0];
  }
  if (p.length > 1 && p.endsWith("/")) {
    p = p.slice(0, -1);
  }
  return p;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => {
    if (typeof window !== "undefined" && window.location.pathname) {
      return window.location.pathname as RoutePath;
    }
    return "/";
  });
  const [initialSection, setInitialSection] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // PWA & Service Worker state
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [showUpdateBanner, setShowUpdateBanner] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  // Dynamic document title and SEO metadata update
  useEffect(() => {
    const normalized = normalizePath(currentPath);
    let pageTitle = "Cox's Bazar Boat Club Limited | CBBCL Official";

    if (normalized === "/about" || normalized === "/about.html") {
      pageTitle = "About Us | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/facilities" || normalized === "/facilities.html" || normalized === "/gallery" || normalized === "/gallery.html") {
      pageTitle = "Facilities & Gallery Showcase | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/membership" || normalized === "/membership.html") {
      pageTitle = "Membership Tiers | Cox's Bazar Boat Club Limited";
    } else if (normalized.startsWith("/membership/")) {
      const slug = normalized.replace("/membership/", "").replace(/\.html$/, "");
      const formatted = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      pageTitle = `${formatted} | Cox's Bazar Boat Club Limited`;
    } else if (normalized === "/governance" || normalized === "/governance.html") {
      pageTitle = "Governance & Leadership | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/board" || normalized === "/board.html") {
      pageTitle = "Board of Directors | Cox's Bazar Boat Club Limited";
    } else if (normalized.startsWith("/board/") || normalized.startsWith("/profile/")) {
      pageTitle = "Director Profile | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/news-feed" || normalized === "/news-feed.html" || normalized === "/news" || normalized === "/news.html") {
      pageTitle = "Club News Feed & Gazette | Cox's Bazar Boat Club Limited";
    } else if (normalized.startsWith("/news-feed/") || normalized.startsWith("/news/")) {
      pageTitle = "Official Gazette Release | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/events" || normalized === "/events.html") {
      pageTitle = "Upcoming Events & Regattas | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/affiliations" || normalized === "/affiliations.html") {
      pageTitle = "Reciprocal Affiliations | Cox's Bazar Boat Club Limited";
    } else if (normalized.startsWith("/affiliations/")) {
      pageTitle = "Affiliation Detail | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/contact" || normalized === "/contact.html") {
      pageTitle = "Contact Us | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/login" || normalized === "/login.html") {
      pageTitle = "Member Login | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/register" || normalized === "/register.html") {
      pageTitle = "Member Registration | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/dashboard" || normalized === "/dashboard.html") {
      pageTitle = "Member Portal Dashboard | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/admin-dashboard" || normalized === "/admin-dashboard.html") {
      pageTitle = "Admin Central Ledger | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/members" || normalized === "/members.html" || normalized.startsWith("/members/")) {
      pageTitle = "Member Directory | Cox's Bazar Boat Club Limited";
    } else if (normalized === "/ezbooking-portal" || normalized === "/ezbooking-portal.html") {
      pageTitle = "EZ Booking Portal | Cox's Bazar Boat Club Limited";
    }

    document.title = pageTitle;
  }, [currentPath]);

  // Handle address bar routing from the window location if accessed directly
  useEffect(() => {
    setCurrentUser(getLoggedInUser());

    const handleLocationChange = () => {
      const pathname = window.location.pathname as RoutePath;
      const user = getLoggedInUser();
      const normalized = normalizePath(pathname);

      // Automatically strip legacy .html extension from browser location bar if visited directly
      if (pathname.endsWith(".html") && pathname !== "/index.html") {
        const cleanPath = pathname.replace(/\.html$/, "") as RoutePath;
        window.history.replaceState(null, "", cleanPath + window.location.search + window.location.hash);
      }

      // Protected route guards
      if ((normalized === "/dashboard" || normalized === "/dashboard.html") && !user) {
        navigate("/login");
      } else if ((normalized === "/admin-dashboard" || normalized === "/admin-dashboard.html") && (!user || user.role !== "admin")) {
        navigate("/login");
      } else {
        setCurrentPath(pathname);
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    handleLocationChange();

    // 1. Service Worker Registration & Version Update Listener (PWA)
    const isIframe = typeof window !== "undefined" && window.self !== window.top;
    // @ts-ignore
    const isDev = import.meta.env.DEV;

    if (!isIframe && !isDev && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setSwRegistration(reg);
          console.log("CBBCL: Service Worker active with scope:", reg.scope);

          // Force check if update of service worker is waiting
          if (reg.waiting) {
            setShowUpdateBanner(true);
          }

          // Trigger on subsequent service worker updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New update ready for application activation
                  setShowUpdateBanner(true);
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn("CBBCL: Service worker load skipped:", err);
        });

      // Simple browser hot reload when controller gets brand new active service worker
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // 2. Capture Browser standard PWA Install Promo event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Automatically prompt install modal after 3 seconds on user visit
      setTimeout(() => {
        // If they did not already install it
        if (!window.matchMedia("(display-mode: standalone)").matches) {
          setShowInstallBanner(true);
        }
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      console.log("CBBCL app successfully installed locally!");
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleUpdateApp = () => {
    if (swRegistration && swRegistration.waiting) {
      // Prompt SW skipWaiting standard execution
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`CBBCL Install trigger option: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };


  const navigate = (path: RoutePath) => {
    // Scroll window seamlessly to top
    window.scrollTo({ top: 0, behavior: "instant" });
    
    // Simulate real history push-state changes so links look standard in the url explorer
    window.history.pushState(null, "", path);
    
    setCurrentPath(path);
  };

  const refreshUser = () => {
    setCurrentUser(getLoggedInUser());
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentUser(null);
  };

  const renderPage = () => {
    const normalized = normalizePath(currentPath);

    if (normalized === "/members" || normalized === "/members.html") {
      return <Members navigate={navigate} />;
    }
    if (normalized.startsWith("/members/")) {
      const parts = normalized.split("/");
      const filePart = parts[parts.length - 1];
      const memberId = filePart.replace(/\.html$/, "");
      return <Members navigate={navigate} selectedMemberId={memberId} />;
    }
    if ((normalized.startsWith("/board/") && normalized !== "/board" && normalized !== "/board.html") ||
        (normalized.startsWith("/profile/") && normalized !== "/profile" && normalized !== "/profile.html")) {
      const parts = normalized.split("/");
      const filePart = parts[parts.length - 1];
      const directorId = filePart.replace(/\.html$/, "");
      return <BoardProfile directorId={directorId} navigate={navigate} />;
    }
    if (normalized.startsWith("/membership/") && normalized !== "/membership" && normalized !== "/membership.html") {
      const parts = normalized.split("/");
      const filePart = parts[parts.length - 1];
      const categorySlug = filePart.replace(/\.html$/, "");
      return <MembershipDetail categorySlug={categorySlug} navigate={navigate} />;
    }
    if (normalized.startsWith("/affiliations/") && normalized !== "/affiliations" && normalized !== "/affiliations.html") {
      const parts = normalized.split("/");
      const filePart = parts[parts.length - 1];
      const clubId = filePart.replace(/\.html$/, "");
      return <AffiliationDetail clubId={clubId} navigate={navigate} />;
    }
    if ((normalized.startsWith("/news-feed/") && normalized !== "/news-feed" && normalized !== "/news-feed.html") ||
        (normalized.startsWith("/news/") && normalized !== "/news" && normalized !== "/news.html")) {
      const parts = normalized.split("/");
      const filePart = parts[parts.length - 1];
      const newsId = filePart.replace(/\.html$/, "");
      return <NewsFeedDetail newsId={newsId} navigate={navigate} />;
    }

    switch (normalized) {
      case "/":
      case "/index":
      case "/index.html":
      case "/home":
      case "/home.html":
        return <Home navigate={navigate} />;
      case "/about":
      case "/about.html":
        return <About initialSection={initialSection || "overview"} />;
      case "/facilities":
      case "/facilities.html":
      case "/gallery":
      case "/gallery.html":
        return <Facilities />;
      case "/membership":
      case "/membership.html":
        return <Membership navigate={navigate} />;
      case "/membership-application":
      case "/membership-application.html":
        return <MembershipApplicationForm navigate={navigate} />;
      case "/governance":
      case "/governance.html":
        return <Governance initialSection={initialSection || "articles"} />;
      case "/board":
      case "/board.html":
        return <Board navigate={navigate} />;
      case "/news-feed":
      case "/news-feed.html":
      case "/news":
      case "/news.html":
        return <NewsFeed navigate={navigate} />;
      case "/events":
      case "/events.html":
        return <Events />;
      case "/affiliations":
      case "/affiliations.html":
        return <Affiliations navigate={navigate} />;
      case "/affiliation-request":
      case "/affiliation-request.html":
        return <AffiliationRequestForm navigate={navigate} />;
      case "/ezbooking-portal":
      case "/ezbooking-portal.html":
        return <EZBookingPortal navigate={navigate} />;
      case "/contact":
      case "/contact.html":
        return <Contact />;
      case "/login":
      case "/login.html":
        return <Login navigate={navigate} onLoginSuccess={refreshUser} />;
      case "/register":
      case "/register.html":
        return <Register navigate={navigate} />;
      case "/dashboard":
      case "/dashboard.html":
        return <Dashboard navigate={navigate} onLogout={handleLogout} />;
      case "/admin-dashboard":
      case "/admin-dashboard.html":
        return <AdminDashboard navigate={navigate} onLogout={handleLogout} />;
      case "/admin-dashboard/home-cms":
      case "/admin-dashboard/home-cms.html":
        return <AdminDashboard navigate={navigate} onLogout={handleLogout} initialActiveTab="home_cms" />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-body font-sans">
      {/* Dynamic Header with full auth properties */}
      <Header
        currentPath={currentPath}
        navigate={navigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Core Body displaying dynamic pages */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Footer */}
      <Footer navigate={navigate} />

      {/* Floating PWA Status Dialog Panels */}
      <AnimatePresence>
        {showUpdateBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#111625] border-2 border-gold/40 rounded-xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-white backdrop-blur-md"
            id="pwa-update-banner"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gold/10 rounded-lg text-gold flex-shrink-0">
                <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17L12 3" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm tracking-wide text-gold uppercase">System Update</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">New CBBCL update available.</p>
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <button
                    onClick={() => setShowUpdateBanner(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    id="pwa-update-later"
                  >
                    Later
                  </button>
                  <button
                    onClick={handleUpdateApp}
                    className="px-4 py-1.5 text-xs bg-gold hover:bg-gold-light text-navy font-bold rounded transition-colors shadow-sm"
                    id="pwa-update-now"
                  >
                    Update Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showInstallBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-[#002262] border-2 border-gold/40 rounded-xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-white backdrop-blur-md"
            id="pwa-install-banner"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gold/10 rounded-lg text-gold flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm tracking-wide text-gold uppercase">Install App</h3>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">Add CBBCL to your Home Screen for a faster, full-screen progressive experience with offline support.</p>
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <button
                    onClick={() => setShowInstallBanner(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    id="pwa-install-later"
                  >
                    Later
                  </button>
                  <button
                    onClick={handleInstallApp}
                    className="px-4 py-1.5 text-xs bg-gold hover:bg-gold-light text-navy font-bold rounded transition-colors shadow-sm"
                    id="pwa-install-btn"
                  >
                    Install Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
}

