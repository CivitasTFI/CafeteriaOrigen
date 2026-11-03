# Cafetería Origen

Proyecto del Grupo 14 para Programación IV de la Tecnicatura Universitaria en Programación, UTN FRBB.

| Integrante | Legajo |
| --- | --- |
| Homero Colombo | 23086 |
| Matías Oviedo | 22737 |
| Nicolás Espulef | 22901 |
| Federico Heinrich | 21317 |

La API del Parcial I está en `backend/`. En `frontend/` está la base de React y TypeScript para el TP3. La pantalla inicial muestra el nombre de la cafetería; las funcionalidades del menú todavía están pendientes.

## Documentación

Toda la documentación del proyecto se mantiene en esta carpeta principal.

| Documento | Contenido |
| --- | --- |
| [README.md](README.md) | Instalación, comandos generales y API actual del backend. |
| [FRONTEND.md](FRONTEND.md) | Configuraciones, estructura, pruebas, TDD y preparación del frontend. |
| [planificacion.md](planificacion.md) | Reparto del TP3, dependencias, avances y tareas pendientes. |
| [TP3.pdf](TP3.pdf) | Consigna del trabajo. |
| [Reparto del Parcial I](<Reparto del trabajo – Cafetería Origen (Parcial I).md>) | Referencia histórica. El reparto vigente para TP3 está en la planificación. |

## Requisitos

- Node.js compatible con `^20.19.0 || >=22.12.0`, como declara el proyecto.
- pnpm (recomendado: `corepack enable` y la versión indicada en `packageManager` del `package.json` raíz).
- Git para trabajar con las ramas y conservar el historial de TDD.

La base se verificó con Node.js 20.20.2 y pnpm 10.

## Instalación

Desde la raíz de `CafeteriaOrigen/`:

```bash
pnpm install
```

También podés usar `pnpm run install:all` (equivale a `pnpm install`). El monorepo usa `pnpm-workspace.yaml` con `backend/` y `frontend/`; el lockfile único es `pnpm-lock.yaml` en la raíz. Los `node_modules/` no se versionan.

Para instalar dependencias de un paquete desde la raíz:

```bash
pnpm --dir backend install
pnpm --dir frontend install
```

## Desarrollo

Desde la raíz, abrir dos terminales.

Primera terminal, API:

```bash
pnpm run dev:backend
```

Segunda terminal, frontend:

```bash
pnpm run dev:frontend
```

| Aplicación | Dirección predeterminada |
| --- | --- |
| Backend Express | `http://localhost:3000` |
| Frontend Vite | `http://localhost:5173` |

Vite muestra en la terminal la dirección efectiva si el puerto predeterminado está ocupado.

El proxy de desarrollo envía `/productos` y `/pedidos`, incluidas sus subrutas, a `http://localhost:3000`, conservando la ruta. Por ejemplo, `http://localhost:5173/productos/1` llega a la API como `http://localhost:3000/productos/1`. Las rutas `/reportes` no están incluidas en el proxy: se consultan directamente en el backend.

El backend admite cambiar su puerto mediante `PORT`. Si se cambia, también se debe ajustar el destino del proxy en `frontend/vite.config.ts`. No hay configuración de despliegue o proxy de producción en esta etapa.

## Comandos desde la raíz

| Comando | Función |
| --- | --- |
| `pnpm install` | Instalar backend y frontend (workspace). |
| `pnpm run dev:backend` | Iniciar la API con recarga en desarrollo. |
| `pnpm run dev:frontend` | Iniciar Vite. |
| `pnpm test` | Ejecutar primero Jest en backend y después Vitest en frontend. |
| `pnpm run test:backend` | Ejecutar únicamente las pruebas del backend, en serie. |
| `pnpm run test:frontend` | Ejecutar únicamente las pruebas del frontend. |
| `pnpm run test:watch:backend` | Ejecutar Jest en modo watch. |
| `pnpm run test:watch:frontend` | Ejecutar Vitest en modo watch. |
| `pnpm run build` | Compilar backend y frontend; incluye la verificación de tipos de los tests del frontend. |
| `pnpm run build:backend` | Compilar únicamente el backend. |
| `pnpm run build:frontend` | Verificar tipos y compilar únicamente el frontend. |
| `pnpm run lint` | Revisar el frontend con ESLint. |

Para ejecutar un test específico del frontend desde la raíz:

```bash
pnpm run test:frontend -- src/test/components/App.test.tsx
```

