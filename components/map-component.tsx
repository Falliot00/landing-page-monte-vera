'use client'

import { useEffect, useState } from 'react'
import type L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Bus, RefreshCw, Play, Pause, Navigation } from 'lucide-react'
import { gpsService } from '@/lib/gps-service'
import { configuracion } from '@/lib/data'
import coordenadasSFMV from '@/lib/coordenadas_recorrido_santa_fe_monte_vera.json'
import coordenadasMVSF from '@/lib/coordenadas_recorrido_monte_vera_santa_fe.json'
import { useStopSelection } from '@/contexts/stop-selection-context'

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
  hx?: number; // Dirección en grados (0-360), 0 = Norte
  pk?: number; // Tiempo en segundos, si > 100 no mostrar
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
    stopIcon: L.Icon
    userLocationIcon: L.Icon
  } | null>(null)
  const { selectedStop } = useStopSelection()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null)
  const [isTrackingLocation, setIsTrackingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)

  // Crear las rutas como polylines usando las coordenadas de los archivos JSON
  const santaFeToMonteVeraRoute = coordenadasSFMV.map(coord => [coord.lat, coord.lng] as [number, number])
  const monteveraToSantaFeRoute = coordenadasMVSF.map(coord => [coord.lat, coord.lng] as [number, number])

  // Cargar iconos cuando el componente se monta
  useEffect(() => {
    const loadIcons = async () => {
      try {
        const { busMovingIcon, busStoppedIcon, busOfflineIcon, selectedStopIcon, userLocationIcon } = await import('@/lib/map-icons')
        if (busMovingIcon && busStoppedIcon && busOfflineIcon && selectedStopIcon && userLocationIcon) {
          setIcons({
            busMovingIcon,
            busStoppedIcon,
            busOfflineIcon,
            stopIcon: selectedStopIcon,
            userLocationIcon
          })
        }
      } catch (error) {
        console.error('Error loading icons:', error)
      }
    }
    loadIcons()
  }, [])

  // Función para filtrar dispositivos basándose en pk
  const filterValidDevices = (locations: DeviceLocation[]): DeviceLocation[] => {
    return locations.filter(device => {
      // Si pk no está definido, mostrar el dispositivo (retrocompatibilidad)
      if (device.pk === undefined || device.pk === null) return true
      // Si pk > 100 segundos, no mostrar el dispositivo
      return device.pk <= 100
    })
  }

  // Función para obtener ubicaciones de dispositivos
  const fetchDeviceLocations = async () => {
    try {
      setError(null)
      const locations = await gpsService.getAllDeviceLocations()
      const filteredLocations = filterValidDevices(locations)
      setDeviceLocations(filteredLocations)
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

  // Función para obtener ubicación del usuario
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La geolocalización no es compatible con este navegador')
      return
    }

    setLocationError(null)
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // Cache por 1 minuto
    }

    if (isTrackingLocation) {
      // Detener el seguimiento
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
        setWatchId(null)
      }
      setIsTrackingLocation(false)
      setUserLocation(null)
    } else {
      // Iniciar el seguimiento
      setIsTrackingLocation(true)
      
      // Obtener ubicación inicial
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          setUserLocation({ lat: latitude, lng: longitude, accuracy })
        },
        (error) => {
          setLocationError(getLocationError(error))
          setIsTrackingLocation(false)
        },
        options
      )

      // Iniciar seguimiento continuo
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          setUserLocation({ lat: latitude, lng: longitude, accuracy })
        },
        (error) => {
          setLocationError(getLocationError(error))
        },
        options
      )
      
      setWatchId(id)
    }
  }

  // Función para obtener mensaje de error de ubicación
  const getLocationError = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Acceso a ubicación denegado'
      case error.POSITION_UNAVAILABLE:
        return 'Información de ubicación no disponible'
      case error.TIMEOUT:
        return 'Tiempo de espera agotado para obtener ubicación'
      default:
        return 'Error desconocido al obtener ubicación'
    }
  }

  // Limpiar el watch de ubicación al desmontar el componente
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  // Función temporal para simular dirección si no está disponible en la API
  const getSimulatedDirection = (device: DeviceLocation): number => {
    // Si tenemos la dirección real, la usamos
    if (device.hx !== undefined && device.hx !== null) {
      return device.hx
    }
    
    // Si no, simulamos basándose en el ID del dispositivo y la hora actual
    // Esto es solo temporal para testing
    const deviceNum = parseInt(device.id) || 0
    const timeBase = Math.floor(Date.now() / 10000) // Cambia cada 10 segundos
    return (deviceNum * 45 + timeBase * 2) % 360
  }

  // Función para determinar el ícono del dispositivo basado en el estado
  const getDeviceIcon = (device: DeviceLocation) => {
    if (!icons) return null
    
    const isOnline = device.ol === 1
    const speed = device.sp || 0
    const direction = getSimulatedDirection(device) // Usar función que simula si no hay datos reales
    
    // Si no está conectado, usar icono estático
    if (!isOnline) return icons.busOfflineIcon
    
    // Si está en movimiento, usar icono rotado
    if (speed > 5) {
      return createRotatedBusIcon(direction, 'moving')
    }
    
    // Si está parado, usar icono rotado también (para mantener orientación)
    return createRotatedBusIcon(direction, 'stopped')
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

  // Función para convertir grados a dirección cardinal
  const getCardinalDirection = (degrees: number) => {
    const directions = [
      'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
    ]
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

  // Función para crear icono rotado según la dirección del vehículo
  const createRotatedBusIcon = (direction: number = 0, iconType: 'moving' | 'stopped' | 'offline') => {
    if (!icons) return null

    // Colores según el tipo
    const colorMap = {
      moving: '#16A84F',
      stopped: '#F59E0B', 
      offline: '#EF4444'
    }
    
    const color = colorMap[iconType]
    
    // Ajustar la rotación: restar 90° para que 0° (Norte) apunte hacia arriba
    // El icono del bus por defecto apunta hacia la derecha (Este = 90°)
    // Por eso necesitamos restar 90° para alinearlo correctamente
    const adjustedDirection = direction - 90
    
    // SVG base del bus con rotación aplicada
    const rotatedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="${color}" stroke="#FFFFFF" stroke-width="2"/>
      
      <g transform="translate(4, 4) rotate(${adjustedDirection} 12 12)" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M8 6v6"/>
        <path d="M15 6v6"/>
        <path d="M2 12h19.6"/>
        <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
        <circle cx="7" cy="18" r="2" fill="#FFFFFF"/>
        <path d="M9 18h5"/>
        <circle cx="16" cy="18" r="2" fill="#FFFFFF"/>
      </g>
      
      ${iconType === 'moving' ? `<polygon points="26,12 30,16 26,20" fill="#FFFFFF" stroke="${color}" stroke-width="1" transform="rotate(${adjustedDirection} 16 16)"/>` : ''}
      ${iconType === 'stopped' ? `<rect x="25" y="10" width="2" height="10" fill="#FFFFFF" rx="1"/>
      <rect x="28" y="10" width="2" height="10" fill="#FFFFFF" rx="1"/>` : ''}
    </svg>`

    // Convertir SVG a data URL (más eficiente que Blob URLs)
    const encodedSvg = encodeURIComponent(rotatedSvg)
    const dataUrl = `data:image/svg+xml,${encodedSvg}`
    
    return new (window as any).L.Icon({
      iconUrl: dataUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    })
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
              variant={isTrackingLocation ? "default" : "outline"}
              size="sm"
              onClick={getUserLocation}
            >
              <Navigation className={`h-4 w-4 mr-2 ${isTrackingLocation ? 'text-blue-600' : ''}`} />
              {isTrackingLocation ? 'Ocultar ubicación' : 'Mi ubicación'}
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
          <div className="flex items-center space-x-4 flex-wrap">
            <span>Colectivos activos: {deviceLocations.filter(d => d.ol === 1).length}/{deviceLocations.length}</span>
            {lastUpdate && (
              <span>Última actualización: {lastUpdate.toLocaleTimeString()}</span>
            )}
            {isTrackingLocation && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                📍 Ubicación activa
              </Badge>
            )}
            <Badge variant="outline" className="text-gray-600 border-gray-300">
              📡 Filtro GPS activo
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {locationError && (
              <Badge variant="destructive">{locationError}</Badge>
            )}
            {error && (
              <Badge variant="destructive">{error}</Badge>
            )}
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex items-center space-x-6 text-xs flex-wrap">
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
          {selectedStop && (
            <div className="flex items-center space-x-2 bg-red-50 px-2 py-1 rounded">
              <div className="w-3 h-3 bg-red-600 rounded-full border border-white"></div>
              <span className="text-red-700 font-medium">Parada seleccionada</span>
            </div>
          )}
          {userLocation && (
            <div className="flex items-center space-x-2 bg-blue-50 px-2 py-1 rounded">
              <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
              <span className="text-blue-700 font-medium">Tu ubicación</span>
            </div>
          )}
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

            {/* Marcador de parada seleccionada */}
            {selectedStop && icons && icons.stopIcon && (
              <Marker
                key={`selected-stop-${selectedStop.id}`}
                position={[selectedStop.coordenadas.lat, selectedStop.coordenadas.lng]}
                icon={icons.stopIcon}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-red-600">Parada Seleccionada</h3>
                    <h4 className="font-medium text-sm">{selectedStop.id} - {selectedStop.nombre}</h4>
                    <p className="text-xs text-gray-600 mt-1">{selectedStop.localidad}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Coordenadas: {selectedStop.coordenadas.lat.toFixed(6)}, {selectedStop.coordenadas.lng.toFixed(6)}
                    </p>
                    {selectedStop.referencias && selectedStop.referencias.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600">Referencias:</p>
                        <ul className="text-xs text-gray-500">
                          {selectedStop.referencias.map((ref, index) => (
                            <li key={index}>• {ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Marcador de ubicación del usuario */}
            {userLocation && icons && icons.userLocationIcon && (
              <Marker
                key="user-location"
                position={[userLocation.lat, userLocation.lng]}
                icon={icons.userLocationIcon}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-blue-600">Tu Ubicación</h3>
                    <p className="text-xs text-gray-500 mt-2">
                      Coordenadas: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                    </p>
                    {userLocation.accuracy && (
                      <p className="text-xs text-gray-500 mt-1">
                        Precisión: ±{Math.round(userLocation.accuracy)}m
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Actualizado en tiempo real
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
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