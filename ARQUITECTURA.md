# Arquitectura del Sistema Eureka \- Documentación Técnica

**Versión:** 1.0

## 1\. Visión General de la Arquitectura

El sistema Eurekaa está diseñado como una plataforma integrada que automatiza completamente el flujo de ventas, producción, inventario y entrega de servicios de graduación. La arquitectura se divide en tres capas principales:

**Capa de Presentación (Frontend):**

- App de Vendedores (creación de órdenes, visualización de comisiones)  
- Paneles Administrativos (gestión de inventario, producción, reportes)  
- Sitio Web Corporativo (información, cotizaciones)

**Capa de Lógica de Negocio (Backend):**

- API tRPC para comunicación tipo-segura  
- Servicios de generación de contratos  
- Servicios de notificaciones (correo, WhatsApp)  
- Servicios de pagos online  
- Servicios de OCR para escaneo de contratos  
- Motor de predicción de demanda

**Capa de Datos (Base de Datos):**

- MySQL con Drizzle ORM  
- Tablas normalizadas para máxima integridad  
- Índices optimizados para consultas frecuentes  
- Auditoría completa de cambios

---

## 2\. Modelo de Datos Completo

### 2.1 Entidades Principales

#### Tabla: `events` (Eventos)

Almacena información de cada evento de graduación.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `eventCode` | VARCHAR(50) | Código único del evento (ej: ULA-2025-LIC-MAYO) |
| `eventName` | VARCHAR(255) | Nombre del evento |
| `university` | VARCHAR(255) | Universidad |
| `campus` | VARCHAR(255) | Campus |
| `eventDate` | DATE | Fecha del evento |
| `priceListId` | INT (FK) | Referencia a lista de precios |
| `vendorId` | INT (FK) | Vendedor principal del evento |
| `status` | ENUM | Estado: `active`, `completed`, `cancelled` |
| `totalBudget` | DECIMAL(10,2) | Presupuesto total estimado |
| `totalSales` | DECIMAL(10,2) | Total de ventas realizadas |
| `createdAt` | TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | Última actualización |

#### Tabla: `products` (Productos)

Catálogo completo de productos y servicios.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `productCode` | VARCHAR(50) | Código único (ej: PKG-ULA-001) |
| `barcode` | VARCHAR(100) | Código de barras para escaneo |
| `qrCode` | VARCHAR(500) | Código QR codificado |
| `productName` | VARCHAR(255) | Nombre del producto |
| `category` | ENUM | Categoría: `package`, `diploma`, `photo`, `ring`, `extra` |
| `description` | TEXT | Descripción detallada |
| `basePrice` | DECIMAL(10,2) | Precio base |
| `cost` | DECIMAL(10,2) | Costo de producción |
| `margin` | DECIMAL(5,2) | Margen de ganancia (%) |
| `productionTime` | INT | Tiempo de producción en días |
| `productionArea` | ENUM | Área responsable: `rings`, `engraving`, `assembly`, `atc` |
| `stockLevel` | INT | Nivel de stock actual |
| `reorderPoint` | INT | Punto de reorden (alerta) |
| `isActive` | BOOLEAN | Producto activo |
| `createdAt` | TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | Última actualización |

#### Tabla: `orders` (Órdenes)

Registro de cada orden de compra.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `orderCode` | VARCHAR(50) | Código único de orden (ej: ORD-2025-001) |
| `eventId` | INT (FK) | Referencia al evento |
| `vendorId` | INT (FK) | Vendedor que creó la orden |
| `customerId` | INT (FK) | Cliente (estudiante) |
| `orderDate` | TIMESTAMP | Fecha de creación de orden |
| `totalAmount` | DECIMAL(10,2) | Total a pagar |
| `downPayment` | DECIMAL(10,2) | Monto del anticipo |
| `balance` | DECIMAL(10,2) | Saldo pendiente |
| `paymentStatus` | ENUM | Estado: `pending`, `partial`, `paid`, `overdue` |
| `productionStatus` | ENUM | Estado: `pending`, `in_progress`, `quality_check`, `ready`, `delivered` |
| `dueDate` | DATE | Fecha límite de pago |
| `deliveryDate` | DATE | Fecha de entrega programada |
| `notes` | TEXT | Observaciones |
| `createdAt` | TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | Última actualización |

#### Tabla: `order_items` (Detalles de Orden)

Productos incluidos en cada orden.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `orderId` | INT (FK) | Referencia a orden |
| `productId` | INT (FK) | Referencia a producto |
| `quantity` | INT | Cantidad |
| `unitPrice` | DECIMAL(10,2) | Precio unitario |
| `subtotal` | DECIMAL(10,2) | Subtotal |
| `customization` | JSON | Datos de personalización (grabado, colores, etc.) |
| `status` | ENUM | Estado: `pending`, `in_progress`, `completed`, `quality_check_failed` |
| `productionArea` | ENUM | Área responsable |
| `createdAt` | TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | Última actualización |

