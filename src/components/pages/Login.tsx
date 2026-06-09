import React, { useState } from "react";
import { RoutePath } from "../../types";
import { getUsers, setLoggedInUser } from "../../utils/storage";
import { Anchor, Mail, Lock, ShieldAlert, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface LoginProps {
  navigate: (path: RoutePath) => void;
  onLoginSuccess: () => void;
}

export default function Login({ navigate, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
    );

    if (!user) {
      setError("Invalid email coordinates or security password hash.");
      return;
    }

    setLoggedInUser(user);
    setSuccess(true);
    setTimeout(() => {
      onLoginSuccess();
      if (user.role === "admin") {
        navigate("/admin-dashboard.html");
      } else {
        navigate("/dashboard.html");
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
              Registered Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:border-gold transition-all"
                placeholder="registered@cbbcl.org"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
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
        </form>

        <div className="border-t border-slate-100 pt-6 text-center space-y-2">
          <p className="font-sans text-xs text-slate-400 font-light">
            Don't have a digital account signature yet?
          </p>
          <button
            onClick={() => navigate("/register.html")}
            className="font-sans text-[11px] font-bold text-gold-dark hover:text-navy uppercase tracking-wider"
          >
            Register Digital Credentials
          </button>
        </div>

        {/* Demo hints table */}
        <div className="bg-slate-50 p-4 rounded text-[10px] font-mono text-slate-500 border border-dashed border-slate-200">
          <span className="block text-slate-400 font-bold mb-1 uppercase tracking-wider">Developer Demo Access Keys:</span>
          <div className="grid grid-cols-2 gap-1.5">
            <div>Admin: <strong className="text-navy">admin@cbbcl.org</strong></div>
            <div>Key: <strong className="text-navy">admin123</strong></div>
            <div>Verified: <strong className="text-navy">verified@cbbcl.org</strong></div>
            <div>Key: <strong className="text-navy">verified123</strong></div>
            <div>Normal: <strong className="text-navy">member@cbbcl.org</strong></div>
            <div>Key: <strong className="text-navy">member123</strong></div>
          </div>
        </div>

      </div>
    </div>
  );
}
