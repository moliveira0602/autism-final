'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  MapPinIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { href: '/', label: 'Início', icon: HomeIcon },
    { href: '/establishments', label: 'Locais', icon: MapPinIcon },
    { href: '/profile', label: 'Perfil', icon: UserCircleIcon },
    { href: '/admin', label: 'Admin', icon: Cog6ToothIcon },
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
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}