import type { Metadata } from "next";
import { getExperience, getSkills } from "@/lib/data";
import { AboutContent } from "./components/AboutContent";

export const metadata: Metadata = {
  title: "About — Wilson López",
  description: "Senior Fullstack Engineer with 6+ years of experience in enterprise and SaaS applications.",
};

export default function Page() {
  const experience = getExperience();
  const skills = getSkills();
  return <AboutContent experience={experience} skills={skills} />;
}
