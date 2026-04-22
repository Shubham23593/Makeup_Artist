"use client";
import React, { useEffect, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import axios from "axios";
import { HERO_IMAGE, SERVICES, PORTFOLIO, STUDIO, ARTIST } from "@/lib/data";
import Heading from "@/components/Heading";
import PrimaryButton from "@/components/PrimaryButton";
import SliderPage from "@/components/CrazyComponents/tsx/SliderPage";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function RecentWork() {
  const [gallery, setGallery] = useState(PORTFOLIO);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/images");
        const data = await res.json();
        if (data.success && data.images) {
          const items = [];
          data.images.forEach(img => {
            const posMatch = img.category.match(/^Portfolio:\s+(.+?)\s+(\d+)$/);
            if (posMatch) {
              items.push({
                id: img._id,
                category: posMatch[1],
                pos: parseInt(posMatch[2]),
                image: img.imageUrl,
                title: img.title || posMatch[1],
              });
            }
          });
          items.sort((a, b) => a.pos - b.pos);
          if (items.length > 0) setGallery(items);
        }
      } catch (err) {}
    }
    fetchPortfolio();
  }, []);

  // Pick up to 6 images for the grid
  const g = gallery;
  return (
    <section className="py-24 md:py-32" data-testid="featured-gallery">
      <div className="ed-container">
        <div className="flex items-end justify-between mb-16">
          <Heading 
             subtitle="02 — Portfolio"
             title="Our latest makeup work and transformations."
             titleClassName="text-4xl sm:text-5xl max-w-xl"
          />
        <PrimaryButton 
          href="/portfolio" 
          outline 
          className="!hidden md:!inline-flex"
          testId="featured-view-all-btn"
        >
          View the Archive
        </PrimaryButton>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {g[0] && (
            <div className="col-span-12 md:col-span-7 hover-zoom aspect-[4/3]">
              <img src={g[0].image} alt={g[0].title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-4 md:gap-6">
            {g[1] && (
              <div className="hover-zoom flex-1 aspect-[3/3]">
                <img src={g[1].image} alt={g[1].title} className="w-full h-full object-cover" />
              </div>
            )}
            {g[2] && (
              <div className="hover-zoom flex-1 aspect-[4/3]">
                <img src={g[2].image} alt={g[2].title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          {g[3] && (
            <div className="col-span-6 md:col-span-4 hover-zoom aspect-[3/4]">
              <img src={g[3].image} alt={g[3].title} className="w-full h-full object-cover" />
            </div>
          )}
          {g[4] && (
            <div className="col-span-6 md:col-span-4 hover-zoom aspect-[3/4]">
              <img src={g[4].image} alt={g[4].title} className="w-full h-full object-cover" />
            </div>
          )}
          {g[5] && (
            <div className="col-span-12 md:col-span-4 hover-zoom aspect-[3/4]">
              <img src={g[5].image} alt={g[5].title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="mt-10 md:hidden">
          <PrimaryButton href="/portfolio" outline className="w-full justify-center" testId="featured-view-all-btn-mobile">
            View the Archive
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [servicesData, setServicesData] = useState(SERVICES);

  useEffect(() => {
    axios.get(`${API}/testimonials`).then((r) => setTestimonials(r.data)).catch(() => {
      setTestimonials([
        {
          id: "1",
          rating: 5,
          text: "Thank you so much for the amazing makeup. Because of your work, my look turned out beautiful and our event went perfectly.",
          name: "Sneha S.",
          role: "Client"
        },
        {
          id: "2",
          rating: 5,
          text: "Nice work, loved the makeup look. Very clean and beautiful finish.",
          name: "Trushna",
          role: "Client"
        },
        {
          id: "3",
          rating: 5,
          text: "Beautiful work, loved the detailing and overall look.",
          name: "Komal",
          role: "Makeup Artist"
        },
        {
          id: "4",
          rating: 5,
          text: "Amazing makeup, very neat and professional. Highly recommended.",
          name: "Shweta",
          role: "Client"
        }
      ]);
    });

    // Fetch dynamic service images
    async function fetchServiceImages() {
      try {
        const res = await fetch("/api/images");
        const data = await res.json();
        if (data.success && data.images.length > 0) {
          const updated = SERVICES.map(service => {
            const dynamicImg = data.images.find(img => img.category === `Service: ${service.title}`);
            if (dynamicImg) {
              return { ...service, image: dynamicImg.imageUrl };
            }
            return service;
          });
          setServicesData(updated);
        }
      } catch (err) {}
    }
    fetchServiceImages();
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO SLIDER */}
      <section className="relative overflow-hidden w-full h-screen">
        <SliderPage />
      </section>

      {/* SERVICES PREVIEW */}
      <section className="bg-[#F3EBE5]/40 py-24 md:py-32" data-testid="services-preview-section">
        <div className="ed-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <Heading 
               subtitle="01 — Our Services" 
               title="Six services, one goal — to make you look confident and beautiful." 
               titleClassName="text-4xl sm:text-5xl lg:text-6xl max-w-2xl" 
            />
            <PrimaryButton href="/services" outline className="self-start md:self-auto" testId="services-explore-btn">
              Explore Services <ArrowUpRight size={16} />
            </PrimaryButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.slice(0, 6).map((s, i) => (
              <PrimaryButton
                as="link"
                href="/services"
                key={s.slug}
                testId={`service-card-${s.slug}`}
                className="!bg-transparent !p-0 !border-0 group bg-white border border-[#2A2522]/10 hover:border-[#C8A97E] transition-colors flex flex-col items-start block text-left !normal-case tracking-normal focus:!bg-transparent focus:!text-[#2A2522]"
              >
                <div className="hover-zoom aspect-[3/4] w-full bg-[#F3EBE5]">
                  {s.image && <img src={s.image} alt={s.title} className="w-full h-full object-cover" />}
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
      <RecentWork />

      {/* TESTIMONIALS */}
     <section className="bg-[#2A2522] text-[#FBF9F6] py-24 md:py-32" data-testid="home-testimonials-section">
      <div className="ed-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-4">
            <Heading 
              subtitle="03 — Testimonials"
              subtitleClassName="!text-[#C8A97E]"
              title="What Our Clients Say"
              titleClassName="text-4xl sm:text-5xl"
            />

            <p className="mt-6 text-[#FBF9F6]/70 max-w-sm leading-relaxed">
              Real experiences from our happy clients who trusted us for their special moments.
            </p>

            <PrimaryButton 
              as="link" 
              href="/testimonials" 
              className="!bg-transparent !border-0 !p-0 !text-[#C8A97E] inline-flex items-center gap-2 mt-8 text-xs tracking-[0.2em] uppercase hover:gap-3 transition-all" 
              testId="testimonials-read-more-btn"
            >
              View All Reviews <ArrowUpRight size={14} />
            </PrimaryButton>
          </div>

          {/* RIGHT GRID */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            {testimonials.length > 0 ? (
              testimonials.slice(0, 4).map((t) => (
                <div 
                  key={t.id} 
                  className="bg-[#FBF9F6]/[0.04] border-l-2 border-[#C8A97E] p-8 hover:bg-[#FBF9F6]/[0.06] transition"
                  data-testid={`home-testimonial-${t.id}`}
                >

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-[#C8A97E] text-[#C8A97E]" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="font-serif text-lg leading-snug italic text-[#FBF9F6]/90">
                    "{t.text}"
                  </p>

                  {/* User */}
                  <div className="mt-6">
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="label-xs !text-[#C8A97E] mt-1">{t.role}</div>
                  </div>

                </div>
              ))
            ) : (
              <div className="bg-[#FBF9F6]/[0.04] border-l-2 border-[#C8A97E] p-8 text-center text-[#FBF9F6]/60 italic font-serif">
                Client reviews will appear here.
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
                 title="Book your makeup appointment."
                 titleClassName="text-4xl sm:text-5xl lg:text-6xl"
              />
              <p className="mt-6 text-[#6B635E] max-w-lg leading-relaxed">
                Get in touch to discuss your look and reserve your date.
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
