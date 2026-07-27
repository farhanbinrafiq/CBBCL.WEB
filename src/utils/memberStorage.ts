import { ClubMember, MembershipApplication, AffiliationRequest, EZBookingReservation } from "../types";
import { PRESIDENT_IMAGE, AK_RUBEL_IMAGE, MD_IMRAN_ALAM_IMAGE, MEHEDI_HASAN_IMAGE, MD_ZIAUL_HOQUE, RESHEDUL_EVU_IMAGE } from "../data";

const MEMBERS_KEY = "cbbcl_club_members";
const APPLICATIONS_KEY = "cbbcl_membership_applications";

const DEFAULT_MEMBERS: ClubMember[] = [
  {
    id: "humayun-kabir-robel",
    name: "Humayun Kabir Robel",
    email: "humayun.robel@cbbcl-member.org",
    membershipType: "Life Member",
    membershipCode: "CBBCL-FND-001",
    status: "Active",
    joinDate: "2022-01-01",
    order: 0,
    bio: "Founding President of Cox's Bazar Boat Club. A visionary entrepreneur and passionate marine sports advocate driving nautical tourism in Bangladesh.",
    achievements: "Founded Cox's Bazar Boat Club Limited; Leading regional coastal tourism development initiatives.",
    clubInvolvement: "Founding President, Chairman of the Executive Committee, and Senior Patron of the Club.",
    avatarUrl: PRESIDENT_IMAGE,
    category: "Founding Member",
    roleType: "FoundingMember"
  },
  {
    id: "farhan-bin-rafiq",
    name: "Farhan Bin Rafiq",
    email: "farhan.rafiq@cbbcl-member.org",
    membershipType: "Life Member",
    membershipCode: "CBBCL-FND-002",
    status: "Active",
    joinDate: "2022-01-01",
    order: 1,
    bio: "Founding Vice President of Cox's Bazar Boat Club. Expert yachting navigator and sponsor of deep sea fishing expeditions across the Bay of Bengal.",
    achievements: "First place in Bay of Bengal Yachting Regatta of 2023; Championed sustainable fishery projects.",
    clubInvolvement: "Founding Vice President, Member of the Disciplinary & Ethics Panel.",
    avatarUrl: "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/FBR.png",
    category: "Founding Member",
    roleType: "FoundingMember"
  },
  {
    id: "syfuddin-khaled",
    name: "Syfuddin Khaled",
    email: "syfuddin.khaled@cbbcl-member.org",
    membershipType: "Life Member",
    membershipCode: "CBBCL-FND-003",
    status: "Active",
    joinDate: "2022-01-15",
    order: 2,
    bio: "Founding Director and local marine conservationist. Syfuddin has dedicated over 15 years to coastal development and yacht community engagement.",
    achievements: "Co-developer of the Marine Education Center; Prominent speaker on Blue Economy at the National Oceanographic Assembly.",
    clubInvolvement: "Founding Director, Member of the Coastal Environment Committee.",
    avatarUrl: "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/SFK.png",
    category: "Founding Member",
    roleType: "FoundingMember"
  },
  {
    id: "arifur-rahman",
    name: "Arifur Rahman",
    email: "arifur.rahman@cbbcl-member.org",
    membershipType: "Life Member",
    membershipCode: "CBBCL-FND-004",
    status: "Active",
    joinDate: "2022-01-20",
    order: 3,
    bio: "Founding Director of CBBCL and serial investor in Cox's Bazar hospitality networks. Arifur combines marine sport passions with elite maritime hospitality.",
    achievements: "Pioneered luxury yacht charters in Cox's Bazar; National Tourism Excellence Award nominee.",
    clubInvolvement: "Founding Director, Head of the Yachting and Leisure Committee.",
    avatarUrl: "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/ARF.png",
    category: "Founding Member",
    roleType: "FoundingMember"
  },
  {
    id: "md-imran-alam",
    name: "Md Imran Alam",
    email: "imran.alam@cbbcl-member.org",
    membershipType: "Life Member",
    membershipCode: "CBBCL-LIF-006",
    status: "Active",
    joinDate: "2024-03-15",
    order: 4,
    bio: "Md Imran Alam is an active marine commerce enthusiast and deep-water fisherman with a lifelong career dedicated to developing coastal maritime activities around the Bay of Bengal.",
    achievements: "Pioneered blue-economy fishing expeditions; Lifetime achievement award for regional sea tourism.",
    clubInvolvement: "Active organizer of the Annual Deep Sea Fishing Tournament; Core member of the Yachting Committee.",
    avatarUrl: MD_IMRAN_ALAM_IMAGE,
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "tanvir-hasan",
    name: "Tanvir Hasan",
    email: "tanvir.hasan@cbbcl-member.org",
    membershipType: "Life Member",
    membershipCode: "CBBCL-LIF-007",
    status: "Active",
    joinDate: "2024-04-10",
    order: 5,
    bio: "Tanvir Hasan is an entrepreneur in coastal resort development, keen sailor, and regular sponsor of Cox's Bazar youth regattas.",
    achievements: "Established premier eco-friendly waterfront villas; Contributor to coastal community health centers.",
    clubInvolvement: "Sponsor of youth sailing camps; member of the Sports Committee.",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "nusrat-jahan",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@cbbcl-member.org",
    membershipType: "Life Member",
    membershipCode: "CBBCL-LIF-008",
    status: "Active",
    joinDate: "2024-06-18",
    order: 6,
    bio: "Nusrat Jahan is a senior maritime lawyer advising coastal logistic syndicates on ecological law and blue-economy compliance standards.",
    achievements: "Outstanding Environmental Jurist award (2025); Prolific editor of sea freight guides.",
    clubInvolvement: "Legal advisor to CBBCL governance panels; frequent high-table panel speaker.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "shahriar-rahman",
    name: "Shahriar Rahman",
    email: "shahriar.r@cbbcl-member.org",
    membershipType: "Permanent Member",
    membershipCode: "CBBCL-PER-010",
    status: "Active",
    joinDate: "2024-02-12",
    order: 7,
    bio: "Shahriar Rahman is an offshore engineering manager leading deep-sea drilling technology designs and maritime environmental checks near Chittagong port.",
    achievements: "Installed state-of-the-art offshore drilling safety valves; Author of marine safety handbooks.",
    clubInvolvement: "Technical inspector for the CBBCL Yacht Safety Commission.",
    avatarUrl: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=400",
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "ayesha-rahman",
    name: "Ayesha Rahman",
    email: "ayesha.rahman@cbbcl-member.org",
    membershipType: "Permanent Member",
    membershipCode: "CBBCL-PER-011",
    status: "Active",
    joinDate: "2024-05-30",
    order: 8,
    bio: "Ayesha Rahman is an acclaimed landscape designer and consultant specialized in waterfront resort layouts and eco-tourism structures.",
    achievements: "Designed botanical landscape plans for top-tier cox's bazar resorts; Champion of native flora restoration campaigns.",
    clubInvolvement: "Advising the Board on standard flora and garden upkeep around the lounge waterfront.",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "rakib-hossain",
    name: "Rakib Hossain",
    email: "rakib.h@cbbcl-member.org",
    membershipType: "Permanent Member",
    membershipCode: "CBBCL-PER-012",
    status: "Active",
    joinDate: "2024-08-14",
    order: 9,
    bio: "Rakib Hossain is a luxury real estate curator operating hospitality structures throughout Cox's Bazar and Inani Beach areas.",
    achievements: "Developed modern residential marine-villas; Named hospitality star of the year.",
    clubInvolvement: "Senior member of regional gala planning board.",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "mehedi-hasan",
    name: "Mehedi Hasan",
    email: "mehedi.hasan@cbbcl-member.org",
    membershipType: "Associate Member",
    membershipCode: "CBBCL-ASS-020",
    status: "Active",
    joinDate: "2025-01-22",
    order: 10,
    bio: "Mehedi Hasan is a young watersports developer and trainer specializing in powerboat maneuvers and recreational jet-ski guidelines.",
    achievements: "Awarded cox's bazar safety medal for coastal lifesaver training; Certified diving master.",
    clubInvolvement: "Assistant safety officer for recreational sea sport clinics.",
    avatarUrl: MEHEDI_HASAN_IMAGE,
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "jannatul-ferdous",
    name: "Jannatul Ferdous",
    email: "jannatul.f@cbbcl-member.org",
    membershipType: "Associate Member",
    membershipCode: "CBBCL-ASS-021",
    status: "Active",
    joinDate: "2025-03-05",
    order: 11,
    bio: "Jannatul Ferdous works actively as an oceanography researcher specializing in sea current tracking and bay tidal pattern studies.",
    achievements: "Initiated a youth ocean tracking research program; Published papers in coastal science.",
    clubInvolvement: "Education coordinator for the Marine Center's youth oceanography camps.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "mahmudul-karim",
    name: "Mahmudul Karim",
    email: "mahmudul.k@cbbcl-member.org",
    membershipType: "Donor Member",
    membershipCode: "CBBCL-DON-030",
    status: "Active",
    joinDate: "2024-09-02",
    order: 12,
    bio: "Mahmudul Karim is a sea-cargo logistics entrepreneur who actively donates to regional marine radar networks and fishing safety funds.",
    achievements: "Built multi-user maritime dispatch centers; Recognized as chief regional philanthropist.",
    clubInvolvement: "Lead sponsor of coastal GPS rescue beacon distribution campaigns.",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "saima-akter",
    name: "Saima Akter",
    email: "saima.akter@cbbcl-member.org",
    membershipType: "Donor Member",
    membershipCode: "CBBCL-DON-031",
    status: "Active",
    joinDate: "2024-11-20",
    order: 13,
    bio: "Saima Akter is a marine technology patron funding coastal research stations and beach cleanup operations across Cox's Bazar.",
    achievements: "Donated the CBBCL eco-boat to clean near-shore plastics; Established tidal alert platforms.",
    clubInvolvement: "Head of the Environmental Protection and Coastal Safety Forum.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "chief-guest-one",
    name: "Chief Guest Example One",
    email: "chiefguest.one@cbbcl-member.org",
    membershipType: "Honorary Member",
    membershipCode: "CBBCL-HON-040",
    status: "Active",
    joinDate: "2023-05-15",
    order: 14,
    bio: "Distinguished global yacht club commissioner and diplomatic envoy promoting international friendship standard exchanges under maritime law.",
    achievements: "Decorated representative of world navigation networks; Advisor to regional ports authority.",
    clubInvolvement: "Special advisory guest for world-class hospitality and luxury operations.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "distinguished-guest-two",
    name: "Distinguished Guest Two",
    email: "distinguished.two@cbbcl-member.org",
    membershipType: "Honorary Member",
    membershipCode: "CBBCL-HON-041",
    status: "Active",
    joinDate: "2023-11-12",
    order: 15,
    bio: "Academic leader and state minister advising oceanic conservation and sustainable fishery regulations across Southeast Asia.",
    achievements: "Championed ocean conservation pacts of 2024; Outstanding diplomatic recognition medal.",
    clubInvolvement: "Honorary representative on national sustainability panel.",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "md-rezaul-karim",
    name: "Md Rezaul Karim",
    email: "rezaul.karim@cbbcl-member.org",
    membershipType: "Permanent Member",
    membershipCode: "CBBCL-EXE-050",
    status: "Active",
    joinDate: "2023-01-01",
    order: 16,
    bio: "Md Rezaul Karim serves as the Secretary General of the club, responsible for executing corporate directives, registry audits, and administrative coordination.",
    achievements: "Reorganized institutional framework guidelines; Optimized membership registry data models.",
    clubInvolvement: "Secretary General, Manager of legal affairs and registry systems.",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    category: "Executive Officer",
    roleType: "ExecutiveOfficer"
  },
  {
    id: "admin-officer-example",
    name: "Admin Officer Example",
    email: "admin.officer@cbbcl-member.org",
    membershipType: "Associate Member",
    membershipCode: "CBBCL-EXE-051",
    status: "Active",
    joinDate: "2024-01-10",
    order: 17,
    bio: "Administrative officer overseeing daily cox's bazar clubhouse procedures, guest services, and official registry documentation.",
    achievements: "Recognized for service excellence in public relations and community support; Managed CBBCL hospitality.",
    clubInvolvement: "Administrative Officer, Assistant to secretarial board.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    category: "Executive Officer",
    roleType: "ExecutiveOfficer"
  },
  {
    id: "dr-sofia-kamal",
    name: "Dr. Sofia Kamal",
    email: "sofia.kamal@cbbcl-member.org",
    membershipType: "Honorary Member",
    membershipCode: "CBBCL-HONORARY-001",
    status: "Active",
    joinDate: "2023-01-10",
    order: 18,
    bio: "Dr. Sofia Kamal is a renowned marine biologist and academic scholar leading conservation projects for coral reefs along Saint Martin's Island.",
    achievements: "Recipient of National Ecological Stewardship Medal (2025); Published 50+ papers in oceanic sustainability.",
    clubInvolvement: "Senior Advisor for Coastal Environment Protection; Curator of the CBBCL Marine Education Center.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    category: "Executive Officer",
    roleType: "ExecutiveOfficer"
  },
  {
    id: "tasnim-jahan",
    name: "Tasnim Jahan",
    email: "tasnim.jahan@cbbcl-member.org",
    membershipType: "Associate Member",
    membershipCode: "CBBCL-ASSOCIATE-022",
    status: "Active",
    joinDate: "2025-02-18",
    order: 19,
    bio: "Tasnim Jahan is an water sports champion and specialized physical health trainer focusing on sea-kayaking, rescue swimming, and competitive rowing coaching.",
    achievements: "Gold medalist in regional rowing competitions (2024); Lead coordinator for female nautical athletic programs.",
    clubInvolvement: "Rowing and Water Safety Coordinator; Organizer of the Beach Kayak Regatta.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    category: "Executive Officer",
    roleType: "ExecutiveOfficer"
  },
  {
    id: "raymond-vance",
    name: "Raymond Vance",
    email: "raymond.vance@cbbcl-member.org",
    membershipType: "Permanent Member",
    membershipCode: "CBBCL-PERMANENT-014",
    status: "Active",
    joinDate: "2024-05-22",
    order: 20,
    bio: "Raymond Vance is a veteran yacht captain and marine builder with engineering experience in wooden hull retrofitting and harbor architecture.",
    achievements: "Designed and constructed custom sailing vessels; Supervised harbor redevelopment blueprints.",
    clubInvolvement: "Chairman of the Maritime Crafting and Maintenance Workshop; Lead instructor for youth oceanography camp.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    category: "General Member",
    roleType: "RegularMember"
  },
  {
    id: "kaiser-chowdhury",
    name: "Kaiser Chowdhury",
    email: "kaiser.chowdhury@cbbcl-member.org",
    membershipType: "Donor Member",
    membershipCode: "CBBCL-DONOR-003",
    status: "Active",
    joinDate: "2024-11-05",
    order: 21,
    bio: "Kaiser Chowdhury is a prominent philanthropist, industrialist, and sponsor of marine logistics services promoting coastal safety infrastructures.",
    achievements: "Co-sponsored modern GPS distress beacon devices for local fishermen; Prominent member of regional business council.",
    clubInvolvement: "Sponsor of the CBBCL Philanthropic Safety Fund; General sponsor of the annual membership gala.",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    category: "Founding Member",
    roleType: "FoundingMember"
  }
];

