/**
 * IndexedDB operations wrapper
 */
export class IndexedDBStorage {
  private dbName: string
  private version: number

  constructor(dbName: string = 'EurekaStorage', version: number = 1) {
    this.dbName = dbName
    this.version = version
  }

  /**
   * Open database connection
   */
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' })
        }
      }
    })
  }

  /**
   * Store a file in IndexedDB
   */
  async storeFile(id: string, file: Blob, metadata?: any): Promise<void> {
    const db = await this.openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['files'], 'readwrite')
      const store = transaction.objectStore('files')

      const request = store.put({
        id,
        file,
        metadata,
        timestamp: Date.now(),
      })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Retrieve a file from IndexedDB
   */
  async getFile(id: string): Promise<{ file: Blob; metadata?: any } | null> {
    const db = await this.openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['files'], 'readonly')
      const store = transaction.objectStore('files')
      const request = store.get(id)

      request.onsuccess = () => {
        const result = request.result
        if (result) {
          resolve({ file: result.file, metadata: result.metadata })
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Delete a file from IndexedDB
   */
  async deleteFile(id: string): Promise<void> {
    const db = await this.openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['files'], 'readwrite')
      const store = transaction.objectStore('files')
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Store cache data
   */
  async setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
    const db = await this.openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')

      const request = store.put({
        key,
        value,
        timestamp: Date.now(),
        expiresAt: ttl ? Date.now() + ttl : null,
      })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Get cache data
   */
  async getCache<T>(key: string): Promise<T | null> {
    const db = await this.openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cache'], 'readonly')
      const store = transaction.objectStore('cache')
      const request = store.get(key)

      request.onsuccess = () => {
        const result = request.result
        
        if (!result) {
          resolve(null)
          return
        }

        // Check if expired
        if (result.expiresAt && Date.now() > result.expiresAt) {
          // Delete expired cache
          this.deleteCache(key)
          resolve(null)
          return
        }

        resolve(result.value)
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Delete cache entry
   */
  async deleteCache(key: string): Promise<void> {
    const db = await this.openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    const db = await this.openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['files', 'cache'], 'readwrite')
      
      const filesStore = transaction.objectStore('files')
      const cacheStore = transaction.objectStore('cache')

      const clearFiles = filesStore.clear()
      const clearCache = cacheStore.clear()

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }
}

export const indexedDBStorage = new IndexedDBStorage()
