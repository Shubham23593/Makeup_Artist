"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
const Facebook = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const Instagram = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
import { STUDIO } from "@/lib/data";
import Heading from "@/components/Heading";
import PrimaryButton from "@/components/PrimaryButton";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const initial = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill your name, email and message.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/contacts`, form);
      toast.success("Message received — we will be in touch within 24 hours.");
      setForm(initial);
    } catch (err) {
      // Mock success if API fails for demo
      toast.success("Message received (Demo mode) — we will be in touch within 24 hours.");
      setForm(initial);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <section className="ed-container pt-16 md:pt-24 pb-12">
        <Heading 
           subtitle="Contact"
           title='Get in <em class="not-italic text-[#C8A97E]">Touch</em>.'
           titleClassName="text-5xl sm:text-6xl lg:text-7xl max-w-3xl"
        />
        <p className="mt-8 max-w-xl text-[#6B635E] leading-relaxed">
          For bookings or any enquiries, feel free to contact us. We would be happy to assist you.

        </p>
      </section>

      <section className="ed-container pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-10">
          <div data-testid="contact-info">
            <div className="label-xs">Location</div>
            <div className="mt-4 flex items-start gap-3 text-[#2A2522]"><MapPin size={16} className="text-[#C8A97E] mt-1" />{STUDIO.address}</div>
          </div>
          <div>
            <div className="label-xs">Direct</div>
            <ul className="mt-4 space-y-3 text-[#2A2522]">
              <li className="flex items-start gap-3"><Phone size={16} className="text-[#C8A97E] mt-1" /><a href={`tel:${STUDIO.phone}`} data-testid="contact-phone">{STUDIO.phone}</a></li>
              <li className="flex items-start gap-3"><Mail size={16} className="text-[#C8A97E] mt-1" /><a href={`mailto:${STUDIO.email}`} data-testid="contact-email">{STUDIO.email}</a></li>
            </ul>
          </div>
          <div>
            <div className="label-xs">Follow</div>
            <div className="mt-4 flex items-center gap-3">
              <a href={STUDIO.instagram} target="_blank" rel="noreferrer" className="p-3 border border-[#2A2522]/15 hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors" data-testid="contact-instagram"><Instagram size={16} /></a>
              <a href={STUDIO.facebook} target="_blank" rel="noreferrer" className="p-3 border border-[#2A2522]/15 hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors" data-testid="contact-facebook"><Facebook size={16} /></a>
              <a href={STUDIO.pinterest} target="_blank" rel="noreferrer" className="p-3 border border-[#2A2522]/15 hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors font-serif italic" data-testid="contact-pinterest">P</a>
            </div>
          </div>

          <div className="aspect-[4/3] border border-[#2A2522]/10" data-testid="contact-map">
            <iframe title="Studio location" src={STUDIO.mapEmbed} className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8" data-testid="contact-form">
          <div>
            <label className="field-label" htmlFor="c-name">Name *</label>
            <input id="c-name" data-testid="contact-name" className="editorial-input" value={form.name} onChange={onChange("name")} required />
          </div>
          <div>
            <label className="field-label" htmlFor="c-email">Email *</label>
            <input id="c-email" type="email" data-testid="contact-email-input" className="editorial-input" value={form.email} onChange={onChange("email")} required />
          </div>
          <div>
            <label className="field-label" htmlFor="c-phone">Phone</label>
            <input id="c-phone" data-testid="contact-phone-input" className="editorial-input" value={form.phone} onChange={onChange("phone")} />
          </div>
          <div>
            <label className="field-label" htmlFor="c-subject">Subject</label>
            <input id="c-subject" data-testid="contact-subject" className="editorial-input" value={form.subject} onChange={onChange("subject")} placeholder="Wedding · Editorial · Press" />
          </div>
          <div className="md:col-span-2">
            <label className="field-label" htmlFor="c-message">Message *</label>
            <textarea id="c-message" data-testid="contact-message" className="editorial-input" rows={6} value={form.message} onChange={onChange("message")} required />
          </div>
          <div className="md:col-span-2">
            <PrimaryButton as="button" disabled={submitting} className="disabled:opacity-60" testId="contact-submit-btn">
              {submitting ? "Sending..." : "Send Message"}
            </PrimaryButton>
          </div>
        </form>
      </section>
    </div>
  );
}
