'use client'

import { useState, useEffect } from 'react'
import { 
  StarIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  HeartIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import UserFooter from '@/components/UserFooter'

interface UserProfile {
  id: string
  name: string
  email: string
  sensory_profile: {
    noise_sensitivity: string
    light_sensitivity: string
    crowd_tolerance: string
    communication_needs: string
    specific_triggers: string[]
    preferred_times: string[]
  }
  created_at: string
}

interface Review {
  establishment_id: string
  establishment_name: string
  rating: number
  comment: string
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [recentReviews, setRecentReviews] = useState<Review[]>([])
  const [favoriteEstablishments, setFavoriteEstablishments] = useState([])
  const [stats, setStats] = useState({
    total_reviews: 0,
    favorite_places: 0,
    places_visited: 0
  })

  useEffect(() => {
    // Mock user data - in real app would come from authentication
    const mockUser: UserProfile = {
      id: '1',
      name: 'Maria Silva',
      email: 'maria.silva@exemplo.com',
      sensory_profile: {
        noise_sensitivity: 'moderate',
        light_sensitivity: 'low',
        crowd_tolerance: 'low',
        communication_needs: 'Verbal completa',
        specific_triggers: ['Ruídos altos', 'Multidões'],
        preferred_times: ['Manhã (9h-12h)', 'Final da tarde (15h-18h)']
      },
      created_at: '2024-01-15T10:00:00Z'
    }
    
    setUser(mockUser)
    setStats({
      total_reviews: 12,
      favorite_places: 8,
      places_visited: 25
    })
    
    // Mock recent reviews
    setRecentReviews([
      {
        establishment_id: '1',
        establishment_name: 'Pestana Vila Sol Resort',
        rating: 5,
        comment: 'Excelente para famílias com autismo. Staff muito atencioso.',
        created_at: '2024-09-01T14:30:00Z'
      },
      {
        establishment_id: '2',
        establishment_name: 'Restaurante Noélia',
        rating: 4,
        comment: 'Ambiente calmo, perfeito para refeições tranquilas.',
        created_at: '2024-08-28T19:15:00Z'
      }
    ])
  }, [])

  const SENSORY_LEVELS = {
    very_low: { label: 'Muito Baixo', color: 'bg-green-100 text-green-800' },
    low: { label: 'Baixo', color: 'bg-green-100 text-green-800' },
    moderate: { label: 'Moderado', color: 'bg-yellow-100 text-yellow-800' },
    high: { label: 'Alto', color: 'bg-orange-100 text-orange-800' },
    very_high: { label: 'Muito Alto', color: 'bg-red-100 text-red-800' }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-accessible-2xl font-bold text-secondary-800">
                Bem-vindo, {user.name}!
              </h1>
              <p className="text-accessible-base text-secondary-600">
                Painel do utilizador - Gerencie o seu perfil e avaliações
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Profile Summary */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-autism-friendly rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCircleIcon className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-accessible-xl font-semibold text-secondary-800 mb-2">
                  {user.name}
                </h2>
                <p className="text-accessible-sm text-secondary-600 mb-4">
                  {user.email}
                </p>
                <p className="text-accessible-sm text-secondary-500">
                  Membro desde {new Date(user.created_at).toLocaleDateString('pt-PT')}
                </p>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-semibold text-secondary-800 mb-3">Perfil Sensorial</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-accessible-sm text-secondary-600">Ruído:</span>
                    <span className={`px-2 py-1 rounded text-xs ${SENSORY_LEVELS[user.sensory_profile.noise_sensitivity as keyof typeof SENSORY_LEVELS]?.color}`}>
                      {SENSORY_LEVELS[user.sensory_profile.noise_sensitivity as keyof typeof SENSORY_LEVELS]?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-accessible-sm text-secondary-600">Luz:</span>
                    <span className={`px-2 py-1 rounded text-xs ${SENSORY_LEVELS[user.sensory_profile.light_sensitivity as keyof typeof SENSORY_LEVELS]?.color}`}>
                      {SENSORY_LEVELS[user.sensory_profile.light_sensitivity as keyof typeof SENSORY_LEVELS]?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-accessible-sm text-secondary-600">Multidão:</span>
                    <span className={`px-2 py-1 rounded text-xs ${SENSORY_LEVELS[user.sensory_profile.crowd_tolerance as keyof typeof SENSORY_LEVELS]?.color}`}>
                      {SENSORY_LEVELS[user.sensory_profile.crowd_tolerance as keyof typeof SENSORY_LEVELS]?.label}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-secondary-800 mb-2">Gatilhos</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.sensory_profile.specific_triggers.map((trigger, index) => (
                      <span key={index} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Link href="/profile" className="btn btn-secondary w-full flex items-center justify-center">
                  <Cog6ToothIcon className="w-5 h-5 mr-2" />
                  Editar Perfil
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ChatBubbleLeftIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-secondary-800 mb-1">
                  {stats.total_reviews}
                </div>
                <div className="text-accessible-base text-secondary-600">
                  Avaliações Feitas
                </div>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-2xl font-bold text-secondary-800 mb-1">
                  {stats.favorite_places}
                </div>
                <div className="text-accessible-base text-secondary-600">
                  Locais Favoritos
                </div>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-secondary-800 mb-1">
                  {stats.places_visited}
                </div>
                <div className="text-accessible-base text-secondary-600">
                  Locais Visitados
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-accessible-xl font-semibold text-secondary-800">
                  Avaliações Recentes
                </h2>
                <Link href="/nossa-teia" className="text-primary-600 hover:text-primary-700 font-medium">
                  Ver Todos os Locais →
                </Link>
              </div>
              
              {recentReviews.length > 0 ? (
                <div className="space-y-4">
                  {recentReviews.map((review, index) => (
                    <div key={index} className="border border-secondary-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-secondary-800 mb-1">
                            {review.establishment_name}
                          </h3>
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarSolidIcon
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? 'text-yellow-500' : 'text-secondary-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-accessible-sm text-secondary-600">
                              {new Date(review.created_at).toLocaleDateString('pt-PT')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-accessible-base text-secondary-600 italic">
                        "{review.comment}"
                      </p>
                      
                      <div className="mt-3 flex justify-end">
                        <Link 
                          href={`/nossa-teia/${review.establishment_id}`}
                          className="text-primary-600 hover:text-primary-700 text-accessible-sm font-medium"
                        >
                          Ver Local →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ChatBubbleLeftIcon className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                  <h3 className="text-accessible-lg font-semibold text-secondary-600 mb-2">
                    Ainda não fez avaliações
                  </h3>
                  <p className="text-accessible-base text-secondary-500 mb-4">
                    Partilhe a sua experiência com outros visitantes
                  </p>
                  <Link href="/nossa-teia" className="btn btn-primary">
                    Explorar Locais
                  </Link>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="card">
              <h2 className="text-accessible-xl font-semibold text-secondary-800 mb-4">
                Recomendações Personalizadas
              </h2>
              
              <div className="bg-autism-calm p-6 rounded-lg">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <ChartBarIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-2">
                      Baseado no seu perfil sensorial
                    </h3>
                    <p className="text-accessible-base text-secondary-600 mb-4">
                      Com base nas suas preferências (ruído moderado, pouca tolerância a multidões), 
                      recomendamos locais com ambientes mais calmos, especialmente durante os horários 
                      que prefere: manhã e final da tarde.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-accessible-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>Restaurantes com espaços silenciosos</span>
                      </div>
                      <div className="flex items-center text-accessible-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>Hotéis com quartos adaptados</span>
                      </div>
                      <div className="flex items-center text-accessible-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>Atrações com horários especiais</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Link href="/nossa-teia?features=quiet_spaces,calm_environment" className="btn btn-primary">
                        Ver Recomendações
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-accessible-xl font-semibold text-secondary-800 mb-4">
                Ações Rápidas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/nossa-teia" className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                  <MapPinIcon className="w-8 h-8 text-primary-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-secondary-800">Explorar Locais</h3>
                    <p className="text-accessible-sm text-secondary-600">Descobrir novos estabelecimentos</p>
                  </div>
                </Link>
                
                <Link href="/profile" className="flex items-center p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                  <UserCircleIcon className="w-8 h-8 text-secondary-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-secondary-800">Atualizar Perfil</h3>
                    <p className="text-accessible-sm text-secondary-600">Gerir informações pessoais</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <UserFooter />
    </div>
  )
}