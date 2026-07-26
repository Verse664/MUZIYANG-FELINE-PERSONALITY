"use client"

import { useEffect, useRef, useState } from "react"
import HeroSection from "@/components/feline/HeroSection"
import SpeciesSection from "@/components/feline/SpeciesSection"
import PersonalitySection from "@/components/feline/PersonalitySection"
import SelfConsistentSection from "@/components/feline/SelfConsistentSection"
import EasterEggModal from "@/components/feline/EasterEggModal"
import FilmGrainOverlay from "@/components/feline/FilmGrainOverlay"
import CustomCursor from "@/components/feline/CustomCursor"

export default function FelineArchivePage() {
  const [eggOpen, setEggOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view")
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    )
    const elements = document.querySelectorAll(".reveal")
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <CustomCursor />
      <FilmGrainOverlay />
      <main
        className="relative min-h-screen overflow-x-hidden"
        style={{ fontFamily: "var(--font-sans), sans-serif", backgroundColor: "#FAF7F5" }}
      >
        <HeroSection onEggTrigger={() => setEggOpen(true)} scrollY={scrollY} />
        <SpeciesSection />
        <PersonalitySection />
        <SelfConsistentSection onEggTrigger={() => setEggOpen(true)} />

        <section className="relative overflow-hidden py-32 px-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 14%, rgba(245,232,236,0.48) 0%, transparent 18%), radial-gradient(circle at 79% 28%, rgba(247,236,233,0.38) 0%, transparent 16%), radial-gradient(circle at 48% 76%, rgba(255,245,244,0.5) 0%, transparent 20%), linear-gradient(180deg, rgba(250,247,245,1) 0%, rgba(250,242,240,1) 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0 8px, rgba(230,212,215,0.18) 8px 9px)" }} />
          <div className="fan-messages-petal absolute left-8 top-16 h-16 w-16 rounded-full bg-[#F5E5E6]/80 blur-sm" />
          <div className="fan-messages-petal absolute right-12 top-32 h-20 w-20 rounded-full bg-[#F8E6E9]/80 blur-sm" />

          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p
                className="mb-5 font-sans text-[0.72rem] uppercase tracking-[0.45em] text-[#8F7F82]"
                style={{ letterSpacing: "0.35em" }}
              >
                FAN MESSAGES
              </p>
              <h2
                className="font-serif mx-auto max-w-xl text-[clamp(2rem,4vw,3.8rem)] leading-tight"
                style={{ color: "#1C1C1E", letterSpacing: "0.04em" }}
              >
                猫迷寄语 · FAN MESSAGES
              </h2>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
              {[
                {
                  quote: "洋洋让我相信，猫真的可以活成一个人的样子。",
                  name: "小鹿",
                  city: "上海",
                },
                {
                  quote: "每次看到洋洋的照片，都觉得世界变软了。",
                  name: "阿卷",
                  city: "成都",
                },
                {
                  quote: "温柔和坚定原来可以同时在一个人身上发生，谢谢洋洋示范。",
                  name: "一一",
                  city: "东京",
                },
              ].map((item) => (
                <article
                  key={item.name}
                  className="relative rounded-[2rem] border border-[#D8B2BB]/40 bg-[#F8F0F1] p-8 shadow-[0_30px_80px_rgba(219,176,185,0.12)]"
                >
                  <div className="absolute left-6 top-6 h-10 w-10 rounded-full border border-[#D8A7B1]/50 bg-[#F9EFF0]/80" />
                  <div className="absolute right-6 top-6 inline-flex items-center rounded-full border border-[#D8A7B1]/35 bg-white/80 px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-[#A67E86]">
                    archive note
                  </div>

                  <p
                    className="mb-8 text-[clamp(1rem,2vw,1.17rem)] leading-[1.9] text-[#2E2A2C]"
                    style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  >
                    “{item.quote}”
                  </p>

                  <p
                    className="font-handwriting text-[1.2rem] leading-none text-[#C17F8A]"
                    style={{ fontFamily: "var(--font-handwriting), cursive" }}
                  >
                    —— {item.name}
                  </p>
                  <p className="mt-2 text-[0.72rem] uppercase tracking-[0.3em] text-[#8F7F82]">
                    {item.city}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <EasterEggModal open={eggOpen} onClose={() => setEggOpen(false)} />

      <style jsx global>{`
        * { cursor: none !important; }

        /* Reveal animations */
        .reveal {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal.delay-1 { transition-delay: 0.1s; }
        .reveal.delay-2 { transition-delay: 0.22s; }
        .reveal.delay-3 { transition-delay: 0.38s; }
        .reveal.delay-4 { transition-delay: 0.52s; }
        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        /* Handwriting reveal */
        .handwrite-reveal {
          opacity: 0;
          transition: opacity 1.2s ease;
        }
        .handwrite-reveal.in-view {
          opacity: 1;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #FAF7F5; }
        ::-webkit-scrollbar-thumb { background: #D8A7B1; border-radius: 2px; }

        /* Film grain */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          20% { transform: translate(2%, 3%); }
          30% { transform: translate(-1%, 2%); }
          40% { transform: translate(3%, -1%); }
          50% { transform: translate(-3%, 1%); }
          60% { transform: translate(1%, -2%); }
          70% { transform: translate(-2%, 3%); }
          80% { transform: translate(2%, -3%); }
          90% { transform: translate(-1%, 1%); }
        }

        @keyframes blink {
          0%, 85%, 100% { scaleY: 1; }
          90%, 92% { transform: scaleY(0.05); }
        }

        @keyframes pupil-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.72); }
        }

        @keyframes float-petal {
          0% { opacity: 0; transform: translateY(-20px) rotate(0deg); }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(110vh) rotate(720deg); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }

        @keyframes stamp-in {
          0% { opacity: 0; transform: scale(1.4) rotate(-8deg); }
          60% { opacity: 1; transform: scale(0.95) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .stamp-animate {
          animation: stamp-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .text-cursor::after {
          content: '|';
          animation: cursor-blink 1s step-end infinite;
          color: #D8A7B1;
        }

        .fan-messages-petal {
          animation: float-petal 14s linear infinite;
        }

        .fan-messages-petal:nth-child(1) {
          animation-delay: 0s;
          transform: translate(0, 0) rotate(-15deg);
        }

        .fan-messages-petal:nth-child(2) {
          animation-delay: 4s;
          transform: translate(0, 0) rotate(12deg);
        }
      `}</style>
    </>
  )
}
