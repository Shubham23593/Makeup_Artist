"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Award, Sparkles, BookOpen } from "lucide-react";
import { ABOUT_IMAGE as FALLBACK_ABOUT_IMAGE, ARTIST, STUDIO } from "@/lib/data";
import { useImageData } from "@/lib/ImageDataContext";
import Heading from "@/components/Heading";
import PrimaryButton from "@/components/PrimaryButton";

const AnimatedCount = ({ value }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value) || 0;
  const suffix = typeof value === 'string' ? value.replace(/[0-9]/g, '').trim() : '';

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  const displayCount = count < 10 && target < 10 ? `0${count}` : count;
  return <span>{displayCount}{suffix && ` ${suffix}`}</span>;
};

export default function About() {
  const { images, loading } = useImageData();

  // Derive aboutImage from shared context
  const aboutImage = React.useMemo(() => {
    if (loading || !images || images.length === 0) return FALLBACK_ABOUT_IMAGE;
    const aboutImg = images.find(img => img.category === 'About Section');
    return aboutImg ? aboutImg.imageUrl : FALLBACK_ABOUT_IMAGE;
  }, [images, loading]);
  return (
    <div data-testid="about-page">
      <section className="ed-container pt-16 md:pt-24 pb-20 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5" data-aos="fade-right">
          <Heading
            subtitle="About the Atelier"
            title={`${ARTIST.name}.`}
            titleClassName="text-5xl sm:text-6xl lg:text-7xl"
          />
          <div className="font-serif italic text-[#C8A97E] text-2xl mt-3">{ARTIST.title}</div>
          <p className="mt-10 text-[17px] leading-relaxed text-[#6B635E] max-w-md">{ARTIST.bio}</p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#2A2522]/10 pt-8 max-w-md">
            <div><div className="font-serif text-3xl"><AnimatedCount value={ARTIST.experience} /></div><div className="label-xs mt-1">YEARS</div></div>
            <div><div className="font-serif text-3xl"><AnimatedCount value={ARTIST.weddings} /></div><div className="label-xs mt-1">CLIENTS</div></div>
            <div><div className="font-serif text-3xl"><AnimatedCount value={ARTIST.editorials} /></div><div className="label-xs mt-1">MAKEOVERS</div></div>
          </div>

          <PrimaryButton href="/booking" className="mt-10" testId="about-book-btn">Begin Your Story</PrimaryButton>
        </div>

        <div className="lg:col-span-7" data-aos="fade-left" data-aos-delay="200">
          <div className="hover-zoom aspect-[3/3] bg-[#E5DCD3] relative">
            {aboutImage && <Image src={aboutImage} alt={`${ARTIST.name} at work`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 58vw" priority />}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#F3EBE5]/50 py-24 md:py-32" data-testid="mission-section">
        <div className="ed-container grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5" data-aos="fade-right">
            <span className="label-xs">The Mission</span>
          </div>
          <div className="lg:col-span-7" data-aos="fade-up" data-aos-delay="150">
            <blockquote className="font-serif italic text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#2A2522] font-light">
              "{ARTIST.mission}"
            </blockquote>
            <div className="mt-8 text-[#6B635E]">— {ARTIST.name}</div>
          </div>
        </div>
      </section>

      {/* Certifications & Press */}
      <section className="py-24 md:py-32" data-testid="credentials-section">
        <div className="ed-container grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div data-aos="fade-up">
            <div className="flex items-center gap-3 mb-8">
              <Award size={18} className="text-[#C8A97E]" />
              <span className="label-xs">Certifications</span>
            </div>
            <ul className="space-y-6">
              {ARTIST.certifications.map((c, i) => (
                <li key={i} className="border-b border-[#2A2522]/10 pb-5" data-testid={`cert-${i}`}>
                  <div className="font-serif text-xl text-[#2A2522]">{c}</div>
                </li>
              ))}
            </ul>
          </div>
          <div data-aos="fade-up" data-aos-delay="150">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen size={18} className="text-[#C8A97E]" />
              <span className="label-xs">highlights</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ARTIST.press.map((p, i) => (
                <div key={i} className="border border-[#2A2522]/10 px-6 py-6 font-serif italic text-xl text-center text-[#2A2522]/80 hover:border-[#C8A97E] hover:text-[#2A2522] transition-colors" data-testid={`press-${i}`}>
                  {p}
                </div>
              ))}
            </div>

            <div className="mt-12 bg-[#2A2522] text-[#FBF9F6] p-10">
              <div className="flex items-center gap-2 label-xs !text-[#C8A97E] mb-4">
                <Sparkles size={14} /> Philosophy
              </div>
              <p className="font-serif italic text-2xl leading-snug text-[#FBF9F6]/95">
                Makeup that enhances, not transforms — soft, elegant, and designed to bring out your natural glow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="about-cta">
        <div className="ed-container border-t border-[#2A2522]/15 pt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8" data-aos="fade-up">
          <Heading
            title="Let’s create your perfect look."
            as="h3"
            titleClassName="text-3xl sm:text-4xl max-w-xl"
          />
          <PrimaryButton href="/contact" outline testId="about-visit-btn">Plan a Visit</PrimaryButton>
        </div>
      </section>
    </div>
  );
}
