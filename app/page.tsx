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
      `}</style>
    </>
  )
}
