"use client"

import { useEffect, useRef, useState } from "react"

export interface FlipPage {
  id: string
  label: string
  render: (isActive: boolean) => React.ReactNode
}

interface PageFlipContainerProps {
  pages: FlipPage[]
}

const WHEEL_THRESHOLD = 36
const TOUCH_THRESHOLD = 56

export default function PageFlipContainer({ pages }: PageFlipContainerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [targetIndex, setTargetIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [reducedMotion, setReducedMotion] = useState(true)
  const wheelDeltaRef = useRef(0)
  const touchStartYRef = useRef<number | null>(null)

  const isFlipping = targetIndex !== null
  const currentPage = pages[activeIndex]

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const supports3d = CSS.supports("transform-style", "preserve-3d") && CSS.supports("perspective", "1px")
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches || !supports3d)

    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)
    return () => mediaQuery.removeEventListener("change", updateMotionPreference)
  }, [])

  const requestPage = (nextIndex: number) => {
    if (isFlipping || nextIndex < 0 || nextIndex >= pages.length || nextIndex === activeIndex) return

    if (reducedMotion || Math.abs(nextIndex - activeIndex) > 1) {
      setActiveIndex(nextIndex)
      return
    }

    setDirection(nextIndex > activeIndex ? 1 : -1)
    setTargetIndex(nextIndex)
  }

  const requestAdjacentPage = (nextDirection: 1 | -1) => requestPage(activeIndex + nextDirection)

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || isFlipping) return
      event.preventDefault()
      wheelDeltaRef.current += event.deltaY
      if (Math.abs(wheelDeltaRef.current) < WHEEL_THRESHOLD) return

      requestAdjacentPage(wheelDeltaRef.current > 0 ? 1 : -1)
      wheelDeltaRef.current = 0
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [activeIndex, isFlipping])

  const finishFlip = () => {
    if (targetIndex === null) return
    setActiveIndex(targetIndex)
    setTargetIndex(null)
  }

  if (!currentPage) return null

  return (
    <main
      className="page-flip-book"
      onTouchStart={(event) => {
        touchStartYRef.current = event.touches[0]?.clientY ?? null
      }}
      onTouchEnd={(event) => {
        const startY = touchStartYRef.current
        const endY = event.changedTouches[0]?.clientY
        touchStartYRef.current = null
        if (startY === null || endY === undefined || isFlipping) return
        const distance = startY - endY
        if (Math.abs(distance) >= TOUCH_THRESHOLD) requestAdjacentPage(distance > 0 ? 1 : -1)
      }}
    >
      <div className="page-flip-stage" aria-live="polite">
        {targetIndex !== null && (
          <PageLayer page={pages[targetIndex]} isActive={false} state="incoming" />
        )}
        <PageLayer
          page={currentPage}
          isActive={!isFlipping}
          state={isFlipping ? (direction === 1 ? "turning-forward" : "turning-back") : "current"}
          onTransitionEnd={finishFlip}
          reducedMotion={reducedMotion}
        />
      </div>

      <nav className="page-flip-pagination" aria-label="档案页码导航">
        <span className="page-flip-count">{String(activeIndex + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}</span>
        <div className="page-flip-dots">
          {pages.map((page, index) => (
            <button
              key={page.id}
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              aria-label={`跳转至第 ${index + 1} 页：${page.label}`}
              aria-current={index === activeIndex ? "page" : undefined}
              onClick={() => requestPage(index)}
            />
          ))}
        </div>
      </nav>

      <style jsx>{`
        .page-flip-book { position: relative; height: 100dvh; overflow: hidden; background: #faf7f5; perspective: 1800px; }
        .page-flip-stage { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; }
        .page-flip-pagination { position: fixed; z-index: 60; right: clamp(12px, 2.4vw, 34px); top: 50%; display: flex; flex-direction: column; align-items: center; gap: 12px; transform: translateY(-50%); color: #8e8e93; }
        .page-flip-count { writing-mode: vertical-rl; font-size: 10px; letter-spacing: .18em; font-family: var(--font-sans); }
        .page-flip-dots { display: flex; flex-direction: column; gap: 8px; }
        .page-flip-dots button { width: 7px; height: 7px; padding: 0; border: 1px solid rgba(156, 122, 46, .6); border-radius: 999px; background: rgba(250, 247, 245, .65); transition: transform .25s ease, background-color .25s ease; }
        .page-flip-dots button.is-active { transform: scale(1.45); background: #d4af37; }
        @media (max-width: 640px) { .page-flip-pagination { right: 10px; } }
      `}</style>
    </main>
  )
}

function PageLayer({
  page,
  isActive,
  state,
  onTransitionEnd,
  reducedMotion = false,
}: {
  page: FlipPage
  isActive: boolean
  state: "current" | "incoming" | "turning-forward" | "turning-back"
  onTransitionEnd?: () => void
  reducedMotion?: boolean
}) {
  return (
    <article
      className={`page-flip-sheet page-flip-sheet--${state}`}
      aria-hidden={!isActive && state !== "current"}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && state.startsWith("turning")) onTransitionEnd?.()
      }}
    >
      <div className="page-flip-face page-flip-face--front">{page.render(isActive)}</div>
      <div className="page-flip-face page-flip-face--back" aria-hidden="true">
        <div className="page-flip-back-mark">FELINE INTELLIGENCE BUREAU</div>
        <div className="page-flip-back-number">{page.id.toUpperCase()}</div>
      </div>
      <style jsx>{`
        .page-flip-sheet { position: absolute; inset: 0; z-index: 2; transform-style: preserve-3d; transform-origin: left center; }
        .page-flip-sheet--incoming { z-index: 1; }
        .page-flip-sheet--turning-forward { animation: page-turn-forward 760ms cubic-bezier(.22, .76, .22, 1) forwards; }
        .page-flip-sheet--turning-back { animation: page-turn-back 760ms cubic-bezier(.22, .76, .22, 1) forwards; }
        .page-flip-face { position: absolute; inset: 0; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .page-flip-face--back { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; transform: rotateY(180deg); background: repeating-linear-gradient(0deg, #f6eee9, #f6eee9 31px, #eadbd1 32px); color: #b39b7e; }
        .page-flip-back-mark { font: 9px var(--font-sans); letter-spacing: .35em; }
        .page-flip-back-number { font: 18px var(--font-serif); letter-spacing: .18em; opacity: .7; }
        @keyframes page-turn-forward { to { transform: rotateY(-180deg); } }
        @keyframes page-turn-back { to { transform: rotateY(180deg); } }
        @media (prefers-reduced-motion: reduce) { .page-flip-sheet--turning-forward, .page-flip-sheet--turning-back { animation: none; } }
      `}</style>
    </article>
  )
}
