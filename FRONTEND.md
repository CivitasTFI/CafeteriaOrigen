# Frontend — Cafetería Origen

Guía de la base preparada por Homero para el TP3. Este documento vive en la raíz del repositorio y reúne la documentación del frontend y de sus pruebas. Para instalar y ejecutar ambas aplicaciones, comenzar por [README.md](README.md). El reparto completo está en [planificacion.md](planificacion.md).

## 1. Alcance de lo implementado

La aplicación tiene una entrada HTML en español, montaje de React con `StrictMode` y una `App` mínima que muestra el encabezado “Cafetería Origen”. Vite, TypeScript estricto, ESLint y la infraestructura de pruebas están preparados.

También están implementados el proxy de desarrollo hacia la API, la verificación de tipos de los tests y los comandos generales desde la raíz. H2 ya cuenta con manejo de errores HTTP/JSON/red, validación genérica de respuestas exitosas mediante Zod, tipos inferidos y fixtures/handlers compartidos de errores. Los esquemas de producción y funciones específicas de productos/pedidos siguen pendientes.

Los archivos vacíos de componentes, utilidades, estilos y E2E son reservas de la estructura. La base no implementa todavía la carga del menú, selección de café, pastelería, carrito, mesas, confirmación o seguimiento de pedidos. Las pruebas de montaje verifican la infraestructura sobre la `App` inicial; no representan cobertura de esas funcionalidades.

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
| React Testing Library | 16.3.3 | Montaje y consultas de componentes. |
| DOM Testing Library | 10.4.2 | Consultas del DOM y dependencia de Testing Library. |
| user-event | 14.6.8 | Interacciones para las futuras pruebas de componentes. |
| jest-dom | 6.9.1 | Matchers como `toBeInTheDocument()`. |
| jsdom | 28.1.0 | Entorno de navegador simulado. |
| MSW | 2.15.0 | Interceptación de peticiones en pruebas. |
| Zod | 4.6.7 | Contrato de errores y validación genérica implementados; esquemas definitivos de productos/pedidos pendientes. |
| ESLint | 9.39.5 | Revisión estática del código. |

Las versiones vigentes y sus dependencias completas están en [frontend/package.json](frontend/package.json) y [frontend/package-lock.json](frontend/package-lock.json). Bootstrap, SASS y Playwright todavía no están instalados; se incorporarán con sus tareas correspondientes.

## 3. Comandos

Desde la raíz:

| Comando | Resultado |
| --- | --- |
| `npm run dev:frontend` | Iniciar Vite; por defecto, `http://localhost:5173`. |
| `npm run test:frontend` | Ejecutar todas las pruebas implementadas del frontend una vez. |
| `npm run test:watch:frontend` | Mantener Vitest observando los cambios. |
| `npm run build:frontend` | Comprobar tipos y generar `frontend/dist/`. |
| `npm run lint` | Ejecutar ESLint sobre el frontend. |
| `npm test` | Ejecutar backend y frontend, deteniéndose si una etapa falla. |

Para ejecutar un archivo concreto desde la raíz:

```bash
npm run test:frontend -- src/test/components/App.test.tsx
```

Para probar los avances de H2 y la corrección de JSON inválido:

```bash
npm run test:frontend -- src/test/unit/esquemas.test.ts
npm run test:frontend -- src/test/integration/cliente.test.ts
npm run test:frontend -- src/test/integration/respuestas.test.ts
npm run test:frontend -- src/test/integration/handlersErrores.test.ts
npm --prefix backend test -- --runInBand tests/integration/app.test.ts
```

Desde `frontend/`, los comandos propios son `npm run dev`, `npm test`, `npm run test:watch`, `npm run build`, `npm run lint` y `npm run preview`. Por ejemplo:

```bash
npm test -- src/test/integration/msw.test.ts
```

