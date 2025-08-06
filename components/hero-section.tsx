'use client'

import { ArrowRight, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function HeroSection() {
  const scrollToConsultor = () => {
    const element = document.getElementById('consultor')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Conectamos
            <span className="text-green-300"> Santa Fe </span>
            con
            <span className="text-green-300"> Monte Vera</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Transporte público confiable y moderno. Consulta horarios en tiempo real, 
            ubicación GPS de colectivos y planifica tu viaje.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center space-x-2 text-green-200">
              <MapPin className="h-5 w-5" />
              <span>98 paradas en 6 localidades</span>
            </div>
            <div className="flex items-center space-x-2 text-green-200">
              <Clock className="h-5 w-5" />
              <span>55 minutos de recorrido</span>
            </div>
          </div>

          <Button
            onClick={scrollToConsultor}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Consultar Horarios GPS
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-2 text-green-300">Santa Fe → Monte Vera</h3>
              <p className="text-gray-200">49 paradas • Primer servicio: 05:40</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-2 text-green-300">Monte Vera → Santa Fe</h3>
              <p className="text-gray-200">49 paradas • Primer servicio: 04:55</p>
            </div>
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
  )
}
