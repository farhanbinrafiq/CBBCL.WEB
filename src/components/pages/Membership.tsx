import React, { useState, useEffect } from "react";
import { Award, Check, ShieldCheck, HelpCircle, ArrowRight, UserPlus, FileText } from "lucide-react";
import { motion } from "motion/react";
import { RoutePath } from "../../types";
import { getMembershipApplications, saveMembershipApplications } from "../../utils/memberStorage";
import { getPageContent } from "../../utils/cmsStorage";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";
import { MEMBERSHIP_DETAILS } from "./MembershipDetail";

// Strips the parenthetical note from a fee string, e.g. "BDT 800,000 (Onboarding Tariff)" -> "BDT 800,000"
function formatEntryFee(admission: string): string {
  return admission.split(" (")[0];
}

// "Exempted..." -> "No Annual Fee"; otherwise strips parenthetical and appends "/yr"
function formatAnnualFee(annual: string): string {
  if (annual.toLowerCase().startsWith("exempt")) return "No Annual Fee";
  return `${annual.split(" (")[0]}/yr`;
}

interface MembershipProps {
  navigate: (path: RoutePath) => void;
}

export default function Membership({ navigate }: MembershipProps) {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const nominationFormRef = React.useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "Permanent",
    dob: "",
    org: "",
    designation: "",
    phone: "",
    facebookLink: "",
    linkedinLink: "",
    websiteLink: "",
    proposerCode: "",
    seconderCode: ""
  });

  const [cmsPage] = useState(getPageContent());

  useEffect(() => {
    if (window.location.hash === "#nomination-form") {
      nominationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToNominationForm = () => {
    nominationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.facebookLink || !formData.linkedinLink) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/membership/nominate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to send nomination request.");
      }

      const currentList = getMembershipApplications();
      const newAppId = "app-" + Date.now();
      const newApp = {
        id: newAppId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        membershipType: formData.category + " Membership",
        motivation: `Nomination proposing request submitted through web portal. Proposer Code: ${formData.proposerCode || "Under Committee Review"}, Seconder Code: ${formData.seconderCode || "Under Committee Review"}. Facebook: ${formData.facebookLink}, LinkedIn: ${formData.linkedinLink}${formData.websiteLink ? `, Website: ${formData.websiteLink}` : ""}.`,
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
          email: "",
          category: "Permanent",
          dob: "",
          org: "",
          designation: "",
          phone: "",
          facebookLink: "",
          linkedinLink: "",
          websiteLink: "",
          proposerCode: "",
          seconderCode: ""
        });
      }, 5000);
    } catch (error: any) {
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
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
          <BackgroundVideo
            src={MASTER_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 overflow-hidden">
          <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Ltd.
          </p>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extralight text-white tracking-tight break-words whitespace-normal leading-tight">
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
          <div className="pt-2">
            <button
              onClick={scrollToNominationForm}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gold text-navy hover:bg-navy hover:text-white font-sans text-xs font-extrabold uppercase tracking-widest transition-all shadow-md cursor-pointer"
            >
              <span>Interested in Membership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
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
              const slug = cat.title.toLowerCase().replace(/ +/g, "-").replace("-membership", "-member");
              const detail = MEMBERSHIP_DETAILS[slug];
              return (
                <div
                  key={idx}
                  className={`relative ${isLife ? "md:scale-105 z-15" : ""}`}
                >
                  {isLife && (
                    <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy font-sans text-[8px] font-extrabold uppercase tracking-widest px-3 py-1 rounded shadow-md border border-gold-dark/40 inline-block whitespace-nowrap z-20">
                      👑 MOST PRESTIGIOUS
                    </span>
                  )}

                  {/* Metallic gold frame, echoing the club emblem's gold ring */}
                  <div
                    className={`group h-full rounded-md p-[2px] bg-gradient-to-br transition-all duration-300 ${
                      isLife
                        ? "from-gold-light via-gold to-gold-dark shadow-[0_0_28px_-4px_rgba(201,168,76,0.55)]"
                        : "from-gold-light/50 via-gold/30 to-gold-dark/50 hover:from-gold-light hover:via-gold hover:to-gold-dark hover:shadow-[0_0_22px_-6px_rgba(201,168,76,0.4)]"
                    }`}
                  >
                    <div
                      className={`rounded-[5px] p-6 flex flex-col justify-between bg-gradient-to-b shadow-[0_14px_36px_-10px_rgba(26,39,68,0.28)] group-hover:shadow-[0_18px_44px_-8px_rgba(26,39,68,0.35)] transition-shadow duration-300 ${
                        isLife ? "from-[#fffdf5] to-white h-[372px]" : "from-white to-slate-50/60 h-[362px]"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Embossed medallion-style index badge */}
                        <div className="p-[2px] w-8 h-8 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark shadow-[inset_0_1px_1px_rgba(255,255,255,0.65),0_2px_8px_rgba(168,135,58,0.45)] -mt-2 -ml-2">
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-navy via-navy-mid to-navy-light flex items-center justify-center">
                            <span className="font-sans font-bold text-gold-light text-[10px]">{idx + 1}</span>
                          </div>
                        </div>
                        <h4 className="font-display text-[15px] font-bold text-text-dark leading-tight">{cat.title}</h4>
                        <p className="font-sans text-[11px] text-text-body leading-relaxed font-light line-clamp-4">
                          {cat.desc}
                        </p>
                      </div>

                      <div className="mt-auto pt-3 space-y-3">
                        <div className="border-t border-gold/15 pt-2 space-y-1 text-[9px] font-sans text-text-light">
                          <div className="flex justify-between">
                            <span>Voting Rights:</span>
                            <span className="text-navy font-semibold">{cat.voters}</span>
                          </div>
                          {detail ? (
                            <>
                              <div className="flex justify-between">
                                <span>Entry Fee:</span>
                                <span className="font-semibold bg-gradient-to-b from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">{formatEntryFee(detail.fees.admission)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Annual Fee:</span>
                                <span className="font-semibold bg-gradient-to-b from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">{formatAnnualFee(detail.fees.annual)}</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex justify-between">
                              <span>Onboarding Fee:</span>
                              <span className="font-semibold bg-gradient-to-b from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">{cat.fee}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            navigate(`/membership/${slug}`);
                          }}
                          className={`w-full py-2 text-center font-sans text-[9px] font-extrabold uppercase tracking-widest transition-colors border rounded-none ${
                            isLife
                              ? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy border-gold-dark/40 hover:brightness-105"
                              : "bg-navy text-white border-navy hover:bg-gold hover:text-navy hover:border-gold"
                          }`}
                        >
                          Read Full Details
                        </button>
                      </div>
                    </div>
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
          <div id="nomination-form" ref={nominationFormRef} className="lg:col-span-6 bg-slate-50/70 p-6 md:p-8 border border-slate-200 rounded-sm shadow-inner">
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-gold">
                <FileText className="w-5 h-5" />
                <span className="font-sans text-[10px] uppercase font-bold tracking-widest mt-0.5">
                  Membership Nomination Portal
                </span>
              </div>
              <h3 className="font-display text-xl text-text-dark font-semibold">
                Interest of Membership Request
              </h3>
              <p className="font-sans text-[11px] text-slate-500 font-light leading-relaxed">
                If you do not have current proposer references, the Scrutiny Committee may grant temporary clearance upon corporate profile review. Fill out the form below and our Registration Office will follow up directly.
              </p>
              <button
                type="button"
                onClick={scrollToNominationForm}
                className="w-full py-3 bg-gold text-navy hover:bg-navy hover:text-white text-xs font-sans font-extrabold uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                <span>Interested in Membership</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {formSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans rounded-md text-center">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-semibold text-sm mb-1">Proposal Dispatched Successfully!</p>
                <p>Your nomination request has been sent to our Registration Office. A member of our team will follow up with you shortly.</p>
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
                    placeholder="Your Full Name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 px-3 py-2 text-xs focus:ring-1 focus:ring-gold outline-none transition-all"
                    placeholder="e.g. name@domain.com"
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
                      <option>Diplomat</option>
                      <option>Foreign</option>
                      <option>Corporate</option>
                      <option>Honorary</option>
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
                      Facebook Profile Link *
                    </label>
                    <input
                      type="url"
                      required
                      name="facebookLink"
                      value={formData.facebookLink}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 px-3 py-2 text-xs focus:border-gold outline-none"
                      placeholder="https://facebook.com/yourname"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      LinkedIn Profile Link *
                    </label>
                    <input
                      type="url"
                      required
                      name="linkedinLink"
                      value={formData.linkedinLink}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 px-3 py-2 text-xs focus:border-gold outline-none"
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                    Website Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="websiteLink"
                    value={formData.websiteLink}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 px-3 py-2 text-xs focus:border-gold outline-none"
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Reference Name/Code (Optional)
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

                {submitError && (
                  <p className="text-[11px] font-sans text-red-600 font-medium">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#1a2744] hover:bg-gold hover:text-navy text-white text-xs font-sans font-semibold uppercase tracking-widest transition-all mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Confirm and Submit Your Interest"}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
