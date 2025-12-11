import Dexie, { Table } from 'dexie'

// Sync queue interface
export interface SyncQueueItem {
  id?: number
  operation: 'create' | 'update' | 'delete'
  table: string
  data: any
  timestamp: number
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed'
  retryCount: number
  conflictResolution?: 'server-wins' | 'client-wins' | 'manual'
  error?: string
}

// Local cache tables - mirrors server schema
export interface LocalEvent {
  id: number
  eventCode: string
  eventName: string
  university: string
  campus?: string
  eventDate: string
  status: string
  totalBudget?: number
  totalSales?: number
  vendorId?: number
  priceListId?: number
  // ... other fields
  _version: number
  _lastSynced: number
}

export interface LocalOrder {
  id?: number
  orderCode: string
  eventId: number
  vendorId: number
  customerId: number
  totalAmount: number
  downPayment: number
  balance: number
  paymentStatus: string
  productionStatus: string
  orderDate: string
  isOfflineCreated: boolean
  _version: number
  _lastSynced: number
}

export interface LocalCustomer {
  id?: number
  firstName: string
  lastName1: string
  lastName2?: string
  email: string
  phone?: string
  university?: string
  campus?: string
  generation?: string
  major?: string
  _version: number
  _lastSynced: number
}

export interface LocalProduct {
  id: number
  productCode: string
  productName: string
  category: string
  basePrice: number
  description?: string
  isActive: boolean
  _version: number
  _lastSynced: number
}

export interface LocalInventory {
  id: number
  productId: number
  productionArea: string
  quantityOnHand: number
  quantityReserved: number
  _version: number
  _lastSynced: number
}

export class EurekaLocalDB extends Dexie {
  // Sync queue
  syncQueue!: Table<SyncQueueItem, number>
  
  // Cached data tables
  events!: Table<LocalEvent, number>
  orders!: Table<LocalOrder, number>
  customers!: Table<LocalCustomer, number>
  products!: Table<LocalProduct, number>
  inventory!: Table<LocalInventory, number>
  
  // Settings and metadata
  settings!: Table<{ key: string; value: any }, string>

  constructor() {
    super('EurekaDB')
    
    this.version(1).stores({
      syncQueue: '++id, table, syncStatus, timestamp',
      events: 'id, eventCode, status, eventDate, vendorId',
      orders: '++id, orderCode, eventId, vendorId, customerId, paymentStatus, productionStatus',
      customers: '++id, email, &orderCode',
      products: 'id, productCode, category, isActive',
      inventory: 'id, productId, productionArea',
      settings: 'key',
    })
  }
}

// Create singleton instance
export const localDB = new EurekaLocalDB()

// Helper to check if DB is ready
export const isDBReady = async (): Promise<boolean> => {
  try {
    await localDB.open()
    return true
  } catch (error) {
    console.error('Failed to open IndexedDB:', error)
    return false
  }
}

// Clear all offline data (for logout/reset)
export const clearOfflineData = async () => {
  await localDB.syncQueue.clear()
  await localDB.events.clear()
  await localDB.orders.clear()
  await localDB.customers.clear()
  await localDB.products.clear()
  await localDB.inventory.clear()
}
