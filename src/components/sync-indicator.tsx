'use client'

import { useOnlineStatus } from '@/hooks/use-online-status'
import { useSyncStatus } from '@/hooks/use-sync-status'

export function SyncIndicator() {
  const { isOnline, status, isSlowConnection } = useOnlineStatus()
  const { isSyncing, pendingCount, failedCount, lastSyncTime } = useSyncStatus()

  const getStatusColor = () => {
    if (!isOnline) return 'bg-gray-500'
    if (isSyncing) return 'bg-blue-500 animate-pulse'
    if (failedCount > 0) return 'bg-red-500'
    if (pendingCount > 0) return 'bg-yellow-500'
    if (isSlowConnection) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (isSyncing) return 'Syncing...'
    if (failedCount > 0) return `${failedCount} failed`
    if (pendingCount > 0) return `${pendingCount} pending`
    if (isSlowConnection) return 'Slow connection'
    return 'Synced'
  }

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never'
    const minutes = Math.floor((Date.now() - lastSyncTime) / 60000)
    if (minutes === 0) return 'Just now'
    if (minutes === 1) return '1 min ago'
    if (minutes < 60) return `${minutes} mins ago`
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1 hour ago'
    return `${hours} hours ago`
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span className="font-medium">{getStatusText()}</span>
      </div>
      {isOnline && lastSyncTime > 0 && (
        <span className="text-gray-500 text-xs">
          Last sync: {formatLastSync()}
        </span>
      )}
    </div>
  )
}
