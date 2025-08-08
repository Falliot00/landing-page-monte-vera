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
          {/* Hero Section Optimizado para Móvil */}
          <div className="relative min-h-[100dvh] overflow-hidden">
            {/* Background Image con efectos mejorados */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/imagenes/colectivo_monte_vera.png"
                alt="Colectivo Monte Vera"
                fill
                className="object-cover opacity-20 transform scale-105 hover:scale-100 transition-transform duration-700"
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/85 to-green-700/80 backdrop-blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Elementos flotantes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-400/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-green-300/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-500"></div>
            </div>

            {/* Content Optimizado para Móvil */}
            <div className="relative z-10 container mx-auto px-3 sm:px-6 lg:px-8 text-center text-white">
              <div className="max-w-5xl mx-auto">
                {/* Botón de regreso - Pegado al header */}
                <div className="flex justify-start mb-4 sm:mb-8 pt-[3.5rem] md:pt-16">
                  <Link href="/">
                    <Button
                      variant="ghost" 
                      size="sm"
                      className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30 rounded-xl text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
                    >
                      <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Volver al </span>inicio
                    </Button>
                  </Link>
                </div>

                {/* Título Principal Optimizado */}
                <div className="mb-6 sm:mb-10">
                  <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
                    <span>Consultor de </span>
                    <span className="text-green-300">Horarios GPS</span>
                  </h1>
                  
                  <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-green-400 to-green-300 mx-auto rounded-full mb-6 sm:mb-8"></div>
                </div>
                
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 text-gray-100 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                  Consulta horarios de colectivos en tiempo real con precisión GPS. <span className="hidden sm:inline">Planifica tu viaje con datos actualizados y confiables.</span>
                </p>

                {/* Características destacadas - Móvil optimizado */}
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 px-2 sm:px-0">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 touch-manipulation">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Navigation className="h-5 w-5 sm:h-6 sm:w-6 text-green-300" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">GPS en Vivo</h3>
                    <p className="text-green-200 text-xs sm:text-sm">Seguimiento en tiempo real</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 touch-manipulation">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-300" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Horarios Precisos</h3>
                    <p className="text-green-200 text-xs sm:text-sm">Datos oficiales actualizados</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 touch-manipulation sm:col-span-1 xs:col-span-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-green-300" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">98 Paradas</h3>
                    <p className="text-green-200 text-xs sm:text-sm">Cobertura completa de rutas</p>
                  </div>
                </div>

                {/* Estado del sistema - Móvil optimizado */}
                <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 border border-white/20 mx-2 sm:mx-0">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-green-200 font-medium text-sm sm:text-base">Sistema en línea</span>
                  </div>
                  <span className="text-white/60 hidden sm:inline">•</span>
                  <span className="text-green-200 text-xs sm:text-sm">Actualizado cada 10 segundos</span>
                </div>
              </div>
            </div>

            {/* Indicador de scroll - Solo visible en pantallas grandes */}
            {/*<div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
              <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
                <div className="w-0.5 h-2 sm:w-1 sm:h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
              </div>
            </div>*/}
          </div>
          
          {/* Consultor de Horarios - Espaciado optimizado */}
          <section id="consultor" className="py-8 sm:py-12 md:py-16 bg-gray-50">
            <RealTimeConsultant />
          </section>
        </main>
        
        <Footer />
      </div>
    </StopSelectionProvider>
  )
}