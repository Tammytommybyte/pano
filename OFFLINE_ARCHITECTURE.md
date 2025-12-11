# Arquitectura Offline-First - Sistema Eureka

## Visión General

Este documento describe la arquitectura offline-first implementada en el Sistema Eureka, que permite operación continua sin conexión a internet.

## Arquitectura de Capas

```
┌─────────────────────────────────────┐
│         UI Components               │
│  (React + Next.js)                  │
├─────────────────────────────────────┤
│   React Query (Cache + Sync)        │
│  (TanStack Query)                   │
├─────────────────────────────────────┤
│   Sync Manager                      │
│  (Conflict Resolution)              │
├─────────────────────────────────────┤
│   Local DB (Dexie/IndexedDB)        │ ← OFFLINE LAYER
├─────────────────────────────────────┤
│   Network Layer (tRPC + Retry)      │
├─────────────────────────────────────┤
│   Server (Next.js API)              │
├─────────────────────────────────────┤
│   Drizzle ORM                       │
├─────────────────────────────────────┤
│   MySQL/PostgreSQL                  │
└─────────────────────────────────────┘
```

## Componentes Principales

### 1. IndexedDB (Dexie.js)

**Ubicación:** `src/lib/offline/db.ts`

Base de datos local del navegador que almacena:
- **Sync Queue:** Cola de operaciones pendientes de sincronización
- **Cached Data:** Datos descargados para uso offline (eventos, productos, inventario)
- **Settings:** Configuración local de la aplicación

**Esquema:**
```typescript
{
  syncQueue: "++id, table, syncStatus, timestamp",
  events: "id, eventCode, status, eventDate, vendorId",
  orders: "++id, orderCode, eventId, vendorId",
  customers: "++id, email",
  products: "id, productCode, category",
  inventory: "id, productId, productionArea",
  settings: "key"
}
```

### 2. Sync Queue Manager

**Ubicación:** `src/lib/offline/queue.ts`

Administra la cola de sincronización:
- Agregar operaciones (create, update, delete)
- Obtener items pendientes
- Marcar items como sincronizados/fallidos
- Estadísticas de sincronización

### 3. Sync Manager

**Ubicación:** `src/lib/offline/sync-manager.ts`

Orquesta la sincronización:
- Sincronización automática por intervalo
- Sincronización manual bajo demanda
- Procesamiento por lotes
- Reporte de progreso
- Manejo de errores y reintentos

### 4. Conflict Resolver

**Ubicación:** `src/lib/offline/conflict-resolver.ts`

Estrategias de resolución de conflictos:
- **Server-wins:** El servidor prevalece
- **Client-wins:** El cliente prevalece
- **Auto-merge:** Fusión automática de campos no conflictivos
- **Manual:** Resolución manual mediante UI

### 5. Network Monitor

**Ubicación:** `src/lib/offline/network-monitor.ts`

Monitorea el estado de la red:
- Detección online/offline
- Calidad de conexión (slow, 2g, 3g, 4g)
- RTT (Round Trip Time)
- Eventos de cambio de estado

## Flujo de Datos

### Creación Offline

```
1. Usuario crea orden sin conexión
2. Datos se guardan en IndexedDB
3. Operación se agrega a syncQueue
4. UI muestra feedback optimista
5. Cuando hay conexión:
   - Sync Manager procesa la cola
   - Envía al servidor
   - Actualiza con ID real del servidor
   - Elimina de syncQueue
```

### Sincronización

```
1. Sync Manager verifica conexión
2. Obtiene items pendientes de syncQueue
3. Procesa en lotes (default: 50 items)
4. Por cada item:
   - Marca como "syncing"
   - Envía al servidor via API
   - Maneja conflictos si existen
   - Marca como "synced" o "failed"
5. Actualiza caché local con respuesta
```

### Resolución de Conflictos

```
1. Servidor detecta versión desactualizada
2. Retorna datos conflictivos
3. Conflict Resolver analiza:
   - Detecta campos en conflicto
   - Evalúa si puede auto-resolver
   - Aplica estrategia configurada
4. Reintenta sincronización con datos resueltos
```

