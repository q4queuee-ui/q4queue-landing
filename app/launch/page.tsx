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
  CheckCircle2,
  Award,
  X,
  Maximize2,
  ChevronRight,
  Radio,
  Check,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

/* ──────────────────────────────────────────────────────────
   Acoustic Queue Chime (Web Audio API)
   Synthesizes a refined hospital / executive lounge chime
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
    // Silently continue if audio context is blocked
  }
}

/* ──────────────────────────────────────────────────────────
   Celebratory Gala Foil Canvas (Optimized for Light Background)
   Warm metallic gold, deep sapphire blue, emerald, and bronze
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
    // Rich gala palette with high contrast on light paper canvas
    const palette = [
      "#D97706", // Warm Amber Gold
      "#B45309", // Deep Bronze Gold
      "#2563EB", // Royal Sapphire
      "#1D4ED8", // Navy Blue
      "#059669", // Emerald Green
      "#F59E0B", // Bright Gold
      "#475569", // Slate
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

    spawnGalaBurst(w * 0.25, h * 0.8, 60);
    spawnGalaBurst(w * 0.75, h * 0.8, 60);

    const timer = setTimeout(() => {
      spawnGalaBurst(w * 0.5, h * 0.65, 80);
    }, 240);

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
   Main Launch Page Component (Light Architectural Theme)
   ────────────────────────────────────────────────────────── */
