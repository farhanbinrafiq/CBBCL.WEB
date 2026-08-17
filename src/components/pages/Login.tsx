import React, { useState } from "react";
import { RoutePath, User } from "../../types";
import { getUsers, setLoggedInUser } from "../../utils/storage";
import { Anchor, IdCard, Mail, Lock, ShieldAlert, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface LoginProps {
  navigate: (path: RoutePath) => void;
  onLoginSuccess: () => void;
}

export default function Login({ navigate, onLoginSuccess }: LoginProps) {
  const [stage, setStage] = useState<"membershipId" | "password">("membershipId");
  const [membershipId, setMembershipId] = useState("");
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVerifyMembershipId = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = getUsers();
    const user = users.find(
      (u) => (u.membershipNumber || "").toLowerCase() === membershipId.trim().toLowerCase()
    );

    if (!user) {
      setError("No registry account found for this Membership ID.");
      return;
    }

    setMatchedUser(user);
    setStage("password");
  };

  const handleBackToMembershipId = () => {
    setStage("membershipId");
    setMatchedUser(null);
    setPassword("");
    setError(null);
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!matchedUser || matchedUser.passwordHash !== password) {
      setError("Incorrect security password.");
      return;
    }

    setLoggedInUser(matchedUser);
    setSuccess(true);
    setTimeout(() => {
      onLoginSuccess();
      if (matchedUser.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="bg-bg-primary min-h-screen flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto bg-white border border-gold shadow-2xl rounded-sm overflow-hidden p-8 space-y-8">

        {/* Banner header logo */}
        <div className="text-center space-y-2">
          <div className="bg-navy p-3 text-gold rounded-full w-14 h-14 flex items-center justify-center mx-auto border border-gold">
            <Anchor className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl font-light text-navy tracking-tight mt-4">
            CBBCL Member Registry
          </h2>
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#c9a84c] font-bold">
            Private Access Guard Rail
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans rounded flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans rounded flex items-start space-x-2 animate-pulse">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>Authorization successful. Directing to your terminal...</span>
          </div>
        )}

        {stage === "membershipId" ? (
          <form onSubmit={handleVerifyMembershipId} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                Membership ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={membershipId}
                  onChange={(e) => setMembershipId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:border-gold transition-all font-mono"
                  placeholder="CBBCL-MEMBER-XXX"
                />
                <IdCard className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
              <p className="text-[10px] font-sans text-slate-400 font-light pt-1">
                Enter the Membership ID issued on your registry credential to continue.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1a2744] hover:bg-gold hover:text-navy text-white text-[11px] font-sans font-semibold uppercase tracking-widest transition-all mt-6 shadow-md flex items-center justify-center space-x-2"
            >
              <span>Verify Membership</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitPassword} className="space-y-5">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs font-sans text-emerald-800 flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <p className="font-semibold">Membership Verified</p>
                <p className="text-emerald-700">Welcome back, {matchedUser?.name} ({matchedUser?.email})</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                Security Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:border-gold transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1a2744] hover:bg-gold hover:text-navy text-white text-[11px] font-sans font-semibold uppercase tracking-widest transition-all mt-6 shadow-md flex items-center justify-center space-x-2"
            >
              <span>Proceed to Security Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleBackToMembershipId}
              className="w-full flex items-center justify-center space-x-1.5 text-[10px] font-sans font-semibold uppercase tracking-widest text-slate-400 hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Not you? Use a different Membership ID</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
