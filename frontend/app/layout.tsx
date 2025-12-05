import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const vazirmatn = Vazirmatn({ subsets: ["arabic"] })
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "پیتزا شب تهران - تحلیل نظرات",
  description: "تحلیل هوشمند نظرات مشتریان رستوران پیتزا شب تهران",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
