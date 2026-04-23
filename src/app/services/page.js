"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { Check, ArrowUpRight } from "lucide-react";
import { SERVICES as BASE_SERVICES } from "@/lib/data";
import { useImageData } from "@/lib/ImageDataContext";
import Heading from "@/components/Heading";
import PrimaryButton from "@/components/PrimaryButton";

export default function Services() {
  const { images, loading } = useImageData();

  const servicesData = useMemo(() => {
    if (loading || !images || images.length === 0) return BASE_SERVICES;
    return BASE_SERVICES.map(service => {
      const dynamicImg = images.find(img => img.category === `Service: ${service.title}`);
      if (dynamicImg) {
        return { ...service, image: dynamicImg.imageUrl };
      }
      return service;
    });
  }, [images, loading]);
  return (
    <div data-testid="services-page">
      <section className="ed-container pt-16 md:pt-24 pb-16" data-aos="fade-up">
        <Heading
          subtitle="The Services"
          title='Six services, one goal — to make you look <em class="not-italic text-[#C8A97E]">Confident and Beautiful</em>.'
          titleClassName="text-5xl sm:text-6xl lg:text-7xl max-w-3xl"
        />
        <p className="mt-8 max-w-xl text-[#6B635E] leading-relaxed">
          Every service begins with understanding your style, outfit, and occasion — to create a makeup look that makes you feel confident and beautiful.
        </p>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="ed-container space-y-24 md:space-y-32">
          {servicesData.map((s, idx) => {
            const even = idx % 2 === 0;
            return (
              <article
                key={s.slug}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
                data-testid={`service-row-${s.slug}`}
                data-aos={even ? "fade-right" : "fade-left"}
              >
                <div className={`lg:col-span-7 ${even ? "" : "lg:order-2"}`}>
                    <div className="h-[500px] flex items-center justify-center relative">
                    {s.image ? (
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-center text-[#C8A97E] font-serif italic text-xl opacity-60 select-none">
                        {s.title}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`lg:col-span-5 ${even ? "" : "lg:order-1"}`}>
                  <Heading
                    subtitle={`0${idx + 1}`}
                    subtitleClassName="!text-[#C8A97E]"
                    title={s.title}
                    titleClassName="text-4xl sm:text-5xl"
                  />
                  <div className="font-serif italic text-xl text-[#6B635E] mt-2">{s.tagline}</div>
                  <p className="mt-6 text-[#6B635E] leading-relaxed">{s.description}</p>

                  <ul className="mt-8 space-y-3">
                    {s.includes.map((i) => (
                      <li key={i} className="flex items-start gap-3 text-[#2A2522]">
                        <Check size={16} className="text-[#C8A97E] mt-1" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 flex flex-wrap gap-4">
                    <PrimaryButton href="/booking" testId={`service-book-${s.slug}`}>
                      Book {s.title} <ArrowUpRight size={16} />
                    </PrimaryButton>
                    <PrimaryButton href="/pricing" outline testId={`service-pricing-${s.slug}`}>
                      View Pricing
                    </PrimaryButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
