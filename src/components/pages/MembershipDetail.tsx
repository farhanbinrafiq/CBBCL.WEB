import React from "react";
import { RoutePath } from "../../types";
import { 
  Award, ShieldCheck, Check, Key, ClipboardList, HelpCircle, ArrowLeft, ArrowRight, DollarSign, Users, Scale, FileText
} from "lucide-react";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";

interface MembershipDetailProps {
  categorySlug: string;
  navigate: (path: RoutePath) => void;
}

interface DetailInfo {
  name: string;
  badge: string;
  prestigeDesc: string;
  overview: {
    purpose: string;
    hierarchy: string;
    prestige: string;
  };
  eligibility: {
    who: string;
    requirements: string[];
    criteria: string;
  };
  benefits: string[];
  fees: {
    admission: string;
    annual: string;
    other?: string;
  };
  process: string[];
  rules: string[];
}

const MEMBERSHIP_DETAILS: Record<string, DetailInfo> = {
  "life-member": {
    name: "Life Membership",
    badge: "Cox's Bazar Boat Club Limited",
    prestigeDesc: "The pinnacle of lifelong private residency and absolute voting power.",
    overview: {
      purpose: "Established for select leaders seeking to permanently integrate their legacy with CBBCL.",
      hierarchy: "Ranked as the highest standard membership class with full sovereign voting rights in all general meetings.",
      prestige: "Outstanding prestige with a physical gold-engraved ledger entry reserved for premier commercial and advisory operators."
    },
    eligibility: {
      who: "Dignified citizens, founders, corporate directors, and prominent stakeholders over the age of 30.",
      requirements: [
        "Endorsement by two voting club members in excellent ledger standing (Life/Donor).",
        "Clear professional compliance record and verified credentials.",
        "Submission of complete business portfolio or public sector service bio."
      ],
      criteria: "Requires personal committee induction and physical meeting with Founding President Humayun Kabir Robel."
    },
    benefits: [
      "Permanent, non-expiring club entry for member, spouse, and kids under 21.",
      "Absolute voting franchise rights in all club assemblies & annual elections.",
      "Priority access to private marina berths and luxury club yacht charters.",
      "Full reciprocal alliances and guest privileges in associated premium clubs worldwide.",
      "No annual subscription charges for the lifetime of the member.",
      "Complimentary access to boardroom reserves and ocean-view executive suites (3 slot reserves per annum)."
    ],
    fees: {
      admission: "BDT 1,500,000 (One-time dynamic invitation)",
      annual: "Exempted (Lifelong subscription waive)",
      other: "Optional marina docking fees apply per yacht category."
    },
    process: [
      "Submit formal registry nomination portfolio.",
      "Technical background screening by Verification Committee.",
      "Physical tea panel interview and reference feedback check.",
      "Formal board notification and issuance of credential insignia."
    ],
    rules: [
      "Adherence to CBBCL core bylaws, code of honor, and maritime rules.",
      "Proper code of conduct in private lounges, yacht decks, and beach tracks.",
      "Responsibilities to recommend subsequent candidates with equivalent professional caliber."
    ]
  },
  "donor-member": {
    name: "Donor Membership",
    badge: "Cox's Bazar Boat Club Limited",
    prestigeDesc: "A sovereign tier honoring elite contributors to physical assets & structural development.",
    overview: {
      purpose: "Dedicated to visionary sponsors directly contributing assets, land, or boats to CBBCL's early marine architecture.",
      hierarchy: "Positions contributors as founding sponsors with immediate permanent voting rights and honorary deck status.",
      prestige: "Ultimate philanthropic recognition. Name permanently cast onto the harbor bronze memorial."
    },
    eligibility: {
      who: "Industrialists, key foundations, and maritime logistics operators contributing BDT 2.5M+ value or specific asset equivalencies.",
      requirements: [
        "Unilateral authorization or invitation from the Founding Board.",
        "Formal transfer of real estate title, premium vessels, or direct development sponsorship.",
        "Good standing in nationwide commercial registries."
      ],
      criteria: "Invitation-only, finalized directly by the Executive Committee."
    },
    benefits: [
      "Immediate permanent membership privileges valid across three generations.",
      "Full voting and advisory power on the development board.",
      "Vessel anchoring priority inside CBBCL core shipyard with waived basic host fees.",
      "Exclusive access to VIP launch suites and priority reservation on marine festivals."
    ],
    fees: {
      admission: "BDT 2,500,000 (Asset / Land equivalent support value)",
      annual: "Exempted permanently",
      other: "Major asset maintenance is handled via shared club harbor budgets."
    },
    process: [
      "Submit asset contribution or sponsorship prospectus.",
      "Appraisal assessment by Club Valuations committee.",
      "Review by Board of Directors & Founding President.",
      "Sponsorship ceremony and official ledger registry onboarding."
    ],
    rules: [
      "Ensuring transfer of assets meets compliance benchmarks.",
      "Respecting code of conduct and acting as an ambassador of CBBCL development initiatives.",
      "Compliance with international marine transport and Bangladesh eco-waterways statutes."
    ]
  },
  "permanent-member": {
    name: "Permanent Membership",
    badge: "Cox's Bazar Boat Club Limited",
    prestigeDesc: "Our cornerstone tier designated for established leaders, advocates, and senior merchants.",
    overview: {
      purpose: "Constructed for corporate executives, civil professionals, and senior merchants to anchor their recreational base.",
      hierarchy: "Standard voting class of elite members over the age of 35.",
      prestige: "Highly respected standard, highly selective admission quota restricted to 200 slots per fiscal cycle."
    },
    eligibility: {
      who: "Leaders, tech executives, legal practitioners, and business directors with at least 8 years of professional footprint.",
      requirements: [
        "Age 35 or above at the time of submitting application.",
        "Nomination proposer credentials from an active CBBCL Life or Founder member.",
        "Active taxpayer certification and professional license verify."
      ],
      criteria: "Admissions interview conducted by the Membership Committee."
    },
    benefits: [
      "Complete access to tennis fields, boat storage, infinity pools, and dining rooms.",
      "Voting eligibility after 1 year of continuous active profile status.",
      "Spousal and junior entry access to all weekly social events.",
      "Preferential seating at nautical conferences and classical performance dinners."
    ],
    fees: {
      admission: "BDT 800,000 (Onboarding Tariff)",
      annual: "BDT 50,000 (Annually recurring subscription)",
      other: "Standard consumable minimums apply under club bylaws."
    },
    process: [
      "Registry proposal form submission with proposer signatures.",
      "Evaluation of commercial footprint by scrutiny managers.",
      "Interview session with admissions panel directors.",
      "Induction notice sent after final approval vote."
    ],
    rules: [
      "Prompt settlement of quarterly club bills by the 10th of respective month.",
      "Compliance with smart-casual dress code across core dining spaces.",
      "Supervision of accompanied guests under formal member responsibility."
    ]
  },
  "associate-member": {
    name: "Associate Membership",
    badge: "Cox's Bazar Boat Club Limited",
    prestigeDesc: "The premier portal for emerging young professionals, startup teams, and coastal scholars.",
    overview: {
      purpose: "Designed to groom the next generation of maritime pioneers, tech executives, and young entrepreneurs.",
      hierarchy: "Non-voting status representing emerging professionals under 35. Automatic conversion to Permanent category occurs at age 35.",
      prestige: "Highly active young networkers, fostering rapid career development and waterfront lifestyle."
    },
    eligibility: {
      who: "Young executives, tech founders, academic lecturers, and creative experts between 21 and 35 years old.",
      requirements: [
        "Valid proof of corporate attachment / startup registry.",
        "Endorsement by at least one voting club member (Permanent rank or above).",
        "Keen interest in marine sports, sailing, or beach volleyball development."
      ],
      criteria: "Youth board review and educational qualification match."
    },
    benefits: [
      "Full entry rights to gyms, beach cafes, sailing schools, and game zones.",
      "Significant discount on certified yacht rowing and sailing licensing courses.",
      "Invitation to executive startup roundtables and tech maritime forums.",
      "Flexible payment modes for onboarding tariffs."
    ],
    fees: {
      admission: "BDT 400,000 (Discounted onboarding track)",
      annual: "BDT 25,000 (Annually recurring subscription)",
      other: "Waived consumable minimums for first two years."
    },
    process: [
      "Submit digital proposal packet with birth certificate verify.",
      "Rapid resume vetting by Youth Admissions Committee.",
      "Informal meet & greet dialogue with club secretariat.",
      "Official Associate card dispatch."
    ],
    rules: [
      "Mandatory conversion of category to Permanent Membership upon reaching 35.",
      "Respecting senior voting members and compliance with yacht safety drills.",
      "Active enrollment in at least one club sports or social guild."
    ]
  },
  "corporate-member": {
    name: "Corporate Membership",
    badge: "Cox's Bazar Boat Club Limited",
    prestigeDesc: "Empowering reputable corporations to extend recreational limits to their executive board.",
    overview: {
      purpose: "Tailored for businesses, international consulates, and financial houses to secure premium leisure for board members.",
      hierarchy: "Enables nominate slots for up to three top-tier executives. Slots are transferable with board clearance.",
      prestige: "Corporate prestige aligning your company's entertainment framework with Cox's Bazar's finest club network."
    },
    eligibility: {
      who: "Reputable listed companies, multinationals, and established partnerships with robust capitalization.",
      requirements: [
        "Submission of trade license, audited financial statement, and board resolution.",
        "Formal nomination letters signed by the Chairman or Chief Executive.",
        "Vetting of individual nominees by our Scrutiny directors."
      ],
      criteria: "Corporate profile screening and financial health review."
    },
    benefits: [
      "Simultaneous full membership privileges for up to 3 executive nominees.",
      "Transfer/change nominee names with minor processing fees upon executive shifts.",
      "Complimentary venue reservation for corporate retreats once per annum (up to 100 pax).",
      "Priority group bookings for water sports tournaments and beach pavilions."
    ],
    fees: {
      admission: "BDT 2,000,000 (Three-slot package)",
      annual: "BDT 120,000 (Consolidated corporate subscription fee)",
      other: "Consumables invoiced to consolidated corporate account monthly."
    },
    process: [
      "Submit corporate registry portfolio and nominee details.",
      "Verification of corporate legal status and commercial reputation.",
      "Joint overview meeting with core secretariat officials.",
      "Credential delivery to the nominating headquarters."
    ],
    rules: [
      "Nominees must maintain CBBCL decorum; corporate entity is co-responsible for nominees.",
      "Nominee names must be updated in writing at least 30 days before name change.",
      "Prompt corporate wire transfer for dues settlement under club accounting rules."
    ]
  },
  "honorary-member": {
    name: "Honorary Membership",
    badge: "Cox's Bazar Boat Club Limited",
    prestigeDesc: "Distinguished title conferred unilaterally to outstanding national and global heroes.",
    overview: {
      purpose: "Honors citizens who have achieved exceptional feats in maritime sports, marine biology, or national security.",
      hierarchy: "Elite non-voting class of distinction, holding high privilege advisory deck positions.",
      prestige: "Extraordinary prestige, limited to only 25 living individuals across club registry history."
    },
    eligibility: {
      who: "Retired military commanders, global oceanographers, Olympic sailors, and internationally recognized scholars.",
      requirements: [
        "Unilateral invitation proposal by the Founding President or Board of Directors.",
        "No self-application is processed; awarded strictly via merit nomination.",
        "Written acceptance of the honorary insignia by the nominee."
      ],
      criteria: "Conferred exclusively by the board of trustees upon strategic consensus."
    },
    benefits: [
      "Complete life access to all club zones, yachts, and premium private halls.",
      "Waived entry and subscription fees in perpetuity.",
      "Advisory panel seats in marine conservation boards.",
      "Chief Guest invitation to CBBCL Annual Sailing Regatta."
    ],
    fees: {
      admission: "Exempted (Conferred Merit award)",
      annual: "Exempted permanently",
      other: "N/A"
    },
    process: [
      "Internal board nomination of candidates.",
      "Review of contributions by Board of Trustees.",
      "Formulation of resolution signed by Supporting Founders.",
      "Formal induction banquet ceremony."
    ],
    rules: [
      "Compliance with high standards of public reputation.",
      "Advisory guidance on club sports/marine policies when requested.",
      "Ambassadorship of CBBCL during public maritime events."
    ]
  }
};

