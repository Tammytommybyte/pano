import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eureka - Sistema de Graduación',
  description: 'Sistema integrado para gestión de graduaciones',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
