'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import RealTimeConsultant from '@/components/real-time-consultant'
import Footer from '@/components/footer'
import { StopSelectionProvider } from '@/contexts/stop-selection-context'
import { ArrowLeft, MapPin, Clock, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function ConsultorGPSPage() {
  const [activeSection, setActiveSection] = useState('consultor')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['consultor']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <StopSelectionProvider>
      <div className="min-h-screen bg-white">
        <Header activeSection={activeSection} />
        
        <main>
          {/* Hero section con el mismo estilo que la página principal */}
          <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/imagenes/colectivo_monte_vera.png"
                alt="Colectivo Monte Vera"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-700/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
              <div className="max-w-4xl mx-auto">
                {/* Botón de regreso */}
                <div className="flex justify-start mb-6">
                  <Link href="/">
                    <Button
                      variant="ghost" 
                      size="sm"
                      className="text-white/80 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver al inicio
                    </Button>
                  </Link>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  Consultor de Horarios
                  <span className="text-green-300"> GPS</span>
                </h1>
                
                <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
                  Consulta los horarios de colectivos en tiempo real con precisión GPS. 
                  Planifica tu viaje con datos actualizados.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <div className="flex items-center space-x-2 text-green-200">
                    <Navigation className="h-5 w-5" />
                    <span>Seguimiento GPS en vivo</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-200">
                    <Clock className="h-5 w-5" />
                    <span>Horarios precisos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-200">
                    <MapPin className="h-5 w-5" />
                    <span>98 paradas disponibles</span>
                  </div>
                </div>

                <div className="flex justify-center items-center space-x-4 text-sm text-green-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    <span>Sistema en línea</span>
                  </div>
                  <span>•</span>
                  <span>Actualizado cada 30 segundos</span>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Consultor de Horarios */}
          <section id="consultor" className="py-16 bg-gray-50">
            <RealTimeConsultant />
          </section>
        </main>
        
        <Footer />
      </div>
    </StopSelectionProvider>
  )
}