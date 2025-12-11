import { mysqlTable, varchar, int, timestamp, text, mysqlEnum, index } from 'drizzle-orm/mysql-core'
import { users } from './users'

export const auditLog = mysqlTable('audit_log', {
  id: int('id').primaryKey().autoincrement(),
  tableName: varchar('table_name', { length: 100 }).notNull(),
  recordId: int('record_id').notNull(),
  action: mysqlEnum('action', ['create', 'update', 'delete', 'status_change']).notNull(),
  userId: int('user_id').references(() => users.id),
  oldValues: text('old_values'), // JSON
  newValues: text('new_values'), // JSON
  changedFields: text('changed_fields'), // JSON array of field names
  ipAddress: varchar('ip_address', { length: 45 }), // IPv6 compatible
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
}, (table) => ({
  tableRecordIdx: index('idx_audit_log_table_record').on(table.tableName, table.recordId),
  userIdx: index('idx_audit_log_user').on(table.userId),
  timestampIdx: index('idx_audit_log_timestamp').on(table.timestamp),
}))
