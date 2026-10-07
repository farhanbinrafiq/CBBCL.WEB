import React, { useState, useEffect } from "react";
import { ArrowRight, FileText, Info } from "lucide-react";
import { RoutePath } from "../../types";
import { getPageContent } from "../../utils/cmsStorage";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";
import MembershipInterestForm from "../MembershipInterestForm";
import { MEMBERSHIP_CATEGORIES, MEMBERSHIP_FEE_NOTE, MEMBERSHIP_RULES } from "../../membershipCategories";

interface MembershipProps {
  navigate: (path: RoutePath) => void;
}

export default function Membership({ navigate }: MembershipProps) {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const nominationFormRef = React.useRef<HTMLDivElement | null>(null);
  const [cmsPage] = useState(getPageContent());

  useEffect(() => {
    if (window.location.hash === "#nomination-form") {
      nominationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const scrollToNominationForm = () => {
    nominationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Categories and fees always come from the Articles of Association source, not the CMS.
  const categories = MEMBERSHIP_CATEGORIES;

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
              The Eight <span className="font-serif italic text-gold font-normal">Membership Categories</span>
            </h3>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {categories.map((cat, idx) => (
              <div key={cat.slug} className="relative">
                {cat.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap font-sans text-[8px] font-extrabold uppercase tracking-widest px-3 py-1 rounded shadow-md border ${
                    cat.featured
                      ? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy border-gold-dark/40"
                      : "bg-navy text-gold-light border-gold/40"
                  }`}>
                    {cat.badge}
                  </span>
                )}
                {/* Metallic gold frame, echoing the club emblem's gold ring */}
                <div className={`group h-full rounded-md p-[2px] bg-gradient-to-br transition-all duration-300 ${
                  cat.featured
                    ? "from-gold-light via-gold to-gold-dark shadow-[0_0_28px_-4px_rgba(201,168,76,0.55)]"
                    : "from-gold-light/50 via-gold/30 to-gold-dark/50 hover:from-gold-light hover:via-gold hover:to-gold-dark hover:shadow-[0_0_22px_-6px_rgba(201,168,76,0.4)]"
                }`}>
                  <div className="h-full min-h-[340px] rounded-[5px] p-6 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50/60 shadow-[0_14px_36px_-10px_rgba(26,39,68,0.28)] group-hover:shadow-[0_18px_44px_-8px_rgba(26,39,68,0.35)] transition-shadow duration-300">
                    <div className="space-y-3">
                      {/* Embossed medallion-style index badge */}
                      <div className="p-[2px] w-8 h-8 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark shadow-[inset_0_1px_1px_rgba(255,255,255,0.65),0_2px_8px_rgba(168,135,58,0.45)] -mt-2 -ml-2">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-navy via-navy-mid to-navy-light flex items-center justify-center">
                          <span className="font-sans font-bold text-gold-light text-[10px]">{idx + 1}</span>
                        </div>
                      </div>
                      <h4 className="font-display text-[15px] font-bold text-text-dark leading-tight">{cat.title}</h4>
                      {cat.generalMembership && (
                        <span className="inline-block font-sans text-[8px] uppercase tracking-widest font-bold text-navy bg-navy/5 px-2 py-0.5 rounded">
                          General Membership
                        </span>
                      )}
                      <p className="font-sans text-[11px] text-text-body leading-relaxed font-light">
                        {cat.summary}
                      </p>
                    </div>

                    <div className="mt-auto pt-3 space-y-3">
                      <div className="border-t border-gold/15 pt-2 space-y-1.5 text-[9px] font-sans text-text-light">
                        <div className="flex justify-between gap-2">
                          <span>Admission Fee:</span>
                          <span className="font-semibold text-right bg-gradient-to-b from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">{cat.fees.admissionLabel}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>Monthly Subscription:</span>
                          <span className="font-semibold text-right bg-gradient-to-b from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">{cat.fees.subscriptionLabel}</span>
                        </div>
                        {cat.votingRights && (
                          <div className="flex justify-between gap-2">
                            <span>Voting Rights:</span>
                            <span className="text-navy font-semibold">{cat.votingRights}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => navigate(`/membership/${cat.slug}`)}
                        className="w-full py-2 text-center font-sans text-[9px] font-extrabold uppercase tracking-widest transition-colors border rounded-none bg-navy text-white border-navy hover:bg-gold hover:text-navy hover:border-gold"
                      >
                        Read Full Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="max-w-3xl mx-auto font-sans text-[11px] text-text-body font-light leading-relaxed flex items-start space-x-2 bg-white border border-gold/20 p-4 rounded-sm">
            <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <span>{MEMBERSHIP_FEE_NOTE}</span>
          </p>
        </div>
      </section>

      {/* Additional membership rules from the Articles of Association */}
      <section className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="font-sans text-[9px] uppercase tracking-widest text-gold font-semibold block">
              Articles of Association
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-light text-text-dark">
              Additional <span className="font-serif italic font-normal text-gold">Membership Rules</span>
            </h3>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-2"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MEMBERSHIP_RULES.map((rule) => (
              <div key={rule.title} className="bg-slate-50/70 border border-slate-200 border-t-2 border-t-gold p-5 rounded-sm space-y-3">
                <h4 className="font-display text-sm font-semibold text-text-dark">{rule.title}</h4>
                <ul className="space-y-2">
                  {rule.points.map((point, i) => (
                    <li key={i} className="font-sans text-[11px] text-text-body font-light leading-relaxed">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
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

            <MembershipInterestForm />
          </div>

        </div>
      </section>
    </div>
  );
}
