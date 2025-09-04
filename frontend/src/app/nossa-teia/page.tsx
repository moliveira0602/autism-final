'use client'

import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'

export default function NossaTeiaPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-r from-primary-100 to-autism-calm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-4xl mx-auto px-6">
            <h1 className="text-accessible-2xl font-bold text-secondary-800 mb-4">
              Estabelecimentos Autism Friendly no Algarve
            </h1>
            <p className="text-accessible-lg text-secondary-600 mb-6">
              Descubra locais preparados para receber pessoas com TEA e suas famílias.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-secondary-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-accessible-lg font-medium text-secondary-800 mb-2">
              Página em construção
            </h3>
            <p className="text-secondary-600 text-accessible-base">
              Esta página está sendo atualizada.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}