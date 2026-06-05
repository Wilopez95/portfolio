import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import { ProjectsContent } from "./components/ProjectsContent";

export const metadata: Metadata = {
  title: "Projects — Wilson López",
  description: "Selected work: enterprise apps, AI platforms, SaaS products, and mobile apps.",
};

export default function Page() {
  const projects = getProjects();
  return <ProjectsContent projects={projects} />;
}
