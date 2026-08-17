import { Facility, EventItem, Affiliation, RoutePath, FooterSettings } from "../types";
import { FACILITIES_DATA, EVENTS_DATA, PAST_EVENTS_DATA, AFFILIATIONS_DATA } from "../data";
// @ts-ignore
import cruiseHero from "../assets/images/cruise_hero_1780825257603.png";

// Interfaces
export interface MediaItem {
  id: string;
  url: string; // Base64
  name: string;
  category: "Board Photos" | "News Images" | "Events" | "Gallery" | "Logos" | "Unspecified";
  uploadedAt: string;
}

export interface PageCMSContent {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroCover: string;
    welcomeTitle: string;
    welcomeText: string;
    metricMembers: string;
    metricTonnage: string;
    metricEvents: string;
    metricVessels: string;
    isAboutSummaryActive: boolean;
    aboutSummaryTitle: string;
    aboutSummaryText: string;
  };
  about: {
    title: string;
    subtitle: string;
    storyTitle: string;
    storyParagraphs: string[];
    visionText: string;
    missionText: string;
    introductionText?: string;
    storyText?: string;
    visionVision?: string;
    visionMission?: string;
    coverImage?: string;
  };
  membership: {
    title: string;
    subtitle: string;
    preamble: string;
    scrutinyText: string;
    categories?: { title: string; desc: string; voters: string; fee: string }[];
    eligibilitySteps?: { title: string; text: string }[];
  };
  contact: {
    title: string;
    address: string;
    phone: string;
    email: string;
    temporaryOffice: string;
  };
}

// Keys
const MEDIA_KEY = "cbbcl_cms_media";
const PAGES_KEY = "cbbcl_cms_pages";
const FACILITIES_KEY = "cbbcl_cms_facilities";
const EVENTS_KEY = "cbbcl_cms_events";
const AFFILIATIONS_KEY = "cbbcl_cms_affiliations";

// Defaults Info
const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: "m-1",
    name: "Golden Sunset Bay",
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400",
    category: "Gallery",
    uploadedAt: "2026-06-07T08:00:00Z"
  },
  {
    id: "m-2",
    name: "Prestige Lounge Main",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
    category: "Gallery",
    uploadedAt: "2026-06-07T08:05:00Z"
  }
];

