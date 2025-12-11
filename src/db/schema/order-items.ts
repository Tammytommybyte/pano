import { mysqlTable, int, timestamp, decimal, mysqlEnum, index } from 'drizzle-orm/mysql-core'

export const orderItems = mysqlTable('order_items', {
  id: int('id').primaryKey().autoincrement(),
  orderId: int('order_id').notNull(), // will add FK later
  productId: int('product_id').notNull(), // will add FK later
  quantity: int('quantity').notNull().default(1),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  // Removed customization JSON field - now using order_item_customizations table
  status: mysqlEnum('status', ['pending', 'in_progress', 'completed', 'quality_check_failed']).notNull().default('pending'),
  productionArea: mysqlEnum('production_area', ['rings', 'engraving', 'assembly', 'atc', 'quality_control', 'packaging']),
  assignedTo: int('assigned_to'), // user ID of production staff
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  orderIdx: index('idx_order_items_order').on(table.orderId),
  productIdx: index('idx_order_items_product').on(table.productId),
  productionIdx: index('idx_order_items_production').on(table.status, table.productionArea),
  assignedIdx: index('idx_order_items_assigned').on(table.assignedTo),
}))
