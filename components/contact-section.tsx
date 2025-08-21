'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al enviar el mensaje')
      }

      setShowSuccess(true)
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      })
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      console.error('Error al enviar el mensaje:', error)
      setError(error instanceof Error ? error.message : 'Error al enviar el mensaje')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Teléfono",
      content: "0342 412-3345",
      description: "Lunes a Viernes 8:00 - 16:00"
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      content: "info@monteverasrl.com.ar",
      description: "Respuesta en 24 horas"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Oficinas",
      content: "Belgrano 2705, Santa Fe, Argentina",
      description: "Esquina Belgrano y Eva Perón"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Atención al Cliente",
      content: "Lunes a Viernes",
      description: "10:00 - 12:00 hs"
    }
  ]

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Contáctanos
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos a la brevedad.
        </p>
      </div>

      {/* Título "Información de Contacto" movido fuera de la cuadrícula */}
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Información de Contacto
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Columna Izquierda: Tarjetas de Información de Contacto, Redes Sociales y Horarios */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactInfo.map((info, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h4>
                      <p className="font-medium text-gray-700 mb-1">
                        {info.content}
                      </p>
                      <p className="text-sm text-gray-500">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Redes Sociales */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-900">
                <MessageCircle className="h-5 w-5" />
                <span>Síguenos en Redes Sociales</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/profile.php?id=100057168711212" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Facebook
                  </Button>
                </a>
                <a 
                  href="https://www.whatsapp.com/channel/0029Vau6xc823n3jemqpdd31" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    WhatsApp
                  </Button>
                </a>
              </div>
              <p className="text-sm text-green-800 mt-3">
                Mantente informado sobre horarios, novedades y actualizaciones del servicio.
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Columna Derecha: Formulario de Contacto */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Envíanos tu Consulta</CardTitle>
            </CardHeader>
            <CardContent>
              {showSuccess && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <Send className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ¡Mensaje enviado correctamente! Te responderemos dentro de las próximas 24 horas.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="mb-6 bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <Input
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <Input
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="Tu número de teléfono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto *
                  </label>
                  <Input
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleInputChange}
                    required
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <Textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Describe tu consulta o sugerencia..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Enviando mensaje...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  * Campos obligatorios. Respetamos tu privacidad y no compartimos tu información.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
