import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Navbar } from "@/components/shared/Navbar";
import { ParticleBackground } from "@/components/shared/ParticleBackground";
import { LanguageProvider } from "@/lib/LanguageContext";
import { getPosts } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const TITLE = "Wilson López — Full-Stack Engineer · AI-powered products & secure software";
const DESCRIPTION =
  "Full-Stack Engineer building AI-powered products and secure software. Software Engineer II at Imprivata. React, Next.js, Spring Boot, AWS. Open to remote roles.";

export const metadata: Metadata = {
  metadataBase: new URL("https://wilopez.dev"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Wilson López",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
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
              <Navbar showBlog={getPosts().length > 0} />
              <main>{children}</main>
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
