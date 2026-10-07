// Single source of truth for membership categories and fees, taken from the
// Club's Articles of Association (AOA). Do not add prices, privileges, or
// restrictions here that the AOA does not state. Unspecified fees must read
// "Contact Club Secretariat" / "As determined by the Board", never BDT 0.

export interface MembershipCategory {
  slug: string;
  title: string;
  /** Value used in the nomination form's category select. */
  formValue: string;
  summary: string;
  /** Only set where the AOA states it. */
  votingRights?: string;
  generalMembership: boolean;
  /** Optional ribbon shown on cards and the category page. */
  badge?: string;
  /** Gives the card the full gold frame. */
  featured?: boolean;
  fees: {
    /** Short label shown on cards. */
    admissionLabel: string;
    /** Full amount shown on the category page; falls back to admissionLabel. */
    admissionAmount?: string;
    admissionDetail: string;
    subscriptionLabel: string;
    subscriptionDetail: string;
  };
  eligibility: string[];
  privileges: string[];
  restrictions: string[];
  byInvitation?: boolean;
}

const MIN_MEMBERSHIP_FEE_DETAIL =
  "Minimum membership fee stated at incorporation (Article 23). The Board of Directors may revise it upward through a resolution.";

const MIN_FEE_DETAIL =
  "Minimum admission fee stated at incorporation (Article 23). The Board of Directors may revise it upward through a resolution.";

export const MEMBERSHIP_FEE_NOTE =
  "Membership fees for General Membership categories represent the minimum amounts stated at incorporation in the Articles of Association. The Board of Directors may revise applicable fees through a resolution. Monthly subscriptions and other applicable charges are determined by the Board of Directors.";

