# Frontend — Cafetería Origen

Guía del frontend y de los avances del TP3, actualizada el **6 de noviembre de 2026** en `feature/contratos-pedidos`, hasta `3a6a35a`, sobre `develop` (`c52f215`). Incluye las correcciones y el carrito de los PR #24, #23 y #25, y la preparación inicial de Playwright de Federico, integrada mediante #26. Los avances de H2 de la rama actual están pendientes de integrar mediante PR. Este documento vive en la raíz del repositorio. Para instalar y ejecutar ambas aplicaciones, comenzar por [README.md](README.md). El reparto completo está en [planificacion.md](planificacion.md).

## 1. Alcance de lo implementado

La aplicación tiene una entrada HTML en español, montaje con `StrictMode` y `App` con `CarritoProvider` envolviendo encabezado, `MenuPage` y `Carrito`. La página consulta productos ampliados mediante `useMenu` y `listarProductos()`, conserva sus campos y muestra nombres, carga, error y reintento. El carrito muestra cantidades, subtotales orientativos y controles para sumar/restar/eliminar; bloquea la confirmación en vacío. Vite, TypeScript estricto, ESLint y la infraestructura de pruebas están configurados.

H2 incorpora contratos Zod de errores, productos ampliados y pedidos de la API actual, tipos inferidos, cliente HTTP y fixtures/handlers de éxito y error. `crearPedido()` y `consultarPedido()` ya permiten enviar ítems y validar ambas respuestas; H2 agrega 47 tests. Federico implementó reducer, Context, hook y utilidades en #16, y la interfaz del carrito, `VACIAR` y 12 tests adicionales en #23. Matias conectó el servicio ampliado a ambos GET en #18. Homero alineó contrato y carrito en #20, montó el proveedor en #21 e integró las primeras correcciones generales en #24. El PR #25 identifica el subtotal como orientativo y agrega cuatro regresiones del carrito y tres casos de facturación.

Siguen pendientes selección de café, pastelería con botones/precios, mesas, confirmación, seguimiento, estilos y recorrido E2E completo con reset/seed. El menú real aún no permite agregar productos y el botón de confirmar no tiene conectado el envío. Playwright tiene tres pruebas iniciales con servidores reales a 375 × 812. Verificación del **6 de noviembre de 2026**: **156 tests de Vitest y 83 del backend (239 en total), más tres E2E aprobados**, compilación y lint correctos. La instalación limpia del 5 y el arranque conjunto previo del 6 conservan sus registros. H2 queda completo para el contrato actual sin mesa; su ampliación con `mesaId` depende de N1.

## 2. Instalación y versiones

Desde la raíz:

```bash
npm run install:all
```

Para instalar únicamente el frontend:

```bash
npm --prefix frontend ci
```

El requisito de Node es `^20.19.0 || >=22.12.0`. Las dependencias del frontend tienen versiones exactas y su lockfile se versiona. La configuración `save-exact=true` de `frontend/.npmrc` mantiene ese criterio al agregar paquetes.

Versiones de esta base:

| Herramienta | Versión | Uso |
| --- | --- | --- |
| React / React DOM | 19.3.1 | Aplicación y montaje. |
| TypeScript | 5.9.3 | Tipos estrictos. |
| Vite | 7.3.7 | Desarrollo y compilación. |
| Vitest | 3.2.7 | Pruebas del frontend. |
| Playwright (`@playwright/test`) | 1.65.0 | E2E con Chromium y servidores reales a 375 × 812. |
| tinypool | 2.1.2 | Override limitado a Vitest 3.2.7 para sus workers; motivo y validación en la sección de auditoría. |
| React Testing Library | 16.3.3 | Montaje y consultas de componentes. |
| DOM Testing Library | 10.4.2 | Consultas del DOM y dependencia de Testing Library. |
| user-event | 14.6.8 | Reintento, operaciones del carrito, pruebas del Context e integración en App. |
| jest-dom | 6.9.1 | Matchers como `toBeInTheDocument()`. |
| jsdom | 28.1.0 | Entorno de navegador simulado. |
| MSW | 2.15.0 | Interceptación de peticiones en pruebas. |
| Zod | 4.6.7 | Errores, productos ampliados, pedidos de la API actual, tipos inferidos y validación genérica. |
| ESLint | 9.39.5 | Revisión estática del código. |

Las versiones vigentes y sus dependencias completas están en [frontend/package.json](frontend/package.json) y [frontend/package-lock.json](frontend/package-lock.json). Bootstrap y SASS todavía no están instalados; se incorporarán con sus tareas correspondientes.

## 3. Comandos

Desde la raíz:

| Comando | Resultado |
| --- | --- |
| `npm run dev:frontend` | Iniciar Vite; por defecto, `http://localhost:5173`. |
| `npm run test:frontend` | Ejecutar todas las pruebas implementadas del frontend una vez. |
| `npm run test:e2e` | Ejecutar los E2E de Playwright con API y frontend reales; separado de Vitest. |
| `npm run test:watch:frontend` | Mantener Vitest observando los cambios. |
| `npm run build:frontend` | Comprobar tipos y generar `frontend/dist/`. |
| `npm run lint` | Ejecutar ESLint sobre el frontend. |
| `npm test` | Ejecutar Jest y Vitest, deteniéndose si una etapa falla. E2E se ejecuta aparte. |

Para ejecutar un archivo concreto desde la raíz:

```bash
npm run test:frontend -- src/test/components/App.test.tsx
```

Para probar contratos, consultas de productos/pedidos, menú y lógica/interfaz del carrito:

