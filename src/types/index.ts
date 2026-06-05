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

export interface Project {
  id: string;
  title: string;
  slug: string;
  company: string;
  role: string;
  period: { start: string; end: string | null };
  status: ProjectStatus;
  description: string;
  highlights: string[];
  stack: string[];
  categories: string[];
  links: {
    github: string | null;
    demo: string | null;
    caseStudy: string | null;
  };
  featured: boolean;
  public: boolean;
  image: string | null;
}
