'use client'

import { useState } from 'react'

interface TarifaMatriz {
  [origen: string]: {
    [destino: string]: number
  }
}

interface TarifasData {
  matriz: TarifaMatriz
}

interface CalculoTarifa {
  precio: number
  valido?: boolean
  mensaje: string
}
import { DollarSign, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { tarifas } from '@/lib/data'

export default function FaresSection() {
  const [selectedOrigin, setSelectedOrigin] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')

  const tarifasData: TarifasData = tarifas
  const zonas = Object.keys(tarifasData.matriz)

  const calcularTarifa = (): CalculoTarifa | null => {
    if (!selectedOrigin || !selectedDestination) return null
    
    if (selectedOrigin === selectedDestination) {
      return { precio: 0, mensaje: "Origen y destino son iguales" }
    }

    // Verificar si existe la combinación directa
    if (tarifasData.matriz[selectedOrigin] && tarifasData.matriz[selectedOrigin][selectedDestination]) {
      return {
        precio: tarifasData.matriz[selectedOrigin][selectedDestination],
        valido: true,
        mensaje: "Tarifa válida"
      }
    }

    // Verificar combinación inversa
    if (tarifasData.matriz[selectedDestination] && tarifasData.matriz[selectedDestination][selectedOrigin]) {
      return {
        precio: tarifasData.matriz[selectedDestination][selectedOrigin],
        valido: true,
        mensaje: "Tarifa válida"
      }
    }

    return { precio: 0, valido: false, mensaje: "Combinación no disponible" }
  }

  const resultado = calcularTarifa()

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Sistema de Tarifas
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tarifas por zonas vigentes desde el {tarifas.vigencia}. Pago únicamente con tarjeta SUBE.
        </p>
      </div>

      {/* Calculadora de Tarifas */}
      <Card className="mb-8 max-w-2xl mx-auto transform hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xl">Calculadora de Tarifas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zona de Origen
              </label>
              <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar origen..." />
                </SelectTrigger>
                <SelectContent>
                  {zonas.map((zona) => (
                    <SelectItem key={zona} value={zona}>
                      {zona}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zona de Destino
              </label>
              <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar destino..." />
                </SelectTrigger>
                <SelectContent>
                  {zonas.map((zona) => (
                    <SelectItem key={zona} value={zona}>
                      {zona}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {resultado && (
            <div className={`p-4 rounded-lg border ${
              resultado.valido 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold ${
                    resultado.valido ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {resultado.mensaje}
                  </h3>
                  {resultado.valido && (
                    <p className="text-2xl font-bold text-green-600">
                      ${resultado.precio.toFixed(2)}
                    </p>
                  )}
                </div>
                {resultado.valido ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla de Tarifas Completa */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tabla de Tarifas Completa</CardTitle>
          <p className="text-sm text-gray-600">
            Vigente desde el {tarifas.vigencia}
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    ORIGEN / DESTINO
                  </th>
                  {zonas.map((zona) => (
                    <th key={zona} className="border border-gray-300 p-3 text-center font-semibold text-sm">
                      {zona}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zonas.map((origen, idx_origen) => (
                  <tr key={origen} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold bg-gray-50">
                      {origen}
                    </td>
                    {zonas.map((destino, idx_destino) => {
                      if (idx_origen === idx_destino) { // Diagonal
                        return (
                          <td key={destino} className="border border-gray-300 p-3 text-center bg-gray-100">
                            <span className="text-red-500 font-bold">X</span>
                          </td>
                        )
                      }

                      if (origen === "Monte Vera") { // Last row (Monte Vera)
                        return (
                          <td key={destino} className="border border-gray-300 p-3 text-center">
                            <span className="text-gray-400">—</span>
                          </td>
                        )
                      }

                      if (idx_origen > idx_destino) { // Below diagonal
                        return (
                          <td key={destino} className="border border-gray-300 p-3 text-center">
                            <span className="text-gray-400">—</span>
                          </td>
                        )
                      }

                      // Upper triangle (idx_origen < idx_destino)
                      const precio = tarifasData.matriz[origen]?.[destino];
                      
                      return (
                        <td key={destino} className="border border-gray-300 p-3 text-center">
                          {precio ? (
                            <span className="font-semibold text-green-600">
                              ${precio.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span> // Combinations not available in upper triangle
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Información de Pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-900">
              <CreditCard className="h-5 w-5" />
              <span>Método de Pago</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold">SUBE ÚNICAMENTE</span>
              </div>
              <div className="text-sm text-green-800 space-y-1">
                <p>• Sistema Único de Boleto Electrónico</p>
                <p>• NO se acepta efectivo</p>
                <p>• NO se aceptan otras tarjetas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <DollarSign className="h-5 w-5" />
              <span>Rangos de Tarifas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tarifa mínima:</span>
                <Badge variant="outline">$1.250,00</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tarifa máxima:</span>
                <Badge variant="outline">$2.162,00</Badge>
              </div>
              <div className="text-xs text-blue-800">
                Recorrido completo Santa Fe ↔ Monte Vera
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Puntos de Carga SUBE */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Puntos de Carga SUBE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Terminal Santa Fe</h4>
              <p className="text-sm text-gray-600">
                Disponible en la terminal de ómnibus y comercios del centro
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Monte Vera</h4>
              <p className="text-sm text-gray-600">
                Comercios adheridos y puntos de carga locales
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Aplicaciones Móviles</h4>
              <p className="text-sm text-gray-600">
                Carga online a través de apps oficiales SUBE
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas y Recomendaciones */}
      <div className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Recomendación:</strong> Verificá que tu tarjeta SUBE tenga saldo suficiente antes de abordar. 
            Mínimo recomendado: $2.162,00 para recorrido completo.
          </AlertDescription>
        </Alert>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Política de tarifas:</strong> Las tarifas están reguladas por ordenanza municipal. 
            Sin descuentos estudiantiles, jubilados o discapacidad. Cada viaje se debita individualmente.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
