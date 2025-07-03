# Documentación Completa de la API

## Descripción General

API RESTful para la gestión de artículos, usuarios, roles y logs en un sistema de inventario. Incluye autenticación JWT, validaciones, control de acceso y registro de acciones.

## Estructura de Carpetas

```
/controllers      # Lógica de negocio
/models           # Acceso a datos y lógica de base de datos
/validators       # Esquemas de validación (Joi)
/middleware       # Middlewares personalizados
/routes           # Definición de rutas Express
/utils            # Utilidades (ej. impresión de etiquetas)
/config           # Configuración de la base de datos
```

## Instalación

1. Clona el repositorio.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env`:
   ```
   JWT_SECRET=tu_clave_secreta
   NODE_ENV=development
   DB_HOST=...
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=...
   ```

## Autenticación

- **Endpoint:** `POST /api/auth/login`
- **Body de ejemplo:**
  ```json
  {
    "correo": "usuario@ejemplo.com",
    "contrasena": "123456"
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Errores posibles:**
  - Usuario no encontrado
  - Contraseña incorrecta

## Artículos

### Listar artículos

- **GET /api/articulos**
- **Parámetros de consulta:**
  - `page` (opcional)
  - `limit` (opcional)
  - `search` (opcional)
- **Respuesta de ejemplo:**
  ```json
  {
    "success": true,
    "message": "Artículos obtenidos exitosamente",
    "data": [
      {
        "ID": 1,
        "SKU": "12345",
        "Descripcion": "Camiseta",
        "UnitCode": "PZA",
        "GroupCode": "ROPA",
        "FamilyCode": "HOMBRE",
        "KindCode": "CASUAL",
        "ColorCode": "AZUL",
        "Size": "M",
        "UPCCode": "000123456789",
        "QuantityPerLU": 10,
        "Eliminado": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
  ```

### Obtener artículo por ID

- **GET /api/articulos/:id**
- **Respuesta de ejemplo:**
  ```json
  {
    "success": true,
    "message": "Artículo encontrado",
    "data": {
      "ID": 1,
      "SKU": "12345",
      "Descripcion": "Camiseta",
      "UnitCode": "PZA",
      "GroupCode": "ROPA",
      "FamilyCode": "HOMBRE",
      "KindCode": "CASUAL",
      "ColorCode": "AZUL",
      "Size": "M",
      "UPCCode": "000123456789",
      "QuantityPerLU": 10,
      "Eliminado": false
    }
  }
  ```

### Crear artículo

- **POST /api/articulos**
- **Body de ejemplo:**
  ```json
  {
    "SKU": "12345",
    "Descripcion": "Camiseta",
    "UnitCode": "PZA",
    "GroupCode": "ROPA",
    "FamilyCode": "HOMBRE",
    "KindCode": "CASUAL",
    "ColorCode": "AZUL",
    "Size": "M",
    "UPCCode": "000123456789",
    "QuantityPerLU": 10
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "message": "Artículo creado exitosamente",
    "data": {
      "ID": 2,
      "SKU": "12345",
      "Descripcion": "Camiseta",
      "UnitCode": "PZA",
      "GroupCode": "ROPA",
      "FamilyCode": "HOMBRE",
      "KindCode": "CASUAL",
      "ColorCode": "AZUL",
      "Size": "M",
      "UPCCode": "000123456789",
      "QuantityPerLU": 10,
      "Eliminado": false
    }
  }
  ```
- **Errores posibles:**
  - Ya existe un artículo con ese ID
  - Datos de entrada inválidos

### Actualizar artículo

- **PUT /api/articulos/:id**
- **Body de ejemplo:**
  ```json
  {
    "Descripcion": "Camiseta actualizada",
    "ColorCode": "ROJO"
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "message": "Artículo actualizado exitosamente",
    "data": {
      "ID": 2,
      "SKU": "12345",
      "Descripcion": "Camiseta actualizada",
      "ColorCode": "ROJO"
    }
  }
  ```

### Eliminar artículo (lógico)

- **DELETE /api/articulos/:id**
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "message": "Artículo eliminado exitosamente",
    "data": {
      "ID": 2,
      "Eliminado": true
    }
  }
  ```

### Restaurar artículo

- **PATCH /api/articulos/:id/restore**
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "message": "Artículo restaurado exitosamente",
    "data": {
      "ID": 2,
      "Eliminado": false
    }
  }
  ```

### Búsqueda avanzada

- **POST /api/articulos/search**
- **Body de ejemplo:**
  ```json
  {
    "SKU": "12345",
    "Descripcion": "Camiseta"
  }
  ```
- **Respuesta de ejemplo:**
  ```json
  {
    "success": true,
    "message": "Búsqueda completada",
    "count": 1,
    "data": [
      {
        "ID": 2,
        "SKU": "12345",
        "Descripcion": "Camiseta"
      }
    ]
  }
  ```