export default function LaunchPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [celebrationCount, setCelebrationCount] = useState(0);
  const [showToast, setShowToast] = useState(false);

  // Interactive Live Product Cockpit State
  const [currentToken, setCurrentToken] = useState(104);
  const [calledCount, setCalledCount] = useState(42);
  const [isCalling, setIsCalling] = useState(false);
  const [lastCalledTime, setLastCalledTime] = useState("Just now");

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
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveLightbox(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTriggerCelebration = () => {
    setCelebrationCount((c) => c + 1);
    playAcousticChime();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3600);
  };

  const handleCallNextToken = () => {
    if (isCalling) return;
    setIsCalling(true);
    playAcousticChime();

    setCurrentToken((prev) => prev + 1);
    setCalledCount((prev) => prev + 1);
    setLastCalledTime("Just now");
    setCelebrationCount((c) => c + 1);

    setTimeout(() => {
      setIsCalling(false);
    }, 900);
  };

  return (
    <div className="bg-[#FAF9F6] text-slate-900 min-h-screen selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden antialiased">
      <Navbar />

      {/* Gala Confetti Canvas */}
      {hasMounted && <GalaCelebrationCanvas triggerCount={celebrationCount} />}

      {/* Floating Commemorative Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/95 border border-amber-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-amber-200 text-[13px] font-medium tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Inaugural Commemoration Confirmed &middot; Q4Queue is Live</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Ambient Stage Atmosphere (Warm Editorial Light) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft Sapphire Overhead Bloom */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[480px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% -10%, rgba(37, 99, 235, 0.07) 0%, rgba(245, 158, 11, 0.03) 40%, transparent 70%)",
          }}
        />
      </div>

      <main className="relative z-10 pt-28 sm:pt-36">

        {/* ─── 1. Editorial Hero & Ceremonial Milestone ─── */}
        <section className="relative px-6 max-w-5xl mx-auto text-center pb-20 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Inaugural Milestone Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 shadow-sm mb-7">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[12.5px] font-medium tracking-wide text-amber-900">
                Official Inauguration &middot; 21 September 2026 &middot; Markaz Garden, Poonoor
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-slate-900 leading-[1.08] max-w-4xl mx-auto mb-6">
              The Architecture of Waiting,{" "}
              <span className="block mt-1.5 text-blue-600">
                Reinvented for the World.
              </span>
            </h1>

            {/* Editorial Lead Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4 font-normal">
              Q4Queue was formally inaugurated today on the opening stage of the{" "}
              <strong className="text-slate-900 font-semibold">11th Jazbayos &mdash; Dihliz Life Festival</strong>.
              Engineered to replace chaotic waiting lines with quiet, precise digital customer flow.
            </p>

            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-9 flex items-center justify-center gap-2">
              <span>Inaugurated by</span>
              <strong className="text-slate-800 font-semibold">Dr. Muhammed Abdul Hakim Azhari</strong>
            </p>

            {/* Tactile Action Buttons (High Craft Light Pairing) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto">
              {/* Ceremonial Action Button: Amber & Gold Foil */}
              <button
                type="button"
                onClick={handleTriggerCelebration}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-300 text-amber-950 text-[14px] font-semibold shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600 group-hover:rotate-12 transition-transform duration-300" />
                <span>Trigger Inauguration Celebration</span>
              </button>

              {/* Primary Royal Blue Button */}
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold shadow-md shadow-blue-600/20 transition-all duration-200 active:scale-[0.98]"
              >
                <span>Explore Live Platform</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>

            {/* Quiet Citation Anchor */}
            <div className="mt-8">
              <a
                href="#inauguration-tribute"
                className="inline-flex items-center gap-1 text-[12.5px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
              >
                <span>Read Dr. Azhari&apos;s Inaugural Citation &amp; Address</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ─── 2. Hardware-Grade Operational Console (Cockpit - Light Edition) ─── */}
        <section className="relative px-6 max-w-5xl mx-auto pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Section Tag */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono uppercase tracking-wider mb-2">
                <Radio className="w-3 h-3 text-blue-600 animate-pulse" />
                <span>Live Interactive Operational Console</span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-500">
                Experience the real-time dispatcher &mdash; click <strong className="text-slate-800">&ldquo;Call Next Token&rdquo;</strong> to test audio chime, counter display, and SMS routing.
              </p>
            </div>

            {/* White Instrument Panel Card */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-9 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]">
              {/* Header Telemetry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Active Station
                  </div>
                  <div className="text-[15px] font-bold text-slate-900 mt-0.5">
                    Counter 03 &middot; Executive Consultation (Dr. Azhari Medical Wing)
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[12px]">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    WebSocket Sync &lt; 28ms
                  </span>
                  <span className="text-slate-500 hidden sm:inline font-mono">
                    Served: <strong className="text-slate-800">{calledCount}</strong>
                  </span>
                </div>
              </div>

              {/* Main Console Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
                {/* Left: Station Display Terminal */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-xl bg-slate-950 text-white border border-slate-800 shadow-inner relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-amber-400/20 border border-amber-400/30 text-amber-300">
                      Now Serving
                    </span>
                    {isCalling && (
                      <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1 animate-pulse">
                        <Volume2 className="w-3 h-3" /> Broadcasting chime...
                      </span>
                    )}
                  </div>

                  {/* Monospace Token Display */}
                  <div
                    className={`text-6xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tight transition-all duration-200 tabular-nums ${
                      isCalling
                        ? "text-amber-300 drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                        : "text-white"
                    }`}
                  >
                    #A-{currentToken}
                  </div>

                  <div className="text-[12px] text-slate-400 mt-2 font-medium">
                    Priority Lane &middot; Routed to Counter 03
                  </div>

                  {/* Up Next Pill Row */}
                  <div className="flex items-center gap-2 mt-6 text-[11px] text-slate-400 font-mono">
                    <span>Queued:</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-slate-200">
                      #A-{currentToken + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-slate-300">
                      #A-{currentToken + 2}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-slate-400">
                      #A-{currentToken + 3}
                    </span>
                  </div>

                  {/* Tactile Call Next Token Button */}
                  <button
                    type="button"
                    onClick={handleCallNextToken}
                    disabled={isCalling}
                    className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[13.5px] font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isCalling ? "Calling Station..." : `Call Next Token (#A-${currentToken + 1})`}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
                  </button>
                </div>

                {/* Right: Visitor Smartphone Card */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant Visitor Notification (Zero App)</span>
                  </div>

                  {/* Simulated Mobile Alert Card */}
                  <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-bold text-emerald-900">
                            Q4Queue Instant Alert
                          </span>
                          <span className="text-[11px] font-mono text-emerald-700">{lastCalledTime}</span>
                        </div>
                        <p className="text-[12.5px] text-slate-700 leading-relaxed">
                          Your turn has arrived. <strong className="text-slate-900 font-semibold">Token #A-{currentToken}</strong> is now called at <strong className="text-emerald-800 font-semibold">Counter 03</strong>. Please proceed to the consultation suite.
                        </p>
                        <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-mono">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp &amp; SMS sent without app install</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[11px] text-slate-500 font-mono">Average Wait</div>
                      <div className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">4.2 min</div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">↓ 68% reduction</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[11px] text-slate-500 font-mono">App Friction</div>
                      <div className="text-xl font-bold text-slate-900 mt-0.5">0 Apps</div>
                      <div className="text-[11px] text-blue-600 font-medium mt-0.5">100% Web &amp; QR</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── 3. Executive Dignitary Citation: Dr. Muhammed Abdul Hakim Azhari ─── */}
        <section id="inauguration-tribute" className="relative px-6 max-w-4xl mx-auto pb-28 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Section Tag */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono tracking-wider uppercase mb-2">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Ceremonial Citation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Inaugurated with Distinction &amp; Gratitude
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Commemorating the formal inaugural address delivered at Jazbayos 2026.
              </p>
            </div>

            {/* Architectural Commemorative Plaque (Warm Ivory Citation Frame) */}
            <div className="rounded-2xl bg-[#FDFCF7] border border-amber-200/90 p-8 sm:p-12 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)] relative overflow-hidden">
              {/* Subtle top gold accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500" />

              {/* Dignitary Profile Bar */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-7 border-b border-amber-100 text-center sm:text-left">
                <div className="w-16 h-16 rounded-xl bg-amber-100/70 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-sm">
                  <Award className="w-8 h-8 text-amber-700" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold mb-1">
                    Official Inaugurator &middot; Patron of Knowledge &amp; Innovation
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Dr. Muhammed Abdul Hakim Azhari
                  </h3>
                  <p className="text-[13px] text-slate-600 mt-0.5">
                    Founder, <em className="not-italic text-slate-800 font-medium">Dihliz World School</em> &middot; Director, <em className="not-italic text-slate-800 font-medium">Markaz Knowledge Garden</em>
                  </p>
                </div>
              </div>

              {/* Dignified Monograph Body */}
              <div className="pt-7 space-y-5 text-[14.5px] sm:text-[15px] text-slate-700 leading-relaxed font-normal">
                <p>
                  On 21 September 2026, during the inaugural assembly of the{" "}
                  <strong className="text-slate-900 font-semibold">Jazbayos &mdash; Dihliz Life Festival (11th Edition)</strong>,
                  Dr. Muhammed Abdul Hakim Azhari formally launched Q4Queue before educators, scholars, community leaders, and students at Markaz Garden, Poonoor.
                </p>

                <p>
                  As an eminent educator and social innovator, Dr. Azhari has long championed learning environments that unite ethical leadership with contemporary technology. His gracious inauguration of Q4Queue marks an auspicious beginning for our endeavor to eliminate friction, anxiety, and wasted hours from public spaces.
                </p>

                {/* Editorial Pull Quote (Serif Italic for Authentic Human Warmth) */}
                <div className="my-6 p-6 rounded-xl bg-white border-l-4 border-amber-500 text-slate-800 font-serif italic text-base sm:text-lg leading-relaxed shadow-sm">
                  &ldquo;Technology reaches its highest moral purpose when it restores dignity and peace to people&apos;s most precious resource: their time.&rdquo;
                </div>

                <p className="text-xs sm:text-[13px] text-slate-500 italic">
                  We express our deepest respect and gratitude to Dr. Azhari and the organizing committee of Jazbayos for this memorable inauguration.
                </p>
              </div>

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-7 mt-7 border-t border-amber-100 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    21 September 2026
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    Markaz Garden, Poonoor, Calicut
                  </span>
                </div>

                <a
                  href="https://www.dihlizworldschool.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber-800 hover:text-amber-900 transition-colors font-semibold"
                >
                  <span>dihlizworldschool.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── 4. Architectural Museum Exhibition (Jazbayos Posters) ─── */}
        <section className="relative px-6 max-w-5xl mx-auto pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Section Tag */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-mono tracking-wider uppercase mb-2">
                <span>Festival Exhibition</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Jazbayos &middot; Dihliz Life Festival
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-1.5">
                11th Edition &middot; Theme: <strong className="text-slate-800 font-semibold">&ldquo;Loop Out&rdquo;</strong> &middot; 21, 22 &amp; 23 September 2026
              </p>
            </div>

            {/* Gallery Exhibits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-4xl mx-auto">
              {/* Exhibit 1: Dignitaries & Programme */}
              <div
                onClick={() =>
                  setActiveLightbox({
                    src: "/images/jazbayos-poster-speakers.png",
                    title: "Jazbayos 11th Edition &mdash; Dignitaries & Schedule",
                    subtitle: "Markaz Knowledge Garden, Poonoor, Calicut",
                    caption: "Official programme schedule featuring Dr. Muhammed Abdul Hakim Azhari and guest speakers.",
                  })
                }
                className="group rounded-2xl bg-white border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-100">
                  <Image
                    src="/images/jazbayos-poster-speakers.png"
                    alt="Jazbayos 11th Edition Speakers Poster"
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-lg bg-slate-900/85 backdrop-blur-md text-xs text-white">
                    <span className="font-medium">Inaugural Guests &amp; Programme</span>
                    <span className="inline-flex items-center gap-1 text-slate-300 text-[11px]">
                      <Maximize2 className="w-3 h-3" /> View exhibit
                    </span>
                  </div>
                </div>
              </div>

              {/* Exhibit 2: "Loop Out" Concept Artwork */}
              <div
                onClick={() =>
                  setActiveLightbox({
                    src: "/images/jazbayos-poster-eye.png",
                    title: "Jazbayos 11th Edition &mdash; 'Loop Out'",
                    subtitle: "Official Theme Artwork",
                    caption: "The iconic visual identity of Jazbayos 2026 &mdash; breaking out of repetitive routines through creative intellect.",
                  })
                }
                className="group rounded-2xl bg-white border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-100">
                  <Image
                    src="/images/jazbayos-poster-eye.png"
                    alt="Jazbayos 11th Edition Loop Out Poster"
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-lg bg-slate-900/85 backdrop-blur-md text-xs text-white">
                    <span className="font-medium">Theme Concept: &ldquo;Loop Out&rdquo;</span>
                    <span className="inline-flex items-center gap-1 text-slate-300 text-[11px]">
                      <Maximize2 className="w-3 h-3" /> View exhibit
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Placard Strip */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 mt-8 text-xs text-slate-500 font-mono">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                21, 22 &amp; 23 September 2026
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Dihliz World School, Markaz Garden, Poonoor
              </span>
            </div>
          </motion.div>
        </section>

        {/* ─── 5. Operational Reliability & Scale ─── */}
        <section className="relative px-6 max-w-5xl mx-auto pb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200/90 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">&lt; 35ms</div>
              <div className="text-xs text-slate-500 mt-1">Sync Latency</div>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200/90 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-bold text-amber-700 font-mono tabular-nums">0 Apps</div>
              <div className="text-xs text-slate-500 mt-1">Visitor App Downloads</div>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200/90 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono tabular-nums">99.98%</div>
              <div className="text-xs text-slate-500 mt-1">Platform Uptime SLA</div>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200/90 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 font-mono tabular-nums">100%</div>
              <div className="text-xs text-slate-500 mt-1">Paperless Operations</div>
            </div>
          </div>
        </section>

        {/* ─── 6. Architectural Call to Action (Slate Navy Contrast Anchor) ─── */}
        <section className="relative px-6 max-w-4xl mx-auto pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#1E293B] text-white p-8 sm:p-12 text-center shadow-xl"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
              Deploy Q4Queue Across Your Organization
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-7">
              Clinics, hospitals, customer service centers, and high-footfall institutions can deploy digital queues in minutes. Start with full feature access for 14 days.
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
                <span>Return to Home</span>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ─── 7. Commemorative Footnote ─── */}
        <div className="border-t border-slate-200/80 bg-[#F4F3F0] py-6 px-6 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Inaugurated on 21 September 2026 at the 11th Jazbayos &mdash; Dihliz Life Festival &middot; Dihliz World School &middot; Markaz Knowledge Garden, Poonoor, Calicut.
          </p>
        </div>
      </main>

      {/* Standard Site Footer */}
      <Footer />

      {/* ─── Lightbox Modal ─── */}
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
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[88vh] flex flex-col rounded-2xl bg-slate-900 border border-white/20 overflow-hidden shadow-2xl"
            >
              <div className="relative flex-1 min-h-[50vh] sm:min-h-[60vh] bg-black flex items-center justify-center p-2">
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
                <p className="text-xs text-slate-400 mt-1.5">
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
