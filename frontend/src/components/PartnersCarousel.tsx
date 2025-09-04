'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'

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
  const { language } = useLanguage()
  const [partners, setPartners] = useState<Partner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

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

  // Auto-scroll infinito
  useEffect(() => {
    if (partners.length === 0) return

    const interval = setInterval(() => {
      nextSlide()
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(interval)
  }, [partners.length])

  const itemsPerView = {
    desktop: 4,
    tablet: 3,
    mobile: 1
  }

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.ceil(partners.length / itemsPerView.desktop) - 1
      return prevIndex >= maxIndex ? 0 : prevIndex + 1
    })
    
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.ceil(partners.length / itemsPerView.desktop) - 1
      return prevIndex <= 0 ? maxIndex : prevIndex - 1
    })
    
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Criar array infinito duplicando os parceiros
  const infinitePartners = partners.length > 0 ? [
    ...partners,
    ...partners,
    ...partners // Triplicar para garantir loop suave
  ] : []

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



  return (
    <section className="py-20 bg-gradient-to-br from-primary-25 to-secondary-50">
      <div className="container mx-auto px-4">
        {/* Header with Image and Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mb-16">
          
          {/* Left Side - Content */}
          <div className="space-y-6 lg:order-1">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-1 bg-gradient-to-r from-primary-600 to-autism-friendly rounded-full"></div>
                <span className="text-primary-600 font-semibold text-accessible-base uppercase tracking-wider">
                  {language === 'pt' ? 'Parceiros' : 'Partners'}
                </span>
              </div>
              
              <h2 className="text-accessible-2xl font-bold text-secondary-800 leading-tight">
                {language === 'pt' 
                  ? 'Parceiros e Apoiadores' 
                  : 'Partners and Supporters'
                }
              </h2>
              
              <p className="text-accessible-lg text-secondary-600 leading-relaxed">
                {language === 'pt'
                  ? 'Organizações que acreditam e apoiam o turismo inclusivo no Algarve. Juntos, construímos uma rede de experiências verdadeiramente acessíveis.'
                  : 'Organizations that believe in and support inclusive tourism in the Algarve. Together, we build a network of truly accessible experiences.'
                }
              </p>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className="relative group lg:order-2">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwfGVufDB8fHx8MTc1NzAxNDAyM3ww&ixlib=rb-4.1.0&q=85"
                alt={language === 'pt' ? 'Equipe de parceiros colaborando juntos para inclusão' : 'Partner team collaborating together for inclusion'}
                className="w-full h-[350px] lg:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-transparent"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-semibold text-secondary-700">
                    {language === 'pt' ? 'Colaboração' : 'Collaboration'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-200/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-autism-friendly/20 rounded-full blur-2xl"></div>
          </div>
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
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 h-24 flex items-center justify-center group border border-secondary-100 hover:border-primary-200">
                    {partner.website_url ? (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full flex items-center justify-center text-center"
                      >
                        <div className="space-y-1">
                          <h3 className="text-accessible-sm font-semibold text-secondary-700 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                            {partner.name}
                          </h3>
                          <p className="text-xs text-secondary-500 group-hover:text-secondary-600 transition-colors duration-300">
                            {partner.description}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="text-center space-y-1">
                        <h3 className="text-accessible-sm font-semibold text-secondary-700 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                          {partner.name}
                        </h3>
                        <p className="text-xs text-secondary-500 group-hover:text-secondary-600 transition-colors duration-300">
                          {partner.description}
                        </p>
                      </div>
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