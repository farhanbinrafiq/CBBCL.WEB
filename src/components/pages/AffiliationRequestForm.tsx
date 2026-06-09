import React, { useState, useEffect } from "react";
import { getCMSAffiliations } from "../../utils/cmsStorage";
import { getLoggedInUser } from "../../utils/storage";
import { getAffiliationRequests, saveAffiliationRequests } from "../../utils/memberStorage";
import { RoutePath } from "../../types";
import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ShieldAlert, 
  Building2, 
  User, 
  CreditCard,
  Calendar,
  FileCheck2
} from "lucide-react";

interface AffiliationRequestFormProps {
  navigate: (path: RoutePath) => void;
}

export default function AffiliationRequestForm({ navigate }: AffiliationRequestFormProps) {
  const [clubs] = useState(getCMSAffiliations());
  const [currentUser] = useState(getLoggedInUser());
  
  // Parse pre-selected club from URL query parameters (if arrived from detail page click)
  const [selectedClub, setSelectedClub] = useState("");
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clubParam = params.get("club");
    if (clubParam) {
      setSelectedClub(clubParam);
    } else if (clubs.length > 0) {
      setSelectedClub(clubs[0].name);
    }
  }, [clubs]);

  // Form states
  const [fullName, setFullName] = useState(currentUser?.name || "");
  const [membershipId, setMembershipId] = useState(currentUser?.membershipNumber || "");
  const [membershipType, setMembershipType] = useState("Life Member");
  const [purpose, setPurpose] = useState("");
  const [preferredDates, setPreferredDates] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Rule 1 Verification: Only verified members should hold actual clearance
  const isVerifiedMember = currentUser && (currentUser.role === "verified" || currentUser.role === "admin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName || !membershipId || !selectedClub || !purpose || !preferredDates) {
      setErrorMessage("Please complete all required fields labeled with an asterisk (*).");
      return;
    }

    // Prepare request record
    const newRequest = {
      id: "affreq-" + Date.now(),
      fullName,
      membershipId,
      membershipType,
      selectedClub,
      purpose,
      preferredDates,
      additionalNotes: additionalNotes || "No supplementary remarks.",
      status: "pending" as const,
      submittedAt: new Date().toISOString()
    };

    try {
      const currentRequests = getAffiliationRequests();
      saveAffiliationRequests([newRequest, ...currentRequests]);
      setSubmitted(true);
    } catch (err) {
      setErrorMessage("System error: Could not record the request at this moment. Please try again.");
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen py-16 px-6">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate("/affiliations.html")}
          className="inline-flex items-center space-x-1.5 text-slate-500 hover:text-gold text-[10px] font-sans uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Affiliations</span>
        </button>

        {/* Title Block */}
        <div className="text-center space-y-2">
          <span className="font-sans text-[10px] text-gold uppercase tracking-[0.2em] font-extrabold block">
            National Reciprocal Grid
          </span>
          <h1 className="font-display text-2.5xl font-light text-navy tracking-tight">
            Reciprocal Club <span className="font-serif italic text-gold">Access Request Form</span>
          </h1>
          <p className="font-sans text-[11px] text-text-body font-light leading-relaxed max-w-md mx-auto">
            Submit your itinerary and membership verification code below to request an official signed Introduction Card.
          </p>
        </div>

        {/* Success Alert */}
        {submitted ? (
          <div className="bg-white p-8 border-2 border-green-500 rounded-sm text-center space-y-5 shadow-xl">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <div className="space-y-2">
              <h2 className="font-display text-lg font-bold text-navy uppercase tracking-wider">
                Request Filed Safely
              </h2>
              <p className="font-sans text-xs text-text-body font-light leading-relaxed">
                Your credentials and travel itinerary are registered in the administrative scrutiny log queue under ID: <strong className="font-mono">{Date.now().toString().slice(-6)}</strong>.
              </p>
              <p className="font-sans text-xs text-amber-700 bg-amber-50 p-3 border border-amber-100 rounded-none inline-block font-light max-w-sm mt-2">
                ⚠️ Under Rule 2, access approval is administered manually. You will receive an email clearance confirmation with your Introduction Card once certified.
              </p>
            </div>
            <div className="pt-4 flex justify-center space-x-3">
              <button
                onClick={() => navigate("/affiliations.html")}
                className="px-5 py-2.5 bg-[#1a2744] text-white hover:bg-gold hover:text-navy text-[10px] font-sans font-bold uppercase tracking-widest inline-block transition-colors"
              >
                Return to Reciprocal Grid
              </button>
              {currentUser && (
                <button
                  onClick={() => navigate("/dashboard.html")}
                  className="px-5 py-2.5 border border-[#1a2744] text-navy hover:bg-[#1a2744] hover:text-white text-[10px] font-sans font-bold uppercase tracking-widest inline-block transition-colors"
                >
                  My Portal
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-sm p-8 shadow-md">
            
            {/* Rule 1 Strict Disclaimer Block */}
            {!isVerifiedMember && (
              <div className="mb-6 p-4 bg-amber-50/70 border-l-4 border-amber-600 text-amber-900 font-sans text-xs space-y-2">
                <div className="flex items-center space-x-2 font-bold text-amber-800 uppercase tracking-wide">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Rule 1: Verified Members Only</span>
                </div>
                <p className="font-light leading-relaxed text-[11px]">
                  Reciprocal visitation passes are strictly issued to active, verified CBBCL members. 
                  {!currentUser ? (
                    <span> Please <strong className="underline cursor-pointer" onClick={() => navigate("/login.html")}>Log In to your Member Portal</strong> to auto-authenticate your credentials.</span>
                  ) : (
                    <span> Your account currently has status <strong>"{currentUser.role}"</strong>. Submissions from non-verified accounts will remain pending until your official Member Scrutiny is fully resolved.</span>
                  )}
                </p>
              </div>
            )}

            {isVerifiedMember && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-900 font-sans text-xs flex items-center space-x-2.5">
                <FileCheck2 className="w-5 h-5 text-green-700" />
                <span className="font-light">
                  Authenticated: You are logged in as a <strong>Verified CBBCL Member</strong> (ID auto-tracked).
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-sans rounded border border-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div className="space-y-1.5 font-sans">
                <label className="text-[11px] font-bold text-navy uppercase tracking-wider block">
                  Full Name *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your registered name"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 text-xs font-light text-text-dark focus:outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Membership ID */}
                <div className="space-y-1.5 font-sans">
                  <label className="text-[11px] font-bold text-navy uppercase tracking-wider block">
                    Membership ID (Boat Club) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">
                      <CreditCard className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={membershipId}
                      onChange={(e) => setMembershipId(e.target.value)}
                      placeholder="e.g. CBBCL-LIFEMEMBER-006"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 text-xs font-light text-text-dark focus:outline-none focus:border-gold transition-colors font-sans font-mono"
                    />
                  </div>
                </div>

                {/* Membership Type */}
                <div className="space-y-1.5 font-sans">
                  <label className="text-[11px] font-bold text-navy uppercase tracking-wider block">
                    Membership Type *
                  </label>
                  <select
                    value={membershipType}
                    onChange={(e) => setMembershipType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 text-xs font-light text-text-dark focus:outline-none focus:border-gold bg-white transition-colors font-sans"
                  >
                    <option value="Life Member">Life Member</option>
                    <option value="Permanent Member">Permanent Member</option>
                    <option value="Associate Member">Associate Member</option>
                    <option value="Donor Member">Donor Member</option>
                    <option value="Honorary Member">Honorary Member</option>
                  </select>
                </div>
              </div>

              {/* Selected Affiliation Club */}
              <div className="space-y-1.5 font-sans">
                <label className="text-[11px] font-bold text-navy uppercase tracking-wider block">
                  Selected Affiliation Club *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <select
                    value={selectedClub}
                    required
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 text-xs font-light text-text-dark focus:outline-none focus:border-gold bg-white transition-colors font-sans font-medium"
                  >
                    <option value="" disabled>Choose reciprocal partner club</option>
                    {clubs.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Dates */}
              <div className="space-y-1.5 font-sans">
                <label className="text-[11px] font-bold text-navy uppercase tracking-wider block">
                  Preferred Dates of Visit / Access *
                </label>
                <div className="relative font-sans">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={preferredDates}
                    onChange={(e) => setPreferredDates(e.target.value)}
                    placeholder="e.g. July 20, 2026 to July 25, 2026"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 text-xs font-light text-text-dark focus:outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Purpose of Visit */}
              <div className="space-y-1.5 font-sans">
                <label className="text-[11px] font-bold text-navy uppercase tracking-wider block">
                  Purpose of Visit / Access *
                </label>
                <textarea
                  required
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Specify details, e.g. Attending a conference, leisure transit dining with business clients, etc."
                  className="w-full px-4 py-2.5 border border-slate-200 text-xs font-light text-text-dark focus:outline-none focus:border-gold transition-colors font-sans resize-none"
                />
              </div>

              {/* Additional Notes */}
              <div className="space-y-1.5 font-sans">
                <div className="flex justify-between">
                  <label className="text-[11px] font-bold text-navy uppercase tracking-wider block">
                    Additional Notes
                  </label>
                  <span className="text-[9px] text-slate-400 font-mono italic">Optional</span>
                </div>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Enter any guest logistics, special introductions requested, or specific times."
                  className="w-full px-4 py-2.5 border border-slate-200 text-xs font-light text-text-dark focus:outline-none focus:border-gold transition-colors font-sans resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1a2744] text-white hover:bg-gold hover:text-navy text-[11px] font-sans font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Affiliation Request</span>
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
