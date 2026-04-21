"use client";
import React, { useEffect, useState } from "react";
import gsap from "gsap";

export default function Loader({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setLoading(false);
      }
    });

    tl.to(".loader-text-inner", {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      stagger: 0.1,
    })
    .to(".loader-text-inner", {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power4.in",
      stagger: 0.1,
      delay: 0.5,
    })
    .to(".loader-curtain", {
      y: "-100%",
      duration: 1.2,
      ease: "power4.inOut",
      stagger: 0.1,
    })
    .set(".loader-container", { display: "none" });

  }, []);

  return (
    <>
      <div className="loader-container fixed inset-0 z-[9999] flex flex-col justify-center items-center pointer-events-none">
        <div className="loader-curtain absolute inset-0 bg-[#2A2522] h-full w-full" />
        <div className="loader-text font-serif text-3xl sm:text-4xl text-[#C8A97E] tracking-widest relative z-10 flex gap-4 overflow-hidden">
          <span className="loader-text-inner translate-y-full opacity-0 inline-block">Deepali</span>
          <span className="loader-text-inner translate-y-full opacity-0 inline-block italic">Makeup Artist</span>
        </div>
      </div>
      
      <div className={loading ? "h-screen overflow-hidden" : ""}>
        {children}
      </div>
    </>
  );
}
