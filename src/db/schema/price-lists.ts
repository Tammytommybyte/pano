import { mysqlTable, varchar, int, timestamp, text, boolean, date, index } from 'drizzle-orm/mysql-core'

export const priceLists = mysqlTable('price_lists', {
  id: int('id').primaryKey().autoincrement(),
  priceListName: varchar('price_list_name', { length: 255 }).notNull(),
  description: text('description'),
  validFrom: date('valid_from').notNull(),
  validTo: date('valid_to'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  activeIdx: index('idx_price_lists_active').on(table.isActive),
  validityIdx: index('idx_price_lists_validity').on(table.validFrom, table.validTo),
}))

export const priceListItems = mysqlTable('price_list_items', {
  id: int('id').primaryKey().autoincrement(),
  priceListId: int('price_list_id').notNull(), // will add FK later
  productId: int('product_id').notNull(), // will add FK later
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 5, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  priceListIdx: index('idx_price_list_items_list').on(table.priceListId),
  productIdx: index('idx_price_list_items_product').on(table.productId),
}))

import { decimal } from 'drizzle-orm/mysql-core'