```bash
npm run test:frontend -- src/test/unit/esquemas.test.ts
npm run test:frontend -- src/test/integration/cliente.test.ts
npm run test:frontend -- src/test/integration/respuestas.test.ts
npm run test:frontend -- src/test/integration/handlersErrores.test.ts
npm --prefix backend test -- --runInBand tests/integration/app.test.ts
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

Los tres archivos de pedidos reúnen 47 casos nuevos de H2. Para ejecutarlos juntos desde la raíz:

```bash
npm run test:frontend -- src/test/unit/pedidos.esquemas.test.ts src/test/integration/pedidos.api.test.ts src/test/integration/handlersPedidos.test.ts
```

Desde `frontend/`, los comandos propios son `npm run dev`, `npm test`, `npm run test:watch`, `npm run test:e2e`, `npm run build`, `npm run lint` y `npm run preview`. Por ejemplo:

```bash
npm test -- src/test/integration/msw.test.ts
```

Después de instalar las dependencias, instalar Chromium desde `frontend/` con `npx playwright install chromium`. Desde la raíz, en PowerShell:

```powershell
Push-Location frontend
npx playwright install chromium
Pop-Location
npm run test:e2e
```

Los puertos 3000 y 5173 deben estar libres. Playwright administra el arranque y cierre de API y frontend, con `reuseExistingServer: false`. La API usa `NODE_ENV=test`. Las tres pruebas iniciales verifican el menú real, el ancho de la pantalla actual y el carrito vacío; reset/seed y la compra completa siguen pendientes.

## 4. Estructura y archivos de configuración

```text
frontend/
├── .npmrc
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.test.json
├── playwright.config.ts             # Chromium, viewport y servidores reales
├── e2e/                             # menu.spec.ts con tres E2E iniciales
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── vite-env.d.ts
    ├── api/
    │   ├── cliente.ts               # Petición, lectura de JSON y validación genérica
    │   ├── errores.ts               # Interpretación de mensajes de error de la API
    │   ├── productos.ts             # listarProductos(), consulta validada
    │   ├── pedidos.ts               # crearPedido() y consultarPedido(), respuestas validadas
    │   └── esquemas/
    │       ├── errores.ts           # esquemaError y tipo ErrorApi
    │       ├── pedidos.ts           # Esquemas de ítem, pedido y creación; tipos inferidos
    │       └── productos.ts         # Contratos base y ampliados, tipos inferidos
    ├── components/                  # Comunes y carrito implementados; selección/pedidos pendientes
    ├── config/
    ├── context/                     # carrito.context.ts, CarritoContext.tsx y reducer
    ├── hooks/                       # useMenu y useCarrito implementados
    ├── pages/                       # MenuPage integrada en App
    ├── styles/                      # Bootstrap/SASS de Matias, pendientes
    ├── utils/                       # Subtotales y formato de precio implementados
    └── test/
        ├── components/              # App.test.tsx, Carrito.test.tsx y reservas .pending
        ├── fixtures/                # Errores, productos y pedidos implementados
        ├── integration/             # HTTP, pedidos, handlers, menú, Context, App y reservas
        ├── mocks/
        │   ├── server.ts
        │   └── handlers.ts          # Errores, productos, creación y consulta de pedidos
        ├── unit/                    # Esquemas, reducer, utilidades, configuración
        ├── render.tsx               # Helper compartido reservado
        └── setup.ts
```

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Documento con `lang="es-AR"`, viewport y elemento `root`. |
| `src/main.tsx` | Validar la existencia de `root` y montar `App` con `StrictMode`. |
| `vite.config.ts` | Plugin de React y opciones compartidas del proxy de la API. |
| `vitest.config.ts` | Reutilizar Vite y definir entorno, descubrimiento y setup de pruebas. |
| `tsconfig.json` | Referenciar los proyectos de aplicación, configuraciones y tests. |
| `tsconfig.app.json` | Comprobar la aplicación con `strict: true`; excluye `src/test/`. |
| `tsconfig.node.json` | Comprobar configuraciones de Vite/Vitest/Playwright y `e2e/**/*.ts`, con tipos Node y biblioteca DOM. |
| `playwright.config.ts` | Descubrir pruebas en `e2e/`, usar Chromium a 375 × 812 y arrancar API en 3000 y Vite en 5173; no reutiliza servidores. |
| `tsconfig.test.json` | Heredar la configuración estricta y comprobar `src/test/`, con tipos DOM y Node. |
| `eslint.config.js` | Reglas de TypeScript y React, incluido el rechazo del uso explícito de `any`. |
| `.npmrc` | Guardar versiones exactas al instalar dependencias. |

`npm run build` dentro del frontend ejecuta `tsc -b` antes de Vite: comprueba los tipos de los tests de Vitest y Playwright y sus configuraciones, aunque no formen parte del bundle de la aplicación. Ejecutar Playwright no sustituye esta comprobación. Los archivos `.pending` quedan fuera de la compilación de TypeScript por su extensión.

## 5. Conexión de desarrollo con la API

El backend se inicia por separado con `npm run dev:backend` desde la raíz. El proxy configurado es:

| Petición al frontend | Destino en la API |
| --- | --- |
| `/productos` | `http://localhost:3000/productos` |
| `/productos/1` | `http://localhost:3000/productos/1` |
| `/pedidos` | `http://localhost:3000/pedidos` |
| `/pedidos/1` | `http://localhost:3000/pedidos/1` |

Las rutas conservan su nombre: no se agrega ni se elimina un prefijo `/api`. Las opciones `target` y `changeOrigin` están centralizadas y cada ruta recibe su propia copia. El proxy de Vite admite las peticiones que coinciden con estos prefijos, no solamente GET.

La prueba de integración cubre GET para ambos prefijos. No está implementado todavía el envío de pedidos desde la interfaz. Tampoco se redirigen `/reportes` ni `/__test__`; las rutas HTTP de reset/seed de la API aún deben ser implementadas por Nicolas.

El proxy está configurado para el desarrollo. El preview local de esta versión de Vite también hereda esas opciones si no se configura un proxy propio para preview. La URL de la API en un despliegue y la infraestructura que la atienda deberán definirse al preparar producción. Si cambia el puerto del backend, ajustar el destino en `vite.config.ts`.

### Contrato de errores y cliente HTTP disponibles

`src/api/esquemas/errores.ts` exporta `esquemaError`, que valida un objeto con `error` de tipo texto, y `ErrorApi`, derivado mediante `z.infer<typeof esquemaError>`. Las pruebas verifican que el mensaje válido se conserve y que se rechacen respuestas ausentes, nulas, texto suelto, objetos sin `error` y valores de `error` que no sean texto.

Funciones disponibles:

| Función | Qué hace |
| --- | --- |
| `realizarPeticion()` | Función interna que ejecuta `fetch` y transforma un fallo de conexión en un mensaje claro. |
| `solicitarJson()` | Lee el JSON y maneja errores HTTP y de lectura. Devuelve `unknown`; por sí sola no valida la estructura de una respuesta exitosa. |
| `solicitarValidado()` | Valida los datos con Zod y devuelve el tipo inferido. La usan `listarProductos()`, `crearPedido()` y `consultarPedido()`. |
| `obtenerMensajeError()` | En `src/api/errores.ts`, valida el cuerpo de error y devuelve el mensaje de la API o el mensaje de formato incompatible. |

Firmas públicas de `src/api/cliente.ts`:

```ts
solicitarJson(ruta: string, opciones?: RequestInit): Promise<unknown>

solicitarValidado<Esquema extends z.ZodType>(
  ruta: string,
  esquema: Esquema,
  opciones?: RequestInit,
): Promise<z.infer<Esquema>>
```

El cliente resuelve la ruta respecto de `window.location.origin`. Las opciones `RequestInit` se transmiten a la petición, y los componentes no deben llamar a `fetch` directamente. Los escenarios de error se prueban con MSW, sin levantar Express.

| Situación | Mensaje que entrega el cliente |
| --- | --- |
| Error HTTP con `{ error: string }` válido | El mensaje recibido de la API, sin alterarlo. |
| Error HTTP cuyo JSON no cumple el contrato de errores | `No se pudo interpretar la respuesta de error del servidor` |
| Respuesta HTML, JSON incompleto o cuerpo vacío | `No se pudo interpretar la respuesta del servidor` |
| Fallo de conexión | `No se pudo conectar con el servidor` |
| Respuesta exitosa incompatible con el esquema recibido | `La respuesta del servidor no tiene el formato esperado` |

