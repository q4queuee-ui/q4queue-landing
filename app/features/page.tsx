import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";

export const metadata: Metadata = {
  title: "Features & Capabilities — Q4Queue",
  description:
    "Explore the full feature suite of Q4Queue — WhatsApp notifications, QR code check-in, real-time analytics, Smart TV lobby displays, and multi-counter management.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="pt-16 sm:pt-20">
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
