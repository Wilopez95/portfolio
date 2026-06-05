import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Navbar } from "@/components/shared/Navbar";
import { ParticleBackground } from "@/components/shared/ParticleBackground";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wilson López — Senior Fullstack Engineer",
  description:
    "Senior Fullstack Engineer specializing in AI-powered products and secure software. React, Node.js, Spring Boot, AWS. Open to remote roles.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <LanguageProvider>
          <ThemeProvider>
            {/* Fixed particle canvas — behind everything */}
            <ParticleBackground />

            {/* All page content sits above the canvas */}
            <div className="relative" style={{ zIndex: 1 }}>
              <Navbar />
              <main>{children}</main>
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
