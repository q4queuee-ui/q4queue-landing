"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
} from "lucide-react";

interface IndustryShowcase {
  id: string;
  tabLabel: string;
  tag: string;
  partnerBrand?: {
    name: string;
    subtext?: string;
  };
  headline: string;
  description: string;
  milestones: string[];
  metrics: {
    value: string;
    label: string;
  }[];
  image: string;
  imageAlt: string;
  previewWidget: {
    token: string;
    title: string;
    status: string;
    detail: string;
    countdownLabel: string;
    primaryAction: string;
    secondaryAction: string;
  };
}

const showcases: IndustryShowcase[] = [
  {
    id: "entertainment",
    tabLabel: "Entertainment & Leisure",
    tag: "HIGH-CAPACITY ATTRACTIONS",
    partnerBrand: {
      name: "Entertainment & Family Centers",
      subtext: "AMOEBA • HM LEISURE • ARCADES",
    },
    headline:
      "Eliminating 90-minute waitlist walkaways during peak weekend rushes",
    description:
      "Guests join a virtual queue via smartphone or kiosk, exploring arcades and dining zones freely until their bowling lane or VR arena is prepped.",
    milestones: [
      "Real-time lane turnover sync directly from pit manager tablets",
      "Automated 2-way SMS alerts with 5-minute arrival grace buffer",
      "Zero lobby clustering or physical barrier stanchions",
    ],
    metrics: [
      { value: "2.8M+", label: "guests served" },
      { value: "-45%", label: "wait walkaways" },
    ],
    image: "/images/amoeba-venue-spotlight.jpg",
    imageAlt: "Amoeba Bowling & Gaming Center neon illuminated lanes",
    previewWidget: {
      token: "TKN #B-42",
      title: "Lane #14 Ready",
      status: "Malhotra Party (4)",
      detail: "Shoe Station Desk A",
      countdownLabel: "4:32 grace left",
      primaryAction: "Confirm",
      secondaryAction: "+5m",
    },
  },
  {
    id: "retail",
    tabLabel: "Retail & Flagships",
    tag: "IN-STORE LUXURY & BOUTIQUES",
    partnerBrand: {
      name: "Luxury Flagships & Studios",
      subtext: "LORO PIANA • STUDS • FLAGSHIPS",
    },
    headline:
      "Empowering VIP shoppers to browse while styling suites sync",
    description:
      "Free clientele from waiting lines to discover new collections while stylists prepare private fitting suites or bespoke consultations.",
    milestones: [
      "One-tap check-in via discreet tablet stands or QR passes",
      "Automated client-to-stylist routing based on preference profile",
      "Instant click-and-collect fulfillment alerts for quick pickup",
    ],
    metrics: [
      { value: "+28%", label: "in-store browse" },
      { value: "4.9/5", label: "client CSAT" },
    ],
    image: "/images/solution-queue-retail.jpg",
    imageAlt: "Luxury retail showroom floor with personal stylist consultation",
    previewWidget: {
      token: "VIP #08",
      title: "Suite #03 Ready",
      status: "Elena Vance (Stylist)",
      detail: "5 garments prepped",
      countdownLabel: "Reserved 10 mins",
      primaryAction: "Enter",
      secondaryAction: "Message",
    },
  },
  {
    id: "healthcare",
    tabLabel: "Healthcare & Clinics",
    tag: "OUTPATIENT & CLINICAL TRIAGE",
    partnerBrand: {
      name: "Outpatient Care & Diagnostics",
      subtext: "CLINICAL TRIAGE NETWORKS",
    },
    headline:
      "Triage walk-in patients by acuity while eliminating waiting rooms",
    description:
      "Protect vulnerable patients by triaging symptom urgency and allowing families to wait comfortably in personal vehicles or outdoor gardens.",
    milestones: [
      "HIPAA-compliant, anonymized digital tokens and privacy displays",
      "Acuity triage prioritizing urgent cases over routine visits",
      "40% reduction in front-desk administrative check-in friction",
    ],
    metrics: [
      { value: "-35m", label: "lobby wait time" },
      { value: "100%", label: "HIPAA compliant" },
    ],
    image: "/images/solution-healthcare-clinical.jpg",
    imageAlt: "Serene modern outpatient clinic reception and waiting lounge",
    previewWidget: {
      token: "MED #104",
      title: "Suite 4B Ready",
      status: "Dr. Alistair Chen",
      detail: "Room sanitized",
      countdownLabel: "Ready for patient",
      primaryAction: "Proceed",
      secondaryAction: "Assist",
    },
  },
  {
    id: "banking",
    tabLabel: "Banking & Finance",
    tag: "RETAIL BRANCHES & WEALTH HUBS",
    partnerBrand: {
      name: "Commercial & Private Banking",
      subtext: "RETAIL FINANCIAL HUBS",
    },
    headline:
      "Routing branch walk-ins between tellers and wealth advisors",
    description:
      "Maintain a tranquil, discrete branch atmosphere by separating quick cash transactions from scheduled advisory consultations.",
    milestones: [
      "Dynamic load balancing across express counters and commercial desks",
      "Direct calendar integration for pre-booked wealth clients",
      "Multi-branch foot traffic velocity benchmarking",
    ],
    metrics: [
      { value: "8 min", label: "avg service cycle" },
      { value: "Zero", label: "lobby congestion" },
    ],
    image: "/images/solution-banking-advisory.jpg",
    imageAlt: "Private wealth management advisory suite and bank lobby",
    previewWidget: {
      token: "PW #19",
      title: "Suite #2 Ready",
      status: "Nicholas Howard (SVP)",
      detail: "Wealth & Loan Desk",
      countdownLabel: "Desk ready now",
      primaryAction: "Check In",
      secondaryAction: "+5m",
    },
  },
  {
    id: "government",
    tabLabel: "Government & Public",
    tag: "CIVIC ADMINISTRATION",
    partnerBrand: {
      name: "Municipal Halls & Citizen Centers",
      subtext: "CIVIC SERVICE HUBS",
    },
    headline:
      "Modernizing citizen halls with automated triage and dispatch",
    description:
      "Replace archaic paper tickets with self-service kiosks that route citizens to the appropriate municipal counter with zero confusion.",
    milestones: [
      "Multi-lingual kiosk support across 12+ languages",
      "Real-time synchronized display and audible counter calling",
      "Dynamic counter reassignment during peak civic deadlines",
    ],
    metrics: [
      { value: "100%", label: "paperless tokens" },
      { value: "99.9%", label: "dispatch accuracy" },
    ],
    image: "/images/solution-government-civic.jpg",
    imageAlt: "Modern Scandinavian municipal services and citizen hall",
    previewWidget: {
      token: "CIV #A-104",
      title: "Counter 6 Calling",
      status: "Civil Registry Desk",
      detail: "Passport & Identity",
      countdownLabel: "Window active",
      primaryAction: "Approach",
      secondaryAction: "Help",
    },
  },
];

