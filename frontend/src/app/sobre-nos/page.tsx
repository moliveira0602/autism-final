'use client'

import { 
  HeartIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  GlobeEuropeAfricaIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SobreNosPage() {
  const { language } = useLanguage()
  const valores = [
    {
      icon: HeartIcon,
      title: "Inclusão",
      description: "Acreditamos que todos merecem experiências turísticas memoráveis, independentemente das suas necessidades específicas."
    },
    {
      icon: ShieldCheckIcon,
      title: "Confiança",
      description: "Garantimos informações precisas e atualizadas sobre a acessibilidade de cada estabelecimento."
    },
    {
      icon: UserGroupIcon,
      title: "Comunidade",
      description: "Construímos uma rede de apoio entre famílias, estabelecimentos e profissionais especializados."
    },
    {
      icon: AcademicCapIcon,
      title: "Educação",
      description: "Promovemos a sensibilização e formação sobre necessidades neuromodeladas e autismo."
    }
  ]

  const equipe = [
    {
      nome: "Dra. Ana Silva",
      cargo: "Diretora Executiva",
      especialidade: "Psicologia do Desenvolvimento",
      descricao: "Especialista em Transtorno do Espectro Autista com 15 anos de experiência."
    },
    {
      nome: "Prof. João Santos",
      cargo: "Consultor Técnico",
      especialidade: "Terapia Ocupacional",
      descricao: "Especialista em acessibilidade e adaptações ambientais para neurodesenvolvimento."
    },
    {
      nome: "Maria Costa",
      cargo: "Coordenadora de Parcerias",
      especialidade: "Turismo Inclusivo",
      descricao: "Responsável pelo relacionamento com estabelecimentos e certificações."
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-autism-calm py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-accessible-2xl md:text-5xl font-bold text-secondary-800 mb-6">
            {language === 'pt' ? 'Sobre a TEIA' : 'About TEIA'}
          </h1>
          <p className="text-accessible-xl text-secondary-700 mb-4 max-w-3xl mx-auto">
            {language === 'pt' 
              ? 'Conectando famílias a experiências turísticas inclusivas no Algarve'
              : 'Connecting families to inclusive tourism experiences in the Algarve'
            }
          </p>
          <p className="text-accessible-base text-secondary-600 max-w-4xl mx-auto leading-relaxed">
            A TEIA nasceu da necessidade de criar uma ponte entre famílias com pessoas neuromodeladas 
            e estabelecimentos preparados para oferecer experiências verdadeiramente inclusivas no Algarve.
          </p>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-accessible-2xl font-bold text-center mb-12 text-secondary-800">
              Nossa Missão
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-accessible-xl font-semibold mb-4 text-secondary-800">
                  Transformar o Turismo no Algarve
                </h3>
                <p className="text-accessible-base text-secondary-600 mb-6 leading-relaxed">
                  Trabalhamos para que o Algarve se torne um destino de referência mundial em turismo inclusivo, 
                  onde pessoas com necessidades neuromodeladas e suas famílias possam desfrutar de férias 
                  verdadeiramente relaxantes e enriquecedoras.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <GlobeEuropeAfricaIcon className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-1">Impacto Regional</h4>
                      <p className="text-accessible-sm text-secondary-600">
                        Posicionamos o Algarve como líder em turismo acessível na Europa
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <HandRaisedIcon className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-1">Apoio Especializado</h4>
                      <p className="text-accessible-sm text-secondary-600">
                        Oferecemos suporte técnico e formação contínua aos nossos parceiros
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary-100 to-autism-calm p-8 rounded-xl">
                <h3 className="text-accessible-xl font-semibold mb-6 text-secondary-800">
                  O que nos move
                </h3>
                <blockquote className="text-accessible-base text-secondary-700 italic leading-relaxed">
                  "Acreditamos que viajar é um direito fundamental de todas as pessoas. 
                  Nossa paixão é garantir que famílias com necessidades especiais possam 
                  criar memórias inesquecíveis no nosso belo Algarve, sem preocupações 
                  ou barreiras desnecessárias."
                </blockquote>
                <cite className="block mt-4 text-accessible-sm font-semibold text-primary-700">
                  — Equipe TEIA
                </cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-accessible-2xl font-bold text-center mb-12 text-secondary-800">
            Nossos Valores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => (
              <div key={index} className="card text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-autism-friendly rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <valor.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-accessible-xl font-semibold mb-3 text-secondary-800">
                  {valor.title}
                </h3>
                <p className="text-accessible-base text-secondary-600 leading-relaxed">
                  {valor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-accessible-2xl font-bold text-center mb-12 text-secondary-800">
            Nossa Equipe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {equipe.map((membro, index) => (
              <div key={index} className="card text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-autism-calm rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-accessible-xl font-semibold mb-2 text-secondary-800">
                  {membro.nome}
                </h3>
                <div className="text-primary-600 font-medium mb-1">
                  {membro.cargo}
                </div>
                <div className="text-accessible-sm text-secondary-500 mb-3">
                  {membro.especialidade}
                </div>
                <p className="text-accessible-base text-secondary-600 leading-relaxed">
                  {membro.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificações e Parcerias */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-accessible-2xl font-bold mb-8 text-secondary-800">
            Certificações e Parcerias
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl border border-primary-200">
                <ShieldCheckIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-accessible-xl font-semibold mb-3 text-secondary-800">
                  Certificação Internacional
                </h3>
                <p className="text-accessible-base text-secondary-600">
                  Seguimos as diretrizes internacionais de acessibilidade e turismo inclusivo, 
                  garantindo os mais altos padrões de qualidade.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-primary-200">
                <UserGroupIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-accessible-xl font-semibold mb-3 text-secondary-800">
                  Parcerias Estratégicas
                </h3>
                <p className="text-accessible-base text-secondary-600">
                  Colaboramos com organizações especializadas em autismo, universidades 
                  e entidades do setor turístico do Algarve.
                </p>
              </div>
            </div>
            
            <div className="mt-8 bg-autism-calm p-6 rounded-xl">
              <p className="text-accessible-lg font-medium text-secondary-800 mb-2">
                Conforme com RGPD
              </p>
              <p className="text-accessible-base text-secondary-600">
                Todos os dados pessoais são tratados de acordo com o Regulamento Geral 
                sobre a Proteção de Dados (RGPD), garantindo máxima privacidade e segurança.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}