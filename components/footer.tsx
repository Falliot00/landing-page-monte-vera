import { MapPin, Phone, Mail, Clock, Facebook, MessageCircleMore } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/imagenes/LogoBlancoMV.png"
                alt="Monte Vera Logo"
                width={240}
                height={80}
                className="h-10 w-auto"
                quality={100}
                priority
              />
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Más de 50 años conectando Santa Fe y Monte Vera con un servicio de transporte 
              público confiable, moderno y accesible para toda la comunidad.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100057168711212"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.whatsapp.com/channel/0029Vau6xc823n3jemqpdd31"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <MessageCircleMore className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/.#inicio" className="text-gray-300 hover:text-green-400 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/consultor-gps" className="text-gray-300 hover:text-green-400 transition-colors">
                  Horarios en tiempo real
                </a>
              </li>
              <li>
                <a href="/.#horarios" className="text-gray-300 hover:text-green-400 transition-colors">
                  Horarios
                </a>
              </li>
              <li>
                <a href="/.#tarifas" className="text-gray-300 hover:text-green-400 transition-colors">
                  Tarifas
                </a>
              </li>
              <li>
                <a href="/.#paradas" className="text-gray-300 hover:text-green-400 transition-colors">
                  Paradas
                </a>
              </li>
              <li>
                <a href="/.#contacto" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Información de Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Belgrano 2705, Santa Fe, Argentina
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">0342 412-3345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@monteverasrl.com.ar</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Lun-Vie: 10:00-12:00<br />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información Legal */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} Empresa Monte Vera SRL. Todos los derechos reservados.
            </div>
            {/*<div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-green-400 transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                Accesibilidad
              </a>
            </div>*/}
          </div>
          
          {/*<div className="mt-4 text-xs text-gray-500 text-center">
            <p>
              Servicio de transporte público regulado por la Municipalidad de Santa Fe. 
              Tarifas vigentes desde el 17/01/2025. Pago únicamente con tarjeta SUBE.
            </p>
          </div>*/}
        </div>
      </div>
    </footer>
  )
}
