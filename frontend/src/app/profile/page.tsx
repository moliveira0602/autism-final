'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { 
  UserCircleIcon,
  Cog6ToothIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Footer from '@/components/Footer'

interface SensoryProfile {
  noise_sensitivity: string
  light_sensitivity: string
  crowd_tolerance: string
  communication_needs: string
  specific_triggers: string[]
  preferred_times: string[]
}

interface UserProfile {
  id?: string
  name: string
  email: string
  sensory_profile: SensoryProfile
  language_preference: string
}

const SENSORY_LEVELS = {
  very_low: 'Muito Baixo',
  low: 'Baixo',
  moderate: 'Moderado',
  high: 'Alto',
  very_high: 'Muito Alto'
}

const COMMUNICATION_OPTIONS = [
  'Verbal completa',
  'Verbal limitada', 
  'Comunicação por gestos',
  'Comunicação visual/cartões',
  'Dispositivos de comunicação',
  'Não verbal'
]

const TRIGGER_OPTIONS = [
  'Ruídos altos',
  'Multidões',
  'Luzes piscantes',
  'Texturas específicas',
  'Mudanças de rotina',
  'Ambientes desconhecidos',
  'Cheiros fortes',
  'Temperaturas extremas'
]

const TIME_OPTIONS = [
  'Manhã cedo (6h-9h)',
  'Manhã (9h-12h)',
  'Tarde (12h-15h)',
  'Final da tarde (15h-18h)',
  'Noite (18h-21h)',
  'Noite tardia (21h+)'
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isUserRole, setIsUserRole] = useState(true) // Simulating user role - in real app this would come from auth

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UserProfile>()

  useEffect(() => {
    // For demo purposes, we'll simulate a user profile
    // In a real app, this would load from the authenticated user's profile
    const mockProfile: UserProfile = {
      name: '',
      email: '',
      sensory_profile: {
        noise_sensitivity: 'moderate',
        light_sensitivity: 'moderate',
        crowd_tolerance: 'moderate',
        communication_needs: 'Verbal completa',
        specific_triggers: [],
        preferred_times: []
      },
      language_preference: 'pt'
    }
    setProfile(mockProfile)
    populateForm(mockProfile)
  }, [])

  const populateForm = (profileData: UserProfile) => {
    setValue('name', profileData.name)
    setValue('email', profileData.email)
    setValue('sensory_profile.noise_sensitivity', profileData.sensory_profile.noise_sensitivity)
    setValue('sensory_profile.light_sensitivity', profileData.sensory_profile.light_sensitivity)
    setValue('sensory_profile.crowd_tolerance', profileData.sensory_profile.crowd_tolerance)
    setValue('sensory_profile.communication_needs', profileData.sensory_profile.communication_needs)
    setValue('sensory_profile.specific_triggers', profileData.sensory_profile.specific_triggers)
    setValue('sensory_profile.preferred_times', profileData.sensory_profile.preferred_times)
    setValue('language_preference', profileData.language_preference)
  }

  const onSubmit = async (data: UserProfile) => {
    setLoading(true)
    try {
      // Note: In real implementation, only admin would create users
      // Users would only be able to view and potentially comment/rate establishments
      let response
      if (profile?.id && !isUserRole) {
        // Update existing profile (admin only)
        response = await fetch(`/api/users/${profile.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      } else if (!isUserRole) {
        // Create new profile (admin only)
        response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      } else {
        // User role - show message that they can't create profiles
        toast.error('Apenas administradores podem criar perfis de usuário. Entre em contato com o admin.')
        setLoading(false)
        return
      }

      if (response && response.ok) {
        const savedProfile = await response.json()
        setProfile(savedProfile)
        setIsEditing(false)
        toast.success('Perfil salvo com sucesso!')
      } else {
        toast.error('Erro ao salvar perfil')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Erro ao salvar perfil')
    } finally {
      setLoading(false)
    }
  }

  const getSensoryLevelColor = (level: string) => {
    const colors = {
      'very_low': 'text-green-600 bg-green-50',
      'low': 'text-green-500 bg-green-50',
      'moderate': 'text-yellow-600 bg-yellow-50',
      'high': 'text-orange-600 bg-orange-50',
      'very_high': 'text-red-600 bg-red-50'
    }
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-50'
  }

  const handleTriggerToggle = (trigger: string) => {
    const currentTriggers = watch('sensory_profile.specific_triggers') || []
    const newTriggers = currentTriggers.includes(trigger)
      ? currentTriggers.filter(t => t !== trigger)
      : [...currentTriggers, trigger]
    setValue('sensory_profile.specific_triggers', newTriggers)
  }

  const handleTimeToggle = (time: string) => {
    const currentTimes = watch('sensory_profile.preferred_times') || []
    const newTimes = currentTimes.includes(time)
      ? currentTimes.filter(t => t !== time)
      : [...currentTimes, time]
    setValue('sensory_profile.preferred_times', newTimes)
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <UserCircleIcon className="w-8 h-8 text-primary-600 mr-3" />
            <h1 className="text-accessible-2xl font-bold text-secondary-800">
              Perfil Sensorial
            </h1>
          </div>
          {!isUserRole && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary flex items-center"
            >
              <Cog6ToothIcon className="w-5 h-5 mr-2" />
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
          )}
        </div>
        
        {isUserRole && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 mr-3" />
              <div>
                <h3 className="font-semibold text-amber-800">Acesso de Usuário</h3>
                <p className="text-amber-700 text-accessible-base">
                  Perfis sensoriais são criados pelos administradores. Como usuário, você pode visualizar estabelecimentos, 
                  deixar avaliações e comentários sobre sua experiência nos locais.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-accessible-base text-secondary-600">
          {isUserRole 
            ? "Visualize as preferências sensoriais e explore estabelecimentos adequados"
            : "Configure suas preferências sensoriais para receber recomendações personalizadas"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-accessible-xl font-semibold text-secondary-800 mb-4">
            Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Nome</label>
              <input
                {...register('name', { required: !isUserRole ? 'Nome é obrigatório' : false })}
                className="input"
                disabled={!isEditing || isUserRole}
                placeholder="Nome completo"
              />
              {errors.name && (
                <p className="text-red-500 text-accessible-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="label">Email</label>
              <input
                {...register('email', { 
                  required: !isUserRole ? 'Email é obrigatório' : false,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                type="email"
                className="input"
                disabled={!isEditing || isUserRole}
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="text-red-500 text-accessible-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="label">Idioma Preferido</label>
            <select
              {...register('language_preference')}
              className="input max-w-xs"
              disabled={!isEditing || isUserRole}
            >
              <option value="pt">🇵🇹 Português</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>

        {/* Sensory Sensitivities */}
        <div className="card">
          <h2 className="text-accessible-xl font-semibold text-secondary-800 mb-4">
            Sensibilidades Sensoriais
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="label">Sensibilidade ao Ruído</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(SENSORY_LEVELS).map(([value, label]) => (
                  <label key={value} className="flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-secondary-50">
                    <input
                      {...register('sensory_profile.noise_sensitivity')}
                      type="radio"
                      value={value}
                      disabled={!isEditing || isUserRole}
                      className="mb-2"
                    />
                    <div className={`sensory-indicator sensory-${value}`}></div>
                    <span className="text-accessible-sm text-center">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Sensibilidade à Luz</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(SENSORY_LEVELS).map(([value, label]) => (
                  <label key={value} className="flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-secondary-50">
                    <input
                      {...register('sensory_profile.light_sensitivity')}
                      type="radio"
                      value={value}
                      disabled={!isEditing || isUserRole}
                      className="mb-2"
                    />
                    <div className={`sensory-indicator sensory-${value}`}></div>
                    <span className="text-accessible-sm text-center">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Tolerância a Multidões</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(SENSORY_LEVELS).map(([value, label]) => (
                  <label key={value} className="flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-secondary-50">
                    <input
                      {...register('sensory_profile.crowd_tolerance')}
                      type="radio"
                      value={value}
                      disabled={!isEditing || isUserRole}
                      className="mb-2"
                    />
                    <div className={`sensory-indicator sensory-${value}`}></div>
                    <span className="text-accessible-sm text-center">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Communication Needs */}
        <div className="card">
          <h2 className="text-accessible-xl font-semibold text-secondary-800 mb-4">
            Necessidades de Comunicação
          </h2>
          
          <div>
            <label className="label">Estilo de Comunicação</label>
            <select
              {...register('sensory_profile.communication_needs')}
              className="input"
              disabled={!isEditing || isUserRole}
            >
              {COMMUNICATION_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Triggers */}
        <div className="card">
          <h2 className="text-accessible-xl font-semibold text-secondary-800 mb-4">
            Gatilhos Específicos
          </h2>
          <p className="text-accessible-base text-secondary-600 mb-4">
            Elementos que podem causar desconforto ou ansiedade
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TRIGGER_OPTIONS.map((trigger) => (
              <label key={trigger} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-secondary-50">
                <input
                  type="checkbox"
                  checked={watch('sensory_profile.specific_triggers')?.includes(trigger) || false}
                  onChange={() => !isUserRole && handleTriggerToggle(trigger)}
                  disabled={!isEditing || isUserRole}
                  className="mr-3 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-accessible-sm">{trigger}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Times */}
        <div className="card">
          <h2 className="text-accessible-xl font-semibold text-secondary-800 mb-4">
            Horários Preferidos
          </h2>
          <p className="text-accessible-base text-secondary-600 mb-4">
            Horários em que se sente mais confortável para atividades
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TIME_OPTIONS.map((time) => (
              <label key={time} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-secondary-50">
                <input
                  type="checkbox"
                  checked={watch('sensory_profile.preferred_times')?.includes(time) || false}
                  onChange={() => !isUserRole && handleTimeToggle(time)}
                  disabled={!isEditing || isUserRole}
                  className="mr-3 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-accessible-sm">{time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button - Only for Admin */}
        {isEditing && !isUserRole && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <CheckCircleIcon className="w-5 h-5 mr-2" />
              )}
              Salvar Perfil
            </button>
          </div>
        )}
      </form>

      {/* Current Profile Summary (when not editing) */}
      {(!isEditing || isUserRole) && profile && (
        <div className="card mt-8 bg-gradient-to-r from-primary-50 to-autism-calm">
          <h3 className="text-accessible-xl font-semibold text-secondary-800 mb-4 flex items-center">
            <HeartIcon className="w-6 h-6 text-primary-600 mr-2" />
            Resumo do Perfil Sensorial
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-secondary-700 mb-2">Sensibilidades</h4>
              <div className="space-y-1 text-accessible-sm">
                <div className="flex items-center">
                  <span className="w-16">Ruído:</span>
                  <span className={`px-2 py-1 rounded ${getSensoryLevelColor(profile.sensory_profile.noise_sensitivity)}`}>
                    {SENSORY_LEVELS[profile.sensory_profile.noise_sensitivity as keyof typeof SENSORY_LEVELS]}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-16">Luz:</span>
                  <span className={`px-2 py-1 rounded ${getSensoryLevelColor(profile.sensory_profile.light_sensitivity)}`}>
                    {SENSORY_LEVELS[profile.sensory_profile.light_sensitivity as keyof typeof SENSORY_LEVELS]}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-16">Multidão:</span>
                  <span className={`px-2 py-1 rounded ${getSensoryLevelColor(profile.sensory_profile.crowd_tolerance)}`}>
                    {SENSORY_LEVELS[profile.sensory_profile.crowd_tolerance as keyof typeof SENSORY_LEVELS]}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-secondary-700 mb-2">Comunicação</h4>
              <p className="text-accessible-sm text-secondary-600">
                {profile.sensory_profile.communication_needs}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-secondary-700 mb-2">Gatilhos ({profile.sensory_profile.specific_triggers.length})</h4>
              <div className="text-accessible-sm text-secondary-600">
                {profile.sensory_profile.specific_triggers.length > 0 ? (
                  profile.sensory_profile.specific_triggers.slice(0, 2).map((trigger) => (
                    <div key={trigger} className="bg-white px-2 py-1 rounded mb-1">
                      {trigger}
                    </div>
                  ))
                ) : (
                  <p>Nenhum gatilho especificado</p>
                )}
                {profile.sensory_profile.specific_triggers.length > 2 && (
                  <p className="text-secondary-500">
                    +{profile.sensory_profile.specific_triggers.length - 2} mais
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}