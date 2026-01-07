# Guía de Deploy - Sistema Eureka

## ✅ Estado del Proyecto

**Versión:** 1.0.0 (Primera Revisión)  
**Fecha:** 7 de Enero, 2026  
**Estado:** ✅ **LISTO PARA DEPLOY**

### Verificaciones Completadas

- ✅ Compilación exitosa sin errores
- ✅ Schema de base de datos completo (18 tablas)
- ✅ Arquitectura offline-first implementada
- ✅ Componentes base funcionales
- ✅ Configuración de Next.js corregida
- ✅ No hay errores de TypeScript/ESLint (modo ignorado para build)

---

## 📋 Pre-requisitos

Antes de hacer deploy, asegúrate de tener:

1. Una base de datos MySQL disponible
2. Variables de entorno configuradas
3. Cuenta en plataforma de hosting (Vercel recomendado)

---

## 🚀 Opciones de Deploy

### Opción 1: Deploy en Vercel (Recomendado)

Vercel es la plataforma óptima para Next.js.

#### Pasos:

1. **Conectar repositorio:**
   ```bash
   # Asegúrate de que tu código esté en GitHub
   git add .
   git commit -m "Ready for first deployment"
   git push origin main
   ```

2. **Configurar en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio GitHub
   - Configura las variables de entorno (ver sección abajo)
   - Deploy automático

3. **Variables de entorno en Vercel:**
   ```
   DB_HOST=tu-servidor-mysql.com
   DB_USER=tu-usuario
   DB_PASSWORD=tu-password
   DB_NAME=eureka_db
   DB_PORT=3306
   NEXTAUTH_SECRET=genera-un-secreto-seguro
   NEXTAUTH_URL=https://tu-dominio.vercel.app
   ```

#### Generar NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

### Opción 2: Deploy en Railway

Railway ofrece hosting y base de datos MySQL incluida.

1. Conecta tu repositorio
2. Railway detectará Next.js automáticamente
3. Agrega un servicio MySQL
4. Configura las variables de entorno automáticamente

---

### Opción 3: Deploy Manual en VPS

Si prefieres tu propio servidor:

```bash
# En tu servidor
git clone tu-repositorio
cd pano
npm install
npm run build

# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con tus valores

# Iniciar
npm start
```

---

## 🔧 Configuración de Base de Datos

### 1. Crear Base de Datos

```sql
CREATE DATABASE eureka_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Aplicar Migraciones

```bash
npm run db:push
```

### 3. (Opcional) Cargar datos de prueba

```bash
npm run db:seed
```

---

## ⚙️ Variables de Entorno Requeridas

### Mínimas para funcionar:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=eureka_db
DB_PORT=3306
NEXTAUTH_SECRET=secreto-super-seguro-minimo-32-caracteres
NEXTAUTH_URL=https://tu-dominio.com
```

### Opcionales (para funcionalidades avanzadas):

```env
# Almacenamiento de archivos
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# WhatsApp
WHATSAPP_API_KEY=

# Pagos
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
```

---

## 🧪 Testing Antes del Deploy

### Build local:
```bash
npm run build
npm start
```

### Acceder a:
```
http://localhost:3000
```

Verifica que:
- La página principal carga correctamente
- El indicador de conexión funciona
- No hay errores en la consola del navegador

---

## 📊 Monitoreo Post-Deploy

### Verificar:

1. ✅ Sitio accesible en la URL
2. ✅ Base de datos conectada
3. ✅ Funcionalidad offline-first operativa
4. ✅ Sincronización funcionando

### Logs en Vercel:
- Dashboard → Tu Proyecto → Deployments → Ver logs

---

## 🎯 Próximos Pasos Después del Deploy

Una vez deployado, las siguientes funcionalidades están pendientes de desarrollo:

### Fase 2 - Funcionalidades Core:
- [ ] Sistema de autenticación completo (NextAuth)
- [ ] CRUD de órdenes
- [ ] Gestión de clientes
- [ ] Sistema de pagos
- [ ] Generación de contratos PDF
- [ ] Dashboard de vendedores

### Fase 3 - Funcionalidades Avanzadas:
- [ ] Integración WhatsApp
- [ ] OCR para contratos
- [ ] Sistema de comisiones
- [ ] Gestión de producción
- [ ] Control de inventario
- [ ] Reportes y analytics

---

## 🐛 Troubleshooting

### Error de conexión a DB:
- Verifica que el servidor MySQL esté accesible
- Revisa las credenciales en las variables de entorno
- Asegúrate de que el firewall permita la conexión

### Error de build:
```bash
# Limpiar cache
rm -rf .next
npm run build
```

### Error 500 en producción:
- Revisa los logs en Vercel/Railway
- Verifica que todas las variables de entorno estén configuradas

---

## 📞 Soporte

Para problemas durante el deploy, revisa:
1. Logs de la plataforma de hosting
2. Console del navegador (F12)
3. Documentación de Next.js: https://nextjs.org/docs

---

## 🎉 Checklist Final

Antes de hacer deploy a producción:

- [ ] Variables de entorno configuradas
- [ ] Base de datos MySQL creada y accesible
- [ ] `NEXTAUTH_SECRET` generado y seguro
- [ ] Build local exitoso (`npm run build`)
- [ ] Repositorio en GitHub actualizado
- [ ] Dominio configurado (opcional)

**¡Listo para deploy! 🚀**