El módulo `src/api/esquemas/productos.ts` valida la respuesta ampliada disponible desde #18. El esquema local de `respuestas.test.ts` se conserva para probar el cliente genérico por separado. Los esquemas base de campos comunes siguen disponibles, pero la consulta real utiliza el esquema ampliado.

La API ya responde 400 a JSON malformado con `{ "error": "El cuerpo de la solicitud contiene JSON inválido" }`. El middleware mantiene 500 para errores internos y tiene cobertura en `backend/tests/integration/app.test.ts`.

### Contrato de productos, consulta y mocks (Homero, PR #14 y #20)

| Exportación | Contrato |
| --- | --- |
| `esquemaProductoBase` / `ProductoBase` | Campos comunes: `id` entero positivo, `nombre` textual y `precio` numérico no negativo. |
| `esquemaProductosBase` / `ProductosBase` | Lista de campos comunes, conservada con su cobertura anterior. |
| `esquemaProducto` / `Producto` | Unión discriminada por `tipo`: café con bebida/tamaño/origen/descripcion o pastelería con variedad textual. Tipo derivado con `z.infer`. |
| `esquemaProductos` / `Productos` | Lista del contrato ampliado; admite vacía y rechaza un miembro inválido. Conserva los campos de cada variante. |
| `listarProductos(): Promise<Productos>` | Consulta `GET /productos` mediante `solicitarValidado("/productos", esquemaProductos)`. |
| `cafeApi` | Producto 5, expreso mediano Colombia, 7360, con bebida, tamaño, origen y descripción; usa `satisfies Producto`. |
| `pasteleriaApi` | Producto 19, muffin de chocolate, 2500, con tipo y variedad textual; usa `satisfies Producto`. |
| `productosApi` | Lista de los dos fixtures anteriores, con `satisfies Productos`. No sustituye los 20 productos de la API. |
| `crearHandlerProductos(productos: Productos)` | Simula `GET /productos`, estado 200 y el arreglo configurado; se registra con `server.use(...)`. |

La unión amplía los campos comunes con `tipo: "cafe"`, `tipoCafe: "expreso" | "filtrado"`, `tamaño: "pocillo" | "mediano" | "taza grande"` y `variedad: { nombre, descripcion }`. Los orígenes aceptados son `brasil`, `colombia` y `etiopia`. Pastelería usa `tipo: "pasteleria"` y variedad `"muffin de chocolate"` o `"torta selva negra"`. Los nombres de campo reflejan exactamente el JSON público, incluido `tamaño` con ñ.

Hay 11 tests base, 16 ampliados, dos del handler y ocho de la consulta. Los 16 ampliados comprueban tres productos válidos, diez estructuras incompatibles y tres casos de listado. La consulta verifica preservación de campos, lista vacía, objeto en vez de lista, precio textual, tipo ausente, bebida desconocida, origen sin descripción y error 500. Los precios son datos recibidos: no se reproduce `calcularPrecio()`.

`cafeApi` y `pasteleriaApi` se reutilizan en los tests del contrato y carrito para evitar duplicaciones y mocks de formatos anteriores. Los cuerpos incompatibles se simulan con handlers locales, manteniendo bien tipados los fixtures compartidos.

Matias preparó `normalizarInput()`, `formarRespuestaObjeto()` y `formarRespuestaArray()` en #15 y los conectó a ambos GET en #18. El [README](README.md#contrato-público-de-productos) documenta los ejemplos públicos de café y pastelería y los textos de origen. El frontend ya consume este contrato. La cobertura HTTP del listado completo, los 20 detalles y el 404 quedó completada en #24: 22 casos, incluidos filtrados y pastelería.

### Contratos y cliente de pedidos (H2)

`src/api/esquemas/pedidos.ts` define los contratos de respuesta disponibles en la API actual. Los tipos se derivan con `z.infer`:

| Esquema / tipo | Validación |
| --- | --- |
| `esquemaItemPedido` / `ItemPedido` | `productoId` y `cantidad`: enteros positivos seguros. |
| `esquemaPedido` / `Pedido` | `id` entero positivo seguro, `items` con al menos un ítem válido, `estado` textual con algún carácter distinto de espacio y `total` entero seguro no negativo. |
| `esquemaRespuestaCrearPedido` / `RespuestaCrearPedido` | `mensaje` textual y `pedido` validado con `esquemaPedido`. |

Se conserva el estado recibido, incluidos sus espacios; no se recorta ni se restringe a un conjunto cerrado. El mensaje no tiene que ser una frase literal concreta. El total se recibe de la API y no se recalcula con las fórmulas del dominio.

`src/api/pedidos.ts` exporta:

| Función | Petición | Respuesta |
| --- | --- | --- |
| `crearPedido(items: ItemPedido[]): Promise<RespuestaCrearPedido>` | `POST /pedidos`, `Content-Type: application/json`, cuerpo `JSON.stringify({ items })`. | Envoltorio `{ mensaje, pedido }`, validado mediante `esquemaRespuestaCrearPedido`. |
| `consultarPedido(id: number): Promise<Pedido>` | `GET /pedidos/:id`, sin cuerpo. | Pedido directo validado mediante `esquemaPedido`. |

Ambas funciones usan `solicitarValidado()` y conservan el manejo común de errores HTTP, JSON, red y contrato. La validación Zod se aplica a la respuesta; la API valida los ítems enviados y el ID consultado. La creación solo recibe ítems, sin `estado` ni `mesaId`. La API asigna `pendiente` cuando falta el estado, aunque también admite un estado explícito en su contrato de backend.

Ejemplo para conectar desde un módulo en `src/`:

```ts
import { crearPedido, consultarPedido } from "./api/pedidos";

const respuesta = await crearPedido([
  { productoId: 5, cantidad: 2 },
  { productoId: 19, cantidad: 1 },
]);
const pedidoActualizado = await consultarPedido(respuesta.pedido.id);
```

Con el catálogo actual, esos ítems producen total **17220** y estado inicial `pendiente`. `pedidoApi` usa esos datos con ID 1 y `respuestaCrearPedidoApi` lo envuelve con `mensaje`. Ambos fixtures emplean `satisfies` con sus tipos inferidos. Reproducen los productos y cantidades del PDF para barra; la mesa 4 sigue pendiente.

Al integrar N3, transformar los ítems del Context a `{ productoId, cantidad }` antes de llamar a `crearPedido()`. La función serializa el arreglo recibido y no filtra campos adicionales del carrito. La pantalla debe usar el total devuelto, vaciar solo después del éxito y conservar el carrito ante fallos; esas conductas de interfaz aún requieren implementación y pruebas.

**Dependencia pendiente:** cuando Nicolas complete `mesaId` en N1, acordar su representación y extender esquema, tipos inferidos, función de creación, fixtures y tests. El esquema actual no declara ese campo y elimina propiedades desconocidas al interpretar la respuesta. H2 está completo para la API actual; no acredita todavía pedidos con mesa ni el recorrido completo de TP3.

