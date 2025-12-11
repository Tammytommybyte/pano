import { mysqlTable, int, timestamp, mysqlEnum, text, decimal, index } from 'drizzle-orm/mysql-core'
import { users } from './users'

export const stockMovements = mysqlTable('stock_movements', {
  id: int('id').primaryKey().autoincrement(),
  productId: int('product_id').notNull(), // will add FK later
  inventoryId: int('inventory_id'), // optional FK to inventory table
  movementType: mysqlEnum('movement_type', ['purchase', 'sale', 'production', 'adjustment', 'return', 'transfer', 'waste']).notNull(),
  quantity: int('quantity').notNull(),
  quantityBefore: int('quantity_before').notNull(),
  quantityAfter: int('quantity_after').notNull(),
  unitCost: decimal('unit_cost', { precision: 10, scale: 2 }),
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }),
  referenceTable: mysqlEnum('reference_table', ['orders', 'inventory', 'production', 'manual']),
  referenceId: int('reference_id'),
  notes: text('notes'),
  performedBy: int('performed_by').references(() => users.id),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
}, (table) => ({
  productIdx: index('idx_stock_movements_product').on(table.productId),
  typeIdx: index('idx_stock_movements_type').on(table.movementType),
  timestampIdx: index('idx_stock_movements_timestamp').on(table.timestamp),
  referenceIdx: index('idx_stock_movements_reference').on(table.referenceTable, table.referenceId),
}))
