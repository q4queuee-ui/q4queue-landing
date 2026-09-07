"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="py-20 md:py-28 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-[#0F172A] border border-slate-800 p-8 sm:p-12 lg:p-16 text-center shadow-xl overflow-hidden">
          {/* Subtle architectural background depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.12),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-6">
              Start in minutes
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] leading-tight">
              Ready to move beyond the waiting line?
            </h2>

            {/* Body */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
              Give your customers a simpler way to join, wait, and get served. Set up your digital queue in under five minutes with no dedicated hardware.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                size="lg"
                onClick={() => router.push("/get-started")}
                className="w-full sm:w-auto h-12 px-8 text-sm font-semibold bg-white text-slate-950 hover:bg-slate-100 rounded-lg shadow-sm gap-2"
              >
                Get started <ArrowRight className="w-4 h-4" />
              </Button>

              <a
                href="mailto:contact@q4queue.com"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                Talk to us
              </a>
            </div>

            {/* Fact indicators */}
            <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />
                Setup in 5 minutes
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />
                Free 14-day trial
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
