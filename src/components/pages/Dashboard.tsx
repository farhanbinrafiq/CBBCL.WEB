import React, { useState, useEffect } from "react";
import { RoutePath, User, Profile } from "../../types";
import { getLoggedInUser, setLoggedInUser, getUsers, saveUsers, getProfiles, saveProfiles } from "../../utils/storage";
import { Anchor, ShieldAlert, CheckCircle, Save, Send, Building, Award, UserCheck, Linkedin, Facebook, Twitter, LogOut, FileText, Globe } from "lucide-react";

interface DashboardProps {
  navigate: (path: RoutePath) => void;
  onLogout: () => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400"
];

export default function Dashboard({ navigate, onLogout }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Form Fields
  const [bioText, setBioText] = useState("");
  const [education, setEducation] = useState("");
  const [career, setCareer] = useState("");
  const [achievementsText, setAchievementsText] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    const profiles = getProfiles();
    let currentProfile = profiles.find((p) => p.userId === currentUser.id);

    if (!currentProfile) {
      // Create lazy profile instance
      currentProfile = {
        userId: currentUser.id,
        name: currentUser.name,
        bio: [""],
        profileStatus: "draft"
      };
      profiles.push(currentProfile);
      saveProfiles(profiles);
    }

    setProfile(currentProfile);
    setBioText(currentProfile.bio.join("\n"));
    setEducation(currentProfile.education || "");
    setCareer(currentProfile.career || "");
    setAchievementsText((currentProfile.achievements || []).join(", "));
    setPhotoUrl(currentProfile.photoUrl || "");
    setLinkedin(currentProfile.socialLinks?.linkedin || "");
    setFacebook(currentProfile.socialLinks?.facebook || "");
    setTwitter(currentProfile.socialLinks?.twitter || "");
  }, [navigate]);

  if (!user || !profile) {
    return <div className="p-12 text-center text-slate-500">Retrieving security parameters...</div>;
  }

  const isLocked = profile.profileStatus === "pending";

  const handleSaveDraft = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLocked) return;

    const profiles = getProfiles();
    const updatedProfile: Profile = {
      ...profile,
      bio: bioText.split("\n").filter((line) => line.trim() !== ""),
      education,
      career,
      achievements: achievementsText.split(",").map((s) => s.trim()).filter((s) => s !== ""),
      photoUrl,
      socialLinks: { linkedin, facebook, twitter },
      profileStatus: profile.profileStatus === "rejected" ? "draft" : profile.profileStatus
    };

    const index = profiles.findIndex((p) => p.userId === user.id);
    if (index !== -1) {
      profiles[index] = updatedProfile;
    } else {
      profiles.push(updatedProfile);
    }

    saveProfiles(profiles);
    setProfile(updatedProfile);
    showNotice("success", "Basic profile specifications updated successfully! Draft saved.");
  };

  const handleSubmitForApproval = () => {
    if (isLocked) return;
    
    // Auto-save any field drafts first
    const profiles = getProfiles();
    const updatedProfile: Profile = {
      ...profile,
      bio: bioText.split("\n").filter((line) => line.trim() !== ""),
      education,
      career,
      achievements: achievementsText.split(",").map((s) => s.trim()).filter((s) => s !== ""),
      photoUrl,
      socialLinks: { linkedin, facebook, twitter },
      profileStatus: "pending" // Send request to admin and Lock edit
    };

    const index = profiles.findIndex((p) => p.userId === user.id);
    if (index !== -1) {
      profiles[index] = updatedProfile;
    }
    saveProfiles(profiles);
    setProfile(updatedProfile);

    showNotice("success", "Profile locked and dispatched to CBBCL Administrative Queue for formal review.");
  };

  const showNotice = (type: "success" | "error", msg: string) => {
    setNotification({ type, message: msg });
    setTimeout(() => setNotification(null), 5050);
  };

  const handleLogOutAction = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="bg-bg-secondary min-h-screen pb-24">
      {/* Mini Breadcrumb Header */}
      <section className="bg-navy py-12 px-6 text-white border-b border-gold/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-sans text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">
              Secure Registry Node
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-light text-white tracking-tight mt-1">
              Member Console & Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogOutAction}
            className="flex items-center space-x-2 bg-white/10 hover:bg-gold hover:text-navy text-white text-[11px] font-sans font-semibold uppercase tracking-wider px-4 py-2 border border-white/20 hover:border-gold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: User Status Card */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200/80 p-6 rounded-sm shadow-sm space-y-5">
            <div className="flex justify-center shrink-0">
              <div className="relative w-28 h-28 rounded-full border border-gold overflow-hidden bg-slate-50">
                <img
                  src={photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display text-lg text-navy font-bold leading-none">{user.name}</h3>
              <p className="font-sans text-[11px] text-slate-400 font-light">{user.email}</p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3 font-sans text-xs">
              
              {/* Account Role Badge */}
              <div className="flex justify-between items-center text-[11px] pb-2 border-b border-slate-50">
                <span className="text-slate-400">Account Role:</span>
                <span className="bg-navy/5 text-navy font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[9px]">
                  {user.role}
                </span>
              </div>

              {/* Status badge: Pending Verification (Yellow) or Verified Member (Gold) */}
              <div className="flex flex-col space-y-1 py-1">
                <span className="text-slate-400 block pb-1">Verification Status:</span>
                {user.role === "verified" || user.status === "approved" ? (
                  <div className="bg-amber-50 border border-gold text-gold-dark font-semibold text-[10px] px-3 py-2 rounded flex items-center space-x-1.5 uppercase tracking-wider">
                    <UserCheck className="w-4 h-4 text-[#c9a84c]" />
                    <span>🟢 Verified Member (Gold)</span>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-300 text-yellow-750 font-semibold text-[10px] px-3 py-2 rounded flex items-center space-x-1.5 uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-yellow-600 shrink-0" />
                    <span>⚠️ Pending Verification</span>
                  </div>
                )}
              </div>

              {/* Membership number (if approved) */}
              <div className="flex justify-between border-b border-slate-50 pb-2 pt-2">
                <span className="text-slate-400">Ledger Code Number:</span>
                {user.membershipNumber ? (
                  <span className="text-navy font-mono font-bold tracking-tight">{user.membershipNumber}</span>
                ) : (
                  <span className="text-rose-600 font-sans italic">Not Verified Yet</span>
                )}
              </div>

              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Profile Feed Status:</span>
                <span className={`font-semibold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded ${
                  profile.profileStatus === "approved" ? "bg-emerald-100 text-emerald-800" :
                  profile.profileStatus === "pending" ? "bg-cyan-100 text-cyan-800 animate-pulse" :
                  profile.profileStatus === "rejected" ? "bg-rose-100 text-rose-800" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {profile.profileStatus || "draft"}
                </span>
              </div>

              {profile.profileStatus === "rejected" && profile.rejectionComment && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-[11px] rounded mt-2">
                  <span className="font-semibold block uppercase text-[8px] tracking-wider mb-0.5">Admin Revision Request:</span>
                  <p className="font-light italic">"{profile.rejectionComment}"</p>
                </div>
              )}

            </div>
          </div>

          {/* Visibility alert guidelines card */}
          <div className="bg-navy text-slate-300 p-5 rounded-sm border border-gold/10 space-y-3 text-[11px] font-sans">
            <h4 className="font-display text-sm text-white font-semibold">Profile Publication Rules</h4>
            <ul className="space-y-2 list-disc list-inside font-light text-slate-400">
              <li>Profile does not appear in the Board hierarchy, public directory, or news feed references until verified by admin.</li>
              <li>Verification requires checking your credentials and assigning a voting seat index.</li>
              <li>Once submitted for approval, you cannot edit any specifications until approved or sent back for draft edits.</li>
            </ul>
          </div>
        </aside>

        {/* Right Column: Two-Stage Profile System */}
        <div className="lg:col-span-8 space-y-6">
          
          {notification && (
            <div className={`p-4 rounded border font-sans text-xs flex items-center space-x-2 ${
              notification.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"
            }`}>
              {notification.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
              <span>{notification.message}</span>
            </div>
          )}

          {isLocked && (
            <div className="p-4 bg-cyan-50 border border-cyan-200 text-cyan-850 text-xs font-sans rounded-xs">
              <span className="font-bold uppercase tracking-wide block mb-1">🔐 System Locked for Formal Assessment</span>
              Your configuration metrics are locked and currently under administrator check. If requested revisions are sent back, editing capabilities will auto-restore instantly.
            </div>
          )}

          {/* Core Profile Builder Component */}
          <div className="bg-white border border-slate-205 p-6 md:p-8 rounded-sm shadow-sm space-y-8">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
              <div className="space-y-1">
                <span className="font-sans text-[9px] uppercase tracking-widest text-gold font-bold block">
                  STAGE A — PROFILE DRAFT REGISTER
                </span>
                <h2 className="font-display text-xl text-text-dark font-extralight tracking-tight">
                  Design Your <span className="font-serif italic text-gold">Public Identity Specs</span>
                </h2>
              </div>
              
              {/* Draft state header identifier */}
              <span className="font-mono text-[9px] bg-slate-50 text-slate-400 border px-2.5 py-1 uppercase tracking-widest">
                Stage Form Status: {profile.profileStatus || "draft"}
              </span>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              
              {/* Profile Bio Paragraphs block */}
              <div className="space-y-2">
                <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                  Biographical Narrative * <span className="font-light">(use enter for multiple paragraphs)</span>
                </label>
                <textarea
                  disabled={isLocked}
                  rows={6}
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs focus:bg-white focus:border-gold outline-none transition-all font-light"
                  placeholder="Enter a descriptive private biography narrative. Outline your maritime exposure, institutional goals, and coastal preservation priorities..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Education */}
                <div className="space-y-2">
                  <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block font-bold">
                    Educational Qualifications
                  </label>
                  <input
                    disabled={isLocked}
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs focus:bg-white focus:border-gold outline-none transition-colors"
                    placeholder="e.g. MBA, Business Administration (IBA - DU)"
                  />
                </div>

                {/* Career history */}
                <div className="space-y-2">
                  <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block font-bold">
                    Official Designation & Commerce
                  </label>
                  <input
                    disabled={isLocked}
                    type="text"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs focus:bg-white focus:border-gold outline-none transition-colors"
                    placeholder="e.g. Chairman & MD, Bengal Horizon Logistics"
                  />
                </div>

              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                  Institutional Achievements & Badges <span className="font-light">(Separated by commas)</span>
                </label>
                <input
                  disabled={isLocked}
                  type="text"
                  value={achievementsText}
                  onChange={(e) => setAchievementsText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs focus:bg-white focus:border-gold outline-none transition-colors"
                  placeholder="e.g. National Maritime Award (2024), Coastal Protection Citation"
                />
              </div>

              {/* Portrait Selection / Image Preset Urls */}
              <div className="space-y-3">
                <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                  Profile Portrait Artwork URL
                </label>
                <input
                  disabled={isLocked}
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs focus:bg-white focus:border-gold outline-none transition-colors"
                  placeholder="Insert image link https://..."
                />
                
                {!isLocked && (
                  <div className="space-y-1.5">
                    <span className="block text-[8px] font-sans text-slate-400 uppercase tracking-wider font-bold">Or Select Nautical Portrait Preset:</span>
                    <div className="flex gap-4">
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPhotoUrl(url)}
                          className={`w-14 h-14 rounded-full border-2 overflow-hidden transition-all ${
                            photoUrl === url ? "border-gold shadow-md scale-105" : "border-slate-200"
                          }`}
                        >
                          <img src={url} alt="preset link" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Social links */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase tracking-widest">
                  Official Communication Channels
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <input
                      disabled={isLocked}
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 text-xs outline-none focus:bg-white focus:border-gold"
                      placeholder="LinkedIn link URL"
                    />
                    <Linkedin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="relative">
                    <input
                      disabled={isLocked}
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 text-xs outline-none focus:bg-white focus:border-gold"
                      placeholder="Facebook link URL"
                    />
                    <Facebook className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="relative">
                    <input
                      disabled={isLocked}
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 text-xs outline-none focus:bg-white focus:border-gold"
                      placeholder="Twitter link URL"
                    />
                    <Twitter className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Form Save Button */}
              {!isLocked && (
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSaveDraft()}
                    className="py-2.5 px-6 bg-navy text-white hover:bg-gold hover:text-navy text-[10px] font-sans font-semibold uppercase tracking-widest transition-all shadow flex items-center space-x-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Store Draft Profile</span>
                  </button>
                </div>
              )}

            </form>
          </div>

          {/* Stage B: Submission Block */}
          <div className="bg-white border border-gold p-6 md:p-8 rounded-sm shadow-md space-y-4">
            <h4 className="font-display text-lg text-text-dark font-light flex items-center space-x-2">
              <Send className="w-5 h-5 text-gold" />
              <span>STAGE B — FORM SUBMISSION DISPATCH</span>
            </h4>
            <p className="font-sans text-xs text-text-body font-light leading-relaxed">
              Once you have saved your profile credentials draft successfully, send a publication submission to the Board of Registry. After matching your ledger ID credentials, the administrator will authorize the profile to be updated in public pages automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
              <div className="font-sans text-[10px] text-slate-400 tracking-wide font-light">
                Current State: <strong className="text-navy uppercase">{profile.profileStatus || "draft"}</strong>
              </div>

              <button
                disabled={isLocked || bioText.trim() === ""}
                onClick={handleSubmitForApproval}
                className={`py-3 px-8 text-[10px] font-sans font-semibold uppercase tracking-widest transition-all flex items-center space-x-2 ${
                  isLocked || bioText.trim() === ""
                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    : "bg-[#c9a84c] text-navy hover:bg-navy hover:text-white shadow-xl"
                }`}
              >
                <span>Submit Profile for Registry Approval</span>
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
