"use client";
import React, { useEffect, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import axios from "axios";
import { HERO_IMAGE, SERVICES, PORTFOLIO, STUDIO, ARTIST } from "@/lib/data";
import Heading from "@/components/Heading";
import PrimaryButton from "@/components/PrimaryButton";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    axios.get(`${API}/testimonials`).then((r) => setTestimonials(r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#FBF9F6]">
        <div className="ed-container pt-14 md:pt-20 pb-20 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-6 fade-up">
            <div className="flex items-center gap-4 mb-8">
              <span className="gold-rule" />
              <span className="label-xs">Est. 2019 · Mumbai</span>
            </div>
            
            <Heading 
              as="h1"
              title='Makeup <em class="not-italic text-[#C8A97E]">in quiet</em><br /> conversation<br /> with skin.'
            />
            
            <p className="mt-8 max-w-md text-[17px] leading-relaxed text-[#6B635E]">
              A couture atelier led by {ARTIST.name}. We build makeup that feels private, considered, and unmistakably yours — for brides, editorials, and the evenings you'll remember.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <PrimaryButton href="/booking" testId="hero-book-now-btn">
                Book Now <ArrowUpRight size={16} />
              </PrimaryButton>
              <PrimaryButton href="/portfolio" outline testId="hero-portfolio-btn">
                View Portfolio
              </PrimaryButton>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg border-t border-[#2A2522]/10 pt-8">
              <div><div className="font-serif text-3xl text-[#2A2522]">{ARTIST.weddings}</div><div className="label-xs mt-1">Brides</div></div>
              <div><div className="font-serif text-3xl text-[#2A2522]">{ARTIST.editorials}</div><div className="label-xs mt-1">Editorials</div></div>
              <div><div className="font-serif text-3xl text-[#2A2522]">{ARTIST.experience}</div><div className="label-xs mt-1">Experience</div></div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="hover-zoom aspect-[4/5] bg-[#F3EBE5]">
              <img src={HERO_IMAGE} alt="Editorial bridal makeup" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block absolute -left-8 bottom-10 bg-[#FBF9F6] border border-[#C8A97E] px-6 py-4 shadow-sm">
              <div className="label-xs !text-[#C8A97E]">Featured in</div>
              <div className="font-serif text-xl text-[#2A2522] mt-1">Vogue India · Harper's Bazaar</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="bg-[#F3EBE5]/40 py-24 md:py-32" data-testid="services-preview-section">
        <div className="ed-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <Heading 
               subtitle="01 — The Atelier" 
               title="Six services. One belief — makeup should reveal, never mask." 
               titleClassName="text-4xl sm:text-5xl lg:text-6xl max-w-2xl" 
            />
            <PrimaryButton href="/services" outline className="self-start md:self-auto" testId="services-explore-btn">
              Explore Services <ArrowUpRight size={16} />
            </PrimaryButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.slice(0, 6).map((s, i) => (
              <PrimaryButton
                as="link"
                href="/services"
                key={s.slug}
                testId={`service-card-${s.slug}`}
                className="!bg-transparent !p-0 !border-0 group bg-white border border-[#2A2522]/10 hover:border-[#C8A97E] transition-colors flex flex-col items-start block text-left !normal-case tracking-normal focus:!bg-transparent focus:!text-[#2A2522]"
              >
                <div className="hover-zoom aspect-[4/3] w-full">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex items-start justify-between w-full border border-t-0 border-[#2A2522]/10 group-hover:border-[#C8A97E]">
                  <div>
                    <div className="label-xs !text-[#C8A97E]">0{i + 1}</div>
                    <div className="font-serif text-2xl mt-2 text-[#2A2522]">{s.title}</div>
                    <div className="text-sm text-[#6B635E] mt-1">{s.tagline}</div>
                  </div>
                  <ArrowUpRight size={18} className="text-[#2A2522] group-hover:text-[#C8A97E] transition-colors mt-2" />
                </div>
              </PrimaryButton>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED GALLERY */}
      <section className="py-24 md:py-32" data-testid="featured-gallery">
        <div className="ed-container">
          <div className="flex items-end justify-between mb-16">
            <Heading 
               subtitle="02 — Recent Work"
               title="A recent chapter of the studio journal."
               titleClassName="text-4xl sm:text-5xl max-w-xl"
            />
            <PrimaryButton href="/portfolio" outline className="hidden md:inline-flex" testId="featured-view-all-btn">
              View the Archive
            </PrimaryButton>
          </div>

          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 md:col-span-7 hover-zoom aspect-[4/3]">
              <img src={PORTFOLIO[0].image} alt={PORTFOLIO[0].title} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-12 md:col-span-5 flex flex-col gap-4 md:gap-6">
              <div className="hover-zoom flex-1 aspect-[4/3]">
                <img src={PORTFOLIO[4].image} alt={PORTFOLIO[4].title} className="w-full h-full object-cover" />
              </div>
              <div className="hover-zoom flex-1 aspect-[4/3]">
                <img src={PORTFOLIO[2].image} alt={PORTFOLIO[2].title} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="col-span-6 md:col-span-4 hover-zoom aspect-square">
              <img src={PORTFOLIO[3].image} alt={PORTFOLIO[3].title} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-6 md:col-span-4 hover-zoom aspect-square">
              <img src={PORTFOLIO[5].image} alt={PORTFOLIO[5].title} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-12 md:col-span-4 hover-zoom aspect-square">
              <img src={PORTFOLIO[6].image} alt={PORTFOLIO[6].title} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="mt-10 md:hidden">
            <PrimaryButton href="/portfolio" outline className="w-full justify-center" testId="featured-view-all-btn-mobile">
              View the Archive
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#2A2522] text-[#FBF9F6] py-24 md:py-32" data-testid="home-testimonials-section">
        <div className="ed-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <Heading 
                 subtitle="03 — Voices"
                 subtitleClassName="!text-[#C8A97E]"
                 title="Stories, not reviews."
                 titleClassName="text-4xl sm:text-5xl"
              />
              <p className="mt-6 text-[#FBF9F6]/70 max-w-sm leading-relaxed">
                A decade of weddings, campaigns, and first impressions — as told by the people who wore them.
              </p>
              <PrimaryButton as="link" href="/testimonials" className="!bg-transparent !border-0 !p-0 !text-[#C8A97E] inline-flex items-center gap-2 mt-8 text-xs tracking-[0.2em] uppercase hover:gap-3 transition-all" testId="testimonials-read-more-btn">
                Read All Stories <ArrowUpRight size={14} />
              </PrimaryButton>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.length > 0 ? testimonials.slice(0, 4).map((t) => (
                <div key={t.id} className="bg-[#FBF9F6]/[0.04] border-l-2 border-[#C8A97E] p-8" data-testid={`home-testimonial-${t.id}`}>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-[#C8A97E] text-[#C8A97E]" />
                    ))}
                  </div>
                  <p className="font-serif text-lg leading-snug italic text-[#FBF9F6]/90">"{t.text}"</p>
                  <div className="mt-6">
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="label-xs !text-[#C8A97E] mt-1">{t.role}</div>
                  </div>
                </div>
              )) : (
                 <div className="bg-[#FBF9F6]/[0.04] border-l-2 border-[#C8A97E] p-8 text-center text-[#FBF9F6]/60 italic font-serif">
                     "Voices will load shortly..."
                 </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32" data-testid="home-cta-section">
        <div className="ed-container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end border-t border-[#2A2522]/15 pt-16">
            <div className="md:col-span-7">
              <Heading 
                 title={`Reserve a date at ${STUDIO.name}.`}
                 titleClassName="text-4xl sm:text-5xl lg:text-6xl"
              />
              <p className="mt-6 text-[#6B635E] max-w-lg leading-relaxed">
                Limited bookings each month to honour the craft. Begin with a brief conversation — we'll build the rest from there.
              </p>
            </div>
            <div className="md:col-span-5 flex md:justify-end">
              <PrimaryButton href="/booking" testId="home-cta-book-btn">
                Book an Appointment <ArrowUpRight size={16} />
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
