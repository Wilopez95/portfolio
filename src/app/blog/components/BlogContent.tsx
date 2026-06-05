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
          <p className="text-text-muted text-sm">{t.blog.empty}</p>
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
