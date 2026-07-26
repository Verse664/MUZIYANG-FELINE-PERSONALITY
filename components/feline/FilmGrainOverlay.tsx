"use client"

export default function FilmGrainOverlay() {
  return (
    <>
      {/* Film grain texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.045,
          animation: "grain 0.8s steps(1) infinite",
        }}
      />
      {/* Floating petals */}
      <PetalField />
    </>
  )
}

function PetalField() {
  const petals = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${8 + i * 7.5}%`,
    delay: `${i * 1.8}s`,
    duration: `${12 + (i % 5) * 3}s`,
    size: i % 3 === 0 ? 8 : i % 3 === 1 ? 5 : 6,
    opacity: 0.18 + (i % 4) * 0.06,
  }))

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: "50% 0 50% 0",
            backgroundColor: "#D8A7B1",
            opacity: p.opacity,
            animation: `float-petal ${p.duration} ${p.delay} linear infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  )
}