const DEFAULT_PAGE_CONTENT: PageCMSContent = {
  home: {
    heroTitle: "COX'S BAZAR BOAT CLUB LTD.",
    heroSubtitle: "A Prestigious Socio-Cultural & Nautical Sanctuary Duly Chartered Under The Companies Act, 1994",
    heroCover: cruiseHero,
    welcomeTitle: "Anchor of Camrades & Coastal Stewardship",
    welcomeText: "Proudly registered under the Joint Stock Companies & Firms (RJSC) of Bangladesh, Cox’s Bazar Boat Club Limited (CBBCL) stands as an elite private socio-recreational institution. Designed for shipping pioneers, corporate chiefs, and environment advocates, we offer a safe, luxurious marina haven that celebrates South Asia's maritime legacy on the longest sandy beach in the world.",
    metricMembers: "35+",
    metricTonnage: "50-Berth",
    metricEvents: "12+",
    metricVessels: "15+",
    isAboutSummaryActive: true,
    aboutSummaryTitle: "The Charter Legacy",
    aboutSummaryText: "Incorporated strictly as a private non-profit Company Limited by Guarantee, CBBCL is constructed to protect the pristine shorelines of Cox's Bazar while nurturing close ties of nautical camrade among families. We foster high athletic safety and provide elite reciprocal hospitality with prime clubs worldwide."
  },
  about: {
    title: "Our Heritage & Maritime Vision",
    subtitle: "Built as an elegant private institution, Cox's Bazar Boat Club Limited embodies the premium standard of leisure, community, and oceanic preservation.",
    storyTitle: "Our Foundation Story",
    storyParagraphs: [
      "Incorporated in January 2026 as a private non-profit Company Limited by Guarantee under The Companies Act, 1994, Cox’s Bazar Boat Club Limited (CBBCL) is the long-awaited fulfillment of premium oceanfront social spaces in Bangladesh.",
      "The club was pioneered by Founding President Humayun Kabir Robel alongside an eminent board of shipping leaders, legal advocates, and retired military command staff. They shared a vision: to construct an elite marine complex comparable to South Asia's historic clubs that supports yachting, water sports, and environmental preservation in the world's longest sand beach zone.",
      "CBBCL acts as a social, professional, and philanthropic nexus, maintaining a warm harbor for members, elite dining suites, modern snooker rooms, and dedicated standing councils to defend our coastal dunes against pollution."
    ],
    visionText: "To stand as Bangladesh's premier private nautical institution, recognized globally for its elite membership, luxurious sea recreation, and deep-seated coastal protection legacy.",
    missionText: "To build a world-class clubhouse complex and private marina, uphold strict safety codes, curate dynamic athletic and cultural calendars, and foster a tight-knit community of maritime pioneers and leaders."
  },
  membership: {
    title: "Exclusive Executive Membership",
    subtitle: "Admissions to CBBCL undergo highly protective, multi-tier vetting by our Scrutiny Committee to ensure standard alignment.",
    preamble: "Admissions of new club entities are conducted by Invitation Only or through certified sponsors' proposals. Under the club Articles, our committee scrutinizes each candidate's professional status, community contributions, and alignment with the club's code of behavior.",
    scrutinyText: "Once proposed, names are posted on the Secretariat Notice Board for official review. Following strict vetting rounds, successfully elected member logs are registered under Life Member, Permanent Member, or Donor Member tiers."
  },
  contact: {
    title: "Maritime Registry Headquarters",
    address: "Waterfront Boulevard, Sector 1, Marina District, Cox's Bazar, Bangladesh",
    phone: "+880 1812 345678, +880 1711 987654",
    email: "registry@cbbcl.org, admin@cbbcl.org",
    temporaryOffice: "VIP Executive Suite, Hotel Sea Albatross, Kolatoli Point, Cox's Bazar"
  }
};

