'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface ContactForm {
  nome: string
  email: string
  telefone?: string
  assunto: string
  tipo_contacto: 'geral' | 'estabelecimento' | 'tecnico' | 'parceria'
  mensagem: string
  rgpd_consent: boolean
}

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>()

  const tiposContacto = [
    { value: 'geral', label: 'Informações Gerais' },
    { value: 'estabelecimento', label: 'Sobre Estabelecimentos' },
    { value: 'tecnico', label: 'Suporte Técnico' },
    { value: 'parceria', label: 'Parcerias e Colaborações' }
  ]

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true)
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Dados do contacto:', data)
      toast.success('Mensagem enviada com sucesso! Responderemos em breve.')
      reset()
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-autism-calm py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-accessible-2xl md:text-5xl font-bold text-secondary-800 mb-6">
            Contacto
          </h1>
          <p className="text-accessible-xl text-secondary-700 mb-4 max-w-3xl mx-auto">
            Estamos aqui para ajudar. Entre em contacto connosco!
          </p>
          <p className="text-accessible-base text-secondary-600 max-w-4xl mx-auto">
            A sua opinião é fundamental para melhorarmos continuamente os nossos serviços 
            e tornar o Algarve ainda mais acessível e inclusivo.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Informações de Contacto */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-accessible-xl font-bold mb-6 text-secondary-800">
                Como nos contactar
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-1">Telefone</h3>
                    <p className="text-secondary-600">+351 289 000 000</p>
                    <p className="text-accessible-sm text-secondary-500">Segunda a Sexta, 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-1">Email</h3>
                    <p className="text-secondary-600">info@teia-algarve.pt</p>
                    <p className="text-accessible-sm text-secondary-500">Resposta em 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-1">Morada</h3>
                    <p className="text-secondary-600">
                      Rua da Inclusão, 123<br />
                      8000-000 Faro, Algarve<br />
                      Portugal
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-1">Horários</h3>
                    <div className="text-secondary-600 text-accessible-sm">
                      <p>Segunda a Sexta: 9h-18h</p>
                      <p>Sábado: 9h-13h</p>
                      <p>Domingo: Encerrado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contactos de Emergência */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 mr-2" />
                <h3 className="font-semibold text-amber-800">Suporte de Emergência</h3>
              </div>
              <p className="text-amber-700 text-accessible-sm mb-3">
                Para situações urgentes relacionadas com acessibilidade ou necessidades especiais durante a sua estadia:
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-amber-800">📞 +351 912 345 678</p>
                <p className="text-accessible-sm text-amber-600">
                  Disponível 24/7 para hóspedes registados
                </p>
              </div>
            </div>
          </div>

          {/* Formulário de Contacto */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center mb-6">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600 mr-3" />
                <h2 className="text-accessible-xl font-bold text-secondary-800">
                  Envie-nos uma mensagem
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Informações Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Nome Completo *</label>
                    <input
                      {...register('nome', { required: 'Nome é obrigatório' })}
                      className="input"
                      placeholder="O seu nome"
                    />
                    {errors.nome && (
                      <p className="text-red-500 text-accessible-sm mt-1">{errors.nome.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Email *</label>
                    <input
                      {...register('email', { 
                        required: 'Email é obrigatório',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido'
                        }
                      })}
                      type="email"
                      className="input"
                      placeholder="seu.email@exemplo.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-accessible-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Telefone (Opcional)</label>
                    <input
                      {...register('telefone')}
                      type="tel"
                      className="input"
                      placeholder="+351 xxx xxx xxx"
                    />
                  </div>

                  <div>
                    <label className="label">Tipo de Contacto *</label>
                    <select
                      {...register('tipo_contacto', { required: 'Selecione o tipo de contacto' })}
                      className="input"
                    >
                      <option value="">Selecione uma opção</option>
                      {tiposContacto.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                    {errors.tipo_contacto && (
                      <p className="text-red-500 text-accessible-sm mt-1">{errors.tipo_contacto.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Assunto *</label>
                  <input
                    {...register('assunto', { required: 'Assunto é obrigatório' })}
                    className="input"
                    placeholder="Resumo da sua mensagem"
                  />
                  {errors.assunto && (
                    <p className="text-red-500 text-accessible-sm mt-1">{errors.assunto.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Mensagem *</label>
                  <textarea
                    {...register('mensagem', { required: 'Mensagem é obrigatória' })}
                    rows={5}
                    className="input"
                    placeholder="Descreva a sua questão ou sugestão com o máximo de detalhes possível..."
                  />
                  {errors.mensagem && (
                    <p className="text-red-500 text-accessible-sm mt-1">{errors.mensagem.message}</p>
                  )}
                </div>

                {/* RGPD Consent */}
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <input
                      {...register('rgpd_consent', { required: 'Deve aceitar os termos de privacidade' })}
                      type="checkbox"
                      className="mt-1 mr-3 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <label className="text-accessible-sm text-secondary-700 cursor-pointer">
                        Aceito que os meus dados pessoais sejam processados de acordo com a 
                        <strong> Política de Privacidade da TEIA</strong> e o <strong>RGPD</strong>.
                        Os dados fornecidos serão utilizados exclusivamente para responder ao seu contacto 
                        e não serão partilhados com terceiros.
                      </label>
                      {errors.rgpd_consent && (
                        <p className="text-red-500 text-accessible-sm mt-1">{errors.rgpd_consent.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informação Adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-accessible-sm text-blue-700">
                      <p className="font-medium mb-1">Tempo de resposta:</p>
                      <ul className="space-y-1">
                        <li>• Informações gerais: 24-48 horas</li>
                        <li>• Questões técnicas: 48-72 horas</li>
                        <li>• Parcerias: 3-5 dias úteis</li>
                        <li>• Emergências: Resposta imediata por telefone</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary flex items-center"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                    )}
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Rápido */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-accessible-2xl font-bold text-center mb-12 text-secondary-800">
            Perguntas Frequentes
          </h2>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-secondary-800 mb-2">
                  Como posso certificar o meu estabelecimento?
                </h3>
                <p className="text-accessible-sm text-secondary-600">
                  Entre em contacto através do formulário selecionando "Parcerias e Colaborações". 
                  Enviaremos informações detalhadas sobre o processo de certificação.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary-800 mb-2">
                  Posso sugerir um estabelecimento?
                </h3>
                <p className="text-accessible-sm text-secondary-600">
                  Sim! Use o tipo "Sobre Estabelecimentos" no formulário e partilhe a sua sugestão. 
                  Todas as recomendações são avaliadas pela nossa equipe.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-secondary-800 mb-2">
                  Como reportar um problema no site?
                </h3>
                <p className="text-accessible-sm text-secondary-600">
                  Selecione "Suporte Técnico" no formulário e descreva detalhadamente o problema. 
                  Inclua informações sobre o dispositivo e navegador utilizados.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary-800 mb-2">
                  Os meus dados estão seguros?
                </h3>
                <p className="text-accessible-sm text-secondary-600">
                  Sim, seguimos rigorosamente o RGPD. Os seus dados são encriptados e utilizados 
                  apenas para responder ao seu contacto, nunca partilhados com terceiros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}