import { mysqlTable, int, timestamp, text, mysqlEnum, index } from 'drizzle-orm/mysql-core'
import { users } from './users'

export const orderStatusHistory = mysqlTable('order_status_history', {
  id: int('id').primaryKey().autoincrement(),
  orderId: int('order_id').notNull(), // will add FK later when orders table is created
  previousStatus: mysqlEnum('previous_status', ['pending', 'partial', 'paid', 'overdue']),
  newStatus: mysqlEnum('new_status', ['pending', 'partial', 'paid', 'overdue']).notNull(),
  previousProductionStatus: mysqlEnum('previous_production_status', ['pending', 'in_progress', 'quality_check', 'ready', 'delivered']),
  newProductionStatus: mysqlEnum('new_production_status', ['pending', 'in_progress', 'quality_check', 'ready', 'delivered']),
  changedBy: int('changed_by').references(() => users.id),
  notes: text('notes'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
}, (table) => ({
  orderIdx: index('idx_order_status_history_order').on(table.orderId),
  timestampIdx: index('idx_order_status_history_timestamp').on(table.timestamp),
}))
