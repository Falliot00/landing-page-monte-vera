'use client'

import { useEffect, useState } from 'react'
import type L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import { paradas, configuracion } from '@/lib/data'
import { useStopSelection } from '@/contexts/stop-selection-context'
import coordenadasSFMV from '@/lib/coordenadas_recorrido_santa_fe_monte_vera.json'
import coordenadasMVSF from '@/lib/coordenadas_recorrido_monte_vera_santa_fe.json'

export default function StopsMap() {
  const { selectedRoute, selectedStop } = useStopSelection()
  const [icons, setIcons] = useState<{
    stopIconSFMV: L.DivIcon
    stopIconMVSF: L.DivIcon
    selectedStopIcon: L.DivIcon
  } | null>(null)

  // Crear las rutas como polylines usando las coordenadas de los archivos JSON
  const santaFeToMonteVeraRoute = coordenadasSFMV.map(coord => [coord.lat, coord.lng] as [number, number])
  const monteveraToSantaFeRoute = coordenadasMVSF.map(coord => [coord.lat, coord.lng] as [number, number])

  // Cargar iconos cuando el componente se monta
  useEffect(() => {
    const loadIcons = async () => {
      try {
        // Crear íconos específicos para paradas
        const L = (await import('leaflet')).default
        
        // Ícono para paradas MV00-MV48 (Santa Fe → Monte Vera)
        const stopIconSFMV = L.divIcon({
          html: `<div style="background-color: ${configuracion.rutas.santafe_montevera.color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: 'custom-stop-icon',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })

        // Ícono para paradas MV49-MV97 (Monte Vera → Santa Fe)  
        const stopIconMVSF = L.divIcon({
          html: `<div style="background-color: ${configuracion.rutas.montevera_santafe.color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: 'custom-stop-icon',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })

        // Ícono para parada seleccionada
        const selectedStopIcon = L.divIcon({
          html: `<div style="background-color: #ff6b35; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4); animation: pulse 2s infinite;"></div>`,
          className: 'custom-selected-stop-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })

        setIcons({
          stopIconSFMV,
          stopIconMVSF,
          selectedStopIcon
        })
      } catch (error) {
        console.error('Error loading icons:', error)
      }
    }
    loadIcons()
  }, [])

  // Función para determinar qué ícono usar según el ID de la parada
  const getStopIcon = (stopId: string) => {
    if (!icons) return null
    
    // Si esta parada está seleccionada, usar el icono especial
    if (selectedStop && selectedStop.id === stopId) {
      return icons.selectedStopIcon
    }
    
    const stopNumber = parseInt(stopId.replace('MV', ''))
    
    // MV00-MV48 para ruta Santa Fe → Monte Vera
    if (stopNumber >= 0 && stopNumber <= 48) {
      return icons.stopIconSFMV
    }
    // MV49-MV97 para ruta Monte Vera → Santa Fe
    else if (stopNumber >= 49 && stopNumber <= 97) {
      return icons.stopIconMVSF
    }
    
    return icons.stopIconSFMV // fallback
  }

  // Función para determinar el color del popup según el rango de parada
  const getStopColor = (stopId: string) => {
    const stopNumber = parseInt(stopId.replace('MV', ''))
    
    if (stopNumber >= 0 && stopNumber <= 48) {
      return configuracion.rutas.santafe_montevera.color
    } else if (stopNumber >= 49 && stopNumber <= 97) {
      return configuracion.rutas.montevera_santafe.color
    }
    
    return configuracion.rutas.santafe_montevera.color // fallback
  }

  // Obtener paradas de la ruta seleccionada
  const selectedRouteStops = paradas[selectedRoute]

  // Centro del mapa (entre Santa Fe y Monte Vera)
  const mapCenter: [number, number] = [-31.576, -60.689]

  // Determinar qué ruta mostrar
  const showSantaFeRoute = selectedRoute === 'santafe_montevera'
  const showMonteVeraRoute = selectedRoute === 'montevera_santafe'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <span>
            Mapa: {selectedRoute === 'santafe_montevera' ? 'Santa Fe → Monte Vera' : 'Monte Vera → Santa Fe'}
          </span>
        </CardTitle>
        
        {/* Leyenda dinámica */}
        <div className="flex items-center space-x-6 text-xs">
          {showSantaFeRoute && (
            <>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-1 bg-blue-500"></div>
                <span>SF → MV</span>
              </div>
              <div className="flex items-center space-x-2">
                <div style={{ backgroundColor: configuracion.rutas.santafe_montevera.color }} className="w-3 h-3 rounded-full border border-white"></div>
                <span>Paradas SF→MV</span>
              </div>
            </>
          )}
          {showMonteVeraRoute && (
            <>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-1 bg-green-500"></div>
                <span>MV → SF</span>
              </div>
              <div className="flex items-center space-x-2">
                <div style={{ backgroundColor: configuracion.rutas.montevera_santafe.color }} className="w-3 h-3 rounded-full border border-white"></div>
                <span>Paradas MV→SF</span>
              </div>
            </>
          )}
          {selectedStop && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
              <span className="font-medium">Parada seleccionada</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-96 w-full rounded-lg overflow-hidden border">
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Ruta Santa Fe → Monte Vera */}
            {showSantaFeRoute && (
              <Polyline
                positions={santaFeToMonteVeraRoute}
                color={configuracion.rutas.santafe_montevera.color}
                weight={4}
                opacity={0.7}
              />
            )}
            
            {/* Ruta Monte Vera → Santa Fe */}
            {showMonteVeraRoute && (
              <Polyline
                positions={monteveraToSantaFeRoute}
                color={configuracion.rutas.montevera_santafe.color}
                weight={4}
                opacity={0.7}
              />
            )}
            
            {/* Marcadores de paradas */}
            {selectedRouteStops.map((stop) => {
              const stopIcon = getStopIcon(stop.id)
              const stopColor = getStopColor(stop.id)
              const stopNumber = parseInt(stop.id.replace('MV', ''))
              const routeName = stopNumber >= 0 && stopNumber <= 48 
                ? 'Santa Fe → Monte Vera' 
                : 'Monte Vera → Santa Fe'
              
              return stopIcon ? (
                <Marker
                  key={stop.id}
                  position={[stop.coordenadas.lat, stop.coordenadas.lng]}
                  icon={stopIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold text-sm" style={{ color: stopColor }}>
                        {stop.id} - {stop.nombre}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">{routeName}</p>
                      <p className="text-xs text-gray-600">Localidad: {stop.localidad}</p>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}