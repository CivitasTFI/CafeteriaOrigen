# Frontend — Cafetería Origen

Guía del frontend y de los avances del TP3, actualizada el **6 de noviembre de 2026 - 12:52hs** con el carrito visual y la preparación de E2E en `feature/f3-api-e2e`. La sección 10 conserva las verificaciones históricas de `fix/correcciones-generales`. Este documento vive en la raíz del repositorio. Para instalar y ejecutar ambas aplicaciones, comenzar por [README.md](README.md). El reparto completo está en [planificacion.md](planificacion.md).

## 1. Alcance de lo implementado

La aplicación tiene una entrada HTML en español, montaje con `StrictMode` y `App` con `CarritoProvider` envolviendo encabezado, `MenuPage` y `Carrito`. La página consulta productos ampliados mediante `useMenu` y `listarProductos()`, conserva sus campos y muestra nombres, carga, error y reintento. Vite, TypeScript estricto, ESLint y la infraestructura de pruebas están configurados.

H2 incorpora contratos Zod de errores y productos ampliados, tipos inferidos, cliente HTTP, consulta y fixtures/handlers de éxito y error. Federico implementó reducer, Context, hook y utilidades del carrito, con 13 tests. Matias conectó el servicio ampliado a ambos GET en #18. Homero alineó contrato y carrito en #20 y montó el proveedor con un test de integración adicional en #21.

Siguen pendientes selección de café, pastelería con botones/precios, mesas, confirmación, seguimiento, estilos y el recorrido E2E completo con reset/seed. El carrito visual ya está montado en `App`, pero el menú todavía no permite agregar productos y el botón de confirmar no envía pedidos. Playwright tiene tres pruebas iniciales con servidores reales a 375 × 812. La verificación histórica de la base registró 93 tests de Vitest aprobados; los avances posteriores de F2/F3 se detallan en la sección 6. La instalación limpia se verificó el 5 de noviembre. El backend ya asigna `pendiente` y valida `productoId`; las mesas siguen pendientes para cerrar el contrato de pedidos.

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
| Vitest | 3.2.7 | Pruebas unitarias, de componentes e integración. |
| Playwright (`@playwright/test`) | 1.65.0 | Pruebas E2E con Chromium y servidores reales. |
| tinypool | 2.1.2 | Override limitado a Vitest 3.2.7 para sus workers; motivo y validación en la sección de auditoría. |
| React Testing Library | 16.3.3 | Montaje y consultas de componentes. |
| DOM Testing Library | 10.4.2 | Consultas del DOM y dependencia de Testing Library. |
| user-event | 14.6.8 | Reintento, pruebas del Context e integración del proveedor en App. |
| jest-dom | 6.9.1 | Matchers como `toBeInTheDocument()`. |
| jsdom | 28.1.0 | Entorno de navegador simulado. |
| MSW | 2.15.0 | Interceptación de peticiones en pruebas. |
| Zod | 4.6.7 | Errores, productos ampliados, campos comunes y validación genérica. Pedidos pendientes. |
| ESLint | 9.39.5 | Revisión estática del código. |
| Playwright | 1.65.0 | E2E con Chromium, arranque de servidores y viewport 375 px. |

Las versiones vigentes y sus dependencias completas están en [frontend/package.json](frontend/package.json) y [frontend/package-lock.json](frontend/package-lock.json). Bootstrap y SASS todavía no están instalados; se incorporarán con sus tareas correspondientes.

## 3. Comandos

Desde la raíz:

| Comando | Resultado |
| --- | --- |
| `npm run dev:frontend` | Iniciar Vite; por defecto, `http://localhost:5173`. |
| `npm run test:frontend` | Ejecutar las pruebas de Vitest una vez; no incluye E2E. |
| `npm run test:e2e` | Ejecutar Playwright con frontend y API reales. |
| `npm run test:watch:frontend` | Mantener Vitest observando los cambios. |
| `npm run build:frontend` | Comprobar tipos y generar `frontend/dist/`. |
| `npm run lint` | Ejecutar ESLint sobre el frontend. |
| `npm test` | Ejecutar Jest del backend y Vitest del frontend, deteniéndose si una etapa falla. E2E se ejecuta aparte. |
| `npm run test:e2e` | Ejecutar pruebas E2E con Playwright. |