Los 47 tests se distribuyen en 28 de esquemas, 17 de funciones HTTP y dos de handlers compartidos. Las regresiones adicionales cubren errores de contrato y de transporte sin fabricar un RED cuando el cliente común ya resolvía el escenario. Los ciclos y sus commits están registrados en la planificación.

### Carga del menú y reintento (Homero, PR #17)

`App` monta `pages/MenuPage.tsx` dentro de `CarritoProvider`. La página llama al hook `useMenu`, que consulta `listarProductos()` y devuelve `{ estado, reintentar }`. El estado es una unión discriminada:

| Estado | Información | Vista |
| --- | --- | --- |
| `cargando` | Sin productos ni mensaje. | `IndicadorCarga`, con `role="status"` y “Cargando menú...”. |
| `error` | `mensaje: string`. | `MensajeError`, con `role="alert"` y botón “Reintentar”. |
| `listo` | `productos: Productos`, con todos los campos ampliados. | Lista “Productos del menú”, con los nombres recibidos. |

Al reintentar, el hook vuelve a `cargando` y cambia el intento que dispara una nueva consulta. La limpieza del efecto invalida sus callbacks para evitar actualizar el estado después del desmontaje o desde un intento anterior. El error conserva el mensaje del cliente HTTP; un rechazo inesperado que no sea `Error` usa “No se pudo cargar el menú”.

`IndicadorCarga` recibe `mensaje`. `MensajeError` recibe `mensaje` y una función opcional `onReintentar`; si se proporciona, muestra el botón. La página no hace `fetch`, no calcula precios y todavía no monta selector ni pastelería. `App` monta `Carrito` junto a `MenuPage`, bajo el mismo proveedor. La presentación de nombres es la integración base para conectar los componentes de selección cuando estén listos.

Los seis tests del menú cubren indicador inicial, carga exitosa, error 500 y recuperación tras 500, fallo de conexión o precio textual en una respuesta 200. Los tres escenarios de recuperación comparten pasos con `test.each`. La prueba nueva de `App` espera el listado y comprueba los nombres y el fin de carga; los dos casos anteriores de encabezado/aislamiento conservan su cobertura.

### Lógica e interfaz del carrito (Federico, PR #16 y #23)

| Módulo | Comportamiento implementado |
| --- | --- |
| `context/carrito.reducer.ts` | `AGREGAR`, `RESTAR`, `ELIMINAR` y `VACIAR`. Repetir un producto incrementa cantidad; restar desde 1 lo quita; vaciar devuelve una lista vacía. Mantiene `productoId`, `nombre`, `precio` y `cantidad`. |
| `context/carrito.context.ts` | Exporta `CarritoContext` y su tipo `CarritoContextValue`; las acciones por producto aceptan `ProductoBase` y el vaciado no recibe argumentos. |
| `context/CarritoContext.tsx` | Exporta `CarritoProvider`, con `useReducer`; expone ítems y acciones para agregar, restar, eliminar y vaciar. |
| `hooks/useCarrito.ts` | Importa el Context desde `carrito.context.ts`; lo consume y lanza un error si se utiliza fuera del proveedor. |
| `utils/subtotalCarrito.ts` | `calcularSubtotalItem()` multiplica precio por cantidad; `calcularSubtotalCarrito()` suma subtotales orientativos. |
| `utils/formatoPrecio.ts` | Reutiliza `Intl.NumberFormat("es-AR")`; por ejemplo, `formatoPrecio(1000)` devuelve `$1.000`. |
| `components/carrito/Carrito.tsx` | Muestra el estado vacío o los ítems y `Subtotal orientativo`; deshabilita confirmar si no hay productos. |
| `components/carrito/ItemCarrito.tsx` | Muestra nombre, cantidad y subtotal; conecta los controles accesibles de sumar, restar y eliminar con Context. |

Hay seis tests del reducer, cinco del Context, dos de subtotales y uno de formato: **14 casos de lógica y utilidades**, incluido el vaciado agregado en #23. La interfaz tiene otros 14 casos y App dos de integración. Los fixtures `cafeApi` y `pasteleriaApi` conservan el contrato completo `Producto`. El Context se verifica mediante consumidores de prueba y el carrito real; todavía falta un test específico del error de `useCarrito` fuera del proveedor.

El PR #20 resolvió los bloqueos de tipos/mocks y separó Context/proveedor. En #23 las acciones pasaron a recibir `ProductoBase`, derivado del esquema de campos comunes con `z.infer`: ID, nombre y precio. Los productos completos siguen siendo compatibles y la consulta de API conserva su validación ampliada. Quedan pendientes la integración del vaciado tras una confirmación exitosa, la conservación del carrito ante fallos, la revisión del carrito cargado a 375 px y el recorrido completo de F3. La pantalla actual con carrito vacío ya tiene una comprobación móvil inicial.

### Proveedor y carrito integrados en App (PR #21 y #23)

`App.tsx` importa `CarritoProvider` desde `context/CarritoContext.tsx` y envuelve con él el contenido principal, incluidos encabezado, `MenuPage` y `Carrito`. Esto deja disponible un mismo carrito para los componentes descendientes. La API pública de `useCarrito()` expone `items`, `agregarProducto`, `restarProducto`, `eliminarProducto` y `vaciarCarrito`.

`app.carrito.test.tsx` tiene dos casos con el proveedor y el carrito reales. Sustituye únicamente `MenuPage` por un menú de prueba con un botón que agrega `cafeApi` y un resumen que lee el estado. El primer caso comprueba cero unidades al inicio y una tras pulsar; el segundo exige `Subtotal orientativo: $7.360` en el carrito. El menú de prueba permite comprobar el estado compartido mientras M2 implementa los controles reales de selección.

### Correcciones posteriores al PR #23

El subtotal ahora se identifica como orientativo en el componente y en su integración con App. Los cuatro casos nuevos de regresión comprueban restar y eliminar la última unidad, habilitar/bloquear la confirmación y operar con café y pastelería de precios distintos. `Carrito.test.tsx` tiene 14 casos: diez de Federico y cuatro de Homero. La resta/eliminación de la última unidad usa `it.each` y sigue contando como dos casos independientes.

Los auxiliares locales `renderizarCarrito()` y `prepararCarritoConCafeYPasteleria()` comparten montaje y preparación. Las operaciones bajo prueba y sus comprobaciones quedan en cada escenario. Sumar café cambia el subtotal general de $9.860 a $17.220 sin modificar la pastelería; restar pastelería lo cambia de $12.360 a $9.860 sin modificar el café.

El backend también valida la facturación acumulada: acepta el límite seguro exacto y responde 400 con `{ error: "La facturación total supera el rango de enteros seguros" }` cuando una suma lo supera. Tres tests nuevos y el auxiliar `crearPedidosConTotales()` cubren esta corrección. El contrato completo del reporte y los comandos están en README.

## 6. Infraestructura de pruebas

