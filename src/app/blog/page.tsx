import type { Metadata } from "next";
import { getPosts } from "@/lib/data";
import { BlogContent } from "./components/BlogContent";

export const metadata: Metadata = {
  title: "Blog — Wilson López",
  description: "Articles and posts on software engineering, AI, and building products.",
};

export default function Page() {
  const posts = getPosts();
  return <BlogContent posts={posts} />;
}
