export interface ConflictData {
  table: string
  recordId: number
  localVersion: number
  serverVersion: number
  localData: any
  serverData: any
  conflictFields: string[]
}

export type ConflictResolutionStrategy = 'server-wins' | 'client-wins' | 'manual' | 'merge'

/**
 * Conflict resolution strategies
 */
export class ConflictResolver {
  /**
   * Resolve conflict using server-wins strategy
   */
  resolveServerWins(conflict: ConflictData): any {
    return conflict.serverData
  }

  /**
   * Resolve conflict using client-wins strategy
   */
  resolveClientWins(conflict: ConflictData): any {
    return conflict.localData
  }

  /**
   * Attempt automatic merge of non-conflicting fields
   */
  resolveAutoMerge(conflict: ConflictData): any {
    const merged = { ...conflict.serverData }

    // Merge fields that only changed locally
    for (const field of Object.keys(conflict.localData)) {
      // Skip if field changed on both sides
      if (conflict.conflictFields.includes(field)) {
        // Use timestamp-based resolution
        const localTimestamp = conflict.localData.updatedAt || conflict.localData._lastSynced || 0
        const serverTimestamp = conflict.serverData.updatedAt || 0
        
        if (localTimestamp > serverTimestamp) {
          merged[field] = conflict.localData[field]
        }
      } else if (conflict.localData[field] !== conflict.serverData[field]) {
        // Field only changed locally, use local value
        merged[field] = conflict.localData[field]
      }
    }

    return merged
  }

  /**
   * Detect conflicting fields between local and server data
   */
  detectConflictFields(localData: any, serverData: any, baseData?: any): string[] {
    const conflicts: string[] = []

    for (const key of Object.keys(localData)) {
      // Skip metadata fields
      if (key.startsWith('_')) continue

      const localValue = localData[key]
      const serverValue = serverData[key]
      const baseValue = baseData?.[key]

      // If both changed from base and values differ, it's a conflict
      if (baseValue !== undefined) {
        if (localValue !== baseValue && serverValue !== baseValue && localValue !== serverValue) {
          conflicts.push(key)
        }
      } else {
        // No base data, simple comparison
        if (localValue !== serverValue) {
          conflicts.push(key)
        }
      }
    }

    return conflicts
  }

  /**
   * Resolve conflict based on strategy
   */
  resolve(conflict: ConflictData, strategy: ConflictResolutionStrategy): any {
    switch (strategy) {
      case 'server-wins':
        return this.resolveServerWins(conflict)
      case 'client-wins':
        return this.resolveClientWins(conflict)
      case 'merge':
        return this.resolveAutoMerge(conflict)
      case 'manual':
        // Should be handled by UI
        throw new Error('Manual conflict resolution required')
      default:
        return this.resolveServerWins(conflict)
    }
  }

  /**
   * Check if automatic resolution is possible
   */
  canAutoResolve(conflict: ConflictData): boolean {
    // If no conflicting fields, can auto-merge
    if (conflict.conflictFields.length === 0) {
      return true
    }

    // If only timestamp fields conflict, can auto-resolve
    const onlyTimestamps = conflict.conflictFields.every(field =>
      field.includes('At') || field.includes('_at') || field === 'updatedAt' || field === 'createdAt'
    )

    return onlyTimestamps
  }
}

export const conflictResolver = new ConflictResolver()
