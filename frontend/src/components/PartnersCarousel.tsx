'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Partner {
  id: string
  name: string
  logo_url: string
  website_url: string
  description: string
  is_active: boolean
  display_order: number
}

export default function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners')
      if (response.ok) {
        const data = await response.json()
        setPartners(data)
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-scroll effect
  useEffect(() => {
    if (partners.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === partners.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [partners.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === partners.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? partners.length - 1 : prevIndex - 1
    )
  }

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-r from-primary-50 to-autism-calm">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) {
    return null
  }

  // Calculate how many logos to show at once (responsive)
  const itemsPerView = {
    mobile: 2,
    tablet: 3,
    desktop: 4
  }

  return (
    <section className="py-12 bg-gradient-to-r from-primary-50 to-autism-calm">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-accessible-xl font-bold text-secondary-800 mb-3">
            Parceiros e Apoiadores
          </h2>
          <p className="text-secondary-600 text-accessible-base max-w-2xl mx-auto">
            Organizações que acreditam e apoiam o turismo inclusivo no Algarve
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-xl bg-white/50 backdrop-blur-sm p-6 shadow-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop)}%)`
              }}
            >
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex-shrink-0 w-1/4 px-3"
                  style={{ minWidth: `${100 / itemsPerView.desktop}%` }}
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 h-24 flex items-center justify-center group">
                    {partner.website_url ? (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                          title={partner.description || partner.name}
                        />
                      </a>
                    ) : (
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        title={partner.description || partner.name}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {partners.length > itemsPerView.desktop && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 p-2 z-10"
                aria-label="Parceiro anterior"
              >
                <ChevronLeftIcon className="w-5 h-5 text-secondary-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 p-2 z-10"
                aria-label="Próximo parceiro"
              >
                <ChevronRightIcon className="w-5 h-5 text-secondary-600" />
              </button>
            </>
          )}

          {/* Indicators */}
          {partners.length > itemsPerView.desktop && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(partners.length / itemsPerView.desktop) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerView.desktop)}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    Math.floor(currentIndex / itemsPerView.desktop) === index
                      ? 'bg-primary-600'
                      : 'bg-secondary-300'
                  }`}
                  aria-label={`Ir para grupo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile responsive styles */}
        <style jsx>{`
          @media (max-width: 768px) {
            .flex-shrink-0 {
              min-width: 50% !important;
            }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .flex-shrink-0 {
              min-width: 33.333333% !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}