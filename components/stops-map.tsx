'use client'

import { useEffect, useState } from 'react'
import type L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { paradas, configuracion } from '@/lib/data'
import { useStopSelection } from '@/contexts/stop-selection-context'
import coordenadasSFMV from '@/lib/coordenadas_recorrido_santa_fe_monte_vera.json'
import coordenadasMVSF from '@/lib/coordenadas_recorrido_monte_vera_santa_fe.json'

// Componente helper para manejar el centro y zoom del mapa
function MapController() {
  const map = useMap()
  const { selectedStop, selectedRoute } = useStopSelection()

  useEffect(() => {
    if (selectedStop) {
      // Animar hacia la parada seleccionada con zoom
      map.flyTo([selectedStop.coordenadas.lat, selectedStop.coordenadas.lng], 16, {
        duration: 1.5,
        easeLinearity: 0.1
      })
    } else {
      // Si no hay parada seleccionada, volver al centro
      const mapCenter: [number, number] = [-31.576, -60.689]
      map.flyTo(mapCenter, 12, {
        duration: 1,
        easeLinearity: 0.1
      })
    }
  }, [selectedStop, selectedRoute, map])

  return null
}

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
          html: `<div style="background-color: #ff6b35; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4);"></div>
                 <style>
                   @keyframes pulse {
                     0% { transform: scale(1); opacity: 1; }
                     50% { transform: scale(1.2); opacity: 0.7; }
                     100% { transform: scale(1); opacity: 1; }
                   }
                   .custom-selected-stop-icon div {
                     animation: pulse 2s infinite;
                   }
                 </style>`,
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
    <div className="h-full w-full">
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="z-0 rounded-lg"
      >
        <MapController />
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
                  <p className="text-xs text-gray-500 mt-1">{stop.tiempoDesdeInicio}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        })}
      </MapContainer>
    </div>
  )
}