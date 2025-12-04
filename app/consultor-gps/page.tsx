'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import RealTimeConsultant from '@/components/real-time-consultant'
import Footer from '@/components/footer'
import { StopSelectionProvider } from '@/contexts/stop-selection-context'

export default function ConsultorGPSPage() {
  const [activeSection, setActiveSection] = useState('consultor')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['consultor']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <StopSelectionProvider>
      <div className="min-h-screen bg-white">
        <Header activeSection={activeSection} />
        
        <main>
          {/* El consultor se muestra inmediatamente con un margen superior mínimo */}
          <section id="consultor" className="pt-2 pb-2 sm:pt-4 sm:pb-3 md:pt-6 md:pb-4 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Horarios y GPS en tiempo real
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl">
                Consultá los próximos colectivos Monte Vera con precisión GPS y horarios oficiales actualizados.
              </p>
            </div>
            <RealTimeConsultant />
          </section>
        </main>
        
        <Footer />
      </div>
    </StopSelectionProvider>
  )
}
