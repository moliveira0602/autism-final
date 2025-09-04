import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TEIA - Algarve Autism Friendly',
  description: 'Turismo inclusivo para pessoas com Transtorno do Espectro do Autismo no Algarve',
  keywords: 'autismo, turismo inclusivo, Algarve, acessibilidade, TEA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#f8fafc',
              color: '#1e293b',
              fontSize: '16px',
              fontWeight: '500',
              padding: '16px',
            },
          }}
        />
      </body>
    </html>
  )
}