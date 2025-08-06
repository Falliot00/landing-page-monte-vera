'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import RealTimeConsultant from '@/components/real-time-consultant'
import AboutSection from '@/components/about-section'
import SchedulesSection from '@/components/schedules-section'
import FaresSection from '@/components/fares-section'
import StopsSection from '@/components/stops-section'
import ContactSection from '@/components/contact-section'
import Footer from '@/components/footer'

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('inicio')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'consultor', 'nosotros', 'horarios', 'tarifas', 'paradas', 'contacto']
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
    <div className="min-h-screen bg-white">
      <Header activeSection={activeSection} />
      
      <main>
        <section id="inicio">
          <HeroSection />
        </section>
        
        <section id="consultor" className="py-16 bg-gray-50">
          <RealTimeConsultant />
        </section>
        
        <section id="nosotros" className="py-16">
          <AboutSection />
        </section>
        
        <section id="horarios" className="py-16 bg-gray-50">
          <SchedulesSection />
        </section>
        
        <section id="tarifas" className="py-16">
          <FaresSection />
        </section>
        
        <section id="paradas" className="py-16 bg-gray-50">
          <StopsSection />
        </section>
        
        <section id="contacto" className="py-16">
          <ContactSection />
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
