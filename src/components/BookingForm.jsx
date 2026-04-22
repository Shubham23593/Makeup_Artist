"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: "Bridal Makeup",
    notes: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Booking request sent successfully! We will confirm shortly.");
        // reset form
        setFormData({ name: "", phone: "", email: "", date: "", time: "", service: "Bridal Makeup", notes: "" });
      } else {
        toast.error(data.error || "Failed to submit booking");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const services = ["Bridal Makeup", "Party Makeup", "Editorial / Fashion", "Special Effects / Creative", "Hair Styling Only", "Consultation"];
  
  // Basic time slots logic
  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  return (
    <div className="bg-white p-6 md:p-10 border border-gray-200 w-full max-w-2xl mx-auto my-12">
      <h2 className="text-3xl font-serif text-[#2A2522] mb-2">Book an Appointment</h2>
      <p className="text-gray-500 mb-8 border-b pb-4">Request a consultation or makeup session.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="field-label">Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="editorial-input text-sm" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="field-label">Phone Number</label>
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="editorial-input text-sm" placeholder="+91 9000000000" />
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="editorial-input text-sm" placeholder="jane@example.com" />
          </div>
          
          <div>
            <label className="field-label">Preferred Date</label>
            <input type="date" name="date" required value={formData.date} onChange={handleChange} className="editorial-input text-sm text-gray-500" min={new Date().toISOString().split("T")[0]} />
          </div>
          <div>
            <label className="field-label">Preferred Time</label>
            <select name="time" required value={formData.time} onChange={handleChange} className="editorial-input text-sm text-gray-500 bg-transparent">
              <option value="" disabled>Select Time</option>
              {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="field-label">Service Type</label>
            <select name="service" required value={formData.service} onChange={handleChange} className="editorial-input text-sm text-gray-500 bg-transparent">
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="field-label">Additional Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="editorial-input text-sm" placeholder="Tell us about the event, location, or references..." rows="3"></textarea>
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center mt-4 tracking-widest py-4">
          {loading ? <Loader2 className="animate-spin" size={20} /> : "REQUEST BOOKING"}
        </button>
      </form>
    </div>
  );
}
