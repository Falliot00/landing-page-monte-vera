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
            <RealTimeConsultant />
          </section>
        </main>
        
        <Footer />
      </div>
    </StopSelectionProvider>
  )
}
