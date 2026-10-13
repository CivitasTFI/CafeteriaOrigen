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

```text
http://localhost:3000
```

## Tests

Para ejecutar los tests:

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
├── middleware/
│   ├── errorHandler.ts
│   └── notFound.ts
├── app.ts
└── server.ts

tests/
└── app.test.ts
```

- `app.ts`: configuración de la aplicación Express.
- `server.ts`: inicio del servidor.
- `middleware/`: middlewares comunes de la aplicación.
- `tests/`: tests automatizados.

## API

> **Estado:** En desarrollo.

La API contará con endpoints para la gestión de productos, pedidos y reportes. Los endpoints se irán habilitando a medida que avance el desarrollo.

### Productos

| Método | Endpoint | Descripción | Estado |
|---|---|---|---|
| GET | `/productos` | Obtener todos los productos | En desarrollo |
| GET | `/productos/:id` | Obtener un producto por ID | En desarrollo |

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

> Los siguientes requests corresponden a la API planificada y estarán disponibles a medida que se implementen los endpoints.

### Obtener todos los productos

```bash
curl http://localhost:3000/productos
```

### Obtener un producto por ID

```bash
curl http://localhost:3000/productos/1
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

El ejemplo de `POST /pedidos` se agregará cuando se defina e implemente el formato definitivo del cuerpo del pedido.

## Integrantes

- Homero
- Matías
- Nicolás
- Federico