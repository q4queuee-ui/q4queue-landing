"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Rocket,
  FileText,
} from "lucide-react";
import Footer from "@/components/landing/Footer";
import { Logo } from "@/components/ui/Logo";

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
   Inaugural Celebration Chime Fanfare (Harmonic Multi-Chime)
   Ascending C5 - E5 - G5 - C6 royal ceremonial chime
   ────────────────────────────────────────────────────────── */
function playCelebrationFanfare() {
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
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.06, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.85);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.9);
    });
  } catch {
    // Audio context handled
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
      className="fixed inset-0 z-[160] pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* ──────────────────────────────────────────────────────────
   Subtle Blue & White Launch Celebration Canvas
   Restrained SaaS Product Launch Aesthetics (Dots, Soft Sparkles, Curved Strokes)
   ────────────────────────────────────────────────────────── */
interface BlueParticle {
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
  type: "dot" | "sparkle" | "stroke";
}

function BlueCelebrationCanvas({
  triggerCount,
  pulseLogo,
}: {
  triggerCount: number;
  pulseLogo?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<BlueParticle[]>([]);
  const animFrameId = useRef<number | null>(null);

  const spawnSubtleBlueConfetti = useCallback(
    (originX: number, originY: number, count = 30) => {
      const palette = [
        "#2563EB", // Q4Queue Brand Blue
        "#3B82F6", // Luminous Blue
        "#60A5FA", // Soft Sky Blue
        "#93C5FD", // Ice Blue
        "#DBEAFE", // Pale Blue
        "#FFFFFF", // Crisp White
      ];

      const newParticles: BlueParticle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
        const speed = 2.5 + Math.random() * 5.5;
        const particleType: "dot" | "sparkle" | "stroke" =
          i % 5 === 0 ? "sparkle" : i % 3 === 0 ? "stroke" : "dot";

        newParticles.push({
          x: originX + (Math.random() - 0.5) * 40,
          y: originY + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.2,
          vy: Math.sin(angle) * speed,
          size:
            particleType === "sparkle"
              ? 3 + Math.random() * 2
              : particleType === "stroke"
              ? 5 + Math.random() * 4
              : 2 + Math.random() * 2,
          color: palette[Math.floor(Math.random() * palette.length)],
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 3,
          wobble: Math.random() * Math.PI,
          wobbleSpeed: 0.03 + Math.random() * 0.03,
          alpha: 0.95,
          decay: 0.006 + Math.random() * 0.005,
          type: particleType,
        });
      }
      particlesRef.current.push(...newParticles);
    },
    []
  );

  useEffect(() => {
    if (triggerCount === 0) return;
    if (typeof window === "undefined") return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    spawnSubtleBlueConfetti(w * 0.38, h * 0.48, 22);
    spawnSubtleBlueConfetti(w * 0.62, h * 0.48, 22);
  }, [triggerCount, spawnSubtleBlueConfetti]);

  useEffect(() => {
    if (!pulseLogo) return;
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    spawnSubtleBlueConfetti(w * 0.5, h * 0.38, 20);
  }, [pulseLogo, spawnSubtleBlueConfetti]);

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
        p.vy += 0.12;
        p.vx *= 0.985;
        p.rotation += p.vRot;
        p.wobble += p.wobbleSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > canvas.height + 20) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === "sparkle") {
          ctx.fillStyle = p.color;
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        } else if (p.type === "stroke") {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 0.8);
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
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
      className="fixed inset-0 z-[150] pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* ──────────────────────────────────────────────────────────
   Main Launch Page Component (Senior Architectural Design)
   ────────────────────────────────────────────────────────── */
