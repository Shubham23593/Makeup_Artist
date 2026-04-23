"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 700,
      easing: "ease-out-cubic",
      offset: 50,
      delay: 0,
      anchorPlacement: "top-bottom",
    });
  }, []);

  // Refresh AOS on every route change so new page elements get detected
  useEffect(() => {
    setTimeout(() => AOS.refresh(), 500);
  }, [pathname]);

  return null;
}
