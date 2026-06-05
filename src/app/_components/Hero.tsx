"use client";

import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

function CodeWindow() {
  return (
    <div className="w-full max-w-md rounded-xl overflow-hidden border border-border bg-[#111111] shadow-2xl font-mono text-sm leading-relaxed">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-text-muted">wilson.ts</span>
      </div>

      {/* Code */}
      <div className="px-5 py-5 space-y-0.5">
        <p>
          <span className="text-blue-400">const</span>
          <span className="text-text-primary"> wilson </span>
          <span className="text-text-muted">= {"{"}</span>
        </p>
        <p className="pl-4">
          <span className="text-red-400">role</span>
          <span className="text-text-muted">: </span>
          <span className="text-green-400">&quot;Senior Fullstack Engineer&quot;</span>
          <span className="text-text-muted">,</span>
        </p>
        <p className="pl-4">
          <span className="text-red-400">focus</span>
          <span className="text-text-muted">: [</span>
          <span className="text-green-400">&quot;AI Agents&quot;</span>
          <span className="text-text-muted">, </span>
          <span className="text-green-400">&quot;Security&quot;</span>
          <span className="text-text-muted">],</span>
        </p>
        <p className="pl-4">
          <span className="text-red-400">stack</span>
          <span className="text-text-muted">: [</span>
          <span className="text-green-400">&quot;Next.js&quot;</span>
          <span className="text-text-muted">, </span>
          <span className="text-green-400">&quot;Java&quot;</span>
          <span className="text-text-muted">, </span>
          <span className="text-green-400">&quot;Claude&quot;</span>
          <span className="text-text-muted">],</span>
        </p>
        <p className="pl-4">
          <span className="text-red-400">location</span>
          <span className="text-text-muted">: </span>
          <span className="text-green-400">&quot;Costa Rica&quot;</span>
          <span className="text-text-muted">,</span>
        </p>
        <p className="pl-4">
          <span className="text-red-400">remote</span>
          <span className="text-text-muted">: </span>
          <span className="text-blue-400">true</span>
          <span className="text-text-muted">,</span>
        </p>
        <p><span className="text-text-muted">{"}"}</span></p>
        <p className="pt-3">
          <span className="text-text-secondary">wilson</span>
          <span className="text-text-muted">.</span>
          <span className="text-yellow-400">build</span>
          <span className="text-text-muted">(</span>
          <span className="text-green-400">&apos;something great&apos;</span>
          <span className="text-text-muted">);</span>
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useLang();
  const h = t.hero;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text content */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-text-muted tracking-widest uppercase">
                {h.available}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-text-primary leading-[1.05] tracking-tight mb-6">
              {h.headline1}
              <br />
              <span className="text-text-secondary">{h.headline2}</span>
            </h1>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-text-secondary font-light mb-4 leading-relaxed">
              {h.tagline}
            </p>

            {/* Description */}
            <p className="text-base text-text-muted mb-10 leading-relaxed">
              {h.descPre}{" "}
              <span className="text-text-secondary font-medium">Imprivata</span>
              {" "}{h.descMid}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-text-primary text-bg-primary font-semibold text-sm hover:opacity-80 transition-opacity"
              >
                {h.viewProjects}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-border text-text-secondary font-semibold text-sm hover:border-text-muted hover:text-text-primary transition-colors"
              >
                {h.downloadCv}
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-6">
              {[
                { label: "GitHub", href: "https://github.com/Wilopez95" },
                { label: "LinkedIn", href: "https://linkedin.com/in/wilopez95" },
                { label: "Email", href: "mailto:wilopez95@gmail.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-sm font-medium text-text-muted hover:text-text-primary underline underline-offset-4 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — code window */}
          <div className="hidden lg:flex justify-center">
            <CodeWindow />
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
    </section>
  );
}
