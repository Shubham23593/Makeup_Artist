import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import "./globals.css";

export const metadata = {
  title: "Maison Lumière | Couture Makeup Atelier",
  description: "A couture makeup atelier in Mumbai — private, considered, and quietly extraordinary.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="App min-h-screen">
          <Loader>
            <Toaster position="top-center" richColors />
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </Loader>
        </div>
      </body>
    </html>
  );
}
