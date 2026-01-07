'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data for dashboard
const mockCostInsights = {
  totalRevenue: 125000.00,
  totalCosts: 68500.00,
  totalProfit: 56500.00,
  profitMargin: 45.2,
  
  productCategories: [
    { category: 'Paquetes', revenue: 45000, cost: 24000, profit: 21000, margin: 46.7, units: 30 },
    { category: 'Anillos', revenue: 52500, cost: 30000, profit: 22500, margin: 42.9, units: 15 },
    { category: 'Diplomas', revenue: 15000, cost: 6000, profit: 9000, margin: 60.0, units: 30 },
    { category: 'Fotografías', revenue: 9000, cost: 3000, profit: 6000, margin: 66.7, units: 30 },
    { category: 'Extras', revenue: 3500, cost: 5500, profit: -2000, margin: -57.1, units: 10 },
  ],

  topProducts: [
    { name: 'Anillo Oro 14K', revenue: 35000, cost: 20000, profit: 15000, margin: 42.9, units: 10 },
    { name: 'Paquete Premium', revenue: 30000, cost: 16000, profit: 14000, margin: 46.7, units: 10 },
    { name: 'Diploma Premium', revenue: 10000, cost: 4000, profit: 6000, margin: 60.0, units: 20 },
  ],

  monthlyCosts: [
    { month: 'Ene', production: 12000, materials: 8000, labor: 6000, overhead: 3000 },
    { month: 'Feb', production: 14000, materials: 9000, labor: 6500, overhead: 3000 },
    { month: 'Mar', production: 16000, materials: 11000, labor: 7000, overhead: 3500 },
    { month: 'Abr', production: 15000, materials: 10000, labor: 6800, overhead: 3200 },
  ]
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const insights = mockCostInsights

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Interno</h1>
              <p className="text-sm text-gray-600">Análisis de Costos y Rentabilidad</p>
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
        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Período de análisis</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedPeriod('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedPeriod === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Semana
              </button>
              <button 
                onClick={() => setSelectedPeriod('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedPeriod === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Mes
              </button>
              <button 
                onClick={() => setSelectedPeriod('year')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedPeriod === 'year' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Año
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Ingresos Totales</h3>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${insights.totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-green-600 mt-2">↑ 12.5% vs período anterior</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Costos Totales</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-red-600">
              ${insights.totalCosts.toLocaleString()}
            </div>
            <p className="text-sm text-red-600 mt-2">↑ 8.3% vs período anterior</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Ganancia Neta</h3>
              <span className="text-2xl">💵</span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${insights.totalProfit.toLocaleString()}
            </div>
            <p className="text-sm text-green-600 mt-2">↑ 18.7% vs período anterior</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Margen de Ganancia</h3>
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {insights.profitMargin.toFixed(1)}%
            </div>
            <p className="text-sm text-green-600 mt-2">↑ 2.1% vs período anterior</p>
          </div>
        </div>

        {/* Cost Breakdown by Category */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Análisis por Categoría de Producto</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Categoría</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Unidades</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ingresos</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Costos</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ganancia</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Margen</th>
                </tr>
              </thead>
              <tbody>
                {insights.productCategories.map((cat, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{cat.category}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{cat.units}</td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      ${cat.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      ${cat.cost.toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${cat.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${cat.profit.toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${cat.margin >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {cat.margin.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td className="py-3 px-4">TOTAL</td>
                  <td className="py-3 px-4 text-right">
                    {insights.productCategories.reduce((sum, cat) => sum + cat.units, 0)}
                  </td>
                  <td className="py-3 px-4 text-right text-green-600">
                    ${insights.totalRevenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-red-600">
                    ${insights.totalCosts.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-green-600">
                    ${insights.totalProfit.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-600">
                    {insights.profitMargin.toFixed(1)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos Más Rentables</h2>
            <div className="space-y-4">
              {insights.topProducts.map((product, idx) => (
                <div key={idx} className="border-l-4 border-green-500 pl-4 py-2 bg-gray-50 rounded-r">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <span className="text-lg font-bold text-green-600">
                      ${product.profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Ingresos:</span>
                      <div className="font-semibold">${product.revenue.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Costos:</span>
                      <div className="font-semibold text-red-600">${product.cost.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Margen:</span>
                      <div className="font-semibold text-blue-600">{product.margin.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Costs Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Desglose de Costos Mensuales</h2>
            <div className="space-y-4">
              {insights.monthlyCosts.map((month, idx) => {
                const total = month.production + month.materials + month.labor + month.overhead
                return (
                  <div key={idx} className="border-b pb-3 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-900">{month.month}</h3>
                      <span className="text-lg font-bold text-gray-900">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="text-gray-600">Producción</div>
                        <div className="font-semibold">${month.production.toLocaleString()}</div>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <div className="text-gray-600">Materiales</div>
                        <div className="font-semibold">${month.materials.toLocaleString()}</div>
                      </div>
                      <div className="bg-orange-50 p-2 rounded">
                        <div className="text-gray-600">Mano de obra</div>
                        <div className="font-semibold">${month.labor.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <div className="text-gray-600">Gastos generales</div>
                        <div className="font-semibold">${month.overhead.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Insights y Recomendaciones
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Los diplomas y fotografías tienen los mejores márgenes de ganancia (60%+)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 font-bold">⚠</span>
              <span>La categoría &quot;Extras&quot; está generando pérdidas - revisar estrategia de precios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Los anillos generan el mayor volumen de ingresos ($52,500)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">ℹ</span>
              <span>Optimizar costos de materiales podría aumentar margen en 5-8%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
