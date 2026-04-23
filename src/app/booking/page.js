"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { SERVICES, STUDIO } from "@/lib/data";
import Heading from "@/components/Heading";
import PrimaryButton from "@/components/PrimaryButton";

const API = "/api";

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
      if (data.error) throw new Error(data.error);

      setSubmitted({ ...form, id: data.booking._id });
      setForm(initial);
      toast.success("Reservation received — we will confirm within 24 hours.");
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || "Failed to submit booking.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="booking-page">
      <section className="ed-container pt-16 md:pt-24 pb-12" data-aos="fade-up">
        <Heading 
           subtitle="Book an Appointment"
           title='Reserve your <em class="not-italic text-[#C8A97E]">makeup appointment.</em>'
           titleClassName="text-5xl sm:text-6xl lg:text-7xl max-w-3xl"
        />
        <p className="mt-8 max-w-xl text-[#6B635E] leading-relaxed">
          Share your details and we will get in touch to confirm your booking. For urgent bookings, please contact us directly.
        </p>
      </section>

      <section className="ed-container pb-24 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-8" data-aos="fade-up" data-aos-delay="100">
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
                <input id="b-name" data-testid="booking-name" className="editorial-input" value={form.name} onChange={onChange("name")} placeholder="Enter your full name" required />
              </div>
              <div>
                <label className="field-label" htmlFor="b-phone">Phone *</label>
                <input id="b-phone" data-testid="booking-phone" className="editorial-input" value={form.phone} onChange={onChange("phone")} placeholder="Enter your phone number" required />
              </div>
              <div className="md:col-span-2">
                <label className="field-label" htmlFor="b-email">Email *</label>  
                <input id="b-email" data-testid="booking-email" type="email" className="editorial-input" value={form.email} onChange={onChange("email")} placeholder="Enter your email address" required />
              </div>
              <div>
                <label className="field-label" htmlFor="b-date">Preferred Date *</label>
                <input id="b-date" data-testid="booking-date" type="date" className="editorial-input" value={form.date} onChange={onChange("date")} required />
              </div>
              <div>
                <label className="field-label" htmlFor="b-time">Preferred Time *</label>
                <select id="b-time" data-testid="booking-time" className="editorial-input bg-transparent" value={form.time} onChange={onChange("time")} required>
                  <option value="">Select a time</option>
                  {["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
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
                <span className="text-xs text-[#6B635E] tracking-wider">A ₹2,500 consultation fee is required and will be adjusted if you confirm your booking.</span>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-[#F3EBE5]/60 p-8 border-l-2 border-[#C8A97E]" data-testid="booking-sidebar">
            {/* <div className="label-xs">Studio Hours</div> */}
            {/* <ul className="mt-4 space-y-2 text-sm text-[#2A2522]">
              <li className="flex items-center gap-3"><Clock size={14} className="text-[#C8A97E]" /> Mon — Sat · 10:00 – 19:00</li>
              <li className="flex items-center gap-3"><Clock size={14} className="text-[#C8A97E]" /> Sun · By appointment</li>
            </ul> */}

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
             Please arrive with clean and moisturized skin. We will take care of the rest to give you a perfect look.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
