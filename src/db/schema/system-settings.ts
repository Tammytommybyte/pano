import { mysqlTable, varchar, int, timestamp, text, boolean, mysqlEnum } from 'drizzle-orm/mysql-core'

export const systemSettings = mysqlTable('system_settings', {
  id: int('id').primaryKey().autoincrement(),
  settingKey: varchar('setting_key', { length: 100 }).notNull().unique(),
  settingValue: text('setting_value').notNull(),
  valueType: mysqlEnum('value_type', ['string', 'number', 'boolean', 'json']).notNull().default('string'),
  category: varchar('category', { length: 100 }), // e.g., 'payments', 'notifications', 'production'
  description: text('description'),
  isPublic: boolean('is_public').notNull().default(false), // can be accessed by non-admin users
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
})