export default function Industries() {
  const [activeTabId, setActiveTabId] = useState("entertainment");
  const current =
    showcases.find((item) => item.id === activeTabId) || showcases[0];

  return (
    <section
      id="solutions"
      className="py-16 md:py-24 bg-white border-b border-slate-200/80 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight">
            A trusted partner of industry leaders around the world
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            From high-throughput family entertainment arenas and luxury boutiques
            to clinical triage and municipal halls, see how global operators deploy
            Q4Queue to master customer flow.
          </p>
        </div>

        {/* High-End Border-Bottom Tab Navigation */}
        <div className="mt-8 sm:mt-10 border-b border-slate-200">
          <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar pb-px">
            {showcases.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`pb-3 text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border-b-2 ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  {tab.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Showcase: Compact Split-Screen Architecture */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ── LEFT COLUMN (5 Cols): Concise Operational Blueprint ── */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Partner Brand Identity */}
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                  {current.partnerBrand?.name}
                </span>
                {current.partnerBrand?.subtext && (
                  <span className="text-[10px] font-semibold text-slate-400 border-l border-slate-200 pl-2">
                    {current.partnerBrand.subtext}
                  </span>
                )}
              </div>

              {/* Tag */}
              <div className="mt-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600">
                  {current.tag}
                </span>
              </div>

              {/* Concrete Headline */}
              <h3 className="mt-1.5 text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {current.headline}
              </h3>

              {/* Description - Concise 2 lines */}
              <p className="mt-2.5 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                {current.description}
              </p>

              {/* Workflow Milestones - Tight single-line statements */}
              <div className="mt-5 space-y-2.5">
                {current.milestones.map((milestone) => (
                  <div key={milestone} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">
                      {milestone}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics & Action Link */}
            <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-7">
                {current.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {metric.value}
                    </div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/get-started"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group/link"
              >
                <span>Explore blueprint</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* ── RIGHT COLUMN (7 Cols): Compact Light-Premium Visual Preview Widget ── */}
          <div className="lg:col-span-7">
            <div className="relative h-[340px] sm:h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-900">
              {/* Background Architectural Venue Image */}
              <Image
                key={current.image}
                src={current.image}
                alt={current.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center transition-all duration-700"
              />

              {/* Subtle Ambient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />

              {/* Top Right Live Tag */}
              <div className="absolute top-4 right-4 z-20">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Operations Live</span>
                </div>
              </div>

              {/* Compact Light-Premium Live Activity Queue Pass */}
              <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:left-5 sm:right-auto z-20 sm:max-w-[360px] w-auto">
                <div className="bg-white/90 backdrop-blur-md rounded-xl p-3.5 sm:p-4 shadow-[0_12px_30px_rgba(15,23,42,0.12)] border border-white/80 ring-1 ring-slate-900/5">
                  {/* Row 1: Calling Title & Token */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight truncate">
                        {current.previewWidget.title}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono font-semibold bg-slate-100/90 text-slate-600 px-2 py-0.5 rounded border border-slate-200/60 shrink-0">
                      {current.previewWidget.token}
                    </span>
                  </div>

                  {/* Row 2: Party & Location Assignment */}
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="text-slate-800 font-semibold">{current.previewWidget.status}</span>
                    <span className="text-slate-300">•</span>
                    <span className="truncate">{current.previewWidget.detail}</span>
                  </div>

                  {/* Row 3: Slim Timer & Action Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>{current.previewWidget.countdownLabel}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all shadow-xs cursor-pointer"
                      >
                        {current.previewWidget.primaryAction}
                      </button>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-98 transition-all cursor-pointer"
                      >
                        {current.previewWidget.secondaryAction}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Enterprise Architecture Advisory Callout */}
        <div className="mt-12 sm:mt-16 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="max-w-2xl">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Operating multi-department or campus-wide facilities?
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our enterprise solutions architects build custom SMS sender IDs, multi-tier SLAs, and ERP integrations tailored for high-volume physical networks.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <Link
              href="/get-started"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <span>Schedule architecture review</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