Vitest descubre automáticamente archivos `.test.ts`, `.test.tsx`, `.spec.ts` y `.spec.tsx` dentro de `frontend/src/test/`. `frontend/e2e/` no forma parte de ese descubrimiento. Jest se ejecuta desde el paquete backend y conserva sus pruebas en `backend/tests/`.

El entorno predeterminado del frontend es jsdom. Las pruebas de configuración TypeScript y del proxy declaran `@vitest-environment node`, porque utilizan el compilador, el sistema de archivos o el servidor de Vite. `globals: false` hace que cada test importe sus funciones desde `vitest`.

`src/test/setup.ts`:

1. Registra los matchers de `@testing-library/jest-dom/vitest`.
2. Inicia la instancia compartida de MSW antes de las pruebas del archivo.
3. Después de cada prueba, limpia el DOM y restablece los handlers iniciales de MSW.
4. Cierra MSW al terminar.

La instancia se exporta desde `src/test/mocks/server.ts` y continúa sin handlers iniciales. Cada prueba registra el escenario con `server.use(...)`. Se reutilizan los handlers de errores, productos y pedidos, con sus fixtures, además de handlers locales para cuerpos incompatibles o `HttpResponse.error()`. Las pruebas de `App` preparan los productos con `beforeEach`, sin cambiar el servidor global. `onUnhandledRequest: "error"` detecta solicitudes no previstas. El test del proxy usa `passthrough()` explícito para llegar a su propio servidor real.

La API propia de Vitest está desactivada mediante `api: false`. Esto es independiente de la API Express del proyecto.

### Fixtures y handlers compartidos de errores

`src/test/fixtures/errores.ts` exporta `erroresApi`, cuyos datos cumplen el tipo `ErrorApi`:

| Fixture | Mensaje de la API | Escenario probado |
| --- | --- | --- |
| `pedidoIdInvalido` | `El ID debe ser un número entero positivo` | GET `/pedidos/abc`, 400. |
| `pedidoNoEncontrado` | `No se encontró un pedido con ese ID` | GET `/pedidos/999`, 404, en las pruebas de `consultarPedido()`. |
| `productoNoEncontrado` | `Producto no encontrado` | GET `/productos/999`, 404. |
| `pedidoSinItems` | `El pedido debe contener al menos un producto` | POST `/pedidos` con ítems vacíos, 400. |
| `errorInterno` | `Error interno del servidor` | Error 500 al consultar `/productos`. |

`src/test/mocks/handlers.ts` exporta `crearHandlerError(ruta, respuesta, estado, metodo)`. Construye un handler de MSW 2 que devuelve el JSON y el código HTTP configurados. El método admite `get` o `post`; si se omite, usa `get`. Simula un escenario elegido por el test, sin ejecutar la lógica real de Express.

Por ejemplo, desde una prueba de integración:

```ts
import { erroresApi } from "../fixtures/errores";
import { crearHandlerError } from "../mocks/handlers";
import { server } from "../mocks/server";

server.use(
  crearHandlerError("/productos/999", erroresApi.productoNoEncontrado, 404),
);
```

Para simular el rechazo de un pedido sin ítems, registrar `crearHandlerError("/pedidos", erroresApi.pedidoSinItems, 400, "post")`. Para una lista ampliada válida, usar `server.use(crearHandlerProductos(productosApi))`; `crearHandlerProductos([])` simula lista vacía. Hay cinco fixtures de errores; las cuatro pruebas originales de `handlersErrores.test.ts` se conservan y el 404 de pedido se cubre además en `pedidos.api.test.ts`.

### Fixtures y handlers compartidos de pedidos

| Exportación | Escenario |
| --- | --- |
| `pedidoApi` | Pedido 1 con producto 5 × 2 y producto 19 × 1, estado `pendiente` y total 17220. |
| `respuestaCrearPedidoApi` | `{ mensaje: "El pedido se guardó correctamente", pedido: pedidoApi }`. |
| `crearHandlerCreacionPedido(respuesta: RespuestaCrearPedido)` | Simula POST `/pedidos` con estado 201 y el envoltorio configurado. |
| `crearHandlerConsultaPedido(pedido: Pedido)` | Simula GET `/pedidos/${pedido.id}` con estado 200 y el pedido directo. La ruta sigue el ID recibido. |

Uso desde un test de integración:

```ts
import { pedidoApi, respuestaCrearPedidoApi } from "../fixtures/pedidos";
import {
  crearHandlerCreacionPedido,
  crearHandlerConsultaPedido,
} from "../mocks/handlers";
import { server } from "../mocks/server";

server.use(
  crearHandlerCreacionPedido(respuestaCrearPedidoApi),
  crearHandlerConsultaPedido(pedidoApi),
);
```

Son respuestas configuradas: los handlers no validan el pedido enviado ni calculan precios. Sus dos pruebas verifican método, ruta, estado y JSON contra los esquemas y los datos esperados; la consulta se prueba con ID 7 para comprobar que la ruta no queda fija en 1. Los errores se registran por separado con `crearHandlerError()`. Los cuerpos exitosos incompatibles usan handlers locales para mantener válidos los fixtures compartidos.

### Pruebas implementadas

