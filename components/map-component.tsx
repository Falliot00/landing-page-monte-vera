'use client'

import { useEffect, useState } from 'react'
import type L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Bus, RefreshCw, Play, Pause } from 'lucide-react'
import { gpsService } from '@/lib/gps-service'
import { configuracion } from '@/lib/data'
import coordenadasSFMV from '@/lib/coordenadas_recorrido_santa_fe_monte_vera.json'
import coordenadasMVSF from '@/lib/coordenadas_recorrido_monte_vera_santa_fe.json'

interface DeviceLocation {
  id: string;
  lng: number;
  lat: number;
  mlng: string;
  mlat: string;
  ps: string;
  gt: string;
  sp: number;
  ol: number;
}

export default function MapComponent() {
  const [deviceLocations, setDeviceLocations] = useState<DeviceLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPolling, setIsPolling] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [icons, setIcons] = useState<{
    busMovingIcon: L.Icon
    busStoppedIcon: L.Icon
    busOfflineIcon: L.Icon
  } | null>(null)

  // Crear las rutas como polylines usando las coordenadas de los archivos JSON
  const santaFeToMonteVeraRoute = coordenadasSFMV.map(coord => [coord.lat, coord.lng] as [number, number])
  const monteveraToSantaFeRoute = coordenadasMVSF.map(coord => [coord.lat, coord.lng] as [number, number])

  // Cargar iconos cuando el componente se monta
  useEffect(() => {
    const loadIcons = async () => {
      try {
        const { busMovingIcon, busStoppedIcon, busOfflineIcon } = await import('@/lib/map-icons')
        if (busMovingIcon && busStoppedIcon && busOfflineIcon) {
          setIcons({
            busMovingIcon,
            busStoppedIcon,
            busOfflineIcon
          })
        }
      } catch (error) {
        console.error('Error loading icons:', error)
      }
    }
    loadIcons()
  }, [])

  // Función para obtener ubicaciones de dispositivos
  const fetchDeviceLocations = async () => {
    try {
      setError(null)
      const locations = await gpsService.getAllDeviceLocations()
      setDeviceLocations(locations)
      setLastUpdate(new Date())
    } catch (err) {
      setError('Error al obtener ubicaciones de dispositivos')
      console.error('Error fetching device locations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Iniciar/detener polling
  useEffect(() => {
    if (isPolling) {
      // Fetch inicial
      fetchDeviceLocations()
      
      // Configurar polling cada 30 segundos
      const interval = setInterval(fetchDeviceLocations, 30000)
      setPollingInterval(interval)
      
      return () => {
        if (interval) clearInterval(interval)
      }
    } else {
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolling])

  const togglePolling = () => {
    setIsPolling(!isPolling)
  }

  const manualRefresh = () => {
    setIsLoading(true)
    fetchDeviceLocations()
  }

  // Función para determinar el ícono del dispositivo basado en el estado
  const getDeviceIcon = (device: DeviceLocation) => {
    if (!icons) return null
    
    const isOnline = device.ol === 1
    const speed = device.sp || 0
    
    if (!isOnline) return icons.busOfflineIcon
    if (speed > 5) return icons.busMovingIcon
    return icons.busStoppedIcon
  }

  // Función para obtener emoji para la lista
  // const getDeviceEmoji = (device: DeviceLocation) => {
  //   const isOnline = device.ol === 1
  //   const speed = device.sp || 0
  //   
  //   if (!isOnline) return '🔴' // Offline
  //   if (speed > 5) return '🚌' // En movimiento
  //   return '🟡' // Parado
  // }

  const getDeviceStatus = (device: DeviceLocation) => {
    const isOnline = device.ol === 1
    const speed = device.sp || 0
    
    if (!isOnline) return 'Desconectado'
    if (speed > 5) return `En ruta`
    return 'Parado'
  }

  // Centro del mapa (entre Santa Fe y Monte Vera)
  const mapCenter: [number, number] = [-31.576, -60.689]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Mapa en Tiempo Real</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={manualRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button
              variant={isPolling ? "destructive" : "default"}
              size="sm"
              onClick={togglePolling}
            >
              {isPolling ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Reanudar
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Información de estado */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Colectivos activos: {deviceLocations.filter(d => d.ol === 1).length}/{deviceLocations.length}</span>
            {lastUpdate && (
              <span>Última actualización: {lastUpdate.toLocaleTimeString()}</span>
            )}
          </div>
          {error && (
            <Badge variant="destructive">{error}</Badge>
          )}
        </div>

        {/* Leyenda */}
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-1 bg-blue-500"></div>
            <span>SF → MV</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-1 bg-green-500"></div>
            <span>MV → SF</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🟢 Andando</span>
            <span>🟡 Quieto</span>
            <span>🔴 Desconectado</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[600px] w-full rounded-lg overflow-hidden border">
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
            <Polyline
              positions={santaFeToMonteVeraRoute}
              color={configuracion.rutas.santafe_montevera.color}
              weight={4}
              opacity={0.7}
            />
            
            {/* Ruta Monte Vera → Santa Fe */}
            <Polyline
              positions={monteveraToSantaFeRoute}
              color={configuracion.rutas.montevera_santafe.color}
              weight={4}
              opacity={0.7}
            />
            
            
            {/* Marcadores de dispositivos en tiempo real */}
            {deviceLocations.map((device) => {
              const deviceIcon = getDeviceIcon(device)
              return deviceIcon ? (
                <Marker
                  key={device.id}
                  position={[device.lat, device.lng]}
                  icon={deviceIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold text-sm">Colectivo {device.id}</h3>
                      <p className="text-xs">{getDeviceStatus(device)}</p>
                      <p className="text-xs text-gray-500">
                        Coordenadas: {device.mlat}, {device.mlng}
                      </p>
                      <p className="text-xs text-gray-500">
                        Última actualización: {new Date(device.gt).toLocaleTimeString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            })}
          </MapContainer>
        </div>
        
        {isLoading && deviceLocations.length === 0 && (
          <div className="text-center py-8">
            <Bus className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-bounce" />
            <p className="text-gray-500">Cargando ubicaciones de colectivos...</p>
          </div>
        )}
        
        {!isLoading && deviceLocations.length === 0 && (
          <div className="text-center py-8">
            <Bus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">No se encontraron colectivos en línea</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}