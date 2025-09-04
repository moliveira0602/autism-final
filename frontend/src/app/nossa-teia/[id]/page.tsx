'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ClockIcon,
  StarIcon,
  ShieldCheckIcon,
  CameraIcon,
  InformationCircleIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface Establishment {
  id: string
  name: string
  type: string
  description: string
  address: string
  coordinates: { lat: number; lng: number }
  accessibility_features: string[]
  certified_autism_friendly: boolean
  contact_info: { [key: string]: string }
  opening_hours: { [key: string]: string }
  special_hours: string[]
  sensory_info: { [key: string]: any }
  reviews: Review[]
  average_rating: number
  autism_rating: number
  images: string[]
}

interface Review {
  user_id: string
  rating: number
  noise_level: string
  lighting_level: string
  visual_clarity: string
  staff_helpfulness: number
  calm_areas_available: boolean
  comment: string
  created_at: string
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

const DAYS_OF_WEEK = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo'
}

const SENSORY_LEVELS = {
  very_low: { label: 'Muito Baixo', color: 'text-green-600 bg-green-50', icon: '🟢' },
  low: { label: 'Baixo', color: 'text-green-500 bg-green-50', icon: '🟢' },
  moderate: { label: 'Moderado', color: 'text-yellow-600 bg-yellow-50', icon: '🟡' },
  high: { label: 'Alto', color: 'text-orange-600 bg-orange-50', icon: '🟠' },
  very_high: { label: 'Muito Alto', color: 'text-red-600 bg-red-50', icon: '🔴' }
}

