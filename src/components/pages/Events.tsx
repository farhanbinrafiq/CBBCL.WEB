import React, { useState } from "react";
import { getCMSEvents } from "../../utils/cmsStorage";
import CardMedia from "../CardMedia";
import { Calendar, MapPin, Users, Ticket, X, Check, Anchor, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Events() {
  const [allEvents] = useState(getCMSEvents());
  const upcomingEvents = allEvents.filter(e => e.isUpcoming);
  const pastEvents = allEvents.filter(e => !e.isUpcoming);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketQty, setTicketQty] = useState("1");
  const [memberCode, setMemberCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleOpenRegistration = (eventTitle: string) => {
    setSelectedEvent(eventTitle);
    setIsModalOpen(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberCode.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
        setTicketQty("1");
        setMemberCode("");
      }, 4000);
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Editorial Page Header */}
      <section className="relative h-72 bg-navy flex items-center justify-center overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center">
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-3">
          <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Ltd.
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extralight text-white tracking-tight">
            Nautical Calendar & <span className="font-serif italic text-gold">Members' Assemblies</span>
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gold">Club Calendar</span>
          </div>
        </div>
      </section>

      {/* Intro Context */}
      <section className="py-12 bg-white border-b border-slate-100 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="font-sans text-[9px] uppercase tracking-widest text-[#c9a84c] font-semibold">
            The Active Almanac
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-light text-text-dark tracking-tight">
            Schedule of Prestigious Gatherings & Water Contests
          </h2>
          <p className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed">
            The social calendar of Cox's Bazar Boat Club Limited is designed to deliver both intellectual inspiration 
            and physical recreation. From formal gala banquets under the stars to competitive snipe sailboat regattas, 
            discover key milestones of the founding cohort below.
          </p>
        </div>
      </section>

      {/* 1. UPCOMING EVENTS */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-10">
        <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
          <div className="space-y-1">
            <span className="font-sans text-[9px] uppercase tracking-widest text-gold font-semibold block">
              Active Calendar
            </span>
            <h3 className="font-display text-xl md:text-2xl text-text-dark font-semibold">
              Crucial Upcoming Assemblies
            </h3>
          </div>
          <span className="bg-gold/10 text-gold-dark font-sans text-[8px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">
            ● Booking Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-slate-200 rounded-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Cover card overlay content */}
              <div className="relative h-48 overflow-hidden bg-navy">
                <CardMedia
                  media={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover filter brightness-95"
                />
                
                {/* Date tag badge */}
                <div className="absolute top-4 left-4 bg-navy text-center px-3.5 py-2 border border-gold">
                  <span className="block font-display text-xl text-gold font-bold leading-none">{event.day}</span>
                  <span className="block font-sans text-[8px] text-slate-200 uppercase tracking-widest mt-1">
                    {event.month}
                  </span>
                </div>
              </div>

              {/* Text content details */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-0.5 bg-slate-50 text-slate-500 font-sans text-[9px] uppercase tracking-wider rounded-xs border border-slate-100">
                    {event.category}
                  </span>
                  <h4 className="font-display text-[17px] font-bold text-text-dark leading-snug">
                    {event.title}
                  </h4>
                  <p className="font-sans text-xs text-text-body font-light leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center space-x-2 text-[11px] font-sans text-slate-500">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span className="truncate">{event.venue}</span>
                  </div>

                  <p className="text-[10px] font-sans italic text-slate-400 bg-slate-50/70 p-3 rounded-xs leading-relaxed border-l border-gold-dark/40">
                    {event.registrationInfo}
                  </p>

                  <button
                    onClick={() => handleOpenRegistration(event.title)}
                    className="w-full py-2.5 bg-[#1a2744] hover:bg-gold hover:text-navy text-white text-[10px] font-sans font-semibold uppercase tracking-widest transition-colors text-center"
                  >
                    Send Reservation RSVP
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. PAST EVENTS */}
      <section className="py-16 px-6 max-w-6xl mx-auto bg-slate-50/60 border-t border-slate-150 rounded-lg shadow-inner mb-20 space-y-10">
        <div className="border-b border-slate-200 pb-4">
          <span className="font-sans text-[9px] uppercase tracking-widest text-[#1a2744] font-semibold block">
            The Historical Roll
          </span>
          <h3 className="font-display text-xl md:text-2xl text-text-dark font-semibold mt-1">
            Historic Archives & Completed Chronicles
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pastEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-slate-200 rounded-sm p-6 flex flex-col justify-between h-96 group hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <div className="flex justify-between text-slate-400 font-sans text-[10px] items-center">
                  <span className="uppercase text-gold font-bold">{event.category}</span>
                  <span>{event.month} {event.day}</span>
                </div>

                {event.image && (
                  <div className="h-28 overflow-hidden rounded-xs bg-slate-100 border">
                    <CardMedia
                      media={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover filter saturate-50 group-hover:saturate-100 transition-all duration-300"
                    />
                  </div>
                )}

                <h4 className="font-display text-base font-semibold text-text-dark leading-snug line-clamp-2">
                  {event.title}
                </h4>

                <p className="font-sans text-xs text-text-body font-light line-clamp-3 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50 text-[10px] font-sans text-text-light flex items-center space-x-1.5 pt-3">
                <MapPin className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP Booking Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-navy/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
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
                <div className="flex items-center space-x-2 text-gold">
                  <Ticket className="w-5 h-5" />
                  <span className="font-sans text-[10px] font-bold tracking-widest uppercase mt-0.5">
                    Official Assembly Ticket Desk
                  </span>
                </div>
                <h3 className="font-display text-xl text-text-dark font-semibold">
                  Register: {selectedEvent}
                </h3>
                <p className="font-sans text-[11px] text-text-body font-light leading-relaxed">
                  Secure your reservations or team registration. Your billing, dietary options, guest slips will be debited onto your monthly ledger database.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans rounded text-center my-4 space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-semibold text-sm">RSVP Registered successfully!</p>
                  <p className="text-slate-600">Administrative hosts have locked down your seats. QR badge ticket invitations will dispatch direct to your logged phone registry shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Your Unique Club Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={memberCode}
                      onChange={(e) => setMemberCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs focus:bg-white focus:border-gold outline-none transition-colors"
                      placeholder="e.g. CBBCL-MEMBER-2026-X"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Seat Quantity Preferred *
                    </label>
                    <select
                      value={ticketQty}
                      onChange={(e) => setTicketQty(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs focus:bg-white focus:outline-none"
                    >
                      <option value="1">1 Member Seat Only (Complimentary)</option>
                      <option value="2">2 Seats (Member + Spouse/Guest)</option>
                      <option value="4">4 Seats (Family block)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1a2744] hover:bg-gold hover:text-navy text-white font-sans text-xs font-semibold uppercase tracking-widest transition-all mt-4"
                  >
                    Confirm Member RSVP Assembly Seat
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
