'use client'

import { SyncIndicator } from '@/components/sync-indicator'
import { OfflineBanner } from '@/components/offline-banner'
import { useOnlineStatus } from '@/hooks/use-online-status'

export default function Home() {
  const { isOnline, status } = useOnlineStatus()

  return (
    <div className="min-h-screen">
      <OfflineBanner />
      
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Sistema Eureka</h1>
          <p className="text-gray-600">Gestión de Graduaciones con Capacidades Offline-First</p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Estado del Sistema</h2>
            <SyncIndicator />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Conexión</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{isOnline ? 'En línea' : 'Sin conexión'}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Estado: {status}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Base de Datos</h3>
              <p className="text-sm">Schema completo implementado</p>
              <p className="text-xs text-gray-500 mt-1">MySQL con Drizzle ORM</p>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Offline-First</h3>
              <p className="text-sm">IndexedDB habilitado</p>
              <p className="text-xs text-gray-500 mt-1">Sincronización automática</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Características Implementadas</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Schema completo de Drizzle con todas las tablas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Relaciones e índices optimizados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Sistema de sincronización offline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Gestión de conflictos automática</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Indicadores de estado de red</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Encriptación de datos sensibles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Compresión de imágenes</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tablas de Base de Datos</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-blue-50 rounded">users</div>
              <div className="p-2 bg-blue-50 rounded">vendors</div>
              <div className="p-2 bg-blue-50 rounded">events</div>
              <div className="p-2 bg-blue-50 rounded">products</div>
              <div className="p-2 bg-blue-50 rounded">orders</div>
              <div className="p-2 bg-blue-50 rounded">order_items</div>
              <div className="p-2 bg-blue-50 rounded">customers</div>
              <div className="p-2 bg-blue-50 rounded">payments</div>
              <div className="p-2 bg-blue-50 rounded">inventory</div>
              <div className="p-2 bg-blue-50 rounded">commissions</div>
              <div className="p-2 bg-blue-50 rounded">quality_checks</div>
              <div className="p-2 bg-blue-50 rounded">deliveries</div>
              <div className="p-2 bg-blue-50 rounded">documents</div>
              <div className="p-2 bg-blue-50 rounded">audit_log</div>
              <div className="p-2 bg-blue-50 rounded">notifications</div>
              <div className="p-2 bg-blue-50 rounded">price_lists</div>
              <div className="p-2 bg-green-50 rounded font-semibold">+8 más</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">📚 Próximos Pasos</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Configurar la base de datos MySQL</li>
            <li>• Ejecutar migraciones: <code className="bg-blue-100 px-1 rounded">npm run db:generate && npm run db:migrate</code></li>
            <li>• Poblar datos iniciales: <code className="bg-blue-100 px-1 rounded">npm run db:seed</code></li>
            <li>• Implementar tRPC para las APIs</li>
            <li>• Desarrollar los módulos de vendedores, producción y entrega</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
