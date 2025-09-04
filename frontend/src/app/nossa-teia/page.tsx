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
  id: string
  name: string
  type: string
  description: string
  address: string
  certified_autism_friendly: boolean
  autism_rating: number
  accessibility_features: string[]
  images: string[]
  coordinates: { lat: number; lng: number }
}

const ESTABLISHMENT_TYPES = {
  hotel: 'Hotel',
  restaurant: 'Restaurante',
  attraction: 'Atração',
  event: 'Evento',
  shopping: 'Compras',
  transport: 'Transporte'
}

const ACCESSIBILITY_FEATURES = {
  quiet_spaces: 'Espaços Silenciosos',
  sensory_rooms: 'Salas Sensoriais',
  low_lighting: 'Iluminação Reduzida',
  trained_staff: 'Equipe Treinada',
  visual_schedules: 'Horários Visuais',
  noise_reduction: 'Redução de Ruído',
  calm_environment: 'Ambiente Calmo',
  flexible_timing: 'Horários Flexíveis'
}

export default function NossaTeiaPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: '',
    certifiedOnly: false,
    minRating: 0,
    features: [] as string[]
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
    applyFilters()
  }, [establishments, searchTerm, filters])

  const fetchEstablishments = async () => {
    try {
      setLoading(true)
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

  const applyFilters = () => {
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

    // Certified only filter
    if (filters.certifiedOnly) {
      filtered = filtered.filter(est => est.certified_autism_friendly)
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(est => est.autism_rating >= filters.minRating)
    }

    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(est =>
        filters.features.every(feature => est.accessibility_features.includes(feature))
      )
    }

    setFilteredEstablishments(filtered)
  }

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      certifiedOnly: false,
      minRating: 0,
      features: []
    })
    setSearchTerm('')
  }

  const getSensoryLevelColor = (level: string) => {
    const colors = {
      'very_low': 'bg-green-400',
      'low': 'bg-green-300',
      'moderate': 'bg-yellow-400',
      'high': 'bg-orange-400',
      'very_high': 'bg-red-400'
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
      {/* Page Introduction */}
      <div className="bg-gradient-to-r from-primary-100 to-autism-calm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-4xl mx-auto px-6">
            <h1 className="text-accessible-2xl font-bold text-secondary-800 mb-4">
              Estabelecimentos Autism Friendly no Algarve
            </h1>
            <p className="text-accessible-lg text-secondary-600 mb-6">
              Descubra locais preparados para receber pessoas com TEA e suas famílias. 
              Explore o mapa interativo e encontre informações detalhadas sobre cada estabelecimento.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/70 px-3 py-1 rounded-full">
                <span className="text-green-600 font-bold">{establishments.filter(e => e.certified_autism_friendly).length}</span>
                <span>Certificados</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 px-3 py-1 rounded-full">
                <span className="text-primary-600 font-bold">{establishments.length}</span>
                <span>Total de Locais</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 px-3 py-1 rounded-full">
                <span className="text-secondary-600 font-bold">100%</span>
                <span>Gratuito</span>
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
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Pesquisar estabelecimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 pr-4 w-full"
                  aria-label="Pesquisar estabelecimentos"
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
                Filtros
                {Object.values(filters).some(filter => 
                  filter !== '' && filter !== false && filter !== 0 && 
                  (Array.isArray(filter) ? filter.length > 0 : true)
                ) && (
                  <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    ativo
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-secondary-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">

      {/* Filter Panel */}
        {showFilters && (
          <div className="card border-l-4 border-l-primary-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-accessible-lg font-semibold text-secondary-800">Filtros</h3>
              <button
                onClick={clearFilters}
                className="text-secondary-500 hover:text-secondary-700 text-accessible-sm"
              >
                Limpar Todos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Type Filter */}
              <div>
                <label className="label">Tipo de Estabelecimento</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="input"
                >
                  <option value="">Todos os tipos</option>
                  {Object.entries(ESTABLISHMENT_TYPES).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Certified Only */}
              <div>
                <label className="label">Certificação</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.certifiedOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, certifiedOnly: e.target.checked }))}
                    className="mr-2 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-accessible-base text-secondary-700">
                    Apenas certificados
                  </span>
                  <ShieldCheckIcon className="w-4 h-4 ml-1 text-green-600" />
                </label>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="label">Avaliação Mínima</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                  className="input"
                >
                  <option value={0}>Todas as avaliações</option>
                  <option value={3}>3+ estrelas</option>
                  <option value={4}>4+ estrelas</option>
                  <option value={4.5}>4.5+ estrelas</option>
                </select>
              </div>

              {/* Features Filter */}
              <div>
                <label className="label">Recursos de Acessibilidade</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {Object.entries(ACCESSIBILITY_FEATURES).map(([value, label]) => (
                    <label key={value} className="flex items-center text-accessible-sm">
                      <input
                        type="checkbox"
                        checked={filters.features.includes(value)}
                        onChange={() => handleFeatureToggle(value)}
                        className="mr-2 w-3 h-3 text-primary-600 rounded focus:ring-primary-500"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-accessible-base text-secondary-600">
          {filteredEstablishments.length} estabelecimento{filteredEstablishments.length !== 1 ? 's' : ''} encontrado{filteredEstablishments.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Establishments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEstablishments.map((establishment) => (
          <div 
            key={establishment.id} 
            ref={(el) => { establishmentRefs.current[establishment.id] = el }}
            className="card hover:shadow-lg transition-shadow"
          >
            {establishment.images.length > 0 && (
              <img
                src={`data:image/jpeg;base64,${establishment.images[0]}`}
                alt={establishment.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-accessible-lg font-semibold text-secondary-800 mb-1">
                  {establishment.name}
                </h3>
                <span className="inline-block bg-secondary-100 text-secondary-700 px-2 py-1 rounded text-accessible-sm">
                  {ESTABLISHMENT_TYPES[establishment.type as keyof typeof ESTABLISHMENT_TYPES]}
                </span>
              </div>
              {establishment.certified_autism_friendly && (
                <ShieldCheckIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
              )}
            </div>

            <p className="text-secondary-600 text-accessible-base mb-3 line-clamp-2">
              {establishment.description}
            </p>

            <div className="flex items-center mb-3">
              <MapPinIcon className="w-4 h-4 text-secondary-500 mr-1 flex-shrink-0" />
              <span className="text-accessible-sm text-secondary-500 truncate">
                {establishment.address}
              </span>
            </div>

            {/* Accessibility Features */}
            {establishment.accessibility_features.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {establishment.accessibility_features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="text-xs bg-autism-friendly text-secondary-700 px-2 py-1 rounded"
                    >
                      {ACCESSIBILITY_FEATURES[feature as keyof typeof ACCESSIBILITY_FEATURES] || feature}
                    </span>
                  ))}
                  {establishment.accessibility_features.length > 3 && (
                    <span className="text-xs text-secondary-500">
                      +{establishment.accessibility_features.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                <span className="text-accessible-sm font-medium">
                  {establishment.autism_rating.toFixed(1)}
                </span>
                <span className="text-accessible-sm text-secondary-500 ml-1">
                  TEA Rating
                </span>
              </div>
            </div>

            <Link
              href={`/nossa-teia/${establishment.id}`}
              className="btn btn-primary w-full"
            >
              Ver Detalhes
            </Link>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEstablishments.length === 0 && !loading && (
        <div className="text-center py-12">
          <MapPinIcon className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-accessible-xl font-semibold text-secondary-600 mb-2">
            Nenhum estabelecimento encontrado
          </h3>
          <p className="text-accessible-base text-secondary-500 mb-4">
            Tente ajustar os filtros ou fazer uma nova pesquisa
          </p>
          <button
            onClick={clearFilters}
            className="btn btn-primary"
          >
            Limpar Filtros
          </button>
        </div>
      )}
      </div>

      <Footer />
    </div>
  )
}