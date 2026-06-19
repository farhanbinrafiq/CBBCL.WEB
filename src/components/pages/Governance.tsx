import { useState, useEffect } from "react";
import { FileText, Award, Gavel, Scale, ShieldAlert, Anchor, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";

interface GovernanceProps {
  initialSection?: string;
}

export default function Governance({ initialSection = "articles" }: GovernanceProps) {
  const [activeTab, setActiveTab] = useState(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveTab(initialSection);
      const element = document.getElementById(initialSection);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [initialSection]);

  const tabs = [
    { id: "articles", label: "Articles of Association", icon: FileText },
    { id: "constitution", label: "Club Constitution", icon: Scale },
    { id: "rules", label: "Club & Sailing Rules", icon: Gavel },
    { id: "committees", label: "Standing Committees", icon: Award }
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const committees = [
    { title: "Executive Administration Board", chair: "Syfuddin Khaled (Director Administration)", duty: "Oversees general operations, recruitment of security staff, and reciprocal tie-ups." },
    { title: "Finance & Audit Committee", chair: "Arifur Rahman (Director Finance)", duty: "Enforces financial discipline, issues audited spreadsheets, manages treasury balances." },
    { title: "Membership Scrutiny Committee", chair: "Humayun Kabir Robel (Founding President)", duty: "Evaluates candidates, runs compliance background checks, confirms nomination registry entries." },
    { title: "Marine Safety & Sailing Council", chair: "Founding Director A.K. Rubel", duty: "Sets yacht docking safety procedures, handles slipway protocols, certifies sailing dinghy licenses." },
    { title: "Sports & Snooker Committee", chair: "Founding Director Nurul Absar", duty: "Arranges billiard tournaments, squash challenges, tennis championships, and maintains sports facilities." },
    { title: "Cultural & Literary Circle", chair: "Founding Director Maimunal Karim Jisan", duty: "Organizes symphony evenings, library recitals, national day tributes, and coastal art festivals." },
    { title: "Ecological CSR Commission", chair: "Founding Director Mehedi Hasan", duty: "Initiates beachfront plastic cleanups, manages bio-engineering sand-dune stabilization." },
    { title: "Disciplinary & Ethics Panel", chair: "Founding Vice President Farhan Bin Rafiq", duty: "Maintains member conduct guidelines, solves grievances, enforces strict dress code codes." }
  ];

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Editorial Page Header */}
      <section className="relative h-72 bg-navy flex items-center justify-center overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 w-full h-full">
          <BackgroundVideo
            src={MASTER_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-3">
          <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Ltd.
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extralight text-white tracking-tight">
            Club Governance & <span className="font-serif italic text-gold">Regulatory Framework</span>
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gold">Club Governance</span>
          </div>
        </div>
      </section>

      {/* Main Structural Layout with Side Sticky Menu */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Side Tabs Menu */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 space-y-4">
            <div className="bg-white border border-slate-200/80 p-5 rounded-xs shadow-sm space-y-4">
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#1a2744] block border-b border-slate-100 pb-2">
                Governance Index
              </span>
              <nav className="flex flex-col space-y-1">
                {tabs.map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xs text-xs font-sans font-medium transition-all ${
                        isActive
                          ? "bg-navy text-gold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                      }`}
                    >
                      <IconComp className={`w-4 h-4 ${isActive ? "text-gold" : "text-slate-400"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Compliant Badge */}
            <div className="bg-slate-50 p-6 rounded-xs border border-slate-200 flex flex-col justify-between space-y-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <h4 className="font-display text-sm text-text-dark font-bold uppercase leading-tight">RJSC Registered</h4>
              <p className="font-sans text-[10px] text-slate-500 leading-relaxed font-light">
                Cox's Bazar Boat Club Limited operates as a non-profit company with liability limited by guarantee under RJSC Registry, Bangladesh.
              </p>
            </div>
          </aside>

          {/* Detailed Content Panel area */}
          <div className="lg:col-span-9 space-y-16">
            
            {/* 1. ARTICLES OF ASSOCIATION */}
            <article id="articles" className="bg-white p-8 md:p-10 border border-slate-200/60 rounded-xs shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="font-sans text-[9px] font-semibold tracking-[0.2em] text-text-gold uppercase block">
                  Charter Code 01
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-text-dark font-light tracking-tight pb-3 border-b border-slate-150">
                  Articles of Association — <span className="font-serif italic font-normal text-gold">The General Charter</span>
                </h2>
              </div>

              <div className="space-y-4 font-sans text-xs sm:text-[13px] text-text-body font-light tracking-wide leading-relaxed">
                <p>
                  As registered under <strong>The Companies Act, 1994</strong>, the Articles of Association dictate the definitive 
                  corporate governance and strict compliance codes of Cox's Bazar Boat Club Limited.
                </p>
                
                <h4 className="font-display text-base text-text-dark font-bold uppercase tracking-wider pt-2">Key Constitutional Bylaws:</h4>
                <ul className="space-y-3 font-sans text-xs font-light text-slate-700">
                  <li className="flex items-start space-x-2.5">
                    <span className="text-gold font-bold">1.1</span>
                    <span><strong>Liability Shield:</strong> The liability of verified members of CBBCL is limited strictly by guarantee. Each member covenants to contribute no more than 1,000 BDT in case of liquidation, preserving their private capital fields safely.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-gold font-bold">1.2</span>
                    <span><strong>Non-Profit Principle:</strong> The club is a dedicated non-profit entity. Any profits, cash balances, or real estate assets accumulated must be reinvested solely into building marina utilities, and supporting beach preservation. No dividend distribution is allowed.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-gold font-bold">1.3</span>
                    <span><strong>The Executive Board:</strong> The general policy management resides strictly with an elected 15-member Board of Directors, headed actively by the Founding President, ensuring consistent professional oversight.</span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 2. CLUB CONSTITUTION */}
            <article id="constitution" className="bg-white p-8 md:p-10 border border-slate-200/60 rounded-xs shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="font-sans text-[9px] font-semibold tracking-[0.2em] text-text-gold uppercase block">
                  Charter Code 02
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-text-dark font-light tracking-tight pb-3 border-b border-slate-150">
                  The Club Constitution — <span className="font-serif italic font-normal text-gold">Membership Standards</span>
                </h2>
              </div>

              <div className="space-y-4 font-sans text-xs sm:text-[13px] text-text-body font-light tracking-wide leading-relaxed">
                <p>
                  Our constitutional frame outlines the core regulations that define our community. It details membership eligibility, 
                  nomination guidelines, and administrative limits.
                </p>

                <div className="p-5 bg-slate-50 border-l-[3px] border-gold space-y-2">
                  <h4 className="font-display text-sm font-semibold text-text-dark uppercase">Constitution Sections Brief:</h4>
                  <p className="font-sans text-xs font-light text-slate-600 leading-relaxed">
                    The total number of voting members (Donor, Life, and Permanent class) is capped strictly by the executive board to guarantee 
                    the highest levels of security and conversational intimacy within clubhouse decks.
                  </p>
                </div>

                <p>
                  Any amendments or updates to this constitution require a special majority resolution passed during the Annual General Meeting (AGM) 
                  with at least two-thirds of voting members present in person.
                </p>
              </div>
            </article>

            {/* 3. CLUB RULES */}
            <article id="rules" className="bg-white p-8 md:p-10 border border-slate-200/60 rounded-xs shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="font-sans text-[9px] font-semibold tracking-[0.2em] text-text-gold uppercase block">
                  Charter Code 03
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-text-dark font-light tracking-tight pb-3 border-b border-slate-150">
                  Clubhouse Conduct & <span className="font-serif italic font-normal text-gold">Sailing Rules</span>
                </h2>
              </div>

              <div className="space-y-4 font-sans text-xs sm:text-[13px] text-text-body font-light tracking-wide leading-relaxed">
                <p>
                  To secure the refined atmosphere of Cox's Bazar Boat Club Limited, all members, reciprocal visitors, and guests 
                  must abide by our strict conduct rules:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-bg-primary rounded-xs border border-slate-200/60 space-y-1">
                    <h5 className="font-sans font-semibold text-text-dark text-xs uppercase tracking-wider">A. Gentleman & Lady Dress Codes</h5>
                    <p className="font-sans text-[11px] text-slate-650 font-light leading-relaxed">
                      Smart-casual attire is required across all dining rooms and library lounges at all times. Athletic sandals, shorts (excluding designated tennis courts), and sleeveless tops aren't permitted inside the Club Lounge or main restaurant after 6:00 PM.
                    </p>
                  </div>

                  <div className="p-4 bg-bg-primary rounded-xs border border-slate-200/60 space-y-1">
                    <h5 className="font-sans font-semibold text-text-dark text-xs uppercase tracking-wider">B. Yacht Docking & Slipway Protocols</h5>
                    <p className="font-sans text-[11px] text-slate-650 font-light leading-relaxed">
                      All recreational sailboats, motorboats, and high-speed jet skis utilizing CBBCL's slipway must possess official registration with the Marine Safety & Sailing Council. Operational logs and life preserver jackets are mandatory before leaving the marina boundaries.
                    </p>
                  </div>

                  <div className="p-4 bg-bg-primary rounded-xs border border-slate-200/60 space-y-1">
                    <h5 className="font-sans font-semibold text-text-dark text-xs uppercase tracking-wider">C. Guest Registration Fees</h5>
                    <p className="font-sans text-[11px] text-slate-650 font-light leading-relaxed">
                      Guests must be registered on the physical registry book at the reception lobby. A nominal guest tariff is debited, and the host member maintains full responsibility for their guest's compliance during their visit.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* 4. STANDING COMMITTEES */}
            <article id="committees" className="bg-white p-8 md:p-10 border border-slate-200/60 rounded-xs shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="font-sans text-[9px] font-semibold tracking-[0.2em] text-text-gold uppercase block">
                  Charter Code 04
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-text-dark font-light tracking-tight pb-3 border-b border-slate-150">
                  The Primary Working <span className="font-serif italic font-normal text-gold">Committees</span>
                </h2>
              </div>

              <div className="space-y-4 font-sans text-xs sm:text-[13px] text-text-body font-light tracking-wide leading-relaxed">
                <p>
                  To manage key operations, the Board divides executive oversight into eight distinct standing committees:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {committees.map((com, index) => (
                    <div key={index} className="p-5 bg-bg-secondary border border-slate-200 rounded-sm flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <span className="font-sans text-[8px] font-bold text-gold uppercase tracking-wider block">Committee {index + 1}</span>
                        <h4 className="font-display text-sm font-semibold text-text-dark leading-tight">{com.title}</h4>
                        <p className="font-sans text-[11px] text-text-body font-light leading-relaxed pt-1">
                          {com.duty}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-150 text-[10px] text-navy font-semibold">
                        Chair: {com.chair}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>
    </div>
  );
}
