import { localDB, SyncQueueItem } from './db'

export class SyncQueueManager {
  /**
   * Add an operation to the sync queue
   */
  async addToQueue(
    table: string,
    operation: 'create' | 'update' | 'delete',
    data: any
  ): Promise<number> {
    const item: SyncQueueItem = {
      table,
      operation,
      data,
      timestamp: Date.now(),
      syncStatus: 'pending',
      retryCount: 0,
    }

    return await localDB.syncQueue.add(item)
  }

  /**
   * Get all pending items in the queue
   */
  async getPendingItems(): Promise<SyncQueueItem[]> {
    return await localDB.syncQueue
      .where('syncStatus')
      .equals('pending')
      .sortBy('timestamp')
  }

  /**
   * Get failed items that need retry
   */
  async getFailedItems(): Promise<SyncQueueItem[]> {
    return await localDB.syncQueue
      .where('syncStatus')
      .equals('failed')
      .and(item => item.retryCount < 3) // max 3 retries
      .sortBy('timestamp')
  }

  /**
   * Mark an item as syncing
   */
  async markAsSyncing(id: number): Promise<void> {
    await localDB.syncQueue.update(id, { syncStatus: 'syncing' })
  }

  /**
   * Mark an item as synced and remove from queue
   */
  async markAsSynced(id: number): Promise<void> {
    await localDB.syncQueue.delete(id)
  }

  /**
   * Mark an item as failed
   */
  async markAsFailed(id: number, error: string): Promise<void> {
    const item = await localDB.syncQueue.get(id)
    if (item) {
      await localDB.syncQueue.update(id, {
        syncStatus: 'failed',
        retryCount: item.retryCount + 1,
        error,
      })
    }
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<{
    pending: number
    syncing: number
    failed: number
    total: number
  }> {
    const [pending, syncing, failed, total] = await Promise.all([
      localDB.syncQueue.where('syncStatus').equals('pending').count(),
      localDB.syncQueue.where('syncStatus').equals('syncing').count(),
      localDB.syncQueue.where('syncStatus').equals('failed').count(),
      localDB.syncQueue.count(),
    ])

    return { pending, syncing, failed, total }
  }

  /**
   * Clear all synced items
   */
  async clearSyncedItems(): Promise<void> {
    // Items are deleted when marked as synced, so this is for cleanup
    await localDB.syncQueue
      .where('syncStatus')
      .equals('synced')
      .delete()
  }

  /**
   * Clear all items (use with caution)
   */
  async clearAll(): Promise<void> {
    await localDB.syncQueue.clear()
  }
}

export const syncQueueManager = new SyncQueueManager()
