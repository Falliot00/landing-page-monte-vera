import { configuracion, paradas } from './data'

// Lista de feriados nacionales (formato YYYY-MM-DD)
const FERIADOS: string[] = [
  '2025-01-01', // Año Nuevo
  '2025-02-24', // Carnaval
  '2025-02-25', // Carnaval
  '2025-03-24', // Día de la Memoria
  '2025-04-02', // Día del Veterano y de los Caídos en la Guerra de Malvinas
  '2025-04-18', // Viernes Santo
  '2025-05-01', // Día del Trabajador
  '2025-05-25', // Revolución de Mayo
  '2025-06-20', // Paso a la Inmortalidad del Gral. Belgrano
  '2025-07-09', // Día de la Independencia
  '2025-08-17', // Paso a la Inmortalidad del Gral. San Martín
  '2025-10-12', // Día del Respeto a la Diversidad Cultural
  '2025-11-20', // Día de la Soberanía Nacional
  '2025-12-08', // Inmaculada Concepción
  '2025-12-25'  // Navidad
]

export interface BusArrivalResult {
  nextBusArrival: Date
  minutesToArrival: number
  currentTime: Date
  departureTime: string
  busId: string
  status: 'upcoming' | 'approaching' | 'no_service'
  followingBus?: {
    arrivalTime: Date
    minutesToArrival: number
    departureTime: string
  }
}

export interface BusTimingRequest {
  routeId: keyof typeof configuracion.rutas
  stopId: string
}

export class BusTimingService {
  /**
   * Calculates the next bus arrival time at a specific stop
   */
  static calculateBusArrival({ routeId, stopId }: BusTimingRequest): BusArrivalResult {
    const currentTime = new Date()
    const currentDayType = this.getCurrentDayType()
    
    // Get the schedule for today
    const todaySchedule = configuracion.horariosOficiales[routeId][currentDayType]
    
    // Find the stop information
    const stopInfo = this.findStopInfo(routeId, stopId)
    if (!stopInfo) {
      throw new Error(`Stop ${stopId} not found in route ${routeId}`)
    }

    // Get buses that haven't arrived at this stop yet (includes buses en route)
    const relevantBuses = this.getBusesForStop(todaySchedule.horarios, stopInfo.tiempoDesdeInicio, currentTime)
    
    if (relevantBuses.length === 0) {
      return {
        nextBusArrival: new Date(),
        minutesToArrival: 0,
        currentTime,
        departureTime: '',
        busId: '',
        status: 'no_service'
      }
    }

    // The first bus is the next one to arrive at this stop
    const nextBus = relevantBuses[0]
    const minutesToArrival = Math.round((nextBus.arrivalTime.getTime() - currentTime.getTime()) / (1000 * 60))

    const result: BusArrivalResult = {
      nextBusArrival: nextBus.arrivalTime,
      minutesToArrival: Math.max(0, minutesToArrival),
      currentTime,
      departureTime: nextBus.departureString,
      busId: this.generateBusId(routeId, nextBus.departureString),
      status: minutesToArrival <= 5 ? 'approaching' : 'upcoming',
      followingBus: relevantBuses.length > 1 ? {
        arrivalTime: relevantBuses[1].arrivalTime,
        minutesToArrival: Math.round((relevantBuses[1].arrivalTime.getTime() - currentTime.getTime()) / (1000 * 60)),
        departureTime: relevantBuses[1].departureString
      } : undefined
    }

    return result
  }

  /**
   * Determines the current day type for schedule lookup
   */
  static getCurrentDayType(): 'laborables' | 'sabados' | 'domingos' {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday
    const todayISO = today.toISOString().split('T')[0]

    // Los feriados se tratan con horario de domingo
    if (FERIADOS.includes(todayISO)) return 'domingos'
    if (dayOfWeek === 0) return 'domingos' // Domingo
    if (dayOfWeek === 6) return 'sabados' // Sábado
    return 'laborables' // Lunes a viernes
  }

  /**
   * Finds stop information in the route data
   */
  private static findStopInfo(routeId: keyof typeof configuracion.rutas, stopId: string) {
    const routeStops = paradas[routeId]
    return routeStops.find(stop => stop.id === stopId)
  }

  /**
   * Gets buses that haven't arrived at the specified stop yet (includes buses en route)
   */
  private static getBusesForStop(scheduleHorarios: string[], tiempoDesdeInicio: string, currentTime: Date) {
    return scheduleHorarios
      .map(timeString => {
        const [hour, minute] = timeString.split(':').map(Number)
        const departure = new Date(currentTime)
        departure.setHours(hour, minute, 0, 0)
        
        const arrivalTime = this.calculateStopArrivalTime(departure, tiempoDesdeInicio)
        
        return {
          departure,
          departureString: timeString,
          arrivalTime,
          totalMinutes: hour * 60 + minute
        }
      })
      // Filter buses that haven't arrived at this stop yet
      .filter(bus => bus.arrivalTime.getTime() > currentTime.getTime())
      // Sort by arrival time at this stop
      .sort((a, b) => a.arrivalTime.getTime() - b.arrivalTime.getTime())
  }

  /**
   * Calculates when a bus will arrive at a specific stop
   */
  private static calculateStopArrivalTime(departureTime: Date, tiempoDesdeInicio: string): Date {
    const [hours, minutes, seconds] = tiempoDesdeInicio.split(':').map(Number)
    const offsetMilliseconds = (hours * 60 * 60 + minutes * 60 + seconds) * 1000
    
    return new Date(departureTime.getTime() + offsetMilliseconds)
  }


  /**
   * Generates a unique bus ID based on route and departure time
   */
  private static generateBusId(routeId: keyof typeof configuracion.rutas, departureTime: string): string {
    const routeCode = configuracion.rutas[routeId].id
    const timeCode = departureTime.replace(':', '')
    return `${routeCode}${timeCode}`
  }

  /**
   * Formats time difference in a human-readable way
   */
  static formatTimeDifference(minutes: number): string {
    if (minutes <= 0) return 'Ya llegó'
    if (minutes === 1) return '1 minuto'
    if (minutes < 60) return `${minutes} minutos`
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours === 1 && remainingMinutes === 0) return '1 hora'
    if (hours === 1) return `1 hora ${remainingMinutes} minutos`
    if (remainingMinutes === 0) return `${hours} horas`
    return `${hours} horas ${remainingMinutes} minutos`
  }

  /**
   * Gets the status color based on arrival time
   */
  static getStatusColor(minutesToArrival: number): string {
    if (minutesToArrival <= 0) return 'text-red-600'
    if (minutesToArrival <= 5) return 'text-green-600'
    if (minutesToArrival <= 15) return 'text-yellow-600'
    return 'text-gray-600'
  }

  /**
   * Gets a user-friendly status message
   */
  static getStatusMessage(status: BusArrivalResult['status'], minutesToArrival: number): string {
    switch (status) {
      case 'approaching':
        return 'Próximo a llegar'
      case 'upcoming':
        return minutesToArrival <= 15 ? 'Viene en camino' : 'Programado'
      case 'no_service':
        return 'No hay más servicios hoy'
      default:
        return 'Calculando...'
    }
  }
}