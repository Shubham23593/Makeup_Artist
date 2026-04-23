import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import AOSInit from "@/components/AOSInit";
import { ImageDataProvider } from "@/lib/ImageDataContext";
import "./globals.css";

export const metadata = {
  title: "Deepali Makeup Artist | Professional Makeup Services",
  description: "Professional makeup artist specializing in bridal, party, and event makeup. Creating elegant, natural, and long-lasting looks for every special occasion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap"
        />
        <link rel="preload" as="image" href="/slider/splide1_largescreen.jpg" media="(min-width: 768px)" />
        <link rel="preload" as="image" href="/slider/splide1_smallscreen.jpeg" media="(max-width: 767px)" />
      </head>
      <body>
        <ImageDataProvider>
          <SmoothScroll>
            <div className="App min-h-screen">
              <Loader>
                <AOSInit />
                <Toaster position="top-center" richColors />
                <Navbar />
                <main>
                  {children}
                </main>
                <Footer />
              </Loader>
            </div>
          </SmoothScroll>
        </ImageDataProvider>
      </body>
    </html>
  );
}
