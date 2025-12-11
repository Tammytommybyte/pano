'use client'

import { useState, useEffect, useCallback } from 'react'
import { syncManager, SyncResult } from '../lib/offline/sync-manager'
import { syncQueueManager } from '../lib/offline/queue'

export interface SyncState {
  isSyncing: boolean
  lastSyncTime: number
  pendingCount: number
  failedCount: number
  lastError: string | null
}

/**
 * Hook to track sync status
 */
export function useSyncStatus() {
  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSyncTime: 0,
    pendingCount: 0,
    failedCount: 0,
    lastError: null,
  })

  const updateStats = useCallback(async () => {
    const stats = await syncQueueManager.getStats()
    const status = syncManager.getStatus()

    setSyncState(prev => ({
      ...prev,
      isSyncing: status.isSyncing,
      lastSyncTime: status.lastSyncTime,
      pendingCount: stats.pending,
      failedCount: stats.failed,
    }))
  }, [])

  useEffect(() => {
    updateStats()

    // Poll for updates every 5 seconds
    const interval = setInterval(updateStats, 5000)

    return () => clearInterval(interval)
  }, [updateStats])

  const sync = useCallback(async (): Promise<SyncResult> => {
    setSyncState(prev => ({ ...prev, isSyncing: true, lastError: null }))

    try {
      const result = await syncManager.forceSyncNow()
      
      if (!result.success) {
        setSyncState(prev => ({
          ...prev,
          lastError: result.errors[0]?.error || 'Sync failed',
        }))
      }

      await updateStats()
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setSyncState(prev => ({
        ...prev,
        lastError: errorMessage,
      }))
      throw error
    } finally {
      setSyncState(prev => ({ ...prev, isSyncing: false }))
    }
  }, [updateStats])

  return {
    ...syncState,
    sync,
    refresh: updateStats,
  }
}
