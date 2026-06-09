import React, { useState, useEffect } from "react";
import { RoutePath } from "../../types";
import { getBoardMembers, getNewsPosts, getDirectorPortrait } from "../../utils/storage";
import { getPageContent, getCMSFacilities, getCMSEvents, getCMSAffiliations } from "../../utils/cmsStorage";
import BoardProfileCard from "../BoardProfileCard";
import { getHomeLayoutCMS } from "../../utils/homeCmsStorage";
import { ArrowRight, Quote, Calendar, MapPin, Mail, Phone, Clock, Anchor, Users, Shield, Award, Sparkles } from "lucide-react";
import { motion } from "motion/react";
// @ts-ignore
import cruiseHero from "../../assets/images/cruise_hero_1780825257603.png";

interface HomeProps {
  navigate: (path: RoutePath) => void;
}

export default function Home({ navigate }: HomeProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });

  const [cms, setCms] = useState(getPageContent());
  const [news, setNews] = useState(getNewsPosts());
  const [facilities, setFacilities] = useState(getCMSFacilities());
  const [events, setEvents] = useState(getCMSEvents());
  const [affiliations, setAffiliations] = useState(getCMSAffiliations());
  const [directors, setDirectors] = useState(getBoardMembers());
  const [homeCms, setHomeCms] = useState(getHomeLayoutCMS());

  useEffect(() => {
    // Force active state refresh on component load
    setCms(getPageContent());
    setNews(getNewsPosts());
    setFacilities(getCMSFacilities());
    setEvents(getCMSEvents());
    setAffiliations(getCMSAffiliations());
    setDirectors(getBoardMembers());
    setHomeCms(getHomeLayoutCMS());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: "", phone: "", email: "", message: "" });
      }, 5000);
    }
  };

  const isOldCover = !cms.home.heroCover || 
    cms.home.heroCover.includes("photo-1544551763-46a013bb70d5") || 
    cms.home.heroCover.includes("photo-1507525428034-b723cf961d3e") || 
    cms.home.heroCover.includes("photo-1505242844900-19279f22006");

  const currentHeroCoverImage = homeCms.sections.hero.image || (isOldCover ? cruiseHero : cms.home.heroCover);

  return (
    <div className="bg-bg-primary overflow-x-hidden">
      {homeCms.order.map((sectionKey) => {
        // Evaluate dynamic section config
        switch (sectionKey) {
          case "hero": {
            const h = homeCms.sections.hero;
            if (!h.enabled) return null;
            return (
              <section key="hero" className="relative h-screen flex items-center justify-center bg-navy overflow-hidden">
                {/* Background Coast Image with dark overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                  style={{ backgroundImage: `url('${h.image || currentHeroCoverImage}')` }}
                >
                  {h.overlayEnabled && <div className="absolute inset-0 bg-navy/80 mix-blend-multiply"></div>}
                  {h.overlayEnabled && <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/50"></div>}
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white space-y-8">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="font-sans text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-gold"
                  >
                    Cox's Bazar · Bangladesh · Estd. 2026
                  </motion.p>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                    className="font-display font-light uppercase tracking-tight text-white text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-none"
                  >
                    {h.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-2xl mx-auto font-sans text-xs sm:text-sm text-slate-300 font-light tracking-wide leading-relaxed"
                  >
                    {h.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
                  >
                    <button
                      onClick={() => navigate(h.cta1Link as RoutePath)}
                      className="w-full sm:w-auto px-8 py-3.5 bg-gold text-navy font-sans text-[11px] font-semibold uppercase tracking-widest hover:bg-gold-light hover:scale-105 transition-all shadow-lg text-center cursor-pointer"
                    >
                      {h.cta1Text}
                    </button>
                    <button
                      onClick={() => navigate(h.cta2Link as RoutePath)}
                      className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white border border-white/40 font-sans text-[11px] font-semibold uppercase tracking-widest hover:bg-white hover:text-navy transition-all text-center cursor-pointer"
                    >
                      {h.cta2Text}
                    </button>
                  </motion.div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1.5 opacity-70 animate-bounce">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">Scroll</span>
                  <div className="w-[1px] h-8 bg-gold-light"></div>
                </div>
              </section>
            );
          }

          case "stats": {
            const s = homeCms.sections.stats;
            if (!s.enabled) return null;
            return (
              <section key="stats" className="bg-navy-mid border-y border-navy-light py-10 px-6 text-slate-200">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div className="space-y-1.5">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-gold block">{s.labelEvents || "Incorporated"}</span>
                    <span className="font-display text-2xl md:text-3xl text-white font-medium">{s.metricEvents || "Estd. 2026"}</span>
                  </div>
                  <div className="space-y-1.5 border-l border-slate-700/50">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-gold block">{s.labelMembers || "Founding Circle"}</span>
                    <span className="font-display text-2xl md:text-3xl text-white font-medium">{s.metricMembers || "35+"}</span>
                  </div>
                  <div className="space-y-1.5 border-l border-slate-700/50">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-gold block">{s.labelVessels || "Curated Luxury"}</span>
                    <span className="font-display text-2xl md:text-3xl text-white font-medium">{s.metricVessels || "15+"}</span>
                  </div>
                  <div className="space-y-1.5 border-l border-slate-700/50">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-gold block">{s.labelTonnage || "Scenic Anchorage"}</span>
                    <span className="font-display text-2xl md:text-3xl text-white font-medium">{s.metricTonnage || "Cox's Bazar"}</span>
                  </div>
                </div>
              </section>
            );
          }

          case "president": {
            const p = homeCms.sections.president;
            if (!p.enabled) return null;
            const targetPresident = directors.find(d => d.id === "humayun-kabir-robel") || directors[0];
            const presPhoto = p.image || targetPresident?.photoUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800";
            const presName = p.name || targetPresident?.name || "Humayun Kabir Robel";
            const presDesignation = p.designation || targetPresident?.designation || "Founding President";
            const bioLines = p.bio && p.bio.length > 0 ? p.bio : (targetPresident?.bio || [
              "In constructing the permanent pillars of Cox's Bazar Boat Club Limited, our mission transcends establishing a conventional leisure resort. We are erecting Bangladesh’s absolute benchmark for private oceanfront companionship and nautical lifestyle.",
              "Cox's Bazar boasts the longest natural sea beach on earth. Yet, until now, it has lacked an integrated, elite socio-maritime harbor comparable in stature to historic South Asian hubs. CBBCL permanently bridges this gap."
            ]);

            return (
              <section key="president" id="president-session" className="py-24 px-6 bg-bg-primary">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* Left Side: Photo Framed */}
                  <div className="lg:col-span-12 xl:col-span-5 relative group">
                    <div className="absolute -inset-2 border border-gold/40 transform translate-x-3 translate-y-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"></div>
                    <div className="relative overflow-hidden bg-navy-mid border border-gold">
                      <img
                        src={presPhoto}
                        alt="President photo representation"
                        className="w-full h-[460px] object-cover object-top transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-navy/90 p-4 border-t border-gold text-center">
                        <span className="font-display text-lg text-white font-light tracking-wide">{presName}</span>
                        <span className="block font-sans text-[10px] text-gold uppercase tracking-widest">{presDesignation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Message text */}
                  <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                    <span className="font-sans text-[9px] font-semibold tracking-[0.25em] uppercase text-text-gold block">
                      Founding Leadership
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-light text-text-dark tracking-tight">
                      A Message from the <span className="font-serif italic font-normal text-gold">{presDesignation}</span>
                    </h2>

                    <div className="text-gold-dark/40">
                      <Quote className="w-12 h-12" />
                    </div>

                    <div className="space-y-4 font-sans text-[13px] text-text-body font-light tracking-wide leading-relaxed">
                      {bioLines.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <p className="font-display text-base text-text-dark font-medium">{presName}</p>
                      <p className="font-sans text-[10px] text-text-light uppercase tracking-widest font-semibold">
                        {presDesignation} — Cox's Bazar Boat Club Ltd.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          case "overview": {
            const ov = homeCms.sections.overview;
            if (!ov.enabled) return null;
            const img1 = ov.gallery[0] || currentHeroCoverImage;
            const img2 = ov.gallery[1] || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800";
            const isReversed = ov.layout === "reversed";

            return (
              <React.Fragment key="overview">
                <section className="py-24 px-6 bg-white border-y border-slate-100">
                  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Overlapping Images */}
                    <div className={`relative h-[480px] hidden md:block ${isReversed ? "lg:order-last" : "lg:order-first"}`}>
                      {/* Base block background */}
                      <div className="absolute top-[40px] left-[40px] w-4/5 h-[360px] border border-gold-light/40 rounded-sm"></div>
                      {/* Primary Large Image */}
                      <img
                        src={img1}
                        alt="Cox Bazar Coast Landscape"
                        className="absolute top-0 left-0 w-[70%] h-[340px] object-cover shadow-lg border border-slate-200"
                      />
                      {/* Overlapping Small Image */}
                      <img
                        src={img2}
                        alt="Lounge yacht view interior"
                        className="absolute bottom-0 right-0 w-[60%] h-[260px] object-cover shadow-2xl border-4 border-white"
                      />
                    </div>

                    {/* Text section */}
                    <div className={`space-y-6 ${isReversed ? "lg:order-first" : "lg:order-last"}`}>
                      <span className="font-sans text-[9px] font-semibold tracking-[0.25em] uppercase text-text-gold block">
                        Premium Heritage
                      </span>
                      <h2 className="font-display text-3xl md:text-5xl font-light text-text-dark tracking-tight">
                        {ov.title} <br />
                        <span className="font-serif italic text-gold font-normal">{ov.subtitle}</span>
                      </h2>

                      <p className="font-sans text-[13px] text-text-body font-light tracking-wide leading-relaxed">
                        {ov.text}
                      </p>

                      <p className="font-sans text-[13px] text-text-body font-light tracking-wide leading-relaxed">
                        {ov.welcomeText}
                      </p>

                      <div className="pt-4">
                        <button
                          onClick={() => navigate("/about.html")}
                          className="group flex items-center space-x-2 font-sans text-[10px] font-semibold tracking-widest text-[#1a2744] hover:text-gold uppercase cursor-pointer"
                        >
                          <span>Read More About Our Constitution</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* FULL-WIDTH BANNER Rendered cleanly inline with overview */}
                <section className="relative py-32 bg-navy flex items-center justify-center overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-fixed bg-center"
                    style={{ backgroundImage: `url('${currentHeroCoverImage}')` }}
                  >
                    <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
                  </div>

                  <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-6">
                    <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold font-semibold block">
                      Limited Invitation
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-extralight tracking-tight text-slate-100">
                      Discover Cox's Bazar's <span className="font-serif italic text-gold block sm:inline">Finest Coastal Sanctuary</span>
                    </h2>
                    <p className="max-w-xl mx-auto font-sans text-xs text-slate-300 font-light tracking-wide leading-relaxed">
                      Align your residency with Bangladesh's preeminent industrialists. Secure reciprocal entry to luxury city lodges and international clubs.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => navigate("/membership.html")}
                        className="px-6 py-3 bg-gold text-navy font-sans text-[10px] uppercase font-semibold tracking-widest hover:bg-gold-light hover:scale-105 transition-all inline-block shadow-lg cursor-pointer"
                      >
                        Apply For Registry Entry
                      </button>
                    </div>
                  </div>
                </section>
              </React.Fragment>
            );
          }

          case "facilities": {
            const fc = homeCms.sections.facilities;
            if (!fc.enabled) return null;
            const showcaseCount = fc.limit || 6;
            const selectedFacilities = facilities.slice(0, showcaseCount);

            return (
              <section key="facilities" id="facilities-showcase" className="py-24 px-6 bg-bg-primary">
                <div className="max-w-6xl mx-auto space-y-16">
                  <div className="text-center space-y-4">
                    <span className="font-sans text-[9px] font-semibold tracking-[0.25em] uppercase text-text-gold block">
                      Clubhouse Amenities
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-light text-text-dark tracking-tight">
                      An Exhibition of <span className="font-serif italic font-normal text-gold">Curated Lifestyle</span>
                    </h2>
                    <div className="w-16 h-[1px] bg-gold mx-auto mt-2"></div>
                  </div>

                  {/* Grid Layout 3x2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedFacilities.map((facility) => (
                      <div
                        key={facility.id}
                        onClick={() => navigate("/facilities.html")}
                        className="group relative h-[320px] overflow-hidden bg-navy-mid cursor-pointer shadow-md rounded-sm border border-slate-200/50"
                      >
                        {/* Facility Background */}
                        <img
                          src={facility.image}
                          alt={facility.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-50"
                        />

                        {/* Constant Bottom text bar */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/90 via-navy/60 to-transparent p-6 text-white group-hover:translate-y-full transition-transform duration-300">
                          <span className="font-sans text-[9px] text-gold uppercase tracking-widest leading-none block mb-1">
                            Capacity: {facility.capacity}
                          </span>
                          <h3 className="font-display text-xl font-light tracking-wide">{facility.name}</h3>
                        </div>

                        {/* Hover Overlay containing details */}
                        <div className="absolute inset-0 bg-navy/95 p-6 flex flex-col justify-between text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 border border-gold/30">
                          <div className="space-y-4">
                            <span className="font-sans text-[9px] text-gold uppercase tracking-widest leading-none block">
                              Capacity: {facility.capacity}
                            </span>
                            <h3 className="font-display text-2xl font-light text-gold-light border-b border-navy-light pb-2">
                              {facility.name}
                            </h3>
                            <p className="font-sans text-[11px] text-slate-300 font-light leading-relaxed truncate-3-lines">
                              {facility.description.split(".")[0]}.
                            </p>
                          </div>
                          <span className="font-sans text-[9px] uppercase font-semibold text-gold tracking-widest flex items-center space-x-1.5 self-end">
                            <span>Explore details</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          case "events": {
            const ec = homeCms.sections.events;
            if (!ec.enabled) return null;
            const liveEventsLimit = ec.limit || 3;
            const upcomingEvents = events.filter(e => e.isUpcoming).slice(0, liveEventsLimit);

            return (
              <section key="events" className="py-24 px-6 bg-white border-y border-slate-100">
                <div className="max-w-6xl mx-auto space-y-16">
                  <div className="text-center space-y-3">
                    <span className="font-sans text-[9px] font-semibold tracking-[0.25em] uppercase text-text-gold block">
                      Active Calendar
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-light text-text-dark tracking-tight">
                      Elite Members' <span className="font-serif italic font-normal text-gold">Upcoming Events</span>
                    </h2>
                    <div className="w-16 h-[1px] bg-gold mx-auto"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-bg-primary border border-slate-200/60 rounded-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
                      >
                        {/* Image block with Date overlay */}
                        <div className="relative h-48 overflow-hidden bg-navy-mid">
                          <img
                            src={event.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600"}
                            alt={event.title}
                            className="w-full h-full object-cover filter brightness-95"
                          />
                          <div className="absolute top-4 left-4 bg-navy text-center px-3 py-2 border border-gold shadow-md">
                            <span className="block font-display text-xl text-gold font-bold leading-none">{event.day || "15"}</span>
                            <span className="block font-sans text-[8px] text-sky-100 uppercase tracking-widest font-semibold mt-1">
                              {event.month || "JUL"}
                            </span>
                          </div>
                          <div className="absolute bottom-3 right-3 bg-navy/80 px-2.5 py-1 text-white text-[9px] uppercase font-sans tracking-widest font-medium rounded-xs">
                            {event.category}
                          </div>
                        </div>

                        {/* Content body */}
                        <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <h3 className="font-display text-lg font-medium text-text-dark leading-snug line-clamp-2">
                              {event.title}
                            </h3>
                            <p className="font-sans text-[11px] text-text-body font-light line-clamp-3 leading-relaxed">
                              {event.description}
                            </p>
                          </div>

                          <div className="space-y-4 pt-3 border-t border-slate-200/50 font-sans">
                            <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
                              <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                            <button
                              onClick={() => navigate("/events.html")}
                              className="w-full text-center py-2 bg-navy text-white hover:bg-gold hover:text-navy text-[10px] uppercase font-semibold tracking-widest transition-colors duration-200 cursor-pointer text-sans"
                            >
                              Register Interest
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {upcomingEvents.length === 0 && (
                      <div className="col-span-3 text-center py-10 text-slate-400 font-mono text-xs uppercase tracking-wider">
                        No upcoming events registered currently.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          }

          case "news": {
            const nc = homeCms.sections.news;
            if (!nc.enabled) return null;
            const newsLimit = nc.limit || 3;
            const catFilter = nc.categoryFilter || "All";
            
            const filteredNews = news.filter(p => {
              const isPublic = !p.status || 
                p.status === "Published" || 
                (p.status === "Scheduled" && p.scheduledDate && new Date(p.scheduledDate) <= new Date());
              const matchesCategory = catFilter === "All" || p.category === catFilter;
              return isPublic && matchesCategory;
            });
            
            const selectedNews = filteredNews.slice(0, newsLimit);

            return (
              <section key="news" className="py-24 px-6 bg-bg-secondary border-b border-slate-100">
                <div className="max-w-6xl mx-auto space-y-16">
                  <div className="text-center space-y-3">
                    <span className="font-sans text-[9px] font-semibold tracking-[0.25em] uppercase text-text-gold block">
                      The Ocean Gazette
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-light text-text-dark tracking-tight">
                      Announcements & <span className="font-serif italic font-normal text-gold">Recent News Updates</span>
                    </h2>
                    <div className="w-16 h-[1px] bg-gold mx-auto"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedNews.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-lg transition-shadow rounded-xs h-96 animate-fade-in animate-duration-300"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-sans tracking-wider">
                            <span className="text-gold uppercase font-semibold">{post.category}</span>
                            <span className="text-slate-400">{post.date}</span>
                          </div>

                          <h3 className="font-display text-lg font-medium text-text-dark leading-snug line-clamp-2">
                            {post.title}
                          </h3>

                          {post.image && (
                            <div className="h-28 overflow-hidden rounded-xs bg-slate-100">
                              <img
                                src={post.image}
                                alt="News post visuals"
                                className="w-full h-full object-cover filter saturate-75"
                              />
                            </div>
                          )}

                          <p className="font-sans text-[11px] text-text-body font-light line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                          <button
                            onClick={() => navigate("/news-feed.html")}
                            className="flex items-center space-x-1 font-sans text-[9px] font-semibold tracking-widest text-[#1a2744] hover:text-gold uppercase transition-colors cursor-pointer"
                          >
                            <span>Read Full Post</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-4">
                    <button
                      onClick={() => navigate("/news-feed.html")}
                      className="px-8 py-3 bg-[#1a2744] text-white font-sans text-[11px] uppercase tracking-widest font-semibold hover:bg-gold hover:text-navy transition-colors inline-block cursor-pointer"
                    >
                      Browse The Live News Feed
                    </button>
                  </div>
                </div>
              </section>
            );
          }

          case "board": {
            const bc = homeCms.sections.board;
            if (!bc.enabled) return null;
            
            const president = directors.find(d => d.level === 1) || directors.find(d => d.id === "humayun-kabir-robel") || directors[0];
            const vicePresidents = directors.filter(d => d.level === 2);
            const coreSecretariat = directors.filter(d => d.level === 3).sort((a,b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
            const foundingDirectorsList = directors.filter(d => d.level === 4 || (d.level === undefined && d.id !== president.id && !vicePresidents.some(v => v.id === d.id) && !coreSecretariat.some(c => c.id === d.id))).sort((a,b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

            return (
              <section key="board" className="py-24 px-6 bg-white border-y border-slate-100">
                <div className="max-w-6xl mx-auto space-y-16">
                  <div className="text-center space-y-3">
                    <span className="font-sans text-[9px] font-semibold tracking-[0.25em] uppercase text-text-gold block">
                      Governance Org Structure
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-light text-text-dark tracking-tight">
                      Founding Board <span className="font-serif italic font-normal text-gold">Leadership Hierarchy</span>
                    </h2>
                    <div className="w-16 h-[1px] bg-gold mx-auto"></div>
                  </div>

                  <div className="flex flex-col items-center">
                    {/* Row 1: Founding President */}
                    <div className="text-center z-10">
                      <span className="font-sans text-[9px] text-[#1a2744] uppercase tracking-[0.2em] font-bold block mb-4">
                        Row I: High Presidency
                      </span>
                      {president && (
                        <BoardProfileCard director={president} navigate={navigate} variant="president" />
                      )}
                    </div>

                    {/* Connector 1 */}
                    <div className="w-[1px] h-12 bg-gold/30"></div>

                    {/* Row 2: Founding Vice President */}
                    <div className="text-center z-10 w-full">
                      <span className="font-sans text-[9px] text-[#1a2744] uppercase tracking-[0.2em] font-bold block mb-4">
                        Row II: Vice Presidency
                      </span>
                      <div className="flex justify-center gap-6 flex-wrap">
                        {vicePresidents.map((vp) => (
                          <BoardProfileCard key={vp.id} director={vp} navigate={navigate} variant="main" />
                        ))}
                      </div>
                    </div>

                    {/* Connector 2 */}
                    <div className="w-[1px] h-12 bg-gold/30"></div>

                    {/* Row 3: Admin & Finance (Core Secretariat) */}
                    <div className="text-center z-10 w-full">
                      <span className="font-sans text-[9px] text-[#1a2744] uppercase tracking-[0.2em] font-bold block mb-4">
                        Row III: Core Secretariat Directors
                      </span>
                      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-3xl w-full mx-auto">
                        {coreSecretariat.map((dir) => (
                          <BoardProfileCard key={dir.id} director={dir} navigate={navigate} variant="main" />
                        ))}
                      </div>
                    </div>

                    {/* Connector 3 */}
                    <div className="w-[1px] h-12 bg-gold/30"></div>

                    {/* Row 4: Founding Directors */}
                    <div className="text-center w-full z-10">
                      <span className="font-sans text-[9px] text-[#1a2744] uppercase tracking-[0.2em] font-bold block mb-6">
                        Row IV: Founding Directors Circle
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto px-4 justify-items-center">
                        {foundingDirectorsList.map((dir) => (
                          <BoardProfileCard key={dir.id} director={dir} navigate={navigate} variant="compact" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          case "membership": {
            const mc = homeCms.sections.membership;
            if (!mc.enabled) return null;

            const allCategories = [
              { title: "Donor Membership", desc: "For distinguished patrons donating critical foundation assets.", icon: Award },
              { title: "Life Membership", desc: "For lifetime residency, enabling perpetual voting rights.", icon: Sparkles },
              { title: "Permanent Membership", desc: "Our hallmark category standard for established club citizens.", icon: Anchor },
              { title: "Associate Membership", desc: "Curated entry for early-career executives under 35 years.", icon: Users },
              { title: "Diplomat Membership", desc: "For representatives of international diplomatic embassies.", icon: Shield },
              { title: "Foreign Membership", desc: "For non-resident international maritime and trade leaders.", icon: MapPin },
              { title: "Corporate Membership", desc: "Empowers executive teams to Host oceanfront summits seamlessly.", icon: Clock },
              { title: "Honorary Membership", desc: "By distinct Invitation ONLY to eminent regional statesmen.", icon: Quote }
            ];

            const filteredCategories = allCategories.filter(cat => 
              !(mc.hiddenCategories || []).includes(cat.title)
            );

            return (
              <section key="membership" className="py-24 px-6 bg-bg-primary border-b border-slate-100">
                <div className="max-w-6xl mx-auto space-y-16">
                  <div className="text-center space-y-3">
                    <span className="font-sans text-[9px] font-semibold tracking-[0.25em] uppercase text-text-gold block">
                      Privileges of Registration
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-light text-text-dark tracking-tight">
                      CBBCL Membership <span className="font-serif italic font-normal text-gold">Class Categories</span>
                    </h2>
                    <div className="w-16 h-[1px] bg-gold mx-auto"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredCategories.map((cat, index) => {
                      const IconComp = cat.icon;
                      const isHighlighted = mc.highlightCategory === cat.title;
                      return (
                        <div
                          key={index}
                          className={`bg-white p-6 rounded-sm flex flex-col justify-between space-y-4 hover:shadow-xl transition-all duration-300 border ${
                            isHighlighted 
                              ? "border-gold ring-2 ring-gold/30 shadow-md scale-[1.03] bg-[#fdfdfc]"
                              : "border-slate-100 hover:border-gold"
                          }`}
                        >
                          <div className="space-y-3">
                            <div className={`p-2 w-10 h-10 rounded-full flex items-center justify-center ${
                              isHighlighted 
                                ? "bg-gold text-navy" 
                                : "bg-slate-50 text-gold-dark"
                            }`}>
                              <IconComp className="w-5 h-5 animate-subtle-spin" />
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="font-display text-sm font-semibold text-text-dark">{cat.title}</h4>
                              {isHighlighted && (
                                <span className="bg-gold/15 text-gold text-[8px] font-sans font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                                  Highlight
                                </span>
                              )}
                            </div>
                            <p className="font-sans text-[10px] text-text-body font-light leading-relaxed">
                              {cat.desc}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate("/membership.html")}
                            className="text-left font-sans text-[8px] font-semibold tracking-widest uppercase text-navy hover:text-gold cursor-pointer"
                          >
                            Learn More →
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          }

          case "affiliations": {
            const ac = homeCms.sections.affiliations;
            if (!ac.enabled) return null;

            return (
              <section key="affiliations" className="py-24 px-6 bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto space-y-16">
                  <div className="text-center space-y-3">
                    <span className="font-sans text-[9px] font-semibold tracking-[0.25em] uppercase text-text-gold block">
                      Reciprocal Alliances
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-light text-text-dark tracking-tight">
                      Affiliated & Reciprocal <span className="font-serif italic font-normal text-gold">Organizations</span>
                    </h2>
                    <div className="w-16 h-[1px] bg-gold mx-auto"></div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                    {affiliations.map((aff) => {
                      const isFeatured = (ac.featuredIds || []).includes(aff.id);
                      return (
                        <div
                          key={aff.id}
                          onClick={() => navigate("/affiliations.html")}
                          className={`bg-bg-primary p-6 text-center flex flex-col justify-between space-y-4 hover:shadow-lg transition-all cursor-pointer rounded-xs border ${
                            isFeatured ? "border-gold/60 ring-1 ring-gold/20" : "border-slate-200/50 hover:border-gold"
                          }`}
                        >
                          <div className={`w-12 h-12 text-gold mx-auto rounded-full flex items-center justify-center mb-2 ${
                            isFeatured ? "bg-navy" : "bg-[#1a2744] hover:bg-navy-mid"
                          }`}>
                            <Anchor className="w-5 h-5 animate-pulse" />
                          </div>
                          <div>
                            <h4 className="font-display text-xs text-text-dark font-semibold leading-tight line-clamp-2">
                              {aff.name}
                            </h4>
                            {isFeatured && (
                              <span className="inline-block bg-gold/10 text-gold-dark text-[7px] font-sans font-bold uppercase tracking-widest mt-1 px-1.5 py-0.5 rounded">
                                Featured Alliance
                              </span>
                            )}
                            <span className="text-[7px] font-sans text-slate-400 uppercase tracking-tight block mt-1">
                              {aff.partnershipType}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          }

          case "contact": {
            const cc = homeCms.sections.contact;
            if (!cc.enabled) return null;

            return (
              <section key="contact" className="py-24 px-6 bg-bg-secondary border-b border-slate-200">
                <div id="contact-session" className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Details Column Area */}
                  <div className={cc.formEnabled ? "lg:col-span-12 xl:col-span-5 space-y-8" : "lg:col-span-12 max-w-2xl mx-auto space-y-8 text-center"}>
                    <div className="space-y-3">
                      <span className="font-sans text-[9px] font-semibold tracking-[0.25em] uppercase text-text-gold block">
                        Connect and Query
                      </span>
                      <h2 className="font-display text-3xl md:text-5xl font-light text-text-dark tracking-tight leading-none">
                        Get In Touch <span className="font-serif italic font-normal text-gold">With Registry</span>
                      </h2>
                      <div className={`w-12 h-[1px] bg-gold ${!cc.formEnabled && "mx-auto"}`}></div>
                    </div>

                    <p className="font-sans text-[11px] text-text-body font-light leading-relaxed">
                      We highly welcome your questions, nominations, and requests. Friendly administrative officers respond 
                      to all certified member proposal nominations within two business days.
                    </p>

                    <div className={`space-y-4 font-sans text-xs ${!cc.formEnabled ? "flex flex-col items-center justify-center space-y-3 text-center" : ""}`}>
                      <div className="flex items-start space-x-3.5 text-left">
                        <MapPin className="w-5 h-5 text-gold mt-1 shrink-0" />
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold tracking-wider block uppercase">CLUB SECRETARIAT</span>
                          <span className="text-text-dark font-light block mt-0.5">
                            {cc.address}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5 text-left">
                        <Phone className="w-5 h-5 text-gold mt-1 shrink-0" />
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold tracking-wider block uppercase">TELEPHONE ENQUIRY</span>
                          <span className="text-text-dark font-light block mt-0.5">{cc.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5 text-left">
                        <Mail className="w-5 h-5 text-gold mt-1 shrink-0" />
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold tracking-wider block uppercase">GENERAL REGISTRY</span>
                          <span className="text-text-dark font-light block mt-0.5">{cc.email}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5 text-left">
                        <Clock className="w-5 h-5 text-gold mt-1 shrink-0" />
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold tracking-wider block uppercase">CLUB TEMPORARY OUTPOST</span>
                          <span className="text-text-dark font-light block mt-0.5">{cc.temporaryOffice}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Form Form Area (conditionally rendered) */}
                  {cc.formEnabled && (
                    <div className="lg:col-span-12 xl:col-span-7 bg-white p-8 border border-slate-100 shadow-xl rounded-sm">
                      <h3 className="font-display text-lg text-text-dark font-semibold tracking-wide border-b border-slate-100 pb-3 mb-6">
                        Official Registry Inquiry Form
                      </h3>

                      {formSubmitted ? (
                        <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans rounded-md text-center">
                          <p className="font-semibold text-sm mb-1">Inquiry Dispatched Successfully!</p>
                          <p>Cox's Bazar secretariat registry desk has received your proposal. A dedicated officer will verify and follow up.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 border border-slate-200/80 px-4 py-2.5 text-xs focus:bg-white focus:border-gold outline-none transition-colors rounded-xs"
                                placeholder="e.g., Kazi Farhan Bin Rafiq"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                                Telephone/Phone
                              </label>
                              <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 border border-slate-200/80 px-4 py-2.5 text-xs focus:bg-white focus:border-gold outline-none transition-colors rounded-xs"
                                placeholder="e.g., +880 1712-XXXXXX"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full bg-slate-50 border border-slate-200/80 px-4 py-2.5 text-xs focus:bg-white focus:border-gold outline-none transition-colors rounded-xs"
                              placeholder="e.g., name@domain.com"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                              Message Body *
                            </label>
                            <textarea
                              name="message"
                              required
                              rows={4}
                              value={formData.message}
                              onChange={handleInputChange}
                              className="w-full bg-slate-50 border border-slate-200/80 px-4 py-2.5 text-xs focus:bg-white focus:border-gold outline-none transition-colors rounded-xs"
                              placeholder="Express your business profile, membership nomination context, or queries here..."
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3.5 bg-navy text-white hover:bg-gold hover:text-navy transition-all duration-300 font-sans text-[11px] font-semibold uppercase tracking-widest text-center shadow-md rounded-xs cursor-pointer"
                          >
                            Submit Official Inquiry
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
