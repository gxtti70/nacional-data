import type { Metadata } from 'next'
import { Bodoni_Moda, Big_Shoulders_Display, Instrument_Sans } from 'next/font/google'
import './globals.css'
import TopNav from '@/components/layout/TopNav'
import Footer from '@/components/layout/Footer'

const display = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' })
const num = Big_Shoulders_Display({ subsets: ['latin'], variable: '--font-num', display: 'swap' })
const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'Atlético Nacional · Archivo de datos',
  description: 'Historia, plantilla, cifras y leyendas del Atlético Nacional.',
}

const themeScript = `try{var t=localStorage.getItem('n-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${num.variable} ${sans.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="font-sans text-base leading-relaxed">
        <TopNav />
        <main className="mx-auto w-full max-w-6xl px-6 py-12">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
