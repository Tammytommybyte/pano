import { mysqlTable, varchar, int, timestamp, text, mysqlEnum, index } from 'drizzle-orm/mysql-core'
import { users } from './users'

export const documents = mysqlTable('documents', {
  id: int('id').primaryKey().autoincrement(),
  documentType: mysqlEnum('document_type', ['contract', 'photo', 'signature', 'receipt', 'quality_check', 'delivery_proof', 'other']).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileUrl: varchar('file_url', { length: 500 }).notNull(),
  fileSize: int('file_size'), // in bytes
  mimeType: varchar('mime_type', { length: 100 }),
  relatedTable: varchar('related_table', { length: 100 }), // e.g., 'orders', 'deliveries', 'quality_checks'
  relatedId: int('related_id'), // foreign key to related table
  uploadedBy: int('uploaded_by').notNull().references(() => users.id),
  description: text('description'),
  metadata: text('metadata'), // JSON metadata
  isDeleted: timestamp('is_deleted'), // soft delete
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  relatedIdx: index('idx_documents_related').on(table.relatedTable, table.relatedId),
  typeIdx: index('idx_documents_type').on(table.documentType),
  uploadedByIdx: index('idx_documents_uploaded_by').on(table.uploadedBy),
}))
