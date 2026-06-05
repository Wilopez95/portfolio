import type { Metadata } from "next";
import { ContactContent } from "./components/ContactContent";

export const metadata: Metadata = {
  title: "Contact — Wilson López",
  description: "Get in touch — open to senior/lead remote roles and interesting projects.",
};

export default function Page() {
  return <ContactContent />;
}
