'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  InformationCircleIcon,
  MapPinIcon,
  PhoneIcon,
  UserCircleIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { href: '/', label: 'Início', icon: HomeIcon },
    { href: '/sobre-nos', label: 'Sobre Nós', icon: InformationCircleIcon },
    { href: '/nossa-teia', label: 'Nossa Teia', icon: MapPinIcon },
    { href: '/contacto', label: 'Contacto', icon: PhoneIcon },
  ]

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

          {/* Login Button */}
          <div className="hidden md:block">
            <Link
              href="/login"
              className="btn btn-primary flex items-center space-x-2"
            >
              <UserCircleIcon className="w-5 h-5" />
              <span>Login</span>
            </Link>
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
              
              {/* Mobile Login */}
              <Link
                href="/login"
                className="flex items-center space-x-3 px-4 py-3 text-accessible-base bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Login</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}