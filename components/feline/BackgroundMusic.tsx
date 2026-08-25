"use client"

import { useEffect, useRef } from "react"

const DEFAULT_MUSIC_URL = "/audio/feline-bg.mp3"
const FALLBACK_MUSIC_URL =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_4dd8b7f1d4.mp3?filename=soft-piano-ambient-114064.mp3"

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const userGestureRef = useRef(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const audio = new Audio(DEFAULT_MUSIC_URL)
    audio.loop = true
    audio.volume = 0.28
    audio.preload = "auto"
    audio.crossOrigin = "anonymous"
    audioRef.current = audio

    // ✅ 核心：检测是否有视频正在播放
    const hasVideoPlaying = () => {
      const videos = document.querySelectorAll("video")
      for (const video of videos) {
        // 检查是否有有效 src
        const src = video.src || video.getAttribute("src")
        if (!src || src.length === 0 || src === "about:blank") continue
        
        // 检查是否真正在播放
        const isPlaying = !video.paused && !video.ended && video.readyState >= 3
        // 检查视频是否有内容（防止空视频）
        const hasContent = video.duration > 0 && video.videoWidth > 0
        
        if (isPlaying && hasContent) {
          console.log("🎬 检测到视频正在播放:", video.src?.slice(-30))
          return true
        }
      }
      return false
    }

    // ✅ 核心：强制同步音乐与视频状态
    const syncMusicWithVideo = async () => {
      const currentAudio = audioRef.current
      if (!currentAudio) return

      const videoIsPlaying = hasVideoPlaying()

      if (videoIsPlaying) {
        // 视频在播放 → 音乐必须暂停
        if (!currentAudio.paused) {
          console.log("🔇 视频播放，强制暂停音乐")
          currentAudio.pause()
        }
        return
      }

      // 没有视频在播放 → 音乐应该播放
      if (currentAudio.paused && userGestureRef.current) {
        try {
          console.log("▶️ 无视频播放，恢复音乐")
          currentAudio.muted = false
          await currentAudio.play()
        } catch (error) {
          console.log("⏳ 恢复音乐失败:", error)
        }
      }
    }

    // ✅ 用户交互授权
    const enableMusic = async () => {
      if (userGestureRef.current) return
      userGestureRef.current = true
      console.log("🎵 用户交互授权已获取")
      
      // 立即尝试播放
      const currentAudio = audioRef.current
      if (currentAudio && !hasVideoPlaying()) {
        try {
          currentAudio.muted = false
          await currentAudio.play()
          console.log("✅ 背景音乐播放成功")
        } catch (error) {
          console.log("⏳ 播放被阻止")
        }
      }
    }

    // ✅ 启动强制轮询（每 300ms 检查一次）
    const startSyncInterval = () => {
      if (intervalRef.current) return
      console.log("🔄 启动音乐-视频同步轮询 (300ms)")
      intervalRef.current = setInterval(() => {
        syncMusicWithVideo()
      }, 300)
    }

    // ✅ 音频错误处理（备用链接）
    const handleAudioError = () => {
      const currentAudio = audioRef.current
      if (!currentAudio) return
      if (currentAudio.src !== FALLBACK_MUSIC_URL) {
        console.log("⚠️ 音乐加载失败，切换到备用链接")
        currentAudio.src = FALLBACK_MUSIC_URL
        currentAudio.load()
      }
    }

    // 全局事件：获取用户交互授权
    document.addEventListener("pointerdown", enableMusic, { passive: true })
    document.addEventListener("keydown", enableMusic, { passive: true })
    document.addEventListener("touchstart", enableMusic, { passive: true })
    audio.addEventListener("error", handleAudioError)

    // ✅ 页面加载完成后尝试自动播放 + 启动轮询
    const init = async () => {
      const currentAudio = audioRef.current
      if (!currentAudio) return

      // 尝试自动播放
      try {
        if (!hasVideoPlaying()) {
          currentAudio.muted = false
          await currentAudio.play()
          console.log("✅ 背景音乐自动播放成功")
          userGestureRef.current = true
        }
      } catch (error) {
        console.log("⏳ 自动播放被阻止，等待用户交互")
      }

      // ✅ 无论是否自动播放成功，都启动轮询
      startSyncInterval()
    }

    if (document.readyState === "complete") {
      init()
    } else {
      window.addEventListener("load", init)
    }

    return () => {
      window.removeEventListener("load", init)
      document.removeEventListener("pointerdown", enableMusic)
      document.removeEventListener("keydown", enableMusic)
      document.removeEventListener("touchstart", enableMusic)
      audio.removeEventListener("error", handleAudioError)

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        console.log("🔄 停止音乐-视频同步轮询")
      }

      audio.pause()
      audio.src = ""
      audioRef.current = null
    }
  }, [])

  // ✅ 手动切换音乐
  const toggleMusic = async () => {
    const currentAudio = audioRef.current
    if (!currentAudio) return

    userGestureRef.current = true

    if (currentAudio.paused) {
      // 检查是否有视频在播放
      const hasVideoPlaying = () => {
        const videos = document.querySelectorAll("video")
        for (const video of videos) {
          const src = video.src || video.getAttribute("src")
          if (!src || src.length === 0 || src === "about:blank") continue
          if (!video.paused && !video.ended && video.readyState >= 3) {
            return true
          }
        }
        return false
      }

      if (hasVideoPlaying()) {
        console.log("🎬 有视频在播放，无法播放音乐")
        return
      }

      try {
        currentAudio.muted = false
        await currentAudio.play()
        console.log("🎵 手动播放音乐")
      } catch (error) {
        console.log("⚠️ 手动播放失败")
      }
    } else {
      currentAudio.pause()
      console.log("⏸️ 手动暂停音乐")
    }
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ♪
    </button>
  )
}