'use client'

import { useEffect, useState } from 'react'
import type L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Bus, Navigation } from 'lucide-react'
import { gpsService, GPSService } from '@/lib/gps-service'
import { configuracion } from '@/lib/data'
import coordenadasSFMV from '@/lib/coordenadas_recorrido_santa_fe_monte_vera.json'
import coordenadasMVSF from '@/lib/coordenadas_recorrido_monte_vera_santa_fe.json'
import { useStopSelection } from '@/contexts/stop-selection-context'
import { UseTwoFingerMap } from '@/lib/use-two-finger-map'

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

// Componente helper para manejar el mapa con dos dedos
function MapControllerRealTime() {
  UseTwoFingerMap()
  return null
}

export default function MapComponent() {
  const [deviceLocations, setDeviceLocations] = useState<DeviceLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isPolling = true // Always polling
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
      
      // Configurar polling cada 10 segundos
      const interval = setInterval(fetchDeviceLocations, 10000)
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
    if (speed > 5) return `Circulando`
    return 'Detenido'
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
    
    // SVG mejorado del bus con rotación aplicada
    const rotatedSvg = `<svg width="32" height="32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(${adjustedDirection} 64 64)">
        <rect width="128" height="128" fill="${color}" rx="64"/>
        ${iconType === 'moving' ? `<path fill-rule="evenodd" clip-rule="evenodd" d="M116.327 62.4833C116.594 62.6369 116.815 62.8578 116.969 63.124C117.122 63.3901 117.203 63.692 117.203 63.9994C117.203 64.3068 117.122 64.6087 116.969 64.8749C116.815 65.141 116.594 65.362 116.327 65.5155L98.881 75.5885C98.615 75.7421 98.3132 75.823 98.006 75.823C97.6988 75.823 97.3971 75.7421 97.131 75.5885C96.865 75.4349 96.6441 75.214 96.4905 74.948C96.3369 74.682 96.256 74.3802 96.256 74.073V53.927C96.256 53.6198 96.3369 53.318 96.4905 53.052C96.6441 52.786 96.865 52.5651 97.131 52.4115C97.3971 52.2579 97.6988 52.177 98.006 52.177C98.3132 52.177 98.615 52.2579 98.881 52.4115L116.327 62.4845V62.4833Z" fill="white"/>` : ''}
        <path d="M63.5 2C79.8108 2 95.4536 8.47945 106.987 20.0129C118.521 31.5464 125 47.1892 125 63.5C125 79.8108 118.521 95.4536 106.987 106.987C95.4536 118.521 79.8108 125 63.5 125C47.1892 125 31.5464 118.521 20.0129 106.987C8.47945 95.4536 2 79.8108 2 63.5C2 47.1892 8.47945 31.5464 20.0129 20.0129C31.5464 8.47945 47.1892 2 63.5 2ZM63.5 8.47368C48.9061 8.47368 34.91 14.2711 24.5905 24.5905C14.2711 34.91 8.47368 48.9061 8.47368 63.5C8.47368 78.0939 14.2711 92.0901 24.5905 102.409C34.91 112.729 48.9061 118.526 63.5 118.526C70.7262 118.526 77.8816 117.103 84.5577 114.338C91.2338 111.572 97.2998 107.519 102.409 102.409C107.519 97.2998 111.572 91.2338 114.338 84.5577C117.103 77.8816 118.526 70.7262 118.526 63.5C118.526 48.9061 112.729 34.91 102.409 24.5905C92.0901 14.2711 78.0939 8.47368 63.5 8.47368Z" fill="white"/>
        <path d="M84.0444 41.1323C83.583 40.4741 82.97 39.9367 82.257 39.5655C81.544 39.1943 80.7521 39.0004 79.9483 39H22.5C21.1744 39.0015 19.9035 39.5288 18.9661 40.4661C18.0288 41.4035 17.5015 42.6744 17.5 44V82.75H23.9191C24.3583 85.2035 25.6464 87.4244 27.5579 89.0241C29.4693 90.6237 31.8825 91.5002 34.375 91.5002C36.8675 91.5002 39.2807 90.6237 41.1921 89.0241C43.1036 87.4244 44.3917 85.2035 44.8309 82.75H63.9191C64.3583 85.2035 65.6464 87.4244 67.5579 89.0241C69.4693 90.6237 71.8825 91.5002 74.375 91.5002C76.8675 91.5002 79.2807 90.6237 81.1921 89.0241C83.1036 87.4244 84.3917 85.2035 84.8309 82.75H92.5V54.3939C92.501 53.6244 92.2643 52.8733 91.8222 52.2434L84.0444 41.1323ZM43.125 44H65.625V59H43.125V44ZM22.5 44H38.125V59H22.5V44ZM34.375 86.5C33.2625 86.5 32.1749 86.1701 31.2499 85.552C30.3249 84.9339 29.6039 84.0554 29.1782 83.0276C28.7524 81.9998 28.641 80.8688 28.8581 79.7776C29.0751 78.6865 29.6109 77.6842 30.3975 76.8975C31.1842 76.1109 32.1865 75.5751 33.2776 75.3581C34.3688 75.141 35.4998 75.2524 36.5276 75.6782C37.5554 76.1039 38.4339 76.8249 39.052 77.7499C39.6701 78.6749 40 79.7625 40 80.875C39.9983 82.3663 39.4052 83.7961 38.3506 84.8506C37.2961 85.9052 35.8663 86.4983 34.375 86.5ZM74.375 86.5C73.2625 86.5 72.1749 86.1701 71.2499 85.552C70.3249 84.9339 69.6039 84.0554 69.1782 83.0276C68.7524 81.9998 68.641 80.8688 68.8581 79.7776C69.0751 78.6865 69.6109 77.6842 70.3975 76.8975C71.1842 76.1109 72.1865 75.5751 73.2776 75.3581C74.3688 75.141 75.4998 75.2524 76.5276 75.6782C77.5554 76.1039 78.4339 76.8249 79.052 77.7499C79.6701 78.6749 80 79.7625 80 80.875C79.9983 82.3663 79.4052 83.7961 78.3506 84.8506C77.2961 85.9052 75.8663 86.4983 74.375 86.5ZM87.5 77.75H84.5303C83.8622 75.5781 82.5153 73.6777 80.6876 72.3277C78.8598 70.9776 76.6473 70.2491 74.375 70.2491C72.1027 70.2491 69.8902 70.9776 68.0624 72.3277C66.2347 73.6777 64.8878 75.5781 64.2197 77.75H44.5303C43.8622 75.5781 42.5153 73.6777 40.6876 72.3277C38.8598 70.9776 36.6473 70.2491 34.375 70.2491C32.1027 70.2491 29.8902 70.9776 28.0624 72.3277C26.2347 73.6777 24.8878 75.5781 24.2197 77.75H22.5V64H87.5V77.75ZM87.5 59H70.625V44H79.9483L87.5 54.788V59Z" fill="white"/>
        ${iconType === 'stopped' ? `<rect x="116" y="40" width="8" height="48" fill="white" rx="4"/>` : ''}
      </g>
    </svg>`

    // Convertir SVG a data URL (más eficiente que Blob URLs)
    const encodedSvg = encodeURIComponent(rotatedSvg)
    const dataUrl = `data:image/svg+xml,${encodedSvg}`
    
    return new (window as Window & typeof globalThis & { L: typeof L }).L.Icon({
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
            {/*<Button
              variant="outline"
              size="sm"
              onClick={manualRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>*/}
            <Button
              variant={isTrackingLocation ? "default" : "outline"}
              size="sm"
              onClick={getUserLocation}
            >
              <Navigation className={`h-4 w-4 mr-2 ${isTrackingLocation ? 'text-blue-600' : ''}`} />
              {isTrackingLocation ? 'Ocultar ubicación' : 'Mi ubicación'}
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
            <span>🟢 Circulando</span>
            <span>🟡 Detenido</span>
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
            <MapControllerRealTime />
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
                      <h3 className="font-semibold text-sm">Colectivo {GPSService.getInternalNumber(device.id)}</h3>
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