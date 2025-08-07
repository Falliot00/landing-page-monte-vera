import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consultor GPS - Horarios en Tiempo Real | Monte Vera',
  description: 'Consulta los horarios de colectivos Monte Vera en tiempo real usando datos GPS precisos. Encuentra cuándo llegará tu próximo colectivo.',
  keywords: 'consultor GPS, horarios tiempo real, colectivos Monte Vera, transporte público, GPS tracking',
  openGraph: {
    title: 'Consultor GPS - Horarios en Tiempo Real | Monte Vera',
    description: 'Consulta horarios de colectivos en tiempo real con precisión GPS',
    type: 'website',
  },
}

export default function ConsultorGPSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}