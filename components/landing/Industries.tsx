"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gamepad2,
  ShoppingBag,
  Stethoscope,
  Landmark,
  Plane,
  FileCheck2,
  ArrowRight,
  Layers,
  Sparkles,
  Building2,
} from "lucide-react";

interface IndustryCard {
  title: string;
  category: string;
  filterTag: string;
  proofMetric: string;
  description: string;
  tags: string[];
  partnerProof: string;
  icon: React.ElementType;
}

const industries: IndustryCard[] = [
  {
    title: "Entertainment & Family Centers",
    category: "High-Capacity Venues",
    filterTag: "Entertainment & Leisure",
    proofMetric: "2.8M+ Guests Served",
    description:
      "Orchestrate intense weekend rushes across bowling alleys, VR arenas, and amusement parks. Free guests to explore arcades and dining zones while their live turn approaches.",
    tags: ["Real-time SMS Turn", "Party & Lane Sync", "Zero Line Chaos"],
    partnerProof: "Amoeba Bowling & HM Leisure",
    icon: Gamepad2,
  },
  {
    title: "Retail Flagships & Luxury Studios",
    category: "In-Store Experience",
    filterTag: "Retail & Flagships",
    proofMetric: "+28% In-Store Browse",
    description:
      "Invite VIP shoppers to browse showroom floors instead of standing in lines. Seamlessly manage fitting rooms, personalized styling appointments, and rapid click-and-collect.",
    tags: ["VIP Stylist Routing", "Fitting Room Queue", "Click & Collect"],
    partnerProof: "Loro Piana, STUDS & Flagships",
    icon: ShoppingBag,
  },
  {
    title: "Healthcare & Clinical Triage",
    category: "Outpatient & Urgent Care",
    filterTag: "Healthcare & Clinics",
    proofMetric: "-45% Waiting Friction",
    description:
      "Triage walk-in patients by clinical urgency and specialty. Protect vulnerable patients and families from congested waiting rooms with drive-up and remote outdoor waiting.",
    tags: ["HIPAA Compliant", "Urgency Dispatch", "Outdoor Waiting"],
    partnerProof: "Diagnostic Labs & Urgent Clinics",
    icon: Stethoscope,
  },
  {
    title: "Banking & Private Wealth",
    category: "Retail Branches",
    filterTag: "Banking & Finance",
    proofMetric: "8 min Avg Branch Time",
    description:
      "Intelligently route branch walk-ins between express teller windows, commercial loan specialists, and wealth advisors while maintaining a serene, private lobby atmosphere.",
    tags: ["Teller Load Balancing", "Private Advisory", "Discrete Calling"],
    partnerProof: "Commercial Banks & Credit Unions",
    icon: Landmark,
  },
  {
    title: "Aviation & Premium Lounges",
    category: "Transit & Hospitality",
    filterTag: "Entertainment & Leisure",
    proofMetric: "99.8% On-Time Boarding",
    description:
      "Eliminate gate congestion and service desk clusters. Seamlessly coordinate VIP lounge entry, priority lane dispatch, and rebooking counters without physical rope lines.",
    tags: ["VIP Lounge Control", "SMS Boarding Sync", "Priority Lanes"],
    partnerProof: "British Airways, Delta & Hubs",
    icon: Plane,
  },
  {
    title: "Government & Citizen Services",
    category: "Public Administration",
    filterTag: "Government & Public",
    proofMetric: "Zero Ticket Hoarding",
    description:
      "Retire archaic paper token dispensers. Direct citizens to the correct municipal windows with multi-lingual kiosks, real-time SMS queue updates, and verified document pre-checks.",
    tags: ["Multi-lingual Kiosks", "Multi-Desk Routing", "Civic Security"],
    partnerProof: "Municipal Halls & Civic Agencies",
    icon: FileCheck2,
  },
];

const filterCategories = [
  { id: "All industries", label: "All industries", count: 6 },
  { id: "Entertainment & Leisure", label: "Entertainment & Leisure", count: 2 },
  { id: "Retail & Flagships", label: "Retail & Flagships", count: 1 },
  { id: "Healthcare & Clinics", label: "Healthcare & Clinics", count: 1 },
  { id: "Banking & Finance", label: "Banking & Finance", count: 1 },
  { id: "Government & Public", label: "Government & Public", count: 1 },
];

export default function Industries() {
  const [activeFilter, setActiveFilter] = useState("All industries");

  const filteredIndustries =
    activeFilter === "All industries"
      ? industries
      : industries.filter((item) => item.filterTag === activeFilter);

  return (
    <section
      id="solutions"
      className="py-20 md:py-28 bg-white border-b border-slate-200/80 relative overflow-hidden"
    >
      {/* Subtle Atmospheric Gradients */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50/70 to-transparent pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Section Header */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Tailored Operational Blueprints</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            A trusted partner of industry leaders around the world
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From high-throughput family entertainment arenas and luxury boutiques to clinical triage and municipal halls, Q4Queue powers friction-free physical guest journeys.
          </p>

          {/* Interactive Unified Segmented Capsule Bar */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center">
            <div className="inline-flex flex-wrap items-center justify-center p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 gap-1.5 max-w-4xl shadow-xs">
              {filterCategories.map((category) => {
                const isActive = activeFilter === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveFilter(category.id)}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-900"
                        : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/80"
                    }`}
                  >
                    <span>{category.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                        isActive
                          ? "bg-slate-800 text-blue-300"
                          : "bg-slate-200/70 text-slate-500"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Elevated Industry Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredIndustries.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative p-7 sm:p-8 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Ambient Top Corner Hover Gradient */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-blue-50/40 rounded-full blur-2xl group-hover:bg-blue-100/50 transition-colors pointer-events-none" />

                <div>
                  {/* Top Bar: Icon + Proof Metric Pill */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-50/90 border border-blue-100/80 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 border border-slate-200/80 text-slate-700 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{item.proofMetric}</span>
                    </div>
                  </div>

                  {/* Category & Title */}
                  <div className="mt-6">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600/80">
                      {item.category}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Operational Tags */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200/60 group-hover:border-blue-100 group-hover:bg-blue-50/40 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Bar: Partner Proof & CTA Link */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5 truncate pr-2 text-slate-400">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.partnerProof}</span>
                  </div>

                  <Link
                    href="/get-started"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 shrink-0 group/link"
                  >
                    <span>Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Enterprise Architecture Banner */}
        <div className="mt-14 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-slate-50 border border-blue-100/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Layers className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Operating multi-department or campus-wide facilities?
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Our enterprise solutions architects build bespoke routing algorithms, custom SMS sender IDs, and ERP integrations tailored for high-volume networks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
            <Link
              href="/get-started"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <span>Book architecture review</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
