'use client'

import { ArrowRight, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with improved overlay */}
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

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-green-300/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-5xl mx-auto">
          {/* Main Title */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight flex flex-wrap items-center justify-center gap-x-3">
              <span>Conectamos</span>
              <span className="text-green-300">Santa Fe</span>
              <span>con</span>
              <span className="text-green-300">Monte Vera</span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-300 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-10 text-gray-100 max-w-3xl mx-auto leading-relaxed">
            Transporte público confiable y moderno. Consulta horarios en tiempo real, 
            ubicación GPS de colectivos y planifica tu viaje con precisión.
          </p>

          {/* Features */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mb-12">
            <div className="flex items-center space-x-2 text-green-200 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base whitespace-nowrap">98 paradas</span>
            </div>
            <div className="flex items-center space-x-2 text-green-200 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base whitespace-nowrap">55 minutos de recorrido</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-16">
            <Link href="/consultor-gps">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-2xl hover:shadow-red-500/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden border-2 border-red-400/20 hover:border-red-300/40"
              >
                <span className="relative z-10 flex items-center">
                  Consultar Horarios GPS
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Button>
            </Link>
            
            <p className="text-sm text-green-200/80 mt-4">
              Sistema GPS en tiempo real 
            </p>
          </div>

          {/* Route Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg lg:text-xl font-semibold text-green-300">Santa Fe → Monte Vera</h3>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-left space-y-2">
                <p className="text-gray-200 flex items-center justify-between">
                  <span>49 paradas</span>
                  <span className="text-green-300">•</span>
                </p>
                <p className="text-gray-200 flex items-center justify-between">
                  <span>Primer servicio:</span>
                  <span className="font-semibold text-white">05:40</span>
                </p>
              </div>
            </div>
            
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg lg:text-xl font-semibold text-green-300">Monte Vera → Santa Fe</h3>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-500"></div>
              </div>
              <div className="text-left space-y-2">
                <p className="text-gray-200 flex items-center justify-between">
                  <span>49 paradas</span>
                  <span className="text-green-300">•</span>
                </p>
                <p className="text-gray-200 flex items-center justify-between">
                  <span>Primer servicio:</span>
                  <span className="font-semibold text-white">04:55</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}