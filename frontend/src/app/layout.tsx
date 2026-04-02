import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '자산 포트폴리오',
  description: '함께 관리하는 자산 포트폴리오',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-brand-50 min-h-screen`}>
        <Header />
        <div className="flex min-h-[calc(100vh-3.5rem)]">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8 max-w-3xl">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
