"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Quote } from "lucide-react";
import Heading from "@/components/Heading";
import PrimaryButton from "@/components/PrimaryButton";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function Testimonials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${API}/testimonials`).then((r) => setItems(r.data)).catch(() => {
       // Mock data if API is not running
       setItems([
         { id: "1", rating: 5, text: "The most beautiful I have ever felt. Ishita understood my vision instantly.", name: "Aarohi M.", role: "Bride" },
         { id: "2", rating: 5, text: "Professional, considered, and incredibly talented. The base lasted 14 hours flawlessly.", name: "Simran K.", role: "Bride" },
         { id: "3", rating: 5, text: "We trust Maison Lumière for all our cover shoots. The HD work is unmatched.", name: "Priya S.", role: "Stylist" },
         { id: "4", rating: 5, text: "Soft, glowy, and just perfect. I couldn't recommend them more for engagement looks.", name: "Nisha R.", role: "Bride" }
       ]);
    });
  }, []);

  return (
    <div data-testid="testimonials-page">
      <section className="ed-container pt-16 md:pt-24 pb-12">
        <Heading 
           subtitle="Stories"
           title='The clients who <em class="not-italic text-[#C8A97E]">chose to return</em>.'
           titleClassName="text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
        />
        <p className="mt-8 max-w-xl text-[#6B635E] leading-relaxed">
          Short notes from brides, editors, and regulars — shared with permission. More stories available on request.
        </p>
      </section>

      <section className="ed-container pb-24 grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="testimonial-grid">
        {items.map((t, idx) => {
          const variant = idx % 4;
          const base =
            variant === 0
              ? "bg-[#F3EBE5] border-l-2 border-[#C8A97E]"
              : variant === 1
              ? "bg-white border border-[#2A2522]/10"
              : variant === 2
              ? "bg-[#2A2522] text-[#FBF9F6] border-l-2 border-[#C8A97E]"
              : "bg-[#C8A97E]/15 border-l-2 border-[#C8A97E]";
          const textCol = variant === 2 ? "text-[#FBF9F6]/90" : "text-[#2A2522]";
          return (
            <article key={t.id} className={`p-10 md:p-14 ${base}`} data-testid={`testimonial-${t.id}`}>
              <Quote size={22} className={variant === 2 ? "text-[#C8A97E]" : "text-[#C8A97E]"} />
              <div className="flex gap-1 mt-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-[#C8A97E] text-[#C8A97E]" />
                ))}
              </div>
              <p className={`font-serif italic text-2xl leading-snug mt-6 ${textCol}`}>"{t.text}"</p>
              <div className="mt-10 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[#C8A97E]/25 flex items-center justify-center font-serif text-[#2A2522]">
                  {t.name[0]}
                </div>
                <div>
                  <div className={`font-medium ${variant === 2 ? "text-[#FBF9F6]" : "text-[#2A2522]"}`}>{t.name}</div>
                  <div className="label-xs !text-[#C8A97E] mt-1">{t.role}</div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="py-20 bg-[#F3EBE5]/50" data-testid="testimonials-cta">
        <div className="ed-container flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <Heading 
             title="Your story could be next — and we would be honoured to write it."
             as="h3"
             titleClassName="text-3xl sm:text-4xl max-w-xl"
          />
          <PrimaryButton href="/booking" testId="testimonials-book-btn">Reserve a Date</PrimaryButton>
        </div>
      </section>
    </div>
  );
}
