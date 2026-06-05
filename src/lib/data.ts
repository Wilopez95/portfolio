import type { Project, Post } from "@/types";
import projectsJson from "../../data/projects.json";
import experienceJson from "../../data/experience.json";
import skillsJson from "../../data/skills.json";
import certificationsJson from "../../data/certifications.json";
import postsJson from "../../data/posts.json";

export function getProjects(): Project[] {
  return projectsJson as Project[];
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getExperience() {
  return experienceJson;
}

export function getSkills() {
  return skillsJson as Record<string, { label: string; items: { name: string; level: string; years: number }[] }>;
}

export function getCertifications() {
  return certificationsJson;
}

export function getPortfolioCertifications() {
  return certificationsJson.filter((c) => c.showOnPortfolio);
}

export function getPosts(): Post[] {
  return postsJson as Post[];
}
