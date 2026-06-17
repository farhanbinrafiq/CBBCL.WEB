// Home Page CMS Storage & Model
import { getMediaLibrary, saveMediaLibrary, MediaItem } from "./cmsStorage";

export interface HomeCMSHero {
  enabled: boolean;
  title: string;
  subtitle: string;
  image: string; // Base64 or URL
  overlayEnabled: boolean;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
}

export interface HomeCMSStats {
  enabled: boolean;
  metricMembers: string;
  metricVessels: string;
  metricTonnage: string;
  metricEvents: string;
  // Labels
  labelMembers: string;
  labelVessels: string;
  labelTonnage: string;
  labelEvents: string;
}

export interface HomeCMSPresidentList {
  enabled: boolean;
  name: string;
  designation: string;
  image: string; // Base64 or URL
  bio: string[];
}

export interface HomeCMSClubOverview {
  enabled: boolean;
  title: string;
  subtitle: string;
  text: string;
  welcomeText: string;
  layout: "standard" | "reversed";
  gallery: string[]; // List of base64 images from Media Library
}

export interface HomeCMSFacilities {
  enabled: boolean;
  limit: number;
}

export interface HomeCMSEvents {
  enabled: boolean;
  limit: number;
}

export interface HomeCMSNews {
  enabled: boolean;
  limit: number;
  categoryFilter: string;
}

export interface HomeCMSBoard {
  enabled: boolean;
  featuredIds: string[]; // list of director ids to feature
}

export interface HomeCMSMembership {
  enabled: boolean;
  highlightCategory: string; // Life Membership
  hiddenCategories: string[];
}

export interface HomeCMSAffiliations {
  enabled: boolean;
  featuredIds: string[];
}

export interface HomeCMSContact {
  enabled: boolean;
  address: string;
  phone: string;
  email: string;
  temporaryOffice: string;
  formEnabled: boolean;
}

export interface HomeCMSLayoutData {
  order: string[]; // e.g. ["hero", "stats", "president", "overview", "facilities", "events", "news", "board", "membership", "affiliations", "contact"]
  sections: {
    hero: HomeCMSHero;
    stats: HomeCMSStats;
    president: HomeCMSPresidentList;
    overview: HomeCMSClubOverview;
    facilities: HomeCMSFacilities;
    events: HomeCMSEvents;
    news: HomeCMSNews;
    board: HomeCMSBoard;
    membership: HomeCMSMembership;
    affiliations: HomeCMSAffiliations;
    contact: HomeCMSContact;
  };
}

const LAYOUT_STORAGE_KEY = "cbbcl_cms_home_layout";

const DEFAULT_HOME_LAYOUT: HomeCMSLayoutData = {
  order: [
    "hero",
    "stats",
    "president",
    "overview",
    "facilities",
    "events",
    "news",
    "board",
    "membership",
    "affiliations",
    "contact"
  ],
  sections: {
    hero: {
      enabled: true,
      title: "COX'S BAZAR BOAT CLUB LTD.",
      subtitle: "A Prestigious Socio-Cultural & Nautical Sanctuary Duly Chartered Under The Companies Act, 1994",
      image: "",
      overlayEnabled: true,
      cta1Text: "Explore the Club",
      cta1Link: "/about.html",
      cta2Text: "Membership Information",
      cta2Link: "/membership.html"
    },
    stats: {
      enabled: true,
      metricMembers: "35+",
      metricVessels: "15+",
      metricTonnage: "50-Berth",
      metricEvents: "12+",
      labelMembers: "Founding Circle",
      labelVessels: "Curated Luxury",
      labelTonnage: "Waterfront slips",
      labelEvents: "Annual regattas"
    },
    president: {
      enabled: true,
      name: "Humayun Kabir Robel",
      designation: "Founding President",
      image: "",
      bio: [
        "In constructing the permanent pillars of Cox's Bazar Boat Club Limited, our mission transcends establishing a conventional leisure resort. We are erecting Bangladesh’s absolute benchmark for private oceanfront companionship and nautical lifestyle.",
        "Cox's Bazar boasts the longest natural sea beach on earth. Yet, until now, it has lacked an integrated, elite socio-maritime harbor comparable in stature to historic South Asian hubs. CBBCL permanently bridges this gap."
      ]
    },
    overview: {
      enabled: true,
      title: "The Charter Legacy",
      subtitle: "Of Selective Camaraderie",
      text: "Incorporated strictly as a private non-profit Company Limited by Guarantee, CBBCL is constructed to protect the pristine shorelines of Cox's Bazar while nurturing close ties of nautical camrade among families. We foster high athletic safety and provide elite reciprocal hospitality with prime clubs worldwide.",
      welcomeText: "Proudly registered under the Joint Stock Companies & Firms (RJSC) of Bangladesh, Cox’s Bazar Boat Club Limited (CBBCL) stands as an elite private socio-recreational institution. Designed for shipping pioneers, corporate chiefs, and environment advocates, we offer a safe, luxurious marina haven that celebrates South Asia's maritime legacy on the longest sandy beach in the world.",
      layout: "standard",
      gallery: [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400"
      ]
    },
    facilities: {
      enabled: true,
      limit: 6
    },
    events: {
      enabled: true,
      limit: 3
    },
    news: {
      enabled: true,
      limit: 3,
      categoryFilter: "All"
    },
    board: {
      enabled: true,
      featuredIds: ["humayun-kabir-robel"]
    },
    membership: {
      enabled: true,
      highlightCategory: "Life Membership",
      hiddenCategories: []
    },
    affiliations: {
      enabled: true,
      featuredIds: ["ezbooking"]
    },
    contact: {
      enabled: true,
      address: "Waterfront Boulevard, Sector 1, Marina District, Cox's Bazar, Bangladesh",
      phone: "+880 1812 345678, +880 1711 987654",
      email: "registry@cbbcl.org, admin@cbbcl.org",
      temporaryOffice: "VIP Executive Suite, Hotel Sea Albatross, Kolatoli Point, Cox's Bazar",
      formEnabled: true
    }
  }
};

