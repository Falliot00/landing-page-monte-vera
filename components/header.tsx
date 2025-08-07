'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  activeSection: string
}

export default function Header({ activeSection }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { id: 'inicio', label: 'Inicio', href: '/' },
    { id: 'consultor', label: 'Consultor GPS', href: '/#consultor' },
    { id: 'nosotros', label: 'Nosotros', href: '/#nosotros' },
    { id: 'horarios', label: 'Horarios', href: '/#horarios' },
    { id: 'tarifas', label: 'Tarifas', href: '/#tarifas' },
    { id: 'paradas', label: 'Paradas', href: '/#paradas' },
    { id: 'contacto', label: 'Contacto', href: '/#contacto' }
  ]

  const handleNavigation = (item: { id: string; href: string }) => {
    setIsMenuOpen(false)
    
    // Si estamos en la página principal y es una sección con anchor
    if (pathname === '/' && item.href.startsWith('/#')) {
      const sectionId = item.href.substring(2) // Remover '/#'
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    // Para otros casos, Next.js manejará la navegación automáticamente
  }

  const isActiveItem = (item: { id: string; href: string }) => {
    // Si estamos en la página del consultor GPS, no marcar ningún item como activo en el header
    if (pathname === '/consultor-gps') {
      return false
    }
    // Si estamos en la página principal, usar activeSection
    if (pathname === '/' && item.id === activeSection) {
      return true
    }
    return false
  }

  return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/95 backdrop-blur-sm shadow-sm h-[3.5rem] md:h-16">
      <div className="container mx-auto px-4 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link href="/" className="transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg">
              <Image
                src="/imagenes/LogoMV.png"
                alt="Monte Vera Logo"
                width={240}
                height={80}
                className="h-7 sm:h-8 md:h-10 w-auto"
                quality={100}
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => handleNavigation(item)}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-green-50 group ${
                  isActiveItem(item) 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {item.label}
                {isActiveItem(item) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full"></span>
                )}
                <span className="absolute inset-0 rounded-lg bg-green-600/5 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`lg:hidden relative p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              isMenuOpen ? 'bg-green-50 text-green-600' : 'hover:bg-green-50/50'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 transform ${
                isMenuOpen ? 'top-3 rotate-45' : 'top-1.5'
              }`} />
              <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current transition-all duration-300 transform ${
                isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }`} />
              <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 transform ${
                isMenuOpen ? 'top-3 -rotate-45' : 'top-4.5'
              }`} />
            </div>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {/* Mobile Navigation */}
        <div className={`lg:hidden fixed inset-x-0 top-[3.5rem] md:top-16 transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        } ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div className="mx-4 border border-gray-100 bg-white/98 backdrop-blur-md rounded-2xl shadow-lg">
            <nav className="py-4 px-2 space-y-0.5">
              {menuItems.map((item, index) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => handleNavigation(item)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 transform ${
                    isActiveItem(item) 
                      ? 'text-green-600 bg-green-50/80 translate-x-2 shadow-sm' 
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50/60 hover:translate-x-1'
                  }`}
                  style={{ 
                    transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(-8px)',
                    opacity: isMenuOpen ? '1' : '0'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      isActiveItem(item) ? 'bg-green-600 scale-100' : 'bg-gray-300 scale-0'
                    }`}></span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
