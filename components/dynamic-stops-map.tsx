'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

// Importar el mapa completamente dinámico sin SSR
const StopsMapComponent = dynamic(
  () => import('./stops-map'),
  { 
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span>Mapa Interactivo de Paradas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 animate-bounce" />
              <p>Cargando mapa de paradas...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

export default function DynamicStopsMap() {
  return <StopsMapComponent />
}