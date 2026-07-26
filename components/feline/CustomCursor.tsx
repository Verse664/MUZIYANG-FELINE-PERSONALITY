"use client"

import { useEffect, useRef } from "react"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -100, y: -100 })
  const dotPosRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      // Dot follows immediately
      dotPosRef.current.x += (posRef.current.x - dotPosRef.current.x) * 0.18
      dotPosRef.current.y += (posRef.current.y - dotPosRef.current.y) * 0.18

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${posRef.current.x - 16}px, ${posRef.current.y - 16}px)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPosRef.current.x - 3}px, ${dotPosRef.current.y - 3}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", moveCursor, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    // Hover effect on interactive elements
    const handleHoverIn = () => {
      cursorRef.current?.classList.add("cursor-hover")
    }
    const handleHoverOut = () => {
      cursorRef.current?.classList.remove("cursor-hover")
    }

    const addHoverListeners = () => {
      const els = document.querySelectorAll("a, button, [data-clickable]")
      els.forEach((el) => {
        el.addEventListener("mouseenter", handleHoverIn)
        el.addEventListener("mouseleave", handleHoverOut)
      })
    }
    addHoverListeners()

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      {/* Cat eye cursor ring */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{ width: 32, height: 32 }}
      >
        <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
          {/* Outer eye shape */}
          <ellipse
            cx="16" cy="16" rx="14" ry="10"
            stroke="#D8A7B1" strokeWidth="1.2" fill="none"
            style={{ filter: "drop-shadow(0 0 3px #D8A7B188)" }}
          />
          {/* Pupil slit */}
          <ellipse
            cx="16" cy="16" rx="3.5" ry="8"
            fill="#1C1C1E" opacity="0.7"
          />
          {/* Eye highlight */}
          <ellipse cx="13" cy="13" rx="1.2" ry="1.8" fill="white" opacity="0.5" />
        </svg>
      </div>
      {/* Trailing dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#D4AF37",
          opacity: 0.7,
          boxShadow: "0 0 6px 2px #D4AF3788",
        }}
      />
      <style jsx global>{`
        .cursor-hover svg ellipse:first-child {
          stroke: #D4AF37 !important;
          stroke-width: 1.8 !important;
        }
        .cursor-hover > div:last-child {
          transform: scale(1.5);
        }
      `}</style>
    </>
  )
}
