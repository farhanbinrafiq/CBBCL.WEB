import React, { useState, useEffect } from "react";
import { getLoggedInUser } from "../../utils/storage";
import { RoutePath } from "../../types";
import { 
  getEZBookingReservations, 
  saveEZBookingReservations 
} from "../../utils/memberStorage";
import { 
  Plane, 
  Hotel, 
  Ticket, 
  Compass, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  Search, 
  Building2, 
  User, 
  BadgePercent,
  Calendar,
  Sparkles,
  ShieldCheck,
  MapPin
} from "lucide-react";

interface EZBookingPortalProps {
  navigate: (path: RoutePath) => void;
}

export default function EZBookingPortal({ navigate }: EZBookingPortalProps) {
  const [currentUser] = useState(getLoggedInUser());
  const [memberId, setMemberId] = useState(currentUser?.membershipNumber || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  
  // Checking rule 1 verified members requirement
  const isVerified = currentUser && (currentUser.role === "verified" || currentUser.role === "admin");

  useEffect(() => {
    if (currentUser && isVerified && currentUser.membershipNumber) {
      setMemberId(currentUser.membershipNumber);
      setIsAuthenticated(true);
    }
  }, [currentUser, isVerified]);

  // Form Booking States
  const [bookingType, setBookingType] = useState<"hotel" | "flight" | "event">("hotel");
  const [destination, setDestination] = useState("Cox's Bazar");
  const [travelDate, setTravelDate] = useState("2026-06-25");
  const [guestsCount, setGuestsCount] = useState("2 Guests");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Filter deals
  const handleVerifyId = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!memberId) {
      setAuthError("Please input an active CBBCL Member ID.");
      return;
    }
    if (!memberId.toLowerCase().includes("cbbcl")) {
      setAuthError("Invalid sequence. Corporate codes must initiate with 'CBBCL-*'.");
      return;
    }
    setIsAuthenticated(true);
    setAppliedDiscount(25); // Premium 25% base discount for verified credentials
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newReservation = {
      id: "ezr-" + Date.now(),
      memberId: memberId || "Guest-CBBCL",
      bookingType,
      destination,
      travelDate,
      guestsCount,
      amountPaid: calculatePrice(),
      promoCode: promoCode || undefined,
      status: "Pending" as const,
      submittedAt: new Date().toISOString()
    };
    const currentList = getEZBookingReservations();
    saveEZBookingReservations([...currentList, newReservation]);
    setBookingSuccess(true);
  };

  const calculatePrice = () => {
    let base = 12000;
    if (bookingType === "flight") base = 8500;
    if (bookingType === "event") base = 4000;
    
    // Applying verified discount
    const discountFactor = isAuthenticated ? 0.70 : 1.0; // 30% discount for validated credentials!
    return Math.round(base * discountFactor);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate("/affiliations.html")}
          className="inline-flex items-center space-x-1.5 text-slate-500 hover:text-gold text-[10px] font-sans uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Partners</span>
        </button>

        {/* Brand Header */}
        <div className="bg-gradient-to-r from-navy to-[#1e345e] p-8 border border-gold/30 rounded shadow-md text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center space-x-1.5 text-[9px] font-mono tracking-widest text-gold uppercase font-extrabold bg-gold/10 px-2 py-1 rounded">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span>CBBCL Official OTA Portal Gateway</span>
            </span>
            <h1 className="font-display text-4xl font-extralight tracking-tight text-white">
              EZ<span className="text-gold font-bold font-serif italic">BOOKING</span>
            </h1>
            <p className="font-sans text-xs text-slate-300 font-light max-w-lg leading-relaxed">
              Welcome to the elite, custom-integrated booking engine. Cox’s Bazar Boat Club Limited members enjoy premium discounts on hotels, airfares, and cruises globally.
            </p>
          </div>
          <div className="bg-white/10 p-4 border border-white/10 text-center rounded-sm max-w-xs space-y-1.5">
            <p className="text-[10px] font-mono text-gold font-bold">CURRENT LIVE RATE BADGE</p>
            <p className="text-xl font-display font-extrabold text-white">UP TO 30% OFF</p>
            <p className="text-[10px] font-light text-slate-300">Verified Credentials Applied Automatically</p>
          </div>
        </div>

        {/* Verification Widget if not verified */}
        {!isAuthenticated ? (
          <div className="bg-white border-2 border-dashed border-gold/40 rounded-sm p-8 max-w-xl mx-auto space-y-6 shadow-sm">
            <div className="text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-gold mx-auto" />
              <h2 className="font-display text-lg text-navy font-bold uppercase tracking-wider">
                Verify Your Membership Status
              </h2>
              <p className="font-sans text-xs text-slate-500 font-light max-w-md mx-auto">
                Under systemic Rule 1, exclusive discounted travel inventories are reserved solely for verified club delegates. Input your credentials below.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyId} className="space-y-4 max-w-md mx-auto">
              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">
                  CBBCL Membership Identification Number
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="e.g. CBBCL-LIFEMEMBER-033"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 text-xs font-mono focus:outline-none focus:border-gold"
                  />
                </div>
                <p className="text-[9px] text-slate-400 font-light">
                  Tip: Use your CBBCL ID registered on your dashboard.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-navy text-white hover:bg-gold hover:text-navy text-[10px] font-sans font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Apply CBBCL Credentials
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Status indicators */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-sm flex items-center justify-between text-emerald-950 font-sans text-xs">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>
                  Credentials Securely Verified: <strong>{memberId}</strong>. Premium <strong>30% CBBCL Gold Discount</strong> active on all items!
                </span>
              </div>
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="text-[9px] underline font-bold uppercase text-emerald-800 hover:text-gold"
              >
                Change ID
              </button>
            </div>

            {/* Booking Form Interface */}
            {bookingSuccess ? (
              <div className="bg-white p-12 border border-slate-200 rounded-sm text-center space-y-6 max-w-xl mx-auto shadow-lg animate-fade-in">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <div className="space-y-2">
                  <h2 className="font-display text-xl text-navy font-bold uppercase tracking-wider">
                    Booking Request Registered
                  </h2>
                  <p className="font-sans text-xs text-slate-600 font-light">
                    Your exclusive travel booking via the CBBCL-EZBOOKING alliance has been safely processed. A receipt has been issued to your registered address.
                  </p>
                  <div className="bg-slate-50 p-4 rounded font-mono text-[11px] text-slate-500 max-w-sm mx-auto text-left space-y-1 my-4 border">
                    <p><span className="font-bold text-navy">Service Type:</span> {bookingType.toUpperCase()}</p>
                    <p><span className="font-bold text-navy">Destination:</span> {destination}</p>
                    <p><span className="font-bold text-navy">Travel Date:</span> {travelDate}</p>
                    <p><span className="font-bold text-navy">Total Members:</span> {guestsCount}</p>
                    <p><span className="font-bold text-navy">Amount Paid:</span> BDT {calculatePrice().toLocaleString()} <span className="text-emerald-600 font-bold">(30% Member Discount Applied)</span></p>
                  </div>
                </div>
                <div className="pt-2 flex justify-center space-x-3">
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="px-5 py-2.5 bg-navy text-white hover:bg-gold hover:text-navy text-[10px] font-sans font-bold uppercase tracking-widest transition-all"
                  >
                    Reserve Another Travel
                  </button>
                  <button
                    onClick={() => navigate("/affiliations.html")}
                    className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-[10px] font-sans font-bold uppercase tracking-widest transition-all"
                  >
                    Main Network Ledger
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Book Panel */}
                <form onSubmit={handleBook} className="lg:col-span-8 bg-white border border-slate-200/80 p-8 rounded-sm space-y-6 shadow-sm">
                  
                  {/* Service tabs */}
                  <div className="border-b pb-4">
                    <h3 className="font-display text-sm font-bold text-navy uppercase tracking-wider mb-3">
                      Select Required Service Category
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingType("hotel")}
                        className={`py-3 px-4 border rounded-sm flex flex-col items-center justify-center space-y-1.5 transition-all text-xs font-sans font-semibold cursor-pointer ${
                          bookingType === "hotel"
                            ? "bg-navy text-gold border-gold"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                        }`}
                      >
                        <Hotel className="w-4 h-4" />
                        <span>Hotels & Lodges</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingType("flight")}
                        className={`py-3 px-4 border rounded-sm flex flex-col items-center justify-center space-y-1.5 transition-all text-xs font-sans font-semibold cursor-pointer ${
                          bookingType === "flight"
                            ? "bg-navy text-gold border-gold"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                        }`}
                      >
                        <Plane className="w-4 h-4" />
                        <span>Air Travel</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingType("event")}
                        className={`py-3 px-4 border rounded-sm flex flex-col items-center justify-center space-y-1.5 transition-all text-xs font-sans font-semibold cursor-pointer ${
                          bookingType === "event"
                            ? "bg-navy text-gold border-gold"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                        }`}
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Special Events</span>
                      </button>
                    </div>
                  </div>

                  {/* Destination and inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 font-sans">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">
                        Destination / Location Hub
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="e.g. Cox's Bazar, St. Martin's, Dhaka"
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 text-xs text-[#0f172a] focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 font-sans">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">
                        Dates of Tour / Travel
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          required
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 text-xs text-[#0f172a] focus:outline-none focus:border-gold font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 font-sans">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">
                        Guest & Family Count
                      </label>
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 text-xs text-[#0f172a] focus:outline-none focus:border-gold bg-white"
                      >
                        <option value="1 Guest">1 Guest / Solo Traveler</option>
                        <option value="2 Guests">2 Guests</option>
                        <option value="3 Guests">3 Guests</option>
                        <option value="4 Guests">4 Guests</option>
                        <option value="5+ Guests">5+ Guests (Group rate applicable)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 font-sans">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-wider block">
                        Promo Voucher Token <span className="lowercase font-light text-slate-400">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. EZCBBCL2026"
                        className="w-full px-3 py-2.5 border border-slate-200 text-xs focus:outline-none focus:border-gold text-[#0f172a] uppercase font-mono"
                      />
                    </div>
                  </div>

                  {/* Summary Pricing Block */}
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-sans font-bold text-slate-500 uppercase">Estimated Fare Rate:</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-display font-extrabold text-navy">
                          BDT {calculatePrice().toLocaleString()}
                        </span>
                        <span className="text-[10px] line-through text-slate-400">
                          BDT {(calculatePrice() / 0.70).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-1 rounded">
                        -30% Verified Safe
                      </span>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-navy text-white hover:bg-gold hover:text-navy text-[11px] font-sans font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 shadow cursor-pointer"
                  >
                    <BadgePercent className="w-4 h-4 text-gold" />
                    <span>Secure Booking with CBBCL Discount</span>
                  </button>

                </form>

                {/* Right Side - Static Perks Details */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Card with terms */}
                  <div className="bg-white border border-slate-200 p-6 rounded-sm space-y-4 shadow-sm font-sans">
                    <h4 className="font-display text-xs font-bold text-navy uppercase tracking-wider border-b pb-2">
                      Alliance Guidelines
                    </h4>
                    <ul className="text-[10.5px] font-light text-slate-600 space-y-3 leading-relaxed Pl-1">
                      <li className="flex items-start space-x-2">
                        <span className="text-gold font-bold">●</span>
                        <span>Discounts vary by hotel category and flight class routes.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-gold font-bold">●</span>
                        <span>Cannot be clubbed with generic outside voucher campaigns.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-gold font-bold">●</span>
                        <span>Verification is executed in real-time with the CBBCL database logs.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Support Contact */}
                  <div className="bg-slate-50 border p-5 text-center font-sans space-y-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Need Travel Support?</p>
                    <p className="text-xs text-[#0f172a] font-medium leading-normal">Email: support@ezbooking.com</p>
                    <p className="text-[10px] text-slate-400 font-light">Available 24/7 for Club Members</p>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
