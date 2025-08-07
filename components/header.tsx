'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  activeSection: string
}

export default function Header({ activeSection }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/imagenes/LogoMV.png"
              alt="Monte Vera Logo"
              width={240}
              height={80}
              className="h-10 w-auto"
              quality={100}
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => handleNavigation(item)}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  isActiveItem(item) ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <nav className="py-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => handleNavigation(item)}
                  className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 hover:text-green-600 ${
                    isActiveItem(item) ? 'text-green-600 bg-green-50' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
