import { ClubMember, MembershipApplication, AffiliationRequest, EZBookingReservation } from "../types";
import { DIRECTORS_DATA, PRESIDENT_IMAGE, AK_RUBEL_IMAGE, MAIMUNAL_KARIM_JISAN_IMAGE, MD_REZAUL_KABIR_REZA_IMAGE, MD_IMRAN_ALAM_IMAGE, MEHEDI_HASAN_IMAGE, MD_ZIAUL_HOQUE, RESHEDUL_EVU_IMAGE, FARHAN_BIN_RAFIQ_IMAGE, ARIFUR_RAHMAN_IMAGE, AMZAD_MAHMUD_IMAGE, MOHAMMED_ELIAS_IMAGE, MD_YOUSUF_IMAGE, NURUL_ABSAR_IMAGE } from "../data";

const MEMBERS_KEY = "cbbcl_club_members";
const APPLICATIONS_KEY = "cbbcl_membership_applications";

const GLOBAL_AVATARS: Record<string, string> = {
  "humayun-kabir-robel": PRESIDENT_IMAGE,
  "farhan-bin-rafiq": FARHAN_BIN_RAFIQ_IMAGE,
  "ak-rubel": AK_RUBEL_IMAGE,
  "maimunal-karim-jisan": MAIMUNAL_KARIM_JISAN_IMAGE,
  "md-rezaul-kabir-reza": MD_REZAUL_KABIR_REZA_IMAGE,
  "md-imran-alam": MD_IMRAN_ALAM_IMAGE,
  "arifur-rahman": ARIFUR_RAHMAN_IMAGE,
  "amzad-mahmud": AMZAD_MAHMUD_IMAGE,
  "mohammed-elias": MOHAMMED_ELIAS_IMAGE,
  "mehedi-hasan": MEHEDI_HASAN_IMAGE,
  "nurul-absar": NURUL_ABSAR_IMAGE,
  "ziaul-haque": MD_ZIAUL_HOQUE.image,
  "md-yousuf": MD_YOUSUF_IMAGE,
  "reshedul-evu": RESHEDUL_EVU_IMAGE
};

// The club's registered members are its founding directors, all holding Life Membership.
const DEFAULT_MEMBERS: ClubMember[] = DIRECTORS_DATA.map((d, idx) => ({
  id: d.id,
  name: d.name,
  membershipType: "Life Member",
  membershipCode: d.membershipCode || "",
  status: "Active",
  joinDate: "",
  order: idx,
  bio: d.bio && d.bio.length > 0 ? d.bio.join("\n\n") : undefined,
  clubInvolvement: d.designation,
  avatarUrl: GLOBAL_AVATARS[d.id] || d.photoUrl,
  category: "Founding Member",
  roleType: "FoundingMember"
}));

// Placeholder members shipped with earlier builds; removed from cached lists once.
const DEMO_MEMBER_IDS = [
  "tanvir-hasan", "nusrat-jahan", "shahriar-rahman", "ayesha-rahman", "rakib-hossain",
  "jannatul-ferdous", "mahmudul-karim", "saima-akter", "chief-guest-one", "distinguished-guest-two",
  "md-rezaul-karim", "admin-officer-example", "dr-sofia-kamal", "tasnim-jahan", "raymond-vance",
  "kaiser-chowdhury",
  // Removed from the board
  "syfuddin-khaled"
];
const MEMBERS_SEED_KEY = "cbbcl_club_members_seed";
const MEMBERS_SEED_VERSION = "founding-directors-v7";


export function getClubMembers(): ClubMember[] {
  try {
    const data = localStorage.getItem(MEMBERS_KEY);
    if (!data) {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(DEFAULT_MEMBERS));
      localStorage.setItem(MEMBERS_SEED_KEY, MEMBERS_SEED_VERSION);
      return DEFAULT_MEMBERS;
    }
    let list = JSON.parse(data);
    if (!Array.isArray(list)) {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(DEFAULT_MEMBERS));
      return DEFAULT_MEMBERS;
    }
    
    // One-time reseed: drop demo members, refresh the founding directors, keep admin-added members.
    if (localStorage.getItem(MEMBERS_SEED_KEY) !== MEMBERS_SEED_VERSION) {
      const userAdded = list.filter(item => item && !DEMO_MEMBER_IDS.includes(item.id) && !DEFAULT_MEMBERS.some(def => def.id === item.id));
      list = [...DEFAULT_MEMBERS, ...userAdded.map((item, i) => ({ ...item, order: DEFAULT_MEMBERS.length + i }))];
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(list));
      localStorage.setItem(MEMBERS_SEED_KEY, MEMBERS_SEED_VERSION);
    }

    let changed = false;
    list.forEach((item, idx) => {
      if (!item) return;
      const globalId = item.id.toLowerCase();
      const mappedAvatar = GLOBAL_AVATARS[globalId];
      if (mappedAvatar && item.avatarUrl !== mappedAvatar) {
        item.avatarUrl = mappedAvatar;
        changed = true;
      }
      if (item.order === undefined) {
        item.order = idx;
        changed = true;
      }
      if (!item.category) {
        if (item.id === "md-imran-alam" || item.id === "kaiser-chowdhury" || item.id === "humayun-kabir-robel" || item.id === "farhan-bin-rafiq" || item.id === "arifur-rahman") {
          item.category = "Founding Member";
        } else if (item.id === "dr-sofia-kamal" || item.id === "tasnim-jahan" || item.id === "md-rezaul-karim" || item.id === "admin-officer-example") {
          item.category = "Executive Officer";
        } else {
          item.category = "General Member";
        }
        changed = true;
      }
      if (!item.roleType) {
        if (item.category === "Founding Member") {
          item.roleType = "FoundingMember";
        } else if (item.category === "Executive Officer") {
          item.roleType = "ExecutiveOfficer";
        } else {
          item.roleType = "RegularMember";
        }
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(list));
    }
    return list.filter(Boolean).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (e) {
    return DEFAULT_MEMBERS;
  }
}

