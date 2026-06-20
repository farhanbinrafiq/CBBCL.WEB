import { User, Profile, Director, NewsPost } from "../types";
import { DIRECTORS_DATA, NEWS_DATA, PRESIDENT_IMAGE, AK_RUBEL_IMAGE, MAIMUNAL_KARIM_JISAN_IMAGE, MD_IMRAN_ALAM_IMAGE, MD_REZAUL_KABIR_REZA_IMAGE, MEHEDI_HASAN_IMAGE, MD_ZIAUL_HOQUE } from "../data";

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
      // Merge: any post hardcoded in NEWS_DATA that is missing in localStorage's parsed is added
      const merged = [...parsed];
      for (const defaultPost of NEWS_DATA) {
        if (!merged.some((p) => p.id === defaultPost.id)) {
          merged.push(defaultPost);
        }
      }
      
      // Sort to prioritize and align default posts according to their index in NEWS_DATA, with custom posts following after
      merged.sort((a, b) => {
        const idxA = NEWS_DATA.findIndex((nd) => nd.id === a.id);
        const idxB = NEWS_DATA.findIndex((nd) => nd.id === b.id);
        if (idxA !== -1 && idxB !== -1) {
          return idxA - idxB;
        }
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      });

      // Save it back to local storage if merged length is different
      if (merged.length !== parsed.length) {
        safeLocalSet(NEWS_POSTS_KEY, JSON.stringify(merged));
      }
      // Map to ensure actual values from NEWS_DATA of corresponding posts are preserved
      return merged.map((post: NewsPost) => {
        const corresponding = NEWS_DATA.find((nd) => nd.id === post.id);
        if (corresponding) {
          return { 
            ...post, 
            image: corresponding.image,
            title: corresponding.title,
            category: corresponding.category,
            content: corresponding.content,
            excerpt: corresponding.excerpt
          };
        }
        return post;
      });
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
  "humayun-kabir-robel": PRESIDENT_IMAGE,
  "farhan-bin-rafiq": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/FBR.png",
  "syfuddin-khaled": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/SFK.png",
  "arifur-rahman": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/ARF.png",
  "mehedi-hasan": MEHEDI_HASAN_IMAGE,
  "md-imran-alam": MD_IMRAN_ALAM_IMAGE,
  "maimunal-karim-jisan": MAIMUNAL_KARIM_JISAN_IMAGE,
  "md-rezaul-kabir-reza": MD_REZAUL_KABIR_REZA_IMAGE,
  "amzad-mahmud": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/AZM.png",
  "ak-rubel": AK_RUBEL_IMAGE,
  "mohammed-elias": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/ELS.png",
  "md-yousuf": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/YSF.png",
  "nurul-absar": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/NRA.png",
  "ziaul-haque": MD_ZIAUL_HOQUE.image,
  "reshedul-evu": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
};

export function getDirectorPortrait(dir: Director): string {
  const globalId = dir.id.toLowerCase();
  const mappedPhoto = DEFAULT_PORTRAITS[globalId];
  if (mappedPhoto) return mappedPhoto;
  if (dir.photoUrl) return dir.photoUrl;
  return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600";
}
