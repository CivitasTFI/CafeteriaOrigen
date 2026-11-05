# Cafetería Origen

Proyecto del Grupo 14 para Programación IV de la Tecnicatura Universitaria en Programación, UTN FRBB.

| Integrante | Legajo |
| --- | --- |
| Homero Colombo | 23086 |
| Matías Oviedo | 22737 |
| Nicolás Espulef | 22901 |
| Federico Heinrich | 21317 |

La API del Parcial I está en `backend/`. El frontend de React y TypeScript ya carga los productos de la API, valida la respuesta con Zod y muestra sus nombres, un indicador de carga o un error con reintento. También están implementados el Context y reducer del carrito, los subtotales orientativos y el formato de precios, todavía sin integrar en la pantalla. La selección de café, pastelería, interfaz del carrito y pedidos siguen pendientes.

Estado verificado el **5 de noviembre de 2026**, hasta el PR #17: **44 tests de backend y 73 de frontend aprobados**. La compilación del frontend y lint tienen problemas de integración del carrito, detallados en [Estado de la base](#estado-de-la-base).

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
- npm.
- Git para trabajar con las ramas y conservar el historial de TDD.

La base se verificó con Node.js 20.20.2 y npm 10.8.2.

## Instalación

Desde la raíz de `CafeteriaOrigen/`:

```bash
npm run install:all
```

El comando ejecuta `npm ci` en backend y frontend, utilizando el lockfile de cada aplicación. Cada una conserva su propio `node_modules/`, que no se versiona.

El `package.json` raíz agrupa comandos y no declara dependencias ni workspaces. No hace falta instalar paquetes en la raíz. Para instalar solo una aplicación:

```bash
npm --prefix backend ci
npm --prefix frontend ci
```

## Desarrollo

Desde la raíz, abrir dos terminales.

Primera terminal, API:

```bash
npm run dev:backend
```

Segunda terminal, frontend:

