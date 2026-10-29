# Cafetería Origen

## Grupo 14

## Integrantes

- Homero Colombo | Legajo: 23086
- Matías Oviedo | Legajo: 22737
- Nicolás Espulef | Legajo: 22901
- Federico Heinrich | Legajo: 21317

API REST desarrollada para la gestión de productos, pedidos y reportes de la cafetería Origen.

El backend está en `backend/`. La carpeta `frontend/` está vacía, reservada para la aplicación del TP3. La documentación general y la consigna se mantienen en la raíz.

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

Clonar el repositorio y, desde su raíz, instalar las dependencias del backend:

```bash
cd backend
npm ci
```

Los comandos de ejecución, pruebas y compilación de las siguientes secciones se ejecutan desde `backend/`. Sus dependencias se instalan en `backend/node_modules/`, que no se versiona. Cuando se inicialice el frontend, tendrá su propio `package.json` y sus dependencias.

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
backend/
├── src/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── integration/
│   └── unit/
├── jest.config.js
├── package.json
├── package-lock.json
└── tsconfig.json
frontend/               # Vacía, reservada para el TP3
.gitignore
LICENSE
README.md
planificacion.md
Reparto del trabajo – Cafetería Origen (Parcial I).md
TP3.pdf
```

Las rutas descritas a continuación son relativas a `backend/`.

- `controllers/`: manejo de requests y responses de la API.
- `data/`: datos y almacenamiento en memoria.
- `middleware/`: middlewares comunes de la aplicación.
- `models/`: modelos del dominio.
- `routes/`: definición y agrupación de los endpoints de la API.
- `services/`: lógica de negocio.
- `app.ts`: configuración de la aplicación Express y registro de las rutas.
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
| GET | `/pedidos` | Obtener todos los pedidos con sus totales |
| GET | `/pedidos/:id` | Obtener un pedido por ID con su total |

### Reportes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/reportes/facturacion` | Obtener la facturación total |
| GET | `/reportes/mas-vendido` | Obtener el producto más vendido |

## Ejemplos de requests

Con el servidor ejecutándose en `http://localhost:3000`.

### Bash / Git Bash

#### Obtener todos los productos

```bash
curl http://localhost:3000/productos
```

#### Obtener un producto por ID

```bash
curl http://localhost:3000/productos/1
```

#### Crear un pedido

```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productoId":1,"cantidad":2}],"estado":"pendiente"}'
```

#### Obtener todos los pedidos

```bash
curl http://localhost:3000/pedidos
```

#### Obtener un pedido por ID

```bash
curl http://localhost:3000/pedidos/1
```

#### Obtener facturación total

```bash
curl http://localhost:3000/reportes/facturacion
```

#### Obtener producto más vendido

```bash
curl http://localhost:3000/reportes/mas-vendido
```

## Ejemplos en PowerShell

En PowerShell se puede utilizar `Invoke-RestMethod` para realizar las mismas requests.

### Obtener todos los productos

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:3000/productos" `
    -Method Get
```

### Obtener un producto por ID

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:3000/productos/1" `
    -Method Get
```

### Crear un pedido

```powershell
$body = @{
    items = @(
        @{
            productoId = 1
            cantidad = 2
        }
    )
    estado = "pendiente"
} | ConvertTo-Json -Depth 3

Invoke-RestMethod `
    -Uri "http://localhost:3000/pedidos" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### Obtener todos los pedidos

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:3000/pedidos" `
    -Method Get
```

### Obtener un pedido por ID

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:3000/pedidos/1" `
    -Method Get
```

### Obtener facturación total

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:3000/reportes/facturacion" `
    -Method Get
```

### Obtener producto más vendido

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:3000/reportes/mas-vendido" `
    -Method Get
```
