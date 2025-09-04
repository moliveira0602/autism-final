'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  InformationCircleIcon,
  MapPinIcon,
  PhoneIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

interface HeaderProps {
  language?: 'pt' | 'en'
  onLanguageChange?: (language: 'pt' | 'en') => void
}

export default function Header({ language = 'pt', onLanguageChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const navigationItems = [
    { href: '/', label: 'Início', icon: HomeIcon },
    { href: '/sobre-nos', label: 'Sobre Nós', icon: InformationCircleIcon },
    { href: '/nossa-teia', label: 'Nossa Teia', icon: MapPinIcon },
    { href: '/contacto', label: 'Contacto', icon: PhoneIcon },
  ]

  const handleLogout = () => {
    logout()
    toast.success('Sessão terminada com sucesso')
    router.push('/')
    setIsMenuOpen(false)
  }

  const handleLoginClick = () => {
    router.push('/login')
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-secondary-200 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-autism-friendly rounded-lg flex items-center justify-center">
              <HeartIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-accessible-xl font-bold text-secondary-800">
              TEIA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 text-accessible-base text-secondary-600 hover:text-primary-600 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions & Language */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector - Discrete */}
            <div className="relative">
              <button
                onClick={() => onLanguageChange?.(language === 'pt' ? 'en' : 'pt')}
                className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-secondary-100 transition-colors text-secondary-600 hover:text-secondary-800"
                title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
              >
                <GlobeAltIcon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {language === 'pt' ? '🇵🇹' : '🇬🇧'}
                </span>
              </button>
            </div>

            {/* User Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-accessible-sm font-medium text-secondary-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {user?.role === 'admin' ? 'Administrador' : 'Utilizador'}
                  </p>
                </div>
                <Link
                  href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span>Painel</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="btn btn-primary flex items-center space-x-2"
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6 text-secondary-600" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-secondary-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-accessible-base text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="border-t border-secondary-200 pt-4 mt-4">
                <button
                  onClick={() => onLanguageChange?.(language === 'pt' ? 'en' : 'pt')}
                  className="flex items-center space-x-3 px-4 py-3 text-accessible-base text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 rounded-lg transition-colors w-full text-left"
                  title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
                >
                  <GlobeAltIcon className="w-5 h-5" />
                  <span className="flex items-center space-x-2">
                    <span>Idioma:</span>
                    <span className="font-medium">
                      {language === 'pt' ? '🇵🇹 Português' : '🇬🇧 English'}
                    </span>
                  </span>
                </button>
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t border-secondary-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2">
                      <p className="font-medium text-secondary-800">{user?.name}</p>
                      <p className="text-xs text-secondary-500">
                        {user?.role === 'admin' ? 'Administrador' : 'Utilizador'}
                      </p>
                    </div>
                    <Link
                      href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                      className="flex items-center space-x-3 px-4 py-3 text-accessible-base bg-secondary-50 text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <span>Painel</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 text-accessible-base bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors w-full text-left"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Sair</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="flex items-center space-x-3 px-4 py-3 text-accessible-base bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors w-full text-left"
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}