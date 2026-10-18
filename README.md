# Cafetería Origen

API REST desarrollada para la gestión de productos, pedidos y reportes de la cafetería Origen.

Proyecto realizado para la materia Programación IV de la Tecnicatura Universitaria en Programación.

## Tecnologías utilizadas

- Node.js
- TypeScript
- Express
- Jest
- Supertest

## Requisitos

Para ejecutar el proyecto es necesario tener instalado:

- Node.js
- npm

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor se ejecuta por defecto en:

`http://localhost:3000`

## Tests

Para ejecutar todos los tests:

```bash
npm test
```

Para ejecutar Jest en modo watch:

```bash
npm run test:watch
```

## Build

Para compilar el proyecto TypeScript:

```bash
npm run build
```

Para ejecutar la versión compilada:

```bash
npm start
```

## Estructura del proyecto

```text
src/
├── controllers/
├── data/
├── middleware/
├── models/
├── routes/
├── services/
├── app.ts
└── server.ts

tests/
├── integration/
└── unit/
```

- `app.ts`: configuración de la aplicación Express y registro de endpoints.
- `server.ts`: inicio del servidor.
- `data/`: datos y catálogo de productos.
- `models/`: modelos del dominio.
- `services/`: lógica de negocio.
- `middleware/`: middlewares comunes de la aplicación.
- `controllers/` y `routes/`: estructura destinada a controladores y rutas de la API.
- `tests/unit/`: tests unitarios.
- `tests/integration/`: tests de integración y endpoints.

## API

> **Estado:** En desarrollo.

La API cuenta con endpoints para la gestión de productos y contará con endpoints para pedidos y reportes a medida que avance el desarrollo.

### Productos

| Método | Endpoint | Descripción | Estado |
|---|---|---|---|
| GET | `/productos` | Obtener todos los productos | Implementado |
| GET | `/productos/:id` | Obtener un producto por ID | Implementado |

### Pedidos

| Método | Endpoint | Descripción | Estado |
|---|---|---|---|
| POST | `/pedidos` | Crear un nuevo pedido | En desarrollo |
| GET | `/pedidos` | Obtener todos los pedidos | En desarrollo |
| GET | `/pedidos/:id` | Obtener un pedido por ID | En desarrollo |

### Reportes

| Método | Endpoint | Descripción | Estado |
|---|---|---|---|
| GET | `/reportes/facturacion` | Obtener la facturación total | En desarrollo |
| GET | `/reportes/mas-vendido` | Obtener el producto más vendido | En desarrollo |

## Ejemplos de requests

Los siguientes ejemplos utilizan `curl` y asumen que el servidor está ejecutándose en `http://localhost:3000`.

### Obtener todos los productos

```bash
curl http://localhost:3000/productos
```

### Obtener un producto por ID

```bash
curl http://localhost:3000/productos/1
```

### Pedidos y reportes

Los ejemplos de requests para pedidos y reportes se agregarán una vez que sus endpoints estén implementados e integrados.

## Integrantes

- Homero
- Matías
- Nicolás
- Federico