export default function LaunchPage() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [celebrationCount, setCelebrationCount] = useState(0);
  const [wishesCount, setWishesCount] = useState(164);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive Live Product Cockpit State
  const [currentToken, setCurrentToken] = useState(104);
  const [calledCount, setCalledCount] = useState(42);
  const [isCalling, setIsCalling] = useState(false);
  const [lastCalledTime, setLastCalledTime] = useState("Just now");

  // Inaugural Launch Ceremony & Live Auto-Redirect State
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchCountdown, setLaunchCountdown] = useState(5);
  const [launchedTokenNumber, setLaunchedTokenNumber] = useState(105);
  const [launchStageMessage, setLaunchStageMessage] = useState(
    "Synchronizing real-time queue channels with cloud gateway"
  );
  const [pulseLogo, setPulseLogo] = useState(false);
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [blueCelebrationTrigger, setBlueCelebrationTrigger] = useState(0);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const bismillahAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingBismillah, setIsPlayingBismillah] = useState(false);

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
    // Note: No celebration poppers on mount or refresh
  }, []);

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (bismillahAudioRef.current) {
        bismillahAudioRef.current.pause();
        bismillahAudioRef.current = null;
      }
    };
  }, []);

  // Authentic Arabic Voice of Bismillah ir-Rahman ir-Rahim
  const playBismillahRecitation = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      if (bismillahAudioRef.current) {
        bismillahAudioRef.current.pause();
        bismillahAudioRef.current.currentTime = 0;
      }
      const audio = new Audio("/audio/bismillah.mp3");
      audio.volume = 0.95;
      bismillahAudioRef.current = audio;
      setIsPlayingBismillah(true);
      audio.onended = () => setIsPlayingBismillah(false);
      audio.onerror = () => setIsPlayingBismillah(false);
      audio.play().catch((err) => {
        console.warn("Bismillah audio notice:", err);
        setIsPlayingBismillah(false);
      });
    } catch {
      setIsPlayingBismillah(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveLightbox(null);
        if (isLaunching) cancelLaunchSequence();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLaunching]);

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

  // 🚀 Full Ceremonial Launch with Exactly 10-Second Countdown Timer, Bismillah Voice, Continuous Poppers & Auto-Redirect
  const initiateLaunchSequence = (mode: "call-next" | "launch-button") => {
    if (isLaunching) return;

    const nextNumber = currentToken + 1;
    setCurrentToken(nextNumber);
    setLaunchedTokenNumber(nextNumber);
    setCalledCount((prev) => prev + 1);
    setLastCalledTime("Just now");

    // Play Arabic Voice of Bismillah ir-Rahman ir-Rahim
    playBismillahRecitation();

    // Multi-sensory ceremonial ambient shimmer & subtle blue celebration
    playCelebrationFanfare();
    setBlueCelebrationTrigger((c) => c + 1);

    // 🎉 Popper Effect Burst #1: Triggered immediately upon clicking Launch
    setCelebrationCount((c) => c + 1);

    setIsLaunching(true);
    setLaunchCountdown(10);
    setPulseLogo(false);
    setIsWaveActive(false);
    setLaunchStageMessage("Bismillah ir-Rahman ir-Rahim · Commencing Official Launch");
    triggerToast(`Official Launch Activated · Calling Token #A-${nextNumber}`);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    let remaining = 10;
    countdownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setLaunchCountdown(remaining);

      if (remaining === 9) {
        setLaunchStageMessage("Official Inauguration by Dr. Muhammed Abdul Hakim Azhari");
      } else if (remaining === 8) {
        setLaunchStageMessage(`Broadcasting Token #A-${nextNumber} to digital consultation displays`);
      } else if (remaining === 7) {
        setLaunchStageMessage("Simulating instant zero-app notification for visitors");
      } else if (remaining === 6) {
        // 🎉 Popper Effect Burst #2 (Midway Celebration at ~4s in)
        setCelebrationCount((c) => c + 1);
        setLaunchStageMessage("Real-time WhatsApp & SMS queue dispatch activated");
      } else if (remaining === 5) {
        setLaunchStageMessage("Cloud synchronization active · Latency < 24ms");
      } else if (remaining === 4) {
        setLaunchStageMessage("11th Jazbayos Festival · Breaking the loop of waiting lines");
      } else if (remaining === 3) {
        setLaunchStageMessage("Paperless consultation flow verified 100%");
      } else if (remaining === 2) {
        // 🎉 Popper Effect Burst #3 (Finale Climax at ~8s in)
        setCelebrationCount((c) => c + 1);
        setLaunchStageMessage("Platform officially open · Welcome to Q4Queue");
      } else if (remaining === 1) {
        setLaunchStageMessage("Entering live Q4Queue platform...");
        setPulseLogo(true);
        setTimeout(() => setPulseLogo(false), 900);
      } else if (remaining <= 0) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        setIsWaveActive(true);
        setTimeout(() => {
          setIsLaunching(false);
          router.push("/");
        }, 450);
      }
    }, 1000);
  };

  const cancelLaunchSequence = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (bismillahAudioRef.current) {
      bismillahAudioRef.current.pause();
      bismillahAudioRef.current.currentTime = 0;
    }
    setIsPlayingBismillah(false);
    setIsLaunching(false);
    setPulseLogo(false);
    setIsWaveActive(false);
    triggerToast("Inaugural redirect paused · You can continue exploring the launch page");
  };

  const handleInstantRedirect = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (bismillahAudioRef.current) {
      bismillahAudioRef.current.pause();
      bismillahAudioRef.current.currentTime = 0;
    }
    setIsPlayingBismillah(false);
    setIsWaveActive(true);
    setTimeout(() => {
      setIsLaunching(false);
      router.push("/");
    }, 280);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden antialiased relative">
      {/* Gala Confetti Canvas */}
      {hasMounted && <GalaCelebrationCanvas triggerCount={celebrationCount} />}

      {/* Subtle Blue & White Launch Celebration Particles */}
      {hasMounted && (
        <BlueCelebrationCanvas
          triggerCount={blueCelebrationTrigger}
          pulseLogo={pulseLogo}
        />
      )}

      {/* Floating Commemorative Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 max-w-lg w-full text-center"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900/95 border border-blue-400/30 shadow-[0_12px_32px_rgba(0,0,0,0.16)] text-white text-[12.5px] font-medium tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Ambient Stage Atmosphere & Flowing Blue Ribbon Waves ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft Blue Radial Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% -10%, rgba(37, 99, 235, 0.07) 0%, rgba(147, 197, 253, 0.04) 45%, transparent 70%)",
          }}
        />

        {/* Left Flowing Blue Silk Ribbon Wave */}
        <svg
          className="absolute left-0 top-0 h-[800px] w-[360px] pointer-events-none opacity-40 -translate-x-12"
          viewBox="0 0 360 800"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-50,0 C120,180 -20,380 90,560 C160,670 40,800 -50,800 Z"
            fill="url(#pageBlueRibbonLeft)"
          />
          <defs>
            <linearGradient id="pageBlueRibbonLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Right Flowing Blue Silk Ribbon Wave (Behind Cockpit) */}
        <svg
          className="absolute right-0 top-0 h-[850px] w-[420px] pointer-events-none opacity-40 translate-x-16"
          viewBox="0 0 420 850"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M480,0 C300,160 440,360 320,560 C240,680 380,850 480,850 Z"
            fill="url(#pageBlueRibbonRight)"
          />
          <defs>
            <linearGradient id="pageBlueRibbonRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <main className="relative z-10 pt-4 sm:pt-8 lg:pt-14">

        {/* ─── 1. ASYMMETRIC EDITORIAL HERO & LIVE INTEGRATED COCKPIT ─── */}
        <section className="relative px-4 sm:px-6 md:px-6 lg:px-8 max-w-7xl mx-auto pb-12 sm:pb-16 lg:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Left Column (58%): Editorial Provenance, Narrative & Actions */}
            <div className="md:col-span-7 space-y-3.5 sm:space-y-4 lg:space-y-6 text-left">
              
              {/* Provenance Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 shadow-xs">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-blue-600" />
                <span className="text-[10px] sm:text-[11px] lg:text-[11.5px] font-mono font-semibold tracking-wider text-blue-600 uppercase">
                  Official Inauguration
                </span>
              </div>

              {/* Master Display Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-[34px] lg:text-[54px] font-extrabold tracking-[-0.035em] text-slate-900 leading-[1.1]">
                The Architecture of<br className="hidden sm:inline" />{" "}
                Waiting, <span className="text-[#1D63FF]">Live<br className="hidden sm:inline" />
                Inauguration.</span>
              </h1>

              {/* Editorial Lead Paragraph (Reduced & Focused) */}
              <p className="text-xs sm:text-sm md:text-[13.5px] lg:text-base text-slate-600 leading-relaxed max-w-lg font-normal">
                Officially being inaugurated by <strong className="text-slate-900 font-semibold">Dr. Muhammed Abdul Hakim Azhari</strong> at the 11th Jazbayos Festival &mdash; engineering the transition from physical waiting lines to whisper-quiet digital flow.
              </p>

              {/* Participatory CTAs & Guestbook Counter */}
              <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3 max-w-xl">
                {/* Ceremonial Official Launch Trigger */}
                <button
                  type="button"
                  onClick={() => initiateLaunchSequence("launch-button")}
                  className="group relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 lg:py-3.5 rounded-xl bg-[#1D63FF] hover:bg-blue-600 text-white text-xs sm:text-[13px] lg:text-[13.5px] font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Rocket className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>Inaugurate &amp; Launch</span>
                  <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white/90" />
                </button>

                {/* Participatory Guestbook Blessing Button */}
                <button
                  type="button"
                  onClick={handleSendCongratulations}
                  className="group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-800 text-xs sm:text-[13px] font-semibold shadow-xs hover:shadow transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="text-sm sm:text-base group-hover:scale-110 transition-transform duration-200">👏</span>
                  <span>Wish</span>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-[10px] sm:text-[11px] font-mono font-bold text-amber-900">
                    {wishesCount}
                  </span>
                </button>

                {/* Direct Platform Exploration */}
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-2.5 sm:py-3 text-slate-600 hover:text-slate-900 text-xs sm:text-[13px] font-semibold transition-all text-center"
                >
                  <span>Main Page</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </div>

              {/* Provenance Micro-Details */}
              <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-y-1.5 gap-x-4 lg:gap-x-6 text-[10.5px] sm:text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1 sm:gap-1.5">
                  <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-400" />
                  Live since 09:00 AM IST
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5">
                  <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-400" />
                  Dihliz World School, Markaz Garden
                </span>
                <a
                  href="#inauguration-tribute"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <FileText className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-600" />
                  <span>Read Inaugural Citation</span>
                  <ArrowRight className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-blue-600" />
                </a>
              </div>
            </div>

            {/* Right Column (42%): Hardware-Grade Live Cockpit (Minimal & Clean) */}
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.06)]"
              >
                {/* Cockpit Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <div>
                      <div className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                        Operational Dispatch
                      </div>
                      <div className="text-xs sm:text-[13px] font-bold text-slate-900">
                        Counter 03 &middot; Consultation Wing
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[#1D63FF] text-[10px] font-mono font-medium">
                    Sync &lt; 24ms
                  </span>
                </div>

                {/* Token Display Chamber */}
                <div className="my-3 p-4 sm:p-5 rounded-xl bg-[#090D16] text-white border border-slate-800 relative overflow-hidden shadow-inner text-center">
                  <div className="text-[9.5px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
                    Now Serving
                  </div>

                  {/* High-Fidelity Monospace Token */}
                  <div
                    className={`text-4xl sm:text-5xl font-black font-mono tracking-tight tabular-nums transition-all duration-200 ${
                      isCalling
                        ? "text-amber-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                        : "text-white"
                    }`}
                  >
                    #A-{currentToken}
                  </div>

                  <div className="text-[10.5px] text-slate-400 mt-1 font-mono">
                    Priority Lane &middot; Station Active
                  </div>

                  {/* Tactile Call Next Token & Launch Button */}
                  <button
                    type="button"
                    onClick={() => initiateLaunchSequence("call-next")}
                    disabled={isLaunching}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-[#1D63FF] hover:bg-blue-600 text-white text-xs sm:text-[13px] font-bold shadow-md shadow-blue-600/30 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-75"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-white" />
                    <span>Call Next Token &amp; Launch (#A-{currentToken + 1})</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-white/90" />
                  </button>
                </div>

                {/* Compact Instant Alert Simulator Pill */}
                <div className="rounded-xl bg-emerald-50/70 border border-emerald-100 p-2.5 flex items-center justify-between text-[11px] text-emerald-950">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Instant WhatsApp &amp; SMS alert dispatched</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 shrink-0 ml-2">{lastCalledTime}</span>
                </div>

                {/* Telemetry Minimal Strip */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                  <span>Served: <strong className="text-slate-800 font-bold">{calledCount}</strong></span>
                  <span className="text-slate-200">&middot;</span>
                  <span>Avg Wait: <strong className="text-emerald-600 font-bold">4.2m</strong></span>
                  <span className="text-slate-200">&middot;</span>
                  <span>System: <strong className="text-blue-600 font-bold">Pure Web</strong></span>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Sub-brand Provenance Bar */}
          <div className="mt-8 sm:mt-10 lg:mt-14 pt-4 sm:pt-5 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="font-extrabold text-[#1D63FF] text-sm sm:text-base tracking-tight">Q4Queue</span>
              <span className="text-slate-300 hidden sm:inline">&mdash;</span>
              <span className="text-slate-500 text-[11px] sm:text-xs lg:text-[13px]">Queue Smarter. Serve Better.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 sm:w-6 h-[1px] bg-blue-400/80" />
              <span className="text-blue-600 font-bold tracking-tight">#MoveForward</span>
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
            {/* Architectural Citation Plaque (Crisp Modern White & Blue Frame) */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 shadow-[0_12px_40px_rgba(15,23,42,0.04)] relative overflow-hidden">
              {/* Executive Blue Header Trim */}
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-400" />

              {/* Dignitary Profile Split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-slate-100">
                
                {/* Left: Authentic Portrait of Dr. Azhari */}
                <div className="md:col-span-4 flex flex-col items-center text-center">
                  <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-blue-200/80 shadow-md bg-white p-1">
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src="/images/postcss.config.jpeg"
                        alt="Dr. Muhammed Abdul Hakim Azhari - Official Inaugurator"
                        fill
                        sizes="(max-width: 640px) 144px, 176px"
                        className="object-cover object-top"
                        priority
                      />
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-mono font-bold text-blue-700">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>Official Inaugurator</span>
                  </div>
                </div>

                {/* Right: Dignitary Profile & Institutional Legacy */}
                <div className="md:col-span-8 space-y-3 text-left">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-semibold flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>Patron of Knowledge &amp; Social Innovation</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Dr. Muhammed Abdul Hakim Azhari
                  </h2>

                  <div className="space-y-1.5 text-[13.5px] text-slate-600">
                    <p className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Managing Director, <strong className="text-slate-800 font-semibold">Markaz Knowledge City</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Founder &amp; Director, <strong className="text-slate-800 font-semibold">Markaz Garden</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Founder, <strong className="text-slate-800 font-semibold">Dihliz World School</strong></span>
                    </p>
                  </div>

                  {/* Keynote Pull Quote */}
                  <div className="mt-4 p-5 rounded-xl bg-slate-50 border-l-4 border-blue-600 shadow-xs text-slate-800 font-serif italic text-base sm:text-lg leading-relaxed">
                    &ldquo;Technology reaches its highest moral purpose when it restores dignity and peace to people&apos;s most precious resource: their time.&rdquo;
                  </div>
                </div>

              </div>

              {/* Historical Context Monograph */}
              <div className="pt-8 space-y-4 text-[14.5px] text-slate-700 leading-relaxed">
                <p>
                  On 21 September 2026, during the opening ceremony of the{" "}
                  <strong className="text-slate-900 font-semibold">11th Jazbayos &mdash; Dihliz Life Festival</strong>,
                  Dr. Muhammed Abdul Hakim Azhari inaugurates Q4Queue before an assembly of educators, community leaders, technology visionaries, and scholars at Markaz Garden, Poonoor.
                </p>
                <p>
                  As Managing Director of Markaz Knowledge City and Founder &amp; Director of Markaz Garden, Dr. Azhari commends Q4Queue&apos;s objective to eliminate waiting anxiety and restore order, civility, and efficiency to healthcare centers, educational campuses, and public institutions.
                </p>
              </div>

              {/* Archival Registry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-8 mt-8 border-t border-slate-100 text-xs text-slate-500 font-mono">
                <div className="flex flex-wrap items-center gap-5">
                  <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    21 September 2026
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Markaz Garden, Poonoor, Calicut
                  </span>
                </div>

                <a
                  href="https://www.dihlizworldschool.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold transition-colors"
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] font-mono tracking-wider uppercase mb-2">
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
            <div className="mb-8 p-4 rounded-xl bg-white border border-slate-200/90 text-center max-w-2xl mx-auto text-xs sm:text-[13px] text-slate-600 shadow-xs">
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
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-xl bg-slate-900/90 backdrop-blur-md text-xs text-white">
                    <div>
                      <div className="font-semibold">Inaugural Guests &amp; Programme</div>
                      <div className="text-[11px] text-slate-300">Dr. Azhari &amp; Distinguished Speakers</div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-blue-300 text-[11px] font-mono">
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
                    sizes="(max-width: 768px) 100vw, 50vw"
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
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">&lt; 35ms</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Sync Latency</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">0 Apps</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Visitor App Installs</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">99.98%</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Platform Uptime SLA</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-center shadow-xs">
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

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-blue-300 text-[11px] font-mono uppercase tracking-wider mb-3">
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
        <div className="border-t border-slate-200/80 bg-slate-50 py-7 px-6 text-center">
          <p className="text-xs text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
            Official Inauguration on 21 September 2026 at the 11th Jazbayos &mdash; Dihliz Life Festival &middot; Dihliz World School &middot; Markaz Knowledge Garden, Poonoor, Calicut.
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
                  sizes="(max-width: 768px) 100vw, 672px"
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

      {/* ─── Ceremonial Platform Inauguration & Live Redirect Countdown Modal ─── */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[140] bg-slate-900/25 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={cancelLaunchSequence}
          >
            {/* Ambient Background Soft Radial Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-to-tr from-blue-500/10 via-sky-400/10 to-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
              initial={{ scale: 0.94, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: -10, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}
              className="relative max-w-[540px] w-full max-h-[94vh] overflow-y-auto rounded-[24px] sm:rounded-[32px] bg-white border border-blue-100/90 p-4 sm:p-6 lg:p-7 text-slate-900 shadow-[0_25px_80px_-15px_rgba(29,99,255,0.2),0_10px_25px_rgba(0,0,0,0.04)] text-center select-none my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Faint Islamic Geometric Pattern Background */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.035] overflow-hidden" aria-hidden="true">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="islamic-geom-mesh" width="56" height="56" patternUnits="userSpaceOnUse">
                      <path d="M28 0 L56 28 L28 56 L0 28 Z" fill="none" stroke="#2563EB" strokeWidth="1" />
                      <path d="M0 0 L56 56 M56 0 L0 56" fill="none" stroke="#2563EB" strokeWidth="0.75" />
                      <circle cx="28" cy="28" r="14" fill="none" stroke="#2563EB" strokeWidth="0.75" />
                      <circle cx="0" cy="0" r="10" fill="none" stroke="#2563EB" strokeWidth="0.75" />
                      <circle cx="56" cy="0" r="10" fill="none" stroke="#2563EB" strokeWidth="0.75" />
                      <circle cx="0" cy="56" r="10" fill="none" stroke="#2563EB" strokeWidth="0.75" />
                      <circle cx="56" cy="56" r="10" fill="none" stroke="#2563EB" strokeWidth="0.75" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#islamic-geom-mesh)" />
                </svg>
              </div>

              {/* Left flowing blue curves */}
              <svg
                className="absolute -left-10 top-0 bottom-0 h-full w-44 pointer-events-none opacity-40"
                viewBox="0 0 180 600"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M-20,0 C65,130 -30,290 55,440 C95,510 30,600 -20,600 Z"
                  fill="url(#blueRibbonLeft)"
                />
                <path
                  d="M0,0 C80,150 -15,310 65,460 C100,530 40,600 0,600"
                  stroke="url(#blueStrokeLeft)"
                  strokeWidth="1.25"
                  strokeOpacity="0.4"
                />
                <defs>
                  <linearGradient id="blueRibbonLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
                    <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="blueStrokeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#93C5FD" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Right flowing blue curves */}
              <svg
                className="absolute -right-10 top-0 bottom-0 h-full w-44 pointer-events-none opacity-40"
                viewBox="0 0 180 600"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M200,0 C115,130 210,290 125,440 C85,510 150,600 200,600 Z"
                  fill="url(#blueRibbonRight)"
                />
                <path
                  d="M180,0 C100,150 195,310 115,460 C80,530 140,600 180,600"
                  stroke="url(#blueStrokeRight)"
                  strokeWidth="1.25"
                  strokeOpacity="0.4"
                />
                <defs>
                  <linearGradient id="blueRibbonRight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
                    <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="blueStrokeRight" x1="100%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#93C5FD" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={cancelLaunchSequence}
                className="absolute top-4 right-4 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close launch modal"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Provenance Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50/90 border border-blue-200/70 text-blue-700 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">
                <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                <span>OFFICIAL INAUGURATION</span>
              </div>

              {/* 1. Arabic Bismillah Calligraphy */}
              <div className="relative pt-1">
                <div
                  className="text-center font-['Amiri',serif] text-2xl sm:text-3xl lg:text-[32px] text-slate-900 tracking-wide select-none leading-snug font-normal"
                  dir="rtl"
                >
                  بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
                <div className="text-[8.5px] sm:text-[9px] font-mono tracking-[0.22em] text-slate-400 uppercase select-none mt-0.5 font-semibold">
                  IN THE NAME OF ALLAH, THE MOST GRACIOUS, THE MOST MERCIFUL
                </div>

                {/* Audio Recitation Status Indicator */}
                <div className="flex items-center justify-center mt-2">
                  <button
                    type="button"
                    onClick={playBismillahRecitation}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/60 text-blue-700 text-[10.5px] font-medium transition-all active:scale-[0.98] cursor-pointer"
                    title="Play Arabic Bismillah recitation"
                  >
                    {isPlayingBismillah ? (
                      <span className="flex items-center gap-0.5 h-2.5">
                        <span className="w-0.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
                        <span className="w-0.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                        <span className="w-0.5 h-3 bg-blue-600 rounded-full animate-pulse" />
                        <span className="w-0.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                      </span>
                    ) : (
                      <Volume2 className="w-3 h-3 text-blue-600" />
                    )}
                    <span>{isPlayingBismillah ? "Arabic Recitation Playing..." : "Replay Arabic Voice"}</span>
                  </button>
                </div>
              </div>

              {/* 2. Headline */}
              <div className="mt-3 space-y-0.5 text-center">
                <h2
                  className={`text-2xl sm:text-3xl font-black tracking-tight text-[#1D63FF] transition-all duration-300 ${
                    pulseLogo ? "scale-105 drop-shadow-[0_0_20px_rgba(29,99,255,0.45)] brightness-110" : ""
                  }`}
                >
                  Q4Queue
                </h2>
                <div className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  Official Inauguration
                </div>
                <p className="text-[11.5px] sm:text-xs text-slate-500 font-normal max-w-sm mx-auto leading-relaxed">
                  Inaugurating by Dr. Muhammed Abdul Hakim Azhari at the 11th Jazbayos Festival.
                </p>
              </div>

              {/* 3. Minimal Unified Live Dispatch Showcase */}
              <div className="mt-3.5 rounded-2xl bg-gradient-to-b from-blue-50/50 to-slate-50/30 border border-blue-100 p-3.5 sm:p-4 text-center relative overflow-hidden">
                <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-medium pb-1.5 border-b border-blue-100/60">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-mono text-[9.5px] font-bold tracking-wider uppercase text-slate-600">
                      LIVE DISPATCH
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-500 font-medium">
                    Counter 03 &middot; Consultation Wing
                  </span>
                </div>

                <div className="py-2">
                  <div className="text-[9.5px] font-mono uppercase tracking-[0.2em] text-[#1D63FF] font-bold mb-0.5">
                    NOW SERVING
                  </div>
                  <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-[#1D63FF] tabular-nums my-0.5 drop-shadow-[0_2px_12px_rgba(29,99,255,0.1)]">
                    #A-{launchedTokenNumber}
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 border border-blue-100 text-[10px] sm:text-[10.5px] font-mono text-blue-700 font-medium shadow-2xs">
                    <span>Priority Lane &middot; Station Active &middot; Sync &lt; 24ms</span>
                  </div>
                </div>

                {/* Integrated Progress & Countdown */}
                <div className="mt-2 pt-2 border-t border-blue-100/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium mb-1.5">
                    <button
                      type="button"
                      onClick={handleInstantRedirect}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-[#1D63FF] transition-colors cursor-pointer group"
                    >
                      <Clock className="w-3 h-3 text-[#1D63FF]" />
                      <span>Entering Live Platform</span>
                      <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        (click to enter now &rarr;)
                      </span>
                    </button>
                    <span className="px-2 py-0.5 rounded-md bg-[#1D63FF] text-white font-mono text-[10.5px] font-bold">
                      {launchCountdown}s
                    </span>
                  </div>

                  {/* Smooth Progress Bar */}
                  <div
                    onClick={handleInstantRedirect}
                    className="w-full h-1.5 rounded-full bg-blue-100 overflow-hidden relative cursor-pointer"
                    title="Click to enter immediately"
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-400 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((10 - launchCountdown) / 10) * 100}%` }}
                      transition={{ duration: 0.35, ease: "linear" }}
                    />
                  </div>

                  {/* Stage message ticker */}
                  <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[10.5px] text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D63FF] shrink-0 animate-ping" />
                    <span>{launchStageMessage}</span>
                  </div>
                </div>
              </div>

              {/* 4. Minimal Footer Bar */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <Logo size="sm" imageClassName="h-3 sm:h-3.5 w-auto opacity-70 grayscale hover:grayscale-0 transition-all" />
                </div>
                <div className="text-[9px] tracking-[0.2em] uppercase text-slate-400 font-semibold">
                  QUEUE SMARTER. SERVE BETTER.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Blue Wave Transition Curtain Across Screen at T=0 ─── */}
      <AnimatePresence>
        {isWaveActive && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "100%", opacity: [0, 0.45, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="fixed inset-0 pointer-events-none z-[160] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
