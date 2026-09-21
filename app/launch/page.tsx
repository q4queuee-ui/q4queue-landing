"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
  ExternalLink,
  Volume2,
  Bell,
  Award,
  X,
  Maximize2,
  ChevronRight,
  Radio,
  Check,
  Clock,
  Building2,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

/* ──────────────────────────────────────────────────────────
   Acoustic Queue Chime (Web Audio API)
   Synthesizes a refined hospital / executive consultation chime
   ────────────────────────────────────────────────────────── */
function playAcousticChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      // @ts-expect-error webkitAudioContext fallback
      window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Tone 1: 523.25 Hz (C5) - warm fundamental
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.22, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.65);

    // Tone 2: 783.99 Hz (G5) - perfect fifth, 140ms later
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, now + 0.14);
    gain2.gain.setValueAtTime(0.001, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.18, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.95);
  } catch {
    // Audio context silently handled if user hasn't interacted yet
  }
}

/* ──────────────────────────────────────────────────────────
   Celebratory Gala Foil Canvas (Optimized for Light Background)
   Warm metallic amber, royal sapphire, emerald, and gold
   ────────────────────────────────────────────────────────── */
interface GalaParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  wobble: number;
  wobbleSpeed: number;
  alpha: number;
  decay: number;
  shape: "foil" | "leaf" | "spark";
}