| Archivo | Casos | Qué comprueba |
| --- | --- | --- |
| [App.test.tsx](frontend/src/test/components/App.test.tsx) | 3 | Encabezado, aislamiento del DOM y carga de los productos desde la aplicación integrada. |
| [msw.test.ts](frontend/src/test/integration/msw.test.ts) | 2 | Interceptación de una consulta de productos y reinicio de handlers entre pruebas. |
| [proxy.test.ts](frontend/src/test/integration/proxy.test.ts) | 2 | Una petición real a Vite llega a la API simulada, conservando `/productos` o `/pedidos`. |
| [configuracionTypescript.test.ts](frontend/src/test/unit/configuracionTypescript.test.ts) | 1 | La solución de TypeScript incluye los tests, el setup y la configuración de Vitest. |
| [esquemas.test.ts](frontend/src/test/unit/esquemas.test.ts) | 10 | Contrato `{ error: string }`: respuesta válida y nueve respuestas incompatibles. |
| [cliente.test.ts](frontend/src/test/integration/cliente.test.ts) | 10 | Tres errores HTTP válidos; tres errores de contrato; HTML, JSON incompleto y cuerpo vacío; un fallo de conexión. |
| [respuestas.test.ts](frontend/src/test/integration/respuestas.test.ts) | 4 | Acepta el producto válido y rechaza precio textual, nombre ausente y respuesta nula, aunque el estado HTTP sea 200. |
| [handlersErrores.test.ts](frontend/src/test/integration/handlersErrores.test.ts) | 4 | Comprueba método, ruta, estado y cuerpo de los cuatro escenarios de errores compartidos. |
| [productos.esquemas.test.ts](frontend/src/test/unit/productos.esquemas.test.ts) | 11 | Producto base válido, IDs inválidos, campos ausentes/incompatibles y validación de listas, incluidas vacías. |
| [productos.ampliados.esquemas.test.ts](frontend/src/test/unit/productos.ampliados.esquemas.test.ts) | 16 | Expreso, filtrado y pastelería válidos, diez estructuras incompatibles y tres casos de listado. |
| [handlersProductos.test.ts](frontend/src/test/integration/handlersProductos.test.ts) | 2 | Respuesta 200 con productos configurados o lista vacía; datos y precios conservados. |
| [productos.test.ts](frontend/src/test/integration/productos.test.ts) | 8 | Preserva campos ampliados; admite vacía; rechaza objeto, precio textual, tipo ausente, bebida desconocida u origen sin descripción; propaga error 500. |
| [menu.test.tsx](frontend/src/test/integration/menu.test.tsx) | 6 | Carga inicial, productos visibles, error 500 y reintento ante 500, fallo de red o respuesta inválida. |
| [carrito.reducer.test.ts](frontend/src/test/unit/carrito.reducer.test.ts) | 6 | Agregar a vacío, agregar otro producto, acumular cantidad, restar, quitar al llegar a cero y eliminar. |
| [carrito.context.test.tsx](frontend/src/test/integration/carrito.context.test.tsx) | 5 | Estado vacío y acciones de agregar, restar, eliminar y vaciar mediante Context y consumidores de prueba. |
| [app.carrito.test.tsx](frontend/src/test/integration/app.carrito.test.tsx) | 2 | Estado compartido entre botón y resumen; el carrito real muestra el subtotal orientativo del producto agregado. |
| [Carrito.test.tsx](frontend/src/test/components/Carrito.test.tsx) | 14 | Vacío, nombres, cantidades, subtotales, sumar/restar/eliminar, bloqueo al quitar la última unidad y operaciones con precios distintos. |
| [subtotalCarrito.test.ts](frontend/src/test/unit/subtotalCarrito.test.ts) | 2 | Subtotal de un ítem y suma de subtotales del carrito. |
| [formatoPrecio.test.ts](frontend/src/test/unit/formatoPrecio.test.ts) | 1 | Formato local: 1000 se muestra como `$1.000`. |
| [pedidos.esquemas.test.ts](frontend/src/test/unit/pedidos.esquemas.test.ts) | 28 | Pedido directo y creación válidos, estado personalizado conservado y rechazo de 18 pedidos y siete respuestas de creación incompatibles. |
| [pedidos.api.test.ts](frontend/src/test/integration/pedidos.api.test.ts) | 17 | Ocho casos de creación y nueve de consulta: petición correcta, respuesta validada, errores HTTP, red, JSON inválido y contrato incompatible. |
| [handlersPedidos.test.ts](frontend/src/test/integration/handlersPedidos.test.ts) | 2 | POST 201 con envoltorio y GET por ID 200 con pedido directo; método, ruta, esquema y datos configurados. |

Son **156 tests en 22 archivos**, verificados el 6 de noviembre hasta `3a6a35a`. El frontend tenía 93 casos después de #20 y #21; #23 agregó 12 y #25 otros cuatro, llegando a 109. H2 agrega 47 y llega a 156. Las pruebas normales no necesitan Express levantado. El test del proxy inicia y cierra un servidor Vite temporal en `127.0.0.1` y MSW simula la API. Los **83 tests del backend**, en 15 suites de Jest, se cuentan por separado: el total habitual es **239**. La compilación comprueba tipos de aplicación/configuración/tests y pasa junto con lint.

Los 28 casos de esquemas incluyen dos respuestas válidas, un estado personalizado y 25 rechazos: 18 del pedido y siete del envoltorio de creación. Los 17 casos HTTP comprueban una sola petición en cada éxito, POST con cabecera y cuerpo exactos, GET por el ID solicitado y preservación de los mensajes 400/404/500 aplicables. También cubren fallos de red, JSON inválido, errores HTTP sin contrato válido y respuestas exitosas incompatibles. `simularPostPedidos()` y `simularGetPedido()` comparten la preparación local de MSW y la captura de peticiones en ese archivo.

### Pruebas E2E iniciales (F3)

[menu.spec.ts](frontend/e2e/menu.spec.ts) contiene tres casos de Federico integrados en #26 y ejecutados por Playwright, separados de los 239 casos de Jest/Vitest:

| Caso | Qué comprueba |
| --- | --- |
| Carga real del menú | Los 20 productos y el nombre de un café desde la API real. |
| Ancho móvil | Después de cargar los productos, el ancho del contenido no supera el visible a 375 px. |
| Carrito vacío | Muestra el mensaje de vacío y deshabilita “Confirmar pedido”. |

Los tres casos volvieron a pasar en `feature/contratos-pedidos` hasta `3a6a35a`. La prueba móvil cubre la pantalla actual con carrito vacío; quedan pendientes el carrito cargado, las futuras pantallas y el recorrido completo. Reset/seed antes de cada test, mesa 4, selección, confirmación y seguimiento dependen de N1/N2/N3 y M2/M3; la extensión de H2 con mesa espera a N1. Las funciones HTTP de pedidos ya están disponibles para N3. Los tres E2E iniciales son regresiones de comportamiento existente y se registran sin fabricar un RED.

## 7. Archivos `.pending` y comienzo de una funcionalidad

De los 14 archivos de tests vacíos originales, se activaron `unit/esquemas.test.ts`, `integration/cliente.test.ts`, `integration/menu.test.tsx`, `unit/carrito.reducer.test.ts`, `unit/subtotalCarrito.test.ts`, `unit/formatoPrecio.test.ts` y `components/Carrito.test.tsx`. También se crearon los archivos específicos indicados en la tabla anterior. Quedan **7 archivos `.pending`**. Vitest no los ejecuta y no cuentan como cobertura ni como tests omitidos implementados. No se agregaron `test.todo(...)` a tareas pendientes.

Para comenzar una funcionalidad:

1. Quitar únicamente el sufijo `.pending` de su archivo de pruebas.
2. Escribir el primer test y ejecutar ese archivo para comprobar el RED por el comportamiento faltante.
3. Guardar el commit RED antes de implementar.
4. Implementar lo mínimo para GREEN, ejecutar la prueba y guardar ese commit.
5. Refactorizar cuando haya una mejora concreta, conservando los tests verdes y registrando el cambio por separado.

Por ejemplo, `components/SelectorCafe.test.tsx.pending` pasará a llamarse `components/SelectorCafe.test.tsx` cuando Matias empiece esas pruebas. Desde la raíz podrá ejecutarlo con:

```bash
npm run test:frontend -- src/test/components/SelectorCafe.test.tsx
```

Las siete reservas de tests restantes son `unit/leerMesa`, `unit/buscarCafe`, `integration/seguimiento`, `integration/pedidos` y los componentes `SelectorCafe`, `Pasteleria` y `Encabezado`. `integration/pedidos.test.tsx.pending` corresponde a la futura integración de interfaz de N3; las funciones HTTP de H2 ya tienen cobertura en `pedidos.api.test.ts`. Los módulos de estilos también siguen reservados. Ya están implementados cliente, contratos de productos/errores/pedidos actuales, mocks, página/hook del menú y lógica/interfaz del carrito. Cada responsable completa los archivos pendientes junto con sus pruebas.

