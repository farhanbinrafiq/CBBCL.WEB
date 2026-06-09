import { User, Profile, Director, NewsPost } from "../types";
import { DIRECTORS_DATA, NEWS_DATA } from "../data";

const USERS_KEY = "cbbcl_users";
const PROFILES_KEY = "cbbcl_profiles";
const BOARD_MEMBERS_KEY = "cbbcl_board_members";
const NEWS_POSTS_KEY = "cbbcl_news_posts";
const CURRENT_USER_KEY = "cbbcl_current_user";

// Default admin and mock data for initial load
const DEFAULT_USERS: User[] = [
  {
    id: "admin-id",
    name: "Registry Administrator",
    email: "admin@cbbcl.org",
    passwordHash: "admin123",
    role: "admin",
    status: "approved"
  },
  {
    id: "unverified-member-id",
    name: "Sajid Chowdhury",
    email: "member@cbbcl.org",
    passwordHash: "member123",
    role: "member",
    status: "pending",
    membershipNumber: "CBBCL-PENDING-99"
  },
  {
    id: "verified-member-id",
    name: "Zafar Ahmed",
    email: "verified@cbbcl.org",
    passwordHash: "verified123",
    role: "verified",
    status: "approved",
    membershipNumber: "CBBCL-MEMBER-005"
  }
];

const DEFAULT_PROFILES: Profile[] = [
  {
    userId: "verified-member-id",
    name: "Zafar Ahmed",
    bio: [
      "Zafar Ahmed is an entrepreneur in real estate and international commerce.",
      "As a verified member, he supports the club's development initiatives in the Cox's Bazar waterfront and marina construction projects.",
      "His profile is verified by the central registry and assigned an active membership status."
    ],
    education: "Master of Business Administration, IBA",
    career: "CEO, Zafar Estates & Developments Ltd.",
    achievements: ["Elite Business Leader Award (2025)", "Pioneered premium commercial properties in Chittagong"],
    socialLinks: {
      linkedin: "https://linkedin.com",
      facebook: "https://facebook.com",
      twitter: "https://twitter.com"
    },
    profileStatus: "approved",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
  }
];

export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getProfiles(): Profile[] {
  const data = localStorage.getItem(PROFILES_KEY);
  if (!data) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
    return DEFAULT_PROFILES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
    return DEFAULT_PROFILES;
  }
}

export function saveProfiles(profiles: Profile[]): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getBoardMembers(): Director[] {
  const data = localStorage.getItem(BOARD_MEMBERS_KEY);
  let list: Director[];
  if (!data) {
    list = DIRECTORS_DATA;
  } else {
    try {
      list = JSON.parse(data);
    } catch (e) {
      list = DIRECTORS_DATA;
    }
  }

  let changed = false;
  const normalized = list.map((item, idx) => {
    const updated = { ...item };
    if (updated.level === undefined) {
      changed = true;
      if (updated.id === "humayun-kabir-robel") {
        updated.level = 1;
        updated.orderIndex = 0;
      } else if (updated.id === "farhan-bin-rafiq") {
        updated.level = 2;
        updated.orderIndex = 0;
      } else if (updated.id === "syfuddin-khaled") {
        updated.level = 3;
        updated.orderIndex = 0;
      } else if (updated.id === "arifur-rahman") {
        updated.level = 3;
        updated.orderIndex = 1;
      } else {
        updated.level = 4;
        updated.orderIndex = idx >= 4 ? idx - 4 : idx;
      }
    }
    if (updated.orderIndex === undefined) {
      changed = true;
      updated.orderIndex = idx;
    }
    return updated;
  });

  if (changed || !data) {
    localStorage.setItem(BOARD_MEMBERS_KEY, JSON.stringify(normalized));
  }
  return normalized;
}

export function saveBoardMembers(members: Director[]): void {
  localStorage.setItem(BOARD_MEMBERS_KEY, JSON.stringify(members));
}

export function getNewsPosts(): NewsPost[] {
  const data = localStorage.getItem(NEWS_POSTS_KEY);
  if (!data) {
    localStorage.setItem(NEWS_POSTS_KEY, JSON.stringify(NEWS_DATA));
    return NEWS_DATA;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(NEWS_POSTS_KEY, JSON.stringify(NEWS_DATA));
    return NEWS_DATA;
  }
}

export function saveNewsPosts(posts: NewsPost[]): void {
  localStorage.setItem(NEWS_POSTS_KEY, JSON.stringify(posts));
}

export function getLoggedInUser(): User | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function setLoggedInUser(user: User | null): void {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

const DEFAULT_PORTRAITS: Record<string, string> = {
  "humayun-kabir-robel": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
  "farhan-bin-rafiq": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
  "syfuddin-khaled": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
  "arifur-rahman": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  "mehedi-hasan": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=600",
  "md-imran-alam": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
  "maimunal-karim-jisan": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
  "md-rezaul-kabir-reza": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600",
  "amzad-mahmud": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600",
  "ak-rubel": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600",
  "mohammed-elias": "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=600",
  "md-yousuf": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600",
  "nurul-absar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
  "ziaul-haque": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
  "reshedul-evu": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
};

export function getDirectorPortrait(dir: Director): string {
  if (dir.photoUrl) return dir.photoUrl;
  return DEFAULT_PORTRAITS[dir.id] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600";
}
