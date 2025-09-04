'use client'

import Link from 'next/link'
import { 
  UserCircleIcon,
  HeartIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export default function UserFooter() {
  return (
    <footer className="bg-gradient-to-r from-primary-100 to-autism-calm text-secondary-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* User Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-autism-friendly rounded-lg flex items-center justify-center mr-3">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-accessible-lg font-bold">TEIA Dashboard</span>
            </div>
            <p className="text-secondary-600 text-accessible-sm leading-relaxed">
              Seu espaço personalizado para explorar o Algarve de forma inclusiva.
            </p>
          </div>

          {/* User Actions */}
          <div>
            <h3 className="text-accessible-base font-semibold mb-4">Suas Atividades</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-secondary-600 hover:text-primary-600 transition-colors text-accessible-sm flex items-center">
                  <UserCircleIcon className="w-4 h-4 mr-2" />
                  Meu Perfil
                </Link>
              </li>
              <li>
                <Link href="/nossa-teia" className="text-secondary-600 hover:text-primary-600 transition-colors text-accessible-sm flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  Explorar Locais
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-secondary-600 hover:text-primary-600 transition-colors text-accessible-sm flex items-center">
                  <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
                  Minhas Avaliações
                </Link>
              </li>
            </ul>
          </div>

          {/* Personalized Tips */}
          <div>
            <h3 className="text-accessible-base font-semibold mb-4">Dicas Personalizadas</h3>
            <div className="space-y-2">
              <div className="flex items-center text-secondary-600 text-accessible-sm">
                <StarIcon className="w-4 h-4 mr-2 text-yellow-500 fill-current" />
                <span>Locais recomendados</span>
              </div>
              <div className="flex items-center text-secondary-600 text-accessible-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Horários ideais</span>
              </div>
              <div className="flex items-center text-secondary-600 text-accessible-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Ambiente adequado</span>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div>
            <h3 className="text-accessible-base font-semibold mb-4">Gestão da Conta</h3>
            <div className="space-y-3">
              <Link href="/profile" className="text-secondary-600 hover:text-primary-600 transition-colors text-accessible-sm flex items-center">
                <Cog6ToothIcon className="w-4 h-4 mr-2" />
                Configurações
              </Link>
              
              {/* Separator */}
              <div className="border-t border-secondary-300 my-3"></div>
              
              <div>
                <h4 className="text-accessible-sm font-semibold text-secondary-700 mb-2">Ajuda & Informações</h4>
                <div className="space-y-2 pl-2">
                  <Link href="/sobre-nos" className="text-secondary-600 hover:text-primary-600 transition-colors text-accessible-sm block">
                    Sobre a TEIA
                  </Link>
                  <Link href="/contacto" className="text-secondary-600 hover:text-primary-600 transition-colors text-accessible-sm block">
                    Suporte
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom User Bar */}
        <div className="border-t border-secondary-300 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-secondary-600">
              <span className="mr-2 text-accessible-sm">Criado com</span>
              <HeartSolidIcon className="w-4 h-4 text-red-500 mx-1" />
              <span className="text-accessible-sm">para você e sua família</span>
            </div>
            <p className="text-secondary-500 text-accessible-sm mt-2 md:mt-0">
              © 2025 TEIA - Turismo Inclusivo no Algarve
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}