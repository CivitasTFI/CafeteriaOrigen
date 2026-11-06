# Cafetería Origen

Proyecto del Grupo 14 para Programación IV de la Tecnicatura Universitaria en Programación, UTN FRBB.

| Integrante | Legajo |
| --- | --- |
| Homero Colombo | 23086 |
| Matías Oviedo | 22737 |
| Nicolás Espulef | 22901 |
| Federico Heinrich | 21317 |

La API del Parcial I está en `backend/` y ya expone los productos ampliados del TP3. En esta rama también permite pedidos con mesa del 1 al 8 o retiro en barra. El frontend carga los productos, los valida con Zod y muestra sus nombres, un indicador de carga o un error con reintento. `App` monta el proveedor y la interfaz del carrito, con cantidades, controles para sumar/restar/eliminar, subtotales orientativos y confirmación bloqueada en vacío. H2 permite crear y consultar pedidos sin mesa mediante funciones HTTP con respuestas validadas, fixtures y handlers compartidos; falta ampliarlo con `mesaId`. Playwright incorpora tres E2E iniciales con API real. Siguen pendientes el selector de café, la pastelería con botones de agregar y los pedidos desde la pantalla; el menú actual muestra nombres y el botón de confirmar todavía no envía pedidos.

Estado verificado el **6 de noviembre de 2026** en `feature/mesa-pedidos`, hasta `18911cd`, tras incorporar `develop` (`b520964`) mediante `be018cc`: **100 tests de backend y 156 de frontend aprobados (256 en total), más 3 E2E**, build completo y lint correctos. H2 ya está integrado en `develop` mediante el PR #28 y la preparación inicial de F3 mediante #26. N1, sus correcciones de compatibilidad y su cobertura están completos en esta rama; la [PR #27](https://github.com/CivitasTFI/CafeteriaOrigen/pull/27) todavía debe actualizarse e integrarse. La instalación limpia y el arranque conjunto conservan sus comprobaciones previas registradas debajo.

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

