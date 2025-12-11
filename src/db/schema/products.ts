import { mysqlTable, varchar, int, timestamp, decimal, mysqlEnum, boolean, text, index } from 'drizzle-orm/mysql-core'

export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  productCode: varchar('product_code', { length: 50 }).notNull().unique(),
  barcode: varchar('barcode', { length: 100 }).unique(),
  qrCode: varchar('qr_code', { length: 500 }),
  productName: varchar('product_name', { length: 255 }).notNull(),
  category: mysqlEnum('category', ['package', 'diploma', 'photo', 'ring', 'extra']).notNull(),
  description: text('description'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  margin: decimal('margin', { precision: 5, scale: 2 }),
  productionTime: int('production_time'), // in days
  productionArea: mysqlEnum('production_area', ['rings', 'engraving', 'assembly', 'atc', 'quality_control', 'packaging']),
  // Removed stockLevel - moved to inventory table
  reorderPoint: int('reorder_point').default(10),
  // New fields
  sku: varchar('sku', { length: 100 }),
  weight: decimal('weight', { precision: 8, scale: 2 }), // in grams
  dimensions: varchar('dimensions', { length: 100 }), // e.g., "10x10x5 cm"
  imageUrl: varchar('image_url', { length: 500 }),
  isCustomizable: boolean('is_customizable').default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  categoryIdx: index('idx_products_category').on(table.category),
  activeIdx: index('idx_products_active').on(table.isActive),
  areaIdx: index('idx_products_area').on(table.productionArea),
}))
