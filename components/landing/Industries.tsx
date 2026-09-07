import {
  Stethoscope,
  Landmark,
  FileCheck2,
  Wrench,
  GraduationCap,
  ShoppingBag,
  Car,
  ConciergeBell,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface Industry {
  title: string;
  category: string;
  description: string;
  useCase: string;
  icon: React.ElementType;
}

const industries: Industry[] = [
  {
    title: "Healthcare & Clinics",
    category: "Outpatient & Diagnostics",
    description:
      "Triage patients by consultation type, eliminate congested waiting rooms, and allow vulnerable patients to wait comfortably outside or in their vehicles.",
    useCase: "General practice, urgent care, dental, diagnostics",
    icon: Stethoscope,
  },
  {
    title: "Banking & Finance",
    category: "Retail Branches",
    description:
      "Route walk-ins to appropriate teller or advisory desks. Ensure privacy and maintain a serene, premium lobby atmosphere during peak hours.",
    useCase: "Cashier counters, loan officers, account services",
    icon: Landmark,
  },
  {
    title: "Government & Public",
    category: "Municipal Services",
    description:
      "Replace chaotic paper token ticket dispensers with real-time digital queues that keep citizens informed of their exact estimated turn.",
    useCase: "Licensing, civic registrations, municipal counters",
    icon: FileCheck2,
  },
  {
    title: "Service Centers",
    category: "Repairs & Returns",
    description:
      "Let device drop-offs and warranty claims proceed efficiently without customers hovering around service desks.",
    useCase: "Consumer electronics, hardware repair, claim desks",
    icon: Wrench,
  },
  {
    title: "Higher Education",
    category: "Student Administration",
    description:
      "Manage student rushes during registration, financial aid, and orientation weeks without long hall queues.",
    useCase: "Admissions, student records, registrar services",
    icon: GraduationCap,
  },
  {
    title: "Retail & Flagships",
    category: "In-Store Experience",
    description:
      "Invite customers to browse your showroom floor while waiting for personalized styling, fittings, or order collection.",
    useCase: "Click-and-collect, fitting rooms, VIP consultation",
    icon: ShoppingBag,
  },
  {
    title: "Automotive & Dealerships",
    category: "Service Bays",
    description:
      "Direct vehicle owners seamlessly from arrival to service advisors, loaner dispatch, and checkout without delay.",
    useCase: "Service check-in, parts counter, vehicle delivery",
    icon: Car,
  },
  {
    title: "Hospitality & Venues",
    category: "Guest Relations",
    description:
      "Handle large group check-ins, VIP concierge inquiries, and amenity access without physical barrier ropes.",
    useCase: "Concierge desks, check-in overflow, event registration",
    icon: ConciergeBell,
  },
];

export default function Industries() {
  return (
    <section id="solutions" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
            Built for Businesses That Move People
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1220] tracking-[-0.03em] leading-tight">
            Built for high-footfall environments.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Wherever physical crowds form, Q4Queue provides operational visibility. Replace waiting room congestion with a calm, digital queue workflow.
          </p>
        </div>

        {/* 8-Industry Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative p-5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 group-hover:text-blue-600 group-hover:bg-blue-50/50 transition-colors">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-slate-400 truncate pr-2">
                    {item.useCase}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Need custom routing for complex multi-department facilities?
            </p>
          </div>
          <Link
            href="/get-started"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5"
          >
            Explore enterprise solutions <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
