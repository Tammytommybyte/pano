import { mysqlTable, varchar, int, timestamp, text, boolean, mysqlEnum, index } from 'drizzle-orm/mysql-core'

export const productionSteps = mysqlTable('production_steps', {
  id: int('id').primaryKey().autoincrement(),
  productId: int('product_id').notNull(), // will add FK later
  stepNumber: int('step_number').notNull(), // order of execution
  stepName: varchar('step_name', { length: 255 }).notNull(),
  productionArea: mysqlEnum('production_area', ['rings', 'engraving', 'assembly', 'atc', 'quality_control', 'packaging']).notNull(),
  description: text('description'),
  estimatedDuration: int('estimated_duration'), // in minutes
  requiresQualityCheck: boolean('requires_quality_check').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  productIdx: index('idx_production_steps_product').on(table.productId),
  areaIdx: index('idx_production_steps_area').on(table.productionArea),
}))
