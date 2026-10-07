import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { getMembershipApplications, saveMembershipApplications } from "../utils/memberStorage";
import { MEMBERSHIP_CATEGORIES } from "../membershipCategories";

interface MembershipInterestFormProps {
  /** Category pre-selected in the form, e.g. "Life" (a MembershipCategory.formValue). */
  defaultCategory?: string;
}

// The "Interest of Membership Request" form, used on the Membership page and in the
// pop-up on each category page. Submissions are emailed via /api/membership/nominate.
export default function MembershipInterestForm({ defaultCategory = "Permanent" }: MembershipInterestFormProps) {
  const emptyForm = {
    fullName: "",
    email: "",
    category: defaultCategory,
    dob: "",
    org: "",
    designation: "",
    phone: "",
    facebookLink: "",
    linkedinLink: "",
    websiteLink: "",
    proposerCode: "",
    seconderCode: ""
  };
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.facebookLink) return;

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
      const newApp = {
        id: "app-" + Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        membershipType: formData.category + " Membership",
        motivation: `Nomination proposing request submitted through web portal. Proposer Code: ${formData.proposerCode || "Under Committee Review"}, Seconder Code: ${formData.seconderCode || "Under Committee Review"}. Facebook: ${formData.facebookLink}${formData.linkedinLink ? `, LinkedIn: ${formData.linkedinLink}` : ""}${formData.websiteLink ? `, Website: ${formData.websiteLink}` : ""}.`,
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
        setFormData(emptyForm);
      }, 5000);
    } catch (error: any) {
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                {MEMBERSHIP_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.formValue}>{c.formValue}</option>
                ))}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                LinkedIn Profile Link (Optional)
              </label>
              <input
                type="url"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    </>
  );
}
