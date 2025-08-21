'use client'

import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

// Importar el mapa completamente dinámico sin SSR
const StopsMapComponent = dynamic(
  () => import('./stops-map'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-96 lg:h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2 animate-bounce" />
          <p>Cargando mapa de paradas...</p>
        </div>
      </div>
    )
  }
)

export default function DynamicStopsMap() {
  return <StopsMapComponent />
}