### Imprimir etiquetas

- **POST /api/articulos/print-labels**
- **Body de ejemplo:**
  ```json
  {
    "sku": "12345",
    "descripcion": "Camiseta",
    "color": "AZUL",
    "size": "M",
    "qty": 10,
    "cantidad": 2
  }
  ```
- **Respuesta de ejemplo:**
  ```json
  {
    "success": true,
    "message": "Etiquetas generadas exitosamente",
    "etiquetas": [
      {
        "sku": "12345",
        "descripcion": "Camiseta",
        "color": "AZUL",
        "size": "M",
        "qty": 10,
        "fecha": "2025-07-03",
        "codigo": "2025-07-03$12345$10",
        "qr": "2025-07-03$12345$10"
      }
    ]
  }
  ```

## Usuarios

### Listar usuarios

- **GET /api/usuarios**
- **Respuesta de ejemplo:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "nombre": "Juan Pérez",
        "correo": "juan@ejemplo.com",
        "rol_id": 2,
        "estado": 1
      }
    ]
  }
  ```

### Obtener usuario por ID

- **GET /api/usuarios/:id**
- **Respuesta de ejemplo:**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "nombre": "Juan Pérez",
      "correo": "juan@ejemplo.com",
      "rol_id": 2,
      "estado": 1
    }
  }
  ```

### Crear usuario

- **POST /api/usuarios**
- **Body de ejemplo:**
  ```json
  {
    "nombre": "Ana López",
    "correo": "ana@ejemplo.com",
    "contrasena": "secreto123",
    "rol_id": 2
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "nombre": "Ana López",
      "correo": "ana@ejemplo.com",
      "rol_id": 2,
      "estado": 1
    }
  }
  ```
- **Errores posibles:**
  - El correo electrónico ya está registrado
  - El rol especificado no existe

### Actualizar usuario

- **PUT /api/usuarios/:id**
- **Body de ejemplo:**
  ```json
  {
    "nombre": "Ana L. López"
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "nombre": "Ana L. López"
    }
  }
  ```

### Desactivar/activar usuario

- **DELETE /api/usuarios/:id**
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "estado": 0
    }
  }
  ```

## Roles

### Listar roles

- **GET /api/roles**
- **Respuesta de ejemplo:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "nombre": "Administrador",
        "descripcion": "Acceso total"
      }
    ]
  }
  ```

### Obtener rol por ID

- **GET /api/roles/:id**
- **Respuesta de ejemplo:**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "nombre": "Administrador",
      "descripcion": "Acceso total"
    }
  }
  ```

### Crear rol

- **POST /api/roles**
- **Body de ejemplo:**
  ```json
  {
    "nombre": "Operador",
    "descripcion": "Acceso limitado"
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "nombre": "Operador",
      "descripcion": "Acceso limitado"
    }
  }
  ```

### Actualizar rol

- **PUT /api/roles/:id**
- **Body de ejemplo:**
  ```json
  {
    "nombre": "Operador Senior"
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "nombre": "Operador Senior"
    }
  }
  ```

### Eliminar rol

- **DELETE /api/roles/:id**
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "nombre": "Operador Senior"
    }
  }
  ```

## Logs

### Listar logs

- **GET /api/logs**
- **Respuesta de ejemplo:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "usuario_id": 2,
        "accion": "POST /api/articulos",
        "fecha": "2025-07-03T09:00:00Z"
      }
    ]
  }
  ```

### Obtener log por ID

- **GET /api/logs/:id**
- **Respuesta de ejemplo:**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "usuario_id": 2,
      "accion": "POST /api/articulos",
      "fecha": "2025-07-03T09:00:00Z"
    }
  }
  ```

### Crear log manualmente

- **POST /api/logs**
- **Body de ejemplo:**
  ```json
  {
    "usuario_id": 2,
    "accion": "POST /api/articulos"
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "usuario_id": 2,
      "accion": "POST /api/articulos",
      "fecha": "2025-07-03T09:05:00Z"
    }
  }
  ```

### Eliminar log

- **DELETE /api/logs/:id**
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "usuario_id": 2,
      "accion": "POST /api/articulos",
      "fecha": "2025-07-03T09:05:00Z"
    }
  }
  ```

## Seguridad y Validaciones

- **JWT:** Todos los endpoints (excepto `/auth/login`) requieren autenticación con token JWT.
- **Middleware:** `authWithLog` verifica el token y registra la acción.
- **Validaciones:** Uso de Joi para validar datos de entrada.

## Ejemplo de Respuesta de Error

```json
{
  "success": false,
  "message": "Datos de entrada inválidos",
  "errors": [
    "El campo SKU es requerido",
    "El campo Descripcion debe ser una cadena"
  ]
}
```

## Recomendaciones

- Mantén seguras tus variables de entorno.
- No expongas el secreto JWT ni credenciales de base de datos.
- Prueba los endpoints con Postman o Insomnia.