Desde `frontend/` también se puede usar `pnpm test -- src/test/components/App.test.tsx`.

Las pruebas normales no requieren servidores externos levantados. La prueba del proxy abre y cierra su propio servidor Vite temporal en un puerto libre y simula la API con MSW.

`pnpm run test:e2e` todavía no está implementado. Se integrará con la configuración de Playwright de Federico.

## Compilación y ejecución del resultado

```bash
pnpm run build
```

Para ejecutar el backend compilado desde la raíz:

```bash
pnpm --dir backend start
```

Para inspeccionar la compilación del frontend:

```bash
pnpm --dir frontend preview
```

El comando de preview sirve el frontend compilado y, en esta versión de Vite, hereda el proxy local si no se configura otro para preview. Para consultar la API también necesita el backend en el puerto configurado. Esto no constituye una configuración de despliegue: el acceso a la API en producción deberá resolverse al prepararlo.

## Estado de la base

La última verificación de la infraestructura registró:

| Área | Resultado |
| --- | --- |
| Backend | 9 suites y 38 tests de Jest/Supertest. |
| Frontend | 4 archivos y 7 tests de infraestructura con Vitest. |
| Compilación | Backend y frontend compilados; tipos de tests y configuración de Vitest incluidos. |
| Lint | Frontend sin errores de ESLint. |

Estas pruebas verifican la base técnica. La carga del menú, el cliente HTTP con Zod, el selector, el carrito, los pedidos desde la interfaz, los estilos compartidos y los E2E todavía deben implementarse.

El backend conserva el contrato del Parcial I descrito debajo. Las ampliaciones propuestas para TP3, como `tipo`, `mesaId`, estado predeterminado y reset/seed, están pendientes y se detallan en [la planificación](planificacion.md).

## Estructura general

```text
CafeteriaOrigen/
├── backend/             # API, configuraciones, dependencias y pruebas de Jest
├── frontend/            # Base React, configuraciones y pruebas de Vitest
├── package.json         # Comandos generales; sin dependencias propias
├── pnpm-workspace.yaml  # Monorepo backend + frontend
├── pnpm-lock.yaml       # Lockfile único del workspace
├── README.md            # Entrada y documentación del backend actual
├── FRONTEND.md          # Guía principal del frontend y sus pruebas
├── planificacion.md     # Reparto y estado del TP3
├── Reparto del trabajo – Cafetería Origen (Parcial I).md
├── TP3.pdf
├── LICENSE
└── .gitignore
```

La organización interna del backend se mantiene en `src/controllers/`, `data/`, `middleware/`, `models/`, `routes/` y `services/`; sus pruebas están en `backend/tests/unit/` e `integration/`. `backend/src/app.ts` configura Express y `server.ts` inicia el servidor.

## API

La API permite consultar productos, crear y consultar pedidos y obtener reportes de ventas.

### Contrato disponible actualmente

- `GET /productos` devuelve un arreglo de objetos con `id`, `nombre` y `precio`; `GET /productos/:id` devuelve un objeto con esos campos. El precio se obtiene de `calcularPrecio()` en el dominio.
- `POST /pedidos` recibe `items: [{ productoId, cantidad }]` y `estado`. Los ejemplos envían `"pendiente"` explícitamente: todavía no existe un estado predeterminado en el servicio.
- Una creación válida responde 201 con `{ mensaje, pedido }`. `pedido` incluye `id`, `items`, `estado` y `total` calculado por la API.
- `GET /pedidos` devuelve un arreglo de pedidos y `GET /pedidos/:id` un pedido directo, sin el envoltorio de creación.
- Los pedidos se almacenan en memoria y se pierden al reiniciar el servidor.
- Los errores previstos usan `{ "error": "mensaje" }`. El manejo de JSON malformado todavía debe corregirse para responder 400 en lugar de 500.

Por ejemplo, crear un pedido con el producto 1, cantidad 2 y estado `pendiente` devuelve actualmente un total de `10040`:

```json
{
  "mensaje": "El pedido se guardó correctamente",
  "pedido": {
    "id": 1,
    "items": [{ "productoId": 1, "cantidad": 2 }],
    "estado": "pendiente",
    "total": 10040
  }
}
```

El ID del ejemplo supone que es el primer pedido desde el inicio del servidor. `mesaId`, los metadatos ampliados de productos y las rutas HTTP de reset/seed todavía no están implementados. El ejemplo de la mesa 4 de la consigna pertenece al contrato objetivo de TP3, no al contrato disponible en esta base.

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
