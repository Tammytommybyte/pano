/**
 * Simple encryption utilities for sensitive data
 * Note: For production, consider using a more robust solution like Web Crypto API
 */

const ENCRYPTION_KEY = 'eureka-local-encryption-key' // Should be per-user in production

/**
 * Encode string to base64
 */
function encodeBase64(str: string): string {
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(str)
  }
  return Buffer.from(str).toString('base64')
}

/**
 * Decode base64 to string
 */
function decodeBase64(str: string): string {
  if (typeof window !== 'undefined' && window.atob) {
    return window.atob(str)
  }
  return Buffer.from(str, 'base64').toString()
}

/**
 * Simple XOR encryption (for demo purposes)
 * In production, use Web Crypto API with AES-GCM
 */
function xorEncrypt(text: string, key: string): string {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return result
}

/**
 * Encrypt sensitive data
 */
export function encrypt(data: string): string {
  try {
    const encrypted = xorEncrypt(data, ENCRYPTION_KEY)
    return encodeBase64(encrypted)
  } catch (error) {
    console.error('Encryption error:', error)
    return data // Fallback to unencrypted if error
  }
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedData: string): string {
  try {
    const decoded = decodeBase64(encryptedData)
    return xorEncrypt(decoded, ENCRYPTION_KEY) // XOR is symmetric
  } catch (error) {
    console.error('Decryption error:', error)
    return encryptedData // Fallback to returning as-is if error
  }
}

/**
 * Encrypt object (converts to JSON first)
 */
export function encryptObject<T>(obj: T): string {
  return encrypt(JSON.stringify(obj))
}

/**
 * Decrypt to object
 */
export function decryptObject<T>(encryptedData: string): T | null {
  try {
    const decrypted = decrypt(encryptedData)
    return JSON.parse(decrypted)
  } catch (error) {
    console.error('Decryption/parse error:', error)
    return null
  }
}

/**
 * Hash function (simple, for demo)
 * In production, use proper hashing like SHA-256
 */
export function hash(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(36)
}

/**
 * Generate random ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `${prefix}${timestamp}${random}`
}

/**
 * Web Crypto API encryption (for modern browsers)
 */
export async function encryptWithWebCrypto(
  data: string,
  password: string
): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return encrypt(data) // Fallback
  }

  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  
  // Derive key from password
  const passwordBuffer = encoder.encode(password)
  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('eureka-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    importedKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  )

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)

  // Convert to base64
  return encodeBase64(String.fromCharCode(...combined))
}

/**
 * Web Crypto API decryption
 */
export async function decryptWithWebCrypto(
  encryptedData: string,
  password: string
): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return decrypt(encryptedData) // Fallback
  }

  const decoder = new TextDecoder()
  const encoder = new TextEncoder()

  // Decode base64
  const combined = new Uint8Array(
    decodeBase64(encryptedData).split('').map(c => c.charCodeAt(0))
  )

  // Extract IV and encrypted data
  const iv = combined.slice(0, 12)
  const encrypted = combined.slice(12)

  // Derive key from password
  const passwordBuffer = encoder.encode(password)
  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('eureka-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    importedKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  )

  return decoder.decode(decrypted)
}
