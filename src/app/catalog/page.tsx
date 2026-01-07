'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data for product catalog
const mockProducts = [
  {
    id: 1,
    productCode: 'PKG-001',
    productName: 'Paquete Básico de Graduación',
    category: 'package',
    basePrice: 1500.00,
    cost: 800.00,
    imageUrl: '/images/placeholder-package.jpg',
    description: 'Incluye: Diploma, 2 fotos 8x10, marco'
  },
  {
    id: 2,
    productCode: 'RING-001',
    productName: 'Anillo de Graduación Oro 14K',
    category: 'ring',
    basePrice: 3500.00,
    cost: 2000.00,
    imageUrl: '/images/placeholder-ring.jpg',
    description: 'Anillo personalizado con grabado incluido'
  },
  {
    id: 3,
    productCode: 'DIP-001',
    productName: 'Diploma Universitario Premium',
    category: 'diploma',
    basePrice: 500.00,
    cost: 200.00,
    imageUrl: '/images/placeholder-diploma.jpg',
    description: 'Diploma con acabado premium y tubo protector'
  },
  {
    id: 4,
    productCode: 'PHOTO-001',
    productName: 'Fotografía 8x10 Profesional',
    category: 'photo',
    basePrice: 300.00,
    cost: 100.00,
    imageUrl: '/images/placeholder-photo.jpg',
    description: 'Fotografía profesional retocada'
  },
]

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.productCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'package', label: 'Paquetes' },
    { value: 'ring', label: 'Anillos' },
    { value: 'diploma', label: 'Diplomas' },
    { value: 'photo', label: 'Fotografías' },
    { value: 'extra', label: 'Extras' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Catálogo de Productos</h1>
              <p className="text-sm text-gray-600">Gestión de imágenes y productos</p>
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
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar productos
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre o código del producto..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>Total de productos: <strong>{filteredProducts.length}</strong></span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              + Agregar Producto
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              {/* Product Image */}
              <div 
                className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 cursor-pointer"
                onClick={() => setSelectedImage(product.imageUrl)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {product.category === 'package' && '📦'}
                      {product.category === 'ring' && '💍'}
                      {product.category === 'diploma' && '📜'}
                      {product.category === 'photo' && '📸'}
                      {product.category === 'extra' && '✨'}
                    </div>
                    <span className="text-xs text-gray-500">Click para ver imagen</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-white rounded-full text-xs font-medium shadow-sm">
                    {product.productCode}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.productName}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Precio:</span>
                    <span className="font-semibold text-green-600">
                      ${product.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Costo:</span>
                    <span className="font-medium text-gray-700">
                      ${product.cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-gray-500">Margen:</span>
                    <span className="font-semibold text-blue-600">
                      {((product.basePrice - product.cost) / product.basePrice * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition">
                    Editar
                  </button>
                  <button className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition">
                    🖼️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda o categoría
            </p>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                ✕ Cerrar
              </button>
              <div className="mt-8 text-center">
                <div className="text-8xl mb-4">🖼️</div>
                <p className="text-gray-600">Vista previa de imagen</p>
                <p className="text-sm text-gray-500 mt-2">{selectedImage}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