```bash
npm run dev:frontend
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
| `npm run install:all` | Instalar backend y frontend desde sus lockfiles. |
| `npm run dev:backend` | Iniciar la API con recarga en desarrollo. |
| `npm run dev:frontend` | Iniciar Vite. |
| `npm test` | Ejecutar primero Jest en backend y después Vitest en frontend. |
| `npm run test:backend` | Ejecutar únicamente las pruebas del backend, en serie. |
| `npm run test:frontend` | Ejecutar únicamente las pruebas del frontend. |
| `npm run test:watch:backend` | Ejecutar Jest en modo watch. |
| `npm run test:watch:frontend` | Ejecutar Vitest en modo watch. |
| `npm run build` | Compilar backend y frontend; incluye la verificación de tipos de los tests del frontend. |
| `npm run build:backend` | Compilar únicamente el backend. |
| `npm run build:frontend` | Verificar tipos y compilar únicamente el frontend. |
| `npm run lint` | Revisar el frontend con ESLint. |

Para ejecutar un test específico del frontend desde la raíz:

```bash
npm run test:frontend -- src/test/components/App.test.tsx
```

Desde `frontend/` también se puede usar `npm test -- src/test/components/App.test.tsx`.

Para verificar los últimos avances desde la raíz:

```bash
npm --prefix backend test -- --runInBand tests/integration/app.test.ts
npm --prefix backend test -- --runInBand tests/unit/buscar-producto.test.ts
npm run test:frontend -- src/test/unit/esquemas.test.ts
npm run test:frontend -- src/test/integration/cliente.test.ts
npm run test:frontend -- src/test/integration/respuestas.test.ts
npm run test:frontend -- src/test/integration/handlersErrores.test.ts
npm --prefix backend test -- --runInBand tests/unit/formar-respuesta.test.ts
npm run test:frontend -- src/test/unit/productos.esquemas.test.ts
npm run test:frontend -- src/test/integration/handlersProductos.test.ts
npm run test:frontend -- src/test/integration/productos.test.ts
npm run test:frontend -- src/test/integration/menu.test.tsx
npm run test:frontend -- src/test/unit/carrito.reducer.test.ts
npm run test:frontend -- src/test/integration/carrito.context.test.tsx
npm run test:frontend -- src/test/unit/subtotalCarrito.test.ts
npm run test:frontend -- src/test/unit/formatoPrecio.test.ts
```

Las pruebas normales no requieren servidores externos levantados. La prueba del proxy abre y cierra su propio servidor Vite temporal en un puerto libre y simula la API con MSW.

`npm run test:e2e` todavía no está implementado. Se integrará con la configuración de Playwright de Federico.

## Compilación y ejecución del resultado

```bash
npm run build
```

Para ejecutar el backend compilado desde la raíz:

```bash
npm --prefix backend start
```

Para inspeccionar la compilación del frontend:

```bash
npm --prefix frontend run preview
```

El comando de preview sirve el frontend compilado y, en esta versión de Vite, hereda el proxy local si no se configura otro para preview. Para consultar la API también necesita el backend en el puerto configurado. Esto no constituye una configuración de despliegue: el acceso a la API en producción deberá resolverse al prepararlo.

## Estado de la base

La verificación del **5 de noviembre de 2026**, con los avances integrados hasta el PR #17 (`b99c703`), registró:

| Área | Resultado |
| --- | --- |
| Backend | 11 suites y 44 tests de Jest/Supertest aprobados. Compilación correcta. |
| Frontend | 16 archivos y 73 tests de Vitest aprobados. Incluyen productos, menú y lógica del carrito. |
| Compilación del frontend | Falla con TS2305: el carrito importa `Producto`, pero el módulo de esquemas exporta `ProductoBase` y `ProductosBase`. |
| Lint | Falla `react-refresh/only-export-components` en `CarritoContext.tsx`, por exportar el Context y el proveedor desde el mismo archivo. |

`npm test` pasa porque ejecuta Jest y Vitest; no sustituye la comprobación estática de `npm run build`. El tipo faltante afecta al reducer, al Context y a dos archivos de pruebas. Homero y Federico deben alinear el contrato del carrito con el esquema disponible y separar las exportaciones del Context y el proveedor. Estos problemas se registran aquí; esta actualización documental no modifica código.

Los avances integrados en `develop` incluyen:

- [x] Base de frontend, infraestructura de pruebas, proxy y comandos raíz.
- [x] JSON malformado devuelve 400 con `{ error }`; errores internos conservan 500.
- [x] Esquema Zod de errores `{ error: string }` y tipo `ErrorApi` derivado con `z.infer`.
- [x] Base `solicitarJson()` que valida errores HTTP y conserva el mensaje de la API, probada con 400, 404 y 500.
- [x] Mensajes claros ante errores de contrato, respuestas HTML, JSON incompleto, cuerpos vacíos y fallos de conexión.
- [x] `solicitarValidado()` valida respuestas exitosas con el esquema recibido y devuelve su tipo inferido.
- [x] Fixtures `erroresApi` y handler reutilizable `crearHandlerError()` para GET/POST, con cuatro escenarios probados.
- [x] Refactores separados para interpretación de errores, petición HTTP y preparación de pruebas con MSW.
- [x] Campos internos de clasificación de productos y servicio de búsqueda con tres tests de backend.
- [x] Homero, PR #14: esquemas Zod del producto y listado actuales, `listarProductos()`, fixture y handler compartidos de productos; 18 tests nuevos.
- [x] Matias, PR #15: normalización y armado interno de respuestas de café/pastelería, descripciones de los tres orígenes y dos tests unitarios de respuestas de café.
- [x] Federico, PR #16: reducer, `CarritoProvider`, `useCarrito`, subtotales y formato de precios; 13 tests nuevos. Los ticks de F1 ya estaban incorporados en ese merge.
- [x] Homero, PR #17: `MenuPage` integrada en `App`, hook `useMenu`, mensajes accesibles y reintento; seis tests del menú y uno nuevo de integración en `App`.

`listarProductos()` usa `solicitarValidado()` con `esquemaProductosBase`: valida `id` entero positivo, `nombre` textual y `precio` numérico no negativo. La pantalla muestra los nombres recibidos; no implementa todavía el selector ni los botones de agregar. El contrato ampliado de productos, los esquemas y funciones de pedidos, la integración visual del carrito, Bootstrap/SASS y los E2E siguen pendientes. Los ticks detallados por integrante están en [planificacion.md](planificacion.md).

Los endpoints del backend conservan el contrato del Parcial I descrito debajo. El servicio de respuestas de Matias todavía no está conectado a los controladores: los campos nuevos y las descripciones no se exponen por HTTP. También faltan `mesaId`, estado predeterminado y reset/seed. La instalación limpia y el arranque conjunto siguen pendientes de registro.

## Estructura general

```text
CafeteriaOrigen/
├── backend/             # API, configuraciones, dependencias y pruebas de Jest
├── frontend/            # React, carga del menú, lógica del carrito y pruebas
├── package.json         # Comandos generales; sin dependencias propias
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
- Los errores previstos usan `{ "error": "mensaje" }`. Un cuerpo JSON malformado responde 400 con `{ "error": "El cuerpo de la solicitud contiene JSON inválido" }`. Los errores internos responden 500 con `{ "error": "Error interno del servidor" }`.

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

