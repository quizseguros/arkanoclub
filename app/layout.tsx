import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ChatWidget from "@/components/ChatWidget";
import { SearchProvider } from "@/lib/search-context";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Arkano Club | Relógios originais com garantia",
  description:
    "Relógios originais e com garantia, de marcas como Seiko, Citizen, TAG Heuer, Tudor, Longines, Mido, Baltic e Venezianico. Envio para todo o Brasil.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.variable} font-sans bg-arkano-black text-arkano-champagne antialiased`}>
        <SearchProvider>
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
          <ChatWidget />
        </SearchProvider>
      </body>
    </html>
  );
}
