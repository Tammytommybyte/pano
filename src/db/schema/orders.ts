import { mysqlTable, varchar, int, timestamp, decimal, mysqlEnum, text, date, boolean, index } from 'drizzle-orm/mysql-core'

export const orders = mysqlTable('orders', {
  id: int('id').primaryKey().autoincrement(),
  orderCode: varchar('order_code', { length: 50 }).notNull().unique(),
  eventId: int('event_id').notNull(), // will add FK later
  vendorId: int('vendor_id').notNull(), // will add FK later
  customerId: int('customer_id').notNull(), // will add FK later
  orderDate: timestamp('order_date').notNull().defaultNow(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  downPayment: decimal('down_payment', { precision: 10, scale: 2 }).default('0.00'),
  balance: decimal('balance', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: mysqlEnum('payment_status', ['pending', 'partial', 'paid', 'overdue']).notNull().default('pending'),
  productionStatus: mysqlEnum('production_status', ['pending', 'in_progress', 'quality_check', 'ready', 'delivered']).notNull().default('pending'),
  dueDate: date('due_date'),
  deliveryDate: date('delivery_date'),
  notes: text('notes'),
  // New offline sync fields
  isOfflineCreated: boolean('is_offline_created').default(false),
  offlineCreatedAt: timestamp('offline_created_at'),
  syncedAt: timestamp('synced_at'),
  syncStatus: mysqlEnum('sync_status', ['synced', 'pending', 'conflict']).default('synced'),
  lastModifiedOffline: timestamp('last_modified_offline'),
  deviceId: varchar('device_id', { length: 100 }),
  version: int('version').default(1), // for conflict resolution
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  eventVendorIdx: index('idx_orders_event_vendor').on(table.eventId, table.vendorId),
  paymentStatusIdx: index('idx_orders_payment_status').on(table.paymentStatus),
  productionStatusIdx: index('idx_orders_production_status').on(table.productionStatus),
  customerIdx: index('idx_orders_customer').on(table.customerId),
  syncStatusIdx: index('idx_orders_sync_status').on(table.syncStatus),
}))
