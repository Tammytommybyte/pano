/**
 * LocalStorage wrapper with type safety and error handling
 */
export class LocalStorage {
  /**
   * Get item from localStorage
   */
  static get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') {
      return defaultValue ?? null
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue ?? null
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error)
      return defaultValue ?? null
    }
  }

  /**
   * Set item in localStorage
   */
  static set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error)
      return false
    }
  }

  /**
   * Remove item from localStorage
   */
  static remove(key: string): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      window.localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error)
      return false
    }
  }

  /**
   * Clear all items
   */
  static clear(): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      window.localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  /**
   * Check if key exists
   */
  static has(key: string): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(key) !== null
  }

  /**
   * Get all keys
   */
  static keys(): string[] {
    if (typeof window === 'undefined') {
      return []
    }

    return Object.keys(window.localStorage)
  }

  /**
   * Get storage size in bytes (approximate)
   */
  static getSize(): number {
    if (typeof window === 'undefined') {
      return 0
    }

    let total = 0
    for (const key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        total += window.localStorage[key].length + key.length
      }
    }
    return total
  }
}

// Commonly used keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'eureka_auth_token',
  REFRESH_TOKEN: 'eureka_refresh_token',
  USER_DATA: 'eureka_user_data',
  DEVICE_ID: 'eureka_device_id',
  LAST_SYNC: 'eureka_last_sync',
  OFFLINE_MODE: 'eureka_offline_mode',
  APP_SETTINGS: 'eureka_app_settings',
} as const