// MEDIA LIBRARY GET / SET
export function getMediaLibrary(): MediaItem[] {
  try {
    const data = localStorage.getItem(MEDIA_KEY);
    if (!data) {
      localStorage.setItem(MEDIA_KEY, JSON.stringify(DEFAULT_MEDIA));
      return DEFAULT_MEDIA;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    localStorage.setItem(MEDIA_KEY, JSON.stringify(DEFAULT_MEDIA));
    return DEFAULT_MEDIA;
  } catch (e) {
    return DEFAULT_MEDIA;
  }
}

export function saveMediaLibrary(items: MediaItem[]): void {
  try {
    localStorage.setItem(MEDIA_KEY, JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
}

// PAGE CONTENT GET / SET
export function getPageContent(): PageCMSContent {
  try {
    const data = localStorage.getItem(PAGES_KEY);
    if (!data) {
      localStorage.setItem(PAGES_KEY, JSON.stringify(DEFAULT_PAGE_CONTENT));
      return DEFAULT_PAGE_CONTENT;
    }
    const page = JSON.parse(data);
    if (page && typeof page === "object") {
      // Deep merge to ensure newly added keys are present
      const home = { ...DEFAULT_PAGE_CONTENT.home, ...(page.home || {}) };
      if (home.heroTitle === "COX'S BAZAR BOAT CLUB") {
        home.heroTitle = "COX'S BAZAR BOAT CLUB LTD.";
      }
      return {
        home,
        about: { ...DEFAULT_PAGE_CONTENT.about, ...(page.about || {}) },
        membership: { ...DEFAULT_PAGE_CONTENT.membership, ...(page.membership || {}) },
        contact: { ...DEFAULT_PAGE_CONTENT.contact, ...(page.contact || {}) }
      };
    }
    localStorage.setItem(PAGES_KEY, JSON.stringify(DEFAULT_PAGE_CONTENT));
    return DEFAULT_PAGE_CONTENT;
  } catch (e) {
    return DEFAULT_PAGE_CONTENT;
  }
}

export function savePageContent(content: PageCMSContent): void {
  try {
    localStorage.setItem(PAGES_KEY, JSON.stringify(content));
  } catch (e) {
    console.error(e);
  }
}

// FACILITIES GET / SET
export function getCMSFacilities(): Facility[] {
  try {
    const data = localStorage.getItem(FACILITIES_KEY);
    if (!data) {
      localStorage.setItem(FACILITIES_KEY, JSON.stringify(FACILITIES_DATA));
      return FACILITIES_DATA;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    localStorage.setItem(FACILITIES_KEY, JSON.stringify(FACILITIES_DATA));
    return FACILITIES_DATA;
  } catch (e) {
    return FACILITIES_DATA;
  }
}

export function saveCMSFacilities(facilities: Facility[]): void {
  try {
    localStorage.setItem(FACILITIES_KEY, JSON.stringify(facilities));
  } catch (e) {
    console.error(e);
  }
}

// EVENTS GET / SET
export function getCMSEvents(): EventItem[] {
  try {
    const data = localStorage.getItem(EVENTS_KEY);
    const combined = [...EVENTS_DATA, ...PAST_EVENTS_DATA];
    if (!data) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(combined));
      return combined;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(combined));
    return combined;
  } catch (e) {
    return [...EVENTS_DATA, ...PAST_EVENTS_DATA];
  }
}

export function saveCMSEvents(events: EventItem[]): void {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    console.error(e);
  }
}

// AFFILIATIONS GET / SET
export function getCMSAffiliations(): Affiliation[] {
  try {
    const data = localStorage.getItem(AFFILIATIONS_KEY);
    if (!data) {
      localStorage.setItem(AFFILIATIONS_KEY, JSON.stringify(AFFILIATIONS_DATA));
      return AFFILIATIONS_DATA;
    }
    const list: Affiliation[] = JSON.parse(data);
    if (Array.isArray(list)) {
      if (!list.some(aff => aff && (aff.id === "ezbooking" || aff.name?.toLowerCase() === "ezbooking"))) {
        const ez = AFFILIATIONS_DATA.find(aff => aff.id === "ezbooking");
        if (ez) {
          list.push(ez);
          localStorage.setItem(AFFILIATIONS_KEY, JSON.stringify(list));
        }
      }
      return list;
    }
    localStorage.setItem(AFFILIATIONS_KEY, JSON.stringify(AFFILIATIONS_DATA));
    return AFFILIATIONS_DATA;
  } catch (e) {
    return AFFILIATIONS_DATA;
  }
}

export function saveCMSAffiliations(affiliations: Affiliation[]): void {
  try {
    localStorage.setItem(AFFILIATIONS_KEY, JSON.stringify(affiliations));
  } catch (e) {
    console.error(e);
  }
}

const NAVIGATION_KEY = "cbbcl_cms_navigation";
const FOOTER_KEY = "cbbcl_cms_footer";

export interface NavMenuItem {
  label: string;
  path: RoutePath;
  dropdown?: { label: string; sub: string }[];
}

export interface NavCMSData {
  logo: string;
  navbarLogo: string;
  footerLogo: string;
  menuItems: NavMenuItem[];
}

export interface FooterCMSData {
  logo: string;
  tagline: string;
  description: string;
  quickLinks: { label: string; path: RoutePath }[];
  membershipLinks: string[];
  address: string;
  email: string;
  phone: string;
  copyright: string;
  socials: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

const DEFAULT_NAV: NavCMSData = {
  logo: "",
  navbarLogo: "",
  footerLogo: "",
  menuItems: [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Facilities", path: "/facilities" },
    { label: "Membership", path: "/membership" },
    {
      label: "Governance",
      path: "/governance",
      dropdown: [
        { label: "Articles of Association", sub: "articles" },
        { label: "Club Constitution", sub: "constitution" },
        { label: "Club Rules", sub: "rules" },
        { label: "Standing Committees", sub: "committees" }
      ]
    },
    { label: "Board of Directors", path: "/board" },
    { label: "Club Members", path: "/members" },
    { label: "Events", path: "/events" },
    { label: "News Feed", path: "/news-feed" },
    { label: "Affiliations", path: "/affiliations" },
    { label: "Contact", path: "/contact" }
  ]
};

const DEFAULT_FOOTER: FooterCMSData = {
  logo: "",
  tagline: "Bangladesh’s premier coastal sanctuary and private social club, incorporated as a Non-Profit Company under The Companies Act, 1994. Elevating nautical culture and oceanfront companionship.",
  description: "Bangladesh’s premier coastal sanctuary and private social club, incorporated as a Non-Profit Company under The Companies Act, 1994.",
  quickLinks: [
    { label: "Home Base", path: "/" },
    { label: "About Our Story", path: "/about" },
    { label: "Club Facilities Showcase", path: "/facilities" },
    { label: "Board of Directors", path: "/board" },
    { label: "Club News Feed", path: "/news-feed" },
    { label: "Affiliations", path: "/affiliations" }
  ],
  membershipLinks: [
    "🏆 Donor Membership",
    "🏵️ Life Membership",
    "🛡️ Permanent Membership",
    "⚓ Associate Membership",
    "🌍 Diplomat & Foreign Cadet",
    "🏢 Corporate Patronage",
    "🤝 Honorary Board Membership"
  ],
  address: "Coastal Point Bypass, Marine Drive Boulevard, Cox's Bazar, Bangladesh.",
  email: "registry@cbbcl.org / admin@cbbcl.org",
  phone: "+880 1711-223344 (Registry Desk)",
  copyright: "© 2026 Cox's Bazar Boat Club Limited. All Rights Reserved. Incorporated under The Companies Act, 1994, Bangladesh.",
  socials: {
    facebook: "https://www.facebook.com/CoxsBazarBoatClubLtd",
    twitter: "https://twitter.com",
    linkedin: "https://www.linkedin.com/company/cbbcl/",
    instagram: "https://instagram.com"
  }
};

export function getNavCMS(): NavCMSData {
  try {
    const data = localStorage.getItem(NAVIGATION_KEY);
    if (!data) {
      localStorage.setItem(NAVIGATION_KEY, JSON.stringify(DEFAULT_NAV));
      return DEFAULT_NAV;
    }
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === "object") {
      let menuItems = Array.isArray(parsed.menuItems) ? parsed.menuItems : DEFAULT_NAV.menuItems;

      // Migration: the Membership and About nav items' dropdowns were retired in favor of plain links.
      // Strip them from any previously-persisted navigation data so existing browsers pick up the change.
      if (menuItems.some((item: any) => (item.label === "Membership" || item.label === "About") && item.dropdown)) {
        menuItems = menuItems.map((item: any) =>
          item.label === "Membership" || item.label === "About" ? { label: item.label, path: item.path } : item
        );
        localStorage.setItem(NAVIGATION_KEY, JSON.stringify({ ...parsed, menuItems }));
      }

      return {
        ...DEFAULT_NAV,
        ...parsed,
        menuItems
      };
    }
    localStorage.setItem(NAVIGATION_KEY, JSON.stringify(DEFAULT_NAV));
    return DEFAULT_NAV;
  } catch (e) {
    return DEFAULT_NAV;
  }
}

export function saveNavCMS(nav: NavCMSData): void {
  try {
    localStorage.setItem(NAVIGATION_KEY, JSON.stringify(nav));
  } catch (e) {
    console.error(e);
  }
}

export function getFooterCMS(): FooterCMSData {
  try {
    const data = localStorage.getItem(FOOTER_KEY);
    if (!data) {
      localStorage.setItem(FOOTER_KEY, JSON.stringify(DEFAULT_FOOTER));
      return DEFAULT_FOOTER;
    }
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === "object") {
      return {
        ...DEFAULT_FOOTER,
        ...parsed,
        quickLinks: Array.isArray(parsed.quickLinks) ? parsed.quickLinks : DEFAULT_FOOTER.quickLinks,
        membershipLinks: Array.isArray(parsed.membershipLinks) ? parsed.membershipLinks : DEFAULT_FOOTER.membershipLinks,
        socials: {
          ...DEFAULT_FOOTER.socials,
          ...((parsed.socials && typeof parsed.socials === "object") ? parsed.socials : {})
        }
      };
    }
    localStorage.setItem(FOOTER_KEY, JSON.stringify(DEFAULT_FOOTER));
    return DEFAULT_FOOTER;
  } catch (e) {
    return DEFAULT_FOOTER;
  }
}

