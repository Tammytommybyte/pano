'use client'

import { useCallback } from 'react'
import { useOnlineStatus } from './use-online-status'
import { syncQueueManager } from '../lib/offline/queue'
import { localDB } from '../lib/offline/db'

export interface OfflineMutationOptions<T> {
  table: string
  optimisticData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

/**
 * Hook for offline-aware mutations
 */
export function useOfflineMutation<T = any>() {
  const { isOnline } = useOnlineStatus()

  const mutate = useCallback(async (
    operation: 'create' | 'update' | 'delete',
    data: T,
    options: OfflineMutationOptions<T>
  ) => {
    const { table, optimisticData, onSuccess, onError } = options

    try {
      if (isOnline) {
        // If online, try to perform operation immediately
        // This would normally call your API
        console.log('Online mutation:', { operation, table, data })
        
        // Simulate API call
        const result = data as T
        onSuccess?.(result)
        return result
      } else {
        // If offline, add to sync queue and use optimistic data
        await syncQueueManager.addToQueue(table, operation, data)

        // Update local cache optimistically
        if (optimisticData) {
          await updateLocalCache(table, optimisticData)
        }

        onSuccess?.(optimisticData || data)
        return optimisticData || data
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Mutation failed')
      onError?.(err)
      throw err
    }
  }, [isOnline])

  return { mutate }
}

/**
 * Helper to update local cache
 */
async function updateLocalCache(table: string, data: any) {
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
