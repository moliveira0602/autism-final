'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'pt' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, section?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translations object
const translations = {
  pt: {
    // Common
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    save: 'Guardar',
    cancel: 'Cancelar',
    submit: 'Enviar',
    close: 'Fechar',
    
    // Navigation
    home: 'Início',
    about: 'Sobre Nós',
    ourNetwork: 'Nossa Teia',
    contact: 'Contacto',
    login: 'Login',
    logout: 'Sair',
    panel: 'Painel',
    admin: 'Administrador',
    user: 'Utilizador',
    
    // Home Page
    homeTitle: 'TEIA - Algarve Autism Friendly',
    homeSubtitle: 'Turismo inclusivo para pessoas com TEA e suas famílias',
    homeDescription: 'Descubra lugares amigáveis e acessíveis no Algarve, especialmente preparados para pessoas com Transtorno do Espectro do Autismo. Viaje com confiança e tranquilidade.',
    exploreButton: 'Explorar Nossa Teia',
    aboutButton: 'Conhecer a TEIA',
    featuresTitle: 'Por que escolher a TEIA?',
    statsTitle: 'Nossa Comunidade',
    establishmentsLabel: 'Estabelecimentos',
    certifiedLabel: 'Certificados',
    familiesLabel: 'Famílias Felizes',
    featuredTitle: 'Estabelecimentos em Destaque',
    viewAll: 'Ver Todos',
    
    // About Page
    aboutTitle: 'Sobre a TEIA',
    aboutSubtitle: 'Conectando famílias a experiências turísticas inclusivas no Algarve',
    aboutDescription: 'A TEIA nasceu da necessidade de criar uma ponte entre famílias com pessoas neuromodeladas e estabelecimentos preparados para oferecer experiências verdadeiramente inclusivas no Algarve.',
    missionTitle: 'Nossa Missão',
    valuesTitle: 'Nossos Valores',
    teamTitle: 'Nossa Equipe',
    
    // Nossa Teia Page
    networkTitle: 'Estabelecimentos Autism Friendly no Algarve',
    networkSubtitle: 'Descubra locais preparados para receber pessoas com TEA e suas famílias. Explore o mapa interativo e encontre informações detalhadas sobre cada estabelecimento.',
    searchPlaceholder: 'Pesquisar estabelecimentos...',
    filtersButton: 'Filtros',
    establishmentsFound: 'estabelecimento encontrado',
    establishmentsFoundPlural: 'estabelecimentos encontrados',
    noEstablishmentsFound: 'Nenhum estabelecimento encontrado',
    adjustFilters: 'Tente ajustar os filtros ou fazer uma nova pesquisa',
    clearFilters: 'Limpar Filtros',
    seeDetails: 'Ver Detalhes',
    certified: 'Certificado',
    reviews: 'avaliações',
    
    // Contact Page
    contactTitle: 'Entre em Contacto',
    contactSubtitle: 'Estamos aqui para ajudar. Envie-nos a sua mensagem e responderemos o mais breve possível.',
    
    // Footer
    footerAbout: 'Sobre a TEIA',
    footerAboutText: 'A TEIA é uma plataforma dedicada ao turismo inclusivo no Algarve, conectando famílias com estabelecimentos preparados para receber pessoas com TEA.',
    footerQuickLinks: 'Links Rápidos',
    footerContact: 'Contato',
    footerRights: 'Todos os direitos reservados.',
    footerMadeWith: 'Feito com',
    footerFor: 'para famílias especiais'
  },
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    close: 'Close',
    
    // Navigation
    home: 'Home',
    about: 'About Us',
    ourNetwork: 'Our Network',
    contact: 'Contact',
    login: 'Login',
    logout: 'Logout',
    panel: 'Panel',
    admin: 'Administrator',
    user: 'User',
    
    // Home Page
    homeTitle: 'TEIA - Algarve Autism Friendly',
    homeSubtitle: 'Inclusive tourism for people with ASD and their families',
    homeDescription: 'Discover friendly and accessible places in the Algarve, specially prepared for people with Autism Spectrum Disorder. Travel with confidence and peace of mind.',
    exploreButton: 'Explore Our Network',
    aboutButton: 'About TEIA',
    featuresTitle: 'Why choose TEIA?',
    statsTitle: 'Our Community',
    establishmentsLabel: 'Establishments',
    certifiedLabel: 'Certified',
    familiesLabel: 'Happy Families',
    featuredTitle: 'Featured Establishments',
    viewAll: 'View All',
    
    // About Page
    aboutTitle: 'About TEIA',
    aboutSubtitle: 'Connecting families to inclusive tourism experiences in the Algarve',
    aboutDescription: 'TEIA was born from the need to create a bridge between families with neuromodeled people and establishments prepared to offer truly inclusive experiences in the Algarve.',
    missionTitle: 'Our Mission',
    valuesTitle: 'Our Values',
    teamTitle: 'Our Team',
    
    // Nossa Teia Page
    networkTitle: 'Autism Friendly Establishments in Algarve',
    networkSubtitle: 'Discover places prepared to welcome people with ASD and their families. Explore the interactive map and find detailed information about each establishment.',
    searchPlaceholder: 'Search establishments...',
    filtersButton: 'Filters',
    establishmentsFound: 'establishment found',
    establishmentsFoundPlural: 'establishments found',
    noEstablishmentsFound: 'No establishments found',
    adjustFilters: 'Try adjusting the filters or searching again',
    clearFilters: 'Clear Filters',
    seeDetails: 'See Details',
    certified: 'Certified',
    reviews: 'reviews',
    
    // Contact Page
    contactTitle: 'Get in Touch',
    contactSubtitle: 'We are here to help. Send us your message and we will respond as soon as possible.',
    
    // Footer
    footerAbout: 'About TEIA',
    footerAboutText: 'TEIA is a platform dedicated to inclusive tourism in the Algarve, connecting families with establishments prepared to welcome people with ASD.',
    footerQuickLinks: 'Quick Links',
    footerContact: 'Contact',
    footerRights: 'All rights reserved.',
    footerMadeWith: 'Made with',
    footerFor: 'for special families'
  }
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('pt')

  // Load language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('teia-language') as Language
    if (savedLanguage && ['pt', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('teia-language', language)
  }, [language])

  // Translation function
  const t = (key: string, section?: string) => {
    const langTranslations = translations[language]
    
    if (section) {
      // For nested translations like t('title', 'about')
      // This would look for translations.pt.about.title
      const sectionTranslations = (langTranslations as any)[section]
      return sectionTranslations?.[key] || key
    }
    
    return (langTranslations as any)[key] || key
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}