import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
const Facebook = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const Instagram = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
import { STUDIO, SERVICES } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#2A2522] text-[#FBF9F6] pt-24 mt-24 relative overflow-hidden" data-testid="site-footer">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8A97E] to-transparent opacity-50"></div>

      <div className="ed-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-20">
          <div className="md:col-span-5" data-aos="fade-right">
            <div className="font-serif text-4xl lg:text-5xl leading-tight">
              Deepali <br/> <em className="not-italic text-[#C8A97E]">Makeovers.</em>
            </div>
            <p className="mt-8 text-[15px] leading-relaxed text-[#FBF9F6]/60 max-w-sm">
               Artistry that enhances your natural beauty. Providing bespoke bridal, editorial, and event makeup services tailored for your unique moments.
            </p>
            <div className="flex items-center gap-5 mt-10">
              <a href={STUDIO.instagram} target="_blank" rel="noreferrer" data-testid="footer-instagram" className="p-3 bg-[#FBF9F6]/5 rounded-full hover:bg-[#C8A97E] hover:text-[#2A2522] transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href={STUDIO.facebook} target="_blank" rel="noreferrer" data-testid="footer-facebook" className="p-3 bg-[#FBF9F6]/5 rounded-full hover:bg-[#C8A97E] hover:text-[#2A2522] transition-all duration-300">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-8">
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="label-xs !text-[#C8A97E] mb-6 tracking-widest">Menu</div>
              <ul className="space-y-4 text-[15px] text-[#FBF9F6]/70">
                {["Home","About","Services","Portfolio","Pricing"].map((l) => (
                  <li key={l}>
                    <Link href={`/${l === "Home" ? "" : l.toLowerCase()}`} className="hover:text-[#FBF9F6] hover:translate-x-1 inline-block transition-transform duration-300">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <div className="label-xs !text-[#C8A97E] mb-6 tracking-widest">Inquiries</div>
              <ul className="space-y-4 text-[15px] text-[#FBF9F6]/70">
                {["Booking","Testimonials","Contact"].map((l) => (
                  <li key={l}>
                    <Link href={`/${l.toLowerCase()}`} className="hover:text-[#FBF9F6] hover:translate-x-1 inline-block transition-transform duration-300">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 lg:col-span-1" data-aos="fade-up" data-aos-delay="300">
              <div className="label-xs !text-[#C8A97E] mb-6 tracking-widest">Studio</div>
              <ul className="space-y-4 text-[15px] text-[#FBF9F6]/70">
                <li className="flex items-start gap-3"><MapPin size={16} className="mt-1 text-[#C8A97E] shrink-0" /><span className="leading-relaxed">{STUDIO.address}</span></li>
                <li className="flex items-center gap-3 mt-4"><Phone size={16} className="text-[#C8A97E] shrink-0" /><a href={`tel:${STUDIO.phone}`} className="hover:text-[#FBF9F6] transition-colors">{STUDIO.phone}</a></li>
                <li className="flex items-center gap-3 mt-4"><Mail size={16} className="text-[#C8A97E] shrink-0" /><a href={`mailto:${STUDIO.email}`} className="hover:text-[#FBF9F6] transition-colors">{STUDIO.email}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full text-center overflow-hidden flex flex-col items-center justify-center py-14 md:py-16 border-t border-[#FBF9F6]/10 border-b relative" data-aos="zoom-in" data-aos-delay="100">
          <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[6.5vw] font-serif uppercase tracking-tight text-[#FBF9F6]/5 select-none pointer-events-none flex flex-col md:flex-row gap-0 md:gap-4 leading-[0.85] md:leading-none">
  <span>Deepali</span>
  <span>Makeovers</span>
</h1>
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="text-[10px] sm:text-xs md:text-sm tracking-[0.3em] font-medium bg-[#2A2522] px-4 md:px-6 py-2 text-[#C8A97E] uppercase text-center">
                 Makeup Artist
             </div>
           </div>
        </div>

        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#FBF9F6]/40 tracking-widest uppercase" data-aos="fade-up" data-aos-delay="200">
          <div>© {new Date().getFullYear()} Deepali. All Rights Reserved.</div>
          <div className="flex items-center gap-4">
            <a href="https://shubham-portfolio-nine-eta.vercel.app/" target="_blank" className="hover:text-[#C8A97E] transition-colors">
              Developed by Shubham Dalvi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
