'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  MapPinIcon,
  ShieldCheckIcon,
  XMarkIcon,
  UserPlusIcon,
  UsersIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Establishment {
  id?: string
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
  images: string[]
}

interface User {
  id?: string
  name: string
  email: string
  sensory_profile: any
  language_preference: string
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'establishments' | 'users'>('establishments')
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Establishment>()

  useEffect(() => {
    fetchEstablishments()
    fetchUsers()
  }, [])

  const fetchEstablishments = async () => {
    try {
      const response = await fetch('/api/establishments')
      if (response.ok) {
        const data = await response.json()
        setEstablishments(data)
      }
    } catch (error) {
      console.error('Error fetching establishments:', error)
      toast.error('Erro ao carregar estabelecimentos')
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      // toast.error('Erro ao carregar usuários')
    }
  }

  const onSubmit = async (data: Establishment) => {
    setLoading(true)
    try {
      // Add selected images to the data
      const formData = {
        ...data,
        images: selectedImages,
        coordinates: {
          lat: Number(data.coordinates.lat) || 37.0,
          lng: Number(data.coordinates.lng) || -8.0
        }
      }

      let response
      if (editingId) {
        response = await fetch(`/api/establishments/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        response = await fetch('/api/establishments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }

      if (response.ok) {
        toast.success(editingId ? 'Estabelecimento atualizado!' : 'Estabelecimento criado!')
        fetchEstablishments()
        handleCancel()
      } else {
        toast.error('Erro ao salvar estabelecimento')
      }
    } catch (error) {
      console.error('Error saving establishment:', error)
      toast.error('Erro ao salvar estabelecimento')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (establishment: Establishment) => {
    setEditingId(establishment.id || null)
    setShowForm(true)
    setSelectedImages(establishment.images || [])
    
    // Populate form with existing data
    Object.keys(establishment).forEach((key) => {
      if (key === 'coordinates') {
        setValue('coordinates.lat', establishment.coordinates.lat)
        setValue('coordinates.lng', establishment.coordinates.lng)
      } else {
        setValue(key as keyof Establishment, establishment[key as keyof Establishment])
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este estabelecimento?')) return

    try {
      const response = await fetch(`/api/establishments/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Estabelecimento excluído!')
        fetchEstablishments()
      } else {
        toast.error('Erro ao excluir estabelecimento')
      }
    } catch (error) {
      console.error('Error deleting establishment:', error)
      toast.error('Erro ao excluir estabelecimento')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setSelectedImages([])
    reset()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        const base64Data = base64.split(',')[1] // Remove data:image/jpeg;base64, prefix
        setSelectedImages(prev => [...prev, base64Data])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = watch('accessibility_features') || []
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature]
    setValue('accessibility_features', newFeatures)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-accessible-2xl font-bold text-secondary-800 mb-2">
          Painel Administrativo - TEIA
        </h1>
        <p className="text-accessible-base text-secondary-600 mb-4">
          Gerencie estabelecimentos e usuários da plataforma
        </p>
        
        {/* Admin Info Banner */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-primary-800 mb-2">🔐 Área Administrativa</h3>
          <div className="text-primary-700 text-accessible-base space-y-1">
            <p><strong>Estabelecimentos:</strong> Apenas administradores podem adicionar, editar e excluir estabelecimentos</p>
            <p><strong>Usuários:</strong> Apenas administradores podem criar perfis de usuários</p>
            <p><strong>Papel dos Usuários:</strong> Usuários podem visualizar estabelecimentos, deixar avaliações e comentários</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-secondary-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('establishments')}
          className={`flex items-center px-4 py-2 rounded-md text-accessible-base font-medium transition-colors ${
            activeTab === 'establishments'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-secondary-600 hover:text-secondary-800'
          }`}
        >
          <BuildingOfficeIcon className="w-5 h-5 mr-2" />
          Estabelecimentos ({establishments.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center px-4 py-2 rounded-md text-accessible-base font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-secondary-600 hover:text-secondary-800'
          }`}
        >
          <UsersIcon className="w-5 h-5 mr-2" />
          Usuários ({users.length})
        </button>
      </div>

      {/* Establishments Tab */}
      {activeTab === 'establishments' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-accessible-xl font-semibold text-secondary-800">
              Gestão de Estabelecimentos
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Novo Estabelecimento
            </button>
          </div>

          {/* Establishments List */}
          <div className="space-y-4">
            {establishments.map((establishment) => (
              <div key={establishment.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-accessible-lg font-semibold text-secondary-800 mr-3">
                        {establishment.name}
                      </h3>
                      {establishment.certified_autism_friendly && (
                        <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                      )}
                      <span className="ml-2 bg-secondary-100 text-secondary-700 px-2 py-1 rounded text-accessible-sm">
                        {ESTABLISHMENT_TYPES[establishment.type as keyof typeof ESTABLISHMENT_TYPES]}
                      </span>
                    </div>
                    
                    <p className="text-secondary-600 text-accessible-base mb-2 line-clamp-2">
                      {establishment.description}
                    </p>
                    
                    <div className="flex items-center text-accessible-sm text-secondary-500">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {establishment.address}
                    </div>
                    
                    {establishment.accessibility_features.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
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
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(establishment)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(establishment.id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {establishments.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-accessible-xl font-semibold text-secondary-600 mb-2">
                Nenhum estabelecimento cadastrado
              </h3>
              <p className="text-accessible-base text-secondary-500 mb-4">
                Comece criando seu primeiro estabelecimento autism-friendly
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                Criar Primeiro Estabelecimento
              </button>
            </div>
          )}
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-accessible-xl font-semibold text-secondary-800">
              Gestão de Usuários
            </h2>
            <button
              onClick={() => window.location.href = '/profile'}
              className="btn btn-primary flex items-center"
            >
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Criar Usuário
            </button>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-accessible-lg font-semibold text-secondary-800 mb-1">
                      {user.name || 'Nome não informado'}
                    </h3>
                    <p className="text-secondary-600 text-accessible-base mb-2">
                      {user.email || 'Email não informado'}
                    </p>
                    <div className="flex items-center text-accessible-sm text-secondary-500">
                      <span className="mr-4">
                        Idioma: {user.language_preference === 'pt' ? '🇵🇹 Português' : '🇬🇧 English'}
                      </span>
                      {user.sensory_profile && (
                        <span>
                          Perfil sensorial configurado ✓
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => window.location.href = '/profile'}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Editar usuário"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-accessible-xl font-semibold text-secondary-600 mb-2">
                Nenhum usuário cadastrado
              </h3>
              <p className="text-accessible-base text-secondary-500 mb-4">
                Crie perfis para usuários que utilizarão a plataforma
              </p>
              <button
                onClick={() => window.location.href = '/profile'}
                className="btn btn-primary"
              >
                Criar Primeiro Usuário
              </button>
            </div>
          )}
        </>
      )}

      {/* Form Modal - Only for Establishments */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-accessible-xl font-semibold text-secondary-800">
                  {editingId ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <XMarkIcon className="w-6 h-6 text-secondary-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Nome *</label>
                    <input
                      {...register('name', { required: 'Nome é obrigatório' })}
                      className="input"
                      placeholder="Nome do estabelecimento"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-accessible-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Tipo *</label>
                    <select
                      {...register('type', { required: 'Tipo é obrigatório' })}
                      className="input"
                    >
                      <option value="">Selecione o tipo</option>
                      {Object.entries(ESTABLISHMENT_TYPES).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="text-red-500 text-accessible-sm mt-1">{errors.type.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Descrição *</label>
                  <textarea
                    {...register('description', { required: 'Descrição é obrigatória' })}
                    className="input"
                    rows={3}
                    placeholder="Descrição detalhada do estabelecimento"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-accessible-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Endereço *</label>
                  <input
                    {...register('address', { required: 'Endereço é obrigatório' })}
                    className="input"
                    placeholder="Endereço completo"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-accessible-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Latitude</label>
                    <input
                      {...register('coordinates.lat')}
                      type="number"
                      step="any"
                      className="input"
                      placeholder="37.0"
                    />
                  </div>
                  <div>
                    <label className="label">Longitude</label>
                    <input
                      {...register('coordinates.lng')}
                      type="number"
                      step="any"
                      className="input"
                      placeholder="-8.0"
                    />
                  </div>
                </div>

                {/* Certification */}
                <div>
                  <label className="flex items-center">
                    <input
                      {...register('certified_autism_friendly')}
                      type="checkbox"
                      className="mr-3 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
                    <span className="label mb-0">Certificado Autism Friendly</span>
                  </label>
                </div>

                {/* Accessibility Features */}
                <div>
                  <label className="label">Recursos de Acessibilidade</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(ACCESSIBILITY_FEATURES).map(([feature, label]) => (
                      <label key={feature} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-secondary-50">
                        <input
                          type="checkbox"
                          checked={watch('accessibility_features')?.includes(feature) || false}
                          onChange={() => handleFeatureToggle(feature)}
                          className="mr-3 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-accessible-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <label className="label">Informações de Contato</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      {...register('contact_info.phone')}
                      className="input"
                      placeholder="Telefone"
                    />
                    <input
                      {...register('contact_info.email')}
                      type="email"
                      className="input"
                      placeholder="Email"
                    />
                    <input
                      {...register('contact_info.website')}
                      className="input"
                      placeholder="Website"
                    />
                  </div>
                </div>

                {/* Opening Hours */}
                <div>
                  <label className="label">Horários de Funcionamento</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(DAYS_OF_WEEK).map(([day, label]) => (
                      <div key={day} className="flex items-center space-x-2">
                        <span className="w-24 text-accessible-sm">{label}:</span>
                        <input
                          {...register(`opening_hours.${day}` as const)}
                          className="input flex-1"
                          placeholder="09:00-18:00"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="label">Imagens</label>
                  <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <PhotoIcon className="w-12 h-12 text-secondary-400 mb-2" />
                      <span className="text-accessible-base text-secondary-600">
                        Clique para selecionar imagens
                      </span>
                    </label>
                  </div>

                  {/* Selected Images Preview */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`data:image/jpeg;base64,${image}`}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <PlusIcon className="w-5 h-5 mr-2" />
                    )}
                    {editingId ? 'Atualizar' : 'Criar'} Estabelecimento
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface Establishment {
  id?: string
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
  images: string[]
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

export default function AdminPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Establishment>()

  useEffect(() => {
    fetchEstablishments()
  }, [])

  const fetchEstablishments = async () => {
    try {
      const response = await fetch('/api/establishments')
      if (response.ok) {
        const data = await response.json()
        setEstablishments(data)
      }
    } catch (error) {
      console.error('Error fetching establishments:', error)
      toast.error('Erro ao carregar estabelecimentos')
    }
  }

  const onSubmit = async (data: Establishment) => {
    setLoading(true)
    try {
      // Add selected images to the data
      const formData = {
        ...data,
        images: selectedImages,
        coordinates: {
          lat: Number(data.coordinates.lat) || 37.0,
          lng: Number(data.coordinates.lng) || -8.0
        }
      }

      let response
      if (editingId) {
        response = await fetch(`/api/establishments/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        response = await fetch('/api/establishments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }

      if (response.ok) {
        toast.success(editingId ? 'Estabelecimento atualizado!' : 'Estabelecimento criado!')
        fetchEstablishments()
        handleCancel()
      } else {
        toast.error('Erro ao salvar estabelecimento')
      }
    } catch (error) {
      console.error('Error saving establishment:', error)
      toast.error('Erro ao salvar estabelecimento')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (establishment: Establishment) => {
    setEditingId(establishment.id || null)
    setShowForm(true)
    setSelectedImages(establishment.images || [])
    
    // Populate form with existing data
    Object.keys(establishment).forEach((key) => {
      if (key === 'coordinates') {
        setValue('coordinates.lat', establishment.coordinates.lat)
        setValue('coordinates.lng', establishment.coordinates.lng)
      } else {
        setValue(key as keyof Establishment, establishment[key as keyof Establishment])
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este estabelecimento?')) return

    try {
      const response = await fetch(`/api/establishments/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Estabelecimento excluído!')
        fetchEstablishments()
      } else {
        toast.error('Erro ao excluir estabelecimento')
      }
    } catch (error) {
      console.error('Error deleting establishment:', error)
      toast.error('Erro ao excluir estabelecimento')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setSelectedImages([])
    reset()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        const base64Data = base64.split(',')[1] // Remove data:image/jpeg;base64, prefix
        setSelectedImages(prev => [...prev, base64Data])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = watch('accessibility_features') || []
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature]
    setValue('accessibility_features', newFeatures)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-accessible-2xl font-bold text-secondary-800 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-accessible-base text-secondary-600">
            Gerencie estabelecimentos autism-friendly
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Novo Estabelecimento
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-accessible-xl font-semibold text-secondary-800">
                  {editingId ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <XMarkIcon className="w-6 h-6 text-secondary-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Nome *</label>
                    <input
                      {...register('name', { required: 'Nome é obrigatório' })}
                      className="input"
                      placeholder="Nome do estabelecimento"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-accessible-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Tipo *</label>
                    <select
                      {...register('type', { required: 'Tipo é obrigatório' })}
                      className="input"
                    >
                      <option value="">Selecione o tipo</option>
                      {Object.entries(ESTABLISHMENT_TYPES).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="text-red-500 text-accessible-sm mt-1">{errors.type.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Descrição *</label>
                  <textarea
                    {...register('description', { required: 'Descrição é obrigatória' })}
                    className="input"
                    rows={3}
                    placeholder="Descrição detalhada do estabelecimento"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-accessible-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Endereço *</label>
                  <input
                    {...register('address', { required: 'Endereço é obrigatório' })}
                    className="input"
                    placeholder="Endereço completo"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-accessible-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Latitude</label>
                    <input
                      {...register('coordinates.lat')}
                      type="number"
                      step="any"
                      className="input"
                      placeholder="37.0"
                    />
                  </div>
                  <div>
                    <label className="label">Longitude</label>
                    <input
                      {...register('coordinates.lng')}
                      type="number"
                      step="any"
                      className="input"
                      placeholder="-8.0"
                    />
                  </div>
                </div>

                {/* Certification */}
                <div>
                  <label className="flex items-center">
                    <input
                      {...register('certified_autism_friendly')}
                      type="checkbox"
                      className="mr-3 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
                    <span className="label mb-0">Certificado Autism Friendly</span>
                  </label>
                </div>

                {/* Accessibility Features */}
                <div>
                  <label className="label">Recursos de Acessibilidade</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(ACCESSIBILITY_FEATURES).map(([feature, label]) => (
                      <label key={feature} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-secondary-50">
                        <input
                          type="checkbox"
                          checked={watch('accessibility_features')?.includes(feature) || false}
                          onChange={() => handleFeatureToggle(feature)}
                          className="mr-3 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-accessible-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <label className="label">Informações de Contato</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      {...register('contact_info.phone')}
                      className="input"
                      placeholder="Telefone"
                    />
                    <input
                      {...register('contact_info.email')}
                      type="email"
                      className="input"
                      placeholder="Email"
                    />
                    <input
                      {...register('contact_info.website')}
                      className="input"
                      placeholder="Website"
                    />
                  </div>
                </div>

                {/* Opening Hours */}
                <div>
                  <label className="label">Horários de Funcionamento</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(DAYS_OF_WEEK).map(([day, label]) => (
                      <div key={day} className="flex items-center space-x-2">
                        <span className="w-24 text-accessible-sm">{label}:</span>
                        <input
                          {...register(`opening_hours.${day}` as const)}
                          className="input flex-1"
                          placeholder="09:00-18:00"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="label">Imagens</label>
                  <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <PhotoIcon className="w-12 h-12 text-secondary-400 mb-2" />
                      <span className="text-accessible-base text-secondary-600">
                        Clique para selecionar imagens
                      </span>
                    </label>
                  </div>

                  {/* Selected Images Preview */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`data:image/jpeg;base64,${image}`}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <PlusIcon className="w-5 h-5 mr-2" />
                    )}
                    {editingId ? 'Atualizar' : 'Criar'} Estabelecimento
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Establishments List */}
      <div className="space-y-4">
        {establishments.map((establishment) => (
          <div key={establishment.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-accessible-lg font-semibold text-secondary-800 mr-3">
                    {establishment.name}
                  </h3>
                  {establishment.certified_autism_friendly && (
                    <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                  )}
                  <span className="ml-2 bg-secondary-100 text-secondary-700 px-2 py-1 rounded text-accessible-sm">
                    {ESTABLISHMENT_TYPES[establishment.type as keyof typeof ESTABLISHMENT_TYPES]}
                  </span>
                </div>
                
                <p className="text-secondary-600 text-accessible-base mb-2 line-clamp-2">
                  {establishment.description}
                </p>
                
                <div className="flex items-center text-accessible-sm text-secondary-500">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {establishment.address}
                </div>
                
                {establishment.accessibility_features.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
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
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(establishment)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(establishment.id!)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {establishments.length === 0 && (
        <div className="text-center py-12">
          <MapPinIcon className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-accessible-xl font-semibold text-secondary-600 mb-2">
            Nenhum estabelecimento cadastrado
          </h3>
          <p className="text-accessible-base text-secondary-500 mb-4">
            Comece criando seu primeiro estabelecimento autism-friendly
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Criar Primeiro Estabelecimento
          </button>
        </div>
      )}
    </div>
  )
}