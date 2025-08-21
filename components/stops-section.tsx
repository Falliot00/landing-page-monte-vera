'use client'

import { useState } from 'react'
import { MapPin, Navigation, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { paradas as allParadasData } from '@/lib/data'
import { useStopSelection } from '@/contexts/stop-selection-context'
import DynamicStopsMap from '@/components/dynamic-stops-map'

interface StopData {
  id: string
  nombre: string
  coordenadas: { lat: number; lng: number }
  tiempoDesdeInicio: string
  localidad: string
  referencias?: string[]
}

export default function StopsSection() {
  const { selectedRoute, setSelectedRoute, setSelectedStop, selectedStop } = useStopSelection()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedLocality, setExpandedLocality] = useState<string | null>(null)

  // Función para manejar la selección de parada
  const handleStopClick = (stop: StopData) => {
    setSelectedStop(stop)
    // Hacer scroll al mapa suavemente
    const mapSection = document.getElementById('interactive-map')
    if (mapSection) {
      mapSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }
  }

  // Define route configurations
  const routeConfigs = {
    santafe_montevera: {
      name: 'Santa Fe → Monte Vera',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      stops: allParadasData.santafe_montevera,
      description: 'Desde Terminal Santa Fe hasta Monte Vera'
    },
    montevera_santafe: {
      name: 'Monte Vera → Santa Fe',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      stops: allParadasData.montevera_santafe,
      description: 'Desde Monte Vera hasta Terminal Santa Fe'
    }
  }

  // Group stops by locality for the selected route
  const getGroupedStops = () => {
    const selectedStops = routeConfigs[selectedRoute].stops
    const filtered = selectedStops.filter(stop => 
      stop.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.localidad.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const grouped: { [locality: string]: typeof selectedStops } = {}
    filtered.forEach(stop => {
      if (!grouped[stop.localidad]) {
        grouped[stop.localidad] = []
      }
      grouped[stop.localidad].push(stop)
    })

    // Sort stops within each locality by ID
    Object.keys(grouped).forEach(locality => {
      grouped[locality].sort((a, b) => {
        const aNum = parseInt(a.id.replace('MV', ''))
        const bNum = parseInt(b.id.replace('MV', ''))
        return aNum - bNum
      })
    })

    return grouped
  }

  const groupedStops = getGroupedStops()

  const getGoogleMapsUrl = (lat: number, lng: number, name: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`
  }

  const toggleLocality = (locality: string) => {
    setExpandedLocality(prev => prev === locality ? null : locality)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Paradas de Servicio
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Encuentra todas las paradas del recorrido Monte Vera. Selecciona tu ruta y localiza fácilmente la parada más cercana.
        </p>
      </div>

      {/* Route Selector Tabs */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 p-1 bg-gray-100 rounded-xl">
          {Object.entries(routeConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedRoute(key as 'santafe_montevera' | 'montevera_santafe')
                setSelectedStop(null) // Limpiar parada seleccionada al cambiar ruta
                setExpandedLocality(null)
                setSearchTerm('')
              }}
              className={`flex-1 py-4 px-6 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
                selectedRoute === key
                  ? `${config.color} text-white shadow-lg transform scale-[1.02]`
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${selectedRoute === key ? 'bg-white' : config.color}`}></div>
                <span>{config.name}</span>
              </div>
              <div className="text-xs opacity-75 mt-1">
                {config.stops.length} paradas
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Info Card 
      <Card className={`mb-6 ${routeConfigs[selectedRoute].borderColor} border-2`}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar parada por nombre, código o localidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{totalStops} paradas</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>~{Math.round(totalStops * 1.5)} min</span>
              </div>
            </div>
          </div>
          
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600">
              Mostrando {totalStops} paradas que coinciden con &quot;{searchTerm}&quot;
            </div>
          )}
        </CardContent>
      </Card>*/}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stops List */}
        <div className="space-y-4">
          <Card>
            <CardHeader className={`${routeConfigs[selectedRoute].bgColor} ${routeConfigs[selectedRoute].borderColor} border-b-2`}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`${routeConfigs[selectedRoute].textColor} flex items-center space-x-2`}>
                    <MapPin className="h-5 w-5" />
                    <span>Lista de Paradas</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">{routeConfigs[selectedRoute].description}</p>
                </div>
                {selectedStop && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStop(null)}
                    className="text-xs"
                  >
                    Limpiar selección
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {Object.keys(groupedStops).length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No se encontraron paradas con los criterios de búsqueda.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setSearchTerm('')}
                  >
                    Limpiar búsqueda
                  </Button>
                </div>
              ) : (
                <div className="h-96 lg:h-[500px] overflow-y-auto">
                  {Object.entries(groupedStops).map(([locality, stops]) => (
                    <div key={locality} className="border-b border-gray-100 last:border-b-0">
                      <button
                        onClick={() => toggleLocality(locality)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${routeConfigs[selectedRoute].color}`}></div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{locality}</h3>
                            <p className="text-sm text-gray-500">{stops.length} paradas</p>
                          </div>
                        </div>
                        {expandedLocality === locality ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      
                      {expandedLocality === locality && (
                        <div className="bg-gray-50 border-t border-gray-100">
                          {stops.map((stop) => (
                            <div 
                              key={stop.id} 
                              className={`flex items-center justify-between p-4 pl-8 hover:bg-white transition-colors border-b border-gray-100 last:border-b-0 ${
                                selectedStop?.id === stop.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                              }`}
                            >
                              <div 
                                className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                                onClick={() => handleStopClick(stop)}
                              >
                                <div className="flex-shrink-0">
                                  <Badge 
                                    variant={selectedStop?.id === stop.id ? "default" : "outline"} 
                                    className={`text-xs font-mono ${
                                      selectedStop?.id === stop.id ? 'bg-orange-500 text-white' : ''
                                    }`}
                                  >
                                    {stop.id}
                                  </Badge>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className={`font-medium text-sm truncate transition-colors ${
                                    selectedStop?.id === stop.id 
                                      ? 'text-orange-600 font-semibold' 
                                      : 'text-gray-900 hover:text-blue-600'
                                  }`}>
                                    {stop.nombre}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    {stop.tiempoDesdeInicio}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-8 px-2 text-xs flex-shrink-0"
                                asChild
                              >
                                <a
                                  href={getGoogleMapsUrl(stop.coordenadas.lat, stop.coordenadas.lng, stop.nombre)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Navigation className="h-3 w-3 mr-1" />
                                  <span className="hidden sm:inline">Ver</span>
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <div className="space-y-4" id="interactive-map">
          <Card>
            <CardHeader className={`${routeConfigs[selectedRoute].bgColor} ${routeConfigs[selectedRoute].borderColor} border-b-2`}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`${routeConfigs[selectedRoute].textColor} flex items-center space-x-2`}>
                    <MapPin className="h-5 w-5" />
                    <span>Mapa Interactivo</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {routeConfigs[selectedRoute].description}
                    {selectedStop && (
                      <span className="text-orange-600 font-medium ml-2">
                        | Parada seleccionada: {selectedStop.id} - {selectedStop.nombre}
                      </span>
                    )}
                  </p>
                </div>
                {selectedStop && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStop(null)}
                    className="text-xs"
                  >
                    Centrar mapa
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 lg:h-[500px]">
                <DynamicStopsMap />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats 
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {allParadasData.santafe_montevera.length}
            </div>
            <div className="text-sm text-blue-700">Paradas SF → MV</div>
          </CardContent>
        </Card>
        
        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {allParadasData.montevera_santafe.length}
            </div>
            <div className="text-sm text-green-700">Paradas MV → SF</div>
          </CardContent>
        </Card>
        
        <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              ~{Math.round((allParadasData.santafe_montevera.length + allParadasData.montevera_santafe.length) / 2 * 1.5)}
            </div>
            <div className="text-sm text-purple-700">Minutos promedio</div>
          </CardContent>
        </Card>
      </div>*/}
    </div>
  )
}