#### Tabla: `customers` (Clientes/Estudiantes)

Información de estudiantes/clientes.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `firstName` | VARCHAR(100) | Nombre(s) |
| `lastName1` | VARCHAR(100) | Apellido paterno |
| `lastName2` | VARCHAR(100) | Apellido materno |
| `email` | VARCHAR(255) | Correo electrónico |
| `phone` | VARCHAR(20) | Teléfono |
| `generation` | VARCHAR(50) | Generación/Año |
| `university` | VARCHAR(255) | Universidad |
| `campus` | VARCHAR(255) | Campus |
| `major` | VARCHAR(255) | Carrera/Especialidad |
| `deliveryConfirmed` | BOOLEAN | Confirmación de asistencia a entrega |
| `createdAt` | TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | Última actualización |

#### Tabla: `payments` (Pagos)

Registro de todos los pagos realizados.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `orderId` | INT (FK) | Referencia a orden |
| `paymentMethod` | ENUM | Método: `cash`, `transfer`, `card`, `online` |
| `paymentMode` | ENUM | Modalidad: `down_payment`, `full_payment`, `balance` |
| `amount` | DECIMAL(10,2) | Monto pagado |
| `lastDigits` | VARCHAR(20) | Últimos dígitos de operación |
| `transactionId` | VARCHAR(100) | ID de transacción |
| `paymentDate` | TIMESTAMP | Fecha del pago |
| `status` | ENUM | Estado: `pending`, `confirmed`, `failed` |
| `createdAt` | TIMESTAMP | Fecha de creación |

#### Tabla: `inventory` (Inventario)

Control de inventario por área de producción.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `productId` | INT (FK) | Referencia a producto |
| `productionArea` | ENUM | Área: `rings`, `engraving`, `assembly`, `atc` |
| `quantityOnHand` | INT | Cantidad disponible |
| `quantityReserved` | INT | Cantidad reservada en órdenes |
| `quantityInProduction` | INT | Cantidad en producción |
| `lastRestockDate` | DATE | Última fecha de restock |
| `lastRestockQuantity` | INT | Cantidad del último restock |
| `updatedAt` | TIMESTAMP | Última actualización |

#### Tabla: `vendors` (Vendedores)

Información de vendedores.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `userId` | INT (FK) | Referencia a usuario |
| `firstName` | VARCHAR(100) | Nombre |
| `lastName` | VARCHAR(100) | Apellido |
| `email` | VARCHAR(255) | Correo |
| `phone` | VARCHAR(20) | Teléfono |
| `commissionPercentage` | DECIMAL(5,2) | Porcentaje de comisión |
| `totalSales` | DECIMAL(10,2) | Total de ventas |
| `totalCommissions` | DECIMAL(10,2) | Total de comisiones ganadas |
| `status` | ENUM | Estado: `active`, `inactive` |
| `createdAt` | TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | Última actualización |

#### Tabla: `commissions` (Comisiones)

Registro detallado de comisiones.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `vendorId` | INT (FK) | Referencia a vendedor |
| `orderId` | INT (FK) | Referencia a orden |
| `saleAmount` | DECIMAL(10,2) | Monto de venta |
| `commissionPercentage` | DECIMAL(5,2) | Porcentaje aplicado |
| `commissionAmount` | DECIMAL(10,2) | Monto de comisión |
| `period` | VARCHAR(20) | Período (ej: 2025-11) |
| `status` | ENUM | Estado: `pending`, `calculated`, `paid` |
| `createdAt` | TIMESTAMP | Fecha de creación |

#### Tabla: `quality_checks` (Control de Calidad)

Registro de inspecciones de calidad.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `orderItemId` | INT (FK) | Referencia a item de orden |
| `productionArea` | ENUM | Área que realizó inspección |
| `checkedBy` | INT (FK) | Usuario que realizó inspección |
| `status` | ENUM | Resultado: `passed`, `failed`, `needs_rework` |
| `notes` | TEXT | Observaciones |
| `photoUrl` | VARCHAR(500) | URL de foto de producto |
| `checkedAt` | TIMESTAMP | Fecha de inspección |

#### Tabla: `deliveries` (Entregas)

Agenda y registro de entregas.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `eventId` | INT (FK) | Referencia a evento |
| `deliveryDate` | DATE | Fecha de entrega |
| `deliveryLocation` | VARCHAR(255) | Ubicación de entrega |
| `deliveryTime` | TIME | Hora de entrega |
| `status` | ENUM | Estado: `scheduled`, `confirmed`, `completed`, `cancelled` |
| `createdAt` | TIMESTAMP | Fecha de creación |

#### Tabla: `delivery_items` (Ítems de Entrega)

Órdenes incluidas en cada entrega.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `deliveryId` | INT (FK) | Referencia a entrega |
| `orderId` | INT (FK) | Referencia a orden |
| `customerConfirmed` | BOOLEAN | Cliente confirmó asistencia |
| `delivered` | BOOLEAN | Entregado |
| `deliveredAt` | TIMESTAMP | Fecha de entrega |
| `signedBy` | VARCHAR(255) | Nombre de quien recibió |

