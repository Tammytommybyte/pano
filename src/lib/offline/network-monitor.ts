'use client'

import { useEffect, useState } from 'react'

export type NetworkStatus = 'online' | 'offline' | 'slow'

export interface NetworkState {
  isOnline: boolean
  status: NetworkStatus
  effectiveType?: string
  downlink?: number
  rtt?: number
}

/**
 * Hook to monitor network status
 */
export function useNetworkMonitor() {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    status: typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline',
  })

  useEffect(() => {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine
      setNetworkState(prev => ({
        ...prev,
        isOnline,
        status: isOnline ? 'online' : 'offline',
      }))
    }

    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      
      if (connection) {
        const effectiveType = connection.effectiveType
        const downlink = connection.downlink
        const rtt = connection.rtt

        let status: NetworkStatus = 'online'
        if (!navigator.onLine) {
          status = 'offline'
        } else if (effectiveType === 'slow-2g' || effectiveType === '2g' || rtt > 1000) {
          status = 'slow'
        }

        setNetworkState({
          isOnline: navigator.onLine,
          status,
          effectiveType,
          downlink,
          rtt,
        })
      }
    }

    // Set up event listeners
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Monitor connection changes if supported
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo)
      updateConnectionInfo()
    }

    // Initial check
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [])

  return networkState
}

/**
 * Network monitor class for server-side or non-React usage
 */
export class NetworkMonitor {
  private listeners: Array<(state: NetworkState) => void> = []
  private state: NetworkState = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    status: typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline',
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupListeners()
    }
  }

  private setupListeners() {
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
  }

  private handleOnline = () => {
    this.updateState({ isOnline: true, status: 'online' })
  }

  private handleOffline = () => {
    this.updateState({ isOnline: false, status: 'offline' })
  }

  private updateState(newState: Partial<NetworkState>) {
    this.state = { ...this.state, ...newState }
    this.listeners.forEach(listener => listener(this.state))
  }

  public subscribe(listener: (state: NetworkState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  public getState(): NetworkState {
    return this.state
  }

  public destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline)
      window.removeEventListener('offline', this.handleOffline)
    }
    this.listeners = []
  }
}

export const networkMonitor = new NetworkMonitor()
