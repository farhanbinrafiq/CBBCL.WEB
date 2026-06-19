import React, { useState } from "react";
import { getCMSFacilities } from "../../utils/cmsStorage";
import CardMedia from "../CardMedia";
import { MapPin, Users, Calendar, Clock, Anchor, ShieldCheck, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MASTER_HERO_VIDEO } from "../../data";

export default function Facilities() {
  const [facilities] = useState(getCMSFacilities());
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({ date: "", time: "", guests: "2", memberId: "" });
  const [submittedBooking, setSubmittedBooking] = useState(false);

  const handleOpenBooking = (facilityName: string) => {
    setSelectedFacility(facilityName);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingFormData.date && bookingFormData.guests) {
      setSubmittedBooking(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmittedBooking(false);
        setBookingFormData({ date: "", time: "", guests: "2", memberId: "" });
      }, 4000);
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Editorial Page Header */}
      <section className="relative h-72 bg-navy flex items-center justify-center overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
            src={MASTER_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-3">
          <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Ltd.
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extralight text-white tracking-tight">
            Clubhouse <span className="font-serif italic text-gold">Facilities & Enclaves</span>
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gold">Clubhouse Facilities</span>
          </div>
        </div>
      </section>

      {/* Intro text */}
      <section className="py-12 bg-white border-b border-slate-100 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-sans text-[9px] uppercase tracking-widest text-[#c9a84c] font-semibold">
            Premium Spaces
          </span>
          <h2 className="font-display text-2xl md:text-3.5xl font-light text-text-dark tracking-tight">
            Designed for Oceanfront Serenity and Distinction
          </h2>
          <p className="font-sans text-[11px] sm:text-xs text-text-body leading-relaxed font-light">
            Every room, lounge, and deck within Cox's Bazar Boat Club Limited has been conceptualized under 
            the guidance of world-class resort architects. We balance premium luxury with maritime engineering, 
            ensuring a sanctuary tailored to the highly specific lifestyle of our members.
          </p>
        </div>
      </section>

      {/* Facilities Grid with Alternating Cards */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="space-y-24">
          {facilities.map((fac, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={fac.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Visual Block Column */}
                <div
                  className={`lg:col-span-6 relative group ${
                    isEven ? "order-1" : "order-1 lg:order-2"
                  }`}
                >
                  <div className="absolute -inset-2 border border-gold/30 transform translate-x-3 translate-y-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"></div>
                  <div className="relative overflow-hidden bg-navy-mid border border-gold/60 max-h-[380px] h-[340px]">
                    <CardMedia
                      media={fac.image}
                      alt={fac.name}
                      className="w-full h-full object-cover filter saturate-75 brightness-95 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                    />
                  </div>
                </div>

                {/* Content Details Column */}
                <div
                  className={`lg:col-span-6 space-y-6 ${
                    isEven ? "order-2" : "order-2 lg:order-1"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-gold font-semibold">
                      Enclave {index + 1}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-text-dark font-light tracking-tight pb-2 border-b border-slate-100">
                      {fac.name}
                    </h3>
                  </div>

                  <p className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed">
                    {fac.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {fac.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs font-sans text-slate-700">
                        <Check className="w-4 h-4 text-gold shrink-0" />
                        <span className="font-light">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 font-sans text-xs text-text-light">
                      <Users className="w-4 h-4 text-gold" />
                      <span>Capacity guideline: <strong>{fac.capacity}</strong></span>
                    </div>

                    {fac.id !== "developments" && (
                      <button
                        onClick={() => handleOpenBooking(fac.name)}
                        className="bg-[#1a2744] text-white px-5 py-2 hover:bg-gold hover:text-navy text-[10px] font-sans font-semibold uppercase tracking-widest rounded-xs transition-colors self-start"
                      >
                        Request Reservation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reservation Query Modal Pop-up */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-navy/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gold w-full max-w-md p-6 relative rounded-sm shadow-2xl"
            >
              {/* Close Button Header */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-gold hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2.5 text-gold-dark">
                  <Anchor className="w-5 h-5" />
                  <span className="font-sans text-[10px] font-bold tracking-widest uppercase mt-0.5">
                    Member Registry Reservation
                  </span>
                </div>
                <h3 className="font-display text-xl text-text-dark font-semibold">
                  Inquire Space: {selectedFacility}
                </h3>
                <p className="font-sans text-[11px] text-text-body font-light leading-relaxed">
                  Submit this query directly to the Clubhouse Reception Coordinator. Reservation guarantees will be finalized upon corporate code endorsement.
                </p>
              </div>

              {submittedBooking ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans rounded text-center my-4 space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-semibold text-sm">Reservation Request Submitted!</p>
                  <p className="text-slate-600">The reception host is cross-checking our calendar schedule. Rest assured, you will receive an SMS and email.</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Your Membership Code *
                    </label>
                    <input
                      type="text"
                      required
                      name="memberId"
                      value={bookingFormData.memberId}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, memberId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs focus:bg-white focus:border-gold outline-none transition-colors"
                      placeholder="e.g., CBBCL-ACTIVE-2026-X"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                        Date Required *
                      </label>
                      <input
                        type="date"
                        required
                        name="date"
                        value={bookingFormData.date}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, date: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs focus:bg-white focus:border-gold outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                        Number of guests *
                      </label>
                      <select
                        name="guests"
                        value={bookingFormData.guests}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, guests: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs focus:bg-white focus:border-gold outline-none"
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 - 4 Guests</option>
                        <option value="5">5 - 10 Guests</option>
                        <option value="11">11+ (Catering Event)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1a2744] hover:bg-gold hover:text-navy text-white font-sans text-xs font-semibold uppercase tracking-widest transition-all mt-4"
                  >
                    Submit Booking Enquiry
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
