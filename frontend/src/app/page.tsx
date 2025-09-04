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
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Footer from '@/components/Footer'
import PartnersCarousel from '@/components/PartnersCarousel'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'

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
  const { language, t } = useLanguage()
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

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-gradient-to-br from-primary-50 to-autism-calm py-20 overflow-hidden mt-16"
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
            {t('homeTitle')}
          </h1>
          <p className="text-accessible-xl text-secondary-700 mb-4 max-w-2xl mx-auto font-medium">
            {t('homeSubtitle')}
          </p>
          <p className="text-accessible-base text-secondary-600 mb-8 max-w-3xl mx-auto bg-white/80 p-4 rounded-lg">
            {t('homeDescription')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/nossa-teia" className="btn btn-primary shadow-lg">
              {t('exploreButton')}
              <ChevronRightIcon className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link href="/sobre-nos" className="btn btn-secondary shadow-lg">
              {t('aboutButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* About TEIA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-25 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            
            {/* Left Side - Image */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1609253925210-c64083102ae5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxkaXZlcnNlJTIwZmFtaWx5fGVufDB8fHx8MTc1NzAxMzk1NXww&ixlib=rb-4.1.0&q=85"
                  alt={language === 'pt' ? 'Família diversa e inclusiva aproveitando momentos juntos ao ar livre' : 'Diverse and inclusive family enjoying moments together outdoors'}
                  className="w-full h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-transparent"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2">
                    <HeartSolidIcon className="w-5 h-5 text-pink-500" />
                    <span className="text-sm font-semibold text-secondary-700">
                      {language === 'pt' ? 'Inclusão' : 'Inclusion'}
                    </span>
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-autism-friendly/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-5 h-5 text-white" />
                    <span className="text-sm font-semibold text-white">
                      {language === 'pt' ? 'Certificado' : 'Certified'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary-200/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-autism-friendly/20 rounded-full blur-2xl"></div>
            </div>
            
            {/* Right Side - Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-1 bg-gradient-to-r from-primary-600 to-autism-friendly rounded-full"></div>
                  <span className="text-primary-600 font-semibold text-accessible-base uppercase tracking-wider">
                    {language === 'pt' ? 'Sobre a TEIA' : 'About TEIA'}
                  </span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-secondary-800 leading-tight">
                  {language === 'pt' 
                    ? 'Conectamos famílias a experiências turísticas verdadeiramente inclusivas'
                    : 'We connect families to truly inclusive tourism experiences'
                  }
                </h2>
              </div>
              
              <div className="space-y-4 text-accessible-lg text-secondary-600 leading-relaxed">
                <p>
                  {language === 'pt'
                    ? 'A TEIA nasceu da necessidade de criar uma ponte entre famílias com pessoas com TEA e estabelecimentos preparados para oferecer experiências verdadeiramente acessíveis no Algarve.'
                    : 'TEIA was born from the need to create a bridge between families with people with ASD and establishments prepared to offer truly accessible experiences in the Algarve.'
                  }
                </p>
                
                <p>
                  {language === 'pt'
                    ? 'Cada local em nossa rede passou por um rigoroso processo de certificação, garantindo que sua família encontre ambientes preparados, equipes treinadas e experiências adaptadas às necessidades únicas de cada pessoa.'
                    : 'Each location in our network has gone through a rigorous certification process, ensuring that your family finds prepared environments, trained staff and experiences adapted to each person\'s unique needs.'
                  }
                </p>
              </div>
              
              {/* Key Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-800 mb-1">
                      {language === 'pt' ? 'Certificação Rigorosa' : 'Rigorous Certification'}
                    </h4>
                    <p className="text-accessible-sm text-secondary-600">
                      {language === 'pt' ? 'Todos os locais são avaliados' : 'All locations are evaluated'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-800 mb-1">
                      {language === 'pt' ? 'Comunidade Ativa' : 'Active Community'}
                    </h4>
                    <p className="text-accessible-sm text-secondary-600">
                      {language === 'pt' ? 'Famílias compartilham experiências' : 'Families share experiences'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="pt-6">
                <Link 
                  href="/sobre-nos" 
                  className="inline-flex items-center bg-gradient-to-r from-primary-600 to-autism-friendly text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {language === 'pt' ? 'Conheça Nossa História' : 'Learn Our Story'}
                  <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-accessible-2xl font-bold mb-16 text-secondary-800">
            {language === 'pt' ? 'Nossa Comunidade' : 'Our Community'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Establishments Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 group border border-primary-100">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-autism-friendly rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <MapPinIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-200 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-autism-friendly/30 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="text-4xl font-black text-primary-600 mb-3 group-hover:scale-105 transition-transform">
                {stats.total_establishments}
              </div>
              
              <div className="text-accessible-lg text-secondary-700 font-semibold mb-2">
                {language === 'pt' ? 'Estabelecimentos' : 'Establishments'}
              </div>
              
              <div className="text-accessible-sm text-secondary-500 leading-relaxed">
                {language === 'pt' ? 'Locais parceiros no Algarve' : 'Partner locations in Algarve'}
              </div>
              
              <div className="mt-4 w-12 h-1 bg-gradient-to-r from-primary-400 to-autism-friendly rounded-full mx-auto group-hover:w-16 transition-all duration-300"></div>
            </div>
            
            {/* Certified Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 group border border-green-100">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-autism-friendly via-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <ShieldCheckIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-200 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-autism-friendly/30 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="text-4xl font-black text-autism-friendly mb-3 group-hover:scale-105 transition-transform">
                {stats.certified_count}
              </div>
              
              <div className="text-accessible-lg text-secondary-700 font-semibold mb-2">
                {language === 'pt' ? 'Certificados' : 'Certified'}
              </div>
              
              <div className="text-accessible-sm text-secondary-500 leading-relaxed">
                {language === 'pt' ? 'Autism Friendly aprovados' : 'Autism Friendly approved'}
              </div>
              
              <div className="mt-4 w-12 h-1 bg-gradient-to-r from-autism-friendly to-green-500 rounded-full mx-auto group-hover:w-16 transition-all duration-300"></div>
            </div>
            
            {/* Happy Families Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 group border border-pink-100">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <HeartSolidIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-200 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-red-300/30 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="text-4xl font-black text-pink-600 mb-3 group-hover:scale-105 transition-transform">
                {stats.happy_families}
              </div>
              
              <div className="text-accessible-lg text-secondary-700 font-semibold mb-2">
                {language === 'pt' ? 'Famílias Felizes' : 'Happy Families'}
              </div>
              
              <div className="text-accessible-sm text-secondary-500 leading-relaxed">
                {language === 'pt' ? 'Experiências positivas' : 'Positive experiences'}
              </div>
              
              <div className="mt-4 w-12 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mx-auto group-hover:w-16 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Images */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-accessible-2xl font-bold text-center mb-12 text-secondary-800">
            {language === 'pt' ? 'Por que escolher a TEIA?' : 'Why choose TEIA?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1743873063757-eb59fa796e96"
                  alt={language === 'pt' ? 'Certificação Autism Friendly' : 'Autism Friendly Certification'}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheckIcon className="w-6 h-6 text-autism-friendly" />
                  </div>
                </div>
              </div>
              <h3 className="text-accessible-xl font-semibold mb-3 text-secondary-800">
                {language === 'pt' ? 'Certificação Autism Friendly' : 'Autism Friendly Certification'}
              </h3>
              <p className="text-secondary-600 text-accessible-base leading-relaxed">
                {language === 'pt' 
                  ? 'Estabelecimentos certificados e preparados para receber pessoas com TEA'
                  : 'Certified establishments prepared to welcome people with ASD'
                }
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1592830900828-d4bed9a36de8"
                  alt={language === 'pt' ? 'Locais Selecionados' : 'Selected Venues'}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center mx-auto">
                    <MapPinIcon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
              <h3 className="text-accessible-xl font-semibold mb-3 text-secondary-800">
                {language === 'pt' ? 'Locais Selecionados' : 'Selected Venues'}
              </h3>
              <p className="text-secondary-600 text-accessible-base leading-relaxed">
                {language === 'pt' 
                  ? 'Restaurantes e hotéis com ambientes tranquilos e equipe treinada'
                  : 'Restaurants and hotels with calm environments and trained staff'
                }
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1666593412929-005b60c67334"
                  alt={language === 'pt' ? 'Comunidade Ativa' : 'Active Community'}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center mx-auto">
                    <UserGroupIcon className="w-6 h-6 text-secondary-600" />
                  </div>
                </div>
              </div>
              <h3 className="text-accessible-xl font-semibold mb-3 text-secondary-800">
                {language === 'pt' ? 'Comunidade Ativa' : 'Active Community'}
              </h3>
              <p className="text-secondary-600 text-accessible-base leading-relaxed">
                {language === 'pt' 
                  ? 'Avaliações e dicas de outras famílias que vivenciam o TEA'
                  : 'Reviews and tips from other families experiencing ASD'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Carousel */}
      <PartnersCarousel />

      {/* Featured Establishments */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-accessible-2xl font-bold text-secondary-800">
              {language === 'pt' ? 'Estabelecimentos em Destaque' : 'Featured Establishments'}
            </h2>
            <Link 
              href="/nossa-teia"
              className="text-primary-600 hover:text-primary-700 font-medium text-accessible-base"
            >
              {language === 'pt' ? 'Ver Todos' : 'View All'} →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEstablishments.map((establishment) => (
              <div key={establishment.id} className="card hover:shadow-lg transition-shadow overflow-hidden">
                {establishment.images.length > 0 && (
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img 
                      src={`data:image/jpeg;base64,${establishment.images[0]}`}
                      alt={establishment.name}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {establishment.certified_autism_friendly && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full flex items-center text-xs font-medium">
                          <ShieldCheckIcon className="w-4 h-4 mr-1" />
                          Certificado
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-accessible-lg font-semibold text-secondary-800 line-clamp-2 flex-1">
                      {establishment.name}
                    </h3>
                  </div>
                  
                  <p className="text-secondary-600 text-accessible-base line-clamp-3 min-h-[4.5rem]">
                    {establishment.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 text-secondary-500 mr-2 flex-shrink-0" />
                      <span className="text-accessible-sm text-secondary-500 truncate">
                        {establishment.address.split(',')[0]}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-500 mr-1 fill-current flex-shrink-0" />
                        <span className="text-accessible-sm font-medium">
                          {establishment.autism_rating.toFixed(1)} TEA Rating
                        </span>
                      </div>
                      
                      {establishment.accessibility_features.length > 0 && (
                        <div className="flex items-center text-accessible-sm text-green-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          {establishment.accessibility_features.length} recursos
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-secondary-100">
                    <Link 
                      href={`/nossa-teia/${establishment.id}`}
                      className="btn btn-primary w-full text-center"
                    >
                      Ver Detalhes Completos
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  )
}