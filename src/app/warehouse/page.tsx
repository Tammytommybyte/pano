'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data for warehouse orders
const mockWarehouseOrders = [
  {
    id: 1,
    orderCode: 'WH-2025-001',
    productName: 'Anillos Oro 14K',
    productCode: 'RING-001',
    quantityRequested: 25,
    quantityAvailable: 15,
    quantityInProduction: 10,
    status: 'partial',
    requestedBy: 'Juan Pérez',
    requestDate: '2025-01-05',
    requiredDate: '2025-01-15',
    area: 'rings',
    priority: 'high'
  },
  {
    id: 2,
    orderCode: 'WH-2025-002',
    productName: 'Diplomas Premium',
    productCode: 'DIP-001',
    quantityRequested: 50,
    quantityAvailable: 60,
    quantityInProduction: 0,
    status: 'ready',
    requestedBy: 'María González',
    requestDate: '2025-01-04',
    requiredDate: '2025-01-12',
    area: 'engraving',
    priority: 'medium'
  },
  {
    id: 3,
    orderCode: 'WH-2025-003',
    productName: 'Marcos para Fotos',
    productCode: 'FRAME-001',
    quantityRequested: 100,
    quantityAvailable: 30,
    quantityInProduction: 70,
    status: 'in_production',
    requestedBy: 'Carlos Ramírez',
    requestDate: '2025-01-06',
    requiredDate: '2025-01-20',
    area: 'assembly',
    priority: 'low'
  },
  {
    id: 4,
    orderCode: 'WH-2025-004',
    productName: 'Paquetes Básicos',
    productCode: 'PKG-001',
    quantityRequested: 40,
    quantityAvailable: 5,
    quantityInProduction: 0,
    status: 'pending',
    requestedBy: 'Ana Torres',
    requestDate: '2025-01-07',
    requiredDate: '2025-01-10',
    area: 'assembly',
    priority: 'high'
  },
]

const mockStockMovements = [
  { id: 1, date: '2025-01-07 10:30', product: 'Anillos Oro 14K', movement: 'entrada', quantity: 10, from: 'Producción', to: 'Almacén Principal' },
  { id: 2, date: '2025-01-07 09:15', product: 'Diplomas Premium', movement: 'salida', quantity: 20, from: 'Almacén Principal', to: 'Área de Ensamblado' },
  { id: 3, date: '2025-01-06 16:45', product: 'Marcos para Fotos', movement: 'entrada', quantity: 50, from: 'Proveedor Externo', to: 'Almacén Principal' },
  { id: 4, date: '2025-01-06 14:20', product: 'Paquetes Básicos', movement: 'salida', quantity: 15, from: 'Almacén Principal', to: 'Cliente (Entrega)' },
]

export default function WarehousePage() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [showMovements, setShowMovements] = useState(false)

  const filteredOrders = mockWarehouseOrders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || order.priority === selectedPriority
    return matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ready: { label: 'Listo', color: 'bg-green-100 text-green-800' },
      partial: { label: 'Parcial', color: 'bg-yellow-100 text-yellow-800' },
      in_production: { label: 'En Producción', color: 'bg-blue-100 text-blue-800' },
      pending: { label: 'Pendiente', color: 'bg-red-100 text-red-800' },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { label: 'Alta', color: 'bg-red-500 text-white' },
      medium: { label: 'Media', color: 'bg-yellow-500 text-white' },
      low: { label: 'Baja', color: 'bg-gray-500 text-white' },
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig]
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${config.color}`}>{config.label}</span>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Órdenes de Almacén</h1>
              <p className="text-sm text-gray-600">Gestión de inventario y movimientos</p>
            </div>
            <Link 
              href="/"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Órdenes Totales</p>
                <p className="text-2xl font-bold text-gray-900">{mockWarehouseOrders.length}</p>
              </div>
              <span className="text-3xl">📦</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Listas</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockWarehouseOrders.filter(o => o.status === 'ready').length}
                </p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockWarehouseOrders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alta Prioridad</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mockWarehouseOrders.filter(o => o.priority === 'high').length}
                </p>
              </div>
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="ready">Listos</option>
                  <option value="partial">Parciales</option>
                  <option value="in_production">En Producción</option>
                  <option value="pending">Pendientes</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad
                </label>
                <select
                  id="priority"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowMovements(!showMovements)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                {showMovements ? '📋 Ver Órdenes' : '📊 Ver Movimientos'}
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition">
                + Nueva Orden
              </button>
            </div>
          </div>
        </div>

        {!showMovements ? (
          /* Orders Table */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Código</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Producto</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Cantidad</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Disponible</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">En Producción</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Prioridad</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha Requerida</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{order.orderCode}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{order.productName}</div>
                        <div className="text-xs text-gray-500">{order.productCode}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold">{order.quantityRequested}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={order.quantityAvailable >= order.quantityRequested ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {order.quantityAvailable}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-blue-600">{order.quantityInProduction}</td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4 text-center">{getPriorityBadge(order.priority)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.requiredDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 justify-center">
                          <button className="px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-xs">
                            Ver
                          </button>
                          <button className="px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 text-xs">
                            Procesar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Stock Movements */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Movimientos de Inventario Recientes</h2>
            </div>
            <div className="divide-y">
              {mockStockMovements.map((movement) => (
                <div key={movement.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          movement.movement === 'entrada' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {movement.movement === 'entrada' ? '↓ Entrada' : '↑ Salida'}
                        </span>
                        <span className="font-semibold text-gray-900">{movement.product}</span>
                        <span className="text-gray-500">•</span>
                        <span className="font-bold text-blue-600">{movement.quantity} unidades</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{movement.from}</span>
                        <span>→</span>
                        <span className="font-medium">{movement.to}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {movement.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alert Section */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Alertas de Inventario
          </h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Paquetes Básicos (PKG-001): Stock bajo - Solo 5 unidades disponibles</li>
            <li>• Anillos Oro 14K (RING-001): Orden parcial - Requiere 25, solo hay 15 disponibles</li>
            <li>• Se recomienda iniciar producción de Paquetes Básicos para cumplir con la fecha del 10/01</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
