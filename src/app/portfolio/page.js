"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { PORTFOLIO, BEFORE_AFTER } from "@/lib/data";
import { useImageData } from "@/lib/ImageDataContext";
import Heading from "@/components/Heading";

const CATEGORIES = ["All", "Bridal", "Party", "Photoshoot"];

const BeforeAfter = ({ item }) => {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative select-none overflow-hidden aspect-[4/5] bg-[#F3EBE5]" data-testid={`before-after-${item.id}`}>
      <img src={item.after} alt={`${item.title} after`} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={item.before} alt={`${item.title} before`} className="absolute inset-0 w-full h-full object-cover" style={{ width: `${10000 / pos}%`, maxWidth: "none" }} />
      </div>
      <div className="absolute top-4 left-4 label-xs bg-[#FBF9F6]/85 px-2 py-1">Before</div>
      <div className="absolute top-4 right-4 label-xs bg-[#2A2522] text-[#FBF9F6] px-2 py-1">After</div>
      <div className="absolute inset-y-0" style={{ left: `calc(${pos}% - 1px)` }}>
        <div className="h-full w-[2px] bg-[#C8A97E]" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-10 h-10 bg-[#C8A97E] rounded-full flex items-center justify-center text-[#2A2522] font-serif text-lg shadow-md">⇌</div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-label={`${item.title} slider`}
        data-testid={`before-after-slider-${item.id}`}
      />
      <div className="absolute bottom-4 left-4 font-serif italic text-[#FBF9F6] text-lg drop-shadow">{item.title}</div>
    </div>
  );
};

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const { images, loading } = useImageData();

  const { portfolioData, beforeAfterData } = useMemo(() => {
    if (loading || !images || images.length === 0) {
      return { portfolioData: PORTFOLIO, beforeAfterData: BEFORE_AFTER };
    }

    let newBA = JSON.parse(JSON.stringify(BEFORE_AFTER));
    const portfolioItems = [];

    images.forEach(img => {
      const posMatch = img.category.match(/^Portfolio:\s+(.+?)\s+(\d+)$/);
      if (posMatch) {
        portfolioItems.push({
          id: img._id,
          category: posMatch[1],
          pos: parseInt(posMatch[2]),
          image: img.imageUrl,
          title: img.title || posMatch[1],
        });
        return;
      }

      // Handle Before & Afters
      if (img.category === "Before & After 1 (Before)") newBA[0].before = img.imageUrl;
      if (img.category === "Before & After 1 (After)") newBA[0].after = img.imageUrl;
      if (img.category === "Before & After 2 (Before)") newBA[1].before = img.imageUrl;
      if (img.category === "Before & After 2 (After)") newBA[1].after = img.imageUrl;
    });

    portfolioItems.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.pos - b.pos;
    });

    return {
      portfolioData: portfolioItems.length > 0 ? portfolioItems : PORTFOLIO,
      beforeAfterData: newBA,
    };
  }, [images, loading]);

  const items = useMemo(() => active === "All" ? portfolioData : portfolioData.filter((p) => p.category === active), [active, portfolioData]);

  return (
    <div data-testid="portfolio-page">
      <section className="ed-container pt-16 md:pt-24 pb-12" data-aos="fade-up">
        <Heading
          subtitle="Portfolio"
          title='The studio journal — <em class="not-italic text-[#C8A97E]">a curated archive</em>.'
          titleClassName="text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
        />
        <p className="mt-8 max-w-xl text-[#6B635E] leading-relaxed">
          Selected work from brides, editorials, and evenings. Filter by chapter below.
        </p>

        <div className="flex flex-wrap gap-2 mt-10 border-t border-[#2A2522]/10 pt-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              data-testid={`portfolio-filter-${c.toLowerCase()}`}
              className={`px-5 py-2 text-xs tracking-[0.2em] uppercase font-medium border transition-colors ${active === c
                  ? "bg-[#2A2522] text-[#FBF9F6] border-[#2A2522]"
                  : "bg-transparent text-[#2A2522] border-[#2A2522]/20 hover:border-[#C8A97E] hover:text-[#C8A97E]"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry-ish grid */}
      <section className="ed-container pb-24" data-testid="portfolio-grid">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {items.map((p, i) => {
            const spans = [
              "col-span-12 md:col-span-8 aspect-[4/3]",
              "col-span-12 md:col-span-4 aspect-[3/4]",
              "col-span-6 md:col-span-4 aspect-square",
              "col-span-6 md:col-span-4 aspect-square",
              "col-span-12 md:col-span-4 aspect-[3/4]",
              "col-span-12 md:col-span-6 aspect-[3/3]",
              "col-span-12 md:col-span-6 aspect-[3/3]",
              "col-span-12 md:col-span-8 aspect-[3/4]",
            ];
            const cls = spans[i % spans.length];
            return (
              <figure key={p.id} className={`group relative overflow-hidden ${cls}`} data-testid={`portfolio-item-${p.id}`} data-aos="fade-up" data-aos-delay={`${(i % 3) * 100}`}>
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div>
                    <div className="label-xs !text-[#C8A97E]">{p.category}</div>
                    <div className="font-serif italic text-xl text-[#FBF9F6] mt-1">{p.title}</div>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* Before / After — temporarily commented out
      <section className="bg-[#F3EBE5]/50 py-24 md:py-32" data-testid="before-after-section">
        <div className="ed-container">
          <div className="flex items-end justify-between mb-12">
            <Heading
              subtitle="The Transformation"
              title="Before &amp; After — drag to reveal."
              titleClassName="text-4xl sm:text-5xl max-w-xl"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {beforeAfterData.map((b) => <BeforeAfter key={b.id} item={b} />)}
          </div>
        </div>
      </section>
      */}
    </div>
  );
}
