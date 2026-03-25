import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "NeuroPath — Learning built for your brain",
};

export default function HomePage() {
  return <LandingPage />;
}