Para ejecutar un archivo concreto desde la raíz:

```bash
npm run test:frontend -- src/test/components/App.test.tsx
```

Para probar contratos, consulta, menú y lógica del carrito:

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
npm run test:frontend -- src/test/unit/subtotalCarrito.test.ts
npm run test:frontend -- src/test/unit/formatoPrecio.test.ts
```

Desde `frontend/`, los comandos propios son `npm run dev`, `npm test`, `npm run test:watch`, `npm run test:e2e`, `npm run build`, `npm run lint` y `npm run preview`. Por ejemplo:

```bash
npm test -- src/test/integration/msw.test.ts
```

Las pruebas E2E usan Playwright con Chromium y arrancan automáticamente la API y el frontend. La API se ejecuta con `NODE_ENV=test`.

Después de instalar las dependencias, instalar Chromium desde frontend:

```powershell
npx playwright install chromium
```

Ejecutar desde la raíz del proyecto:

```powershell
npm run test:e2e
```

Los puertos 3000 y 5173 deben estar libres. Playwright administra el arranque y cierre de ambos servidores.

Las pruebas actuales comprueban la carga de los 20 productos con la API real, la ausencia de scroll horizontal a 375 px y el bloqueo de confirmación con el carrito vacío.
> [!NOTE]
> Reset/seed y el recorrido completo de compra siguen pendientes.


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
├── playwright.config.ts             # Chromium, viewport y servidores E2E
├── e2e/                             # Pruebas de navegador con API real
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── vite-env.d.ts
    ├── api/
    │   ├── cliente.ts               # Petición, lectura de JSON y validación genérica
    │   ├── errores.ts               # Interpretación de mensajes de error de la API
    │   ├── productos.ts             # listarProductos(), consulta validada
    │   └── esquemas/
    │       ├── errores.ts           # esquemaError y tipo ErrorApi
    │       ├── pedidos.ts           # Reservado, vacío
    │       └── productos.ts         # Contratos base y ampliados, tipos inferidos
    ├── components/                  # Carga, errores y carrito; selección y pedidos pendientes
    ├── config/
    ├── context/                     # carrito.context.ts, CarritoContext.tsx y reducer
    ├── hooks/                       # useMenu y useCarrito implementados
    ├── pages/                       # MenuPage integrada en App
    ├── styles/                      # Bootstrap/SASS de Matias, pendientes
    ├── utils/                       # Subtotales y formato de precio implementados
    └── test/
        ├── components/              # App.test.tsx, Carrito.test.tsx y reservas .pending
        ├── fixtures/                # Errores y productos implementados; pedidos pendiente
        ├── integration/             # HTTP, menú, Context, proveedor de App y reservas
        ├── mocks/
        │   ├── server.ts
        │   └── handlers.ts          # crearHandlerError() y crearHandlerProductos()
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
| `tsconfig.node.json` | Comprobar configuraciones de Vite, Vitest y Playwright y `e2e/**/*.ts`, con tipos Node y DOM. |
| `playwright.config.ts` | Descubrir pruebas en `e2e/`, usar Chromium a 375 × 812 y arrancar API en 3000 y Vite en 5173. No reutiliza servidores existentes. |
| `tsconfig.test.json` | Heredar la configuración estricta y comprobar `src/test/`, con tipos DOM y Node. |
| `eslint.config.js` | Reglas de TypeScript y React, incluido el rechazo del uso explícito de `any`. |
| `.npmrc` | Guardar versiones exactas al instalar dependencias. |
| `playwright.config.ts` | Configurar Chromium, viewport 375 px y arranque de servidores para E2E. |

`npm run build` dentro del frontend ejecuta `tsc -b` antes de Vite: comprueba los tipos de los tests de Vitest y Playwright y sus configuraciones, aunque no formen parte del bundle de la aplicación. Ejecutar Playwright no sustituye esta comprobación de tipos. Los archivos `.pending` quedan fuera de la compilación de TypeScript por su extensión.

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
| `solicitarValidado()` | Valida los datos con Zod y devuelve el tipo inferido. La usa `listarProductos()` y la usarán las funciones de pedidos. |
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

Matias preparó `normalizarInput()`, `formarRespuestaObjeto()` y `formarRespuestaArray()` en #15 y los conectó a ambos GET en #18. El [README](README.md#contrato-público-de-productos) documenta los ejemplos públicos de café y pastelería y los textos de origen. El frontend ya consume este contrato. La base de correcciones amplió la cobertura HTTP a 22 casos: listado, detalle de los 20 productos y 404.

### Carga del menú y reintento (Homero, PR #17)

`App` monta `pages/MenuPage.tsx` dentro de `CarritoProvider`. La página llama al hook `useMenu`, que consulta `listarProductos()` y devuelve `{ estado, reintentar }`. El estado es una unión discriminada:

| Estado | Información | Vista |
| --- | --- | --- |
| `cargando` | Sin productos ni mensaje. | `IndicadorCarga`, con `role="status"` y “Cargando menú...”. |
| `error` | `mensaje: string`. | `MensajeError`, con `role="alert"` y botón “Reintentar”. |
| `listo` | `productos: Productos`, con todos los campos ampliados. | Lista “Productos del menú”, con los nombres recibidos. |

Al reintentar, el hook vuelve a `cargando` y cambia el intento que dispara una nueva consulta. La limpieza del efecto invalida sus callbacks para evitar actualizar el estado después del desmontaje o desde un intento anterior. El error conserva el mensaje del cliente HTTP; un rechazo inesperado que no sea `Error` usa “No se pudo cargar el menú”.

`IndicadorCarga` recibe `mensaje`. `MensajeError` recibe `mensaje` y una función opcional `onReintentar`; si se proporciona, muestra el botón. La página no hace `fetch`, no calcula precios y todavía no monta selector ni pastelería. `App` monta el carrito como hermano de `MenuPage`, dentro del mismo proveedor. La presentación de nombres es la integración base para conectar la selección cuando esté lista.

Los seis tests del menú cubren indicador inicial, carga exitosa, error 500 y recuperación tras 500, fallo de conexión o precio textual en una respuesta 200. Los tres escenarios de recuperación comparten pasos con `test.each`. La prueba nueva de `App` espera el listado y comprueba los nombres y el fin de carga; los dos casos anteriores de encabezado/aislamiento conservan su cobertura.

### Lógica del carrito y utilidades (Federico, PR #16)

| Módulo | Comportamiento implementado |
| --- | --- |
| `context/carrito.reducer.ts` | `AGREGAR`, `RESTAR` y `ELIMINAR`. Repetir un producto incrementa cantidad; restar desde 1 lo quita. Mantiene `productoId`, `nombre`, `precio` y `cantidad`. |
| `context/carrito.context.ts` | Exporta `CarritoContext` y su tipo `CarritoContextValue`. |
| `context/CarritoContext.tsx` | Exporta el componente `CarritoProvider`, con `useReducer`; expone ítems y acciones para agregar, restar y eliminar. |
| `hooks/useCarrito.ts` | Importa el Context desde `carrito.context.ts`; lo consume y lanza un error si se utiliza fuera del proveedor. |
| `utils/subtotalCarrito.ts` | `calcularSubtotalItem()` multiplica precio por cantidad; `calcularSubtotalCarrito()` suma subtotales orientativos. |
| `utils/formatoPrecio.ts` | Reutiliza `Intl.NumberFormat("es-AR")`; por ejemplo, `formatoPrecio(1000)` devuelve `$1.000`. |

Hay seis tests del reducer, cuatro del Context, dos de subtotales y uno de formato: **13 casos iniciales de Federico**. Homero actualizó los datos de prueba para reutilizar `cafeApi` y `pasteleriaApi`, compatibles con el tipo inferido `Producto`. El Context se verifica con un componente de prueba que tiene botones. F2 ya tiene `Carrito` e `ItemCarrito`, con diez pruebas de componente: vacío, nombres de uno y dos productos, cantidad acumulada, subtotales por ítem y general, sumar, restar, eliminar y bloqueo de confirmación en vacío. Sigue pendiente conectar el agregado desde el menú y la confirmación; tampoco hay aún un test específico del error de `useCarrito` fuera del proveedor.

El PR #20 resolvió los bloqueos anteriores: `Producto` ahora se deriva del esquema ampliado; el reducer lo importa con `import type`; los mocks usan el contrato actual y Context/proveedor viven en módulos separados. La base de correcciones tenía compilación y lint aprobados. Quedan pendientes el vaciado tras confirmar y el recorrido completo de F3 con reset/seed. Las tres pruebas iniciales de Playwright ya están escritas.

### Proveedor integrado en App (Homero, PR #21)

`App.tsx` importa `CarritoProvider` desde `context/CarritoContext.tsx` y envuelve con él el contenido principal, incluidos encabezado y `MenuPage`. Esto deja disponible un mismo carrito para los componentes descendientes. La API pública de `useCarrito()` conserva `items`, `agregarProducto`, `restarProducto` y `eliminarProducto`.

`app.carrito.test.tsx` verifica el proveedor real montado por `App`. Sustituye únicamente `MenuPage` por un menú de prueba con dos componentes independientes: un botón que agrega `cafeApi` y un resumen que lee el estado. Comprueba cero unidades al inicio y una tras pulsar el botón. Esa separación se registró históricamente como REFACTOR posterior al GREEN y comprueba el estado compartido entre consumidores. El carrito visual ya está montado en `App`; su conexión con la selección de M2 y la confirmación de N3 sigue pendiente.

## 6. Infraestructura de pruebas

Vitest descubre automáticamente archivos `.test.ts`, `.test.tsx`, `.spec.ts` y `.spec.tsx` dentro de `frontend/src/test/`. `frontend/e2e/` no forma parte de ese descubrimiento. Jest se ejecuta desde el paquete backend y conserva sus pruebas en `backend/tests/`.

El entorno predeterminado del frontend es jsdom. Las pruebas de configuración TypeScript y del proxy declaran `@vitest-environment node`, porque utilizan el compilador, el sistema de archivos o el servidor de Vite. `globals: false` hace que cada test importe sus funciones desde `vitest`.

`src/test/setup.ts`:

1. Registra los matchers de `@testing-library/jest-dom/vitest`.
2. Inicia la instancia compartida de MSW antes de las pruebas del archivo.
3. Después de cada prueba, limpia el DOM y restablece los handlers iniciales de MSW.
4. Cierra MSW al terminar.

La instancia se exporta desde `src/test/mocks/server.ts` y continúa sin handlers iniciales. Cada prueba registra el escenario con `server.use(...)`. Se reutilizan `crearHandlerError()`, `crearHandlerProductos()`, `erroresApi` y `productosApi`, además de handlers locales para cuerpos incompatibles o `HttpResponse.error()`. Las pruebas de `App` preparan los productos con `beforeEach`, sin cambiar el servidor global. `onUnhandledRequest: "error"` detecta solicitudes no previstas. El test del proxy usa `passthrough()` explícito para llegar a su propio servidor real.

La API propia de Vitest está desactivada mediante `api: false`. Esto es independiente de la API Express del proyecto.

### Fixtures y handlers compartidos de errores

`src/test/fixtures/errores.ts` exporta `erroresApi`, cuyos datos cumplen el tipo `ErrorApi`:

| Fixture | Mensaje de la API | Escenario probado |
| --- | --- | --- |
| `pedidoIdInvalido` | `El ID debe ser un número entero positivo` | GET `/pedidos/abc`, 400. |
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

Para simular el rechazo de un pedido sin ítems, registrar `crearHandlerError("/pedidos", erroresApi.pedidoSinItems, 400, "post")`. Para una lista ampliada válida, usar `server.use(crearHandlerProductos(productosApi))`; `crearHandlerProductos([])` simula lista vacía. Los fixtures/handlers de pedidos siguen pendientes.

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
| [carrito.context.test.tsx](frontend/src/test/integration/carrito.context.test.tsx) | 4 | Estado vacío y acciones de agregar, restar y eliminar mediante Context y un componente de prueba. |
| [app.carrito.test.tsx](frontend/src/test/integration/app.carrito.test.tsx) | 1 | App proporciona el mismo carrito a un botón y un resumen independientes; agregar desde uno actualiza el otro. |
| [subtotalCarrito.test.ts](frontend/src/test/unit/subtotalCarrito.test.ts) | 2 | Subtotal de un ítem y suma de subtotales del carrito. |
| [formatoPrecio.test.ts](frontend/src/test/unit/formatoPrecio.test.ts) | 1 | Formato local: 1000 se muestra como `$1.000`. |
| [Carrito.test.tsx](frontend/src/test/components/Carrito.test.tsx) | 10 | Vacío, nombres, cantidades, subtotales, sumar, restar, eliminar y bloqueo de confirmación en vacío. |

La base histórica tenía **93 tests de Vitest en 18 archivos**, verificados el 6 de noviembre en la rama de correcciones. El PR #20 agregó 19 casos y #21 uno, sobre los 73 anteriores. La tabla incluye ahora los diez casos de `Carrito.test.tsx`, agregados después de esa verificación. Los resultados de esa base (80 tests de backend y 93 de frontend, 173 en total) se conservan en la sección 10; no representan una nueva ejecución de la rama actual. Las pruebas normales no necesitan Express levantado: el test del proxy inicia y cierra un servidor Vite temporal y MSW simula la API.


### Pruebas E2E iniciales (F3)

[menu.spec.ts](frontend/e2e/menu.spec.ts) contiene tres casos, ejecutados por Playwright por separado de Vitest:

| Caso | Qué comprueba |
| --- | --- |
| Carga real del menú | Los 20 productos y el nombre de un café desde la API real. |
| Ancho móvil | Después de cargar los 20 productos, el ancho del contenido no supera el ancho visible a 375 px. |
| Carrito vacío | Muestra el mensaje de vacío y deshabilita “Confirmar pedido”. |

La comprobación móvil cubre la pantalla actual con carrito vacío. No certifica el carrito cargado ni las futuras pantallas de confirmación y seguimiento. Reset/seed antes de cada test, mesa 4 y el recorrido completo siguen pendientes de N1/N2/N3, del cliente de pedidos de H2 y de la selección de M2. Estos casos cubren comportamiento existente y pueden registrarse como regresión sin fabricar un RED.

## 7. Archivos `.pending` y comienzo de una funcionalidad

De los 14 archivos de tests vacíos originales, se activaron `unit/esquemas.test.ts`, `integration/cliente.test.ts`, `integration/menu.test.tsx`, `unit/carrito.reducer.test.ts`, `unit/subtotalCarrito.test.ts` y `unit/formatoPrecio.test.ts`. También se crearon los archivos específicos indicados en la tabla anterior y se activó `components/Carrito.test.tsx` para F2. Quedan **7 archivos `.pending`**. Vitest no los ejecuta y no cuentan como cobertura ni como tests omitidos implementados. No se agregaron `test.todo(...)` a tareas pendientes.

Para comenzar una funcionalidad:

1. Quitar únicamente el sufijo `.pending` de su archivo de pruebas.
2. Escribir un único test y ejecutarlo para comprobar el RED por el comportamiento faltante.
3. Guardar el commit RED antes de implementar.
4. Implementar lo mínimo para GREEN, ejecutar la prueba y guardar ese commit.
5. Refactorizar obligatoriamente la implementación de producción para completar o mejorar su diseño, conservando los tests verdes y registrando el cambio por separado. No refactorizar tests como parte del ciclo formal.

`components/Carrito.test.tsx` ya está activo y tiene diez casos. Desde la raíz puede ejecutarse con:

```bash
npm run test:frontend -- src/test/components/Carrito.test.tsx
```

Las siete reservas restantes corresponden a selector, pastelería, encabezado, búsqueda de café, lectura de mesa, pedidos y seguimiento. Ya están implementados cliente, contratos ampliados de productos/errores, mocks, página/hook del menú, proveedor montado, Context/reducer, carrito visual y sus utilidades. Cada responsable completa los archivos pendientes junto con sus pruebas.

## 8. Trabajo con TDD y commits

La unidad de avance es un comportamiento concreto: se escribe y ejecuta un único test en rojo por ciclo, aunque la implementación requiera modificar varios archivos. Se respeta el reparto de la planificación; las correcciones comunes de esta revisión fueron autorizadas por Homero y sus aportes a M1/N1 quedan registrados allí.

- **RED:** el runner funciona y la prueba falla por la capacidad que falta. Un error de sintaxis o una importación equivocada se corrige antes de registrar la evidencia del RED.
- **GREEN:** se implementa únicamente la solución mínima para el único test en rojo y se verifica la misma prueba, conservando la cobertura existente. No se adelanta funcionalidad.
- **REFACTOR:** se refactoriza obligatoriamente la implementación de producción para completar o mejorar su diseño sin cambiar su comportamiento, manteniendo los tests verdes. Los tests no se refactorizan como parte del ciclo formal.

En las siguientes tareas se realiza un refactor después de guardar cada GREEN, enfocado en la implementación de producción del comportamiento recién agregado. Se conserva en la misma rama y en un commit separado, sin reorganizar funciones terminadas de etapas anteriores. Los refactores de tests citados a continuación describen el historial anterior; no definen el ciclo formal vigente. Los refactores de Homero ya incluyen interpretación de errores, petición HTTP, preparación de MSW, parametrización de esquemas/handlers/consultas, extracción de `IndicadorCarga`, `MensajeError` y `useMenu`, y agrupación del reintento en `MensajeError`. Federico también registró refactores del reducer, separación de Context/hook, subtotales y reutilización del formateador de precios.

Los PR #20 y #21 agregan parametrización de listas ampliadas, centralización de fixtures de café/pastelería, separación de Context/proveedor y separación de los dos consumidores del test de integración de App. Las correcciones de tipos y mocks del carrito se registraron como `fix`, a partir de los errores estáticos existentes.

Cuando una prueba nueva pasa con el comportamiento existente, se incorpora como cobertura de regresión sin romper el código para fabricar un RED. Los escenarios de fallo de conexión y respuesta inválida de `MenuPage` se registraron así: ya los resolvían el cliente validado y el hook.

Ejemplos del formato usado en esta base:

```text
RED test: comprobar aislamiento de handlers de MSW entre pruebas
GREEN chore: reiniciar los handlers de MSW después de cada prueba
REFACTOR: parametrizar las pruebas de montaje y aislamiento del DOM
```

Los refactores usan `REFACTOR: descripción`, sin repetir la palabra. Documentación, dependencias y cobertura de comportamiento existente usan su tipo sin forzar un prefijo, por ejemplo `docs: actualizar la guía del frontend`, `chore: instalar Zod 4 con versión exacta` o `test: ampliar cobertura HTTP del catálogo`.

Cada integrante guarda sus propios commits. Durante el trabajo asistido, el asistente prepara cambios y verificaciones y se detiene entre etapas; no crea commits. Se conservan los commits RED, GREEN y REFACTOR en el historial y se evita un squash que borre esa evidencia. El flujo de integración y la revisión cruzada están en la planificación.

El asistente solo edita código con autorización previa y explícita del usuario. Una consulta o un pedido de explicación no autoriza cambios. Cada cierre informa qué terminó, explica brevemente cada prueba o funcionalidad nueva, incluye el comando para probarlo, el commit que corresponde y el siguiente paso. Al preparar un PR, también se entrega un título y una descripción breve. Una actualización documental usa un commit `docs:` y no requiere inventar etapas RED/GREEN.

Las consultas de componentes se hacen por rol, etiqueta o texto. `getByTestId` se reserva para los casos sin una alternativa adecuada. Los tests de reintento y del Context ya usan `userEvent.setup()` para simular las interacciones.

## 9. Qué falta y quién lo integra

| Responsable | Trabajo que sigue pendiente |
| --- | --- |
| Homero | Completar contratos/funciones/mocks de pedidos y conectar selector/pastelería. Instalación limpia, arranque conjunto, correcciones de pedidos, contrato de productos, tipos/lint y proveedor están verificados. |
| Matias | Implementar selector, pastelería y Bootstrap/SASS. La API de M1 y sus 22 casos HTTP están completos en la rama de correcciones, pendientes de integración. |
| Federico | Conectar el carrito con la confirmación y vaciarlo solo tras éxito; completar F3 con reset/seed, compra y seguimiento. Carrito visual montado, diez pruebas de componente e infraestructura de Playwright con tres pruebas iniciales disponibles. |
| Nicolas | Mesas y contrato completo de pedidos en API, reset/seed, lectura de URL, confirmación y seguimiento. El estado predeterminado ya está corregido en esta rama. |

Homero ya integró el proveedor y alineó los tipos y mocks. `test:e2e` ya está integrado en frontend y raíz; quedan reset/seed y las pantallas necesarias para el recorrido completo. El contrato HTTP ampliado de productos está documentado y validado por el cliente; pedidos con mesa y seed siguen pendientes de Nicolas.

El cliente HTTP concentra el `fetch` y ya lo consume el menú por `listarProductos()`. Las utilidades del carrito calculan subtotales orientativos con precios recibidos; el total confirmado seguirá siendo el devuelto por la API. No se reproducen las fórmulas del dominio en el frontend.

La instalación limpia y el arranque conjunto se verificaron en `fix/correcciones-generales`: el cliente real validó el catálogo de Express a través del proxy de Vite. Los contratos completos de pedidos con mesa de N1 y los componentes de M2 siguen condicionando el cierre de H2/H3.

## 10. Estado de verificación y cierre de la base

Verificación del **6 de noviembre de 2026** en `fix/correcciones-generales`, hasta `013c044`, con Node.js **22.23.4** y npm **10.9.9**. Incluye las correcciones de pedidos, herramientas y cobertura posteriores al PR #22:

| Comando desde la raíz | Resultado |
| --- | --- |
| `npm run install:all` | Aprobado el 5 de noviembre: ambos paquetes se instalaron mediante `npm ci` a partir de sus lockfiles. |
| `npm test` | Aprobado el 6 de noviembre: 80 tests de backend en 15 suites y 93 de frontend en 18 archivos; 173 en total. |
| `npm run build` | Ambos paquetes compilan; incluye tipos de los tests/configuraciones del frontend. |
| `npm run lint` | Aprobado, sin errores. |
| Scripts de desarrollo | Arranque conjunto en 3000/5173 y cliente real verificados; procesos propios cerrados al finalizar. |

Los problemas anteriores se resolvieron en #20: exportación del tipo inferido `Producto`, `import type` en el reducer, fixtures compatibles y separación Context/proveedor. El montaje del proveedor de #21 también está verificado.

Vitest transpila los tests y no sustituye `tsc -b`; se ejecutaron ambas verificaciones. En backend, `isolatedModules: true` permite el uso de `Node16` con ts-jest y elimina el aviso TS151002, manteniendo `strict: true`. La comprobación completa de tipos sigue a cargo de `tsc` durante el build. Ver [documentación de ts-jest](https://kulshekhar.github.io/ts-jest/docs/guides/esm-support) y [opción de TypeScript](https://www.typescriptlang.org/tsconfig/isolatedModules.html).

En esa verificación histórica, Rollup avisó sobre comentarios de anotación de Zod y el build terminó correctamente; todavía no había E2E. La rama actual tiene tres pruebas iniciales de Playwright y el recorrido completo de compra sigue pendiente. El ID mal formado detectado en la revisión quedó corregido: los tres casos nuevos de `pedidos.estructura.test.ts` exigen 400, mensaje claro y conservación de pedidos/facturación; el archivo tiene seis casos en total.

### Comprobación de arranque y conexión real

Se iniciaron `npm run dev:backend` y `npm run dev:frontend -- --strictPort` con la configuración existente, en 3000 y 5173. Vite sirvió la página y `/src/main.tsx` con HTTP 200. Se ejecutó `listarProductos()` con el origen local de Vite y los módulos reales de cliente/Zod: validó 20 productos de Express a través del proxy, sin MSW.

El POST por el proxy con producto 5 × 2 y producto 19 × 1, sin mesa ni estado, devolvió 201, `pendiente` y **17220**; el GET por ID devolvió el mismo pedido. Los IDs ausente, objeto simple y objeto con `toString` numérico recibieron 400. El listado conservó solo el pedido válido y la facturación siguió siendo 17220. Se cerraron los servidores propios y se verificaron libres los puertos.

Esta comprobación ejercita servicios y cliente HTTP; no renderiza React en un navegador. La mesa 4 del ejemplo del PDF sigue pendiente. Instalación, arranque y comprobación del cliente no certifican esos requisitos.

### Dependencias de desarrollo y auditoría

Vitest permanece fijado en **3.2.7**, conforme a la versión mayor exigida por el TP3. En `frontend/package.json`, un override limitado a `vitest@3.2.7` fija su dependencia `tinypool` en **2.1.2**. Esta versión contiene las correcciones de los dos avisos críticos: [opciones de workers](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3) y [opciones de ejecución](https://github.com/tinylibs/tinypool/releases/tag/v2.1.2).

Es una excepción al rango de tinypool declarado por Vitest 3. El cambio mayor de [tinypool 2](https://github.com/tinylibs/tinypool/releases/tag/v2.0.0) elimina soporte para Node 18; su requisito de Node 20 o >=22 es compatible con el del proyecto. Se verificaron los 93 tests con procesos (`forks`) y con hilos (`threads`), y el arranque, repetición de los seis tests del menú y cierre en modo watch. Al cambiar la versión de Vitest se debe revisar este override y retirar o ajustar la excepción. `api: false` se mantiene en la configuración de Vitest; no elimina por sí solo los avisos de seguridad restantes.

En backend, el lockfile actualiza ts-jest de **29.4.14** a **29.4.15**, dentro del rango permitido por `package.json`.

| Auditoría del 6 de noviembre de 2026 | Backend | Frontend |
| --- | --- | --- |
| Dependencias de producción (`--omit=dev`) | 0 paquetes afectados | 0 paquetes afectados |
| Todas las dependencias | 20 afectados: 4 bajos y 16 moderados | 9 afectados, todos moderados |
| Avisos altos o críticos | 0 | 0; antes había 2 críticos |

Los avisos de desarrollo no se consideran resueltos: backend conserva las cadenas de `deepmerge`, `glob` y `minimatch`; frontend conserva `@vitest/mocker`/Vitest y `minimatch` mediante typescript-eslint. No hay versiones corregidas dentro de los rangos declarados actuales. `deepmerge` no tiene una versión corregida publicada en el [aviso vigente](https://github.com/advisories/GHSA-gcqx-w48m-w2h4). Las correcciones publicadas de mocker están en versiones mayores que Vitest 3, y las de glob/minimatch también requieren revisar cambios mayores de esas dependencias. Su migración o un parche mantenido siguen pendientes; no se aplicó `npm audit fix --force`.

Las auditorías completas siguen devolviendo un código distinto de cero por esos avisos. Para repetirlas desde la raíz:

```bash
npm --prefix backend audit
npm --prefix frontend audit
npm --prefix backend audit --omit=dev
npm --prefix frontend audit --omit=dev
```
