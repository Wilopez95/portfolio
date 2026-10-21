import type { Lang } from "@/lib/translations";

export type ProjectStatus = "active" | "completed" | "in-progress";

export type PostPlatform = "medium" | "linkedin";

export interface Post {
  id: string;
  title: string;
  url: string;
  platform: PostPlatform;
  excerpt: string;
  date: string;
  tags: string[];
}

export interface ProjectDescription {
  problem: string;
  solution: string;
  result: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  /** Company · title, exactly as on LinkedIn (null = personal project) */
  position: string | null;
  /** Role within the project (e.g. "Lead"), shown separately */
  role: string | null;
  period: { start: string; end: string | null };
  status: ProjectStatus;
  description: Record<Lang, ProjectDescription>;
  stack: string[];
  categories: string[];
  links: {
    github: string | null;
    demo: string | null;
    website: string | null;
    caseStudy: string | null;
  };
  /** Fields still to be filled in */
  _todo?: string[];
  featured: boolean;
  /** Shown first, as a wider card */
  spotlight?: boolean;
  public: boolean;
  image: string | null;
}
