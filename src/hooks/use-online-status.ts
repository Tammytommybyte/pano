'use client'

import { useState, useEffect } from 'react'
import { useNetworkMonitor } from '../lib/offline/network-monitor'

/**
 * Hook to track online/offline status
 */
export function useOnlineStatus() {
  const networkState = useNetworkMonitor()

  return {
    isOnline: networkState.isOnline,
    status: networkState.status,
    effectiveType: networkState.effectiveType,
    isSlowConnection: networkState.status === 'slow',
  }
}
