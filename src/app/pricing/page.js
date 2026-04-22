"use client";
import { Check, Crown, Sparkles } from "lucide-react";
import { PRICING, formatINR, SERVICES } from "@/lib/data";
import Heading from "@/components/Heading";
import PrimaryButton from "@/components/PrimaryButton";

export default function Pricing() {
  return (
    <div data-testid="pricing-page">
      <section className="ed-container pt-16 md:pt-24 pb-16">
        <Heading 
           subtitle="Pricing"
           title='Clear pricing for every occasion, <em class="not-italic text-[#C8A97E]">Custom bookings available on request</em>.'
           titleClassName="text-5xl sm:text-6xl lg:text-7xl max-w-3xl"
        />
        <p className="mt-8 max-w-xl text-[#6B635E] leading-relaxed">
          Starting points for each kind of occasion. Custom editorial & destination bookings available on request.
        </p>
      </section>

      <section className="ed-container pb-24" data-testid="pricing-cards">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PRICING.map((p) => {
            const isGold = p.tone === "gold";
            const isDark = p.tone === "dark";
            const base =
              isDark
                ? "bg-[#2A2522] text-[#FBF9F6] border-[#2A2522]"
                : isGold
                ? "bg-[#C8A97E] text-[#2A2522] border-[#C8A97E]"
                : "bg-white text-[#2A2522] border-[#2A2522]/10";
            const muted = isDark ? "text-[#FBF9F6]/70" : isGold ? "text-[#2A2522]/80" : "text-[#6B635E]";
            const accent = isDark ? "text-[#C8A97E]" : isGold ? "text-[#2A2522]" : "text-[#C8A97E]";
            return (
              <div
                key={p.id}
                data-testid={`pricing-card-${p.id}`}
                className={`relative border p-10 flex flex-col ${base} ${p.highlighted ? "lg:scale-[1.03] shadow-xl z-10" : "z-0"}`}
              >
                {p.highlighted && (
                  <div className="absolute -top-3 left-10 bg-[#2A2522] text-[#C8A97E] px-3 py-1 label-xs !text-[10px]">
                    <Sparkles size={11} className="inline -mt-0.5 mr-1" /> Most Requested
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {isDark && <Crown size={14} className={accent} />}
                  <div className={`label-xs ${accent}`}>{p.note}</div>
                </div>
                <h3 className="font-serif text-4xl mt-4">{p.name}</h3>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-serif text-5xl">{formatINR(p.price)}</span>
                  <span className={`text-sm ${muted}`}>onwards</span>
                </div>
                <ul className="mt-8 space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check size={15} className={`${accent} mt-1`} />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <PrimaryButton
                  as="link"
                  href="/booking"
                  testId={`pricing-book-${p.id}`}
                  className={`mt-10 !bg-transparent w-full transition-colors border text-center flex justify-center !py-4 ${
                    isDark
                      ? "border-[#C8A97E] !text-[#C8A97E] hover:!bg-[#C8A97E] hover:!text-[#2A2522]"
                      : isGold
                      ? "border-[#2A2522] !text-[#2A2522] hover:!bg-[#2A2522] hover:!text-[#FBF9F6]"
                      : "border-[#2A2522] !text-[#2A2522] hover:!bg-[#2A2522] hover:!text-[#FBF9F6]"
                  }`}
                >
                  Reserve {p.name}
                </PrimaryButton>
              </div>
            );
          })}
        </div>

        {/* A-la-carte */}
        <div className="mt-24 border-t border-[#2A2522]/15 pt-16" data-testid="alacarte">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Heading 
                 subtitle="Makeup Services"
                 title="Individual service rates."
                 titleClassName="text-3xl sm:text-4xl"
                 as="h3"
              />
              <p className="mt-4 text-[#6B635E] text-sm leading-relaxed">
                Pricing for individual makeup sessions. Travel charges may apply for outstation or early morning bookings.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="divide-y divide-[#2A2522]/10 border-t border-b border-[#2A2522]/10">
                {SERVICES.map((s) => (
                  <li key={s.slug} className="flex items-center justify-between py-5" data-testid={`alacarte-${s.slug}`}>
                    <div>
                      <div className="font-serif text-xl">{s.title}</div>
                      <div className="text-xs text-[#6B635E] mt-1">{s.tagline}</div>
                    </div>
                    <div className="font-serif text-2xl text-[#2A2522]">{formatINR(s.price || 0)}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-xs text-[#6B635E] tracking-wider">* Prices are starting rates. Final quote depends on look, location, and team required.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
