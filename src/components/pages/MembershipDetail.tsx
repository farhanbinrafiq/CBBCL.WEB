import React, { useEffect, useState } from "react";
import { RoutePath } from "../../types";
import {
  Award, ShieldCheck, Check, Key, ArrowLeft, ArrowRight, Banknote, Scale, Info, X, FileText
} from "lucide-react";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";
import MembershipInterestForm from "../MembershipInterestForm";
import { getMembershipCategory, MEMBERSHIP_FEE_NOTE } from "../../membershipCategories";

interface MembershipDetailProps {
  categorySlug: string;
  navigate: (path: RoutePath) => void;
}

export default function MembershipDetail({ categorySlug, navigate }: MembershipDetailProps) {
  const slug = categorySlug.toLowerCase().replace(/_/g, "-");
  const detail = getMembershipCategory(slug);

  // "Interested in Membership" opens the interest form in a pop-up, pre-set to this category.
  const [formOpen, setFormOpen] = useState(false);
  const handleApplyClick = () => setFormOpen(true);

  useEffect(() => {
    if (!formOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFormOpen(false); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [formOpen]);

  if (!detail) {
    return (
      <div className="bg-bg-primary min-h-screen flex items-center justify-center px-6 py-24">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl font-light text-text-dark">Membership category not found</h1>
          <button
            onClick={() => navigate("/membership")}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-navy text-white hover:bg-gold hover:text-navy font-sans text-xs font-extrabold uppercase tracking-widest transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All Membership Categories</span>
          </button>
        </div>
      </div>
    );
  }

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
            Cox's Bazar Boat Club Limited
          </p>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extralight text-white tracking-tight break-words whitespace-normal leading-tight">
            {detail.title}
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <button onClick={() => navigate("/membership")} className="hover:text-gold transition-colors">Membership</button>
            <span>&gt;</span>
            <span className="text-gold">{detail.title}</span>
          </div>
        </div>
      </section>

      {/* Main Core View Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Back Link */}
        <button
          onClick={() => navigate("/membership")}
          className="group inline-flex items-center space-x-2 text-xs font-sans uppercase font-bold tracking-widest text-[#1a2744] hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Categories list</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT AREA: Detail Sections */}
          <div className="lg:col-span-8 space-y-10 bg-white border border-slate-150 p-6 md:p-8 rounded-sm shadow-sm">

            {/* HERO INTRODUCTION */}
            <div className="space-y-3 pb-6 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-navy tracking-widest bg-navy/5 px-2.5 py-1 rounded w-fit inline-block">
                  {detail.generalMembership ? "General Membership" : "Membership Category"}
                </span>
                {detail.badge && (
                  <span className={`font-sans text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded shadow-sm ${
                    detail.featured
                      ? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy"
                      : "bg-navy text-gold-light"
                  }`}>
                    {detail.badge}
                  </span>
                )}
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-light text-text-dark">
                {detail.title}
              </h2>
              <p className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed">
                {detail.summary}
              </p>
            </div>

            {/* SECTION 1: FEES */}
            <div className="space-y-3">
              <h3 className="font-display text-lg font-bold text-text-dark flex items-center space-x-2">
                <Banknote className="w-5 h-5 text-gold shrink-0" />
                <span>Fees &amp; Subscription</span>
              </h3>
              <div className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed pt-1">
                <div className="border border-amber-100 bg-amber-50/20 p-4 rounded-sm grid grid-cols-1 gap-5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Membership Fee</span>
                    <span className="text-navy font-display text-lg font-bold block mt-1">{detail.fees.admissionAmount || detail.fees.admissionLabel}</span>
                    <span className="text-[11px] text-slate-500 block mt-1">{detail.fees.admissionDetail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Monthly Subscription Fee</span>
                    <span className="text-gold-dark font-display text-lg font-bold block mt-1">{detail.fees.subscriptionLabel}</span>
                    <span className="text-[11px] text-slate-500 block mt-1">{detail.fees.subscriptionDetail}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-3 italic flex items-start space-x-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gold" />
                  <span>{MEMBERSHIP_FEE_NOTE}</span>
                </p>
              </div>
            </div>

            {/* SECTION 2: ELIGIBILITY */}
            {detail.eligibility.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-display text-lg font-bold text-text-dark flex items-center space-x-2">
                  <Scale className="w-5 h-5 text-gold shrink-0" />
                  <span>Eligibility</span>
                </h3>
                <ul className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed space-y-2 pt-1 pl-1">
                  {detail.eligibility.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SECTION 3: PRIVILEGES */}
            {(detail.privileges.length > 0 || detail.votingRights) && (
              <div className="space-y-3 pt-2">
                <h3 className="font-display text-lg font-bold text-text-dark flex items-center space-x-2">
                  <Key className="w-5 h-5 text-gold shrink-0" />
                  <span>Privileges</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pl-1 pt-1">
                  {detail.privileges.map((item, idx) => (
                    <li key={idx} className="bg-slate-50 p-2.5 border border-slate-100 rounded flex space-x-2 items-start">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-sans text-[11px] leading-snug text-text-body">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SECTION 4: RESTRICTIONS & OBLIGATIONS */}
            {detail.restrictions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-display text-lg font-bold text-text-dark flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
                  <span>Restrictions &amp; Obligations</span>
                </h3>
                <ul className="font-sans text-xs sm:text-[13px] leading-relaxed space-y-2 list-disc list-inside pl-2 text-slate-600 font-normal pt-1">
                  {detail.restrictions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="font-sans text-[11px] text-slate-400 border-t border-slate-100 pt-4">
              Summary of the membership provisions of the Club's Articles of Association. In case of any difference, the Articles of Association prevail.
            </p>
          </div>

          {/* RIGHT COL: CTA Panel card */}
          {!detail.byInvitation ? (
            <aside className="lg:col-span-4 bg-navy text-white border border-navy-light p-6 rounded-sm lg:sticky lg:top-6 text-center space-y-5">
              <div className="p-3 bg-white/5 rounded-full border border-white/10 text-gold w-fit mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="font-sans text-[9px] text-gold uppercase tracking-[0.25em] font-bold block">
                  Membership Enquiry
                </span>
                <h3 className="font-display text-lg font-light tracking-tight text-white">
                  Apply for {detail.title}
                </h3>
                <p className="font-sans text-[11px] text-slate-300 leading-relaxed font-light">
                  Submit your interest online and the Club Secretariat will follow up with the applicable fees and next steps.
                </p>
              </div>

              <button
                onClick={handleApplyClick}
                className="w-full py-3.5 bg-gold text-navy hover:bg-white text-xs font-sans font-extrabold uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>Interested in Membership</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </aside>
          ) : (
            <aside className="lg:col-span-4 bg-slate-50 text-text-dark border p-6 rounded-sm lg:sticky lg:top-6 text-center space-y-5">
              <div className="p-3 bg-navy/5 rounded-full border border-navy/10 text-gold w-fit mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="font-sans text-[9px] text-gold uppercase tracking-[0.25em] font-bold block">
                  By Invitation
                </span>
                <h3 className="font-display text-lg font-light tracking-tight text-text-dark">
                  Conferred by the Board of Directors
                </h3>
                <p className="font-sans text-[11px] text-slate-500 leading-relaxed font-light">
                  Honorary Membership is granted by invitation of the Board of Directors. For enquiries, please contact the Club Secretariat.
                </p>
              </div>

              <button
                onClick={() => navigate("/contact")}
                className="w-full py-3 bg-navy text-white hover:bg-gold hover:text-navy text-xs font-sans font-extrabold uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
              >
                <span>Contact Club Secretariat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </aside>
          )}

        </div>
      </div>

      {/* Membership interest pop-up */}
      {formOpen && (
        <div
          className="fixed inset-0 z-[200] bg-navy/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          onClick={() => setFormOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="membership-form-title"
        >
          <div
            className="relative w-full max-w-2xl bg-slate-50 border border-gold/30 rounded-sm shadow-2xl my-8 max-h-[calc(100vh-4rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-navy text-white px-6 py-4 flex items-start justify-between gap-4 border-b border-gold/30">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-gold">
                  <FileText className="w-4 h-4" />
                  <span className="font-sans text-[10px] uppercase font-bold tracking-widest">Membership Nomination Portal</span>
                </div>
                <h3 id="membership-form-title" className="font-display text-lg font-light">
                  Interest of Membership Request — <span className="text-gold-light">{detail.title}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Close form"
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <p className="font-sans text-[11px] text-slate-500 font-light leading-relaxed">
                Fill out the form below and the Club Secretariat will follow up with the applicable fees and next steps.
              </p>
              <MembershipInterestForm defaultCategory={detail.formValue} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
