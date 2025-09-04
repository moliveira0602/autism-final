'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  HeartIcon, 
  MapPinIcon, 
  UserGroupIcon,
  ShieldCheckIcon,
  StarIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Establishment {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  certified_autism_friendly: boolean;
  autism_rating: number;
  accessibility_features: string[];
  images: string[];
}

export default function HomePage() {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt')
  const [featuredEstablishments, setFeaturedEstablishments] = useState<Establishment[]>([])
  const [stats, setStats] = useState({
    total_establishments: 0,
    certified_count: 0,
    happy_families: 0
  })

  useEffect(() => {
    // Fetch featured establishments and stats
    fetchFeaturedEstablishments()
    fetchStats()
  }, [])

  const fetchFeaturedEstablishments = async () => {
    try {
      const response = await fetch('/api/establishments?limit=3&certified_only=true')
      if (response.ok) {
        const data = await response.json()
        setFeaturedEstablishments(data)
      }
    } catch (error) {
      console.error('Error fetching featured establishments:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/establishments')
      if (response.ok) {
        const data = await response.json()
        const certified = data.filter((est: Establishment) => est.certified_autism_friendly)
        setStats({
          total_establishments: data.length,
          certified_count: certified.length,
          happy_families: Math.floor(Math.random() * 500) + 200 // Mock data for now
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const content = {
    pt: {
      title: "TEIA - Algarve Autism Friendly",
      subtitle: "Turismo inclusivo para pessoas com TEA e suas famílias",
      description: "Descubra lugares amigáveis e acessíveis no Algarve, especialmente preparados para pessoas com Transtorno do Espectro do Autismo. Viaje com confiança e tranquilidade.",
      exploreButton: "Explorar Locais",
      createProfileButton: "Criar Perfil Sensorial",
      featuresTitle: "Por que escolher a TEIA?",
      features: [
        {
          icon: ShieldCheckIcon,
          title: "Certificação Autism Friendly",
          description: "Estabelecimentos certificados e preparados para receber pessoas com TEA"
        },
        {
          icon: MapPinIcon,
          title: "Mapa Interativo",
          description: "Encontre facilmente locais próximos com filtros personalizados"
        },
        {
          icon: UserGroupIcon,
          title: "Comunidade Ativa",
          description: "Avaliações e dicas de outras famílias que vivenciam o TEA"
        }
      ],
      statsTitle: "Nossa Comunidade",
      establishmentsLabel: "Estabelecimentos",
      certifiedLabel: "Certificados",
      familiesLabel: "Famílias Felizes",
      featuredTitle: "Estabelecimentos em Destaque",
      viewAll: "Ver Todos"
    },
    en: {
      title: "TEIA - Algarve Autism Friendly",
      subtitle: "Inclusive tourism for people with ASD and their families",
      description: "Discover friendly and accessible places in the Algarve, specially prepared for people with Autism Spectrum Disorder. Travel with confidence and peace of mind.",
      exploreButton: "Explore Places",
      createProfileButton: "Create Sensory Profile",
      featuresTitle: "Why choose TEIA?",
      features: [
        {
          icon: ShieldCheckIcon,
          title: "Autism Friendly Certification",
          description: "Certified establishments prepared to welcome people with ASD"
        },
        {
          icon: MapPinIcon,
          title: "Interactive Map",
          description: "Easily find nearby places with customized filters"
        },
        {
          icon: UserGroupIcon,
          title: "Active Community",
          description: "Reviews and tips from other families experiencing ASD"
        }
      ],
      statsTitle: "Our Community",
      establishmentsLabel: "Establishments",
      certifiedLabel: "Certified",
      familiesLabel: "Happy Families",
      featuredTitle: "Featured Establishments",
      viewAll: "View All"
    }
  }

  const t = content[language]

  return (
    <div className="min-h-screen">
      {/* Language Switcher */}
      <div className="fixed top-20 right-4 z-50">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as 'pt' | 'en')}
          className="bg-white border border-secondary-300 rounded-lg px-3 py-1 text-accessible-base focus:ring-2 focus:ring-primary-500"
        >
          <option value="pt">🇵🇹 Português</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-autism-calm py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-accessible-2xl md:text-5xl font-bold text-secondary-800 mb-6">
            {t.title}
          </h1>
          <p className="text-accessible-xl text-secondary-600 mb-4 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <p className="text-accessible-base text-secondary-600 mb-8 max-w-3xl mx-auto">
            {t.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/establishments" className="btn btn-primary">
              {t.exploreButton}
              <ChevronRightIcon className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link href="/profile" className="btn btn-secondary">
              {t.createProfileButton}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-accessible-2xl font-bold text-center mb-12 text-secondary-800">
            {t.statsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stats.total_establishments}
              </div>
              <div className="text-accessible-lg text-secondary-600">
                {t.establishmentsLabel}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-autism-friendly mb-2 flex items-center justify-center">
                {stats.certified_count}
                <ShieldCheckIcon className="w-8 h-8 ml-2 text-green-600" />
              </div>
              <div className="text-accessible-lg text-secondary-600">
                {t.certifiedLabel}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-autism-support mb-2 flex items-center justify-center">
                {stats.happy_families}
                <HeartSolidIcon className="w-8 h-8 ml-2 text-red-500" />
              </div>
              <div className="text-accessible-lg text-secondary-600">
                {t.familiesLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-accessible-2xl font-bold text-center mb-12 text-secondary-800">
            {t.featuresTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.features.map((feature, index) => (
              <div key={index} className="card text-center">
                <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-accessible-xl font-semibold mb-4 text-secondary-800">
                  {feature.title}
                </h3>
                <p className="text-accessible-base text-secondary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Establishments */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-accessible-2xl font-bold text-secondary-800">
              {t.featuredTitle}
            </h2>
            <Link 
              href="/establishments"
              className="text-primary-600 hover:text-primary-700 font-medium text-accessible-base"
            >
              {t.viewAll} →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEstablishments.map((establishment) => (
              <div key={establishment.id} className="card hover:shadow-lg transition-shadow">
                {establishment.images.length > 0 && (
                  <img 
                    src={`data:image/jpeg;base64,${establishment.images[0]}`}
                    alt={establishment.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-accessible-lg font-semibold text-secondary-800">
                    {establishment.name}
                  </h3>
                  {establishment.certified_autism_friendly && (
                    <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                  )}
                </div>
                
                <p className="text-secondary-600 text-accessible-base mb-3 line-clamp-2">
                  {establishment.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 text-secondary-500 mr-1" />
                    <span className="text-accessible-sm text-secondary-500">
                      {establishment.address.split(',')[0]}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                    <span className="text-accessible-sm font-medium">
                      {establishment.autism_rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <Link 
                  href={`/establishments/${establishment.id}`}
                  className="btn btn-primary w-full mt-4"
                >
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}