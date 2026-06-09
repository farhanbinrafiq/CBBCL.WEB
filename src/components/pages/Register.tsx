import React, { useState } from "react";
import { RoutePath, User } from "../../types";
import { getUsers, saveUsers, getProfiles, saveProfiles } from "../../utils/storage";
import { Anchor, ShieldAlert, CheckCircle, UserPlus, Key, Info } from "lucide-react";
import { motion } from "motion/react";

interface RegisterProps {
  navigate: (path: RoutePath) => void;
}

export default function Register({ navigate }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [membershipNum, setMembershipNum] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreeTerms) {
      setError("You must agree to the official CBBCL credentials verification terms.");
      return;
    }

    const users = getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      setError("An account signature is already registered under this email.");
      return;
    }

    // Creating new user in status PENDING VERIFICATION
    const newUser: User = {
      id: "user-" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password,
      role: "member", // REGISTERED MEMBER (UNVERIFIED)
      status: "pending", // PENDING VERIFICATION state
      membershipNumber: membershipNum ? membershipNum.trim() : undefined
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    // Initial empty draft profile to prevent undefined read on builder
    const profiles = getProfiles();
    const newProfile = {
      userId: newUser.id,
      name: newUser.name,
      bio: ["No biography provided yet. Write your profile bio from your dashboard builder."],
      profileStatus: "draft" as const
    };
    saveProfiles([...profiles, newProfile]);

    setSuccess(true);
    setTimeout(() => {
      navigate("/login.html");
    }, 4500);
  };

  return (
    <div className="bg-bg-primary min-h-screen flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto bg-white border border-gold shadow-2xl rounded-sm overflow-hidden p-8 space-y-8">
        
        {/* Banner Logo */}
        <div className="text-center space-y-2">
          <div className="bg-navy p-3 text-gold rounded-full w-14 h-14 flex items-center justify-center mx-auto border border-gold">
            <Anchor className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl font-light text-navy tracking-tight mt-4">
            Digital Register Portal
          </h2>
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#c9a84c] font-bold">
            Establish Account Signature
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans rounded flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-850 text-xs font-sans rounded text-center space-y-3">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-semibold text-sm uppercase text-navy">Account Registered Successfully!</p>
            <p className="leading-relaxed">
              Your member terminal account is now created in a <span className="font-bold text-gold-dark">PENDING VERIFICATION</span> state.
            </p>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Transferring you to the authentication checkpoint in a moment...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 px-4 py-2 text-xs outline-none focus:bg-white focus:border-gold transition-all"
                placeholder="e.g. Farhan Rafiq"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 px-4 py-2 text-xs outline-none focus:bg-white focus:border-gold transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                Secure Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 px-4 py-2 text-xs outline-none focus:bg-white focus:border-gold transition-all"
                placeholder="password123 (min 6 chars)"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                  CBBCL Membership Number <span className="font-light">(Optional)</span>
                </label>
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                  <div className="absolute bottom-full right-0 mb-2 w-52 bg-navy text-white text-[9px] font-sans leading-relaxed p-3 rounded shadow-xl hidden group-hover:block z-10">
                    If you are already on the founding roll/life member directory, enter your code here for faster registry approval.
                  </div>
                </div>
              </div>
              <input
                type="text"
                value={membershipNum}
                onChange={(e) => setMembershipNum(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 px-4 py-2 text-xs outline-none focus:bg-white focus:border-gold transition-all font-mono"
                placeholder="e.g. CBBCL-MEMBER-026"
              />
            </div>

            {/* Checkbox agreement to terms */}
            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="agreeTerms"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5"
              />
              <label htmlFor="agreeTerms" className="text-[10px] font-sans text-slate-500 leading-normal font-light">
                I agree to validation of credentials, background profiling terms, and membership ledger checks by the CBBCL Board of Registry.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1a2744] hover:bg-gold hover:text-navy text-white text-[11px] font-sans font-semibold uppercase tracking-widest transition-all mt-4 shadow-md"
            >
              Dispatch Register Application
            </button>
          </form>
        )}

        <div className="border-t border-slate-100 pt-6 text-center">
          <p className="font-sans text-xs text-slate-400 font-light mb-2">
            Already registered an account signature?
          </p>
          <button
            onClick={() => navigate("/login.html")}
            className="font-sans text-[11px] font-bold text-gold-dark hover:text-navy uppercase tracking-wider"
          >
            Authenticate Credentials &gt;
          </button>
        </div>

      </div>
    </div>
  );
}
