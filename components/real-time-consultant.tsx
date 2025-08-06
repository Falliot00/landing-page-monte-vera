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

export default function RealTimeConsultant() {
  const [selectedRoute, setSelectedRoute] = useState('santafe_montevera')
  const [selectedStop, setSelectedStop] = useState('')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoadingGPS, setIsLoadingGPS] = useState(false)
  const [gpsResult, setGpsResult] = useState<any>(null)
  const [nearestStop, setNearestStop] = useState<any>(null)

  // Simular colectivos en tiempo real
  const [buses] = useState([
    {
      id: "MV001",
      ruta: "santafe_montevera",
      ubicacion: { lat: -31.615, lng: -60.697 },
      velocidad: 35,
      proximaParada: "MV11",
      estado: "en_ruta"
    },
    {
      id: "MV002", 
      ruta: "montevera_santafe",
      ubicacion: { lat: -31.520, lng: -60.685 },
      velocidad: 42,
      proximaParada: "MV65",
      estado: "en_ruta"
    }
  ])

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

  // Consultar GPS en tiempo real
  const consultarGPS = () => {
    if (!selectedStop) return
    
    setIsLoadingGPS(true)
    
    // Simular consulta GPS
    setTimeout(() => {
      const tiempoEstimado = Math.floor(Math.random() * 25) + 5 // 5-30 minutos
      const siguienteColectivo = Math.floor(Math.random() * 40) + 15 // 15-55 minutos
      
      setGpsResult({
        tiempoEstimado,
        siguienteColectivo,
        colectivoId: buses.find(b => b.ruta === selectedRoute)?.id || 'MV001',
        distancia: `${(Math.random() * 2 + 0.5).toFixed(1)} km`,
        metodo: 'GPS + Google Maps Traffic'
      })
      
      setIsLoadingGPS(false)
    }, 2000)
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
          Consultor GPS en Tiempo Real
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Encuentra tu colectivo, calcula tiempos de llegada precisos.
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
              <span>Resultados en Tiempo Real</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!gpsResult ? (
              <div className="text-center py-12 text-gray-500">
                <Bus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecciona una parada y consulta para ver los tiempos</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tiempo Estimado */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900">Próximo Colectivo</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {gpsResult.tiempoEstimado} minutos
                      </p>
                    </div>
                    <div className="text-blue-600">
                      <Bus className="h-8 w-8" />
                    </div>
                  </div>
                </div>

                {/* Siguiente Colectivo */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Siguiente Servicio</h3>
                  <p className="text-lg font-medium text-gray-600">
                    En {gpsResult.siguienteColectivo} minutos
                  </p>
                </div>

                {/* Información del Viaje */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Colectivo ID:</span>
                    <Badge variant="outline">{gpsResult.colectivoId}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Distancia:</span>
                    <span className="font-medium">{gpsResult.distancia}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Método:</span>
                    <span className="text-xs text-green-600">{gpsResult.metodo}</span>
                  </div>
                </div>
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
