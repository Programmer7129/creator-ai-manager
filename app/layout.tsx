import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CreatorAI Manager - AI-Powered Influencer Management",
  description: "The ultimate platform for talent managers and agencies to manage content creators with AI-powered insights, scheduling, and brand partnership tools.",
  keywords: ["influencer management", "content creator", "AI", "social media", "talent management"],
  authors: [{ name: "CreatorAI Manager Team" }],
  creator: "CreatorAI Manager",
  openGraph: {
    title: "CreatorAI Manager - AI-Powered Influencer Management",
    description: "Revolutionize your talent management with AI-powered insights and automation.",
    url: "https://creatorai-manager.com",
    siteName: "CreatorAI Manager",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CreatorAI Manager Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreatorAI Manager - AI-Powered Influencer Management",
    description: "Revolutionize your talent management with AI-powered insights and automation.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