El ID del ejemplo supone que es el primer pedido desde el inicio del servidor. `mesaId`, los campos de tipo, tamaño y origen en el JSON de productos y las rutas HTTP de reset/seed todavía no están implementados. El ejemplo de la mesa 4 de la consigna pertenece al contrato objetivo de TP3, no al contrato disponible en esta base.

### Búsqueda interna de productos

Los modelos ya disponen de `tipo` (`cafe` o `pasteleria`) y, para cafés, `tipoCafe`, `tamaño` y `variedad`. `backend/src/services/buscar-producto.service.ts` permite filtrar el catálogo por esos parámetros opcionales; devuelve los productos encontrados o el texto `Producto no encontrado` si no hay coincidencias.

Este buscador tiene tres pruebas unitarias y no está conectado a rutas. El PR #15 agrega además `backend/src/services/formar-respuesta.service.ts`, con descripciones y funciones para preparar respuestas. Ninguno de estos servicios modifica aún el JSON de `GET /productos` o `GET /productos/:id`.

### Respuestas ampliadas preparadas por Matias (todavía internas)

| Función | Responsabilidad |
| --- | --- |
| `normalizarInput(producto)` | Lee los campos del modelo, calcula el precio del dominio y agrega la descripción del origen para los cafés. |
| `formarRespuestaObjeto(productoNormalizado)` | Construye la representación de un producto normalizado. |
| `formarRespuestaArray(productosNormalizados)` | Construye las representaciones de una lista normalizada. |

Por ejemplo, para el producto 1, las funciones internas generan este objeto; **no es todavía la respuesta del endpoint**:

```json
{
  "id": 1,
  "nombre": "Expreso Pocillo Brasil",
  "tipo": "cafe",
  "tipoCafe": "expreso",
  "tamaño": "pocillo",
  "variedad": {
    "nombre": "brasil",
    "descripcion": "Acidez media, cuerpo equilibrado, notas citricas y florales"
  },
  "precio": 5020
}
```

Para pastelería, el servicio conserva `tipo: "pasteleria"` y `variedad` como texto; por ejemplo, `"muffin de chocolate"`. La descripción del café queda en `variedad.descripcion` y el origen en `variedad.nombre`. Los textos actuales están en el diccionario `variedadesDescripcion` del servicio:

| Origen | Descripción actual |
| --- | --- |
| `brasil` | Acidez media, cuerpo equilibrado, notas citricas y florales |
| `colombia` | Acidez muy viva, cuerpo ligero y notas frutales |
| `etiopia` | Acidez baja, cuerpo denso y notas de avellana |

La implementación usa `tipo: "cafe"` más `tipoCafe`, y el campo `tamaño` con ñ. Es diferente de la propuesta anterior `tipo: "expreso"` y `tamanio`; hay que acordar la representación HTTP y adaptar Zod/MSW antes de consumirla. El PDF permite variar los nombres de campos conservando la información. M1 todavía requiere conectar ambos endpoints y probar cafés y pastelería, los campos nuevos, los precios y el 404. Las dos pruebas nuevas cubren un café y un arreglo de dos cafés; no certifican la integración HTTP ni la rama de pastelería.

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
