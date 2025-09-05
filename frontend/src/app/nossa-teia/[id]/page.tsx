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
  ChatBubbleLeftIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ReviewModal from '@/components/ReviewModal'
import { useLanguage } from '@/contexts/LanguageContext'

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
  const { language } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    noise_rating: 3,
    lighting_rating: 3,
    staff_rating: 5,
    calm_areas_rating: 4
  })

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for review submission
    toast.success('Avaliação enviada com sucesso!')
    setShowReviewModal(false)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      toast.success(`${files.length} foto(s) selecionada(s) para partilha`)
      setShowPhotoModal(false)
    }
  }

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
        
        // Buscar avaliações aprovadas para este estabelecimento
        await fetchReviews(id)
      } else if (response.status === 404) {
        toast.error(language === 'pt' ? 'Estabelecimento não encontrado' : 'Establishment not found')
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

  const fetchReviews = async (establishmentId: string) => {
    try {
      const response = await fetch(`/api/establishments/${establishmentId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      } else {
        console.error('Error fetching reviews:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
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
          {language === 'pt' ? 'Estabelecimento não encontrado' : 'Establishment not found'}
        </h1>
        <button
          onClick={() => router.push('/nossa-teia')}
          className="btn btn-primary"
        >
          {language === 'pt' ? 'Voltar à Nossa Teia' : 'Back to Our Network'}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section com Galeria de Imagens */}
      <section className="relative mt-16">
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
                        <span className="text-accessible-base font-medium">
                          {language === 'pt' ? 'Certificado Autism Friendly' : 'Autism Friendly Certified'}
                        </span>
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
                        <span className="text-accessible-base text-green-700 font-medium">
                          {language === 'pt' ? 'Certificado Autism Friendly' : 'Autism Friendly Certified'}
                        </span>
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
                    {language === 'pt' ? 'Sobre este Local' : 'About this Location'}
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
                        <p className="font-medium text-blue-800">
                          {language === 'pt' ? 'Recursos de Acessibilidade' : 'Accessibility Resources'}
                        </p>
                        <p className="text-accessible-sm text-blue-600">
                          {establishment.accessibility_features.length} {language === 'pt' ? 'recursos disponíveis' : 'resources available'}
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
                {language === 'pt' ? 'Recursos de Acessibilidade' : 'Accessibility Resources'}
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
                  {language === 'pt' ? 'Informações Sensoriais' : 'Sensory Information'}
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

            {/* Avaliações da Comunidade */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-accessible-xl font-semibold text-secondary-800 flex items-center">
                  <ChatBubbleLeftIcon className="w-6 h-6 mr-3 text-primary-600" />
                  Avaliações da Comunidade
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-800">{establishment.reviews.length}</div>
                    <div className="text-accessible-sm text-secondary-600">Avaliações</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{establishment.average_rating.toFixed(1)}</div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarSolidIcon
                          key={star}
                          className={`w-4 h-4 ${
                            star <= establishment.average_rating ? 'text-yellow-500' : 'text-secondary-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reviews Section */}
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-accessible-xl font-semibold text-secondary-800">
                      Avaliações da Comunidade ({reviews.length})
                    </h3>
                    <button 
                      className="btn btn-secondary btn-with-icon"
                      onClick={() => setShowReviewModal(true)}
                    >
                      <StarIcon className="w-4 h-4" />
                      Adicionar Avaliação
                    </button>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="card border-l-4 border-l-primary-500">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 font-semibold text-accessible-base">
                                {review.user_name?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-secondary-800">
                                {review.user_name || 'Utilizador'}
                              </h4>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`text-lg ${
                                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                                <span className="text-accessible-sm text-secondary-600 ml-2">
                                  ({review.rating}/5)
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-accessible-sm text-secondary-500">
                            {new Date(review.created_at).toLocaleDateString('pt-PT')}
                          </span>
                        </div>

                        {/* Sensory Information */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 bg-gray-50 rounded-lg p-3">
                          <div className="text-center">
                            <div className="text-accessible-sm text-secondary-500">Ruído</div>
                            <div className="font-medium text-secondary-700 capitalize">
                              {review.noise_level?.replace('_', ' ')}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-accessible-sm text-secondary-500">Luz</div>
                            <div className="font-medium text-secondary-700 capitalize">
                              {review.lighting_level?.replace('_', ' ')}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-accessible-sm text-secondary-500">Clareza</div>
                            <div className="font-medium text-secondary-700 capitalize">
                              {review.visual_clarity?.replace('_', ' ')}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-accessible-sm text-secondary-500">Equipe</div>
                            <div className="font-medium text-secondary-700">
                              {review.staff_helpfulness}/5 ★
                            </div>
                          </div>
                        </div>

                        {review.comment && (
                          <div className="bg-blue-50 border-l-4 border-l-blue-400 p-3 mb-3">
                            <p className="text-accessible-base text-secondary-700 italic">
                              "{review.comment}"
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-accessible-sm text-secondary-500">
                          <span>
                            Áreas calmas: {review.calm_areas_available ? '✅ Sim' : '❌ Não'}
                          </span>
                          <span>
                            Avaliação verificada
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChatBubbleLeftIcon className="w-8 h-8 text-secondary-400" />
                  </div>
                  <h3 className="text-accessible-lg font-semibold text-secondary-600 mb-2">
                    Primeira avaliação
                  </h3>
                  <p className="text-secondary-500 mb-6 max-w-md mx-auto">
                    Este estabelecimento ainda não tem avaliações. Seja o primeiro a partilhar a sua experiência!
                  </p>
                  <button 
                    className="btn btn-primary btn-with-icon mx-auto"
                    onClick={() => setShowReviewModal(true)}
                  >
                    <StarIcon className="w-5 h-5" />
                    Ser o Primeiro a Avaliar
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
                {language === 'pt' ? 'Informações de Contacto' : 'Contact Information'}
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
                  {language === 'pt' ? 'Horários de Funcionamento' : 'Opening Hours'}
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
                {language === 'pt' ? 'Gostou deste local?' : 'Did you like this location?'}
              </h3>
              <p className="text-accessible-sm text-secondary-600 mb-4">
                {language === 'pt' 
                  ? 'Faça login ou registe-se para avaliar e partilhar a sua experiência com a comunidade.'
                  : 'Log in or register to rate and share your experience with the community.'
                }
              </p>
              <div className="space-y-2">
                <button 
                  className="btn btn-primary btn-with-icon w-full"
                  onClick={() => setShowReviewModal(true)}
                >
                  <StarIcon className="w-5 h-5" />
                  {language === 'pt' ? 'Avaliar Local' : 'Review Location'}
                </button>
                <button 
                  className="btn btn-secondary btn-with-icon w-full"
                  onClick={() => setShowPhotoModal(true)}
                >
                  <CameraIcon className="w-5 h-5" />
                  {language === 'pt' ? 'Partilhar Fotos' : 'Share Photos'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-accessible-lg font-semibold">Avaliar {establishment?.name}</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <span className="sr-only">Fechar</span>
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="label">Avaliação Geral</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData({...reviewData, rating: star})}
                        className={`w-8 h-8 ${star <= reviewData.rating ? 'text-yellow-400' : 'text-secondary-300'}`}
                      >
                        <StarIcon className={star <= reviewData.rating ? 'fill-current' : ''} />
                      </button>
                    ))}
                    <span className="ml-2 text-accessible-sm text-secondary-600">
                      {reviewData.rating} estrela{reviewData.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="label">Nível de Ruído</label>
                  <select 
                    value={reviewData.noise_rating}
                    onChange={(e) => setReviewData({...reviewData, noise_rating: parseInt(e.target.value)})}
                    className="input"
                  >
                    <option value={1}>Muito Baixo</option>
                    <option value={2}>Baixo</option>
                    <option value={3}>Moderado</option>
                    <option value={4}>Alto</option>
                    <option value={5}>Muito Alto</option>
                  </select>
                </div>

                <div>
                  <label className="label">Qualidade da Iluminação</label>
                  <select 
                    value={reviewData.lighting_rating}
                    onChange={(e) => setReviewData({...reviewData, lighting_rating: parseInt(e.target.value)})}
                    className="input"
                  >
                    <option value={1}>Muito Suave</option>
                    <option value={2}>Suave</option>
                    <option value={3}>Adequada</option>
                    <option value={4}>Intensa</option>
                    <option value={5}>Muito Intensa</option>
                  </select>
                </div>

                <div>
                  <label className="label">Apoio da Equipe</label>
                  <select 
                    value={reviewData.staff_rating}
                    onChange={(e) => setReviewData({...reviewData, staff_rating: parseInt(e.target.value)})}
                    className="input"
                  >
                    <option value={1}>Inadequado</option>
                    <option value={2}>Suficiente</option>
                    <option value={3}>Bom</option>
                    <option value={4}>Muito Bom</option>
                    <option value={5}>Excelente</option>
                  </select>
                </div>

                <div>
                  <label className="label">Comentário (opcional)</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                    className="input h-24 resize-none"
                    placeholder="Partilhe a sua experiência..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-with-icon flex-1"
                  >
                    <StarIcon className="w-4 h-4" />
                    Enviar Avaliação
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-accessible-lg font-semibold">Partilhar Fotos</h3>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <span className="sr-only">Fechar</span>
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
                  <CameraIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600 mb-4">
                    Selecione fotos para partilhar com a comunidade
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="btn btn-primary btn-with-icon cursor-pointer inline-flex"
                  >
                    <CameraIcon className="w-5 h-5" />
                    Escolher Fotos
                  </label>
                </div>
                
                <p className="text-accessible-sm text-secondary-500 text-center">
                  Máximo 5 fotos • Apenas JPG, PNG • Máx. 10MB cada
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPhotoModal(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        establishmentId={params.id as string}
        establishmentName={establishment?.name || ""}
        userId="demo-user" // In real app, get from auth context
        onSuccess={() => {
          // Refresh reviews or show success message
          toast.success('Avaliação enviada com sucesso!')
        }}
      />

      <Footer />
    </div>
  )
}