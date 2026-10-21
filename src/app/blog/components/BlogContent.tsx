"use client";

import { useLang } from "@/lib/LanguageContext";
import { PostCard } from "./PostCard";
import type { Post } from "@/types";

export function BlogContent({ posts }: { posts: Post[] }) {
  const { t } = useLang();
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-3">
            {t.blog.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            {t.blog.title}
          </h1>
          <p className="text-text-secondary max-w-xl">{t.blog.desc}</p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-bg-card/50 px-6 py-16 text-center">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-medium bg-bg-surface text-text-muted border border-border mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400/80" />
              {t.blog.comingSoon}
            </span>
            <p className="text-text-secondary max-w-md mx-auto leading-relaxed">{t.blog.comingSoonDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
