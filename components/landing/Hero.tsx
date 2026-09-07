"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Play,
  X,
  Check,
  Star,
  Bell,
  QrCode,
  MessageSquare,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Data ─────────────────────────────────────────────────────────── */

const queueData = [
  {
    token: "#42",
    name: "Sarah M.",
    service: "General Consultation",
    counter: "Counter 01",
    status: "Serving",
    statusColor: "text-blue-700 bg-blue-50 border-blue-200/60",
  },
  {
    token: "#43",
    name: "James K.",
    service: "Billing & Registration",
    counter: "Counter 02",
    status: "Next",
    statusColor: "text-amber-700 bg-amber-50 border-amber-200/60",
  },
  {
    token: "#44",
    name: "Priya R.",
    service: "Consultation Follow-up",
    counter: "Counter 01",
    status: "Waiting",
    statusColor: "text-slate-600 bg-slate-100 border-slate-200/60",
  },
  {
    token: "#45",
    name: "Alex W.",
    service: "Pharmacy Dispense",
    counter: "Counter 03",
    status: "Waiting",
    statusColor: "text-slate-600 bg-slate-100 border-slate-200/60",
  },
  {
    token: "#46",
    name: "David L.",
    service: "Diagnostics Lab",
    counter: "Counter 02",
    status: "Waiting",
    statusColor: "text-slate-600 bg-slate-100 border-slate-200/60",
  },
];

const counters = [
  { name: "Counter 01", staff: "Dr. Robert S.", detail: "Serving #42", active: true },
  { name: "Counter 02", staff: "Billing Desk", detail: "Serving #39", active: true },
  { name: "Counter 03", staff: "Pharmacy Bay", detail: "Available · Ready", active: false },
];

/* ─── Shared easing ───────────────────────────────────────────────── */
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Component ───────────────────────────────────────────────────── */