export function getHomeLayoutCMS(): HomeCMSLayoutData {
  try {
    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(DEFAULT_HOME_LAYOUT));
      return DEFAULT_HOME_LAYOUT;
    }
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === "object") {
      // Deep merge sections to survive schema upgrades
      const order = Array.isArray(parsed.order) ? parsed.order : DEFAULT_HOME_LAYOUT.order;
      const s = parsed.sections || {};
      
      // Upgrade default title to brand standards
      if (s.hero && s.hero.title === "COX'S BAZAR BOAT CLUB") {
        s.hero.title = "COX'S BAZAR BOAT CLUB LTD.";
      }

      const sections = {
        hero: { ...DEFAULT_HOME_LAYOUT.sections.hero, ...(s.hero || {}) },
        stats: { ...DEFAULT_HOME_LAYOUT.sections.stats, ...(s.stats || {}) },
        president: { ...DEFAULT_HOME_LAYOUT.sections.president, ...(s.president || {}) },
        overview: { ...DEFAULT_HOME_LAYOUT.sections.overview, ...(s.overview || {}) },
        facilities: { ...DEFAULT_HOME_LAYOUT.sections.facilities, ...(s.facilities || {}) },
        events: { ...DEFAULT_HOME_LAYOUT.sections.events, ...(s.events || {}) },
        news: { ...DEFAULT_HOME_LAYOUT.sections.news, ...(s.news || {}) },
        board: { ...DEFAULT_HOME_LAYOUT.sections.board, ...(s.board || {}) },
        membership: { ...DEFAULT_HOME_LAYOUT.sections.membership, ...(s.membership || {}) },
        affiliations: { ...DEFAULT_HOME_LAYOUT.sections.affiliations, ...(s.affiliations || {}) },
        contact: { ...DEFAULT_HOME_LAYOUT.sections.contact, ...(s.contact || {}) }
      };
      return { order, sections };
    }
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(DEFAULT_HOME_LAYOUT));
    return DEFAULT_HOME_LAYOUT;
  } catch (e) {
    return DEFAULT_HOME_LAYOUT;
  }
}

export function saveHomeLayoutCMS(layout: HomeCMSLayoutData): void {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  } catch (e) {
    console.error(e);
  }
}

// Media upload custom utility to automatically sync image to Central Media Library,
// returning the base64 URL so the user can easily reference it
export function syncImageToMediaLibrary(base64: string, name: string): string {
  const library = getMediaLibrary();
  const slugName = name.trim() || `CMS-Uploaded-${Date.now()}`;
  
  // Check if it already exists to avoid duplication
  const existing = library.find(item => item.url === base64);
  if (existing) {
    return existing.url;
  }

  const newItem: MediaItem = {
    id: `media-${Date.now()}`,
    name: slugName,
    url: base64,
    category: "Gallery",
    uploadedAt: new Date().toISOString()
  };
  
  library.unshift(newItem);
  saveMediaLibrary(library);
  return base64;
}
