"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * WL Brand Mark — three treatment options:
 *
 * A) "Stroke" — pure ligature, no background. Minimal, Swiss.
 * B) "Node"   — ligature + filled node at the L junction. Recommended.
 *               The node suggests network/connectivity/technology.
 * C) "Seal"   — mark inside a rounded-square container. Inverts with theme.
 *               Works at any size including 16px favicon.
 */

type Variant = "stroke" | "node" | "seal";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, number> = { sm: 28, md: 36, lg: 48 };

interface LogoMarkProps {
  variant?: Variant;
  size?: Size | number;
  className?: string;
}

// ── Mark geometry (64×44 viewBox) ──────────────────────────
// Path: W-L ligature where W's right descent = L's vertical
// M topLeft → valley1 → centerPeak → Lcorner → Lbase
const MARK_PATH = "M 4,6 L 17,38 L 32,8 L 47,38 L 62,38";
const NODE_CX = 47;
const NODE_CY = 38;
const NODE_R = 4.5;

// Icon-size path (scaled to fit 48×48 with 10px padding)
const ICON_PATH = "M 12,17 L 18,32 L 25,18 L 33,32 L 40,32";
const ICON_NODE = { cx: 33, cy: 32, r: 2.5 };

// ── Stroke variant ─────────────────────────────────────────
export function LogoStroke({ px = 36, color = "currentColor" }: { px?: number; color?: string }) {
  const h = Math.round(px * (44 / 64));
  return (
    <svg width={px} height={h} viewBox="0 0 64 44" fill="none" aria-label="WL">
      <path
        d={MARK_PATH}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Node variant (recommended) ─────────────────────────────
export function LogoNode({ px = 36, color = "currentColor" }: { px?: number; color?: string }) {
  const h = Math.round(px * (44 / 64));
  return (
    <svg width={px} height={h} viewBox="0 0 64 44" fill="none" aria-label="WL">
      <path
        d={MARK_PATH}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={NODE_CX} cy={NODE_CY} r={NODE_R} fill={color} />
    </svg>
  );
}

// ── Seal variant — mark in rounded square, always contrasts ─
export function LogoSeal({ px = 36 }: { px?: number }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Icon always inverts: dark bg in light mode, light bg in dark mode
  const bgColor = !mounted || resolvedTheme !== "dark" ? "#111111" : "#f5f5f5";
  const fgColor = !mounted || resolvedTheme !== "dark" ? "#f5f5f5" : "#111111";

  return (
    <svg width={px} height={px} viewBox="0 0 48 48" fill="none" aria-label="WL">
      <rect width="48" height="48" rx="10" fill={bgColor} />
      <path
        d={ICON_PATH}
        stroke={fgColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={ICON_NODE.cx} cy={ICON_NODE.cy} r={ICON_NODE.r} fill={fgColor} />
    </svg>
  );
}

// ── Horizontal lockup: icon + name ────────────────────────
export function LogoHorizontal({ variant = "node", size = "md" }: { variant?: Variant; size?: Size }) {
  const px = SIZES[size];
  return (
    <div className="flex items-center gap-3">
      {variant === "seal" && <LogoSeal px={px} />}
      {variant === "node" && <LogoNode px={px} />}
      {variant === "stroke" && <LogoStroke px={px} />}
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold text-text-primary tracking-tight">Wilson</span>
        <span className="text-sm font-light text-text-secondary tracking-tight">López</span>
      </div>
    </div>
  );
}

// ── Default export: nav-ready logo ────────────────────────
// Change `variant` here to switch the whole site
const ACTIVE_VARIANT: Variant = "seal";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} aria-label="Wilson López — Home">
      <LogoSeal px={36} />
    </Link>
  );
}

// Preview component — used in brand file / storybook
export function LogoPreview() {
  return (
    <div className="p-8 space-y-10 bg-bg-primary rounded-xl border border-border">
      <div className="space-y-3">
        <p className="text-xs text-text-muted uppercase tracking-widest">A — Stroke (minimal)</p>
        <LogoStroke px={48} />
      </div>
      <div className="space-y-3">
        <p className="text-xs text-text-muted uppercase tracking-widest">B — Node (recommended)</p>
        <LogoNode px={48} />
      </div>
      <div className="space-y-3">
        <p className="text-xs text-text-muted uppercase tracking-widest">C — Seal (versatile)</p>
        <div className="flex items-center gap-6">
          <LogoSeal px={48} />
          <LogoSeal px={36} />
          <LogoSeal px={24} />
          <LogoSeal px={16} />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs text-text-muted uppercase tracking-widest">Horizontal lockup</p>
        <LogoHorizontal variant="seal" size="md" />
      </div>
    </div>
  );
}
