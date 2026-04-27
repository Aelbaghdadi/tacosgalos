import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileCartBar } from "@/components/cart/MobileCartBar";
import { ProductModal } from "@/components/menu/ProductModal";
import { LocationSelector } from "@/components/locations/LocationSelector";
import { Toast } from "@/components/ui/Toast";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "800", "900"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Tacos Galos · Pide directo · Tu taco, tus reglas",
    template: "%s · Tacos Galos",
  },
  description:
    "El taco francés que está reventando Barcelona. 100% Halal. Pide directo en la web, recoge en 8 min y desbloquea promos exclusivas.",
  metadataBase: new URL("https://tacosgalos.com"),
  icons: { icon: "/images/logo.jpg" },
  openGraph: {
    siteName: "Tacos Galos",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E30613",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${anton.variable} ${inter.variable}`}>
      <body>
        <TopBar />
        <Header />
        <main>{children}</main>
        <Footer />

        {/* Globales: drawers y modales */}
        <CartDrawer />
        <ProductModal />
        <LocationSelector />
        <MobileCartBar />
        <Toast />
      </body>
    </html>
  );
}