No hay un comando E2E disponible todavía. `frontend/playwright.config.ts` y `frontend/e2e/` están reservados para el trabajo de Federico.

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
├── playwright.config.ts             # Reservado, vacío
├── e2e/                             # Reservado para Playwright
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── vite-env.d.ts
    ├── api/
    │   ├── cliente.ts               # Petición, lectura de JSON y validación genérica
    │   ├── errores.ts               # Interpretación de mensajes de error de la API
    │   └── esquemas/
    │       ├── errores.ts           # esquemaError y tipo ErrorApi
    │       ├── pedidos.ts           # Reservado, vacío
    │       └── productos.ts         # Reservado, vacío
    ├── components/                  # Componentes de funcionalidades pendientes
    ├── config/
    ├── context/                     # Carrito de Federico, pendiente
    ├── hooks/
    ├── styles/                      # Bootstrap/SASS de Matias, pendientes
    ├── utils/
    └── test/
        ├── components/              # App.test.tsx y reservas .pending
        ├── fixtures/                # errores.ts implementado; productos/pedidos pendientes
        ├── integration/             # Cliente HTTP, MSW, proxy y reservas .pending
        ├── mocks/
        │   ├── server.ts
        │   └── handlers.ts          # crearHandlerError(), para GET y POST
        ├── unit/                    # Esquema de errores, TypeScript y reservas .pending
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
| `tsconfig.node.json` | Comprobar `vite.config.ts` y `vitest.config.ts` con tipos de Node. |
| `tsconfig.test.json` | Heredar la configuración estricta y comprobar `src/test/`, con tipos DOM y Node. |
| `eslint.config.js` | Reglas de TypeScript y React, incluido el rechazo del uso explícito de `any`. |
| `.npmrc` | Guardar versiones exactas al instalar dependencias. |

`npm run build` dentro del frontend ejecuta `tsc -b` antes de Vite: los tipos de los tests se comprueban aunque sus archivos no formen parte del bundle de la aplicación. Los archivos `.pending` quedan fuera de la compilación de TypeScript por su extensión.

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
| `solicitarValidado()` | Recibe un esquema Zod, valida los datos y devuelve el tipo inferido del esquema. Es la entrada que deben usar las futuras funciones de endpoints. |
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

La validación genérica ya está implementada, pero todavía no existen los esquemas definitivos de productos/pedidos, sus funciones específicas ni su conexión con componentes. El esquema de producto utilizado en `respuestas.test.ts` es local al test y refleja el JSON actual con `id`, `nombre` y `precio`. No implementa el contrato ampliado que requiere el selector de café.

La API ya responde 400 a JSON malformado con `{ "error": "El cuerpo de la solicitud contiene JSON inválido" }`. El middleware mantiene 500 para errores internos y tiene cobertura en `backend/tests/integration/app.test.ts`.

## 6. Infraestructura de pruebas

Vitest descubre automáticamente archivos `.test.ts`, `.test.tsx`, `.spec.ts` y `.spec.tsx` dentro de `frontend/src/test/`. `frontend/e2e/` no forma parte de ese descubrimiento. Jest se ejecuta desde el paquete backend y conserva sus pruebas en `backend/tests/`.

El entorno predeterminado del frontend es jsdom. Las pruebas de configuración TypeScript y del proxy declaran `@vitest-environment node`, porque utilizan el compilador, el sistema de archivos o el servidor de Vite. `globals: false` hace que cada test importe sus funciones desde `vitest`.

`src/test/setup.ts`:

1. Registra los matchers de `@testing-library/jest-dom/vitest`.
2. Inicia la instancia compartida de MSW antes de las pruebas del archivo.
3. Después de cada prueba, limpia el DOM y restablece los handlers iniciales de MSW.
4. Cierra MSW al terminar.

La instancia se exporta desde `src/test/mocks/server.ts` y continúa sin handlers iniciales. Cada prueba registra el escenario que necesita con `server.use(...)`. Ya se pueden reutilizar `crearHandlerError()` y los fixtures `erroresApi`, además de handlers locales para casos específicos. La configuración `onUnhandledRequest: "error"` hace fallar las solicitudes no previstas. Para una petición que debe llegar a un servidor real de la propia prueba, se utiliza `passthrough()` explícitamente, como en el test del proxy.

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

Para simular el rechazo de un pedido sin ítems, registrar `crearHandlerError("/pedidos", erroresApi.pedidoSinItems, 400, "post")`. Los fixtures y handlers compartidos de respuestas exitosas de productos/pedidos siguen pendientes de los contratos definitivos.

### Pruebas implementadas

