import { mysqlTable, varchar, int, timestamp, decimal, mysqlEnum, index } from 'drizzle-orm/mysql-core'

export const payments = mysqlTable('payments', {
  id: int('id').primaryKey().autoincrement(),
  orderId: int('order_id').notNull(), // will add FK later
  paymentMethod: mysqlEnum('payment_method', ['cash', 'transfer', 'card', 'online']).notNull(),
  paymentMode: mysqlEnum('payment_mode', ['down_payment', 'full_payment', 'balance']).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  lastDigits: varchar('last_digits', { length: 20 }),
  transactionId: varchar('transaction_id', { length: 100 }),
  paymentDate: timestamp('payment_date').notNull().defaultNow(),
  status: mysqlEnum('status', ['pending', 'confirmed', 'failed']).notNull().default('pending'),
  notes: varchar('notes', { length: 500 }),
  processedBy: int('processed_by'), // user ID
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  orderStatusIdx: index('idx_payments_order').on(table.orderId, table.status),
  dateIdx: index('idx_payments_date').on(table.paymentDate),
  methodIdx: index('idx_payments_method').on(table.paymentMethod),
}))
