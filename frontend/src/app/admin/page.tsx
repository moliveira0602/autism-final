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
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import AdminFooter from '@/components/AdminFooter'
import Header from '@/components/Header'

// User Creation Form Component
interface CreateUserFormProps {
  onSuccess: () => void
  onCancel: () => void
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const { register: registerUser, handleSubmit: handleUserSubmit, formState: { errors: userErrors } } = useForm()

  const onSubmitUser = async (data: any) => {
    setLoading(true)
    try {
      const userPayload = {
        name: data.name,
        email: data.email,
        sensory_profile: {
          noise_sensitivity: data.noise_sensitivity || 'moderate',
          light_sensitivity: data.light_sensitivity || 'moderate',
          crowd_tolerance: data.crowd_tolerance || 'moderate',
          communication_needs: data.communication_needs || 'Verbal completa',
          specific_triggers: data.specific_triggers ? data.specific_triggers.split(',').map((t: string) => t.trim()) : [],
          preferred_times: data.preferred_times ? data.preferred_times.split(',').map((t: string) => t.trim()) : []
        },
        language_preference: data.language_preference || 'pt'
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      })

      if (response.ok) {
        onSuccess()
      } else {
        const errorText = await response.text()
        console.error('Error creating user:', errorText)
        toast.error('Erro ao criar usuário: ' + response.statusText)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Erro ao criar usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUserSubmit(onSubmitUser)} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Nome *</label>
          <input
            {...registerUser('name', { required: 'Nome é obrigatório' })}
            className="input"
            placeholder="Nome completo do usuário"
          />
          {userErrors.name && (
            <p className="text-red-500 text-accessible-sm mt-1">{userErrors.name.message}</p>
          )}
        </div>

        <div>
          <label className="label">Email *</label>
          <input
            {...registerUser('email', { 
              required: 'Email é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            type="email"
            className="input"
            placeholder="email@exemplo.com"
          />
          {userErrors.email && (
            <p className="text-red-500 text-accessible-sm mt-1">{userErrors.email.message}</p>
          )}
        </div>
      </div>

      {/* Sensory Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Sensibilidade ao Ruído</label>
          <select {...registerUser('noise_sensitivity')} className="input">
            <option value="very_low">Muito Baixo</option>
            <option value="low">Baixo</option>
            <option value="moderate" selected>Moderado</option>
            <option value="high">Alto</option>
            <option value="very_high">Muito Alto</option>
          </select>
        </div>

        <div>
          <label className="label">Sensibilidade à Luz</label>
          <select {...registerUser('light_sensitivity')} className="input">
            <option value="very_low">Muito Baixo</option>
            <option value="low">Baixo</option>
            <option value="moderate" selected>Moderado</option>
            <option value="high">Alto</option>
            <option value="very_high">Muito Alto</option>
          </select>
        </div>

        <div>
          <label className="label">Tolerância a Multidões</label>
          <select {...registerUser('crowd_tolerance')} className="input">
            <option value="very_low">Muito Baixo</option>
            <option value="low">Baixo</option>
            <option value="moderate" selected>Moderado</option>
            <option value="high">Alto</option>
            <option value="very_high">Muito Alto</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Necessidades de Comunicação</label>
          <select {...registerUser('communication_needs')} className="input">
            <option value="Verbal completa">Verbal completa</option>
            <option value="Verbal limitada">Verbal limitada</option>
            <option value="Comunicação por gestos">Comunicação por gestos</option>
            <option value="Comunicação visual/cartões">Comunicação visual/cartões</option>
            <option value="Dispositivos de comunicação">Dispositivos de comunicação</option>
            <option value="Não verbal">Não verbal</option>
          </select>
        </div>

        <div>
          <label className="label">Idioma Preferido</label>
          <select {...registerUser('language_preference')} className="input">
            <option value="pt">🇵🇹 Português</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Gatilhos Específicos</label>
        <input
          {...registerUser('specific_triggers')}
          className="input"
          placeholder="Separe por vírgulas: Ruídos altos, Luzes piscantes, Multidões"
        />
        <p className="text-accessible-sm text-secondary-500 mt-1">
          Liste os gatilhos separados por vírgulas
        </p>
      </div>

      <div>
        <label className="label">Horários Preferidos</label>
        <input
          {...registerUser('preferred_times')}
          className="input"
          placeholder="Separe por vírgulas: Manhã (9h-12h), Tarde (12h-15h)"
        />
        <p className="text-accessible-sm text-secondary-500 mt-1">
          Liste os horários preferidos separados por vírgulas
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Criando...
            </>
          ) : (
            <>
              <UserPlusIcon className="w-4 h-4 mr-2" />
              Criar Usuário
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'establishments' | 'users' | 'partners'>('establishments')
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showPartnersForm, setShowPartnersForm] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [addressSearching, setAddressSearching] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Establishment>()

  useEffect(() => {
    fetchEstablishments()
    fetchUsers()
    fetchPartners()
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

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners')
      if (response.ok) {
        const data = await response.json()
        setPartners(data)
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      toast.error('Erro ao carregar parceiros')
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

  const searchCoordinatesFromAddress = async () => {
    const address = watch('address')
    if (!address) {
      toast.error('Digite o endereço primeiro')
      return
    }

    setAddressSearching(true)
    try {
      // Simple pattern matching for Portuguese addresses
      const addressLower = address.toLowerCase()
      
      // Try to find a match with known Algarve cities
      for (const [key, city] of Object.entries(ALGARVE_CITIES)) {
        if (addressLower.includes(city.name.toLowerCase())) {
          setValue('coordinates.lat', city.lat)
          setValue('coordinates.lng', city.lng)
          toast.success(`Coordenadas definidas para ${city.name}`)
          setAddressSearching(false)
          return
        }
      }

      // Default to Faro if no specific city found but address contains "Algarve"
      if (addressLower.includes('algarve')) {
        setValue('coordinates.lat', ALGARVE_CITIES.faro.lat)
        setValue('coordinates.lng', ALGARVE_CITIES.faro.lng)
        toast.success('Coordenadas definidas para Faro (padrão do Algarve)')
      } else {
        toast.error('Não foi possível determinar coordenadas. Selecione uma cidade ou digite manualmente.')
      }
    } catch (error) {
      toast.error('Erro ao procurar coordenadas')
    } finally {
      setAddressSearching(false)
    }
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl mt-16">
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
          className={`btn-with-icon px-4 py-2 rounded-md text-accessible-base font-medium transition-colors ${
            activeTab === 'establishments'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-secondary-600 hover:text-secondary-800'
          }`}
        >
          <BuildingOfficeIcon className="w-5 h-5" />
          Estabelecimentos ({establishments.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn-with-icon px-4 py-2 rounded-md text-accessible-base font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-secondary-600 hover:text-secondary-800'
          }`}
        >
          <UsersIcon className="w-5 h-5" />
          Usuários ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('partners')}
          className={`btn-with-icon px-4 py-2 rounded-md text-accessible-base font-medium transition-colors ${
            activeTab === 'partners'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-secondary-600 hover:text-secondary-800'
          }`}
        >
          <HeartIcon className="w-5 h-5" />
          Parceiros ({partners.length})
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
              className="btn btn-primary btn-with-icon"
            >
              <PlusIcon className="w-5 h-5" />
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
              onClick={() => setShowCreateUser(!showCreateUser)}
              className="btn btn-primary btn-with-icon"
            >
              <UserPlusIcon className="w-5 h-5" />
              {showCreateUser ? 'Cancelar' : 'Criar Usuário'}
            </button>
          </div>

          {/* Create User Form */}
          {showCreateUser && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-accessible-xl font-semibold text-secondary-800 mb-4">
                Criar Novo Usuário
              </h3>
              <CreateUserForm 
                onSuccess={() => {
                  setShowCreateUser(false)
                  fetchUsers()
                  toast.success('Usuário criado com sucesso!')
                }}
                onCancel={() => setShowCreateUser(false)}
              />
            </div>
          )}

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
                      onClick={() => window.location.href = `/profile?userId=${user.id}`}
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
                onClick={() => setShowCreateUser(true)}
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

                {/* Address and Location */}
                <div className="space-y-6">
                  <div>
                    <label className="label">Endereço Completo *</label>
                    <textarea
                      {...register('address', { required: 'Endereço é obrigatório' })}
                      className="input"
                      rows={2}
                      placeholder="Ex: Rua do Mar, 123, Quarteira, 8125-000 Loulé, Algarve, Portugal"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-accessible-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  {/* City/Region Selector for Algarve */}
                  <div>
                    <label className="label">Cidade/Região do Algarve</label>
                    <select
                      onChange={(e) => {
                        const selectedCity = e.target.value
                        if (selectedCity) {
                          const cityData = ALGARVE_CITIES[selectedCity as keyof typeof ALGARVE_CITIES]
                          setValue('coordinates.lat', cityData.lat)
                          setValue('coordinates.lng', cityData.lng)
                        }
                      }}
                      className="input"
                    >
                      <option value="">Selecione a cidade para coordenadas automáticas</option>
                      {Object.entries(ALGARVE_CITIES).map(([key, city]) => (
                        <option key={key} value={key}>{city.name}</option>
                      ))}
                    </select>
                    <p className="text-accessible-sm text-secondary-500 mt-1">
                      As coordenadas serão preenchidas automaticamente baseadas na cidade selecionada
                    </p>
                  </div>

                  {/* Coordinates - now optional and auto-filled */}
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <h4 className="font-medium text-secondary-800 mb-3 flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2" />
                      Coordenadas GPS (Preenchimento Automático)
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <button
                        type="button"
                        onClick={searchCoordinatesFromAddress}
                        disabled={addressSearching}
                        className="btn btn-secondary btn-with-icon"
                      >
                        {addressSearching ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                        ) : (
                          <MapPinIcon className="w-4 h-4" />
                        )}
                        {addressSearching ? 'Procurando...' : 'Buscar do Endereço'}
                      </button>
                      
                      <div className="text-accessible-sm text-secondary-600 flex items-center">
                        <span>💡 Digite o endereço acima e clique para encontrar coordenadas automaticamente</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Latitude</label>
                        <input
                          {...register('coordinates.lat')}
                          type="number"
                          step="any"
                          className="input bg-white"
                          placeholder="37.0000"
                          readOnly={false}
                        />
                        <p className="text-accessible-sm text-secondary-500 mt-1">
                          Preenchido automaticamente ou ajuste manualmente
                        </p>
                      </div>
                      <div>
                        <label className="label">Longitude</label>
                        <input
                          {...register('coordinates.lng')}
                          type="number"
                          step="any"
                          className="input bg-white"
                          placeholder="-8.0000"
                          readOnly={false}
                        />
                        <p className="text-accessible-sm text-secondary-500 mt-1">
                          Preenchido automaticamente ou ajuste manualmente
                        </p>
                      </div>
                    </div>
                    
                    {/* Coordinates Preview */}
                    <div className="mt-3">
                      <p className="text-accessible-sm text-secondary-600">
                        <strong>Dica:</strong> Se as coordenadas não estiverem corretas, pode ajustá-las manualmente ou usar ferramentas como Google Maps para obter coordenadas precisas.
                      </p>
                    </div>
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
                    className="btn btn-primary btn-with-icon"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <PlusIcon className="w-5 h-5" />
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
      
      <AdminFooter />
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

const ALGARVE_CITIES = {
  faro: { name: 'Faro', lat: 37.0194, lng: -7.9322 },
  lagos: { name: 'Lagos', lat: 37.1017, lng: -8.6689 },
  portimao: { name: 'Portimão', lat: 37.1364, lng: -8.5378 },
  albufeira: { name: 'Albufeira', lat: 37.0879, lng: -8.2507 },
  vilamoura: { name: 'Vilamoura', lat: 37.0833, lng: -8.1167 },
  quarteira: { name: 'Quarteira', lat: 37.0689, lng: -8.1000 },
  loule: { name: 'Loulé', lat: 37.1364, lng: -8.0206 },
  olhao: { name: 'Olhão', lat: 37.0267, lng: -7.8400 },
  tavira: { name: 'Tavira', lat: 37.1270, lng: -7.6492 },
  sagres: { name: 'Sagres', lat: 37.0059, lng: -8.9478 },
  monchique: { name: 'Monchique', lat: 37.3167, lng: -8.5549 },
  silves: { name: 'Silves', lat: 37.1911, lng: -8.4392 },
  armacao_pera: { name: 'Armação de Pêra', lat: 37.1022, lng: -8.3500 },
  carvoeiro: { name: 'Carvoeiro', lat: 37.0959, lng: -8.4667 },
  alvor: { name: 'Alvor', lat: 37.1333, lng: -8.5833 },
  monte_gordo: { name: 'Monte Gordo', lat: 37.1800, lng: -7.4431 },
  castro_marim: { name: 'Castro Marim', lat: 37.2186, lng: -7.4433 },
  vila_real_santo_antonio: { name: 'Vila Real de Santo António', lat: 37.1942, lng: -7.4147 },
  aljezur: { name: 'Aljezur', lat: 37.3181, lng: -8.8031 },
  vila_do_bispo: { name: 'Vila do Bispo', lat: 37.0833, lng: -8.9167 }
}