export function saveClubMembers(members: ClubMember[]): void {
  try {
    const sorted = [...members].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    sorted.forEach((item, idx) => {
      if (item) {
        item.order = idx;
        const globalId = item.id.toLowerCase();
        const mappedAvatar = GLOBAL_AVATARS[globalId];
        if (mappedAvatar) {
          item.avatarUrl = mappedAvatar;
        }
      }
    });
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(sorted));
  } catch (e) {
    console.error(e);
  }
}

// Initial default applications to make the system look active upon loading
const DEFAULT_APPLICATIONS: MembershipApplication[] = [
  {
    id: "app-1",
    fullName: "Imtiaz Hossain Chowdhury",
    email: "imtiaz.h@bengalgroup.com",
    phone: "+880 1819384729",
    membershipType: "Life Member",
    motivation: "I would love to be part of Cox's Bazar Boat Club to engage in premium sailing expeditions, network with elite corporate operators, and support safe local coastal tourist infrastructures under the CBBCL community guideline.",
    organization: "Bengal Group of Industries",
    designation: "Executive Director",
    dob: "1980-04-12",
    status: "pending",
    submittedAt: "2026-06-05T08:34:00.000Z",
    documentName: "bengal_executive_credentials.pdf"
  },
  {
    id: "app-2",
    fullName: "Kamrun Nahar Eva",
    email: "eva.kamrun@gmail.com",
    phone: "+880 1711293847",
    membershipType: "Permanent Member",
    motivation: "Having worked as a marine logistics consultant, CBBCL is the perfect elite space to spend waterfront holidays. I support coastal coral preservation initiatives.",
    organization: "Aqua Logistics Syndicate",
    designation: "Managing Partner",
    dob: "1985-11-20",
    status: "pending",
    submittedAt: "2026-06-06T14:12:00.000Z",
    documentName: "aqua_profile_summary.pdf"
  }
];

export function getMembershipApplications(): MembershipApplication[] {
  try {
    const data = localStorage.getItem(APPLICATIONS_KEY);
    if (!data) {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
      return DEFAULT_APPLICATIONS;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
    return DEFAULT_APPLICATIONS;
  } catch (e) {
    return DEFAULT_APPLICATIONS;
  }
}

export function saveMembershipApplications(applications: MembershipApplication[]): void {
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  } catch (e) {
    console.error(e);
  }
}

const AFF_REQUESTS_KEY = "cbbcl_affiliation_requests";

const DEFAULT_AFF_REQUESTS: AffiliationRequest[] = [];

export function getAffiliationRequests(): AffiliationRequest[] {
  try {
    const data = localStorage.getItem(AFF_REQUESTS_KEY);
    if (!data) {
      localStorage.setItem(AFF_REQUESTS_KEY, JSON.stringify(DEFAULT_AFF_REQUESTS));
      return DEFAULT_AFF_REQUESTS;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    localStorage.setItem(AFF_REQUESTS_KEY, JSON.stringify(DEFAULT_AFF_REQUESTS));
    return DEFAULT_AFF_REQUESTS;
  } catch (e) {
    return DEFAULT_AFF_REQUESTS;
  }
}

export function saveAffiliationRequests(requests: AffiliationRequest[]): void {
  try {
    localStorage.setItem(AFF_REQUESTS_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error(e);
  }
}

const EZBOOKING_KEY = "cbbcl_ezbooking_reservations";

const DEFAULT_EZ_RESERVATIONS: EZBookingReservation[] = [
  {
    id: "ezr-1",
    memberId: "CBBCL-LIFEMEMBER-006",
    bookingType: "hotel",
    destination: "Saint Martin Sea View Suite",
    travelDate: "2026-06-25",
    guestsCount: "2 Guests",
    amountPaid: 8400,
    status: "Issued",
    submittedAt: "2026-06-07T08:00:00Z"
  },
  {
    id: "ezr-2",
    memberId: "CBBCL-ASSOCIATE-022",
    bookingType: "flight",
    destination: "Dhaka to Cox's Bazar",
    travelDate: "2026-07-02",
    guestsCount: "1 Guest",
    amountPaid: 5950,
    status: "Pending",
    submittedAt: "2026-06-08T11:20:00Z"
  }
];

export function getEZBookingReservations(): EZBookingReservation[] {
  try {
    const data = localStorage.getItem(EZBOOKING_KEY);
    if (!data) {
      localStorage.setItem(EZBOOKING_KEY, JSON.stringify(DEFAULT_EZ_RESERVATIONS));
      return DEFAULT_EZ_RESERVATIONS;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    localStorage.setItem(EZBOOKING_KEY, JSON.stringify(DEFAULT_EZ_RESERVATIONS));
    return DEFAULT_EZ_RESERVATIONS;
  } catch (e) {
    return DEFAULT_EZ_RESERVATIONS;
  }
}

export function saveEZBookingReservations(reservations: EZBookingReservation[]): void {
  try {
    localStorage.setItem(EZBOOKING_KEY, JSON.stringify(reservations));
  } catch (e) {
    console.error(e);
  }
}

