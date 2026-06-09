import React, { useState, useEffect, useRef } from "react";
import { RoutePath } from "../../types";
import { 
  getMembershipApplications, 
  saveMembershipApplications 
} from "../../utils/memberStorage";
import { 
  Building2, User, Mail, Phone, Calendar, Clipboard, FileUp, CheckCircle, ArrowLeft, Loader2, Award 
} from "lucide-react";

interface MembershipApplicationFormProps {
  navigate: (path: RoutePath) => void;
}

export default function MembershipApplicationForm({ navigate }: MembershipApplicationFormProps) {
  // Query state
  const [membershipType, setMembershipType] = useState("Life Membership");
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [organization, setOrganization] = useState("");
  const [designation, setDesignation] = useState("");
  const [motivation, setMotivation] = useState("");
  
  // Document state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status flow control
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdAppId, setCreatedAppId] = useState("");

  useEffect(() => {
    // Attempt to extract dynamic type from query string simulates ?type=[categoryName]
    const search = window.location.search || "";
    const params = new URLSearchParams(search);
    const typeParam = params.get("type");
    if (typeParam) {
      setMembershipType(typeParam);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !motivation) {
      alert("Please fill in all required fields (Candidate Name, Email, Phone, and Nomination Motivation).");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const currentList = getMembershipApplications();
      const newAppId = "app-" + Date.now();
      
      const newApplication = {
        id: newAppId,
        fullName,
        email,
        phone,
        membershipType,
        motivation,
        organization: organization || "Independent / Private Executive",
        designation: designation || "Executive Director",
        dob: dob || "Not specified",
        status: "pending" as const, // Starts as Pending Review
        submittedAt: new Date().toISOString(),
        documentName: uploadedFile ? uploadedFile.name : undefined
      };

      saveMembershipApplications([...currentList, newApplication]);
      
      setIsSubmitting(false);
      setCreatedAppId(newAppId);
      setSubmitSuccess(true);
    }, 1200);
  };

  if (submitSuccess) {
    return (
      <div className="bg-bg-primary min-h-screen py-16 flex items-center justify-center px-6 text-left">
        <div className="max-w-xl w-full bg-white border border-slate-200 p-8 rounded-sm shadow-lg text-center space-y-6 animate-fade-in">
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="font-sans text-[10px] text-amber-600 font-extrabold uppercase tracking-widest block">
              Nomination Proposal Submitted
            </span>
            <h2 className="font-display text-2xl font-light text-text-dark tracking-tight">
              Prestige Application Ledger Logged
            </h2>
            <p className="font-sans text-xs text-slate-500 leading-relaxed font-light">
              Your official nomination package for <strong className="text-navy">{membershipType}</strong> has been successfully broadcast to the CBBCL Verification Committee.
            </p>
          </div>

          <div className="bg-slate-50 p-4 border border-slate-100 rounded text-left space-y-2 text-xs font-sans text-slate-600">
            <p><strong>Registry Tracking reference:</strong> <span className="font-mono text-navy font-bold">{createdAppId}</span></p>
            <p><strong>Ledger Status:</strong> <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 border border-amber-200 rounded-sm text-[10px]">PENDING BOARD REVIEW</span></p>
            <p className="border-t pt-2 mt-2 leading-relaxed text-[11px] text-slate-400">
              * Verification standard review cycles take average of 7 business days. Users cannot self-approve. The official credentials board led by President Humayun Kabir Robel manages authorization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                // Clear state or navigate home
                navigate("/membership.html");
              }}
              className="flex-1 py-3 bg-navy text-gold hover:bg-navy-light text-xs font-sans font-extrabold uppercase tracking-widest transition-all rounded-xs"
            >
              Return to Membership
            </button>
            <button
              onClick={() => navigate("/dashboard.html")}
              className="flex-1 py-3 bg-white text-navy border hover:bg-slate-50 text-xs font-sans font-extrabold uppercase tracking-widest transition-all rounded-xs"
            >
              Go to Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen pb-20">
      {/* Tiny Header */}
      <section className="relative h-48 bg-navy flex items-center justify-center overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center">
          <div className="absolute inset-0 bg-navy/90 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-2">
          <Award className="w-8 h-8 text-gold mx-auto animate-pulse" />
          <h1 className="font-display text-2xl sm:text-3xl font-extralight text-white tracking-tight">
            CBBCL <span className="font-serif italic text-gold font-normal">Admissions Nomination Portal</span>
          </h1>
          <p className="font-sans text-[10px] text-slate-400 uppercase tracking-widest">
            Cox's Bazar Boat Club Limited Ledger System
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Back Link */}
        <button
          onClick={() => navigate("/membership.html")}
          className="group inline-flex items-center space-x-2 text-xs font-sans uppercase font-bold tracking-widest text-[#1a2744] hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Exit Application</span>
        </button>

        {/* Core Card Form */}
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-sm shadow-sm space-y-6 text-left">
          <div className="border-b pb-4">
            <h2 className="font-display text-xl text-text-dark font-semibold">Initiate Prestige Nomination</h2>
            <p className="text-xs text-slate-500 font-light mt-1">
              Please provide certified candidate details to register on our registry records. Approvals are strictly managed by the executive committee directors.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 font-sans text-xs">
            {/* Membership Type Select */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Target Membership Category <span className="text-gold-dark font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={membershipType}
                  onChange={(e) => setMembershipType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 rounded-none text-xs focus:ring-1 focus:ring-gold bg-none text-text-dark font-medium cursor-pointer"
                >
                  <option value="Life Membership">Life Membership</option>
                  <option value="Donor Membership">Donor Membership</option>
                  <option value="Permanent Membership">Permanent Membership</option>
                  <option value="Associate Membership">Associate Membership</option>
                  <option value="Corporate Membership">Corporate Membership</option>
                  <option value="Honorary Membership">Honorary Membership (Board Referral)</option>
                </select>
              </div>
            </div>

            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Full Candidate Name <span className="text-gold-dark font-bold">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Barrister Rafiqul Islam"
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-3.5 py-3 rounded-none focus:bg-white transition-all text-xs focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Official Email Address <span className="text-gold-dark font-bold">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@workdomain.com"
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-3.5 py-3 rounded-none focus:bg-white transition-all text-xs focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone and DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Contact Mobile Phone <span className="text-gold-dark font-bold">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 17XX XXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-3.5 py-3 rounded-none focus:bg-white transition-all text-xs focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-3.5 py-3 rounded-none focus:bg-white transition-all text-xs focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Corporate and Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Company / Organization Placement
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="E.g. Zenith Group Corp"
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-3.5 py-3 rounded-none focus:bg-white transition-all text-xs focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Executive Designation / Rank
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="E.g. Managing Director & Board Member"
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-3.5 py-3 rounded-none focus:bg-white transition-all text-xs focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>
            </div>

            {/* Motivation Statement */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Statement of Membership Motivation <span className="text-gold-dark font-bold">*</span>
              </label>
              <div className="relative">
                <Clipboard className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <textarea
                  required
                  rows={4}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Outline why you are seeking admission to the Cox's Bazar Boat Club, your interests in yachting, sailing activities, and physical asset contributions..."
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-3.5 py-3 rounded-none focus:bg-white transition-all text-xs focus:ring-1 focus:ring-gold font-normal leading-relaxed"
                />
              </div>
            </div>

            {/* Drag and Drop Document Upload */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Upload Supporting Documents (CV, Trade licenses, Proposer letters - Optional)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-all ${
                  isDragOver 
                    ? "border-gold bg-amber-50/10" 
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <div className="space-y-2">
                  <FileUp className="w-8 h-8 text-slate-400 mx-auto" />
                  {uploadedFile ? (
                    <div>
                      <p className="text-xs font-semibold text-text-dark font-mono">{uploadedFile.name}</p>
                      <p className="text-[10px] text-slate-400">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Click to replace file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-text-dark">Drag & Drop your support document here</p>
                      <p className="text-[10px] text-slate-400">Or click to browse files from your disk (PDF, JPG, PNG)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Disclaimer block */}
            <div className="p-3.5 bg-sky-50/40 border border-sky-100 rounded text-[11px] leading-relaxed text-slate-500 font-normal">
              By submitting this nomination proposal, you certify that the provided credentials represent factual details. Decisions are held privately by the CBBCL Admissions Board.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-navy hover:bg-navy-light text-gold font-sans font-extrabold uppercase tracking-widest transition-all rounded-none shadow-md flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  <span>Recording Nomination on Ledger...</span>
                </>
              ) : (
                <>
                  <span>Submit Nomination Proposal</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