export default function EstablishmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchEstablishment(params.id as string)
    }
  }, [params.id])

  const fetchEstablishment = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/establishments/${id}`)
      if (response.ok) {
        const data = await response.json()
        setEstablishment(data)
      } else if (response.status === 404) {
        toast.error('Estabelecimento não encontrado')
        router.push('/nossa-teia')
      } else {
        toast.error('Erro ao carregar estabelecimento')
      }
    } catch (error) {
      console.error('Error fetching establishment:', error)
      toast.error('Erro ao carregar estabelecimento')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
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

  if (!establishment) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-accessible-2xl font-bold text-secondary-800 mb-4">
          Estabelecimento não encontrado
        </h1>
        <button
          onClick={() => router.push('/nossa-teia')}
          className="btn btn-primary"
        >
          Voltar à Nossa Teia
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section com Galeria de Imagens */}
      <section className="relative">
        {establishment.images.length > 0 ? (
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            {/* Main Image */}
            <img
              src={`data:image/jpeg;base64,${establishment.images[selectedImage]}`}
              alt={establishment.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
            
            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-accessible-sm">
              {selectedImage + 1} / {establishment.images.length}
            </div>
            
            {/* Navigation Arrows */}
            {establishment.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : establishment.images.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => setSelectedImage(selectedImage < establishment.images.length - 1 ? selectedImage + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  →
                </button>
              </>
            )}
            
            {/* Thumbnail Gallery */}
            {establishment.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto">
                {establishment.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-white scale-110' : 'border-white/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={`data:image/jpeg;base64,${establishment.images[index]}`}
                      alt={`${establishment.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Title Overlay */}
            <div className="absolute bottom-20 left-8 right-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-accessible-2xl md:text-4xl font-bold mb-3 shadow-text">
                    {establishment.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-accessible-base font-medium">
                      {ESTABLISHMENT_TYPES[establishment.type as keyof typeof ESTABLISHMENT_TYPES]}
                    </span>
                    {establishment.certified_autism_friendly && (
                      <div className="flex items-center bg-green-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                        <ShieldCheckIcon className="w-5 h-5 mr-2" />
                        <span className="text-accessible-base font-medium">Certificado Autism Friendly</span>
                      </div>
                    )}
                    <div className="flex items-center bg-yellow-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <StarIcon className="w-5 h-5 mr-2 fill-current" />
                      <span className="text-accessible-base font-bold">{establishment.autism_rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={toggleFavorite}
                  className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors ml-4"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-7 h-7 text-red-500" />
                  ) : (
                    <HeartIcon className="w-7 h-7" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary-50 to-autism-calm py-20">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-accessible-2xl md:text-4xl font-bold text-secondary-800 mb-4">
                    {establishment.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-white px-4 py-2 rounded-full text-accessible-base text-secondary-700 font-medium">
                      {ESTABLISHMENT_TYPES[establishment.type as keyof typeof ESTABLISHMENT_TYPES]}
                    </span>
                    {establishment.certified_autism_friendly && (
                      <div className="flex items-center bg-green-100 px-4 py-2 rounded-full">
                        <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-600" />
                        <span className="text-accessible-base text-green-700 font-medium">Certificado Autism Friendly</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={toggleFavorite}
                  className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-secondary-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descrição e Informações Principais */}
            <div className="card">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-accessible-xl font-semibold mb-4 text-secondary-800">
                    Sobre este Local
                  </h2>
                  <p className="text-accessible-base text-secondary-600 leading-relaxed mb-6">
                    {establishment.description}
                  </p>
                  
                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center bg-primary-50 p-4 rounded-lg">
                      <StarSolidIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-secondary-800">
                        {establishment.average_rating.toFixed(1)}
                      </div>
                      <p className="text-accessible-sm text-secondary-600">Avaliação Geral</p>
                    </div>
                    
                    <div className="text-center bg-autism-calm p-4 rounded-lg">
                      <ShieldCheckIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-secondary-800">
                        {establishment.autism_rating.toFixed(1)}
                      </div>
                      <p className="text-accessible-sm text-secondary-600">Rating TEA</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-accessible-lg font-semibold mb-4 text-secondary-800">
                    Destaques do Local
                  </h3>
                  
                  <div className="space-y-4">
                    {establishment.certified_autism_friendly && (
                      <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <ShieldCheckIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-green-800">Certificação Autism Friendly</p>
                          <p className="text-accessible-sm text-green-600">Estabelecimento oficialmente certificado</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <InformationCircleIcon className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-800">Recursos de Acessibilidade</p>
                        <p className="text-accessible-sm text-blue-600">
                          {establishment.accessibility_features.length} recursos disponíveis
                        </p>
                      </div>
                    </div>
                    
                    {establishment.special_hours.length > 0 && (
                      <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <ClockIcon className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-purple-800">Horários Especiais</p>
                          <p className="text-accessible-sm text-purple-600">
                            {establishment.special_hours.length} horários autism-friendly
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <ChatBubbleLeftIcon className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-orange-800">Avaliações da Comunidade</p>
                        <p className="text-accessible-sm text-orange-600">
                          {establishment.reviews.length} avaliações de visitantes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recursos de Acessibilidade */}
            <div className="card">
              <h2 className="text-accessible-xl font-semibold mb-4 text-secondary-800">
                Recursos de Acessibilidade
              </h2>
              
              {establishment.accessibility_features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {establishment.accessibility_features.map((feature) => (
                    <div key={feature} className="flex items-center p-3 bg-autism-friendly rounded-lg">
                      <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-accessible-base text-secondary-700">
                        {ACCESSIBILITY_FEATURES[feature as keyof typeof ACCESSIBILITY_FEATURES] || feature}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary-500 italic">
                  Nenhum recurso de acessibilidade especificado
                </p>
              )}
            </div>

            {/* Informações Sensoriais */}
            {establishment.sensory_info && Object.keys(establishment.sensory_info).length > 0 && (
              <div className="card">
                <h2 className="text-accessible-xl font-semibold mb-4 text-secondary-800">
                  Informações Sensoriais
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(establishment.sensory_info).map(([key, value]) => (
                    <div key={key} className="bg-secondary-50 p-4 rounded-lg">
                      <h3 className="font-medium text-secondary-800 mb-2 capitalize">
                        {key.replace('_', ' ')}
                      </h3>
                      <p className="text-accessible-sm text-secondary-600">
                        {String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Horários Especiais */}
            {establishment.special_hours.length > 0 && (
              <div className="card">
                <h2 className="text-accessible-xl font-semibold mb-4 text-secondary-800">
                  Horários Especiais Autism Friendly
                </h2>
                
                <div className="bg-autism-calm p-4 rounded-lg">
                  <div className="flex items-start">
                    <InformationCircleIcon className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <ul className="space-y-2">
                        {establishment.special_hours.map((hour, index) => (
                          <li key={index} className="text-accessible-base text-secondary-700">
                            {hour}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Avaliações */}
            <div className="card">
              <h2 className="text-accessible-xl font-semibold mb-4 text-secondary-800">
                Avaliações da Comunidade
              </h2>
              
              {establishment.reviews.length > 0 ? (
                <div className="space-y-6">
                  {establishment.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="border-b border-secondary-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarSolidIcon
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? 'text-yellow-500' : 'text-secondary-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-accessible-sm text-secondary-600">
                            {new Date(review.created_at).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="text-center">
                          <div className="text-accessible-sm text-secondary-500">Ruído</div>
                          <div className={`text-xs px-2 py-1 rounded ${SENSORY_LEVELS[review.noise_level as keyof typeof SENSORY_LEVELS]?.color}`}>
                            {SENSORY_LEVELS[review.noise_level as keyof typeof SENSORY_LEVELS]?.icon}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-accessible-sm text-secondary-500">Iluminação</div>
                          <div className={`text-xs px-2 py-1 rounded ${SENSORY_LEVELS[review.lighting_level as keyof typeof SENSORY_LEVELS]?.color}`}>
                            {SENSORY_LEVELS[review.lighting_level as keyof typeof SENSORY_LEVELS]?.icon}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-accessible-sm text-secondary-500">Clareza Visual</div>
                          <div className={`text-xs px-2 py-1 rounded ${SENSORY_LEVELS[review.visual_clarity as keyof typeof SENSORY_LEVELS]?.color}`}>
                            {SENSORY_LEVELS[review.visual_clarity as keyof typeof SENSORY_LEVELS]?.icon}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-accessible-sm text-secondary-500">Áreas Calmas</div>
                          <div className="text-xs">
                            {review.calm_areas_available ? '✅' : '❌'}
                          </div>
                        </div>
                      </div>
                      
                      {review.comment && (
                        <p className="text-accessible-base text-secondary-600 italic">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                  
                  <div className="text-center">
                    <p className="text-accessible-sm text-secondary-500 mb-4">
                      Mostrando {Math.min(3, establishment.reviews.length)} de {establishment.reviews.length} avaliações
                    </p>
                    <button className="btn btn-secondary">
                      <ChatBubbleLeftIcon className="w-5 h-5 mr-2" />
                      Fazer Login para Avaliar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <ChatBubbleLeftIcon className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                  <p className="text-secondary-500 mb-4">
                    Este estabelecimento ainda não tem avaliações
                  </p>
                  <button className="btn btn-primary">
                    Seja o primeiro a avaliar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações de Contacto */}
            <div className="card">
              <h3 className="text-accessible-lg font-semibold mb-4 text-secondary-800">
                Informações de Contacto
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-secondary-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-accessible-base text-secondary-700 font-medium">Morada</p>
                    <p className="text-accessible-sm text-secondary-600">{establishment.address}</p>
                  </div>
                </div>
                
                {establishment.contact_info.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-secondary-500 mr-3" />
                    <div>
                      <p className="text-accessible-base text-secondary-700 font-medium">Telefone</p>
                      <a href={`tel:${establishment.contact_info.phone}`} 
                         className="text-accessible-sm text-primary-600 hover:underline">
                        {establishment.contact_info.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {establishment.contact_info.email && (
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-5 h-5 text-secondary-500 mr-3" />
                    <div>
                      <p className="text-accessible-base text-secondary-700 font-medium">Email</p>
                      <a href={`mailto:${establishment.contact_info.email}`}
                         className="text-accessible-sm text-primary-600 hover:underline">
                        {establishment.contact_info.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {establishment.contact_info.website && (
                  <div className="flex items-center">
                    <GlobeAltIcon className="w-5 h-5 text-secondary-500 mr-3" />
                    <div>
                      <p className="text-accessible-base text-secondary-700 font-medium">Website</p>
                      <a href={establishment.contact_info.website} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-accessible-sm text-primary-600 hover:underline">
                        Visitar Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Horários de Funcionamento */}
            {establishment.opening_hours && Object.keys(establishment.opening_hours).length > 0 && (
              <div className="card">
                <h3 className="text-accessible-lg font-semibold mb-4 text-secondary-800">
                  <ClockIcon className="w-5 h-5 inline mr-2" />
                  Horários de Funcionamento
                </h3>
                
                <div className="space-y-2">
                  {Object.entries(DAYS_OF_WEEK).map(([dayKey, dayLabel]) => (
                    <div key={dayKey} className="flex justify-between items-center">
                      <span className="text-accessible-sm text-secondary-600">{dayLabel}</span>
                      <span className="text-accessible-sm font-medium text-secondary-800">
                        {establishment.opening_hours[dayKey] || 'Fechado'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="card bg-gradient-to-br from-primary-50 to-autism-calm">
              <h3 className="text-accessible-lg font-semibold mb-3 text-secondary-800">
                Gostou deste local?
              </h3>
              <p className="text-accessible-sm text-secondary-600 mb-4">
                Faça login ou registe-se para avaliar e partilhar a sua experiência com a comunidade.
              </p>
              <div className="space-y-2">
                <button className="btn btn-primary w-full">
                  <StarIcon className="w-5 h-5 mr-2" />
                  Avaliar Local
                </button>
                <button className="btn btn-secondary w-full">
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Partilhar Fotos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}