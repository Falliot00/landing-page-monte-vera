'use client'

import { useState } from 'react'
import { MapPin, Search, Navigation, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { paradas as allParadasData, configuracion } from '@/lib/data'

export default function StopsSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocality, setSelectedLocality] = useState('all')
  // Separate states for route and locality expansion
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null)
  const [expandedLocalityId, setExpandedLocalityId] = useState<string | null>(null)

  // Define display info for localities (colors, codes)
  const localityDisplayInfo: { [key: string]: { codes: string; color: string; dotColorClass: string } } = {
    "Santa Fe": { codes: "MV00-MV15, MV82-MV97", color: "bg-blue-100 text-blue-800", dotColorClass: "bg-blue-500" },
    "Espora": { codes: "MV16-MV30, MV68-MV81", color: "bg-green-100 text-green-800", dotColorClass: "bg-green-500" },
    "Parada 10": { codes: "MV30, MV67", color: "bg-yellow-100 text-yellow-800", dotColorClass: "bg-yellow-500" },
    "A. Gallardo": { codes: "MV31-MV32, MV65-MV66", color: "bg-purple-100 text-purple-800", dotColorClass: "bg-purple-500" },
    "A. Mirta": { codes: "MV33-MV34, MV63-MV64", color: "bg-pink-100 text-pink-800", dotColorClass: "bg-pink-500" },
    "Monte Vera": { codes: "MV35-MV62, MV49-MV48", color: "bg-orange-100 text-orange-800", dotColorClass: "bg-orange-500" }
  };

  // Combine all stops from both routes and remove duplicates for overall summary
  const allUniqueStops = Array.from(new Map(
    [...allParadasData.santafe_montevera, ...allParadasData.montevera_santafe].map(stop => [stop.id, stop])
  ).values());

  // Prepare data for summary cards (top section)
  const paradasPorLocalidadSummary = Object.keys(localityDisplayInfo).map(locality => {
    const stopsInLocality = allUniqueStops.filter(p => p.localidad === locality);
    return {
      locality,
      count: stopsInLocality.length,
      codes: localityDisplayInfo[locality].codes,
      color: localityDisplayInfo[locality].color,
      dotColorClass: localityDisplayInfo[locality].dotColorClass,
    };
  });

  // Function to group and filter stops by route and then by locality
  const getGroupedStopsByRouteAndLocality = () => {
    const grouped: { [routeId: string]: { [locality: string]: any[] } } = {};

    for (const routeId of Object.keys(allParadasData) as Array<keyof typeof allParadasData>) {
      const stopsForRoute = allParadasData[routeId];
      const filteredStopsForRoute = stopsForRoute.filter(stop => {
        const matchesSearch = searchTerm === '' ||
          stop.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (stop.referencias ?? []).some((ref: string) => ref.toLowerCase().includes(searchTerm.toLowerCase())) ||
          stop.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesLocalityFilter = selectedLocality === 'all' || stop.localidad === selectedLocality;
        
        return matchesSearch && matchesLocalityFilter;
      });

      const localitiesInRoute: { [locality: string]: any[] } = {};
      filteredStopsForRoute.forEach(stop => {
        if (!localitiesInRoute[stop.localidad]) {
          localitiesInRoute[stop.localidad] = [];
        }
        localitiesInRoute[stop.localidad].push(stop);
      });

      // Sort stops within each locality by ID
      Object.keys(localitiesInRoute).forEach(locality => {
        localitiesInRoute[locality].sort((a, b) => a.id.localeCompare(b.id));
      });

      // Sort localities alphabetically for consistent display
      const sortedLocalitiesInRoute: { [locality: string]: any[] } = {};
      Object.keys(localitiesInRoute).sort().forEach(key => {
        sortedLocalitiesInRoute[key] = localitiesInRoute[key];
      });

      if (Object.keys(sortedLocalitiesInRoute).length > 0) {
        grouped[routeId] = sortedLocalitiesInRoute;
      }
    }
    return grouped;
  };

  const groupedStops = getGroupedStopsByRouteAndLocality();

  // Calculate total filtered stops count for the header
  const totalFilteredStopsCount = Object.values(groupedStops).reduce((acc, routeLocalities) => {
    return acc + Object.values(routeLocalities).reduce((sum, stops) => sum + stops.length, 0);
  }, 0);

  const toggleRoute = (routeId: string) => {
    setExpandedRouteId(prev => (prev === routeId ? null : routeId));
    setExpandedLocalityId(null); // Collapse any expanded locality when route changes
  };

  const toggleLocality = (localityId: string) => {
    setExpandedLocalityId(prev => (prev === localityId ? null : localityId));
  };

  const getGoogleMapsUrl = (lat: number, lng: number, name: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Paradas de Servicio
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          98 paradas estratégicamente ubicadas en 6 localidades para tu comodidad
        </p>
      </div>


      {/* Buscador y Filtros */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-600" />
            <span>Buscar Paradas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre, código o referencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="md:w-48">
              <Tabs value={selectedLocality} onValueChange={setSelectedLocality}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                  <TabsTrigger value="Santa Fe" className="text-xs">Filtrar</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Filtros por Localidad */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedLocality === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLocality('all')}
            >
              Todas las paradas
            </Button>
            {paradasPorLocalidadSummary.map((data) => (
              <Button
                key={data.locality}
                variant={selectedLocality === data.locality ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLocality(data.locality)}
              >
                {data.locality}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Paradas Desplegable por Ruta y Localidad */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span>Lista de Paradas</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Total de paradas encontradas: {totalFilteredStopsCount}
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {totalFilteredStopsCount === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron paradas con los criterios de búsqueda.
              </div>
            ) : (
              Object.entries(groupedStops).map(([routeId, localities]) => (
                <div key={routeId} className="border-b border-gray-200 last:border-b-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-between py-4 px-4 text-base font-bold text-gray-900 hover:bg-gray-100"
                    onClick={() => toggleRoute(routeId)}
                    aria-expanded={expandedRouteId === routeId}
                    aria-controls={`stops-list-${routeId}`}
                  >
                    <div className="flex items-center">
                      <span>{configuracion.rutas[routeId as keyof typeof configuracion.rutas]?.nombre || routeId}</span>
                      <Badge variant="secondary" className="ml-2">
                        {Object.values(localities).flat().length} paradas
                      </Badge>
                    </div>
                    {expandedRouteId === routeId ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                  {expandedRouteId === routeId && (
                    <div id={`stops-list-${routeId}`} className="divide-y divide-gray-100 bg-gray-50">
                      {Object.entries(localities).map(([locality, stops]) => (
                        <div key={`${routeId}-${locality}`} className="border-t border-gray-200 first:border-t-0">
                          <Button
                            variant="ghost"
                            className="w-full justify-between py-3 px-6 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                            onClick={() => toggleLocality(`${routeId}-${locality}`)}
                            aria-expanded={expandedLocalityId === `${routeId}-${locality}`}
                            aria-controls={`stops-list-${routeId}-${locality}`}
                          >
                            <div className="flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-2 ${localityDisplayInfo[locality]?.dotColorClass || 'bg-gray-500'}`}></span>
                              <span>{locality} ({stops.length} paradas)</span>
                            </div>
                            {expandedLocalityId === `${routeId}-${locality}` ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                          {expandedLocalityId === `${routeId}-${locality}` && (
                            <div id={`stops-list-${routeId}-${locality}`} className="divide-y divide-gray-100 bg-white">
                              {stops.map((stop) => (
                                <div key={stop.id} className="flex items-center justify-between py-2 px-8 hover:bg-gray-50 transition-colors">
                                  <div className="flex flex-col">
                                    <div className="font-medium text-gray-900 text-sm">
                                      {stop.id} - {stop.nombre}
                                    </div>
                                    {stop.referencias && stop.referencias.length > 0 && (
                                      <span className="text-xs text-gray-500">({(stop.referencias ?? []).join(', ')})</span>
                                    )}
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-xs"
                                    asChild // Use asChild to render Button as an <a> tag
                                  >
                                    <a 
                                      href={getGoogleMapsUrl(stop.coordenadas.lat, stop.coordenadas.lng, stop.nombre)} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      <Navigation className="h-3 w-3 mr-1" />
                                      Ver en mapa
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
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mapa Interactivo Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span>Mapa Interactivo de Paradas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">Mapa Interactivo</p>
              <p className="text-sm mb-4">Visualización de todas las 98 paradas georreferenciadas</p>
              <div className="flex justify-center space-x-4 text-xs">
                {paradasPorLocalidadSummary.map((data) => (
                  <div key={data.locality} className="flex items-center space-x-1">
                    <div className={`w-3 h-3 rounded-full ${data.dotColorClass}`}></div>
                    <span>{data.locality}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 mb-2">Paradas Principales</h3>
            <p className="text-sm text-blue-800">Terminal Santa Fe y Galpón Monte Vera</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Navigation className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">Accesibilidad</h3>
            <p className="text-sm text-green-800">65% de paradas con acceso para personas con movilidad reducida</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-orange-900 mb-2">Tiempo entre Paradas</h3>
            <p className="text-sm text-orange-800">Promedio de 1-2 minutos entre paradas consecutivas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
