import { mysqlTable, varchar, int, timestamp, decimal, mysqlEnum, index } from 'drizzle-orm/mysql-core'

export const commissions = mysqlTable('commissions', {
  id: int('id').primaryKey().autoincrement(),
  vendorId: int('vendor_id').notNull(), // will add FK later
  orderId: int('order_id').notNull(), // will add FK later
  saleAmount: decimal('sale_amount', { precision: 10, scale: 2 }).notNull(),
  commissionPercentage: decimal('commission_percentage', { precision: 5, scale: 2 }).notNull(),
  commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }).notNull(),
  period: varchar('period', { length: 20 }), // e.g., "2025-11"
  status: mysqlEnum('status', ['pending', 'calculated', 'paid']).notNull().default('pending'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  vendorIdx: index('idx_commissions_vendor').on(table.vendorId),
  orderIdx: index('idx_commissions_order').on(table.orderId),
  statusIdx: index('idx_commissions_status').on(table.status),
  periodIdx: index('idx_commissions_period').on(table.period),
}))
