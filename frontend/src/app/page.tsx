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
      exploreButton: "Explorar Nossa Teia",
      aboutButton: "Conhecer a TEIA",
      featuresTitle: "Por que escolher a TEIA?",
      features: [
        {
          icon: ShieldCheckIcon,
          title: "Certificação Autism Friendly",
          description: "Estabelecimentos certificados e preparados para receber pessoas com TEA",
          image: "https://images.unsplash.com/photo-1743873063757-eb59fa796e96"
        },
        {
          icon: MapPinIcon,
          title: "Locais Selecionados",
          description: "Restaurantes e hotéis com ambientes tranquilos e equipe treinada",
          image: "https://images.unsplash.com/photo-1592830900828-d4bed9a36de8"
        },
        {
          icon: UserGroupIcon,
          title: "Comunidade Ativa",
          description: "Avaliações e dicas de outras famílias que vivenciam o TEA",
          image: "https://images.unsplash.com/photo-1666593412929-005b60c67334"
        }
      ],
      statsTitle: "Nossa Comunidade",
      establishmentsLabel: "Estabelecimentos",
      certifiedLabel: "Certificados",
      familiesLabel: "Famílias Felizes",
      featuredTitle: "Estabelecimentos em Destaque",
      viewAll: "Ver Todos",
      footerAbout: "Sobre a TEIA",
      footerAboutText: "A TEIA é uma plataforma dedicada ao turismo inclusivo no Algarve, conectando famílias com estabelecimentos preparados para receber pessoas com TEA.",
      footerQuickLinks: "Links Rápidos",
      footerContact: "Contato",
      footerRights: "Todos os direitos reservados.",
      footerMadeWith: "Feito com",
      footerFor: "para famílias especiais"
    },
    en: {
      title: "TEIA - Algarve Autism Friendly",
      subtitle: "Inclusive tourism for people with ASD and their families",
      description: "Discover friendly and accessible places in the Algarve, specially prepared for people with Autism Spectrum Disorder. Travel with confidence and peace of mind.",
      exploreButton: "Explore Our Network",
      aboutButton: "About TEIA",
      featuresTitle: "Why choose TEIA?",
      features: [
        {
          icon: ShieldCheckIcon,
          title: "Autism Friendly Certification",
          description: "Certified establishments prepared to welcome people with ASD",
          image: "https://images.unsplash.com/photo-1743873063757-eb59fa796e96"
        },
        {
          icon: MapPinIcon,
          title: "Selected Venues",
          description: "Restaurants and hotels with calm environments and trained staff",
          image: "https://images.unsplash.com/photo-1592830900828-d4bed9a36de8"
        },
        {
          icon: UserGroupIcon,
          title: "Active Community",
          description: "Reviews and tips from other families experiencing ASD",
          image: "https://images.unsplash.com/photo-1666593412929-005b60c67334"
        }
      ],
      statsTitle: "Our Community",
      establishmentsLabel: "Establishments",
      certifiedLabel: "Certified",
      familiesLabel: "Happy Families",
      featuredTitle: "Featured Establishments",
      viewAll: "View All",
      footerAbout: "About TEIA",
      footerAboutText: "TEIA is a platform dedicated to inclusive tourism in the Algarve, connecting families with establishments prepared to welcome people with ASD.",
      footerQuickLinks: "Quick Links",
      footerContact: "Contact",
      footerRights: "All rights reserved.",
      footerMadeWith: "Made with",
      footerFor: "for special families"
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
          className="bg-white border border-secondary-300 rounded-lg px-3 py-1 text-accessible-base focus:ring-2 focus:ring-primary-500 shadow-lg"
        >
          <option value="pt">🇵🇹 Português</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>

      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-gradient-to-br from-primary-50 to-autism-calm py-20 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1666593412929-005b60c67334)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/90 to-autism-calm/90"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-accessible-2xl md:text-5xl font-bold text-secondary-800 mb-6 shadow-text">
            {t.title}
          </h1>
          <p className="text-accessible-xl text-secondary-700 mb-4 max-w-2xl mx-auto font-medium">
            {t.subtitle}
          </p>
          <p className="text-accessible-base text-secondary-600 mb-8 max-w-3xl mx-auto bg-white/80 p-4 rounded-lg">
            {t.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/nossa-teia" className="btn btn-primary shadow-lg">
              {t.exploreButton}
              <ChevronRightIcon className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link href="/sobre-nos" className="btn btn-secondary shadow-lg">
              {t.aboutButton}
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

      {/* Features Section with Images */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-accessible-2xl font-bold text-center mb-12 text-secondary-800">
            {t.featuresTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.features.map((feature, index) => (
              <div key={index} className="card text-center overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative mb-6 overflow-hidden rounded-lg">
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <feature.icon className="absolute bottom-2 right-2 w-8 h-8 text-white bg-primary-600 p-1 rounded-full" />
                </div>
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
              href="/nossa-teia"
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
                  href={`/nossa-teia/${establishment.id}`}
                  className="btn btn-primary w-full mt-4"
                >
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="relative bg-secondary-800 text-white py-16"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1634681974664-d46e36f5c578)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-secondary-800/85"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-autism-friendly rounded-lg flex items-center justify-center mr-3">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-accessible-xl font-bold">TEIA</span>
              </div>
              <h3 className="text-accessible-lg font-semibold mb-3">{t.footerAbout}</h3>
              <p className="text-secondary-300 text-accessible-base leading-relaxed mb-4">
                {t.footerAboutText}
              </p>
              <div className="flex items-center text-secondary-300">
                <span className="mr-2">{t.footerMadeWith}</span>
                <HeartSolidIcon className="w-5 h-5 text-red-400 mx-1" />
                <span>{t.footerFor}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-accessible-lg font-semibold mb-4">{t.footerQuickLinks}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-secondary-300 hover:text-white transition-colors text-accessible-base">
                    Início
                  </Link>
                </li>
                <li>
                  <Link href="/sobre-nos" className="text-secondary-300 hover:text-white transition-colors text-accessible-base">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/nossa-teia" className="text-secondary-300 hover:text-white transition-colors text-accessible-base">
                    Nossa Teia
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="text-secondary-300 hover:text-white transition-colors text-accessible-base">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-accessible-lg font-semibold mb-4">{t.footerContact}</h3>
              <div className="space-y-3">
                <div className="flex items-center text-secondary-300">
                  <span className="text-accessible-base">+351 289 000 000</span>
                </div>
                <div className="flex items-center text-secondary-300">
                  <span className="text-accessible-base">info@teia-algarve.pt</span>
                </div>
                <div className="flex items-center text-secondary-300">
                  <span className="text-accessible-base">www.teia-algarve.pt</span>
                </div>
                <div className="flex items-center text-secondary-300">
                  <span className="text-accessible-base">Algarve, Portugal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-secondary-700 mt-12 pt-8 text-center">
            <p className="text-secondary-400 text-accessible-base">
              © 2025 TEIA - Algarve Autism Friendly. {t.footerRights}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}