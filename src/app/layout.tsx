import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { SITE_CONFIG } from '@/lib/constants'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'

const spaceGrotesk = localFont({
  variable: '--font-display',
  display: 'swap',
  src: [
    { path: '../../public/fonts/SpaceGrotesk-Medium.woff2', weight: '500' },
    { path: '../../public/fonts/SpaceGrotesk-Bold.woff2', weight: '700' },
  ],
})

const inter = localFont({
  variable: '--font-body',
  display: 'swap',
  src: [
    { path: '../../public/fonts/Inter-Light.woff2', weight: '300' },
    { path: '../../public/fonts/Inter-Regular.woff2', weight: '400' },
  ],
})

const jetbrainsMono = localFont({
  variable: '--font-mono',
  display: 'swap',
  src: [
    { path: '../../public/fonts/JetBrainsMono-Regular.woff2', weight: '400' },
  ],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Nisarg Chaudhary',
    'portfolio',
    'software developer',
    'frontend engineer',
    'designer',
    'University of Saskatchewan',
    'CS Honours',
    'Studio Arts',
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#111110" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var r=t==='light'?'light':t==='dark'?'dark':window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';document.documentElement.classList.add(r);document.documentElement.style.colorScheme=r}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
