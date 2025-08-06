'use client'

import { useState } from 'react'
import { MapPin, Navigation, Clock, Bus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { paradas as allParadas, configuracion } from '@/lib/data'
import DynamicMap from '@/components/dynamic-map'
import { BusTimingService, type BusArrivalResult } from '@/lib/bus-timing-service'

export default function RealTimeConsultant() {
  const [selectedRoute, setSelectedRoute] = useState('santafe_montevera')
  const [selectedStop, setSelectedStop] = useState('')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoadingGPS, setIsLoadingGPS] = useState(false)
  const [busArrivalResult, setBusArrivalResult] = useState<BusArrivalResult | null>(null)
  const [nearestStop, setNearestStop] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)


  // Detectar ubicación del usuario
  const detectLocation = () => {
    setIsLoadingLocation(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          
          // Encontrar parada más cercana
          const allStopsArray = Object.values(allParadas).flat()
          let closest: any = null
          let minDistance = Infinity
          
          allStopsArray.forEach(stop => {
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
          }
          
          setIsLoadingLocation(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsLoadingLocation(false)
        }
      )
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al calcular horarios')
        setBusArrivalResult(null)
      } finally {
        setIsLoadingGPS(false)
      }
    }, 1500)
  }

  const getParadasForRoute = (routeId: string) => {
    return allParadas[routeId as keyof typeof allParadas] || [];
  };

  const getGroupedParadas = () => {
    const grouped: { [key: string]: any[] } = {};
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
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Consultor de Horarios en Tiempo Real
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calcula tiempos de llegada basados en horarios oficiales y ubicación de paradas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de Consulta */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bus className="h-5 w-5 text-green-600" />
              <span>Panel de Consulta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selector de Ruta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Ruta
              </label>
              <Tabs value={selectedRoute} onValueChange={setSelectedRoute}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="santafe_montevera" className="text-xs">
                    SF → MV
                  </TabsTrigger>
                  <TabsTrigger value="montevera_santafe" className="text-xs">
                    MV → SF
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {configuracion.rutas[selectedRoute as keyof typeof configuracion.rutas].nombre}
                  </span>
                  <Badge variant="outline">
                    {configuracion.rutas[selectedRoute as keyof typeof configuracion.rutas].duracion} min
                  </Badge>
                </div>
              </div>
            </div>

            {/* Detector de Ubicación */}
            <div>
              <Button
                onClick={detectLocation}
                disabled={isLoadingLocation}
                variant="outline"
                className="w-full"
              >
                <Navigation className="h-4 w-4 mr-2" />
                {isLoadingLocation ? 'Detectando ubicación...' : '📍 Detectar mi ubicación'}
              </Button>
              
              {nearestStop && (
                <Alert className="mt-2">
                  <AlertDescription>
                    Parada más cercana: <strong>{nearestStop.nombre}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Selector de Parada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Parada
              </label>
              <Select value={selectedStop} onValueChange={setSelectedStop}>
                <SelectTrigger>
                  <SelectValue placeholder="Elegir parada..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(getGroupedParadas()).map(([zona, paradas]) => (
                    <div key={zona}>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                        {zona}
                      </div>
                      {paradas.map((parada) => (
                        <SelectItem key={parada.id} value={parada.id}>
                          {parada.id} - {parada.nombre}
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
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isLoadingGPS ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Consultando GPS...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Consultar Tiempo Real
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Panel de Resultados */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Horarios Calculados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {!busArrivalResult && !error ? (
              <div className="text-center py-12 text-gray-500">
                <Bus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecciona una parada y consulta para ver los tiempos</p>
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
                    {/* Próximo Colectivo */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-blue-900">Próximo Colectivo</h3>
                          <p className={`text-2xl font-bold ${BusTimingService.getStatusColor(busArrivalResult.minutesToArrival)}`}>
                            {BusTimingService.formatTimeDifference(busArrivalResult.minutesToArrival)}
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            {BusTimingService.getStatusMessage(busArrivalResult.status, busArrivalResult.minutesToArrival)}
                          </p>
                        </div>
                        <div className="text-blue-600">
                          <Bus className="h-8 w-8" />
                        </div>
                      </div>
                    </div>

                    {/* Siguiente Colectivo */}
                    {busArrivalResult.followingBus && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Siguiente Servicio</h3>
                        <p className="text-lg font-medium text-gray-600">
                          {BusTimingService.formatTimeDifference(busArrivalResult.followingBus.minutesToArrival)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Salida: {busArrivalResult.followingBus.departureTime}
                        </p>
                      </div>
                    )}

                    {/* Información del Viaje */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Salida Terminal:</span>
                        <span className="font-medium">{busArrivalResult.departureTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Llegada Estimada:</span>
                        <span className="font-medium">
                          {busArrivalResult.nextBusArrival.toLocaleTimeString('es-AR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Método:</span>
                        <span className="text-xs text-green-600">Horarios Oficiales + Cálculo Preciso</span>
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
      <div className="mt-8">
        <DynamicMap />
      </div>
    </div>
  )
}
