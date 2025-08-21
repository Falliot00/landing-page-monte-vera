'use client'

import { useState, useRef } from 'react'
import { MapPin, Navigation, Clock, Bus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { paradas as allParadas, configuracion } from '@/lib/data'
import DynamicMap from '@/components/dynamic-map'
import { BusTimingService, type BusArrivalResult } from '@/lib/bus-timing-service'
import { useStopSelection } from '@/contexts/stop-selection-context'

interface StopData {
  id: string
  nombre: string
  coordenadas: { lat: number; lng: number }
  tiempoDesdeInicio: string
  localidad: string
  referencias?: string[]
}

// Type guard para verificar si un objeto es StopData
const isStopData = (obj: unknown): obj is StopData => {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj && 
         'nombre' in obj && 
         'coordenadas' in obj &&
         typeof (obj as Record<string, unknown>).id === 'string'
}

export default function RealTimeConsultant() {
  const [selectedRoute, setSelectedRoute] = useState('santafe_montevera')
  const [selectedStop, setSelectedStop] = useState('')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoadingGPS, setIsLoadingGPS] = useState(false)
  const [busArrivalResult, setBusArrivalResult] = useState<BusArrivalResult | null>(null)
  const [nearestStop, setNearestStop] = useState<StopData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { setSelectedStop: setSelectedStopInMap } = useStopSelection()
  const horariosCalculadosRef = useRef<HTMLDivElement>(null)


  // Detectar ubicación del usuario
  const detectLocation = () => {
    setIsLoadingLocation(true)

    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // Encontrar parada más cercana del recorrido seleccionado
          const routeStops = (allParadas[selectedRoute as keyof typeof allParadas] || []).filter(isStopData)
          let closest: StopData | null = null
          let minDistance = Infinity

          routeStops.forEach(stop => {
            const distance = Math.sqrt(
              Math.pow(stop.coordenadas.lat - latitude, 2) + Math.pow(stop.coordenadas.lng - longitude, 2)
            )
            if (distance < minDistance) {
              minDistance = distance
              closest = stop
            }
          })

          if (closest) {
            setNearestStop(closest)
            setSelectedStop(closest.id)
            setSelectedStopInMap(closest)
          }

          setIsLoadingLocation(false)
          navigator.geolocation.clearWatch(watchId)
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsLoadingLocation(false)
          navigator.geolocation.clearWatch(watchId)
        },
        options
      )
    } else {
      setIsLoadingLocation(false)
    }
  }

  // Consultar tiempo real basado en horarios oficiales
  const consultarGPS = () => {
    if (!selectedStop) return
    
    setIsLoadingGPS(true)
    setError(null)
    
    // Simular tiempo de procesamiento realista
    setTimeout(() => {
      try {
        const result = BusTimingService.calculateBusArrival({
          routeId: selectedRoute as keyof typeof configuracion.rutas,
          stopId: selectedStop
        })
        
        setBusArrivalResult(result)
        
        // Desplazarse automáticamente a la sección de resultados
        setTimeout(() => {
          if (horariosCalculadosRef.current) {
            const elementPosition = horariosCalculadosRef.current.offsetTop
            const headerOffset = 80 // Altura aproximada del header fijo
            const offsetPosition = elementPosition - headerOffset
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          }
        }, 100)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al calcular horarios')
        setBusArrivalResult(null)
      } finally {
        setIsLoadingGPS(false)
      }
    }, 1500)
  }

  const getParadasForRoute = (routeId: string): StopData[] => {
    const stops = allParadas[routeId as keyof typeof allParadas] || [];
    return stops.filter(isStopData);
  };

  const getGroupedParadas = () => {
    const grouped: { [key: string]: StopData[] } = {};
    const stopsForSelectedRoute = getParadasForRoute(selectedRoute);

    stopsForSelectedRoute.forEach(stop => {
      if (!grouped[stop.localidad]) {
        grouped[stop.localidad] = [];
      }
      grouped[stop.localidad].push(stop);
    });
    return grouped;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
          Consultor de Horarios en
          <span className="block sm:inline"> </span>
          <span className="text-green-600">Tiempo Real</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-green-600 to-green-500 mx-auto mb-4 sm:mb-6 rounded-full"></div>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Calcula tiempos de llegada basados en horarios oficiales y ubicación de paradas con precisión GPS.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* Panel de Consulta */}
        <Card className="h-fit shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-100">
            <CardTitle className="flex items-center space-x-3 text-lg sm:text-xl">
              <div className="p-2 bg-green-600 rounded-lg">
                <Bus className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800">Panel de Consulta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6">
            {/* Selector de Ruta */}
            <div className="space-y-3">
              <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">
                🚌 Seleccionar Ruta
              </label>
              <Tabs value={selectedRoute} onValueChange={setSelectedRoute}>
                <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 p-1">
                  <TabsTrigger value="santafe_montevera" className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200">
                    <span className="hidden sm:inline">Santa Fe → Monte Vera</span>
                    <span className="sm:hidden">SF → MV</span>
                  </TabsTrigger>
                  <TabsTrigger value="montevera_santafe" className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200">
                    <span className="hidden sm:inline">Monte Vera → Santa Fe</span>
                    <span className="sm:hidden">MV → SF</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
             {/*<div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-green-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">
                    {configuracion.rutas[selectedRoute as keyof typeof configuracion.rutas].nombre}
                  </span>
                  <Badge variant="outline" className="w-fit bg-white border-green-300 text-green-700">
                    <Clock className="h-3 w-3 mr-1" />
                    {configuracion.rutas[selectedRoute as keyof typeof configuracion.rutas].duracion} min recorrido
                  </Badge>
                </div>
              </div>*/}
            </div>

            {/* Detector de Ubicación */}
            <div className="space-y-3">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                📍 Ubicación Automática
              </label>
              <Button
                onClick={detectLocation}
                disabled={isLoadingLocation}
                variant="outline"
                className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 group"
              >
                <Navigation className={`h-4 w-4 mr-2 transition-transform duration-300 ${isLoadingLocation ? 'animate-spin' : 'group-hover:scale-110'}`} />
                <span className="font-medium">
                  {isLoadingLocation ? 'Detectando ubicación...' : 'Detectar mi ubicación'}
                </span>
              </Button>
              
              {nearestStop && (
                <Alert className="border-green-200 bg-green-50">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <span className="font-medium">Parada más cercana:</span>
                    <br className="sm:hidden" />
                    <span className="sm:ml-1 font-semibold">{nearestStop.nombre}</span>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Selector de Parada */}
            <div className="space-y-3">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                🚏 Seleccionar Parada
              </label>
              <Select value={selectedStop} onValueChange={(value) => {
                setSelectedStop(value)
                // Encontrar la parada completa y pasarla al contexto
                const allStopsArray = Object.values(allParadas).flat().filter(isStopData)
                const foundStop = allStopsArray.find(stop => stop.id === value)
                if (foundStop) {
                  setSelectedStopInMap(foundStop)
                } else {
                  setSelectedStopInMap(null)
                }
              }}>
                <SelectTrigger className="h-12 border-2 text-sm sm:text-base">
                  <SelectValue placeholder="Elegir parada del recorrido..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {Object.entries(getGroupedParadas()).map(([zona, paradas]) => (
                    <div key={zona}>
                      <div className="px-3 py-2 text-xs sm:text-sm font-bold text-gray-600 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
                        📍 {zona}
                      </div>
                      {paradas.map((parada) => (
                        <SelectItem key={parada.id} value={parada.id} className="text-sm py-3 hover:bg-green-50">
                          <div className="flex flex-col">
                            <span className="font-medium">{parada.id} - {parada.nombre}</span>
                            {parada.referencias && parada.referencias[0] && (
                              <span className="text-xs text-gray-500 mt-1">{parada.referencias[0]}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botón de Consulta */}
            <Button
              onClick={consultarGPS}
              disabled={!selectedStop || isLoadingGPS}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50"
            >
              {isLoadingGPS ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                  <span>Consultando GPS...</span>
                </>
              ) : (
                <>
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>Consultar Tiempo Real</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Panel de Resultados */}
        <Card ref={horariosCalculadosRef} className="h-fit shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-100">
            <CardTitle className="flex items-center space-x-3 text-lg sm:text-xl">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800">Horarios Calculados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {error && (
              <Alert className="mb-4">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {!busArrivalResult && !error ? (
              <div className="text-center py-12 sm:py-16 text-gray-500">
                <div className="relative">
                  <Bus className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-6 opacity-30" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-bold">?</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2 text-base sm:text-lg">¿Cuándo llega mi colectivo?</h3>
                <p className="text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                  Selecciona una parada y consulta para ver los horarios en tiempo real
                </p>
              </div>
            ) : busArrivalResult && (
              <div className="space-y-6">
                {/* Estado del Servicio */}
                {busArrivalResult.status === 'no_service' ? (
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-red-900 mb-2">No hay más servicios</h3>
                    <p className="text-red-700">No hay más colectivos programados para hoy</p>
                  </div>
                ) : (
                  <>
                    {/* Próximo Colectivo y Siguiente Servicio */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl border border-blue-200 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Próximo Colectivo */}
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                            <h3 className="font-bold text-blue-900 text-base sm:text-lg">Próximo Colectivo</h3>
                          </div>
                          <p className={`text-3xl sm:text-4xl font-bold mb-2 ${BusTimingService.getStatusColor(busArrivalResult.minutesToArrival)}`}>
                            {BusTimingService.formatTimeDifference(busArrivalResult.minutesToArrival)}
                          </p>
                          <p className="text-sm sm:text-base text-blue-700 font-medium">
                            {BusTimingService.getStatusMessage(busArrivalResult.status, busArrivalResult.minutesToArrival)}
                          </p>
                        </div>

                        {/* Siguiente Servicio */}
                        {busArrivalResult.followingBus && (
                          <div className="border-l-0 md:border-l-2 md:border-blue-200 md:pl-6">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Siguiente Servicio</h3>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                              {BusTimingService.formatTimeDifference(busArrivalResult.followingBus.minutesToArrival)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium">
                              Salida: {busArrivalResult.followingBus.departureTime}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Información del Viaje */}
                    <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 space-y-4">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 pb-2 border-b border-gray-100">📋 Detalles del Viaje</h4>
                      
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">🚏 Salida de la Terminal:</span>
                          <span className="font-bold text-gray-800 text-sm sm:text-base">{busArrivalResult.departureTime}</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">⏰ Llegada Estimada a la Parada:</span>
                          <span className="font-bold text-green-700 text-sm sm:text-base">
                            {busArrivalResult.nextBusArrival.toLocaleTimeString('es-AR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        
                        {/*<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                          <span className="text-gray-600 text-sm sm:text-base font-medium">🎯 Precisión:</span>
                          <Badge variant="outline" className="w-fit bg-green-50 border-green-300 text-green-700 text-xs font-medium">
                            Horarios Oficiales + GPS
                          </Badge>
                        </div>*/}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mapa en Tiempo Real */}
      <div className="mt-8 sm:mt-12">
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">🗺️ Mapa en Tiempo Real</h3>
          <p className="text-sm sm:text-base text-gray-600">
            Visualiza la ubicación actual de los colectivos y la parada seleccionada en el mapa interactivo.
          </p>
        </div>
        <DynamicMap />
      </div>
    </div>
  )
}