## 8. Trabajo con TDD y commits

La unidad de avance es un comportamiento concreto. Puede requerir varios archivos de prueba e implementación. Se respeta el reparto de la planificación; las correcciones comunes de esta revisión fueron autorizadas por Homero y sus aportes a M1/N1 quedan registrados allí.

- **RED:** el runner funciona y la prueba falla por la capacidad que falta. Un error de sintaxis o una importación equivocada se corrige antes de registrar la evidencia del RED.
- **GREEN:** se implementa la solución mínima y se verifica la misma prueba, conservando la cobertura existente.
- **REFACTOR:** se elimina duplicación o se mejora la organización manteniendo el comportamiento. Se hace cuando existe una mejora justificable.

En las siguientes tareas se revisa un refactor después de guardar cada GREEN, enfocado en el código y las pruebas recién agregados. Se conserva en la misma rama y en un commit separado, sin reorganizar funciones terminadas de etapas anteriores. Los refactores de Homero ya incluyen interpretación de errores, petición HTTP, preparación de MSW, parametrización de esquemas/handlers/consultas, extracción de `IndicadorCarga`, `MensajeError` y `useMenu`, y agrupación del reintento en `MensajeError`. Federico también registró refactores del reducer, separación de Context/hook, subtotales y reutilización del formateador de precios.

Los PR #20 y #21 agregan parametrización de listas ampliadas, centralización de fixtures de café/pastelería, separación de Context/proveedor y separación de los dos consumidores del test de integración de App. Las correcciones de tipos y mocks del carrito se registraron como `fix`, a partir de los errores estáticos existentes.

Después de #23, Homero conservó los ciclos RED/GREEN/REFACTOR del texto orientativo y de la facturación acumulada. Los cuatro escenarios nuevos del carrito ya pasaban con el comportamiento existente y se registraron como `test:`; luego se extrajeron auxiliares y se parametrizó el vaciado. La planificación identifica los commits de cada ciclo.

H2 conserva seis ciclos de esquemas, funciones HTTP y handlers. Sus refactores extraen el esquema del ítem, centralizan fixtures y preparación local de MSW, y eliminan comprobaciones redundantes en las pruebas de handlers. La cobertura adicional de errores se registra por separado como `test:`.

Cuando una prueba nueva pasa con el comportamiento existente, se incorpora como cobertura de regresión sin romper el código para fabricar un RED. Los escenarios de fallo de conexión y respuesta inválida de `MenuPage` se registraron así: ya los resolvían el cliente validado y el hook.

Formato vigente para los nuevos commits de TDD, con las etapas en mayúsculas por indicación de Homero:

```text
RED: probar el handler compartido de consulta de pedidos
GREEN: implementar el handler de consulta de pedidos
REFACTOR: quitar comprobacion redundante del handler de consulta
```

Los refactores usan `REFACTOR: descripción`, sin repetir la palabra. Documentación, dependencias y cobertura de comportamiento existente usan su tipo sin forzar un prefijo, por ejemplo `docs: actualizar la guía del frontend`, `chore: instalar Zod 4 con versión exacta` o `test: ampliar cobertura HTTP del catálogo`.

Cada integrante guarda sus propios commits. Durante el trabajo asistido se aborda una tarea por vez y se espera autorización para pasar de RED a GREEN y de GREEN a REFACTOR. El asistente no ejecuta `git add`, `git commit` ni `git push`, ni modifica el staging; los comandos completos se entregan al usuario. Crear, cambiar, renombrar o eliminar ramas requiere autorización explícita. Se conservan los commits RED, GREEN y REFACTOR en el historial y se evita un squash que borre esa evidencia. Los mensajes históricos mantienen su formato original. El flujo de integración y la revisión cruzada están en la planificación.

El asistente solo edita código con autorización previa y explícita del usuario. Una consulta o un pedido de explicación no autoriza cambios. Cada cierre informa qué terminó, archivos modificados, breve explicación de cada prueba o funcionalidad nueva, comandos exactos de verificación, resultados ejecutados y comprobaciones pendientes, comandos completos para el commit y próximo paso sin ejecutarlo. Al preparar un PR, también se entrega un título y una descripción breve. Una actualización documental usa un commit `docs:` y no requiere inventar etapas RED/GREEN.

Las consultas de componentes se hacen por rol, etiqueta o texto. `getByTestId` se reserva para los casos sin una alternativa adecuada. Los tests de reintento y del Context ya usan `userEvent.setup()` para simular las interacciones.

## 9. Qué falta y quién lo integra

| Responsable | Trabajo que sigue pendiente |
| --- | --- |
| Homero | Integrar la rama de H2; ampliar `mesaId` cuando N1 esté listo y conectar selector/pastelería cuando M2 esté listo. Contratos, funciones y mocks de pedidos de la API actual están terminados. Mantener la documentación de las entregas restantes. |
| Matias | Implementar selector, pastelería y Bootstrap/SASS. La API de M1 y sus 22 casos HTTP ya están integrados en `develop` mediante #18 y #24. |
| Federico | Coordinar vaciado tras éxito y conservación ante fallos, revisar el carrito cargado a 375 px y completar F3 con reset/seed, compra y seguimiento. Playwright y tres E2E iniciales están integrados en `develop` mediante #26. |
| Nicolas | Mesas en API, reset/seed, lectura de URL, confirmación y seguimiento. Estado predeterminado y validaciones generales ya están integrados en #24. Puede reutilizar funciones, tipos y mocks de H2 al integrar esta rama. |

Homero ya integró el proveedor y alineó los tipos y mocks. `test:e2e` ya está integrado en frontend y raíz en F3. El contrato HTTP ampliado de productos está documentado y validado por el cliente; pedidos con mesa y seed siguen pendientes de Nicolas.

El cliente HTTP concentra el `fetch` y ya lo usan `listarProductos()`, `crearPedido()` y `consultarPedido()`. Las utilidades del carrito calculan subtotales orientativos con precios recibidos; la futura pantalla de confirmación deberá mostrar el total recibido en `pedido.total`. No se reproducen las fórmulas del dominio en el frontend.

La instalación limpia y el arranque conjunto se verificaron en `fix/correcciones-generales`: el cliente real validó el catálogo de Express a través del proxy de Vite. N1 condiciona la futura ampliación de H2 con mesa; M2 condiciona la integración restante de H3. La creación y consulta de pedidos sin mesa ya están listas para que Nicolas avance con N3.

## 10. Estado de verificación y cierre de la base