## Uso de Hooks

### useOnlineStatus

```typescript
const { isOnline, status, isSlowConnection } = useOnlineStatus()
```

### useSyncStatus

```typescript
const { 
  isSyncing, 
  pendingCount, 
  failedCount, 
  sync 
} = useSyncStatus()

// Sincronizar manualmente
await sync()
```

### useOfflineMutation

```typescript
const { mutate } = useOfflineMutation()

await mutate('create', orderData, {
  table: 'orders',
  optimisticData: tempOrder,
  onSuccess: (data) => console.log('Order created:', data),
  onError: (error) => console.error('Error:', error)
})
```

## Componentes UI

### SyncIndicator

Muestra el estado de sincronización:
- Online/Offline
- Syncing/Synced
- Pending/Failed count
- Last sync time

### OfflineBanner

Banner informativo cuando:
- El usuario está offline
- La conexión es lenta
- Hay cambios pendientes de sincronizar

## Seguridad

### Encriptación

**Ubicación:** `src/lib/utils/encryption.ts`

- Datos sensibles encriptados en IndexedDB
- Soporte para Web Crypto API (AES-GCM)
- Fallback a XOR simple para compatibilidad

### Tokens

- Tokens JWT almacenados en localStorage
- Refresh automático antes de expiración
- Validación local para operaciones offline

## Optimizaciones

### Compresión de Imágenes

**Ubicación:** `src/lib/utils/compression.ts`

- Compresión automática antes de guardar
- Reducción de tamaño para sincronización
- Preservación de calidad adecuada

### Gestión de Almacenamiento

- Limpieza automática de datos antiguos
- Límite de caché configurable
- Priorización de datos críticos

## Configuración

### Auto-Sync

```typescript
import { syncManager } from '@/lib/offline/sync-manager'

// Iniciar sync automático cada 30 segundos
syncManager.startAutoSync(30000)

// Detener sync automático
syncManager.stopAutoSync()
```

### Estrategia de Conflictos

```typescript
// En syncQueue al agregar item
await syncQueueManager.addToQueue(table, operation, {
  ...data,
  conflictResolution: 'auto-merge' // o 'server-wins', 'client-wins'
})
```

## Casos de Uso

### Vendedor en Evento

1. Pre-descarga catálogo de productos
2. Crea órdenes offline
3. Captura firmas digitales localmente
4. Sincroniza cuando regresa a zona con internet

### Producción

1. Marca pasos completados offline
2. Toma fotos de calidad
3. Comprime y guarda localmente
4. Sube al servidor cuando hay conexión

### Entrega

1. Pre-descarga agenda del día
2. Registra entregas offline
3. Captura firmas
4. Sincroniza al final del evento

## Testing

### Simular Modo Offline

En Chrome DevTools:
1. Network tab → Throttling → Offline
2. O en código:

```typescript
// Forzar modo offline para testing
window.dispatchEvent(new Event('offline'))
```

### Verificar IndexedDB

Chrome DevTools → Application → IndexedDB → EurekaDB

## Troubleshooting

### Sync no funciona

1. Verificar que hay conexión: `useOnlineStatus()`
2. Revisar errores en syncQueue
3. Forzar sync manual
4. Limpiar y reintentar

### Conflictos recurrentes

1. Revisar versiones de datos
2. Verificar timestamps
3. Usar resolución manual si necesario

### Almacenamiento lleno

1. Limpiar caché antigua
2. Reducir tamaño de imágenes
3. Limitar datos descargados

## Próximos Pasos

- [ ] Implementar Service Workers para offline completo
- [ ] Background sync API
- [ ] Push notifications para avisos de sync
- [ ] Compresión delta para sincronización eficiente
- [ ] Métricas de rendimiento offline

## Referencias

- [Dexie.js Documentation](https://dexie.org/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Offline First Principles](https://offlinefirst.org/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
