import { mysqlTable, varchar, int, timestamp, text, mysqlEnum, index } from 'drizzle-orm/mysql-core'

export const qualityChecks = mysqlTable('quality_checks', {
  id: int('id').primaryKey().autoincrement(),
  orderItemId: int('order_item_id').notNull(), // will add FK later
  productionArea: mysqlEnum('production_area', ['rings', 'engraving', 'assembly', 'atc', 'quality_control', 'packaging']).notNull(),
  checkedBy: int('checked_by').notNull(), // will add FK to users later
  status: mysqlEnum('status', ['passed', 'failed', 'needs_rework']).notNull(),
  notes: text('notes'),
  photoUrl: varchar('photo_url', { length: 500 }),
  defects: text('defects'), // JSON array of defect descriptions
  checkedAt: timestamp('checked_at').notNull().defaultNow(),
}, (table) => ({
  orderItemIdx: index('idx_quality_checks_order_item').on(table.orderItemId),
  statusIdx: index('idx_quality_checks_status').on(table.status),
  checkedByIdx: index('idx_quality_checks_checked_by').on(table.checkedBy),
}))