Verificación del **6 de noviembre de 2026** en `feature/contratos-pedidos`, hasta `3a6a35a`, sobre `develop` (`c52f215`, incluido #26), con Node.js **22.23.4** y npm **10.9.9**. Se ejecutaron tests, build, lint y E2E después de completar el último REFACTOR de H2. Chromium estaba disponible y los puertos 3000/5173 quedaron libres tras la ejecución. Las instalaciones previas de frontend/Chromium, instalación limpia de ambos paquetes, arranque conjunto manual y auditorías conservan sus registros; no se repitieron esas instalaciones ni auditorías para H2:

| Comando desde la raíz | Resultado |
| --- | --- |
| `npm run install:all` | Aprobado el 5 de noviembre: ambos paquetes se instalaron mediante `npm ci` a partir de sus lockfiles. |
| `npm test` | Aprobado el 6 de noviembre: 83 tests de backend en 15 suites y 156 de frontend en 22 archivos; 239 en total. |
| `npm run build` | Ambos paquetes compilan; incluye tipos de los tests/configuraciones del frontend. |
| `npm run lint` | Aprobado, sin errores. |
| `npm run test:e2e` | Tres casos de Playwright aprobados con Chromium, frontend y API reales a 375 × 812. |
| Scripts de desarrollo | Comprobación previa del 6 de noviembre: arranque conjunto en 3000/5173 y cliente real; procesos propios cerrados al finalizar. |

Los problemas anteriores se resolvieron en #20: exportación del tipo inferido `Producto`, `import type` en el reducer, fixtures compatibles y separación Context/proveedor. El montaje del proveedor de #21 también está verificado.

Vitest transpila los tests y no sustituye `tsc -b`; se ejecutaron ambas verificaciones. En backend, `isolatedModules: true` permite el uso de `Node16` con ts-jest y elimina el aviso TS151002, manteniendo `strict: true`. La comprobación completa de tipos sigue a cargo de `tsc` durante el build. Ver [documentación de ts-jest](https://kulshekhar.github.io/ts-jest/docs/guides/esm-support) y [opción de TypeScript](https://www.typescriptlang.org/tsconfig/isolatedModules.html).

Rollup sigue avisando sobre comentarios de anotación de Zod; el build termina correctamente. Los tres E2E iniciales están aprobados; reset/seed y compra completa siguen pendientes. El ID mal formado detectado en la revisión quedó corregido: los tres casos nuevos de `pedidos.estructura.test.ts` exigen 400, mensaje claro y conservación de pedidos/facturación; el archivo tiene seis casos en total.

El PR #25 integró cuatro regresiones de componente y tres casos de facturación; la suma acumulada insegura ya produce 400 con el mensaje documentado. El PR #26 integró las pruebas iniciales de navegador. H2 agrega los contratos y funciones de creación/consulta, fixtures y handlers, con 47 casos nuevos. El siguiente paso es guardar la actualización documental en `feature/contratos-pedidos`, subir la rama y abrir su PR a `develop`, conservando los commits de TDD. Después del merge, volver a `develop` actualizado: H3 continúa si M2 está disponible; la extensión de pedidos con mesa espera a N1. Las tareas de confirmación y seguimiento siguen siendo N3.

### Comprobación de arranque y conexión real

Se iniciaron `npm run dev:backend` y `npm run dev:frontend -- --strictPort` con la configuración existente, en 3000 y 5173. Vite sirvió la página y `/src/main.tsx` con HTTP 200. Se ejecutó `listarProductos()` con el origen local de Vite y los módulos reales de cliente/Zod: validó 20 productos de Express a través del proxy, sin MSW.

El POST por el proxy con producto 5 × 2 y producto 19 × 1, sin mesa ni estado, devolvió 201, `pendiente` y **17220**; el GET por ID devolvió el mismo pedido. Los IDs ausente, objeto simple y objeto con `toString` numérico recibieron 400. El listado conservó solo el pedido válido y la facturación siguió siendo 17220. Se cerraron los servidores propios y se verificaron libres los puertos.

Esta comprobación manual previa ejercitó servicios y cliente HTTP sin renderizar React en un navegador. Los E2E iniciales ahora verifican el menú y la pantalla actual a 375 px con Chromium. La mesa 4, reset/seed, el carrito cargado en móvil y la compra completa siguen pendientes.

### Dependencias de desarrollo y auditoría

Vitest permanece fijado en **3.2.7**, conforme a la versión mayor exigida por el TP3. En `frontend/package.json`, un override limitado a `vitest@3.2.7` fija su dependencia `tinypool` en **2.1.2**. Esta versión contiene las correcciones de los dos avisos críticos: [opciones de workers](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3) y [opciones de ejecución](https://github.com/tinylibs/tinypool/releases/tag/v2.1.2).

Es una excepción al rango de tinypool declarado por Vitest 3. El cambio mayor de [tinypool 2](https://github.com/tinylibs/tinypool/releases/tag/v2.0.0) elimina soporte para Node 18; su requisito de Node 20 o >=22 es compatible con el del proyecto. Antes del PR #24 se verificaron los 93 tests de esa etapa con procesos (`forks`) y con hilos (`threads`), y el arranque, repetición de los seis tests del menú y cierre en modo watch. La suite actual de 156 casos pasó con la configuración predeterminada. Al cambiar la versión de Vitest se debe revisar este override y retirar o ajustar la excepción. `api: false` se mantiene en la configuración de Vitest; no elimina por sí solo los avisos de seguridad restantes.

En backend, el lockfile actualiza ts-jest de **29.4.14** a **29.4.15**, dentro del rango permitido por `package.json`.

| Auditoría previa del 6 de noviembre de 2026 | Backend | Frontend |
| --- | --- | --- |
| Dependencias de producción (`--omit=dev`) | 0 paquetes afectados | 0 paquetes afectados |
| Todas las dependencias | 20 afectados: 4 bajos y 16 moderados | 9 afectados, todos moderados |
| Avisos altos o críticos | 0 | 0; antes había 2 críticos |

Estos resultados conservan la auditoría previa del 6 de noviembre, anterior a incorporar Playwright. El PR #25 no cambió dependencias; F3 agrega `@playwright/test` 1.65.0 y sus dependencias en el lockfile. H2 no cambia dependencias ni configuraciones. Su verificación ejecutó tests, build, lint y E2E; no constituye una auditoría nueva.

Los avisos de desarrollo no se consideran resueltos: backend conserva las cadenas de `deepmerge`, `glob` y `minimatch`; frontend conserva `@vitest/mocker`/Vitest y `minimatch` mediante typescript-eslint. No hay versiones corregidas dentro de los rangos declarados actuales. `deepmerge` no tiene una versión corregida publicada en el [aviso vigente](https://github.com/advisories/GHSA-gcqx-w48m-w2h4). Las correcciones publicadas de mocker están en versiones mayores que Vitest 3, y las de glob/minimatch también requieren revisar cambios mayores de esas dependencias. Su migración o un parche mantenido siguen pendientes; no se aplicó `npm audit fix --force`.

En la auditoría registrada, las comprobaciones completas devolvieron un código distinto de cero por esos avisos. Para repetirlas desde la raíz:

```bash
npm --prefix backend audit
npm --prefix frontend audit
npm --prefix backend audit --omit=dev
npm --prefix frontend audit --omit=dev
```
