import { mysqlTable, varchar, int, timestamp, decimal, mysqlEnum, boolean, text, date, index } from 'drizzle-orm/mysql-core'
import { users } from './users'

export const events = mysqlTable('events', {
  id: int('id').primaryKey().autoincrement(),
  eventCode: varchar('event_code', { length: 50 }).notNull().unique(),
  eventName: varchar('event_name', { length: 255 }).notNull(),
  university: varchar('university', { length: 255 }).notNull(),
  campus: varchar('campus', { length: 255 }),
  eventDate: date('event_date').notNull(),
  priceListId: int('price_list_id'), // will add FK later
  vendorId: int('vendor_id'), // will add FK later
  status: mysqlEnum('status', ['active', 'completed', 'cancelled']).notNull().default('active'),
  totalBudget: decimal('total_budget', { precision: 10, scale: 2 }),
  totalSales: decimal('total_sales', { precision: 10, scale: 2 }).default('0.00'),
  // New configuration fields
  eventLocation: varchar('event_location', { length: 500 }),
  eventCapacity: int('event_capacity'),
  registrationDeadline: date('registration_deadline'),
  deliveryDate: date('delivery_date'),
  allowsOnlinePayment: boolean('allows_online_payment').default(true),
  requiresDeposit: boolean('requires_deposit').default(true),
  depositPercentage: decimal('deposit_percentage', { precision: 5, scale: 2 }).default('50.00'),
  eventNotes: text('event_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  statusIdx: index('idx_events_status').on(table.status),
  dateIdx: index('idx_events_date').on(table.eventDate),
  vendorIdx: index('idx_events_vendor').on(table.vendorId),
}))
