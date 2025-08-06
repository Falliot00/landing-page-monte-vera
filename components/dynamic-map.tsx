'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Bus } from 'lucide-react'

// Importar el mapa completamente dinámico sin SSR
const RealTimeMapComponent = dynamic(
  () => import('./map-component'),
  { 
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Mapa en Tiempo Real</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Bus className="h-8 w-8 mx-auto mb-2 animate-bounce" />
              <p>Cargando mapa...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

export default function DynamicMap() {
  return <RealTimeMapComponent />
}