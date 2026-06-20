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

export default function App() {
  const [currentPath, setCurrentPath] = useState<RoutePath>("/");
  const [initialSection, setInitialSection] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // PWA & Service Worker state
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [showUpdateBanner, setShowUpdateBanner] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  // Handle address bar routing from the window location if accessed directly
  useEffect(() => {
    setCurrentUser(getLoggedInUser());

    const handleLocationChange = () => {
      const pathname = window.location.pathname as RoutePath;
      const validPaths: RoutePath[] = [
        "/",
        "/index.html",
        "/about.html",
        "/facilities.html",
        "/membership.html",
        "/governance.html",
        "/board.html",
        "/board/humayun-kabir-robel.html",
        "/news-feed.html",
        "/events.html",
        "/affiliations.html",
        "/contact.html",
        "/login.html",
        "/register.html",
        "/dashboard.html",
        "/admin-dashboard.html",
        "/admin-dashboard/home-cms.html",
        "/ezbooking-portal.html",
        "/affiliations/ezbooking.html"
      ];

      const user = getLoggedInUser();

      // Protected route guards
      if (pathname === "/dashboard.html" && !user) {
        navigate("/login.html");
      } else if (pathname === "/admin-dashboard.html" && (!user || user.role !== "admin")) {
        navigate("/login.html");
      } else if (
        validPaths.includes(pathname) ||
        pathname === "/members.html" ||
        pathname.startsWith("/members/") ||
        pathname.startsWith("/news-feed/") ||
        (pathname.startsWith("/board/") && pathname.endsWith(".html")) ||
        (pathname.startsWith("/profile/") && pathname.endsWith(".html"))
      ) {
        setCurrentPath(pathname);
      } else {
        setCurrentPath("/");
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    handleLocationChange();

    // 1. Service Worker Registration & Version Update Listener (PWA)
    if ("serviceWorker" in navigator) {
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
    if (currentPath === "/members.html") {
      return <Members navigate={navigate} />;
    }
    if (currentPath.startsWith("/members/")) {
      const parts = currentPath.split("/");
      const filePart = parts[parts.length - 1];
      const memberId = filePart.endsWith(".html") ? filePart.slice(0, -5) : filePart;
      return <Members navigate={navigate} selectedMemberId={memberId} />;
    }
    if (currentPath.startsWith("/board/") && currentPath !== "/board.html") {
      const parts = currentPath.split("/");
      const filePart = parts[parts.length - 1];
      const directorId = filePart.endsWith(".html") ? filePart.slice(0, -5) : filePart;
      return <BoardProfile directorId={directorId} navigate={navigate} />;
    }
    if (currentPath.startsWith("/profile/") && currentPath !== "/profile.html") {
      const parts = currentPath.split("/");
      const filePart = parts[parts.length - 1];
      const profileId = filePart.endsWith(".html") ? filePart.slice(0, -5) : filePart;
      return <BoardProfile directorId={profileId} navigate={navigate} />;
    }
    if (currentPath.startsWith("/membership/") && currentPath !== "/membership.html") {
      const parts = currentPath.split("/");
      const filePart = parts[parts.length - 1];
      const categorySlug = filePart.endsWith(".html") ? filePart.slice(0, -5) : filePart;
      return <MembershipDetail categorySlug={categorySlug} navigate={navigate} />;
    }
    if (currentPath.startsWith("/affiliations/") && currentPath !== "/affiliations.html") {
      const parts = currentPath.split("/");
      const filePart = parts[parts.length - 1];
      const clubId = filePart.endsWith(".html") ? filePart.slice(0, -5) : filePart;
      return <AffiliationDetail clubId={clubId} navigate={navigate} />;
    }
    if (currentPath.startsWith("/news-feed/") && currentPath !== "/news-feed.html") {
      const parts = currentPath.split("/");
      const filePart = parts[parts.length - 1];
      const newsId = filePart.endsWith(".html") ? filePart.slice(0, -5) : filePart;
      return <NewsFeedDetail newsId={newsId} navigate={navigate} />;
    }

    switch (currentPath) {
      case "/":
      case "/index.html":
        return <Home navigate={navigate} />;
      case "/about.html":
        return <About initialSection={initialSection || "overview"} />;
      case "/facilities.html":
        return <Facilities />;
      case "/membership.html":
        return <Membership navigate={navigate} />;
      case "/membership-application.html":
        return <MembershipApplicationForm navigate={navigate} />;
      case "/governance.html":
        return <Governance initialSection={initialSection || "articles"} />;
      case "/board.html":
        return <Board navigate={navigate} />;
      case "/news-feed.html":
        return <NewsFeed navigate={navigate} />;
      case "/events.html":
        return <Events />;
      case "/affiliations.html":
        return <Affiliations navigate={navigate} />;
      case "/affiliation-request.html":
        return <AffiliationRequestForm navigate={navigate} />;
      case "/ezbooking-portal.html":
        return <EZBookingPortal navigate={navigate} />;
      case "/contact.html":
        return <Contact />;
      case "/login.html":
        return <Login navigate={navigate} onLoginSuccess={refreshUser} />;
      case "/register.html":
        return <Register navigate={navigate} />;
      case "/dashboard.html":
        return <Dashboard navigate={navigate} onLogout={handleLogout} />;
      case "/admin-dashboard.html":
        return <AdminDashboard navigate={navigate} onLogout={handleLogout} />;
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

