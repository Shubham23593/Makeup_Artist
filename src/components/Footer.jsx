import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
const Facebook = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const Instagram = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
import { STUDIO, SERVICES } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#2A2522] text-[#FBF9F6] mt-24" data-testid="site-footer">
      <div className="ed-container py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="font-serif text-3xl leading-none">
            Maison <em className="not-italic text-[#C8A97E]">Lumière</em>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[#FBF9F6]/70 max-w-xs">
            A couture makeup atelier in Mumbai — private, considered, and quietly extraordinary.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a href={STUDIO.instagram} target="_blank" rel="noreferrer" data-testid="footer-instagram" className="p-2 border border-[#FBF9F6]/20 hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors">
              <Instagram size={16} />
            </a>
            <a href={STUDIO.facebook} target="_blank" rel="noreferrer" data-testid="footer-facebook" className="p-2 border border-[#FBF9F6]/20 hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors">
              <Facebook size={16} />
            </a>
            <a href={STUDIO.pinterest} target="_blank" rel="noreferrer" data-testid="footer-pinterest" className="p-2 border border-[#FBF9F6]/20 hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors text-xs tracking-widest">
              P
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="label-xs !text-[#C8A97E] mb-5">Menu</div>
          <ul className="space-y-3 text-sm text-[#FBF9F6]/80">
            {["Home","About","Services","Portfolio","Pricing","Booking","Testimonials","Contact"].map((l) => (
              <li key={l}>
                <Link href={`/${l === "Home" ? "" : l.toLowerCase()}`} className="hover:text-[#C8A97E] transition-colors">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="label-xs !text-[#C8A97E] mb-5">Services</div>
          <ul className="space-y-3 text-sm text-[#FBF9F6]/80">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href="/services" className="hover:text-[#C8A97E] transition-colors">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="label-xs !text-[#C8A97E] mb-5">Contact</div>
          <ul className="space-y-4 text-sm text-[#FBF9F6]/80">
            <li className="flex items-start gap-3"><MapPin size={15} className="mt-0.5 text-[#C8A97E]" /><span>{STUDIO.address}</span></li>
            <li className="flex items-start gap-3"><Phone size={15} className="mt-0.5 text-[#C8A97E]" /><a href={`tel:${STUDIO.phone}`} className="hover:text-[#C8A97E]">{STUDIO.phone}</a></li>
            <li className="flex items-start gap-3"><Mail size={15} className="mt-0.5 text-[#C8A97E]" /><a href={`mailto:${STUDIO.email}`} className="hover:text-[#C8A97E]">{STUDIO.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#FBF9F6]/10">
        <div className="ed-container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#FBF9F6]/50 tracking-wider uppercase">
          <div>© {new Date().getFullYear()} Maison Lumière. All Rights Reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-[#C8A97E]" data-testid="footer-admin-link">Admin</Link>
            <span>Crafted with quiet intent</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
