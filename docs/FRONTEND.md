# Frontend — Cafetería Origen

Guía de arquitectura, contratos y pruebas. La instalación general está en [README.md](../README.md); las tareas terminadas y pendientes están en [planificacion.md](planificacion.md).

## Arquitectura

El frontend usa React, TypeScript estricto, Vite 7, Zod 4 y Bootstrap personalizado con SASS. Las pruebas utilizan Vitest 3, React Testing Library, user-event, jest-dom, MSW 2 y Playwright. Las versiones exactas se consultan en `frontend/package.json` y su lockfile.

```text
frontend/
  src/
    api/          # Cliente HTTP, consultas y esquemas Zod
    components/   # Componentes comunes, carrito, selección y pedidos
    context/      # Context, proveedor y reducer del carrito
    hooks/        # useMenu y useCarrito
    pages/        # MenuPage, VerProductosPage y BuscarProductosPage
    utils/        # Filtro puro, subtotales y formato de precios
    styles/       # Bootstrap y variables SASS compartidas
    test/
      unit/
      components/
      integration/
      fixtures/
      mocks/
      setup.ts
  e2e/            # Pruebas con frontend y API reales
```

El selector, la pastelería y los estilos compartidos están implementados. Los componentes de mesa y confirmación están preparados para conectarlos a App; el seguimiento continúa pendiente.

| Configuración | Responsabilidad |
| --- | --- |
| `vite.config.ts` | React y proxy de `/productos` y `/pedidos` hacia `http://localhost:3000`. |
| `vitest.config.ts` | Entorno jsdom, descubrimiento en `src/test/` y setup de MSW; API propia de Vitest desactivada. |
| `tsconfig*.json` | Separar aplicación, configuraciones y pruebas, manteniendo TypeScript estricto. |
| `playwright.config.ts` | Chromium, viewport 375 × 812 y servidores reales administrados por Playwright. |
| `src/styles/_variables.scss` / `main.scss` | Colores y variables definidos antes de importar Bootstrap; distribución del menú y controles sin recortes. |
| `eslint.config.js` | Reglas de TypeScript/React y rechazo de `any` explícito. |
| `.npmrc` / `package.json` | Versiones exactas y override de `tinypool` 2.1.2 limitado a Vitest 3.2.7; revisar el override al actualizar Vitest. |

El build ejecuta `tsc -b` antes de Vite y comprueba también los tipos de tests y configuraciones. Ejecutar Vitest o Playwright no sustituye esa comprobación.

## Cliente HTTP

Los componentes utilizan `src/api/` para consultar la API. Las rutas se resuelven respecto de `window.location.origin`; el proxy de desarrollo conserva sus nombres, sin prefijo `/api`.

| Función | Responsabilidad |
| --- | --- |
| `solicitarJson(ruta, opciones?)` | Ejecutar la petición, interpretar JSON y manejar errores HTTP/red. Devuelve `unknown`. |
| `solicitarValidado(ruta, esquema, opciones?)` | Validar una respuesta exitosa con Zod y devolver su tipo inferido. |
| `listarProductos(): Promise<Productos>` | Consultar `GET /productos` y validar la lista. |
| `buscarProductos(criterios: CriteriosBusquedaProducto): Promise<Productos>` | Consultar `GET /productos/buscar` con parámetros codificados mediante `URLSearchParams` y validar la lista. |
| `obtenerProducto(id: number): Promise<Producto>` | Consultar `GET /productos/:id` y validar el producto. |
| `crearPedido(items: ItemPedido[], mesaId?: number): Promise<RespuestaCrearPedido>` | Enviar POST JSON a `/pedidos` y validar `{ mensaje, pedido }`. |
| `consultarPedido(id: number): Promise<Pedido>` | Consultar `GET /pedidos/:id` y validar el pedido directo. |

### Contratos

Los esquemas están en `src/api/esquemas/`; los tipos se derivan con `z.infer`.

