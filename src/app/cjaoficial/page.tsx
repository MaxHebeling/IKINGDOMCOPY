import BriefForm from "./BriefForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brief Digital · Centro Juventud Antoniana × iKingdom",
  description:
    "Completá el brief para que el equipo de iKingdom diseñe tu estrategia digital.",
  robots: "noindex",
};

export default function CJAPage() {
  return <BriefForm />;
}
