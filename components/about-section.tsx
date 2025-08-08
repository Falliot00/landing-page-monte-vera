import { useState, useEffect, useRef } from 'react'
import { Users, Award, MapPin, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

// Hook personalizado para animación de números
const useCountUp = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!shouldStart) return
    
    let startTime: number
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, shouldStart])
  
  return count
}

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      number: 50,
      suffix: "+",
      label: "Años de experiencia"
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      number: 98,
      suffix: "",
      label: "Paradas de servicio"
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      number: 72,
      suffix: "",
      label: "Servicios diarios"
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      number: 100,
      suffix: "%",
      label: "Compromiso con la calidad"
    }
  ]

  // Intersection Observer para detectar cuando la sección es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Sobre Empresa Monte Vera SRL
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Más de cinco décadas conectando comunidades con un servicio de transporte confiable y moderno
        </p>
      </div>

      <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => {
          const count = useCountUp(stat.number, 2000 + index * 200, isVisible)
          
          return (
            <Card 
              key={index} 
              className="text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-4 group transition-transform duration-300 transform hover:scale-110">
                  <div className="p-3 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {count}{stat.suffix}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Contenido principal de la sección "Sobre Monte Vera" */}
      <div className="space-y-12"> {/* Contenedor para apilar verticalmente */}
        {/* Sección de Nuestra Historia (Texto) */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Nuestra Historia
          </h3>
          <div className="space-y-4 text-gray-600">
            <p>
              Monte Vera nació con la misión de conectar las comunidades de Santa Fe y Monte Vera, 
              brindando un servicio de transporte público confiable, seguro y accesible para todos.
            </p>
            <p>
              Durante más de 25 años, hemos sido testigos del crecimiento de estas localidades, 
              adaptando nuestro servicio a las necesidades cambiantes de nuestros pasajeros y 
              incorporando tecnología moderna para mejorar la experiencia de viaje.
            </p>
            <p>
              Hoy operamos con una flota moderna que recorre 98 paradas estratégicamente ubicadas, 
              conectando 6 localidades en un recorrido de 55 minutos que facilita el acceso al 
              trabajo, educación y servicios esenciales.
            </p>
          </div>
        </div>

        {/* Sección de Tarjetas (Misión, Valores, Cobertura) - Ahora en horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-green-900 mb-3">
                Nuestra Misión
              </h4>
              <p className="text-green-800">
                Proporcionar un servicio de transporte público eficiente, seguro y accesible 
                que conecte las comunidades de Santa Fe y Monte Vera, contribuyendo al 
                desarrollo social y económico de la región.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">
                Nuestros Valores
              </h4>
              <ul className="text-blue-800 space-y-2">
                <li>• <strong>Puntualidad:</strong> Respetamos los horarios establecidos</li>
                <li>• <strong>Seguridad:</strong> Priorizamos el bienestar de nuestros pasajeros</li>
                <li>• <strong>Calidad:</strong> Mantenemos altos estándares en nuestro servicio</li>
                <li>• <strong>Compromiso:</strong> Con la comunidad y el medio ambiente</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-purple-900 mb-3">
                Nuestra Visión
              </h4>
              <p className="text-purple-800 leading-relaxed">
                Ser líderes en el sector de transporte interurbano y servicios a demanda, 
                reconocidos por nuestra excelencia operativa y nuestro compromiso con la sociedad.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
