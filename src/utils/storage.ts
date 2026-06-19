import { User, Profile, Director, NewsPost } from "../types";
import { DIRECTORS_DATA, NEWS_DATA } from "../data";

const USERS_KEY = "cbbcl_users";
const PROFILES_KEY = "cbbcl_profiles";
const BOARD_MEMBERS_KEY = "cbbcl_board_members";
const NEWS_POSTS_KEY = "cbbcl_news_posts";
const CURRENT_USER_KEY = "cbbcl_current_user";

// Safe localStorage set utility that automatically handles and heals QuotaExceededError
export function safeLocalSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e: any) {
    console.error(`Storage error setting ${key}:`, e);
    // If browser localStorage quota is exceeded, attempt to prune oversized media items
    if (
      e.name === "QuotaExceededError" || 
      e.code === 22 || 
      e.code === 1014 || 
      e.name === "NS_ERROR_DOM_QUOTA_REACHED"
    ) {
      try {
        const MEDIA_KEY = "cbbcl_cms_media";
        const mediaData = localStorage.getItem(MEDIA_KEY);
        if (mediaData) {
          const parsed = JSON.parse(mediaData);
          if (Array.isArray(parsed) && parsed.length > 2) {
            // Trim dynamic media down to the 2 newest entries to immediately reclaim space
            const trimmed = parsed.slice(0, 2);
            localStorage.setItem(MEDIA_KEY, JSON.stringify(trimmed));
            console.warn("Storage quota recovered! Pruned media library to free up space.");
            
            // Retry writing the key
            localStorage.setItem(key, value);
            return;
          }
        }
      } catch (err) {
        console.error("Quota self-healing failed:", err);
      }
    }
  }
}

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
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      safeLocalSet(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    safeLocalSet(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  } catch (e) {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: User[]): void {
  safeLocalSet(USERS_KEY, JSON.stringify(users));
}

export function getProfiles(): Profile[] {
  try {
    const data = localStorage.getItem(PROFILES_KEY);
    if (!data) {
      safeLocalSet(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
      return DEFAULT_PROFILES;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    safeLocalSet(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
    return DEFAULT_PROFILES;
  } catch (e) {
    return DEFAULT_PROFILES;
  }
}

export function saveProfiles(profiles: Profile[]): void {
  safeLocalSet(PROFILES_KEY, JSON.stringify(profiles));
}

export function getBoardMembers(): Director[] {
  let list: Director[] = DIRECTORS_DATA;
  let data: string | null = null;
  try {
    data = localStorage.getItem(BOARD_MEMBERS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    }
  } catch (e) {
    list = DIRECTORS_DATA;
  }

  let changed = false;
  const normalized = list.map((item, idx) => {
    const updated = { ...item };
    const globalId = updated.id.toLowerCase();
    const mappedPhoto = DEFAULT_PORTRAITS[globalId];
    if (mappedPhoto && updated.photoUrl !== mappedPhoto) {
      updated.photoUrl = mappedPhoto;
      changed = true;
    }
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
    safeLocalSet(BOARD_MEMBERS_KEY, JSON.stringify(normalized));
  }
  return normalized;
}

export function saveBoardMembers(members: Director[]): void {
  const normalized = members.map(m => {
    const globalId = m.id.toLowerCase();
    const mappedPhoto = DEFAULT_PORTRAITS[globalId];
    if (mappedPhoto) {
      return { ...m, photoUrl: mappedPhoto };
    }
    return m;
  });
  safeLocalSet(BOARD_MEMBERS_KEY, JSON.stringify(normalized));
}

export function getNewsPosts(): NewsPost[] {
  try {
    const data = localStorage.getItem(NEWS_POSTS_KEY);
    if (!data) {
      safeLocalSet(NEWS_POSTS_KEY, JSON.stringify(NEWS_DATA));
      return NEWS_DATA;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    safeLocalSet(NEWS_POSTS_KEY, JSON.stringify(NEWS_DATA));
    return NEWS_DATA;
  } catch (e) {
    return NEWS_DATA;
  }
}

export function saveNewsPosts(posts: NewsPost[]): void {
  safeLocalSet(NEWS_POSTS_KEY, JSON.stringify(posts));
}

export function getLoggedInUser(): User | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  } catch (e) {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (err) {}
    return null;
  }
}

export function setLoggedInUser(user: User | null): void {
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      safeLocalSet(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error(e);
  }
}

const DEFAULT_PORTRAITS: Record<string, string> = {
  "humayun-kabir-robel": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/main/HKR.png",
  "farhan-bin-rafiq": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/FBR.png",
  "syfuddin-khaled": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/SFK.png",
  "arifur-rahman": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/ARF.png",
  "mehedi-hasan": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/MHD.png",
  "md-imran-alam": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
  "maimunal-karim-jisan": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
  "md-rezaul-kabir-reza": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600",
  "amzad-mahmud": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/AZM.png",
  "ak-rubel": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/AKR.png",
  "mohammed-elias": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/ELS.png",
  "md-yousuf": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/YSF.png",
  "nurul-absar": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/NRA.png",
  "ziaul-haque": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/ZUQ.png",
  "reshedul-evu": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
};

export function getDirectorPortrait(dir: Director): string {
  const globalId = dir.id.toLowerCase();
  const mappedPhoto = DEFAULT_PORTRAITS[globalId];
  if (mappedPhoto) return mappedPhoto;
  if (dir.photoUrl) return dir.photoUrl;
  return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600";
}
