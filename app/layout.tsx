import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Empresa Monte Vera SRL - Transporte Santa Fe ⇄ Monte Vera | Horarios y GPS en Tiempo Real",
  description: "Servicio de transporte público entre Santa Fe y Monte Vera. Consulta horarios oficiales, ubicación GPS en tiempo real, 98 paradas en 6 localidades. Viajes cada 15-30 minutos, 55 minutos de recorrido.",
  keywords: [
    "transporte Monte Vera",
    "colectivo Santa Fe Monte Vera", 
    "horarios transporte público",
    "GPS tiempo real colectivos",
    "Monte Vera SRL",
    "Empresa Monte Vera SRL",
    "transporte público Santa Fe",
    "paradas Monte Vera",
    "horarios colectivos",
    "transporte Espora",
    "transporte Monte Vera",
    "transporte A. Gallardo",
    "transporte A. Mirta",
    "consulta GPS colectivos"
  ],
  authors: [{ name: "Empresa Monte Vera SRL" }],
  creator: "Empresa Monte Vera SRL",
  publisher: "Empresa Monte Vera SRL",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://monteverasrl.com.ar/", // Reemplaza con tu dominio real
    siteName: "Empresa Monte Vera SRL",
    title: "Empresa Monte Vera SRL - Transporte Santa Fe ⇄ Monte Vera",
    description: "Servicio de transporte público entre Santa Fe y Monte Vera con GPS en tiempo real, horarios oficiales y 98 paradas estratégicamente ubicadas.",
    images: [
      {
        url: "/imagenes/LogoMV.png",
        width: 1200,
        height: 630,
        alt: "Empresa Monte Vera SRL - Servicio de Transporte Público",
      },
    ],
  },
  alternates: {
    canonical: "https://monteverasrl.com.ar/", // Reemplaza con tu dominio real
  },
  category: "Transporte Público",
  classification: "Servicio de Transporte",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://monteverasrl.com.ar/'), // Reemplaza con tu dominio real
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      'facebook-domain-verification': process.env.FACEBOOK_DOMAIN_VERIFICATION || '',
    },
  },
  other: {
    'geo.region': 'AR-S',
    'geo.placename': 'Santa Fe, Argentina',
    'geo.position': '-31.6107;-60.6973',
    'ICBM': '-31.6107, -60.6973',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'theme-color': '#2E7D32',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta httpEquiv="x-ua-compatible" content="IE=edge" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="msapplication-TileColor" content="#2E7D32" />
        <meta name="theme-color" content="#2E7D32" />
        {/* JSON-LD Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TransportationCompany",
              "name": "Monte Vera SRL",
              "alternateName": "Transporte Monte Vera",
              "url": "https://monteverasrl.com.ar/", // Reemplaza con tu dominio real
              "logo": "https://monteverasrl.com.ar/logo.png", // Reemplaza con tu dominio real
              "description": "Servicio de transporte público entre Santa Fe y Monte Vera con GPS en tiempo real y horarios oficiales.",
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": -31.6107,
                  "longitude": -60.6973
                },
                "geoRadius": "30000"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Santa Fe",
                "addressRegion": "Santa Fe",
                "addressCountry": "AR"
              },
              "areaServed": [
                "Santa Fe", "Monte Vera", "Espora", "A. Gallardo", "A. Mirta", "Parada 10"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Servicios de Transporte",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Transporte Santa Fe - Monte Vera",
                      "description": "Servicio de transporte público con 49 paradas, frecuencia de 15-30 minutos y 55 minutos de recorrido."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Transporte Monte Vera - Santa Fe",
                      "description": "Servicio de transporte público con 49 paradas, frecuencia de 15-30 minutos y 55 minutos de recorrido."
                    }
                  }
                ]
              },
              "knowsAbout": ["Transporte público", "GPS tiempo real", "Horarios de colectivos"],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+54-342-412-3345",
                  "contactType": "customer service",
                  "areaServed": "AR",
                  "availableLanguage": ["es"],
                  "email": "info@monteverasrl.com.ar",
                  "hoursAvailable": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "10:00",
                    "closes": "12:00"
                  }
                }
              ],
              "sameAs": [
                "https://www.facebook.com/profile.php?id=100057168711212",
                "https://www.whatsapp.com/channel/0029Vau6xc823n3jemqpdd31"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-[3.5rem] md:pt-16`}
      >
        {children}
      </body>
    </html>
  );
}
