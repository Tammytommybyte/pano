'use client'

import { useOnlineStatus } from '@/hooks/use-online-status'
import { useSyncStatus } from '@/hooks/use-sync-status'

export function OfflineBanner() {
  const { isOnline, isSlowConnection } = useOnlineStatus()
  const { pendingCount, sync, isSyncing } = useSyncStatus()

  if (isOnline && !isSlowConnection) {
    return null
  }

  const handleSync = async () => {
    if (isOnline && !isSyncing) {
      try {
        await sync()
      } catch (error) {
        console.error('Sync failed:', error)
      }
    }
  }

  return (
    <div
      className={`
        w-full px-4 py-3 text-sm font-medium text-white
        ${isOnline && isSlowConnection ? 'bg-orange-600' : 'bg-gray-800'}
      `}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
              <span>
                You're offline. {pendingCount > 0 && `${pendingCount} changes will sync when you reconnect.`}
              </span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Slow connection detected. Changes may take longer to sync.</span>
            </>
          )}
        </div>

        {isOnline && pendingCount > 0 && (
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-3 py-1 bg-white text-gray-800 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>
    </div>
  )
}
