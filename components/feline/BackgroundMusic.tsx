"use client"

import { useEffect, useRef } from "react"

const DEFAULT_MUSIC_URL = "/audio/feline-bg.mp3"
const FALLBACK_MUSIC_URL =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_4dd8b7f1d4.mp3?filename=soft-piano-ambient-114064.mp3"

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const userGestureRef = useRef(false)

  useEffect(() => {
    const audio = new Audio(DEFAULT_MUSIC_URL)
    audio.loop = true
    audio.volume = 0.28
    audio.preload = "auto"
    audio.crossOrigin = "anonymous"
    audioRef.current = audio

    const resumeBackgroundMusic = async () => {
      const currentAudio = audioRef.current
      if (!currentAudio || !userGestureRef.current) return

      const hasActiveVideo = Array.from(document.querySelectorAll("video")).some((video) => {
        const isPlayable = video.readyState >= 2 && !video.paused && !video.ended && video.currentTime > 0
        return isPlayable
      })

      if (hasActiveVideo) {
        currentAudio.pause()
        return
      }

      try {
        currentAudio.muted = false
        await currentAudio.play()
      } catch {
        // 浏览器阻止自动播放时静默忽略，等待下一次交互。
      }
    }

    const syncWithVideos = () => {
      const currentAudio = audioRef.current
      if (!currentAudio) return

      const hasVideoPlaying = Array.from(document.querySelectorAll("video")).some((video) => {
        return !video.paused && !video.ended && video.readyState >= 2
      })

      if (hasVideoPlaying) {
        currentAudio.pause()
        currentAudio.muted = true
        return
      }

      if (!userGestureRef.current) return

      currentAudio.muted = false
      void currentAudio.play().catch(() => {})
    }

    const enableMusic = () => {
      userGestureRef.current = true
      void resumeBackgroundMusic()
    }

    const handleVideoLifecycle = (event: Event) => {
      const target = event.target
      if (!(target instanceof HTMLVideoElement)) return

      if (!target.paused && !target.ended) {
        const currentAudio = audioRef.current
        if (currentAudio) {
          currentAudio.pause()
          currentAudio.muted = true
        }
        return
      }

      syncWithVideos()
    }

    const handleAudioError = () => {
      if (audio.src !== FALLBACK_MUSIC_URL) {
        audio.src = FALLBACK_MUSIC_URL
        audio.load()
      }
    }

    document.addEventListener("pointerdown", enableMusic, { passive: true })
    document.addEventListener("keydown", enableMusic, { passive: true })
    document.addEventListener("play", handleVideoLifecycle, true)
    document.addEventListener("pause", handleVideoLifecycle, true)
    document.addEventListener("ended", handleVideoLifecycle, true)
    audio.addEventListener("error", handleAudioError)

    if (document.readyState === "complete") {
      syncWithVideos()
    }

    return () => {
      document.removeEventListener("pointerdown", enableMusic)
      document.removeEventListener("keydown", enableMusic)
      document.removeEventListener("play", handleVideoLifecycle, true)
      document.removeEventListener("pause", handleVideoLifecycle, true)
      document.removeEventListener("ended", handleVideoLifecycle, true)
      audio.removeEventListener("error", handleAudioError)

      audio.pause()
      audio.src = ""
      audioRef.current = null
    }
  }, [])

  const toggleMusic = async () => {
    const currentAudio = audioRef.current
    if (!currentAudio) return

    userGestureRef.current = true

    if (currentAudio.paused) {
      const hasVideoPlaying = Array.from(document.querySelectorAll("video")).some((video) => {
        return !video.paused && !video.ended && video.readyState >= 2
      })

      if (hasVideoPlaying) {
        currentAudio.pause()
        currentAudio.muted = true
        return
      }

      currentAudio.muted = false
      try {
        await currentAudio.play()
      } catch {
        // 交互触发后再次尝试播放。
      }
      return
    }

    currentAudio.pause()
  }

  return (
    <button
      type="button"
      aria-label="切换背景音乐"
      onClick={toggleMusic}
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 9999,
        width: 46,
        height: 46,
        borderRadius: "9999px",
        border: "1px solid rgba(212,175,55,0.35)",
        background: "rgba(28,28,30,0.62)",
        backdropFilter: "blur(10px)",
        color: "#F6DCE3",
        boxShadow: "0 12px 28px rgba(28,28,30,0.15)",
        cursor: "none",
        fontSize: 18,
      }}
    >
      ♪
    </button>
  )
}