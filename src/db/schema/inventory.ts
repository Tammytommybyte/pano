import { mysqlTable, int, timestamp, mysqlEnum, date, index } from 'drizzle-orm/mysql-core'

export const inventory = mysqlTable('inventory', {
  id: int('id').primaryKey().autoincrement(),
  productId: int('product_id').notNull(), // will add FK later
  productionArea: mysqlEnum('production_area', ['rings', 'engraving', 'assembly', 'atc', 'quality_control', 'packaging']).notNull(),
  quantityOnHand: int('quantity_on_hand').notNull().default(0),
  quantityReserved: int('quantity_reserved').notNull().default(0),
  quantityInProduction: int('quantity_in_production').notNull().default(0),
  lastRestockDate: date('last_restock_date'),
  lastRestockQuantity: int('last_restock_quantity'),
  // New demand prediction fields
  averageDailyDemand: int('average_daily_demand').default(0),
  predictedDemandNextWeek: int('predicted_demand_next_week').default(0),
  predictedDemandNextMonth: int('predicted_demand_next_month').default(0),
  lastDemandCalculation: timestamp('last_demand_calculation'),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  productAreaIdx: index('idx_inventory_product_area').on(table.productId, table.productionArea),
  areaIdx: index('idx_inventory_area').on(table.productionArea),
}))
