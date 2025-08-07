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
  setSelectedStop: (stop: StopData | null) => void
}

const StopSelectionContext = createContext<StopSelectionContextType | undefined>(undefined)

export function StopSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedStop, setSelectedStop] = useState<StopData | null>(null)

  return (
    <StopSelectionContext.Provider value={{ selectedStop, setSelectedStop }}>
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