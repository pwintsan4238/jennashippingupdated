import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import "./globals.css";
import { asset } from "@/lib/asset";

const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], weight: ["500", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://jenashipping.com"),
  title: {
    default: "Jena Shipping — Myanmar Seafarer Crewing & Maritime Training",
    template: "%s · Jena Shipping",
  },
  description:
    "Jena Shipping connects qualified Myanmar seafarers with reputable international shipowners, with STCW training, crane, welding and Chinese language courses, and family welfare support.",
  icons: { icon: asset("/logo.png") },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* hide [data-reveal] elements only when JS runs and motion is allowed */}
        <script
          dangerouslySetInnerHTML={{
            __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reveal')",
          }}
        />
      </head>
      <body className={`${interTight.variable} ${inter.variable} ${mono.variable} antialiased`}>
        <SmoothScroll />
        <ScrollReveal />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
