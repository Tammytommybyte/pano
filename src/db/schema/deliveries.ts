import { mysqlTable, varchar, int, timestamp, date, time, mysqlEnum, text, index } from 'drizzle-orm/mysql-core'

export const deliveries = mysqlTable('deliveries', {
  id: int('id').primaryKey().autoincrement(),
  eventId: int('event_id').notNull(), // will add FK later
  deliveryDate: date('delivery_date').notNull(),
  deliveryLocation: varchar('delivery_location', { length: 255 }).notNull(),
  deliveryTime: time('delivery_time'),
  status: mysqlEnum('status', ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled']).notNull().default('scheduled'),
  // New digital signature and evidence fields
  coordinatorId: int('coordinator_id'), // user in charge
  setupNotes: text('setup_notes'),
  completionNotes: text('completion_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  eventIdx: index('idx_deliveries_event').on(table.eventId),
  dateIdx: index('idx_deliveries_date').on(table.deliveryDate),
  statusIdx: index('idx_deliveries_status').on(table.status),
}))

export const deliveryItems = mysqlTable('delivery_items', {
  id: int('id').primaryKey().autoincrement(),
  deliveryId: int('delivery_id').notNull(), // will add FK later
  orderId: int('order_id').notNull(), // will add FK later
  customerConfirmed: timestamp('customer_confirmed'), // when customer confirmed attendance
  delivered: timestamp('delivered'), // when actually delivered
  signedBy: varchar('signed_by', { length: 255 }),
  // New digital signature fields
  signatureUrl: varchar('signature_url', { length: 500 }), // URL to signature image
  photoEvidenceUrl: varchar('photo_evidence_url', { length: 500 }), // photo of delivery
  recipientIdType: varchar('recipient_id_type', { length: 50 }), // e.g., "passport", "student_id"
  recipientIdNumber: varchar('recipient_id_number', { length: 100 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  deliveryIdx: index('idx_delivery_items_delivery').on(table.deliveryId),
  orderIdx: index('idx_delivery_items_order').on(table.orderId),
}))
