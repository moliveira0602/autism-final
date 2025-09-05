'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  StarIcon,
  XMarkIcon,
  SpeakerWaveIcon,
  LightBulbIcon,
  EyeIcon,
  UsersIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  establishmentId: string
  establishmentName: string
  userId?: string
  onSuccess?: () => void
}

interface ReviewFormData {
  rating: number
  noise_level: string
  lighting_level: string
  visual_clarity: string
  staff_helpfulness: number
  calm_areas_available: boolean
  comment: string
}

const SENSORY_LEVELS = {
  very_low: 'Muito Baixo',
  low: 'Baixo',
  moderate: 'Moderado',
  high: 'Alto',
  very_high: 'Muito Alto'
}

const SENSORY_LEVEL_COLORS = {
  very_low: 'text-green-600 bg-green-50',
  low: 'text-green-500 bg-green-50',
  moderate: 'text-yellow-600 bg-yellow-50',
  high: 'text-orange-600 bg-orange-50',
  very_high: 'text-red-600 bg-red-50'
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  establishmentId, 
  establishmentName,
  userId = "demo-user",
  onSuccess 
}: ReviewModalProps) {
  const [loading, setLoading] = useState(false)
  const [overallRating, setOverallRating] = useState(0)
  const [staffRating, setStaffRating] = useState(0)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 0,
      noise_level: 'moderate',
      lighting_level: 'moderate',
      visual_clarity: 'moderate',
      staff_helpfulness: 0,
      calm_areas_available: false,
      comment: ''
    }
  })

  const onSubmit = async (data: ReviewFormData) => {
    if (overallRating === 0) {
      toast.error('Por favor, selecione uma avaliação geral')
      return
    }
    
    if (staffRating === 0) {
      toast.error('Por favor, avalie a simpatia da equipe')
      return
    }

    setLoading(true)
    try {
      const reviewData = {
        establishment_id: establishmentId,
        user_id: userId,
        rating: overallRating,
        noise_level: data.noise_level,
        lighting_level: data.lighting_level,
        visual_clarity: data.visual_clarity,
        staff_helpfulness: staffRating,
        calm_areas_available: data.calm_areas_available,
        comment: data.comment
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })

      if (response.ok) {
        toast.success('Avaliação enviada! Será analisada pelos moderadores.')
        reset()
        setOverallRating(0)
        setStaffRating(0)
        onClose()
        onSuccess?.()
      } else {
        const errorData = await response.text()
        console.error('Error submitting review:', errorData)
        toast.error('Erro ao enviar avaliação')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Erro ao enviar avaliação')
    } finally {
      setLoading(false)
    }
  }

  const renderStarRating = (
    currentRating: number,
    setRating: (rating: number) => void,
    label: string
  ) => (
    <div className="space-y-2">
      <label className="label">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            {star <= currentRating ? (
              <StarSolid className="w-8 h-8 text-yellow-400" />
            ) : (
              <StarIcon className="w-8 h-8 text-gray-300 hover:text-yellow-200" />
            )}
          </button>
        ))}
      </div>
    </div>
  )

  const renderSensorySelector = (
    name: keyof ReviewFormData,
    label: string,
    icon: React.ReactNode
  ) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        {icon}
        <label className="label">{label}</label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {Object.entries(SENSORY_LEVELS).map(([value, displayLabel]) => {
          const isSelected = watch(name) === value
          return (
            <label 
              key={value} 
              className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-primary-500 bg-primary-50 shadow-md transform scale-105' 
                  : 'border-gray-300 bg-white hover:border-primary-300 hover:bg-gray-50'
              }`}
            >
              <input
                {...register(name)}
                type="radio"
                value={value}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-full mb-2 border-2 flex items-center justify-center ${
                isSelected 
                  ? SENSORY_LEVEL_COLORS[value as keyof typeof SENSORY_LEVEL_COLORS] + ' border-current'
                  : 'bg-gray-100 border-gray-300'
              }`}>
                {isSelected && (
                  <div className="w-3 h-3 rounded-full bg-current"></div>
                )}
              </div>
              <span className={`text-accessible-sm text-center font-medium ${
                isSelected ? 'text-primary-700' : 'text-gray-600'
              }`}>
                {displayLabel}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-accessible-xl font-bold text-secondary-800">
              Avaliar Estabelecimento
            </h2>
            <p className="text-accessible-base text-secondary-600 mt-1">
              {establishmentName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Overall Rating */}
          <div className="text-center">
            {renderStarRating(overallRating, setOverallRating, "Avaliação Geral *")}
          </div>

          {/* Sensory Evaluations */}
          <div className="space-y-6">
            <h3 className="text-accessible-lg font-semibold text-secondary-800">
              Avaliação Sensorial
            </h3>

            {renderSensorySelector(
              'noise_level',
              'Nível de Ruído',
              <SpeakerWaveIcon className="w-5 h-5 text-secondary-500" />
            )}

            {renderSensorySelector(
              'lighting_level',
              'Intensidade da Luz',
              <LightBulbIcon className="w-5 h-5 text-secondary-500" />
            )}

            {renderSensorySelector(
              'visual_clarity',
              'Clareza Visual',
              <EyeIcon className="w-5 h-5 text-secondary-500" />
            )}
          </div>

          {/* Staff Rating */}
          <div className="text-center">
            {renderStarRating(staffRating, setStaffRating, "Simpatia da Equipe *")}
          </div>

          {/* Calm Areas */}
          <div className="flex items-center space-x-3">
            <input
              {...register('calm_areas_available')}
              type="checkbox"
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <div className="flex items-center space-x-2">
              <HeartIcon className="w-5 h-5 text-secondary-500" />
              <label className="label">Áreas calmas disponíveis</label>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="label">Comentário (opcional)</label>
            <textarea
              {...register('comment')}
              className="input min-h-[100px] resize-vertical"
              placeholder="Partilhe a sua experiência para ajudar outras famílias..."
              rows={4}
            />
          </div>

          {/* Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-accessible-sm text-blue-800">
              <strong>Nota:</strong> A sua avaliação será analisada pelos nossos moderadores antes de ser publicada. 
              Isto ajuda-nos a manter a qualidade e segurança das informações.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={loading || overallRating === 0 || staffRating === 0}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <StarIcon className="w-5 h-5 mr-2" />
                  Enviar Avaliação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}