const GLOBAL_AVATARS: Record<string, string> = {
  "humayun-kabir-robel": PRESIDENT_IMAGE,
  "farhan-bin-rafiq": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/FBR.png",
  "ak-rubel": AK_RUBEL_IMAGE,
  "md-imran-alam": MD_IMRAN_ALAM_IMAGE,
  "arifur-rahman": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/ARF.png",
  "amzad-mahmud": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/AZM.png",
  "mohammed-elias": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/ELS.png",
  "mehedi-hasan": MEHEDI_HASAN_IMAGE,
  "nurul-absar": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/NRA.png",
  "syfuddin-khaled": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/SFK.png",
  "ziaul-haque": MD_ZIAUL_HOQUE.image,
  "md-yousuf": "https://raw.githubusercontent.com/farhanbinrafiq/CBBCL.WEB/4b998dcc9edbac7865c3dcbecf64939a7aebcd9d/YSF.png",
  "reshedul-evu": RESHEDUL_EVU_IMAGE
};

export function getClubMembers(): ClubMember[] {
  try {
    const data = localStorage.getItem(MEMBERS_KEY);
    if (!data) {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(DEFAULT_MEMBERS));
      return DEFAULT_MEMBERS;
    }
    let list = JSON.parse(data);
    if (!Array.isArray(list)) {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(DEFAULT_MEMBERS));
      return DEFAULT_MEMBERS;
    }
    
    // Check if the list lacks the new comprehensive dummy list
    const hasNewDummyData = list.some(item => item && item.id === "humayun-kabir-robel");
    if (!hasNewDummyData || list.length < 15) {
      // Force rewrite to updated dummy set, preserving any custom user-added items
      const userAdded = list.filter(item => item && !DEFAULT_MEMBERS.some(def => def.id === item.id));
      list = [...DEFAULT_MEMBERS, ...userAdded];
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(list));
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
        if (item.id === "md-imran-alam" || item.id === "kaiser-chowdhury" || item.id === "humayun-kabir-robel" || item.id === "farhan-bin-rafiq" || item.id === "syfuddin-khaled" || item.id === "arifur-rahman") {
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

const DEFAULT_AFF_REQUESTS: AffiliationRequest[] = [
  {
    id: "affreq-1",
    fullName: "Md Imran Alam",
    membershipId: "CBBCL-LIFEMEMBER-006",
    membershipType: "Life Member",
    selectedClub: "Royal Yacht Club of Bangladesh",
    purpose: "Attending annual marine logistics and sailing forum as guest speaker representing CBBCL.",
    preferredDates: "2026-07-20 to 2026-07-25",
    additionalNotes: "Requesting VIP pass introduction letter.",
    status: "pending",
    submittedAt: "2026-06-05T10:15:00.000Z"
  },
  {
    id: "affreq-2",
    fullName: "Tasnim Jahan",
    membershipId: "CBBCL-ASSOCIATE-022",
    membershipType: "Associate Member",
    selectedClub: "The Dhaka Oceanfront Recreational League",
    purpose: "Weekend training access to internal Olympic rowing pool facilities.",
    preferredDates: "2026-06-15 to 2026-06-18",
    additionalNotes: "All coordination processed with pool supervisor.",
    status: "pending",
    submittedAt: "2026-06-07T09:00:00.000Z"
  }
];

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

