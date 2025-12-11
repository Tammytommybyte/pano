import { mysqlTable, varchar, int, timestamp, text, decimal, index } from 'drizzle-orm/mysql-core'

export const orderItemCustomizations = mysqlTable('order_item_customizations', {
  id: int('id').primaryKey().autoincrement(),
  orderItemId: int('order_item_id').notNull(), // will add FK later
  customizationType: varchar('customization_type', { length: 100 }).notNull(), // e.g., 'engraving', 'size', 'color', 'material'
  customizationKey: varchar('customization_key', { length: 100 }).notNull(), // e.g., 'text', 'ring_size', 'frame_color'
  customizationValue: text('customization_value').notNull(),
  additionalCost: decimal('additional_cost', { precision: 10, scale: 2 }).default('0.00'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  orderItemIdx: index('idx_order_item_customizations_item').on(table.orderItemId),
  typeIdx: index('idx_order_item_customizations_type').on(table.customizationType),
}))
