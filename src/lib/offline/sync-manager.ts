import { localDB, SyncQueueItem } from './db'
import { syncQueueManager } from './queue'
import { conflictResolver, ConflictData } from './conflict-resolver'
import { networkMonitor } from './network-monitor'

export interface SyncResult {
  success: boolean
  synced: number
  failed: number
  conflicts: number
  errors: Array<{ item: SyncQueueItem; error: string }>
}

export interface SyncOptions {
  maxBatchSize?: number
  retryFailed?: boolean
  onProgress?: (progress: { current: number; total: number }) => void
}

/**
 * Main sync manager - orchestrates offline-to-online synchronization
 */
export class SyncManager {
  private isSyncing = false
  private lastSyncTime = 0
  private syncInterval: NodeJS.Timeout | null = null

  /**
   * Start automatic sync on interval
   */
  startAutoSync(intervalMs: number = 30000) {
    this.stopAutoSync()
    
    this.syncInterval = setInterval(async () => {
      if (networkMonitor.getState().isOnline && !this.isSyncing) {
        await this.sync()
      }
    }, intervalMs)
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  /**
   * Perform synchronization
   */
  async sync(options: SyncOptions = {}): Promise<SyncResult> {
    const {
      maxBatchSize = 50,
      retryFailed = true,
      onProgress,
    } = options

    if (this.isSyncing) {
      throw new Error('Sync already in progress')
    }

    if (!networkMonitor.getState().isOnline) {
      throw new Error('Cannot sync while offline')
    }

    this.isSyncing = true
    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      conflicts: 0,
      errors: [],
    }

    try {
      // Get pending items
      let items = await syncQueueManager.getPendingItems()
      
      // Optionally include failed items for retry
      if (retryFailed) {
        const failedItems = await syncQueueManager.getFailedItems()
        items = [...items, ...failedItems]
      }

      // Process in batches
      const batches = this.createBatches(items, maxBatchSize)
      
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        
        for (let j = 0; j < batch.length; j++) {
          const item = batch[j]
          
          if (onProgress) {
            onProgress({
              current: i * maxBatchSize + j + 1,
              total: items.length,
            })
          }

          try {
            await this.syncItem(item)
            result.synced++
          } catch (error) {
            result.failed++
            result.errors.push({
              item,
              error: error instanceof Error ? error.message : String(error),
            })

            if (item.id) {
              await syncQueueManager.markAsFailed(
                item.id,
                error instanceof Error ? error.message : String(error)
              )
            }
          }
        }
      }

      this.lastSyncTime = Date.now()
      
      if (result.failed > 0) {
        result.success = false
      }

    } catch (error) {
      result.success = false
      console.error('Sync error:', error)
    } finally {
      this.isSyncing = false
    }

    return result
  }

  /**
   * Sync a single item
   */
  private async syncItem(item: SyncQueueItem): Promise<void> {
    if (!item.id) {
      throw new Error('Item has no ID')
    }

    await syncQueueManager.markAsSyncing(item.id)

    try {
      // Send to server via API
      const response = await this.sendToServer(item)

      // Check for conflicts
      if (response.conflict) {
        const conflict: ConflictData = response.conflict
        
        // Try auto-resolution
        if (conflictResolver.canAutoResolve(conflict)) {
          const resolved = conflictResolver.resolve(conflict, 'merge')
          // Retry with resolved data
          item.data = resolved
          const retryResponse = await this.sendToServer(item)
          
          if (retryResponse.success) {
            await syncQueueManager.markAsSynced(item.id)
          }
        } else {
          // Manual resolution needed
          throw new Error('Conflict requires manual resolution')
        }
      } else if (response.success) {
        await syncQueueManager.markAsSynced(item.id)
        
        // Update local cache with server response
        if (response.data) {
          await this.updateLocalCache(item.table, response.data)
        }
      } else {
        throw new Error(response.error || 'Sync failed')
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Send item to server (placeholder - implement with actual API)
   */
  private async sendToServer(item: SyncQueueItem): Promise<any> {
    // This should be implemented with actual tRPC/API calls
    // For now, return mock response
    console.log('Sending to server:', item)
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: item.data })
      }, 100)
    })
  }

  /**
   * Update local cache after successful sync
   */
  private async updateLocalCache(table: string, data: any): Promise<void> {
    const tableMap: Record<string, any> = {
      events: localDB.events,
      orders: localDB.orders,
      customers: localDB.customers,
      products: localDB.products,
      inventory: localDB.inventory,
    }

    const dbTable = tableMap[table]
    if (dbTable) {
      await dbTable.put({
        ...data,
        _version: data.version || 1,
        _lastSynced: Date.now(),
      })
    }
  }

  /**
   * Create batches from items
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = []
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize))
    }
    return batches
  }

  /**
   * Get sync status
   */
  getStatus() {
    return {
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      autoSyncEnabled: this.syncInterval !== null,
    }
  }

  /**
   * Force sync now
   */
  async forceSyncNow(): Promise<SyncResult> {
    return await this.sync({ retryFailed: true })
  }
}

export const syncManager = new SyncManager()