La verificación actual se ejecutó con Node.js 22.23.4 y npm 10.9.9. La inicialización anterior también se había comprobado con Node.js 20.20.2 y npm 10.8.2.

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
| `npm run test:e2e` | Ejecutar Playwright con Chromium, frontend y API reales; separado de `npm test`. |
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
npm run test:backend -- --runTestsByPath tests/integration/productos.endpoints.test.ts
npm run test:backend -- --runTestsByPath tests/integration/pedidos.limites.test.ts
npm run test:backend -- --runTestsByPath tests/integration/pedidos.estructura.test.ts
npm run test:backend -- --runTestsByPath tests/integration/pedidos.estado.test.ts
npm run test:backend -- --runTestsByPath tests/integration/pedidos.errores.test.ts
npm run test:backend -- --runTestsByPath tests/integration/pedidos.mesa.test.ts
npm run test:backend -- tests/unit/reportes.test.ts tests/integration/pedido-reportes.integration.test.ts
npm run test:frontend -- src/test/unit/esquemas.test.ts
npm run test:frontend -- src/test/integration/cliente.test.ts
npm run test:frontend -- src/test/integration/respuestas.test.ts
npm run test:frontend -- src/test/integration/handlersErrores.test.ts
npm --prefix backend test -- --runInBand tests/unit/formar-respuesta.test.ts
npm run test:frontend -- src/test/unit/productos.esquemas.test.ts
npm run test:frontend -- src/test/unit/productos.ampliados.esquemas.test.ts
npm run test:frontend -- src/test/integration/handlersProductos.test.ts
npm run test:frontend -- src/test/integration/productos.test.ts
npm run test:frontend -- src/test/integration/menu.test.tsx
npm run test:frontend -- src/test/unit/carrito.reducer.test.ts
npm run test:frontend -- src/test/integration/carrito.context.test.tsx
npm run test:frontend -- src/test/integration/app.carrito.test.tsx
npm run test:frontend -- src/test/components/Carrito.test.tsx
npm run test:frontend -- src/test/unit/subtotalCarrito.test.ts
npm run test:frontend -- src/test/unit/formatoPrecio.test.ts
npm run test:frontend -- src/test/unit/pedidos.esquemas.test.ts
npm run test:frontend -- src/test/integration/pedidos.api.test.ts
npm run test:frontend -- src/test/integration/handlersPedidos.test.ts
```

Los tres últimos archivos reúnen los **47 tests nuevos de H2**: 28 de esquemas, 17 del cliente de pedidos y dos de handlers compartidos. Para ejecutarlos juntos:

```bash
npm run test:frontend -- src/test/unit/pedidos.esquemas.test.ts src/test/integration/pedidos.api.test.ts src/test/integration/handlersPedidos.test.ts
```

Las pruebas normales no requieren servidores externos levantados. La prueba del proxy abre y cierra su propio servidor Vite temporal en un puerto libre y simula la API con MSW.

`npm run test:e2e` ejecuta Playwright con Chromium y servidores reales. Después de instalar las dependencias, instalar el navegador desde la raíz:

```powershell
Push-Location frontend
npx playwright install chromium
Pop-Location
```

Luego ejecutar desde la raíz:

```powershell
npm run test:e2e
```

Los puertos 3000 y 5173 deben estar libres. Playwright arranca y cierra ambos servidores, sin reutilizar otros existentes; la API se ejecuta con `NODE_ENV=test`. Las tres pruebas comprueban los 20 productos de la API real, ausencia de scroll horizontal en la pantalla actual a 375 × 812 y confirmación deshabilitada con carrito vacío. `npm test` sigue ejecutando solo Jest y Vitest. Reset/seed y el recorrido completo de compra siguen pendientes. Ver [FRONTEND.md](FRONTEND.md#pruebas-e2e-iniciales-f3).

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

La verificación del **6 de noviembre de 2026**, en `feature/mesa-pedidos` hasta `18911cd`, con `develop` incorporado hasta `b520964` (incluido el PR #28), registró:

| Área | Resultado |
| --- | --- |
| Backend | 16 suites y 100 tests de Jest/Supertest aprobados. Incluyen pedidos con mesa/barra, rechazos sin alterar datos y límites de facturación. Compilación correcta. |
| Frontend | 22 archivos y 156 tests de Vitest aprobados. Incluyen productos, menú, carrito y 47 casos nuevos de contratos, cliente y handlers de pedidos. |
| E2E iniciales | 3 casos de Playwright en `frontend/e2e/menu.spec.ts` aprobados con Chromium y servidores reales a 375 × 812. |
| Compilación del frontend | Correcta; comprueba los tipos de la aplicación, los tests y las configuraciones. |
| Lint | Sin errores. Context y proveedor están separados. |
| Instalación limpia | `npm run install:all` aprobado el 5 de noviembre: ambos paquetes instalados mediante `npm ci`. |
| Arranque conjunto | Comprobación previa del 6 de noviembre: scripts `dev:backend` y `dev:frontend` en 3000/5173; cliente real, Zod y proxy comprobados. Servidores propios cerrados al finalizar. |
| Auditoría de producción | Registro previo del 6 de noviembre, anterior a incorporar Playwright: 0 paquetes afectados en backend y frontend. |

El PR #20 resolvió el tipo `Producto` faltante, el import de tipos del reducer, los mocks incompatibles y las exportaciones que bloqueaban lint. El PR #23 agregó 12 tests de Federico y el PR #25 cuatro del carrito y tres de facturación. El PR #26 incorporó los tres E2E iniciales y #28 los 47 tests de H2. La rama de N1 suma cuatro unitarios de Nicolas y 13 casos HTTP de Homero: el backend pasa de 83 a 100 tests. `npm test` ejecuta ahora 256 casos de Jest/Vitest; `npm run test:e2e` ejecuta otros tres con servidores reales. La comprobación de tipos de aplicación, configuraciones y tests, incluidos los de Playwright, se verifica con `npm run build`. La compra completa, reset/seed y seguimiento desde la pantalla siguen pendientes.

La cobertura permanente del catálogo ahora incluye 22 casos HTTP: listado completo, detalle de los 20 IDs y 404. Un fixture independiente fija nombres, precios y metadatos esperados. Los tres tests del buscador comprueban también los IDs exactos de sus dos búsquedas exitosas.

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
- [x] Matias, PR #18: conexión del servicio ampliado a ambos endpoints de productos y actualización de sus tests, conservando el 404.
- [x] Homero, PR #20: unión discriminada Zod de café/pastelería, tipos inferidos, consulta y mocks ampliados, fixtures compartidos y corrección de tipos/lint; 19 tests nuevos.
- [x] Homero, PR #21: proveedor del carrito montado en `App` y un test que comprueba el estado compartido entre dos consumidores independientes.
- [x] Homero, PR #24: validaciones de pedidos, middleware, cobertura completa del catálogo, dependencias y comprobación de arranque conjunto de la primera etapa de `fix/correcciones-generales`.
- [x] Federico, PR #23: `Carrito` e `ItemCarrito` montados en App, controles accesibles, subtotales, bloqueo de confirmación en vacío y acción `VACIAR`; 12 tests nuevos. Las acciones reciben `ProductoBase`, el contrato común derivado con Zod.
- [x] Homero, PR #25: subtotal identificado como orientativo, cuatro regresiones del carrito, límite seguro de facturación con tres tests y documentación actualizada.
- [x] Federico, PR #26: Playwright, comandos y configuración con servidores reales; tres E2E iniciales de menú, ancho móvil y carrito vacío.
- [x] Homero, PR #28: contratos Zod, funciones HTTP, fixtures y handlers compartidos de creación/consulta de pedidos sin mesa; 47 tests nuevos.

Correcciones de Homero ya integradas en `develop` mediante el PR #24:

- [x] Rechazar cantidades, subtotales y totales fuera del rango de enteros seguros antes de guardar; cuatro casos verifican también pedidos y facturación previos.
- [x] Rechazar cuerpo ausente, `items` como objeto e ítems nulos con mensajes claros; tres casos comprueban el rechazo y la conservación de datos.
- [x] Validar los estados enviados y asignar `pendiente` cuando se omite; cinco casos cubren estados incorrectos, valor predeterminado y conservación de uno explícito.
- [x] Distinguir `ErrorValidacion` (400), cuerpo demasiado grande (413) y fallo interno (500 con mensaje genérico); centralizar las respuestas en el middleware.
- [x] Completar cobertura HTTP del catálogo y reforzar los resultados del buscador; refactores de fixtures y auxiliares de tests.
- [x] Actualizar body-parser/qs, aplicar el override de tinypool para Vitest 3 y corregir la configuración de ts-jest, manteniendo TypeScript estricto.
- [x] Validar `productoId` como entero positivo seguro antes de buscar o construir mensajes. Tres casos HTTP cubren ID ausente, objeto simple y objeto con `toString` numérico: responden 400 con mensaje claro y conservan pedidos/facturación. El ciclo RED/GREEN/REFACTOR quedó completo.
- [x] Verificar arranque conjunto y conexión del cliente real con Express a través del proxy de Vite.

Segunda etapa de correcciones de Homero, integrada en `develop` mediante el PR #25:

- [x] Mostrar `Subtotal orientativo` en el carrito y actualizar sus pruebas de componente e integración con App; ciclo RED/GREEN/REFACTOR.
- [x] Agregar cuatro casos de regresión: restar/eliminar la última unidad con bloqueo de confirmación, sumar café y restar pastelería con precios distintos. El componente tiene 14 casos.
- [x] Validar cada suma de facturación acumulada y responder 400 con un mensaje claro cuando supera el rango de enteros seguros. Dos tests unitarios cubren el límite exacto y su exceso; uno HTTP crea seis pedidos válidos y comprueba el error del reporte.
- [x] Compartir la preparación del carrito y de pedidos con totales, y parametrizar las dos formas de quitar la última unidad; refactores separados con pruebas verdes.
- [x] Verificar `npm test`, `npm run build` y `npm run lint` sobre los cambios completos.

Avances de Federico en `feature/f3-api-e2e`, integrados mediante el PR #26:

- [x] Instalar `@playwright/test` 1.65.0 y configurar Chromium a 375 × 812 con arranque de frontend/API reales.
- [x] Integrar `test:e2e` en frontend y raíz, e incluir configuración y pruebas E2E en la comprobación de TypeScript.
- [x] Agregar tres regresiones de navegador: menú con 20 productos reales, ancho móvil de la pantalla actual y bloqueo de confirmación con carrito vacío.
- [x] Integrar `develop` y combinar la documentación de F3 con las correcciones de #25; verificar en esa integración 192 tests, tres E2E, build y lint.

Avances de Homero en `feature/contratos-pedidos`, integrados mediante el PR #28:

- [x] Definir `esquemaItemPedido`, `esquemaPedido` y `esquemaRespuestaCrearPedido`, con tipos derivados mediante `z.infer`.
- [x] Implementar `crearPedido(items)` y `consultarPedido(id)` a través del cliente validado, conservando sus errores HTTP, de red y de contrato.
- [x] Verificar el método POST, `Content-Type`, cuerpo con los ítems y una sola petición; distinguir la respuesta de creación del pedido directo de consulta.
- [x] Compartir `pedidoApi`, `respuestaCrearPedidoApi`, el error de pedido inexistente y handlers de éxito para POST y GET.
- [x] Agregar 47 tests: 28 de esquemas, 17 del cliente y dos de handlers; conservar ciclos RED/GREEN/REFACTOR y regresiones adicionales.
- [x] Verificar en esa etapa 239 tests habituales, tres E2E, build y lint; actualizar README, FRONTEND y planificación.
- [ ] Extender H2 con `mesaId`, usando el contrato de N1 disponible en esta rama, después de integrar la PR #27.

Avances de N1 en `feature/mesa-pedidos`, pendientes de integrar mediante la PR #27:

- [x] Nicolas: agregar `mesaId` opcional al modelo, almacenamiento, servicio y respuesta; definir las mesas válidas del 1 al 8 y permitir pedidos para barra.
- [x] Nicolas: incorporar cuatro casos unitarios de mesa válida, mesa inexistente, estado predeterminado y producto inexistente.
- [x] Homero: incorporar `develop` y resolver los conflictos conservando `crearPedido(items, estado = "pendiente", mesaId?)`, la validación del cuerpo y las reglas de IDs, cantidades, importes y estados.
- [x] Homero: centralizar los errores de mesa con `ErrorValidacion` y HTTP 400; mantener HTTP 500 para fallos internos.
- [x] Homero: agregar 13 casos HTTP de mesa/barra y rechazos con conservación de pedidos, facturación e IDs; extraer `validarMesaPedido()` sin cambiar el comportamiento.
- [x] Verificar 256 tests habituales, tres E2E, build y lint hasta `18911cd`; actualizar los tres documentos principales.

`listarProductos()` usa `solicitarValidado()` con `esquemaProductos`: valida y conserva el precio y los campos propios de café y pastelería descritos debajo. `Producto` y `Productos` se derivan con `z.infer`; el carrito usa `ProductoBase` para operar con los campos comunes. El cliente de pedidos sin mesa está disponible para integrar la confirmación y el seguimiento. Selector, botones reales de agregar, soporte de mesa en H2 y la interfaz, pantallas de pedidos, Bootstrap/SASS y recorrido E2E completo con reset/seed siguen pendientes. Los ticks por integrante están en [planificacion.md](planificacion.md).

El contrato ampliado de productos está disponible y cubierto en ambos endpoints. N1 agrega `mesaId` a la API en esta rama; el cliente frontend y las pantallas todavía deben incorporarlo. Reset/seed sigue pendiente de N2. Instalación limpia y arranque conjunto están registrados; el recorrido completo en navegador sigue pendiente. La auditoría previa del 6 de noviembre registró 20 paquetes afectados de desarrollo en backend (4 bajos y 16 moderados) y 9 moderados en frontend, sin altos ni críticos. Las restricciones de versiones y el override están documentados en [FRONTEND.md](FRONTEND.md#dependencias-de-desarrollo-y-auditoría).

En la comprobación conjunta previa, Vite sirvió `/` y `/src/main.tsx` con 200, y `listarProductos()` validó los 20 productos de Express mediante el cliente y Zod reales. Un POST por el proxy, con producto 5 × 2 y producto 19 × 1, sin mesa ni estado, respondió 201, `pendiente` y total **17220**; el GET por ID devolvió el mismo pedido. Los tres IDs mal formados respondieron 400 y se conservaron el pedido válido y su facturación. Los servidores propios se cerraron al finalizar. Esa comprobación del cliente no ejecutaba la interfaz en un navegador. N1 ahora cubre el ejemplo de mesa 4 mediante HTTP; F3 comprueba la pantalla actual a 375 px mediante Chromium. Mesa desde URL, carrito cargado en móvil y recorrido completo siguen pendientes.

## Estructura general

```text
CafeteriaOrigen/
├── backend/             # API, configuraciones, dependencias y pruebas de Jest
├── frontend/            # React, carga del menú, lógica/interfaz del carrito y pruebas
├── package.json         # Comandos generales; sin dependencias propias
├── README.md            # Entrada y documentación del backend actual
├── FRONTEND.md          # Guía principal del frontend y sus pruebas
├── planificacion.md     # Reparto y estado del TP3
├── Reparto del trabajo – Cafetería Origen (Parcial I).md
├── TP3.pdf
├── LICENSE
└── .gitignore
```

El backend se organiza en `src/controllers/`, `data/`, `errors/`, `middleware/`, `models/`, `routes/`, `services/` y `utils/`. Sus pruebas están en `backend/tests/unit/` e `integration/`, con el catálogo esperado en `tests/fixtures/productos.ts`. `backend/src/app.ts` configura Express y `server.ts` inicia el servidor.

## API

La API permite consultar productos, crear y consultar pedidos y obtener reportes de ventas.

### Contrato disponible actualmente

- `GET /productos` devuelve el catálogo con `id`, `nombre`, `precio` y los campos de café/pastelería detallados en [Contrato público de productos](#contrato-público-de-productos). `GET /productos/:id` devuelve un objeto con la misma representación. El precio se obtiene de `calcularPrecio()` en el dominio; un ID inexistente responde 404 con `{ "error": "Producto no encontrado" }`.
- `POST /pedidos` recibe `items: [{ productoId, cantidad }]`, `mesaId` opcional y `estado` opcional. Las mesas válidas son los enteros del 1 al 8; omitir `mesaId` significa retiro en barra. Si se omite `estado`, el servicio asigna `"pendiente"`; conserva los estados explícitos válidos y rechaza valores que no sean textos no vacíos. No se definió un catálogo cerrado de estados.
- Una creación válida responde 201 con `{ mensaje, pedido }`. `pedido` incluye `id`, `items`, `estado`, `total` calculado por la API y `mesaId` cuando se envió una mesa válida.
- `GET /pedidos` devuelve un arreglo de pedidos y `GET /pedidos/:id` un pedido directo, sin el envoltorio de creación.
- `GET /reportes/facturacion` devuelve 200 con `{ facturacion: number }` si la suma es un entero seguro, incluido `Number.MAX_SAFE_INTEGER`. Si una suma acumulada deja de ser segura, responde 400 con `{ "error": "La facturación total supera el rango de enteros seguros" }`. Los pedidos ya creados se conservan; se rechaza la consulta del reporte inseguro.
- Los pedidos se almacenan en memoria y se pierden al reiniciar el servidor.
- Los errores de validación usan HTTP 400 con `{ "error": "mensaje" }`. Un `productoId` mal formado en `POST /pedidos` responde 400 con `{ "error": "El ID del producto debe ser un entero positivo seguro" }`; un ID numérico válido pero inexistente conserva `No existe el producto N`. Un JSON malformado responde 400 con `{ "error": "El cuerpo de la solicitud contiene JSON inválido" }`. Un cuerpo que supera el límite de Express responde 413 con `{ "error": "El cuerpo de la solicitud supera el tamaño permitido" }`. Los fallos internos responden 500 con `{ "error": "Error interno del servidor" }`.

Por ejemplo, crear un pedido con el producto 1 y cantidad 2, sin enviar estado, devuelve `pendiente` y un total de `10040`:

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

El ID del ejemplo supone que es el primer pedido desde el inicio del servidor. Para barra, `mesaId` se omite del JSON de creación, listado y consulta por ID. Las rutas HTTP de reset/seed todavía no están implementadas.

### Contrato de mesas y pedidos en API (N1)

Disponible en `feature/mesa-pedidos`, hasta `18911cd`, pendiente de integrar mediante la PR #27. Las mesas **1 a 8** son una decisión del grupo; el PDF exige un conjunto válido y el ejemplo de mesa 4, sin fijar su tamaño.

| Valor enviado en `mesaId` | Resultado |
| --- | --- |
| Omitido | Pedido para retirar en barra; la respuesta omite `mesaId`. |
| Entero del 1 al 8 | Pedido asociado a esa mesa; creación, listado y consulta por ID conservan el campo. |
| Entero positivo fuera del conjunto, por ejemplo 9 | HTTP 400 con `{ "error": "Mesa inexistente" }`. |
| Texto como `"4"`, `null`, booleano, objeto, arreglo, cero, negativo o decimal | HTTP 400 con `{ "error": "Debe ingresar un número válido" }`. No se convierten automáticamente a números. |

Un rechazo ocurre antes de guardar: conserva los pedidos previos, la facturación y el siguiente ID disponible. El PDF permite 400 o 404 para mesas inexistentes; el contrato de esta rama usa 400 mediante `ErrorValidacion` y el middleware común. Los fallos internos mantienen HTTP 500.

Ejemplo del PDF, con el servidor recién iniciado:

```json
{
  "mesaId": 4,
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ]
}
```

Respuesta HTTP 201:

```json
{
  "mensaje": "El pedido se guardó correctamente",
  "pedido": {
    "id": 1,
    "items": [
      { "productoId": 5, "cantidad": 2 },
      { "productoId": 19, "cantidad": 1 }
    ],
    "estado": "pendiente",
    "mesaId": 4,
    "total": 17220
  }
}
```

`GET /pedidos/1` devuelve directamente el objeto `pedido`; `GET /pedidos` lo incluye en un arreglo. El ID depende de los pedidos ya creados. Internamente se conserva `crearPedido(items, estado = "pendiente", mesaId?)`; almacenamiento y modelo mantienen el orden estado/mesa. `validarMesaPedido()` es privada y se ejecuta después de validar ítems e importes, conservando el orden de errores.

La cobertura HTTP permanente está en [pedidos.mesa.test.ts](backend/tests/integration/pedidos.mesa.test.ts):

| Casos | Qué verifican |
| --- | --- |
| Mesas 1, 4 y 8: tres casos | Límites válidos y ejemplo del PDF; 201, estado predeterminado y total 17220, conservados en creación y consultas. |
| Sin mesa: un caso | Barra, omisión de `mesaId`, estado explícito `completado` y total 2500. |
| Mesa 9: un caso | Mesa inexistente, 400 y mensaje del contrato. |
| 0, -1 y 4.5: tres casos | Valores numéricos inválidos, 400 y mensaje de validación. |
| `"4"`, `null`, `{}`, `[]` y `true`: cinco casos | Tipos incorrectos, 400 y mensaje de validación. |

Los nueve rechazos también comprueban conservación de pedidos, facturación y secuencia de IDs. Para ejecutar los 13 casos:

```powershell
npm run test:backend -- --runTestsByPath tests/integration/pedidos.mesa.test.ts
```

Para revisar los tests de pedidos y comprobar tipos sin generar compilados:

```powershell
npm run test:backend -- pedidos
npm --prefix backend run build -- --noEmit
```

### Contratos y cliente de pedidos (H2)

Disponibles en `frontend/src/api/esquemas/pedidos.ts` y `frontend/src/api/pedidos.ts`, integrados en `develop` mediante el PR #28. El cliente actual cubre pedidos sin mesa:

| Operación | Función del frontend | Cuerpo enviado | Respuesta validada |
| --- | --- | --- | --- |
| `POST /pedidos` | `crearPedido(items: ItemPedido[])` | `{ items: [{ productoId, cantidad }] }` | `{ mensaje, pedido }`, mediante `esquemaRespuestaCrearPedido`. La API responde 201. |
| `GET /pedidos/:id` | `consultarPedido(id: number)` | Sin cuerpo. | Pedido directo, mediante `esquemaPedido`. La API responde 200. |

`Pedido` contiene `id`, `items`, `estado` y `total`. Los IDs y las cantidades son enteros positivos seguros; la lista tiene al menos un ítem y el total es un entero seguro no negativo. El estado debe contener algún carácter distinto de espacio; se conserva el texto recibido y no se impone un catálogo cerrado. `mensaje` se valida como texto. Los tipos `ItemPedido`, `Pedido` y `RespuestaCrearPedido` se derivan con `z.infer`.

Ejemplo de uso desde un módulo del frontend:

```ts
import { crearPedido, consultarPedido } from "./api/pedidos";

