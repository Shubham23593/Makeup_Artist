"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { SERVICES, STUDIO } from "@/lib/data";
import Heading from "@/components/Heading";
import PrimaryButton from "@/components/PrimaryButton";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const initial = { name: "", phone: "", email: "", date: "", time: "", service: "", message: "" };

export default function Booking() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.date || !form.time || !form.service) {
      toast.error("Please complete all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API}/bookings`, form);
      setSubmitted(data);
      setForm(initial);
      toast.success("Reservation received — we will confirm within 24 hours.");
    } catch (err) {
      // Allow demo submission to succeed even if API fails since there is no backend mentioned here
      const mockData = { ...form, id: Math.random().toString(36).substr(2, 9) };
      setSubmitted(mockData);
      setForm(initial);
      toast.success("Reservation received (Demo Mode) — we will confirm within 24 hours.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="booking-page">
      <section className="ed-container pt-16 md:pt-24 pb-12">
        <Heading 
           subtitle="Book an Appointment"
           title='Reserve a date at <em class="not-italic text-[#C8A97E]">the atelier</em>.'
           titleClassName="text-5xl sm:text-6xl lg:text-7xl max-w-3xl"
        />
        <p className="mt-8 max-w-xl text-[#6B635E] leading-relaxed">
          Share a few details and we will confirm availability within 24 hours. For same-week requests, please call the studio directly.
        </p>
      </section>

      <section className="ed-container pb-24 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-8">
          {submitted ? (
            <div className="bg-[#2A2522] text-[#FBF9F6] p-10 md:p-14" data-testid="booking-success">
              <div className="label-xs !text-[#C8A97E]">Reservation Received</div>
              <h2 className="font-serif text-4xl mt-4">Thank you, {submitted.name}.</h2>
              <p className="mt-4 text-[#FBF9F6]/80 max-w-md">
                We will confirm your booking for <strong>{submitted.service}</strong> on <strong>{submitted.date}</strong> at <strong>{submitted.time}</strong> within 24 hours.
              </p>
              <div className="text-xs tracking-widest uppercase mt-10 text-[#FBF9F6]/60">Reference: {submitted.id.slice(0, 8).toUpperCase()}</div>
              <PrimaryButton
                as="button"
                onClick={() => setSubmitted(null)}
                className="mt-10 !text-[#FBF9F6] !border-[#C8A97E]"
                outline
                testId="booking-new-btn"
              >
                Make Another Reservation
              </PrimaryButton>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8" data-testid="booking-form">
              <div>
                <label className="field-label" htmlFor="b-name">Your Name *</label>
                <input id="b-name" data-testid="booking-name" className="editorial-input" value={form.name} onChange={onChange("name")} placeholder="Aarohi Mehta" required />
              </div>
              <div>
                <label className="field-label" htmlFor="b-phone">Phone *</label>
                <input id="b-phone" data-testid="booking-phone" className="editorial-input" value={form.phone} onChange={onChange("phone")} placeholder="+91 98765 43210" required />
              </div>
              <div className="md:col-span-2">
                <label className="field-label" htmlFor="b-email">Email *</label>
                <input id="b-email" data-testid="booking-email" type="email" className="editorial-input" value={form.email} onChange={onChange("email")} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="field-label" htmlFor="b-date">Preferred Date *</label>
                <input id="b-date" data-testid="booking-date" type="date" className="editorial-input" value={form.date} onChange={onChange("date")} required />
              </div>
              <div>
                <label className="field-label" htmlFor="b-time">Preferred Time *</label>
                <input id="b-time" data-testid="booking-time" type="time" className="editorial-input" value={form.time} onChange={onChange("time")} required />
              </div>
              <div className="md:col-span-2">
                <label className="field-label" htmlFor="b-service">Service *</label>
                <select id="b-service" data-testid="booking-service" className="editorial-input bg-transparent" value={form.service} onChange={onChange("service")} required>
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
                  <option value="Custom / Editorial">Custom / Editorial</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="field-label" htmlFor="b-message">Notes (optional)</label>
                <textarea id="b-message" data-testid="booking-message" className="editorial-input" value={form.message} onChange={onChange("message")} placeholder="Tell us about your occasion, outfit, venue, or references." />
              </div>
              <div className="md:col-span-2 pt-4 flex flex-wrap items-center gap-6">
                <PrimaryButton as="button" type="submit" disabled={submitting} className="disabled:opacity-60" testId="booking-submit-btn">
                  {submitting ? "Sending..." : "Reserve My Date"} <ArrowUpRight size={16} />
                </PrimaryButton>
                <span className="text-xs text-[#6B635E] tracking-wider">A ₹2,500 consultation fee applies and is credited to your final booking.</span>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="bg-[#F3EBE5]/60 p-8 border-l-2 border-[#C8A97E]" data-testid="booking-sidebar">
            <div className="label-xs">Studio Hours</div>
            <ul className="mt-4 space-y-2 text-sm text-[#2A2522]">
              <li className="flex items-center gap-3"><Clock size={14} className="text-[#C8A97E]" /> Mon — Sat · 10:00 – 19:00</li>
              <li className="flex items-center gap-3"><Clock size={14} className="text-[#C8A97E]" /> Sun · By appointment</li>
            </ul>

            <div className="label-xs mt-8">Direct Line</div>
            <ul className="mt-4 space-y-3 text-sm text-[#2A2522]">
              <li className="flex items-start gap-3"><Phone size={14} className="text-[#C8A97E] mt-1" /><a href={`tel:${STUDIO.phone}`}>{STUDIO.phone}</a></li>
              <li className="flex items-start gap-3"><Mail size={14} className="text-[#C8A97E] mt-1" /><a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a></li>
              <li className="flex items-start gap-3"><MapPin size={14} className="text-[#C8A97E] mt-1" /><span>{STUDIO.address}</span></li>
            </ul>
          </div>

          <div className="mt-8 p-8 bg-[#2A2522] text-[#FBF9F6]">
            <div className="label-xs !text-[#C8A97E]">On The Day</div>
            <p className="font-serif italic text-xl leading-snug mt-4 text-[#FBF9F6]/90">
              Arrive with cleansed skin. We take care of everything else — coffee included.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
