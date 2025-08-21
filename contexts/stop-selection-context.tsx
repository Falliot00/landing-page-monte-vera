'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface StopData {
  id: string
  nombre: string
  coordenadas: { lat: number; lng: number }
  tiempoDesdeInicio: string
  localidad: string
  referencias?: string[]
}

interface StopSelectionContextType {
  selectedStop: StopData | null
  selectedRoute: 'santafe_montevera' | 'montevera_santafe'
  setSelectedStop: (stop: StopData | null) => void
  setSelectedRoute: (route: 'santafe_montevera' | 'montevera_santafe') => void
}

const StopSelectionContext = createContext<StopSelectionContextType | undefined>(undefined)

export function StopSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedStop, setSelectedStop] = useState<StopData | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<'santafe_montevera' | 'montevera_santafe'>('santafe_montevera')

  return (
    <StopSelectionContext.Provider value={{ 
      selectedStop, 
      setSelectedStop, 
      selectedRoute, 
      setSelectedRoute 
    }}>
      {children}
    </StopSelectionContext.Provider>
  )
}

export function useStopSelection() {
  const context = useContext(StopSelectionContext)
  if (context === undefined) {
    throw new Error('useStopSelection must be used within a StopSelectionProvider')
  }
  return context
}