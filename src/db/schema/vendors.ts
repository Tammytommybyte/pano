import { mysqlTable, varchar, int, timestamp, decimal, mysqlEnum, boolean, index } from 'drizzle-orm/mysql-core'
import { users } from './users'

export const vendors = mysqlTable('vendors', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => users.id),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  commissionPercentage: decimal('commission_percentage', { precision: 5, scale: 2 }).notNull().default('10.00'),
  totalSales: decimal('total_sales', { precision: 10, scale: 2 }).default('0.00'),
  totalCommissions: decimal('total_commissions', { precision: 10, scale: 2 }).default('0.00'),
  status: mysqlEnum('status', ['active', 'inactive']).notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  emailIdx: index('idx_vendors_email').on(table.email),
  statusIdx: index('idx_vendors_status').on(table.status),
  userIdx: index('idx_vendors_user').on(table.userId),
}))
