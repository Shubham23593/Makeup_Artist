"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import PrimaryButton from "./PrimaryButton";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/booking", label: "Booking" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl transition-all duration-500 ease-out ${
        scrolled ? "translate-y-0 opacity-100 bg-[#FBF9F6]/90 border-b border-[#2A2522]/10 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="ed-container flex items-center justify-between py-5">
        <Link href="/" data-testid="nav-logo" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Deepali Makeup Artist" className="h-12 md:h-16 w-auto object-contain mix-blend-multiply" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => {
            const isActive = pathname === l.to;
            return (
              <Link
                key={l.to}
                href={l.to}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className={`text-[11px] tracking-[0.22em] uppercase font-medium transition-colors ${
                  isActive ? "text-[#C8A97E]" : "text-[#2A2522] hover:text-[#C8A97E]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <PrimaryButton
            href="/booking"
            testId="nav-book-now-btn"
            className="!py-3 !px-6"
          >
            Book Now
          </PrimaryButton>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 text-[#2A2522]"
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#2A2522]/10 bg-[#FBF9F6]" data-testid="nav-mobile-menu">
          <div className="ed-container py-6 flex flex-col gap-4">
            {LINKS.map((l) => {
              const isActive = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  href={l.to}
                  data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                  className={`text-sm tracking-[0.2em] uppercase font-medium py-2 ${
                    isActive ? "text-[#C8A97E]" : "text-[#2A2522]"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <PrimaryButton href="/booking" className="mt-2" testId="nav-mobile-book-btn">
              Book Now
            </PrimaryButton>
          </div>
        </div>
      )}
    </header>
  );
}
