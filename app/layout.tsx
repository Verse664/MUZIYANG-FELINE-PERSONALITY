import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Caveat } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwriting',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'YANGYANG FELINE PERSONALITY ARCHIVE｜洋洋猫科人格档案',
  description: '关于一只猫如何成为自己的观察记录 · ARCHIVE NO. 2026-YANG',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FAF7F5',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${playfair.variable} ${inter.variable} ${caveat.variable} bg-[#FAF7F5]`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