export default function Hero() {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);
  const [waitingCount, setWaitingCount] = useState(12);

  /* ESC to close video modal */
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setShowDemo(false);
  }, []);

  useEffect(() => {
    if (showDemo) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [showDemo, handleEsc]);

  /* Ambient queue simulation */
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitingCount((prev) => {
        if (prev <= 10) return 13;
        return prev - 1;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative overflow-x-clip pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24 lg:pb-28"
      style={{
        background:
          "linear-gradient(180deg, #070E22 0%, #0A1636 35%, #0C1C46 70%, #09132E 100%)",
      }}
    >
      {/* ── Atmospheric radial glows behind product area ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -30%)",
          width: "1200px",
          height: "700px",
          background:
            "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.22) 0%, rgba(37, 99, 235, 0.08) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "30%",
          left: "75%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          background:
            "radial-gradient(circle at center, rgba(139, 92, 246, 0.12) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "55%",
          left: "15%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "450px",
          background:
            "radial-gradient(circle at center, rgba(6, 182, 212, 0.09) 0%, transparent 60%)",
        }}
      />

      {/* ── Hero Content Header ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="flex items-center justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.12] text-[11px] sm:text-[12px] font-semibold tracking-[0.08em] text-[#AFC4FF] uppercase select-none shadow-sm backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse" />
            Digital Queue Management & Customer Flow
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="text-center text-[40px] sm:text-[60px] md:text-[72px] lg:text-[80px] font-bold tracking-[-0.04em] leading-[1.02] text-white max-w-[880px] mx-auto"
        >
          Turn waiting lines
          <br />
          into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#38BDF8]">
            better experiences.
          </span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease }}
          className="text-center mt-6 text-[16px] sm:text-[18px] leading-[1.6] max-w-[660px] mx-auto text-slate-300/85"
        >
          Q4Queue helps businesses replace physical queues with a digital customer flow
          — from check-in to service — giving customers visibility while giving teams
          complete control.
        </motion.p>

        {/* CTA Group */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-9"
        >
          <Button
            size="lg"
            onClick={() => router.push("/get-started")}
            className="h-[48px] px-7 rounded-[10px] bg-white hover:bg-slate-100 text-[#070E22] font-semibold text-[15px] shadow-lg shadow-white/10 flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
          >
            Start free
            <ArrowRight className="w-4 h-4" />
          </Button>

          <button
            type="button"
            onClick={() => setShowDemo(true)}
            className="inline-flex items-center justify-center gap-2 h-[48px] px-5 rounded-[10px] text-[15px] font-semibold text-white/80 hover:text-white transition-colors cursor-pointer border border-white/10 hover:border-white/20 bg-white/[0.04]"
          >
            <Play className="w-3.5 h-3.5 fill-current text-blue-400" />
            See how it works
          </button>
        </motion.div>

        {/* Trust Signal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65, ease }}
          className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mt-8 text-[12px] sm:text-[13px] text-white/60"
        >
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-white/80 font-medium ml-1">4.9/5 Rating</span>
          </div>
          <span className="text-white/20 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />
            No hardware required
          </span>
          <span className="text-white/20 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />
            Setup in minutes
          </span>
          <span className="text-white/20 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />
            Works on any device
          </span>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          MULTI-DEVICE PRODUCT SHOWCASE
         ════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 mt-12 sm:mt-16 lg:mt-20">
        <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          {/* Main composition container */}
          <div className="relative">

            {/* ── 1. MAIN TABLET DEVICE (Centered Showcase) ── */}
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75, ease }}
              className="relative mx-auto max-w-[880px] lg:max-w-[920px] z-10"
            >
              {/* Device outer frame — realistic graphite/titanium bezel */}
              <div
                className="relative rounded-[26px] sm:rounded-[32px]"
                style={{
                  background:
                    "linear-gradient(155deg, #1C2333 0%, #101522 50%, #0A0D15 100%)",
                  padding: "16px 14px 16px 14px",
                  boxShadow:
                    "0 35px 95px -15px rgba(0,0,0,0.8), 0 15px 45px -10px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -1px 1px rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Front camera pinhole on top bezel */}
                <div className="absolute top-[6px] left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#151B28] border border-white/10 flex items-center justify-center">
                    <div className="w-0.5 h-0.5 rounded-full bg-blue-500/60" />
                  </div>
                </div>

                {/* Tablet Screen Surface */}
                <div
                  className="relative rounded-[16px] sm:rounded-[20px] overflow-hidden bg-white border border-slate-200/80"
                >
                  {/* Dashboard Top Navigation Bar */}
                  <div className="h-10 sm:h-11 px-3 sm:px-5 bg-white border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
                      <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                        Q
                      </div>
                      <span className="font-bold text-slate-900 tracking-tight text-[12px] sm:text-[13px]">
                        Q4Queue
                      </span>
                      <span className="text-slate-300 font-light">/</span>
                      <span className="font-medium text-slate-600 text-[11px] sm:text-[12px]">
                        Downtown Clinic
                      </span>
                      <span className="text-slate-300 font-light hidden sm:inline">/</span>
                      <span className="text-slate-400 text-[11px] sm:text-[12px] hidden sm:inline">
                        Operations
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-1.5 h-6 px-2.5 rounded-md bg-slate-50 border border-slate-200 text-slate-400">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 15 15"
                          fill="none"
                          className="text-slate-400"
                        >
                          <path
                            d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM9.956 10.663a5 5 0 1 1 .707-.707l3.691 3.69-.707.707-3.691-3.69Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span className="text-[10px] font-normal">Search token or name...</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </div>
                    </div>
                  </div>

                  {/* 4-Column KPI Stats Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-[#FAFBFC] divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                    <div className="px-3 sm:px-4 py-2 sm:py-2.5">
                      <div className="text-[18px] sm:text-[22px] font-bold text-slate-900 tabular-nums tracking-tight leading-none">
                        {waitingCount}
                      </div>
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
                        Visitors Waiting
                      </div>
                    </div>
                    <div className="px-3 sm:px-4 py-2 sm:py-2.5">
                      <div className="text-[18px] sm:text-[22px] font-bold text-blue-600 tabular-nums tracking-tight leading-none">
                        03
                      </div>
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
                        Serving Now
                      </div>
                    </div>
                    <div className="px-3 sm:px-4 py-2 sm:py-2.5">
                      <div className="text-[18px] sm:text-[22px] font-bold text-slate-900 tabular-nums tracking-tight leading-none">
                        08:42
                      </div>
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
                        Avg. Wait Time
                      </div>
                    </div>
                    <div className="px-3 sm:px-4 py-2 sm:py-2.5">
                      <div className="text-[18px] sm:text-[22px] font-bold text-emerald-600 tabular-nums tracking-tight leading-none">
                        47
                      </div>
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
                        Completed Today
                      </div>
                    </div>
                  </div>

                  {/* Split Content: Queue Table (left) & Counters/Activity (right) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                    {/* Left Column: Queue Table */}
                    <div className="md:col-span-7 p-3 sm:p-4 space-y-2.5">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                            Active Queue
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                            {waitingCount} waiting
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400">Estimated flow: normal</span>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs">
                        {queueData.map((item) => (
                          <div
                            key={item.token}
                            className="py-2 flex items-center justify-between hover:bg-slate-50/80 px-1 rounded transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-bold text-slate-900 text-[11px] w-7 shrink-0">
                                {item.token}
                              </span>
                              <div>
                                <div className="font-semibold text-slate-900 text-[11px] sm:text-[12px] leading-tight">
                                  {item.name}
                                </div>
                                <div className="text-[9px] text-slate-400 mt-0.5">
                                  {item.service} · {item.counter}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-md font-semibold border ${item.statusColor}`}
                            >
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Service Counters & Activity */}
                    <div className="md:col-span-5 p-3 sm:p-4 space-y-3.5 bg-[#FAFBFC]">
                      {/* Counter Status */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider block">
                          Service Counters
                        </span>
                        <div className="space-y-1.5">
                          {counters.map((c) => (
                            <div
                              key={c.name}
                              className="flex items-center justify-between text-[11px] py-1 px-2 rounded-md bg-white border border-slate-100 shadow-sm"
                            >
                              <div>
                                <span className="font-semibold text-slate-800">{c.name}</span>
                                <span className="text-[9px] text-slate-400 block">{c.staff}</span>
                              </div>
                              <span
                                className={`text-[10px] font-semibold ${
                                  c.active ? "text-blue-700" : "text-emerald-600"
                                }`}
                              >
                                {c.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-slate-200" />

                      {/* Live Activity Feed */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider block">
                          Live Activity
                        </span>
                        <div className="space-y-1.5">
                          {[
                            { time: "09:44", event: "Token #48 joined via QR", tag: "QR" },
                            { time: "09:42", event: "Token #42 called to Counter 01", tag: "Call" },
                            { time: "09:39", event: "Token #41 completed (7m 12s)", tag: "Done" },
                          ].map((log) => (
                            <div
                              key={log.time + log.event}
                              className="flex items-start gap-2 text-[10px] text-slate-600"
                            >
                              <span className="font-mono text-slate-400 text-[9px] shrink-0 pt-px">
                                {log.time}
                              </span>
                              <span className="leading-tight">{log.event}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tablet sub-label */}
              <div className="mt-3.5 text-center">
                <span className="text-[11px] font-medium tracking-wide text-white/40">
                  Operations Console · Tablet & Desktop View
                </span>
              </div>
            </motion.div>

            {/* ── 2. SMARTPHONE DEVICE — Customer Mobile Experience (Overlapping Lower-Right) ── */}
            <motion.div
              initial={{ opacity: 0, y: 55, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.75, delay: 0.95, ease }}
              className="relative mt-8 mx-auto lg:mt-0 lg:absolute lg:right-[2%] xl:right-[4%] lg:bottom-[-20px] xl:bottom-[-25px] z-30"
              style={{ width: "245px", maxWidth: "245px" }}
            >
              {/* Phone Outer Frame */}
              <div
                className="relative rounded-[38px] p-[8px]"
                style={{
                  background: "linear-gradient(155deg, #1C2333 0%, #0E131F 100%)",
                  boxShadow:
                    "0 28px 75px -10px rgba(0,0,0,0.75), 0 12px 35px -8px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Dynamic Island */}
                <div className="absolute top-[13px] left-1/2 -translate-x-1/2 w-[68px] h-[16px] rounded-full bg-[#0E131F] z-20 flex items-center justify-end pr-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#182030] border border-white/5" />
                </div>

                {/* Phone Screen */}
                <div
                  className="relative rounded-[30px] overflow-hidden bg-[#FAFBFC] border border-slate-200"
                  style={{ aspectRatio: "9/19" }}
                >
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-4 pt-3.5 pb-1">
                    <span className="text-[8px] font-semibold text-slate-900">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-px">
                        {[3, 5, 7, 9].map((h) => (
                          <div
                            key={h}
                            className="w-[2px] rounded-sm bg-slate-900"
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                      <div className="w-3.5 h-[7px] rounded-sm border border-slate-900 relative ml-0.5">
                        <div
                          className="absolute inset-[1px] rounded-sm bg-slate-900"
                          style={{ width: "75%" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="px-3 py-1.5 border-b border-slate-100 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-white text-[7px] font-bold">
                        Q
                      </div>
                      <div>
                        <div className="text-[8px] font-bold text-slate-900 leading-none">Downtown Clinic</div>
                        <div className="text-[6.5px] text-slate-400 mt-0.5">q4queue.com/checkin</div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[7px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/50">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>

                  {/* Digital Ticket Pass (High contrast & clean) */}
                  <div className="mx-2.5 mt-2 rounded-xl bg-gradient-to-b from-[#0F172A] to-[#1E293B] text-white p-2.5 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] uppercase tracking-wider font-semibold text-blue-300">
                        Digital Ticket
                      </span>
                      <span className="text-[6.5px] font-medium text-slate-300">
                        General Consult
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <div>
                        <div className="text-[26px] font-black tracking-tight leading-none text-white">
                          #48
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[7.5px] font-medium text-emerald-300">
                            Confirmed in line
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[16px] font-bold text-white tabular-nums leading-none">
                          ~8m
                        </div>
                        <div className="text-[6.5px] text-slate-400 mt-0.5 uppercase tracking-wider">
                          Est. wait
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Turn Metrics (Clean 2-column strip) */}
                  <div className="mx-2.5 mt-2 grid grid-cols-2 gap-1.5">
                    <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-xs">
                      <div className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wider">
                        Ahead of you
                      </div>
                      <div className="text-[12px] font-bold text-slate-900 mt-0.5 leading-none">
                        3 visitors
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-xs">
                      <div className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wider">
                        Now Calling
                      </div>
                      <div className="text-[12px] font-bold text-blue-600 mt-0.5 leading-none">
                        #45 · Counter 01
                      </div>
                    </div>
                  </div>

                  {/* Queue Progress Timeline */}
                  <div className="mx-2.5 mt-2 bg-white p-2.5 rounded-lg border border-slate-100 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[7px] font-bold text-slate-800 uppercase tracking-wider">
                        Queue Progress
                      </span>
                      <span className="text-[6.5px] font-medium text-slate-400">
                        Live sync
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[7.5px]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[6.5px]">
                            ✓
                          </span>
                          <span className="text-slate-500">Token #45</span>
                        </div>
                        <span className="text-[6.5px] font-semibold text-slate-400">At Counter 01</span>
                      </div>
                      <div className="flex items-center justify-between text-[7.5px]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[6.5px]">
                            •
                          </span>
                          <span className="text-slate-700 font-medium">Token #46 & #47</span>
                        </div>
                        <span className="text-[6.5px] font-semibold text-amber-700 bg-amber-50 px-1 py-0.5 rounded">Up next</span>
                      </div>
                      <div className="flex items-center justify-between text-[7.5px] bg-blue-50/80 -mx-1 px-1.5 py-1 rounded-md border border-blue-200/50">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[6px] animate-pulse">
                            YOU
                          </span>
                          <span className="text-blue-950 font-bold">Token #48</span>
                        </div>
                        <span className="text-[7px] font-bold text-blue-700">Your Turn Next</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button & Help */}
                  <div className="mx-2.5 mt-2.5">
                    <button
                      type="button"
                      className="w-full h-7 rounded-lg bg-blue-600 text-white text-[8px] font-semibold flex items-center justify-center gap-1 shadow-xs cursor-default"
                    >
                      <span>Receive SMS Notification</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                    <div className="text-center mt-1">
                      <span className="text-[6.5px] text-slate-400 hover:underline cursor-pointer">
                        Need to step out? Hold place for 10 min
                      </span>
                    </div>
                  </div>

                  {/* iOS Home Bar */}
                  <div className="mt-3 pb-2 flex justify-center">
                    <div className="w-20 h-1 rounded-full bg-slate-300" />
                  </div>
                </div>
              </div>

              {/* Phone Sub-label */}
              <div className="mt-2.5 text-center">
                <span className="text-[10px] font-medium tracking-wide text-white/40">
                  Customer Mobile View
                </span>
              </div>

              {/* ── Signature Floating Notification on Phone (Floats to the right of the phone, zero screen obstruction) ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.3, ease }}
                className="absolute hidden xl:block z-40 pointer-events-none"
                style={{
                  left: "calc(100% - 24px)",
                  top: "130px",
                  width: "178px",
                }}
              >
                <div
                  className="rounded-xl p-2.5 flex items-center gap-2.5"
                  style={{
                    background: "rgba(255, 255, 255, 0.98)",
                    backdropFilter: "blur(12px)",
                    boxShadow:
                      "0 14px 35px -6px rgba(0,0,0,0.32), 0 4px 12px -2px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(226, 232, 240, 0.9)",
                  }}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                    <Bell className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-900 leading-tight">
                      You&apos;re next in line!
                    </div>
                    <div className="text-[8px] text-slate-500 mt-0.5 leading-tight">
                      Proceed to Counter 01 · ~1 min
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* ── 3. FLOATING MICRO-SURFACES & RELATIONSHIP ELEMENTS (Left Side) ── */}

            {/* Top-Left: Service Velocity / Wait Time Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: -15 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1, ease }}
              className="absolute hidden xl:block z-20"
              style={{
                left: "-35px",
                top: "55px",
                width: "172px",
              }}
            >
              <div
                className="rounded-xl p-3 bg-white"
                style={{
                  boxShadow:
                    "0 16px 40px -10px rgba(0,0,0,0.25), 0 6px 16px -4px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                    Service Velocity
                  </span>
                  <span className="text-[8px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <TrendingDown className="w-2.5 h-2.5" />
                    24%
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mt-2">
                  {/* Mini Donut Chart */}
                  <div className="relative w-10 h-10 shrink-0">
                    <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#F1F5F9"
                        strokeWidth="4"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="4"
                        strokeDasharray="85, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-900">
                      85%
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900 leading-none">
                      08:42
                    </div>
                    <div className="text-[8px] text-slate-400 mt-1 leading-tight">
                      Average wait time
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Left Side Relationship Pills & Hairlines */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.25, ease }}
              className="absolute hidden xl:block z-20 pointer-events-none"
              style={{ left: "-45px", top: "195px" }}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-full bg-[#10182E] border border-blue-500/30 text-white text-[9px] font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                    <QrCode className="w-3 h-3 text-blue-400" />
                    <span>Instant QR Check-in</span>
                  </div>
                  <div className="w-9 h-px bg-gradient-to-r from-blue-500/40 to-transparent" />
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <div className="px-2.5 py-1 rounded-full bg-[#10182E] border border-indigo-500/30 text-white text-[9px] font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                    <MessageSquare className="w-3 h-3 text-indigo-400" />
                    <span>SMS & WhatsApp Alert</span>
                  </div>
                  <div className="w-7 h-px bg-gradient-to-r from-indigo-500/40 to-transparent" />
                </div>
              </div>
            </motion.div>

            {/* Bottom-Left: Customer Experience CSAT Prompt Card */}
            <motion.div
              initial={{ opacity: 0, y: 25, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease }}
              className="absolute hidden lg:block z-20"
              style={{
                left: "-35px",
                bottom: "15px",
                width: "205px",
              }}
            >
              <div
                className="rounded-xl p-3 bg-white"
                style={{
                  boxShadow:
                    "0 18px 45px -10px rgba(0,0,0,0.28), 0 6px 18px -4px rgba(0,0,0,0.12)",
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                }}
              >
                <div className="text-[9px] font-bold text-slate-800">
                  How would you rate your visit?
                </div>
                <div className="flex items-center justify-between gap-1.5 mt-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <div
                      key={score}
                      className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center select-none ${
                        score === 5
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {score}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[8px] text-slate-400">
                  <span>4.9 / 5.0 CSAT</span>
                  <span className="text-emerald-600 font-semibold">99.2% Positive</span>
                </div>
              </div>
            </motion.div>

            {/* ── 4. FLOATING RELATIONSHIP ELEMENTS (Right Side) ── */}

            {/* Top-Right above Smartphone: Staff Notes Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease }}
              className="absolute hidden xl:block z-20 pointer-events-none"
              style={{ right: "265px", top: "18px" }}
            >
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-full bg-[#10182E] border border-purple-500/30 text-white text-[9px] font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Staff Notes & Triage</span>
                </div>
                <div className="w-6 h-px bg-gradient-to-r from-purple-500/40 to-transparent" />
              </div>
            </motion.div>

            {/* Glowing circular node badge at lower-right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.45, ease }}
              className="absolute hidden xl:flex items-center justify-center z-20 pointer-events-none"
              style={{ right: "-10px", bottom: "75px" }}
            >
              <div className="w-8 h-8 rounded-full bg-[#10182E] border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping opacity-75" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Subtle bottom transition gradient into the next section ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 pointer-events-none z-30"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(248,250,252,0.15) 60%, #FFFFFF 100%)",
        }}
      />

      {/* ── Demo Video Modal ── */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setShowDemo(false)}
            />
            <motion.div
              className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-slate-700"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close demo"
              >
                <X className="w-4 h-4" />
              </button>
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/anway8BdW6I?si=AxgSdclEctwbudLi&autoplay=1"
                title="Q4Queue Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