| Archivo | Casos | Qué comprueba |
| --- | --- | --- |
| [App.test.tsx](frontend/src/test/components/App.test.tsx) | 2 | Montaje y consulta accesible del encabezado; aislamiento del DOM entre ejecuciones. Los casos comparten cuerpo mediante `test.each`. |
| [msw.test.ts](frontend/src/test/integration/msw.test.ts) | 2 | Interceptación de una consulta de productos y reinicio de handlers entre pruebas. |
| [proxy.test.ts](frontend/src/test/integration/proxy.test.ts) | 2 | Una petición real a Vite llega a la API simulada, conservando `/productos` o `/pedidos`. |
| [configuracionTypescript.test.ts](frontend/src/test/unit/configuracionTypescript.test.ts) | 1 | La solución de TypeScript incluye los tests, el setup y la configuración de Vitest. |
| [esquemas.test.ts](frontend/src/test/unit/esquemas.test.ts) | 10 | Contrato `{ error: string }`: respuesta válida y nueve respuestas incompatibles. |
| [cliente.test.ts](frontend/src/test/integration/cliente.test.ts) | 10 | Tres errores HTTP válidos; tres errores de contrato; HTML, JSON incompleto y cuerpo vacío; un fallo de conexión. |
| [respuestas.test.ts](frontend/src/test/integration/respuestas.test.ts) | 4 | Acepta el producto válido y rechaza precio textual, nombre ausente y respuesta nula, aunque el estado HTTP sea 200. |
| [handlersErrores.test.ts](frontend/src/test/integration/handlersErrores.test.ts) | 4 | Comprueba método, ruta, estado y cuerpo de los cuatro escenarios de errores compartidos. |

Son **35 tests en 8 archivos**: 7 de infraestructura y 28 del contrato de errores, cliente HTTP, validación de respuestas y mocks compartidos. Las pruebas normales no necesitan Express levantado. El test del proxy inicia y cierra un servidor Vite temporal en `127.0.0.1`, con un puerto asignado por el sistema, y MSW simula la API. La compilación comprueba los tipos reales de la aplicación, las configuraciones y los tests.

## 7. Archivos `.pending` y comienzo de una funcionalidad

De los 14 archivos de tests vacíos originales, se activaron `unit/esquemas.test.ts` e `integration/cliente.test.ts`. Además se crearon `integration/respuestas.test.ts` e `integration/handlersErrores.test.ts`. Quedan **12 archivos `.pending`**. Conservan la estructura prevista, Vitest no los ejecuta y no cuentan como cobertura ni como tests omitidos implementados. No se agregaron `test.todo(...)` a las tareas de los demás integrantes.

Para comenzar una funcionalidad:

1. Quitar únicamente el sufijo `.pending` de su archivo de pruebas.
2. Escribir el primer test y ejecutar ese archivo para comprobar el RED por el comportamiento faltante.
3. Guardar el commit RED antes de implementar.
4. Implementar lo mínimo para GREEN, ejecutar la prueba y guardar ese commit.
5. Refactorizar cuando haya una mejora concreta, conservando los tests verdes y registrando el cambio por separado.

Por ejemplo, `components/Carrito.test.tsx.pending` pasa a llamarse `components/Carrito.test.tsx` cuando Federico empiece esas pruebas. Desde la raíz puede ejecutarlo con:

```bash
npm run test:frontend -- src/test/components/Carrito.test.tsx
```

Los componentes, estilos, utilidades y contratos todavía reservados siguen vacíos y conservan sus extensiones originales. Ya tienen implementación el cliente HTTP, la interpretación y esquema de errores, y sus fixtures y handlers compartidos. Cada responsable completa los archivos pendientes junto con sus pruebas.

## 8. Trabajo con TDD y commits

La unidad de avance es un comportamiento concreto. Puede requerir varios archivos de prueba e implementación, pero no se adelantan otras funcionalidades ni se completan tareas de otro integrante.

- **RED:** el runner funciona y la prueba falla por la capacidad que falta. Un error de sintaxis o una importación equivocada se corrige antes de registrar la evidencia del RED.
- **GREEN:** se implementa la solución mínima y se verifica la misma prueba, conservando la cobertura existente.
- **REFACTOR:** se elimina duplicación o se mejora la organización manteniendo el comportamiento. Se hace cuando existe una mejora justificable.

En las siguientes tareas se revisa un refactor después de guardar cada GREEN, enfocado en el código y las pruebas recién agregados. Se conserva en la misma rama y en un commit separado, sin reorganizar funciones terminadas de etapas anteriores. Los refactores ya integrados incluyen la separación de interpretación de errores, la extracción de la petición HTTP y helpers de preparación de MSW y de opciones GET/POST.

Ejemplos del formato usado en esta base:

```text
RED test: comprobar aislamiento de handlers de MSW entre pruebas
GREEN chore: reiniciar los handlers de MSW después de cada prueba
REFACTOR test: parametrizar las pruebas de montaje y aislamiento del DOM
```

