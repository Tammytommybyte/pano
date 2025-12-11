import { relations } from 'drizzle-orm'

// Import all schemas
export * from './users'
export * from './documents'
export * from './audit-log'
export * from './system-settings'
export * from './order-status-history'
export * from './stock-movements'
export * from './production-steps'
export * from './order-item-customizations'
export * from './events'
export * from './products'
export * from './orders'
export * from './order-items'
export * from './customers'
export * from './payments'
export * from './inventory'
export * from './vendors'
export * from './commissions'
export * from './quality-checks'
export * from './deliveries'
export * from './notifications'
export * from './price-lists'

import { users } from './users'
import { documents } from './documents'
import { auditLog } from './audit-log'
import { orderStatusHistory } from './order-status-history'
import { stockMovements } from './stock-movements'
import { productionSteps } from './production-steps'
import { orderItemCustomizations } from './order-item-customizations'
import { events } from './events'
import { products } from './products'
import { orders } from './orders'
import { orderItems } from './order-items'
import { customers } from './customers'
import { payments } from './payments'
import { inventory } from './inventory'
import { vendors } from './vendors'
import { commissions } from './commissions'
import { qualityChecks } from './quality-checks'
import { deliveries, deliveryItems } from './deliveries'
import { notifications } from './notifications'
import { priceLists, priceListItems } from './price-lists'

// Define relations

// Users relations
export const usersRelations = relations(users, ({ many, one }) => ({
  documents: many(documents),
  auditLogs: many(auditLog),
  vendor: one(vendors, {
    fields: [users.id],
    references: [vendors.userId],
  }),
}))

// Vendors relations
export const vendorsRelations = relations(vendors, ({ many, one }) => ({
  user: one(users, {
    fields: [vendors.userId],
    references: [users.id],
  }),
  events: many(events),
  orders: many(orders),
  commissions: many(commissions),
}))

// Events relations
export const eventsRelations = relations(events, ({ many, one }) => ({
  vendor: one(vendors, {
    fields: [events.vendorId],
    references: [vendors.id],
  }),
  priceList: one(priceLists, {
    fields: [events.priceListId],
    references: [priceLists.id],
  }),
  orders: many(orders),
  deliveries: many(deliveries),
}))

// Products relations
export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  inventory: many(inventory),
  productionSteps: many(productionSteps),
  priceListItems: many(priceListItems),
  stockMovements: many(stockMovements),
}))

// Customers relations
export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}))

// Orders relations
export const ordersRelations = relations(orders, ({ many, one }) => ({
  event: one(events, {
    fields: [orders.eventId],
    references: [events.id],
  }),
  vendor: one(vendors, {
    fields: [orders.vendorId],
    references: [vendors.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  orderItems: many(orderItems),
  payments: many(payments),
  statusHistory: many(orderStatusHistory),
  deliveryItems: many(deliveryItems),
  notifications: many(notifications),
}))

// Order Items relations
export const orderItemsRelations = relations(orderItems, ({ many, one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  customizations: many(orderItemCustomizations),
  qualityChecks: many(qualityChecks),
}))

// Order Item Customizations relations
export const orderItemCustomizationsRelations = relations(orderItemCustomizations, ({ one }) => ({
  orderItem: one(orderItems, {
    fields: [orderItemCustomizations.orderItemId],
    references: [orderItems.id],
  }),
}))

// Payments relations
export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}))

// Inventory relations
export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
}))

// Stock Movements relations
export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
  performedByUser: one(users, {
    fields: [stockMovements.performedBy],
    references: [users.id],
  }),
}))

// Production Steps relations
export const productionStepsRelations = relations(productionSteps, ({ one }) => ({
  product: one(products, {
    fields: [productionSteps.productId],
    references: [products.id],
  }),
}))

// Commissions relations
export const commissionsRelations = relations(commissions, ({ one }) => ({
  vendor: one(vendors, {
    fields: [commissions.vendorId],
    references: [vendors.id],
  }),
  order: one(orders, {
    fields: [commissions.orderId],
    references: [orders.id],
  }),
}))

// Quality Checks relations
export const qualityChecksRelations = relations(qualityChecks, ({ one }) => ({
  orderItem: one(orderItems, {
    fields: [qualityChecks.orderItemId],
    references: [orderItems.id],
  }),
  checkedByUser: one(users, {
    fields: [qualityChecks.checkedBy],
    references: [users.id],
  }),
}))

// Deliveries relations
export const deliveriesRelations = relations(deliveries, ({ many, one }) => ({
  event: one(events, {
    fields: [deliveries.eventId],
    references: [events.id],
  }),
  deliveryItems: many(deliveryItems),
}))

// Delivery Items relations
export const deliveryItemsRelations = relations(deliveryItems, ({ one }) => ({
  delivery: one(deliveries, {
    fields: [deliveryItems.deliveryId],
    references: [deliveries.id],
  }),
  order: one(orders, {
    fields: [deliveryItems.orderId],
    references: [orders.id],
  }),
}))

// Documents relations
export const documentsRelations = relations(documents, ({ one }) => ({
  uploadedByUser: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}))

// Audit Log relations
export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}))

// Order Status History relations
export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistory.orderId],
    references: [orders.id],
  }),
  changedByUser: one(users, {
    fields: [orderStatusHistory.changedBy],
    references: [users.id],
  }),
}))

// Notifications relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  relatedOrder: one(orders, {
    fields: [notifications.relatedOrderId],
    references: [orders.id],
  }),
}))

// Price Lists relations
export const priceListsRelations = relations(priceLists, ({ many }) => ({
  events: many(events),
  priceListItems: many(priceListItems),
}))

// Price List Items relations
export const priceListItemsRelations = relations(priceListItems, ({ one }) => ({
  priceList: one(priceLists, {
    fields: [priceListItems.priceListId],
    references: [priceLists.id],
  }),
  product: one(products, {
    fields: [priceListItems.productId],
    references: [products.id],
  }),
}))