| Tipo | Reglas principales |
| --- | --- |
| `ErrorApi` | Objeto con `error` textual. |
| `ProductoBase` | Campos comunes: `id` entero positivo, `nombre` textual y `precio` numérico no negativo. |
| `Producto` / `Productos` | Unión discriminada por `tipo` de café/pastelería y su lista. Conserva bebida, tamaño, origen y descripción según corresponda. |
| `ItemPedido` | `productoId` y `cantidad` enteros positivos seguros. |
| `Pedido` | ID positivo seguro, ítems no vacíos, estado textual no blanco, total entero seguro no negativo y mesa opcional entera del 1 al 8. |
| `RespuestaCrearPedido` | `mensaje` textual y `pedido` validado con el mismo esquema del pedido directo. |

El [contrato de productos](../README.md#productos) documenta los campos públicos, incluido `tamaño` con ñ. `variedad` es un objeto en café y un texto en pastelería. El esquema de listado admite una lista vacía y rechaza miembros incompatibles.

`CriteriosBusquedaProducto` admite `tipo`, `tipoCafe`, `tamaño` y `variedad` opcionales. El [endpoint de búsqueda](../README.md#búsqueda-de-productos) exige al menos uno y rechaza filtros repetidos. `filtrarProductos(catalogo, criterios)` realiza el filtrado puro en memoria; lo utilizan el selector, la pastelería y el mock de búsqueda.

La mesa se conserva cuando está presente. Se rechazan `null`, textos y otros tipos incompatibles, sin convertirlos a números. El estado conserva sus espacios y no se restringe a un catálogo cerrado. El total confirmado se recibe de la API.

Ejemplo desde un módulo en `src/`:

```ts
import { crearPedido, consultarPedido } from "./api/pedidos";

const items = [
  { productoId: 5, cantidad: 2 },
  { productoId: 19, cantidad: 1 },
];
const respuesta = await crearPedido(items, 4);
const pedido = await consultarPedido(respuesta.pedido.id);
```

Con el catálogo actual, la respuesta conserva mesa 4, estado `pendiente` y total **17220**. Para barra se usa `crearPedido(items)`.

La creación serializa `JSON.stringify({ items, mesaId })`; `undefined` omite la mesa del JSON. No envía estado: la API asigna `pendiente`. El segundo argumento del frontend es la mesa; el servicio interno del backend usa la firma distinta `crearPedido(items, estado = "pendiente", mesaId?)`.

Zod valida las respuestas; los datos enviados los valida la API. El llamador debe transformar los ítems del carrito a `{ productoId, cantidad }`, porque la función serializa el arreglo recibido sin filtrar propiedades adicionales.

### Errores

| Situación | Mensaje del cliente |
| --- | --- |
| Error HTTP con `{ error: string }` | Conserva el mensaje recibido de la API. |
| Error HTTP con JSON incompatible | `No se pudo interpretar la respuesta de error del servidor` |
| HTML, JSON incompleto o cuerpo vacío | `No se pudo interpretar la respuesta del servidor` |
| Fallo de conexión | `No se pudo conectar con el servidor` |
| Respuesta exitosa incompatible | `La respuesta del servidor no tiene el formato esperado` |

Por ejemplo, un POST con mesa 9 conserva el 400 `Mesa inexistente`; una respuesta exitosa con esa mesa se rechaza como error de contrato.

## Menú y carrito

`App` mantiene `NavegacionPrincipal` y `Carrito` dentro del mismo `CarritoProvider`. Cambiar de sección conserva los ítems del carrito.

| Sección | Página y comportamiento |
| --- | --- |
| Pedir | `MenuPage`: selección de café en tres pasos y pastelería con precios y botones de agregar al carrito. |
| Ver productos | `VerProductosPage`: catálogo completo y detalle del producto elegido por ID. |
| Buscar productos | `BuscarProductosPage`: formulario de filtros que consulta la API y muestra resultados, carga o error. |

`ContenedorCatalogo` comparte la carga de Pedir y Ver productos. Usa `useMenu`, que consulta `listarProductos()` y expone una unión discriminada: `cargando`, `error` con mensaje o `listo` con productos. Muestra `IndicadorCarga`, `MensajeError` con reintento o entrega el catálogo a sus componentes. La limpieza del efecto evita actualizar desde solicitudes invalidadas.

`SelectorCafe` recibe ese catálogo, filtra por bebida y tamaño y muestra descripción y precio de cada origen. Agregar queda bloqueado hasta completar una combinación válida; cambiar bebida o tamaño limpia el origen. `Pasteleria` filtra el mismo catálogo y permite agregar muffin o torta. Ambos muestran disponibilidad según los productos recibidos, sin realizar consultas adicionales.

`DetalleProducto` deriva el producto seleccionado del catálogo validado. Si está vacío, muestra un mensaje y no consulta un ID inventado. La función HTTP `obtenerProducto()` queda disponible para consultas directas por ID.

El carrito usa un reducer puro con `AGREGAR`, `RESTAR`, `ELIMINAR` y `VACIAR`. Agregar un producto repetido acumula cantidad; restar desde uno quita el ítem. `useCarrito()` expone `items`, `agregarProducto`, `restarProducto`, `eliminarProducto` y `vaciarCarrito`; debe usarse dentro del proveedor. Las acciones por producto reciben `ProductoBase`.

`Carrito` e `ItemCarrito` muestran cantidades, controles accesibles y subtotales. `calcularSubtotalItem()` y `calcularSubtotalCarrito()` usan los precios recibidos; `formatoPrecio()` aplica formato `es-AR`. El subtotal se identifica como orientativo y confirmar queda deshabilitado cuando el carrito está vacío.

El botón de confirmar de App todavía no envía pedidos. Para su integración están disponibles `leerMesa`, `Encabezado`, `ConfirmarPedido` y `ConfirmacionPedido`.

`leerMesa(new URLSearchParams(window.location.search))` lee `?mesa=N`; acepta las mesas 1–8 y devuelve `undefined` para barra cuando falta o es inválida, sin lanzar errores. El parámetro de URL es `mesa`; el campo enviado a la API es `mesaId`.

`ConfirmarPedido` recibe `mesaId` opcional y usa el Context para enviar solo IDs/cantidades mediante el cliente H2. Bloquea el carrito vacío y las confirmaciones repetidas, muestra los datos devueltos por API y vacía el carrito tras el éxito. Los errores HTTP, de red y de contrato se muestran sin perder el contenido; se puede reintentar. `ConfirmacionPedido` presenta el ID, estado y total formateado con la utilidad compartida.

Nicolas debe conectar estos componentes a App y coordinar el estado de envío con la edición del carrito. La consulta de seguimiento aún no está implementada.

## Pruebas

| Nivel | Herramientas y alcance |
| --- | --- |
| Unitarias | Vitest: esquemas Zod, filtro puro de productos, reducer, subtotales, formato y configuración. |
| Componentes | Testing Library y user-event: selector, pastelería, carrito y navegación de App. |
| Integración | MSW: cliente HTTP, proxy, búsquedas, catálogo/detalle vacío, pedidos, carga/reintento, Context y handlers compartidos. |
| E2E | Playwright: navegador con frontend y API reales. |

`src/test/setup.ts` registra jest-dom, inicia MSW, limpia DOM/handlers después de cada test y cierra el servidor al terminar. Cada prueba importa las funciones de Vitest y registra sus escenarios con `server.use(...)`. Las solicitudes sin handler producen error. Los tests de configuración y proxy usan entorno Node; el resto usa jsdom.

### Fixtures y handlers

| Archivo | Datos reutilizables |
| --- | --- |
| `test/fixtures/productos.ts` | `catalogoCompleto` contiene los 20 productos; `catalogoPrueba` lo reutiliza. `productosApi` contiene solo los productos 5 y 19; también se exportan fixtures individuales, incluida `tortaApi` con precio 4200. |
| `test/fixtures/pedidos.ts` | `pedidoApi` y `respuestaCrearPedidoApi` para barra; `pedidoConMesaApi` y `respuestaCrearPedidoConMesaApi` para mesa 4. |
| `test/fixtures/errores.ts` | `erroresApi`: ID inválido, pedido/producto inexistente, pedido sin ítems, mesa inexistente y error interno. |

Los fixtures de pedidos usan producto 5 × 2 y producto 19 × 1, estado `pendiente` y total 17220. Cumplen sus tipos mediante `satisfies`.

`test/mocks/handlers.ts` exporta:

- `crearHandlerProductos(productos)`: GET `/productos`, 200.
- `crearHandlerBuscarProductos(catalogo)`: GET `/productos/buscar`; filtra en memoria y reproduce los errores 400/404.
- `crearHandlerProductoPorId(catalogo)`: GET `/productos/:id`, 200 o 404; deja `/productos/buscar` al handler correspondiente.
- `crearHandlerCreacionPedido(respuesta)`: POST `/pedidos`, 201 con envoltorio.
- `crearHandlerConsultaPedido(pedido)`: GET `/pedidos/${pedido.id}`, 200 con pedido directo.
- `crearHandlerError(ruta, respuesta, estado, metodo)`: error GET o POST; usa GET si se omite el método.

Ejemplo desde `src/test/integration/`:

```ts
import { pedidoConMesaApi, respuestaCrearPedidoConMesaApi } from "../fixtures/pedidos";
import { crearHandlerCreacionPedido, crearHandlerConsultaPedido } from "../mocks/handlers";
import { server } from "../mocks/server";

server.use(
  crearHandlerCreacionPedido(respuestaCrearPedidoConMesaApi),
  crearHandlerConsultaPedido(pedidoConMesaApi),
);
```

Los handlers usan datos configurados; no persisten pedidos ni calculan precios. Las regresiones comprueban la convivencia de búsqueda y detalle en ambos órdenes, el rechazo de filtros repetidos y el catálogo vacío sin consultas extra. Los cuerpos incompatibles se preparan en handlers locales para mantener válidos los fixtures compartidos.

### Comandos de pruebas

Desde la raíz:

```powershell
npm run test:frontend
npm run build:frontend
npm run lint
```

Para comprobar contratos, cliente y handlers de pedidos:

```powershell
npm run test:frontend -- src/test/unit/pedidos.esquemas.test.ts src/test/integration/pedidos.api.test.ts src/test/integration/handlersPedidos.test.ts
```

Para comprobar la selección y su integración con el menú:

```powershell
npm run test:frontend -- src/test/unit/filtrarProductos.test.ts src/test/components/SelectorCafe.test.tsx src/test/components/Pasteleria.test.tsx src/test/integration/menu.test.tsx src/test/components/App.test.tsx
```

Los archivos `.pending` reservan pruebas todavía no implementadas y no cuentan como cobertura. Al comenzar su funcionalidad se cambia la extensión y se escribe el RED. Los tests de interfaz de pedidos/seguimiento son independientes de los del cliente HTTP.

### Pruebas E2E

Instalar Chromium después de instalar las dependencias. Desde la raíz, en PowerShell:

```powershell
Push-Location frontend
npx playwright install chromium
Pop-Location
npm run test:e2e
```

Los puertos 3000 y 5173 deben estar libres. Playwright inicia y cierra ambos servidores, sin reutilizar otros existentes, y configura la API con `NODE_ENV=test`; no necesita un archivo `.env` para hacerlo.

Antes de cada E2E, `beforeEach` ejecuta `prepararApi(request)`, definida en `e2e/fixtures/api.ts`. Esta función envía un POST a `http://localhost:3000/__test__/seed` y comprueba que responda 201. Las peticiones van directamente a la API porque el proxy de Vite no incluye `/__test__`.

Seed elimina los pedidos anteriores, reinicia los IDs y carga ocho pedidos conocidos. Así, cada prueba comienza con los mismos datos. No hace falta llamar a reset por separado, porque seed ya realiza esa limpieza. El siguiente pedido creado recibe ID 9. El [contrato y los datos del seed](../README.md#datos-de-prueba-reset-y-seed) están en README.

Los E2E comprueban el catálogo de 20 productos, la navegación a Pedir, el bloqueo de confirmación en vacío y los ocho pedidos iniciales. La prueba móvil elige un expreso mediano de Colombia, agrega dos unidades y un muffin, verifica el subtotal orientativo de $17.220 y comprueba que los controles y el carrito entren en 375 px sin recortes ni scroll horizontal.

Los E2E se ejecutan por separado de las pruebas unitarias y de integración. El recorrido completo de confirmación y seguimiento sigue pendiente de N3/F3.

El flujo TDD y los criterios de entrega están en [planificacion.md](planificacion.md#metodología-y-entrega).
