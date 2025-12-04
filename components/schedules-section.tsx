'use client'

import { useEffect, useState } from 'react'
import { Clock, Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { configuracion } from '@/lib/data'

export default function SchedulesSection() {
  const [selectedRoute, setSelectedRoute] = useState('santafe_montevera')

  const schedules = {
    'santafe_montevera': {
      title: configuracion.rutas.santafe_montevera.nombre,
      duration: configuracion.rutas.santafe_montevera.duracion + ' minutos',
      laborables: {
        servicios: configuracion.horariosOficiales.santafe_montevera.laborables.horarios.length,
        horarios: configuracion.horariosOficiales.santafe_montevera.laborables.horarios
      },
      sabados: {
        servicios: configuracion.horariosOficiales.santafe_montevera.sabados.horarios.length,
        horarios: configuracion.horariosOficiales.santafe_montevera.sabados.horarios
      },
      domingos: {
        servicios: configuracion.horariosOficiales.santafe_montevera.domingos.horarios.length,
        horarios: configuracion.horariosOficiales.santafe_montevera.domingos.horarios
      }
    },
    'montevera_santafe': {
      title: configuracion.rutas.montevera_santafe.nombre,
      duration: configuracion.rutas.montevera_santafe.duracion + ' minutos',
      laborables: {
        servicios: configuracion.horariosOficiales.montevera_santafe.laborables.horarios.length,
        horarios: configuracion.horariosOficiales.montevera_santafe.laborables.horarios
      },
      sabados: {
        servicios: configuracion.horariosOficiales.montevera_santafe.sabados.horarios.length,
        horarios: configuracion.horariosOficiales.montevera_santafe.sabados.horarios
      },
      domingos: {
        servicios: configuracion.horariosOficiales.montevera_santafe.domingos.horarios.length,
        horarios: configuracion.horariosOficiales.montevera_santafe.domingos.horarios
      }
    }
  }

  const currentSchedule = schedules[selectedRoute as keyof typeof schedules]

  const argentinaTime = () =>
    new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/Argentina/Buenos_Aires'
      })
    )

  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    setCurrentTime(argentinaTime())

    const interval = setInterval(() => setCurrentTime(argentinaTime()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const getTimeStatus = (time: string) => {
    if (!currentTime) {
      return 'upcoming'
    }

    const currentHour = currentTime.getHours()
    const currentMinute = currentTime.getMinutes()
    const [hour, minute] = time.split(':').map(Number)
    
    const currentTotalMinutes = currentHour * 60 + currentMinute
    const scheduleTotalMinutes = hour * 60 + minute
    
    if (scheduleTotalMinutes < currentTotalMinutes) {
      return 'passed'
    } else if (scheduleTotalMinutes - currentTotalMinutes <= 30) {
      return 'soon'
    }
    return 'upcoming'
  }

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Horarios de Servicio
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Consulta todos los horarios organizados por día de la semana y dirección de viaje
        </p>
      </div>

      {/* Selector de Ruta */}
      <div className="flex justify-center mb-8">
        <Tabs value={selectedRoute} onValueChange={setSelectedRoute} className="w-full max-w-2xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="santafe_montevera" className="text-sm md:text-base">
              Desde Santa Fe
            </TabsTrigger>
            <TabsTrigger value="montevera_santafe" className="text-sm md:text-base">
              Desde Laguna Paiva
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Información de la Ruta */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <ArrowRight className="h-5 w-5 text-green-600" />
            <span>{currentSchedule.title}</span>
          </CardTitle>
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Recorrido: {currentSchedule.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{configuracion.rutas[selectedRoute as keyof typeof configuracion.rutas].paradasCount} paradas</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Horarios por Día */}
      <Tabs defaultValue="laborables" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="laborables">
            Lunes a Viernes
          </TabsTrigger>
          <TabsTrigger value="sabados">
            Sábados
          </TabsTrigger>
          <TabsTrigger value="domingos">
            Domingos y Feriados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="laborables">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lunes a Viernes</span>
                <Badge variant="outline">
                  {currentSchedule.laborables.servicios} servicios
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
                {currentSchedule.laborables.horarios.map((time, index) => {
                  const status = getTimeStatus(time)
                  return (
                    <div
                      key={index}
                      className={`p-2 md:p-3 rounded-lg text-center font-mono text-sm border transition-all duration-300 transform hover:scale-105 ${
                        status === 'passed'
                          ? 'bg-gray-50 text-gray-400 border-gray-200'
                          : status === 'soon'
                          ? 'bg-green-50 text-green-800 border-green-300 font-semibold shadow-sm hover:shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-green-300'
                      }`}
                    >
                      {time}
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>Próximo (30 min)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
                  <span>Ya pasó</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                  <span>Próximos servicios</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sabados">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sábados</span>
                <Badge variant="outline">
                  {currentSchedule.sabados.servicios} servicios
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {currentSchedule.sabados.horarios.map((time, index) => {
                  const status = getTimeStatus(time)
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-center font-mono text-sm border ${
                        status === 'passed'
                          ? 'bg-gray-100 text-gray-400 border-gray-200'
                          : status === 'soon'
                          ? 'bg-green-100 text-green-800 border-green-300 font-semibold'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>Próximo (30 min)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
                  <span>Ya pasó</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                  <span>Próximos servicios</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domingos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Domingos y Feriados</span>
                <Badge variant="outline">
                  {currentSchedule.domingos.servicios} servicios
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {currentSchedule.domingos.horarios.map((time, index) => {
                  const status = getTimeStatus(time)
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-center font-mono text-sm border ${
                        status === 'passed'
                          ? 'bg-gray-100 text-gray-400 border-gray-200'
                          : status === 'soon'
                          ? 'bg-green-100 text-green-800 border-green-300 font-semibold'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>Próximo (30 min)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
                  <span>Ya pasó</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                  <span>Próximos servicios</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Información Operativa */}
      {/*<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 mb-2">Horarios de Alta Demanda</h3>
            <p className="text-sm text-blue-800">07:00-09:00 y 17:00-19:00</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <ArrowRight className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">Tiempo de Recorrido</h3>
            <p className="text-sm text-green-800">55 minutos exactos</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-orange-900 mb-2">Frecuencia Variable</h3>
            <p className="text-sm text-orange-800">15-30 minutos según demanda</p>
          </CardContent>
        </Card>
      </div>*/}
    </div>
  )
}
