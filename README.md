# Cafetería Origen

## Grupo 14

## Integrantes

- Homero Colombo
- Matías Oviedo
- Nicolás Espulef
- Federico Heinrich

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

```text
http://localhost:3000
```

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
├── services/
├── app.ts
└── server.ts

tests/
├── integration/
└── unit/
```

- `controllers/`: manejo de requests y responses de la API.
- `data/`: datos y almacenamiento en memoria.
- `middleware/`: middlewares comunes de la aplicación.
- `models/`: modelos del dominio.
- `services/`: lógica de negocio.
- `app.ts`: configuración de la aplicación Express.
- `server.ts`: inicio del servidor.
- `tests/unit/`: tests unitarios.
- `tests/integration/`: tests de endpoints e integración entre funcionalidades.

## API

La API permite consultar productos, crear y consultar pedidos y obtener reportes de ventas.

### Productos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/productos` | Obtener todos los productos |
| GET | `/productos/:id` | Obtener un producto por ID |

### Pedidos

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/pedidos` | Crear un nuevo pedido y obtener su total |
| GET | `/pedidos` | Obtener todos los pedidos |
| GET | `/pedidos/:id` | Obtener un pedido por ID |

### Reportes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/reportes/facturacion` | Obtener la facturación total |
| GET | `/reportes/mas-vendido` | Obtener el producto más vendido |

## Ejemplos de requests

Con el servidor ejecutándose en `http://localhost:3000`:

### Obtener todos los productos

```bash
curl http://localhost:3000/productos
```

### Obtener un producto por ID

```bash
curl http://localhost:3000/productos/1
```

### Crear un pedido

```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productoId":1,"cantidad":2}],"estado":"pendiente"}'
```

### Obtener todos los pedidos

```bash
curl http://localhost:3000/pedidos
```

### Obtener un pedido por ID

```bash
curl http://localhost:3000/pedidos/1
```

### Obtener facturación total

```bash
curl http://localhost:3000/reportes/facturacion
```

### Obtener producto más vendido

```bash
curl http://localhost:3000/reportes/mas-vendido
```