export default function MembershipDetail({ categorySlug, navigate }: MembershipDetailProps) {
  // Normalize the slug
  const slug = categorySlug.toLowerCase().replace(/_/, "-");
  const detail = MEMBERSHIP_DETAILS[slug] || MEMBERSHIP_DETAILS["life-member"];

  const handleApplyClick = () => {
    window.location.href = "https://registration.coxsbazarboatclubltd.com/";
  };

  return (
    <div className="bg-bg-primary min-h-screen pb-20">
      {/* Editorial Page Header */}
      <section className="relative h-64 bg-navy flex items-center justify-center overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 w-full h-full">
          <BackgroundVideo
            src={MASTER_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 overflow-hidden">
          <p className="font-sans text-[10px] tracking-[0.25em] text-gold uppercase font-semibold">
            {detail.badge}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extralight text-white tracking-tight break-words whitespace-normal leading-tight">
            {detail.name} <span className="font-serif italic text-gold font-normal">Registry Details</span>
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <button onClick={() => navigate("/membership")} className="hover:text-gold transition-colors">Membership Guild</button>
            <span>&gt;</span>
            <span className="text-gold font-mono">{detail.name}</span>
          </div>
        </div>
      </section>

      {/* Main Core View Area */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Link */}
        <button
          onClick={() => navigate("/membership")}
          className="group inline-flex items-center space-x-2 text-xs font-sans uppercase font-bold tracking-widest text-[#1a2744] hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Categories list</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: Detail Sections (Content heavy, Premium Typography) */}
          <div className="lg:col-span-8 space-y-10 bg-white border border-slate-150 p-6 md:p-8 rounded-sm shadow-sm">
            
            {/* HERO INTRODUCTION */}
            <div className="space-y-3 pb-6 border-b border-slate-100">
              <span className="text-[10px] font-mono uppercase text-navy tracking-widest bg-navy/5 px-2.5 py-1 rounded w-fit inline-block">
                Cox’s Bazar Boat Club Limited
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-light text-text-dark">
                {detail.name}
              </h2>
              <p className="font-sans text-sm text-[#a8873a] font-semibold tracking-wide italic">
                "{detail.prestigeDesc}"
              </p>
            </div>

            {/* SECTION 1: OVERVIEW */}
            <div className="space-y-3">
              <h3 className="font-display text-lg font-bold text-text-dark flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
                <span>Overview & Club Placement</span>
              </h3>
              <div className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed space-y-3 pt-1">
                <p><strong>Primary Purpose:</strong> {detail.overview.purpose}</p>
                <p><strong>Bylaws Hierarchy Placement:</strong> {detail.overview.hierarchy}</p>
                <p><strong>Prestige Level Description:</strong> {detail.overview.prestige}</p>
              </div>
            </div>

            {/* SECTION 2: ELIGIBILITY */}
            <div className="space-y-3 pt-2">
              <h3 className="font-display text-lg font-bold text-text-dark flex items-center space-x-2">
                <Scale className="w-5 h-5 text-gold shrink-0" />
                <span>Eligibility & Requirements</span>
              </h3>
              <div className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed space-y-4 pt-1">
                <p><strong>Who can apply:</strong> {detail.eligibility.who}</p>
                
                <div className="space-y-1.5 pl-1">
                  <span className="font-bold text-navy block text-[11px] uppercase tracking-wider">Mandatory Requirements:</span>
                  <ul className="space-y-2">
                    {detail.eligibility.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="bg-amber-50 text-gold font-sans font-bold text-[10px] rounded-full w-4.5 h-4.5 flex items-center justify-center shrink-0 border border-gold/30 mt-0.5">
                          ✓
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p><strong>Screening Criteria:</strong> {detail.eligibility.criteria}</p>
              </div>
            </div>

            {/* SECTION 3: PRIVILEGES & BENEFITS */}
            <div className="space-y-3 pt-2">
              <h3 className="font-display text-lg font-bold text-text-dark flex items-center space-x-2">
                <Key className="w-5 h-5 text-gold shrink-0" />
                <span>Membership Privileges & Benefits</span>
              </h3>
              <div className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed pt-1">
                <p className="mb-3">Nominees approved by the board receive full access to the yacht harbors and recreational structures, following core club guidelines:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
                  {detail.benefits.map((benefit, idx) => (
                    <li key={idx} className="bg-slate-50 p-2.5 border border-slate-100 rounded flex space-x-2 items-start">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SECTION 4: FEES STRUCTURE */}
            <div className="space-y-3 pt-2">
              <h3 className="font-display text-lg font-bold text-text-dark flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-gold shrink-0" />
                <span>Fees & Capital Contributions</span>
              </h3>
              <div className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed pt-1">
                <div className="border border-amber-100 bg-amber-50/20 p-4 rounded-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Admission/Onboarding Fee</span>
                    <span className="text-navy font-display text-lg font-bold block mt-1">{detail.fees.admission}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Annual Subscription Dues</span>
                    <span className="text-gold-dark font-display text-lg font-bold block mt-1">{detail.fees.annual}</span>
                  </div>
                </div>
                {detail.fees.other && (
                  <p className="text-[11px] text-slate-450 mt-3 italic">
                    * {detail.fees.other}
                  </p>
                )}
              </div>
            </div>

            {/* SECTION 5: APPLICATION PROCESS */}
            <div className="space-y-3 pt-2">
              <h3 className="font-display text-lg font-bold text-text-dark flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-gold shrink-0" />
                <span>Technical Application Steps</span>
              </h3>
              <div className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                  {detail.process.map((step, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 border border-slate-100 rounded text-center relative space-y-1.5">
                      <div className="bg-navy text-gold text-[10px] font-sans font-bold w-6 h-6 rounded-full flex items-center justify-center mx-auto">
                        0{idx + 1}
                      </div>
                      <p className="text-[11px] font-semibold text-text-dark leading-tight">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 6: RULES & RESPONSIBILITIES */}
            <div className="space-y-3 pt-2">
              <h3 className="font-display text-lg font-bold text-text-dark flex items-center space-x-2">
                <Scale className="w-5 h-5 text-gold shrink-0" />
                <span>Bylaws & Conduct Responsibilities</span>
              </h3>
              <div className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed pt-1">
                <ul className="space-y-2 list-disc list-inside pl-2 text-slate-600 font-normal">
                  {detail.rules.map((rule, idx) => (
                    <li key={idx} className="leading-relaxed">{rule}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* RIGHT COL: CTA Panel card */}
          {categorySlug !== "honorary-member" ? (
            <aside className="lg:col-span-4 bg-navy text-white border border-navy-light p-6 rounded-sm sticky top-6 text-center space-y-5">
              <div className="p-3 bg-white/5 rounded-full border border-white/10 text-gold w-fit mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="font-sans text-[9px] text-gold uppercase tracking-[0.25em] font-bold block">
                  Registry Admission Entrance
                </span>
                <h3 className="font-display text-lg font-light tracking-tight text-white">
                  Nomination Application
                </h3>
                <p className="font-sans text-[11px] text-slate-350 leading-relaxed font-light">
                  All applications are carefully evaluated by the verification committee. Start your nomination process online.
                </p>
              </div>

              <button
                onClick={handleApplyClick}
                className="w-full py-3.5 bg-gold text-navy hover:bg-white text-xs font-sans font-extrabold uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>Apply for Nomination</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-4 border-t border-white/10 text-[10px] font-sans text-slate-400 space-y-1">
                <p>Proposers required: 2 active voters</p>
                <p>Status flow reviews average: 7 business days</p>
              </div>
            </aside>
          ) : (
            <aside className="lg:col-span-4 bg-slate-50 text-text-dark border p-6 rounded-sm sticky top-6 text-center space-y-5">
              <div className="p-3 bg-navy/5 rounded-full border border-navy/10 text-gold w-fit mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="font-sans text-[9px] text-gold uppercase tracking-[0.25em] font-bold block">
                  Conferred Title Class
                </span>
                <h3 className="font-display text-lg font-light tracking-tight text-text-dark animate-pulse">
                  Unilateral Merit Invitation
                </h3>
                <p className="font-sans text-[11px] text-slate-500 leading-relaxed font-light">
                  Honorary members are introduced exclusively via board invitation under the recommendation of Founding President Humayun Kabir Robel.
                </p>
              </div>

              <div className="bg-amber-50 p-4 border border-amber-100 rounded text-xs text-amber-900 font-sans italic">
                "Nomination form registration is closed for this honorary merit class."
              </div>
            </aside>
          )}

        </div>
      </div>
    </div>
  );
}