export function saveFooterCMS(footer: FooterCMSData): void {
  try {
    localStorage.setItem(FOOTER_KEY, JSON.stringify(footer));
  } catch (e) {
    console.error(e);
  }
}

const FOOTER_DB_SETTINGS_KEY = "cbbcl_dynamic_footer_db_settings";

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  key: "footer",
  logo: {
    type: "image",
    url: "",
    alt: "Site Logo"
  },
  socialLinks: {
    facebook: "https://www.facebook.com/CoxsBazarBoatClubLtd",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    linkedin: "https://www.linkedin.com/company/cbbcl/",
    twitter: "https://twitter.com"
  },
  contact: {
    email: "info@cbbcl.org, registration@cbbcl.org",
    phone: "+880 13328 86688",
    address: "Level 9, House 28, Block A, Kolatoli R/A.\n4700, Cox's Bazar, Bangladesh\nwww.cbbcl.org"
  },
  footerLinks: [
    {
      title: "Explore the Club",
      links: [
        { name: "Home Base", url: "/" },
        { name: "About Our Story", url: "/about" },
        { name: "Facilities Showcase", url: "/facilities" },
        { name: "Board of Directors", url: "/board" },
        { name: "Club News Feed", url: "/news-feed" },
        { name: "Affiliations", url: "/affiliations" }
      ]
    },
    {
      title: "Membership Tiers",
      links: [
        { name: "🏆 Donor Membership", url: "/membership" },
        { name: "🏵️ Life Membership", url: "/membership" },
        { name: "🛡️ Permanent Membership", url: "/membership" },
        { name: "⚓ Associate Membership", url: "/membership" }
      ]
    }
  ],
  legalLinks: [
    { name: "Privacy Policy", url: "/about" },
    { name: "Terms of Service", url: "/about" }
  ],
  copyright: "© 2026 Cox's Bazar Boat Club Limited. All Rights Reserved. Incorporated under The Companies Act, 1994, Bangladesh."
};

