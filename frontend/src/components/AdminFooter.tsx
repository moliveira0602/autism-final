'use client'

import Link from 'next/link'
import { 
  ShieldCheckIcon,
  Cog8ToothIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function AdminFooter() {
  return (
    <footer className="bg-secondary-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Admin Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center mr-3">
                <ShieldCheckIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-accessible-lg font-bold">TEIA Admin</span>
            </div>
            <p className="text-secondary-300 text-accessible-sm leading-relaxed">
              Painel administrativo para gestão completa da plataforma TEIA.
            </p>
          </div>

          {/* Admin Tools */}
          <div>
            <h3 className="text-accessible-base font-semibold mb-4 text-secondary-100">Ferramentas Admin</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/admin" className="text-secondary-300 hover:text-white transition-colors text-accessible-sm flex items-center">
                  <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                  Estabelecimentos
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-secondary-300 hover:text-white transition-colors text-accessible-sm flex items-center">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Utilizadores
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-secondary-300 hover:text-white transition-colors text-accessible-sm flex items-center">
                  <ChartBarIcon className="w-4 h-4 mr-2" />
                  Estatísticas
                </Link>
              </li>
            </ul>
          </div>

          {/* System Status */}
          <div>
            <h3 className="text-accessible-base font-semibold mb-4 text-secondary-100">Sistema</h3>
            <div className="space-y-2">
              <div className="flex items-center text-secondary-300 text-accessible-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>API Operacional</span>
              </div>
              <div className="flex items-center text-secondary-300 text-accessible-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Base de Dados OK</span>
              </div>
              <div className="flex items-center text-secondary-300 text-accessible-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span>Backups Agendados</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-accessible-base font-semibold mb-4 text-secondary-100">Ações Rápidas</h3>
            <div className="space-y-2">
              <Link href="/admin" className="text-secondary-300 hover:text-white transition-colors text-accessible-sm flex items-center">
                <Cog8ToothIcon className="w-4 h-4 mr-2" />
                Configurações
              </Link>
              <Link href="/admin" className="text-secondary-300 hover:text-white transition-colors text-accessible-sm flex items-center">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Relatórios
              </Link>
              <Link href="/" className="text-secondary-300 hover:text-white transition-colors text-accessible-sm">
                ← Voltar ao Site
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Admin Bar */}
        <div className="border-t border-secondary-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-accessible-sm">
              © 2025 TEIA Admin Panel - Acesso Restrito
            </p>
            <div className="text-secondary-400 text-accessible-sm mt-2 md:mt-0">
              Última atualização: {new Date().toLocaleDateString('pt-PT')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}