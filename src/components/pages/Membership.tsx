import React, { useState } from "react";
import { Award, Check, ShieldCheck, HelpCircle, ArrowRight, UserPlus, FileText } from "lucide-react";
import { motion } from "motion/react";
import { RoutePath } from "../../types";
import { getMembershipApplications, saveMembershipApplications } from "../../utils/memberStorage";
import { getPageContent } from "../../utils/cmsStorage";
import { MASTER_HERO_VIDEO } from "../../data";

interface MembershipProps {
  navigate: (path: RoutePath) => void;
}

export default function Membership({ navigate }: MembershipProps) {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    category: "Permanent",
    dob: "",
    org: "",
    designation: "",
    phone: "",
    proposerCode: "",
    seconderCode: ""
  });

  const [cmsPage] = useState(getPageContent());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.phone) {
      const currentList = getMembershipApplications();
      const newAppId = "app-" + Date.now();
      const newApp = {
        id: newAppId,
        fullName: formData.fullName,
        email: `${formData.fullName.toLowerCase().replace(/ +/g, ".")}@example.com`,
        phone: formData.phone,
        membershipType: formData.category + " Membership",
        motivation: `Nomination proposing request submitted through web portal. Proposer Code: ${formData.proposerCode || "Under Committee Review"}, Seconder Code: ${formData.seconderCode || "Under Committee Review"}.`,
        organization: formData.org || "Zenith Enterprise",
        designation: formData.designation || "Director",
        dob: formData.dob || "Not specified",
        status: "pending" as const,
        submittedAt: new Date().toISOString()
      };
      saveMembershipApplications([...currentList, newApp]);

      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          fullName: "",
          category: "Permanent",
          dob: "",
          org: "",
          designation: "",
          phone: "",
          proposerCode: "",
          seconderCode: ""
        });
      }, 5000);
    }
  };

  const categories = cmsPage.membership.categories || [
    { title: "Donor Membership", desc: "Reserved for elite supporters directly contributing land dev, boats, or critical physical assets towards the early founding architecture of CBBCL.", voters: "Yes, immediately", fee: "On Enquiry" },
    { title: "Life Membership", desc: "Designed for individuals looking to lock in permanent residency with lifelong voting rights, club locker reserves, and full reciprocal privileges.", voters: "Yes, fully", fee: "Select Invitation" },
    { title: "Permanent Membership", desc: "Our cornerstone tier designated for corporate chairpersons, military advisors, legal advocates, and senior merchants over the age of 35.", voters: "Yes, fully", fee: "Standard Tariffs" },
    { title: "Associate Membership", desc: "Customized young professional portal for emerging coastal entrepreneurs, tech managers, and executives under the age of 35.", voters: "No (Conversion at 35)", fee: "Discounted Tariffs" },
    { title: "Diplomat Membership", desc: "Open to certified representatives of international consular services, United Nations staff, and foreign delegates in Bangladesh.", voters: "No", fee: "Special Exemption" },
    { title: "Foreign Membership", desc: "Available exclusively to non-resident foreign nationals of distinction involved in international maritime channels and commercial trade.", voters: "No", fee: "Special Tariffs" },
    { title: "Corporate Membership", desc: "Empowers reputable companies to nominate up to three of their executive directors or board members for full recreational utility.", voters: "No (Corporate slots)", fee: "Corporate Matrix" },
    { title: "Honorary Membership", desc: "Conferred exclusively by the unilateral invite of our Board of Directors to distinguished citizens, scientists, or retired military top-brass.", voters: "No", fee: "Fully Exempted" }
  ];

  const eligibilitySteps = cmsPage.membership.eligibilitySteps || [
    { title: "Foundational Proposing Nomination", text: "Applicants must find a valid, voting CBBCL Proposer (either Founder, Donor, or Life status) who formally endorses the profile." },
    { title: "Secondary Endorsement Seconder", text: "A secondary current club member of good standing must endorse as a Secondee, signing off on the official physical ledger." },
    { title: "Scrutiny Committee Evaluation", text: "The candidate's profile, including commercial compliance, and legal status is reviewed in a series of board scrutiny sessions." },
    { title: "Founders Induction Tea Panel", text: "Approved applications culminates in a personal panel meet with Founding President Humayun Kabir Robel to finalize the onboarding insignia." }
  ];

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Editorial Page Header */}
      <section className="relative h-72 bg-navy flex items-center justify-center overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
            src={MASTER_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-3">
          <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Ltd.
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extralight text-white tracking-tight">
            {cmsPage.membership.title || "Club Registry & Membership Privileges"}
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gold">Membership Guild</span>
          </div>
        </div>
      </section>

      {/* Intro Context */}
      <section className="py-16 bg-white border-b border-slate-100 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <span className="font-sans text-[9px] uppercase tracking-widest text-gold font-semibold">
            The Admissions Ledger
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-light text-text-dark tracking-tight">
            A Distinct Alignment of South Asian Pioneers
          </h2>
          <p className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed">
            {cmsPage.membership.preamble || "By joining Cox's Bazar Boat Club Limited, you align your family and corporate lifestyle with Bangladesh's outstanding leaders. Access elegant oceanfront ballrooms, premium beach sports fields, and enjoy full reciprocal privileges with historic private clubs across South Asia."}
          </p>
        </div>
      </section>

      {/* Grid of 8 distinct Membership Categories */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <span className="font-sans text-[9px] uppercase tracking-widest text-[#1a2744] font-semibold block">
              Structure & Tiers
            </span>
            <h3 className="font-display text-2xl md:text-4xl font-light text-text-dark text-center">
              The Eight Primary <span className="font-serif italic text-gold font-normal">Privilege Tiers</span>
            </h3>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {categories.map((cat, idx) => {
              const isLife = cat.title === "Life Membership";
              return (
                <div
                  key={idx}
                  className={`bg-white p-6 rounded-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative ${
                    isLife 
                      ? "border-2 border-gold md:scale-105 z-15 shadow-md shadow-gold/20 h-[360px]" 
                      : "border border-slate-150/60 h-[350px]"
                  }`}
                >
                  {isLife && (
                    <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white font-sans text-[8px] font-extrabold uppercase tracking-widest px-3 py-1 rounded shadow-md border border-amber-600 inline-block whitespace-nowrap z-20">
                      👑 MOST PRESTIGIOUS
                    </span>
                  )}
                  
                  <div className="space-y-3">
                    <div className="bg-bg-secondary p-1.5 w-8 -mt-2 -ml-2 rounded-br-sm border-r border-b border-gold/40 text-center">
                      <span className="font-sans font-bold text-navy text-[10px]">{idx + 1}</span>
                    </div>
                    <h4 className="font-display text-[15px] font-bold text-text-dark leading-tight">{cat.title}</h4>
                    <p className="font-sans text-[11px] text-text-body leading-relaxed font-light line-clamp-4">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-auto pt-3 space-y-3">
                    <div className="border-t border-slate-50 pt-2 space-y-1 text-[9px] font-sans text-text-light">
                      <div className="flex justify-between">
                        <span>Voting Rights:</span>
                        <span className="text-navy font-semibold">{cat.voters}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Onboarding Fee:</span>
                        <span className="text-gold font-semibold">{cat.fee}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const slug = cat.title.toLowerCase().replace(/ +/g, "-").replace("-membership", "-member");
                        navigate(`/membership/${slug}.html`);
                      }}
                      className={`w-full py-2 text-center font-sans text-[9px] font-extrabold uppercase tracking-widest transition-colors border rounded-none ${
                        isLife
                          ? "bg-gold text-navy border-gold hover:bg-navy hover:text-white"
                          : "bg-navy text-white border-navy hover:bg-gold hover:text-navy hover:border-gold"
                      }`}
                    >
                      Read Full Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Eligibility accordion */}
      <section className="py-20 px-6 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Eligibility Steps (Left Side) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <span className="font-sans text-[9px] uppercase tracking-widest text-gold font-semibold block">
                Verification Ledger
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-light text-text-dark">
                The Four Pillars of <span className="font-serif italic font-normal text-gold">Admissions Endorsement</span>
              </h3>
              <p className="font-sans text-xs text-text-body font-light leading-relaxed">
                As a fully integrated private institution, all applicants must follow our verified onboarding roadmap:
              </p>
            </div>

            <div className="space-y-4">
              {eligibilitySteps.map((step, idx) => (
                <div key={idx} className="flex space-x-4 items-start pb-4 border-b border-slate-100 last:border-0">
                  <div className="bg-navy text-gold font-sans font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-sm font-semibold text-text-dark">{step.title}</h4>
                    <p className="font-sans text-[11px] text-text-body font-light leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Area (Right Side) */}
          <div className="lg:col-span-6 bg-slate-50/70 p-6 md:p-8 border border-slate-200 rounded-sm shadow-inner">
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-gold">
                <FileText className="w-5 h-5" />
                <span className="font-sans text-[10px] uppercase font-bold tracking-widest mt-0.5">
                  Registry Nomination Portal
                </span>
              </div>
              <h3 className="font-display text-xl text-text-dark font-semibold">
                Nomination Proposal Request
              </h3>
              <p className="font-sans text-[11px] text-slate-500 font-light leading-relaxed">
                If you do not have current proposer references, the Scrutiny Committee may grant temporary clearance upon corporate profile review.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans rounded-md text-center">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-semibold text-sm mb-1">Proposal Dispatched Successfully!</p>
                <p>An official club prospectus and application packet is dispatched to your office. Verification starts immediately.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 px-3 py-2 text-xs focus:ring-1 focus:ring-gold outline-none transition-all"
                    placeholder="e.g., Saifuddin Khaled Robel"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Category Preferred *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 px-3 py-2 text-xs outline-none focus:border-gold"
                    >
                      <option>Donor</option>
                      <option>Life</option>
                      <option>Permanent</option>
                      <option>Associate</option>
                      <option>Corporate</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 px-3 py-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Organization *
                    </label>
                    <input
                      type="text"
                      required
                      name="org"
                      value={formData.org}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 px-3 py-2 text-xs focus:border-gold outline-none"
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Designation *
                    </label>
                    <input
                      type="text"
                      required
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 px-3 py-2 text-xs focus:border-gold outline-none"
                      placeholder="Corporate Title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Proposer Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="proposerCode"
                      value={formData.proposerCode}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 px-3 py-2 text-xs focus:border-gold outline-none font-mono"
                      placeholder="CBBCL-FOUNDER-XXX"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Telephone/Phone *
                    </label>
                    <input
                      type="text"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 px-3 py-2 text-xs focus:border-gold outline-none"
                      placeholder="e.g. +880 1711223344"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1a2744] hover:bg-gold hover:text-navy text-white text-xs font-sans font-semibold uppercase tracking-widest transition-all mt-4"
                >
                  Confirm and Dispatch Nomination Request
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
