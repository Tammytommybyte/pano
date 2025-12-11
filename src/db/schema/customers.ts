import { mysqlTable, varchar, int, timestamp, boolean, index } from 'drizzle-orm/mysql-core'

export const customers = mysqlTable('customers', {
  id: int('id').primaryKey().autoincrement(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName1: varchar('last_name1', { length: 100 }).notNull(),
  lastName2: varchar('last_name2', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  generation: varchar('generation', { length: 50 }),
  university: varchar('university', { length: 255 }),
  campus: varchar('campus', { length: 255 }),
  major: varchar('major', { length: 255 }),
  deliveryConfirmed: boolean('delivery_confirmed').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  emailIdx: index('idx_customers_email').on(table.email),
  nameIdx: index('idx_customers_name').on(table.firstName, table.lastName1),
}))