Los cambios de documentación, dependencias o mantenimiento que no constituyen una etapa de TDD usan su tipo sin forzar un prefijo, por ejemplo `docs: actualizar la guía del frontend` o `chore: instalar Zod 4 con versión exacta`.

Cada integrante guarda sus propios commits. Durante el trabajo asistido, el asistente prepara cambios y verificaciones y se detiene entre etapas; no crea commits. Se conservan los commits RED, GREEN y REFACTOR en el historial y se evita un squash que borre esa evidencia. El flujo de integración y la revisión cruzada están en la planificación.

El asistente solo edita código con autorización previa y explícita del usuario. Una consulta o un pedido de explicación no autoriza cambios. Cada cierre informa qué terminó, explica brevemente cada prueba o funcionalidad nueva, incluye el comando para probarlo, el commit que corresponde y el siguiente paso. Al preparar un PR, también se entrega un título y una descripción breve. Una actualización documental usa un commit `docs:` y no requiere inventar etapas RED/GREEN.

Las consultas de componentes se hacen por rol, etiqueta o texto. `getByTestId` se reserva para los casos sin una alternativa adecuada. Las futuras pruebas de interacción pueden crear una sesión con `userEvent.setup()`; la dependencia ya está instalada.

## 9. Qué falta y quién lo integra

| Responsable | Trabajo que sigue pendiente |
| --- | --- |
| Homero | Cerrar la verificación de instalación limpia y arranque de H1. Completar esquemas de productos/pedidos, funciones de endpoints y fixtures/handlers de éxito de H2. Implementar la carga del menú de H3. El manejo de errores HTTP/JSON/red, la validación genérica y los mocks de errores ya están terminados. |
| Matias | Completar las respuestas HTTP de productos y las descripciones de origen; selector de café, pastelería y Bootstrap personalizado con SASS. Los modelos ya tienen campos internos y un buscador probado en el backend. |
| Federico | Context, reducer, interfaz del carrito, formato de precios y Playwright. |
| Nicolas | Mesas y pedidos en API, estado predeterminado, reset/seed, lectura de URL, confirmación y seguimiento. |

Homero integrará el proveedor del carrito cuando Federico lo entregue y coordinará el comando `test:e2e` con su configuración de Playwright. Los contratos de productos, pedidos, mesas y seed se acuerdan con el equipo antes de cerrar los esquemas; las propuestas de la planificación todavía no son respuestas implementadas de la API.

El cliente HTTP ya concentra el `fetch` de la aplicación, pero las funciones y pantallas que lo consumirán siguen pendientes. Los precios unitarios y el total confirmado vendrán de la API; los futuros subtotales del carrito serán orientativos. No se reproducirán las fórmulas del dominio en el frontend.

Después de integrar la documentación, el siguiente paso es completar la verificación pendiente de H1: instalar desde los lockfiles con `npm run install:all`, levantar API y frontend siguiendo el README y registrar los resultados. Para los esquemas y funciones que faltan de H2, primero deben estar definidos los campos HTTP de productos de M1 y pedidos de N1.

## 10. Estado de verificación y cierre de la base

Verificación del **4 de noviembre de 2026**, con los cambios hasta el PR #12: `npm test` pasó con **42 tests de backend en 10 suites y 35 de frontend en 8 archivos**; `npm run build` compiló ambas aplicaciones y `npm run lint` pasó. También se verificó el arranque aislado de Vite al inicializar el frontend. Esto no certifica las funcionalidades del menú ni los E2E, todavía pendientes.

Queda pendiente registrar una instalación limpia con `npm run install:all` y comprobar el arranque conjunto de ambas aplicaciones siguiendo el README. La verificación de tests, compilación y lint de esta actualización no reemplaza esas comprobaciones.

La auditoría registrada durante la inicialización reportó tres paquetes afectados en la cadena de Vitest 3: `@vitest/mocker` (moderado), `tinypool` y `vitest` (críticos). Esa auditoría no se volvió a ejecutar en esta actualización documental. Para consultar el estado vigente desde la raíz:

```bash
npm --prefix frontend audit
```

La versión mayor 3 de Vitest está fijada por la consigna. En aquella auditoría, npm proponía una actualización mayor para resolver los avisos; cualquier cambio debe coordinarse con ese requisito. Esta rama de documentación no modifica dependencias.
