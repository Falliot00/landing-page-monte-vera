import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

/**
 * Hook para habilitar el desplazamiento del mapa solo con dos dedos en dispositivos táctiles
 * En PC permite el movimiento normal con mouse
 * Permite el scroll normal de la página con un solo dedo en móviles
 */
export function UseTwoFingerMap() {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    // Detectar si el dispositivo tiene capacidad táctil
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // Si no es dispositivo táctil (PC con mouse), permitir dragging normal
    if (!isTouchDevice) {
      if (map.dragging) {
        map.dragging.enable()
      }
      return // No aplicar lógica de dos dedos
    }

    let touchCount = 0

    // Desactivar dragging por defecto solo en dispositivos táctiles
    if (map.dragging) {
      map.dragging.disable()
    }

    // Listener para touchdown
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      
      // Verificar si el toque es sobre el mapa
      if (!target.closest('.leaflet-container')) return

      touchCount = e.touches.length

      // Si hay 2 o más dedos, habilitar dragging
      if (touchCount >= 2) {
        if (map.dragging) {
          map.dragging.enable()
        }
      }
    }

    // Listener para touchmove
    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      
      // Verificar si el toque es sobre el mapa
      if (!target.closest('.leaflet-container')) return

      touchCount = e.touches.length

      // Ajustar dragging basado en número de dedos
      if (touchCount >= 2) {
        if (map.dragging && !map.dragging.enabled()) {
          map.dragging.enable()
        }
        // Prevenir scroll de la página cuando hay 2 dedos
        e.preventDefault()
      } else {
        if (map.dragging && map.dragging.enabled()) {
          map.dragging.disable()
        }
      }
    }

    // Listener para touchend
    const handleTouchEnd = (e: TouchEvent) => {
      touchCount = e.touches.length

      // Si quedan menos de 2 dedos, deshabilitar dragging
      if (touchCount < 2) {
        if (map.dragging && map.dragging.enabled()) {
          map.dragging.disable()
        }
      }
    }

    // Agregar listeners
    const mapElement = map.getContainer()
    if (mapElement) {
      mapElement.addEventListener('touchstart', handleTouchStart, false)
      mapElement.addEventListener('touchmove', handleTouchMove, false)
      mapElement.addEventListener('touchend', handleTouchEnd, false)
    }

    // Cleanup
    return () => {
      if (mapElement) {
        mapElement.removeEventListener('touchstart', handleTouchStart)
        mapElement.removeEventListener('touchmove', handleTouchMove)
        mapElement.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [map])
}