function GalaCelebrationCanvas({ triggerCount }: { triggerCount: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<GalaParticle[]>([]);
  const animFrameId = useRef<number | null>(null);

  const spawnGalaBurst = useCallback((originX: number, originY: number, count = 65) => {
    const palette = [
      "#D97706", // Warm Amber Gold
      "#B45309", // Deep Bronze
      "#2563EB", // Royal Sapphire
      "#1D4ED8", // Navy Blue
      "#059669", // Emerald Green
      "#F59E0B", // Bright Gold
      "#E11D48", // Rose Red
    ];

    const newParticles: GalaParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.3;
      const speed = 6 + Math.random() * 12;
      const shapeType: "foil" | "leaf" | "spark" =
        i % 4 === 0 ? "spark" : i % 2 === 0 ? "leaf" : "foil";

      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
        vy: Math.sin(angle) * speed,
        size: shapeType === "spark" ? 3 + Math.random() * 2 : 6 + Math.random() * 8,
        color: palette[Math.floor(Math.random() * palette.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
        wobble: Math.random() * Math.PI,
        wobbleSpeed: 0.05 + Math.random() * 0.04,
        alpha: 1,
        decay: 0.004 + Math.random() * 0.005,
        shape: shapeType,
      });
    }
    particlesRef.current.push(...newParticles);
  }, []);

  useEffect(() => {
    if (triggerCount === 0) return;
    if (typeof window === "undefined") return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    spawnGalaBurst(w * 0.28, h * 0.75, 60);
    spawnGalaBurst(w * 0.72, h * 0.75, 60);

    const timer = setTimeout(() => {
      spawnGalaBurst(w * 0.5, h * 0.6, 75);
    }, 220);

    return () => clearTimeout(timer);
  }, [triggerCount, spawnGalaBurst]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gentle gravity
        p.vx *= 0.988; // air drag
        p.rotation += p.vRot;
        p.wobble += p.wobbleSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > canvas.height + 30) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        const wobbleScale = Math.cos(p.wobble);

        if (p.shape === "foil") {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size, (-p.size * wobbleScale) / 2, p.size * 2, p.size * 0.55);
        } else if (p.shape === "leaf") {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.4 * Math.abs(wobbleScale), 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* ──────────────────────────────────────────────────────────
   Main Launch Page Component (Senior Architectural Design)
   ────────────────────────────────────────────────────────── */
export default function LaunchPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [celebrationCount, setCelebrationCount] = useState(0);
  const [wishesCount, setWishesCount] = useState(164);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive Live Product Cockpit State
  const [currentToken, setCurrentToken] = useState(104);
  const [calledCount, setCalledCount] = useState(42);
  const [isCalling, setIsCalling] = useState(false);
  const [lastCalledTime, setLastCalledTime] = useState("Just now");

  // Festival Program Tabs (Day 1, Day 2, Day 3)
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);

  // Poster Lightbox Modal State
  const [activeLightbox, setActiveLightbox] = useState<{
    src: string;
    title: string;
    subtitle: string;
    caption: string;
  } | null>(null);

  useEffect(() => {
    setHasMounted(true);
    const timer = setTimeout(() => {
      setCelebrationCount(1);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveLightbox(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleSendCongratulations = () => {
    setWishesCount((prev) => prev + 1);
    setCelebrationCount((c) => c + 1);
    playAcousticChime();
    triggerToast("Inaugural Congratulations Recorded · Thank You for Celebrating With Us!");
  };

  const handleCallNextToken = () => {
    if (isCalling) return;
    setIsCalling(true);
    playAcousticChime();

    const nextNumber = currentToken + 1;
    setCurrentToken(nextNumber);
    setCalledCount((prev) => prev + 1);
    setLastCalledTime("Just now");
    setCelebrationCount((c) => c + 1);

    triggerToast(`Broadcasting Token #A-${nextNumber} to Counter 03 Display & SMS Dispatch`);

    setTimeout(() => {
      setIsCalling(false);
    }, 850);
  };

  return (
    <div className="bg-[#FAF9F6] text-slate-900 min-h-screen selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden antialiased">
      <Navbar />

      {/* Gala Confetti Canvas */}
      {hasMounted && <GalaCelebrationCanvas triggerCount={celebrationCount} />}

      {/* Floating Commemorative Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 max-w-lg w-full text-center"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900/95 border border-amber-400/40 shadow-[0_12px_32px_rgba(0,0,0,0.18)] text-amber-200 text-[12.5px] font-medium tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Ambient Stage Atmosphere (Architectural Warm Light) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[520px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% -10%, rgba(37, 99, 235, 0.08) 0%, rgba(245, 158, 11, 0.04) 40%, transparent 70%)",
          }}
        />
      </div>

      <main className="relative z-10 pt-28 sm:pt-36">

        {/* ─── 1. ASYMMETRIC EDITORIAL HERO & LIVE INTEGRATED COCKPIT ─── */}
        <section className="relative px-6 sm:px-8 max-w-7xl mx-auto pb-24 sm:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column (58%): Editorial Provenance, Narrative & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Provenance Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[12px] font-mono font-semibold tracking-wider text-amber-900 uppercase">
                  Official Inauguration &middot; 21 September 2026 &middot; Poonoor, Calicut
                </span>
              </div>

              {/* Master Display Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-slate-900 leading-[1.07]">
                The Architecture of Waiting,{" "}
                <span className="text-blue-600 block sm:inline">
                  Formally Inaugurated.
                </span>
              </h1>

              {/* Editorial Lead Paragraph */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Q4Queue was formally launched today on the main stage of the{" "}
                <strong className="text-slate-900 font-semibold">11th Jazbayos &mdash; Dihliz Life Festival</strong> by revered educator and social reformer{" "}
                <strong className="text-slate-900 font-semibold">Dr. Muhammed Abdul Hakim Azhari</strong>. Engineered to replace physical queue congestion with whisper-quiet, real-time customer flow.
              </p>

              {/* "Loop Out" Philosophy Capsule */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/90 text-xs sm:text-[13px] text-slate-700 max-w-xl">
                <div className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[11px] font-bold shrink-0 mt-0.5">
                  LOOP OUT
                </div>
                <p className="leading-snug">
                  Echoing the 11th Jazbayos theme &mdash; breaking free from the repetitive loops of conventional life &mdash; Q4Queue liberates institutions and visitors from the tyranny of waiting lines.
                </p>
              </div>

              {/* Participatory CTAs & Guestbook Counter */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-xl">
                {/* Participatory Guestbook Blessing Button */}
                <button
                  type="button"
                  onClick={handleSendCongratulations}
                  className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-b from-amber-50 to-amber-100/90 hover:from-amber-100 hover:to-amber-200/90 border border-amber-300/90 text-amber-950 text-[13.5px] font-semibold shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="text-base group-hover:scale-125 transition-transform duration-200">👏</span>
                  <span>Send Congratulations</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-[11.5px] font-mono font-bold text-amber-900">
                    {wishesCount} Wishes
                  </span>
                </button>

                {/* Direct Platform Exploration */}
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
                >
                  <span>Explore Live Platform</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
              </div>

              {/* Provenance Micro-Details */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Live since 09:00 AM IST
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Dihliz World School, Markaz Garden
                </span>
                <a
                  href="#inauguration-tribute"
                  className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  <span>Read Inaugural Citation</span>
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right Column (42%): Hardware-Grade Live Cockpit (Above the Fold) */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.08)]"
              >
                {/* Cockpit Top Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        Operational Dispatch
                      </div>
                      <div className="text-[13px] font-bold text-slate-900">
                        Counter 03 &middot; Consultation Wing
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[11px] font-mono">
                    Sync: &lt; 24ms
                  </span>
                </div>

                {/* Physical-Style Token Display Chamber */}
                <div className="my-5 p-6 rounded-xl bg-slate-950 text-white border border-slate-800 relative overflow-hidden shadow-inner text-center">
                  {/* Subtle corner tech guides */}
                  <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-600 uppercase">DISPATCH.SYS</div>
                  <div className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5" /> LIVE
                  </div>

                  <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 mb-2">
                    Now Serving
                  </div>

                  {/* High-Fidelity Monospace Token */}
                  <div
                    className={`text-5xl sm:text-6xl font-black font-mono tracking-tight tabular-nums transition-all duration-200 ${
                      isCalling
                        ? "text-amber-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                        : "text-white"
                    }`}
                  >
                    #A-{currentToken}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Priority Lane &middot; Station Active
                  </div>

                  {/* Upcoming Tokens Pill */}
                  <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-slate-400 font-mono">
                    <span className="text-slate-500 text-[10px]">Queued:</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200">#A-{currentToken + 1}</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">#A-{currentToken + 2}</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400">#A-{currentToken + 3}</span>
                  </div>

                  {/* Tactile Call Next Token Button */}
                  <button
                    type="button"
                    onClick={handleCallNextToken}
                    disabled={isCalling}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-75"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isCalling ? "Broadcasting Chime..." : `Call Next Token (#A-${currentToken + 1})`}</span>
                  </button>
                </div>

                {/* Instant Alert Simulator Box */}
                <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-3.5 space-y-2 text-left">
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-emerald-700" />
                      Zero-App Instant Notification
                    </span>
                    <span className="font-mono text-[10.5px] text-emerald-700">{lastCalledTime}</span>
                  </div>

                  <p className="text-[12px] text-slate-700 leading-snug">
                    &ldquo;Your turn has arrived. <strong className="text-slate-900">Token #A-{currentToken}</strong> is now called at <strong className="text-emerald-800">Counter 03</strong>.&rdquo;
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[10.5px] text-emerald-800 font-mono">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Simulated WhatsApp &amp; SMS Dispatch</span>
                  </div>
                </div>

                {/* Telemetry Footer */}
                <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-mono">Served</div>
                    <div className="text-[13px] font-bold text-slate-800 tabular-nums">{calledCount}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-mono">Avg Wait</div>
                    <div className="text-[13px] font-bold text-emerald-700">4.2m</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-mono">Hardware</div>
                    <div className="text-[13px] font-bold text-blue-600">Pure Web</div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* ─── 2. CEREMONIAL MONOGRAPH: DR. MUHAMMED ABDUL HAKIM AZHARI ─── */}
        <section id="inauguration-tribute" className="relative px-6 sm:px-8 max-w-5xl mx-auto pb-28 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Architectural Citation Plaque (Warm Ivory & Gold Frame) */}
            <div className="rounded-3xl bg-[#FDFCF7] border border-amber-200/90 p-8 sm:p-12 shadow-[0_8px_30px_rgba(15,23,42,0.05)] relative overflow-hidden">
              {/* Gold Filigree Header Trim */}
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500" />

              {/* Dignitary Profile Split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-amber-200/70">
                
                {/* Left: Authentic Portrait of Dr. Azhari */}
                <div className="md:col-span-4 flex flex-col items-center text-center">
                  <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md bg-white p-1">
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src="/images/dr-azhari-portrait.png"
                        alt="Dr. Muhammed Abdul Hakim Azhari - Official Inaugurator"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/70 border border-amber-300/80 text-[11px] font-mono font-bold text-amber-900">
                    <Award className="w-3 h-3 text-amber-700" />
                    <span>Official Inaugurator</span>
                  </div>
                </div>

                {/* Right: Dignitary Profile & Institutional Legacy */}
                <div className="md:col-span-8 space-y-3 text-left">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                    <span>Patron of Knowledge &amp; Social Innovation</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Dr. Muhammed Abdul Hakim Azhari
                  </h2>

                  <div className="space-y-1 text-[13.5px] text-slate-600">
                    <p className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Founder, <strong className="text-slate-800 font-semibold">Dihliz World School</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Director, <strong className="text-slate-800 font-semibold">Markaz Knowledge Garden</strong>, Poonoor</span>
                    </p>
                  </div>

                  {/* Keynote Pull Quote */}
                  <div className="mt-4 p-5 rounded-xl bg-white border-l-4 border-amber-500 shadow-sm text-slate-800 font-serif italic text-base sm:text-lg leading-relaxed">
                    &ldquo;Technology reaches its highest moral purpose when it restores dignity and peace to people&apos;s most precious resource: their time.&rdquo;
                  </div>
                </div>

              </div>

              {/* Historical Context Monograph */}
              <div className="pt-8 space-y-4 text-[14.5px] text-slate-700 leading-relaxed">
                <p>
                  On 21 September 2026, during the opening ceremony of the{" "}
                  <strong className="text-slate-900 font-semibold">11th Jazbayos &mdash; Dihliz Life Festival</strong>,
                  Dr. Muhammed Abdul Hakim Azhari inaugurated Q4Queue before an assembly of educators, community leaders, technology visionaries, and scholars at Markaz Garden, Poonoor.
                </p>
                <p>
                  Known internationally for pioneering educational institutions that integrate ethical human character with contemporary technical mastery, Dr. Azhari commended Q4Queue&apos;s objective to eliminate waiting anxiety and restore order, civility, and efficiency to healthcare centers, universities, and public institutions.
                </p>
              </div>

              {/* Archival Registry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-8 mt-8 border-t border-amber-200/70 text-xs text-slate-500 font-mono">
                <div className="flex flex-wrap items-center gap-5">
                  <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    21 September 2026
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    Markaz Garden, Poonoor, Calicut
                  </span>
                </div>

                <a
                  href="https://www.dihlizworldschool.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber-800 hover:text-amber-950 font-bold transition-colors"
                >
                  <span>dihlizworldschool.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </motion.div>
        </section>

        {/* ─── 3. JAZBAYOS FESTIVAL EXHIBITION PAVILION ("LOOP OUT") ─── */}
        <section className="relative px-6 sm:px-8 max-w-6xl mx-auto pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Section Tag & Headline */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono tracking-wider uppercase mb-2">
                <span>Festival Exhibition Pavilion</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Jazbayos &middot; Dihliz Life Festival
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-1.5">
                11th Edition &middot; Curated by Dihliz World School &middot; 21, 22 &amp; 23 September 2026
              </p>
            </div>

            {/* 3-Day Program Tabs */}
            <div className="flex items-center justify-center gap-2 mb-10">
              <button
                type="button"
                onClick={() => setActiveDay(1)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeDay === 1
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Day 1 &middot; Inaugural Launch (21 Sep)
              </button>
              <button
                type="button"
                onClick={() => setActiveDay(2)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeDay === 2
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Day 2 &middot; Innovation Conclave (22 Sep)
              </button>
              <button
                type="button"
                onClick={() => setActiveDay(3)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeDay === 3
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Day 3 &middot; &ldquo;Loop Out&rdquo; Finale (23 Sep)
              </button>
            </div>

            {/* Active Day Description Strip */}
            <div className="mb-8 p-4 rounded-xl bg-white border border-slate-200/90 text-center max-w-2xl mx-auto text-xs sm:text-[13px] text-slate-600">
              {activeDay === 1 && (
                <span>
                  <strong className="text-slate-900 font-semibold">Day 1 Focus:</strong> Formal assembly, keynote address, and the official public launch of Q4Queue by Dr. Muhammed Abdul Hakim Azhari.
                </span>
              )}
              {activeDay === 2 && (
                <span>
                  <strong className="text-slate-900 font-semibold">Day 2 Focus:</strong> Education symposium with industry leaders, educators, and technology panelists at Markaz Knowledge Garden.
                </span>
              )}
              {activeDay === 3 && (
                <span>
                  <strong className="text-slate-900 font-semibold">Day 3 Focus:</strong> Grand festival conclusion, student innovation showcase, and community deliberations on the &ldquo;Loop Out&rdquo; philosophy.
                </span>
              )}
            </div>

            {/* Museum Exhibition Dual Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Exhibit 1: Speakers & Official Inaugural Program */}
              <div
                onClick={() =>
                  setActiveLightbox({
                    src: "/images/jazbayos-poster-speakers.png",
                    title: "Jazbayos 11th Edition &mdash; Dignitaries & Schedule",
                    subtitle: "Dihliz World School &middot; Markaz Knowledge Garden, Poonoor",
                    caption: "Official festival programme featuring Dr. Muhammed Abdul Hakim Azhari, Musthafa P Errakkal, Asaf Nurani, Noufal Hassan Nurani, and distinguished guests.",
                  })
                }
                className="group rounded-2xl bg-white border border-slate-200/90 p-4 cursor-pointer hover:shadow-lg transition-all duration-300 shadow-sm"
              >
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-100">
                  <Image
                    src="/images/jazbayos-poster-speakers.png"
                    alt="Jazbayos 11th Edition Speakers Poster"
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-xl bg-slate-900/90 backdrop-blur-md text-xs text-white">
                    <div>
                      <div className="font-semibold">Inaugural Guests &amp; Programme</div>
                      <div className="text-[11px] text-slate-300">Dr. Azhari &amp; Distinguished Speakers</div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-amber-300 text-[11px] font-mono">
                      <Maximize2 className="w-3.5 h-3.5" /> Inspect
                    </span>
                  </div>
                </div>
              </div>

              {/* Exhibit 2: "Loop Out" Festival Concept Art */}
              <div
                onClick={() =>
                  setActiveLightbox({
                    src: "/images/jazbayos-poster-eye.png",
                    title: "Jazbayos 11th Edition &mdash; 'Loop Out'",
                    subtitle: "Official Theme Artwork &middot; Dihliz Life Festival",
                    caption: "The iconic visual identity of Jazbayos 2026 &mdash; breaking out of repetitive loops through creative intellect, mindful technology, and human purpose.",
                  })
                }
                className="group rounded-2xl bg-white border border-slate-200/90 p-4 cursor-pointer hover:shadow-lg transition-all duration-300 shadow-sm"
              >
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-100">
                  <Image
                    src="/images/jazbayos-poster-eye.png"
                    alt="Jazbayos 11th Edition Loop Out Poster"
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-xl bg-slate-900/90 backdrop-blur-md text-xs text-white">
                    <div>
                      <div className="font-semibold">Theme Concept: &ldquo;Loop Out&rdquo;</div>
                      <div className="text-[11px] text-slate-300">Official Festival Identity</div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-emerald-300 text-[11px] font-mono">
                      <Maximize2 className="w-3.5 h-3.5" /> Inspect
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Gallery Placard Info */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-8 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                21, 22 &amp; 23 September 2026
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Dihliz World School, Markaz Garden, Poonoor
              </span>
            </div>
          </motion.div>
        </section>

        {/* ─── 4. OPERATIONAL BENCHMARKS & SCALE ─── */}
        <section className="relative px-6 sm:px-8 max-w-5xl mx-auto pb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">&lt; 35ms</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Sync Latency</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono tabular-nums">0 Apps</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Visitor App Installs</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">99.98%</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Platform Uptime SLA</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono tabular-nums">100%</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Paperless Flow</div>
            </div>
          </div>
        </section>

        {/* ─── 5. ARCHITECTURAL CALL TO ACTION ─── */}
        <section className="relative px-6 sm:px-8 max-w-4xl mx-auto pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#1E293B] text-white p-8 sm:p-12 text-center shadow-xl relative overflow-hidden"
          >
            {/* Subtle radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-[11px] font-mono uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Deployment</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Deploy Q4Queue Across Your Organization
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
              Hospitals, clinics, educational campuses, and customer service centers can set up quiet, paperless digital queues in minutes. Start with full features for 14 days.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[14px] shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[14px] font-semibold transition-all"
              >
                <span>Return to Homepage</span>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ─── 6. COMMEMORATIVE FOOTNOTE ─── */}
        <div className="border-t border-slate-200/80 bg-[#F4F3F0] py-7 px-6 text-center">
          <p className="text-xs text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
            Inaugurated on 21 September 2026 at the 11th Jazbayos &mdash; Dihliz Life Festival &middot; Dihliz World School &middot; Markaz Knowledge Garden, Poonoor, Calicut.
          </p>
        </div>
      </main>

      {/* Standard Site Footer */}
      <Footer />

      {/* ─── High-Resolution Lightbox Modal ─── */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightbox(null)}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <button
              type="button"
              onClick={() => setActiveLightbox(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close exhibit"
            >
              <X className="w-4 h-4" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-white/20 overflow-hidden shadow-2xl"
            >
              <div className="relative flex-1 min-h-[50vh] sm:min-h-[62vh] bg-black flex items-center justify-center p-2">
                <Image
                  src={activeLightbox.src}
                  alt={activeLightbox.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="p-5 bg-slate-900 border-t border-white/10">
                <h4 className="text-[15px] font-bold text-white">
                  {activeLightbox.title}
                </h4>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  {activeLightbox.subtitle}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {activeLightbox.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
