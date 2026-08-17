import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Anchor, Send, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";
import { fetchFooterSettings, getFooterSettingsSync } from "../../utils/cmsStorage";
import { FooterSettings } from "../../types";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "Membership Query", message: "" });
  const [footerData, setFooterData] = useState<FooterSettings>(() => getFooterSettingsSync());

  useEffect(() => {
    fetchFooterSettings().then((res) => {
      if (res && res.contact) {
        setFooterData(res);
      }
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to send your inquiry.");
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", subject: "Membership Query", message: "" });
      }, 5000);
    } catch (error: any) {
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 overflow-hidden">
          <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Ltd.
          </p>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extralight text-white tracking-tight break-words whitespace-normal leading-tight">
            Connect & <span className="font-serif italic text-gold">Enquire With Registry</span>
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gold">Contact Registry</span>
          </div>
        </div>
      </section>

      {/* Main Structural Grid Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Address, Phone, Mail, Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="font-sans text-[9px] uppercase tracking-widest text-gold font-bold block">
                Office of Registry
              </span>
              <h2 className="font-display text-2xl md:text-3xl text-text-dark font-light tracking-tight">
                An Absolute Sanctuary of <span className="font-serif italic text-gold font-normal">Executive Communication</span>
              </h2>
              <div className="w-12 h-[1.5px] bg-gold"></div>
            </div>

            <p className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed">
              Whether you are a certified voting member, corporate delegate, or representative of a regional diplomatic 
              mission, our registry staff is committed to facilitating smooth correspondence. Use the coordinates or form 
              registers below to reach out.
            </p>

            {/* Address points List */}
            <div className="space-y-6 font-sans text-xs">
              
              <div className="flex items-start space-x-4">
                <div className="bg-navy p-2 text-gold rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold tracking-widest block uppercase">CLUB SECRETARIAT & PIER</span>
                  <p className="text-text-dark font-light block mt-1 leading-relaxed whitespace-pre-line">
                    {footerData.contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-navy p-2 text-gold rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold tracking-widest block uppercase">TELEPHONE HOTLINE</span>
                  <p className="text-text-dark font-light block mt-1 leading-relaxed">
                    {footerData.contact.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-navy p-2 text-gold rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold tracking-widest block uppercase">EMAIL REGISTRIES</span>
                  <p className="text-text-dark font-light block mt-1 leading-relaxed">
                    {footerData.contact.email.split(",").map((email) => email.trim()).filter(Boolean).map((email, i, arr) => (
                      <React.Fragment key={email}>
                        {email}
                        {i < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-navy p-2 text-gold rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold tracking-widest block uppercase">OFFICE OPERATING HOURS</span>
                  <p className="text-text-dark font-light block mt-1 leading-relaxed">
                    Monday to Saturday: 09:00 AM – 10:00 PM <br />
                    Sunday: Closed (Lounge and Dining open to Members only)
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Dynamic Form Block */}
          <div className="lg:col-span-7 bg-white p-8 border border-slate-200/80 rounded-sm shadow-xl">
            <h3 className="font-display text-lg text-text-dark font-semibold tracking-wide border-b border-slate-100 pb-3 mb-6 flex items-center space-x-2">
              <Anchor className="w-4.5 h-4.5 text-gold" />
              <span>Registry Inquiry Portal</span>
            </h3>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans rounded text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-semibold text-sm">Dispatched Successfully!</p>
                <p className="text-slate-600">The Cox's Bazar secretariat desk coordinator has registered your request. You should receive a tracking code in your mail box shortly.</p>
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
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs focus:bg-white focus:border-gold outline-none transition-colors"
                      placeholder="Type your Full Name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Your Phone/Telephone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs focus:bg-white focus:border-gold outline-none transition-colors"
                      placeholder="e.g. +880 1711-XXXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs focus:bg-white focus:border-gold outline-none transition-colors"
                      placeholder="e.g. name@domain.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      Inquiry Sphere *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-xs outline-none focus:border-gold focus:bg-white"
                    >
                      <option>Membership Query</option>
                      <option>Facilities reservation inquiry</option>
                      <option>Reciprocal travel confirmation</option>
                      <option>Nautical sailing registry</option>
                      <option>Media or corporate CSR</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                    Your Constructive Inquiry *
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs focus:bg-white focus:border-gold outline-none transition-colors"
                    placeholder="Provide your background profile context, nominee code references, or corporate inquiry message here..."
                  ></textarea>
                </div>

                {submitError && (
                  <p className="text-[11px] font-sans text-red-600 font-medium">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#1a2744] hover:bg-gold hover:text-navy text-white text-xs font-sans font-semibold uppercase tracking-widest transition-all mt-4 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Dispatching..." : "Submit Inquiry"}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Visual local Map placeholder */}
      <section className="h-96 w-full relative bg-slate-100 overflow-hidden border-t border-slate-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14838.08638069634!2d91.97746401956555!3d21.433245055047463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc80630b92f03%3A0x7d6c5c06fe16938a!2sCox&#39;s%20Bazar%20Beach!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(30%) contrast(105%) brightness(95%)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer"
          title="Cox's Bazar Map Anchorage Location"
        ></iframe>
      </section>
    </div>
  );
}