export function getFooterSettingsSync(): FooterSettings {
  try {
    const local = localStorage.getItem(FOOTER_DB_SETTINGS_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && parsed.socialLinks) {
        if (parsed.socialLinks.linkedin === "https://linkedin.com" || parsed.socialLinks.linkedin === "https://linkedin.com/") {
          parsed.socialLinks.linkedin = "https://www.linkedin.com/company/cbbcl/";
        }
        if (parsed.socialLinks.facebook === "https://facebook.com" || parsed.socialLinks.facebook === "https://facebook.com/") {
          parsed.socialLinks.facebook = "https://www.facebook.com/CoxsBazarBoatClubLtd";
        }
      }
      return parsed;
    }
  } catch (e) {}
  return DEFAULT_FOOTER_SETTINGS;
}

export async function fetchFooterSettings(): Promise<FooterSettings> {
  try {
    const res = await fetch("/api/cms/footer");
    if (res.ok) {
      const data = await res.json();
      if (data && data.socialLinks) {
        if (data.socialLinks.linkedin === "https://linkedin.com" || data.socialLinks.linkedin === "https://linkedin.com/") {
          data.socialLinks.linkedin = "https://www.linkedin.com/company/cbbcl/";
        }
        if (data.socialLinks.facebook === "https://facebook.com" || data.socialLinks.facebook === "https://facebook.com/") {
          data.socialLinks.facebook = "https://www.facebook.com/CoxsBazarBoatClubLtd";
        }
        localStorage.setItem(FOOTER_DB_SETTINGS_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    console.warn("Could not fetch footer settings from backend API, using local fallback");
  }
  return getFooterSettingsSync();
}

export async function updateFooterSettings(settings: FooterSettings, userRole?: string): Promise<FooterSettings> {
  // Sync locally first
  try {
    localStorage.setItem(FOOTER_DB_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}

  try {
    const res = await fetch("/api/cms/footer", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-User-Role": userRole || "admin"
      },
      body: JSON.stringify(settings)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update footer settings.");
    }
    const data = await res.json();
    return data;
  } catch (e: any) {
    console.error("Backend error updating footer settings: ", e);
    // Return standard representation even if offline
    return settings;
  }
}