#### Tabla: `notifications` (Notificaciones)

Registro de todas las notificaciones enviadas.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `recipientId` | INT (FK) | Destinatario (usuario/cliente) |
| `type` | ENUM | Tipo: `email`, `whatsapp`, `sms`, `in_app` |
| `subject` | VARCHAR(255) | Asunto |
| `content` | TEXT | Contenido |
| `relatedOrderId` | INT (FK) | Orden relacionada (opcional) |
| `status` | ENUM | Estado: `pending`, `sent`, `failed` |
| `sentAt` | TIMESTAMP | Fecha de envío |
| `createdAt` | TIMESTAMP | Fecha de creación |

#### Tabla: `price_lists` (Listas de Precios)

Diferentes listas de precios por evento.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `priceListName` | VARCHAR(255) | Nombre (ej: ULA 2025\) |
| `description` | TEXT | Descripción |
| `validFrom` | DATE | Válida desde |
| `validTo` | DATE | Válida hasta |
| `isActive` | BOOLEAN | Activa |
| `createdAt` | TIMESTAMP | Fecha de creación |

#### Tabla: `price_list_items` (Ítems de Lista de Precios)

Precios específicos por lista.

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| `id` | INT (PK) | Identificador único |
| `priceListId` | INT (FK) | Referencia a lista de precios |
| `productId` | INT (FK) | Referencia a producto |
| `price` | DECIMAL(10,2) | Precio específico |
| `discount` | DECIMAL(5,2) | Descuento (%) |

---

## 3\. Flujos de Datos Principales

### 3.1 Flujo de Creación de Orden

Vendedor abre evento

    ↓

Selecciona lista de precios

    ↓

Ingresa datos del cliente

    ↓

Selecciona productos del catálogo

    ↓

Sistema calcula total, anticipo, saldo

    ↓

Ingresa datos de pago (modalidad, últimos dígitos)

    ↓

Sistema genera orden de producción

    ↓

Genera contrato PDF

    ↓

Envía contrato por correo y WhatsApp

    ↓

Guarda en base de datos

    ↓

Actualiza inventario (reserva material)

    ↓

Crea tickets para áreas de producción

    ↓

Notifica a vendedor: orden creada

### 3.2 Flujo de Producción

Orden creada

    ↓

Área de Anillos (si aplica):

  \- Recibe ticket

  \- Fabrica anillo

  \- Control de calidad

  \- Marca como completado

    ↓

Área de Grabados (si aplica):

  \- Recibe ticket

  \- Graba placas/diplomas

  \- Control de calidad

  \- Marca como completado

    ↓

Área de Armado:

  \- Recibe ticket

  \- Ensambla paquete

  \- Control de calidad

  \- Marca como completado

    ↓

Orden lista para entrega

    ↓

Notifica a cliente: paquete listo

### 3.3 Flujo de Entrega

Evento próximo

    ↓

Sistema crea agenda de entrega

    ↓

Envía recordatorio a clientes

    ↓

Clientes confirman asistencia

    ↓

Sistema filtra paquetes a llevar

    ↓

Genera reporte de paquetes

    ↓

Día de entrega:

  \- Entrega paquetes confirmados

  \- Registra entregas

  \- Obtiene firmas

    ↓

Marca orden como entregada

---

## 4\. Características Técnicas Clave

### 4.1 Seguridad

- Autenticación con ?  
- Roles de usuario: `admin`, `vendor`, `production_staff`, `customer`  
- Control de acceso basado en roles (RBAC)  
- Encriptación de datos sensibles (pagos, contacto)  
- Auditoría de cambios en órdenes críticas

### 4.2 Escalabilidad

- Índices en campos frecuentemente consultados  
- Particionamiento de tablas grandes por fecha  
- Caché de lista de precios en memoria  
- Procesamiento asincrónico de notificaciones

### 4.3 Confiabilidad

- Transacciones ACID para operaciones críticas  
- Respaldos automáticos diarios  
- Recuperación ante fallos  
- Validación de datos en múltiples capas

### 4.4 Rendimiento

- Consultas optimizadas con índices  
- Paginación de resultados grandes  
- Caché de datos frecuentemente accedidos  
- Reportes generados en background

---

## 5\. Integraciones Externas

### 5.1 Envío de Correos

- Servicio SMTP para notificaciones  
- Templates HTML personalizados  
- Seguimiento de entregas

### 5.2 WhatsApp

- API de WhatsApp Business  
- Envío de contratos y recordatorios  
- Confirmación de entregas

### 5.3 Pagos Online

- Pasarela de pago (Stripe/BBVA/Mercado Pago/PayPal)  
- Confirmación automática de pagos  
- Webhooks para actualizar estado

### 5.4 OCR

- Servicio de OCR para escaneo de contratos  
- Lectura de códigos de barras/QR  
- Validación de datos extraídos

---

## 

1. 

---

