import { mysqlTable, varchar, int, timestamp, text, mysqlEnum, index } from 'drizzle-orm/mysql-core'

export const notifications = mysqlTable('notifications', {
  id: int('id').primaryKey().autoincrement(),
  recipientId: int('recipient_id').notNull(), // can be user or customer
  recipientType: mysqlEnum('recipient_type', ['user', 'customer']).notNull(),
  type: mysqlEnum('type', ['email', 'whatsapp', 'sms', 'in_app']).notNull(),
  subject: varchar('subject', { length: 255 }),
  content: text('content').notNull(),
  relatedOrderId: int('related_order_id'), // will add FK later
  relatedTable: varchar('related_table', { length: 100 }),
  relatedId: int('related_id'),
  status: mysqlEnum('status', ['pending', 'sent', 'failed', 'read']).notNull().default('pending'),
  failureReason: text('failure_reason'),
  sentAt: timestamp('sent_at'),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  recipientIdx: index('idx_notifications_recipient').on(table.recipientId, table.recipientType),
  statusIdx: index('idx_notifications_status').on(table.status),
  typeIdx: index('idx_notifications_type').on(table.type),
  orderIdx: index('idx_notifications_order').on(table.relatedOrderId),
}))
