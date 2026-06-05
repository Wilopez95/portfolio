import { LogoStroke, LogoNode, LogoSeal, LogoHorizontal } from "@/components/shared/Logo";

// Preview-only page — not linked in nav, remove before launch
export default function BrandPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 space-y-16">

        <div>
          <p className="text-xs text-text-muted tracking-widest uppercase mb-2">Brand Preview</p>
          <h1 className="text-4xl font-bold text-text-primary">Logo Options</h1>
          <p className="text-text-secondary mt-2">
            Three treatments of the WL ligature mark. Pick one — the others are archived.
          </p>
        </div>

        {/* Option A */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-widest uppercase text-text-muted">Option A</span>
            <span className="text-xs text-text-muted">— Stroke · Pure ligature, no container</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 rounded-xl border border-border bg-bg-secondary flex items-center justify-center">
              <LogoStroke px={56} />
            </div>
            <div className="p-8 rounded-xl border border-border bg-[#0a0a0a] flex items-center justify-center">
              <LogoStroke px={56} color="#f5f5f5" />
            </div>
          </div>
          <p className="text-sm text-text-secondary">
            Swiss precision. Works best large. No container — lives by contrast alone.
            Harder to read at small sizes.
          </p>
        </div>

        {/* Option B */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-widest uppercase text-text-muted">Option B</span>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">★ Recommended</span>
            <span className="text-xs text-text-muted">— Node · Ligature + network node</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 rounded-xl border border-border bg-bg-secondary flex items-center justify-center">
              <LogoNode px={56} />
            </div>
            <div className="p-8 rounded-xl border border-border bg-[#0a0a0a] flex items-center justify-center">
              <LogoNode px={56} color="#f5f5f5" />
            </div>
          </div>
          <p className="text-sm text-text-secondary">
            The node at the W-L junction references networks, connectivity, technology.
            More distinctive than A. Still minimal, not decorative.
          </p>
        </div>

        {/* Option C */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-widest uppercase text-text-muted">Option C</span>
            <span className="text-xs text-text-muted">— Seal · Mark in rounded-square container</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 rounded-xl border border-border bg-bg-secondary flex items-center justify-center gap-6">
              <LogoSeal px={64} />
              <LogoSeal px={48} />
              <LogoSeal px={36} />
              <LogoSeal px={24} />
              <LogoSeal px={16} />
            </div>
            <div className="p-8 rounded-xl border border-border bg-[#0a0a0a] flex items-center justify-center gap-6">
              <LogoSeal px={64} />
              <LogoSeal px={48} />
              <LogoSeal px={36} />
              <LogoSeal px={24} />
            </div>
          </div>
          <p className="text-sm text-text-secondary">
            Always inverts to contrast with the page. Works at 16px. The container
            suggests containment, security, structure. Best for profile pictures and favicon.
          </p>
        </div>

        {/* Horizontal lockups */}
        <div className="space-y-4">
          <p className="text-xs font-bold tracking-widest uppercase text-text-muted">Horizontal Lockups</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["stroke", "node", "seal"] as const).map((v) => (
              <div key={v} className="p-6 rounded-xl border border-border bg-bg-secondary flex items-center justify-center">
                <LogoHorizontal variant={v} size="md" />
              </div>
            ))}
          </div>
        </div>

        {/* Current favicon usage */}
        <div className="space-y-4 border-t border-border pt-8">
          <p className="text-xs font-bold tracking-widest uppercase text-text-muted">Currently Active in Navbar</p>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-bg-card">
            <LogoSeal px={34} />
            <p className="text-sm text-text-secondary">
              Seal variant at 34px — change in <code className="text-xs bg-bg-surface px-1.5 py-0.5 rounded">Navbar.tsx</code> to switch.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
