import React from "react";
import { RoutePath } from "../../types";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";

interface AffiliationsProps {
  navigate: (path: RoutePath) => void;
}

export default function Affiliations({ navigate }: AffiliationsProps) {
  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Page Header */}
      <section className="relative h-72 bg-navy flex items-center justify-center overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 w-full h-full">
          <BackgroundVideo
            src={MASTER_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 overflow-hidden">
          <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Ltd.
          </p>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extralight text-white tracking-tight break-words whitespace-normal leading-tight">
            Reciprocal Bonds & <span className="font-serif italic text-gold">Affiliated Clubs</span>
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <span className="cursor-pointer hover:text-gold" onClick={() => navigate("/")}>Home</span>
            <span>&gt;</span>
            <span className="text-gold">Reciprocal Networks</span>
          </div>
        </div>
      </section>

      {/* Intro Context */}
      <section className="py-12 bg-white border-b border-slate-100 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="font-sans text-[9px] uppercase tracking-widest text-[#c9a84c] font-semibold">
            The Reciprocal Grid
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-light text-text-dark tracking-tight">
            Privileged Access Beyond Cox's Bazar Shorelines
          </h2>
          <p className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed">
            In keeping with our vision to deliver exceptional value to our elite members, Cox's Bazar Boat Club Limited 
            maintains direct reciprocal ties with leading private recreational entities. CBBCL members can enjoy 
            exclusive access to sports lounges, private pools, tennis courts, and guest lodges while travelling in Dhaka, 
            Chittagong, and other regional hubs.
          </p>
        </div>
      </section>

      {/* Reciprocal protocol guidance block */}
      <section className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto p-8 bg-slate-50 border border-slate-200 rounded-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <h4 className="font-display text-lg text-text-dark font-semibold">Are You Travelling in Reciprocal Hubs?</h4>
            <p className="font-sans text-xs text-slate-600 font-light leading-relaxed">
              Before visiting our affiliate locations, you must request an official CBBCL Introduction Card from the Club Registrar. This guarantees smooth clearance at affiliate security rails.
            </p>
          </div>
          <div className="md:col-span-4 text-center md:text-right">
            <a
              href="mailto:registry@cbbcl.org"
              className="py-3 px-5 bg-[#1a2744] text-white hover:bg-gold hover:text-navy text-[10px] font-sans font-semibold uppercase tracking-widest inline-block transition-colors"
            >
              Email Registrar Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
