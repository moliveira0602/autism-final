'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  StarIcon,
  ShieldCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'

// Dynamic import to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 lg:h-[500px] flex items-center justify-center bg-secondary-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-secondary-600">Carregando mapa...</p>
      </div>
    </div>
  )
})

interface Establishment {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  certified_autism_friendly: boolean;
  rating_average?: number;
  reviews_count?: number;
  accessibility_features: string[];
  sensory_info: {
    noise_level: string;
    lighting: string;
    visual_clarity: string;
  };
}

export default function NossaTeiaPage() {
  const { language } = useLanguage()
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: '',
    certified_only: false,
    rating_min: 0,
    accessibility: [] as string[]
  })

  // Reference for establishment cards
  const establishmentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Function to scroll to establishment when marker is clicked
  const handleMarkerClick = (establishmentId: string) => {
    const element = establishmentRefs.current[establishmentId]
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
      // Highlight the card briefly
      element.classList.add('ring-4', 'ring-primary-500')
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-primary-500')
      }, 3000)
    }
  }

  useEffect(() => {
    fetchEstablishments()
  }, [])

  useEffect(() => {
    filterEstablishments()
  }, [establishments, searchTerm, filters])

  const fetchEstablishments = async () => {
    try {
      const response = await fetch('/api/establishments')
      if (response.ok) {
        const data = await response.json()
        setEstablishments(data)
      } else {
        toast.error('Erro ao carregar estabelecimentos')
      }
    } catch (error) {
      console.error('Error fetching establishments:', error)
      toast.error('Erro ao carregar estabelecimentos')
    } finally {
      setLoading(false)
    }
  }

  const filterEstablishments = () => {
    let filtered = [...establishments]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(est => 
        est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(est => est.type === filters.type)
    }

    // Certified filter
    if (filters.certified_only) {
      filtered = filtered.filter(est => est.certified_autism_friendly)
    }

    // Rating filter
    if (filters.rating_min > 0) {
      filtered = filtered.filter(est => (est.rating_average || 0) >= filters.rating_min)
    }

    setFilteredEstablishments(filtered)
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      certified_only: false,
      rating_min: 0,
      accessibility: []
    })
    setSearchTerm('')
  }

  const getSensoryLevelColor = (level: string) => {
    const colors = {
      low: 'bg-green-400',
      medium: 'bg-yellow-400',
      high: 'bg-red-400'
    }
    return colors[level as keyof typeof colors] || 'bg-gray-400'
  }

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
      <Header />
      {/* Page Introduction */}
      <div className="bg-gradient-to-r from-primary-100 to-autism-calm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-4xl mx-auto px-6">
            <h1 className="text-accessible-2xl font-bold text-secondary-800 mb-4">
              {language === 'pt' 
                ? 'Estabelecimentos Autism Friendly no Algarve'
                : 'Autism Friendly Establishments in Algarve'
              }
            </h1>
            <p className="text-accessible-lg text-secondary-600 mb-6">
              {language === 'pt'
                ? 'Descubra locais preparados para receber pessoas com TEA e suas famílias. Explore o mapa interativo e encontre informações detalhadas sobre cada estabelecimento.'
                : 'Discover places prepared to welcome people with ASD and their families. Explore the interactive map and find detailed information about each establishment.'
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/70 px-3 py-1 rounded-full">
                <span className="text-green-600 font-bold">{establishments.filter(e => e.certified_autism_friendly).length}</span>
                <span>{language === 'pt' ? 'Certificados' : 'Certified'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 px-3 py-1 rounded-full">
                <span className="text-primary-600 font-bold">{establishments.length}</span>
                <span>{language === 'pt' ? 'Total de Locais' : 'Total Locations'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 px-3 py-1 rounded-full">
                <span className="text-secondary-600 font-bold">100%</span>
                <span>{language === 'pt' ? 'Gratuito' : 'Free'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map - Optimized Height */}
      <InteractiveMap 
        establishments={filteredEstablishments}
        onMarkerClick={handleMarkerClick}
      />

      {/* Search and Filter Section */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder={language === 'pt' ? 'Pesquisar estabelecimentos...' : 'Search establishments...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 pr-4 w-full"
                  aria-label={language === 'pt' ? 'Pesquisar estabelecimentos' : 'Search establishments'}
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary btn-with-icon"
                aria-expanded={showFilters}
                aria-controls="filters-panel"
              >
                <FunnelIcon className="w-5 h-5" />
                {language === 'pt' ? 'Filtros' : 'Filters'}
                {Object.values(filters).some(filter => 
                  filter !== '' && filter !== false && filter !== 0 && 
                  (Array.isArray(filter) ? filter.length > 0 : true)
                ) && (
                  <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    {language === 'pt' ? 'ativo' : 'active'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div id="filters-panel" className="bg-white border-b border-secondary-200">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tipo de Local
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="input w-full"
                >
                  <option value="">Todos os tipos</option>
                  <option value="restaurant">Restaurante</option>
                  <option value="hotel">Hotel</option>
                  <option value="attraction">Atração</option>
                  <option value="shop">Loja</option>
                </select>
              </div>

              {/* Certified Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Certificação
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.certified_only}
                    onChange={(e) => setFilters(prev => ({ ...prev, certified_only: e.target.checked }))}
                    className="mr-2"
                  />
                  Apenas certificados
                </label>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Avaliação Mínima
                </label>
                <select
                  value={filters.rating_min}
                  onChange={(e) => setFilters(prev => ({ ...prev, rating_min: parseInt(e.target.value) }))}
                  className="input w-full"
                >
                  <option value={0}>Qualquer avaliação</option>
                  <option value={3}>3+ estrelas</option>
                  <option value={4}>4+ estrelas</option>
                  <option value={5}>5 estrelas</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="btn btn-outline w-full"
                >
                  <XMarkIcon className="w-4 h-4 mr-2" />
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Establishments List Section */}
      <div className="bg-secondary-50">
        <div className="container mx-auto px-4 py-8">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-secondary-600 text-accessible-base">
              {filteredEstablishments.length} {language === 'pt' 
                ? `estabelecimento${filteredEstablishments.length !== 1 ? 's' : ''} encontrado${filteredEstablishments.length !== 1 ? 's' : ''}`
                : `establishment${filteredEstablishments.length !== 1 ? 's' : ''} found`
              }
            </p>
          </div>

          {/* Establishments Grid - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEstablishments.map((establishment) => (
              <div 
                key={establishment.id} 
                ref={(el) => { establishmentRefs.current[establishment.id] = el }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-accessible-lg font-bold text-secondary-800 mb-1">
                      {establishment.name}
                    </h3>
                    <p className="text-secondary-600 text-accessible-sm mb-2">
                      {establishment.type} • {establishment.address}
                    </p>
                  </div>
                  {establishment.certified_autism_friendly && (
                    <div className="flex items-center bg-autism-friendly text-white px-3 py-1 rounded-full text-accessible-xs">
                      <ShieldCheckIcon className="w-4 h-4 mr-1" />
                      Certificado
                    </div>
                  )}
                </div>

                <p className="text-secondary-700 text-accessible-base mb-4">
                  {establishment.description}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon 
                        key={star}
                        className={`w-5 h-5 ${
                          star <= (establishment.rating_average || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-secondary-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-accessible-sm text-secondary-600">
                      ({establishment.reviews_count || 0} {language === 'pt' ? 'avaliações' : 'reviews'})
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                  <Link
                    href={`/nossa-teia/${establishment.id}`}
                    className="btn btn-primary w-full"
                  >
                    {language === 'pt' ? 'Ver Detalhes' : 'See Details'}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredEstablishments.length === 0 && (
            <div className="text-center py-12">
              <MapPinIcon className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-accessible-lg font-medium text-secondary-800 mb-2">
                Nenhum estabelecimento encontrado
              </h3>
              <p className="text-secondary-600 text-accessible-base mb-4">
                Tente ajustar os filtros ou fazer uma nova pesquisa
              </p>
              <button
                onClick={clearFilters}
                className="btn btn-secondary"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}