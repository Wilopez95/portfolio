"use client";

import { useLang } from "@/lib/LanguageContext";
import type { Post } from "@/types";

function formatDate(dateStr: string, lang: string) {
  return new Date(dateStr).toLocaleDateString(lang === "es" ? "es-CR" : "en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function PostCard({ post }: { post: Post }) {
  const { lang, t } = useLang();

  const platformLabel = post.platform === "medium" ? t.blog.medium : t.blog.linkedin;
  const isLinkedin = post.platform === "linkedin";

  return (
    <article className="group flex flex-col bg-bg-card border border-border rounded-xl overflow-hidden hover:border-text-muted transition-colors duration-200">
      <div className="h-0.5 w-full bg-border group-hover:bg-text-muted transition-colors duration-200" />

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Platform badge + date */}
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
            isLinkedin
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
              : "bg-bg-surface text-text-muted border-border"
          }`}>
            {platformLabel}
          </span>
          <time className="text-xs text-text-muted">{formatDate(post.date, lang)}</time>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-text-primary leading-snug">{post.title}</h3>

        {/* Excerpt */}
        <p className="text-sm text-text-secondary leading-relaxed flex-1">{post.excerpt}</p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs text-text-muted border border-border bg-bg-surface">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Link */}
        <div className="pt-2 border-t border-border">
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            {t.blog.readArticle}
          </a>
        </div>
      </div>
    </article>
  );
}