const respuesta = await crearPedido([
  { productoId: 5, cantidad: 2 },
  { productoId: 19, cantidad: 1 },
]);
const pedido = await consultarPedido(respuesta.pedido.id);
```

Con el catálogo actual, la API devuelve `pendiente` y total **17220** para esos ítems. El ejemplo usa los productos y cantidades del PDF para retiro en barra. Los fixtures `pedidoApi` y `respuestaCrearPedidoApi` reproducen esa respuesta con ID 1. El cliente no calcula el total ni agrega `estado` o `mesaId` al POST. Aunque el backend admite mesa y estado opcionales, esta función solo recibe ítems. **Pendiente de H2:** declarar `mesaId` opcional en Zod, conservarlo al consultar y permitir enviarlo al crear; actualmente el esquema elimina ese campo de las respuestas. También deben ampliarse tipos inferidos, fixtures, mocks y tests.

Al conectar el carrito, N3 debe construir los ítems con `productoId` y `cantidad`: `crearPedido()` serializa el arreglo recibido y no elimina propiedades adicionales. Confirmación, vaciado tras éxito y conservación del carrito ante fallos requieren su integración y pruebas de interfaz. Los ejemplos de mocks y la cobertura están en [FRONTEND.md](FRONTEND.md#contratos-y-cliente-de-pedidos-h2).

### Búsqueda interna de productos

Los modelos ya disponen de `tipo` (`cafe` o `pasteleria`) y, para cafés, `tipoCafe`, `tamaño` y `variedad`. `backend/src/services/buscar-producto.service.ts` permite filtrar el catálogo por esos parámetros opcionales; devuelve los productos encontrados o el texto `Producto no encontrado` si no hay coincidencias.

Este buscador tiene tres pruebas unitarias y sigue sin estar conectado a rutas de búsqueda. Los casos exitosos exigen los IDs `1, 4, 7, 10, 13, 16` para cafés de Brasil y `7, 8, 9` para expresos grandes, además de sus atributos; el tercero conserva el resultado sin coincidencias. El servicio de respuestas del PR #15 es independiente: el PR #18 lo conectó a los controladores de ambos GET de productos.

### Contrato público de productos

Disponible desde el PR #18 de Matias y consumido con validación Zod desde el PR #20 de Homero:

| Campo | Café | Pastelería |
| --- | --- | --- |
| `id`, `nombre`, `precio` | ID entero positivo, texto y precio numérico del dominio. | Mismos campos comunes. |
| `tipo` | `"cafe"`. | `"pasteleria"`. |
| `tipoCafe` | `"expreso"` o `"filtrado"`. | No se envía. |
| `tamaño` | `"pocillo"`, `"mediano"` o `"taza grande"`. | No se envía. |
| `variedad` | Objeto con `nombre` (`"brasil"`, `"colombia"`, `"etiopia"`) y `descripcion` textual. | `"muffin de chocolate"` o `"torta selva negra"`. |

Los controladores utilizan las funciones de `backend/src/services/formar-respuesta.service.ts`:

| Función | Responsabilidad |
| --- | --- |
| `normalizarInput(producto)` | Lee los campos del modelo, calcula el precio del dominio y agrega la descripción del origen para los cafés. |
| `formarRespuestaObjeto(productoNormalizado)` | Construye la representación de un producto normalizado. |
| `formarRespuestaArray(productosNormalizados)` | Construye las representaciones de una lista normalizada. |

Ejemplo de la respuesta de `GET /productos/1`:

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

Ejemplo de la respuesta de `GET /productos/19`:

```json
{
  "id": 19,
  "nombre": "Muffin de Chocolate",
  "tipo": "pasteleria",
  "variedad": "muffin de chocolate",
  "precio": 2500
}
```

En el listado se usan estas mismas representaciones. La descripción del café queda en `variedad.descripcion` y el origen en `variedad.nombre`. Los textos actuales están en el diccionario `variedadesDescripcion` del servicio:

| Origen | Descripción actual |
| --- | --- |
| `brasil` | Acidez media, cuerpo equilibrado, notas citricas y florales |
| `colombia` | Acidez muy viva, cuerpo ligero y notas frutales |
| `etiopia` | Acidez baja, cuerpo denso y notas de avellana |

La bebida se indica con `tipoCafe`; `tipo` distingue café y pastelería. El campo público es `tamaño`, con ñ, y los nombres de origen van en minúsculas. La propuesta anterior con `tipo: "expreso"` y `tamanio` quedó reemplazada por este contrato; el PDF admite variaciones de nombres que conserven la información. Zod, consulta y fixtures ya usan la representación actual.

Los 22 casos HTTP comprueban el listado de 20 productos, cada GET individual (9 expresos, 9 filtrados y 2 productos de pastelería) y el 404. Comparan las respuestas con `backend/tests/fixtures/productos.ts`, que fija precios y campos públicos sin importar el catálogo ni las funciones de cálculo de producción. Se restauró la longitud 20 eliminada en #18. Los dos tests del servicio de respuestas siguen siendo unitarios de café; la cobertura HTTP adicional completó M1 y ya está integrada mediante el PR #24.

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
  -d '{"items":[{"productoId":1,"cantidad":2}]}'
```

