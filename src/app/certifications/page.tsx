import type { Metadata } from "next";
import { getCertifications } from "@/lib/data";
import { CertsContent } from "./components/CertsContent";

export const metadata: Metadata = {
  title: "Certifications — Wilson López",
  description: "Academic degrees, professional certifications and courses.",
};

export default function Page() {
  const certs = getCertifications();
  return <CertsContent certs={certs} />;
}
