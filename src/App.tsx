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

    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

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
        return <NewsFeed />;
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
    </div>
  );
}

