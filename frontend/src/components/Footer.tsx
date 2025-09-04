'use client'

import Link from 'next/link'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface FooterProps {
  language?: 'pt' | 'en'
}

export default function Footer({ language = 'pt' }: FooterProps) {
  const content = {
    pt: {
      footerAbout: "Sobre a TEIA",
      footerAboutText: "A TEIA é uma plataforma dedicada ao turismo inclusivo no Algarve, conectando famílias com estabelecimentos preparados para receber pessoas com TEA.",
      footerQuickLinks: "Links Rápidos",
      footerContact: "Contato",
      footerRights: "Todos os direitos reservados.",
      footerMadeWith: "Feito com",
      footerFor: "para famílias especiais"
    },
    en: {
      footerAbout: "About TEIA",
      footerAboutText: "TEIA is a platform dedicated to inclusive tourism in the Algarve, connecting families with establishments prepared to welcome people with ASD.",
      footerQuickLinks: "Quick Links",
      footerContact: "Contact",
      footerRights: "All rights reserved.",
      footerMadeWith: "Made with",
      footerFor: "for special families"
    }
  }

  const t = content[language]

  return (
    <footer 
      className="relative bg-secondary-800 text-white"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1634681974664-d46e36f5c578)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-secondary-800/85"></div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-autism-friendly rounded-lg flex items-center justify-center mr-3">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-accessible-xl font-bold">TEIA</span>
            </div>
            <h3 className="text-accessible-lg font-semibold mb-3">{t.footerAbout}</h3>
            <p className="text-secondary-300 text-accessible-base leading-relaxed mb-4">
              {t.footerAboutText}
            </p>
            <div className="flex items-center text-secondary-300">
              <span className="mr-2">{t.footerMadeWith}</span>
              <HeartSolidIcon className="w-5 h-5 text-red-400 mx-1" />
              <span>{t.footerFor}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-accessible-lg font-semibold mb-4">{t.footerQuickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-secondary-300 hover:text-white transition-colors text-accessible-base">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/sobre-nos" className="text-secondary-300 hover:text-white transition-colors text-accessible-base">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/nossa-teia" className="text-secondary-300 hover:text-white transition-colors text-accessible-base">
                  Nossa Teia
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-secondary-300 hover:text-white transition-colors text-accessible-base">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-accessible-lg font-semibold mb-4">{t.footerContact}</h3>
            <div className="space-y-3">
              <div className="flex items-center text-secondary-300">
                <span className="text-accessible-base">+351 289 000 000</span>
              </div>
              <div className="flex items-center text-secondary-300">
                <span className="text-accessible-base">info@teia-algarve.pt</span>
              </div>
              <div className="flex items-center text-secondary-300">
                <span className="text-accessible-base">www.teia-algarve.pt</span>
              </div>
              <div className="flex items-center text-secondary-300">
                <span className="text-accessible-base">Algarve, Portugal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-700 mt-12 pt-8 text-center">
          <p className="text-secondary-400 text-accessible-base">
            © 2025 TEIA - Algarve Autism Friendly. {t.footerRights}
          </p>
        </div>
      </div>
    </footer>
  )
}