export const MEMBERSHIP_CATEGORIES: MembershipCategory[] = [
  {
    slug: "donor-member",
    title: "Donor Membership",
    formValue: "Donor",
    badge: "Highest Tier",
    summary: "General Membership category with voting and election rights. No monthly subscription is payable.",
    votingRights: "Yes",
    generalMembership: true,
    fees: {
      admissionLabel: "From BDT 6,00,000",
      admissionDetail: MIN_FEE_DETAIL,
      subscriptionLabel: "No monthly subscription",
      subscriptionDetail: "Donor Members are exempt from monthly subscriptions."
    },
    eligibility: ["Admission is governed by the membership provisions of the Articles of Association."],
    privileges: ["General Membership with voting and election rights.", "Exempt from monthly subscriptions."],
    restrictions: []
  },
  {
    slug: "life-member",
    title: "Life Membership",
    formValue: "Life",
    badge: "Most Prestigious",
    featured: true,
    summary: "General Membership category with voting and election rights. No monthly subscription is payable.",
    votingRights: "Yes",
    generalMembership: true,
    fees: {
      admissionLabel: "From BDT 4,00,000",
      admissionAmount: "BDT 400,000/- (Four Hundred Thousand)",
      admissionDetail: MIN_MEMBERSHIP_FEE_DETAIL,
      subscriptionLabel: "No monthly subscription",
      subscriptionDetail: "Life Members are exempt from monthly subscriptions."
    },
    eligibility: [
      "Membership is governed by the membership provisions of the Articles of Association.",
      "Applicants may initially receive Temporary Membership for at least six months, subject to the provisions of the Articles of Association."
    ],
    privileges: [
      "No regular monthly subscription",
      "Full General Membership rights",
      "Voting rights",
      "Eligibility to contest elections subject to Articles",
      "Club facility access",
      "Family privileges",
      "Guest privileges",
      "Boating access",
      "Dining and recreation",
      "Member events",
      "Nominee/succession provisions"
    ],
    restrictions: []
  },
  {
    slug: "permanent-member",
    title: "Permanent Membership",
    formValue: "Permanent",
    badge: "Most Accessible",
    summary: "General Membership category with voting and election rights. Monthly subscription as prescribed by the Board of Directors.",
    votingRights: "Yes",
    generalMembership: true,
    fees: {
      admissionLabel: "From BDT 2,00,000",
      admissionAmount: "BDT 200,000/- (Two Hundred Thousand)",
      admissionDetail: MIN_MEMBERSHIP_FEE_DETAIL,
      subscriptionLabel: "As prescribed by the Board",
      subscriptionDetail: "Monthly subscription is applicable and is determined by the Board of Directors, who may increase or decrease it."
    },
    eligibility: [
      "Membership is governed by the membership provisions of the Articles of Association.",
      "Applicants may initially receive Temporary Membership for at least six months, subject to the provisions of the Articles of Association."
    ],
    privileges: [
      "Lower initial admission investment",
      "Full General Membership rights",
      "Voting rights",
      "Club facility access",
      "Boating access",
      "Guest privileges",
      "Family privileges",
      "Monthly subscription payable",
      "Dining and recreation",
      "Member events",
      "Option to upgrade to Life Membership subject to applicable rules",
      "Eligibility to contest elections subject to Articles",
      "Nominee/succession provisions"
    ],
    restrictions: []
  },
  {
    slug: "associate-member",
    title: "Associate Membership",
    formValue: "Associate",
    summary: "For children aged 21 or above of Donor, Life, or Permanent Members, sponsored by that member (up to two per member).",
    votingRights: "No",
    generalMembership: false,
    fees: {
      admissionLabel: "Contact Club Secretariat",
      admissionDetail: "As determined by the Board of Directors.",
      subscriptionLabel: "As prescribed by the Board",
      subscriptionDetail: "As determined by the Board of Directors."
    },
    eligibility: [
      "Children aged 21 or above of a Donor, Life, or Permanent Member.",
      "A Donor, Life, or Permanent Member may sponsor up to two children."
    ],
    privileges: [],
    restrictions: [
      "Cannot vote, propose, second, or hold office.",
      "The sponsoring member is responsible for the Associate Member's dues."
    ]
  },
  {
    slug: "diplomat-member",
    title: "Diplomat Membership",
    formValue: "Diplomat",
    summary: "For diplomats holding the rank of First Secretary or above in a foreign mission accredited to Bangladesh.",
    generalMembership: false,
    fees: {
      admissionLabel: "Complimentary",
      admissionDetail: "No admission fee.",
      subscriptionLabel: "Complimentary",
      subscriptionDetail: "No monthly subscription."
    },
    eligibility: ["Diplomats holding the rank of First Secretary or above in a foreign mission accredited to Bangladesh."],
    privileges: ["Exempt from admission fee and monthly subscription."],
    restrictions: ["Membership ends when the diplomat's posting concludes."]
  },
  {
    slug: "foreign-member",
    title: "Foreign Membership",
    formValue: "Foreign",
    summary: "For individuals not permanently residing in Bangladesh. Valid for one year, renewable up to a maximum of five years.",
    votingRights: "No",
    generalMembership: false,
    fees: {
      admissionLabel: "Contact Club Secretariat",
      admissionDetail: "Not specified in the Articles of Association; refer to the Board of Directors.",
      subscriptionLabel: "Contact Club Secretariat",
      subscriptionDetail: "Not specified in the Articles of Association; refer to the Board of Directors."
    },
    eligibility: ["Individuals not permanently residing in Bangladesh."],
    privileges: ["Enjoys the facilities available to Permanent Members."],
    restrictions: [
      "Cannot vote, propose, second, or hold office.",
      "Membership is valid for one year and renewable up to a maximum of five years."
    ]
  },
  {
    slug: "corporate-member",
    title: "Corporate Membership",
    formValue: "Corporate",
    summary: "For private and public limited companies, which may nominate up to three senior representatives.",
    generalMembership: false,
    fees: {
      admissionLabel: "Contact Club Secretariat",
      admissionDetail: "As determined by the Board of Directors.",
      subscriptionLabel: "As prescribed by the Board",
      subscriptionDetail: "Monthly subscription as prescribed by the Board of Directors."
    },
    eligibility: ["Private and public limited companies."],
    privileges: ["Each company may nominate up to three senior representatives through a Board Resolution."],
    restrictions: [
      "Minimum membership period of one year.",
      "The company is responsible for the dues of its nominees."
    ]
  },
  {
    slug: "honorary-member",
    title: "Honorary Membership",
    formValue: "Honorary",
    summary: "Granted by invitation of the Board of Directors to distinguished individuals.",
    generalMembership: false,
    byInvitation: true,
    fees: {
      admissionLabel: "Complimentary",
      admissionDetail: "No admission fee.",
      subscriptionLabel: "Complimentary",
      subscriptionDetail: "No monthly subscription."
    },
    eligibility: ["Distinguished individuals, by invitation of the Board of Directors."],
    privileges: ["Exempt from admission fee and monthly subscription."],
    restrictions: ["The number of Honorary Members cannot exceed 10% of the total General Members."]
  }
];

export const MEMBERSHIP_RULES: { title: string; points: string[] }[] = [
  {
    title: "Monthly Subscription Exemption",
    points: [
      "Donor and Life Members are exempt from monthly subscriptions.",
      "Members aged 65 or above may apply for monthly subscription exemption by submitting a written application supported by proof of age."
    ]
  },
  {
    title: "Membership Upgrade",
    points: [
      "Members may apply to upgrade to a higher membership category by paying the difference between the applicable prevailing admission fees.",
      "Downgrading is not permitted."
    ]
  },
  {
    title: "Refund Policy",
    points: ["Confirmed membership admission fees are non-refundable, except where otherwise expressly provided in the Articles of Association."]
  },
  {
    title: "Family Membership",
    points: [
      "Founding Members who complete ten years of continuous membership in good standing may nominate up to two family members under the special provision in Article 21, at the applicable membership rate."
    ]
  }
];

export function getMembershipCategory(slug: string): MembershipCategory | undefined {
  return MEMBERSHIP_CATEGORIES.find(c => c.slug === slug);
}
