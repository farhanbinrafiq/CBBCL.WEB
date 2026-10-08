export type RoutePath =
  | "/"
  | "/about"
  | "/facilities"
  | "/gallery"
  | "/membership"
  | "/membership-application"
  | "/governance"
  | "/board"
  | "/news-feed"
  | "/news"
  | "/events"
  | "/affiliations"
  | "/affiliation-request"
  | "/ezbooking-portal"
  | "/contact"
  | "/login"
  | "/register"
  | "/dashboard"
  | "/admin-dashboard"
  | "/members"
  | string;

export interface Director {
  id: string;
  name: string;
  designation: string;
  photoUrl?: string; // or placeholder
  /** Descriptive alt text for the portrait. */
  photoAlt?: string;
  bio?: string[];
  membershipCode?: string;
  appointed?: string;
  businessProfile?: {
    company: string;
    role: string;
    industry: string;
    interests?: string;
    website?: string;
  };
  achievements?: string[];
  memberships?: string[];
  community?: string[];
  timeline?: { year: string; event: string }[];
  vision?: string[];
  /** Short personal statement shown under the biography. */
  quote?: string;
  /** Professional strengths shown as tags under "Areas of Expertise". */
  expertise?: string[];
  socials?: { linkedin?: string; facebook?: string; twitter?: string; instagram?: string; email?: string };
  // Set once the director has submitted their profile form: only their real data is shown,
  // and sections they left empty are hidden instead of being filled with placeholder text.
  profileSubmitted?: boolean;
  // Bump whenever a submitted profile changes so browsers with a cached copy refresh it.
  profileRevision?: number;
  level?: number;      // 1: President, 2: VP, 3: Core Secretariat, 4: Founding Director
  orderIndex?: number; // Sorting rank within the tier
}

export interface NewsPost {
  id: string;
  title: string;
  date: string;
  category: "Events" | "News" | "Announcements" | "Sports" | "Cultural" | "CSR" | "Governance" | "Official Gazette Release";
  year: string;
  month: string; // e.g., "June", "January"
  excerpt: string;
  content: string;
  tags: string[];
  image?: string;
  /** CSS object-position for the image in cropped cards, e.g. "center 12%". */
  imagePosition?: string;
  likes: number;
  commentsCount: number;
  status?: "Published" | "Draft" | "Scheduled";
  scheduledDate?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  venue: string;
  category: string;
  isUpcoming: boolean;
  image?: string;
  description: string;
  registrationInfo?: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  features: string[];
  capacity: string;
  image: string;
}

export interface Affiliation {
  id: string;
  name: string;
  description: string;
  website: string;
  partnershipType: string;
  logo?: string;
  country?: string;
}

export type AuthRole = "public" | "member" | "verified" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AuthRole;
  membershipNumber?: string;
  status: "pending" | "approved" | "rejected";
  rejectionComment?: string;
}

export interface Profile {
  userId: string;
  name: string;
  bio: string[];
  education?: string;
  career?: string;
  achievements?: string[];
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
  profileStatus: "draft" | "pending" | "approved" | "rejected";
  rejectionComment?: string;
  photoUrl?: string;
}

export interface ClubMember {
  id: string;
  name: string;
  email?: string;
  membershipType: "Life Member" | "Permanent Member" | "Associate Member" | "Donor Member" | "Honorary Member";
  membershipCode: string;
  status: "Active" | "Pending" | "Suspended";
  joinDate: string; // YYYY-MM-DD
  order: number; // custom sequencing order index
  bio?: string;
  achievements?: string;
  clubInvolvement?: string;
  avatarUrl?: string;
  category?: "Founding Member" | "Executive Officer" | "General Member";
  roleType?: "FoundingMember" | "ExecutiveOfficer" | "RegularMember";
}

export interface MembershipApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  membershipType: string;
  motivation: string;
  organization: string;
  designation: string;
  dob?: string;
  status: "pending" | "under_verification" | "approved" | "rejected";
  submittedAt: string;
  documentName?: string;
  adminNotes?: string;
}

export interface AffiliationRequest {
  id: string;
  fullName: string;
  membershipId: string;
  membershipType: string;
  selectedClub: string;
  purpose: string;
  preferredDates: string;
  additionalNotes?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export interface EZBookingReservation {
  id: string;
  memberId: string;
  bookingType: "hotel" | "flight" | "event";
  destination: string;
  travelDate: string;
  guestsCount: string;
  amountPaid: number;
  promoCode?: string;
  status: "Pending" | "Issued" | "Cancelled";
  submittedAt: string;
}

export interface FooterLinkItem {
  name: string;
  url: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLinkItem[];
}

export interface LegalLinkItem {
  name: string;
  url: string;
}

export interface FooterLogoSettings {
  type: string;
  url: string;
  alt: string;
}

export interface FooterSettings {
  key: string;
  logo?: FooterLogoSettings;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    twitter: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  footerLinks: FooterLinkGroup[];
  legalLinks: LegalLinkItem[];
  copyright: string;
}