#### Crear un pedido para la mesa 4

```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Content-Type: application/json" \
  -d '{"mesaId":4,"items":[{"productoId":5,"cantidad":2},{"productoId":19,"cantidad":1}]}'
```

Devuelve HTTP 201, estado `pendiente`, mesa 4 y total 17220.

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
} | ConvertTo-Json -Depth 3

Invoke-RestMethod `
    -Uri "http://localhost:3000/pedidos" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### Crear el pedido del PDF para la mesa 4

```powershell
$pedidoMesaJson = @{
    mesaId = 4
    items = @(
        @{ productoId = 5; cantidad = 2 }
        @{ productoId = 19; cantidad = 1 }
    )
} | ConvertTo-Json -Depth 3

$pedidoCreado = Invoke-RestMethod `
    -Uri "http://localhost:3000/pedidos" `
    -Method Post `
    -ContentType "application/json" `
    -Body $pedidoMesaJson

$pedidoCreado
Invoke-RestMethod -Uri "http://localhost:3000/pedidos/$($pedidoCreado.pedido.id)" -Method Get
```

La creación devuelve `{ mensaje, pedido }`; la consulta devuelve el pedido directo. Ambos conservan mesa 4, estado `pendiente` y total 17220. Para comprobar un rechazo, cambiar `mesaId` a 9: el POST responde 400 y no guarda ese pedido.

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
