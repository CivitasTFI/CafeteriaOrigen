# Frontend — Cafetería Origen

Guía de la base preparada por Homero para el TP3. Este documento vive en la raíz del repositorio y reúne la documentación del frontend y de sus pruebas. Para instalar y ejecutar ambas aplicaciones, comenzar por [README.md](README.md). El reparto completo está en [planificacion.md](planificacion.md).

## 1. Alcance de lo implementado

La aplicación tiene una entrada HTML en español, montaje de React con `StrictMode` y una `App` mínima que muestra el encabezado “Cafetería Origen”. Vite, TypeScript estricto, ESLint y la infraestructura de pruebas están preparados.

También están implementados el proxy de desarrollo hacia la API, la verificación de tipos de los tests y los comandos generales desde la raíz. Zod 4 está instalado como dependencia de ejecución; sus esquemas y el cliente HTTP todavía están pendientes de H2.

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
| Zod | 4.6.7 | Validación de contratos, a implementar en H2. |
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
    ├── api/                         # Cliente y esquemas pendientes
    ├── components/                  # Componentes de funcionalidades pendientes
    ├── config/
    ├── context/                     # Carrito de Federico, pendiente
    ├── hooks/
    ├── styles/                      # Bootstrap/SASS de Matias, pendientes
    ├── utils/
    └── test/
        ├── components/              # App.test.tsx y reservas .pending
        ├── fixtures/                # Datos compartidos pendientes
        ├── integration/             # MSW, proxy y reservas .pending
        ├── mocks/
        │   ├── server.ts
        │   └── handlers.ts          # Reservado para handlers compartidos
        ├── unit/                    # Configuración TypeScript y reservas .pending
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

## 6. Infraestructura de pruebas

Vitest descubre automáticamente archivos `.test.ts`, `.test.tsx`, `.spec.ts` y `.spec.tsx` dentro de `frontend/src/test/`. `frontend/e2e/` no forma parte de ese descubrimiento. Jest se ejecuta desde el paquete backend y conserva sus pruebas en `backend/tests/`.

El entorno predeterminado del frontend es jsdom. Las pruebas de configuración TypeScript y del proxy declaran `@vitest-environment node`, porque utilizan el compilador, el sistema de archivos o el servidor de Vite. `globals: false` hace que cada test importe sus funciones desde `vitest`.

`src/test/setup.ts`:

1. Registra los matchers de `@testing-library/jest-dom/vitest`.
2. Inicia la instancia compartida de MSW antes de las pruebas del archivo.
3. Después de cada prueba, limpia el DOM y restablece los handlers iniciales de MSW.
4. Cierra MSW al terminar.

La instancia se exporta desde `src/test/mocks/server.ts`. Actualmente se crea sin handlers iniciales. Cada prueba que necesite simular una respuesta utiliza `server.use(...)`; los handlers compartidos y fixtures se agregarán con los contratos de H2. La configuración `onUnhandledRequest: "error"` hace fallar las solicitudes no previstas. Para una petición que debe llegar a un servidor real de la propia prueba, se utiliza `passthrough()` explícitamente, como en el test del proxy.

La API propia de Vitest está desactivada mediante `api: false`. Esto es independiente de la API Express del proyecto.

### Pruebas implementadas

| Archivo | Casos | Qué comprueba |
| --- | --- | --- |
| [App.test.tsx](frontend/src/test/components/App.test.tsx) | 2 | Montaje y consulta accesible del encabezado; aislamiento del DOM entre ejecuciones. Los casos comparten cuerpo mediante `test.each`. |
| [msw.test.ts](frontend/src/test/integration/msw.test.ts) | 2 | Interceptación de una consulta de productos y reinicio de handlers entre pruebas. |
| [proxy.test.ts](frontend/src/test/integration/proxy.test.ts) | 2 | Una petición real a Vite llega a la API simulada, conservando `/productos` o `/pedidos`. |
| [configuracionTypescript.test.ts](frontend/src/test/unit/configuracionTypescript.test.ts) | 1 | La solución de TypeScript incluye los tests, el setup y la configuración de Vitest. |

Son **7 tests de infraestructura en 4 archivos**. Las pruebas normales no necesitan Express levantado. El test del proxy inicia y cierra un servidor Vite temporal en `127.0.0.1`, con un puerto asignado por el sistema, y MSW simula la API. La compilación comprueba los tipos reales de la aplicación, las configuraciones y los tests.

## 7. Archivos `.pending` y comienzo de una funcionalidad

Los 14 archivos de tests vacíos de la plantilla tienen el sufijo `.pending`. Conservan la estructura prevista, Vitest no los ejecuta y no cuentan como cobertura ni como tests omitidos implementados. No se agregaron `test.todo(...)` a las tareas de los demás integrantes.

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

Los placeholders de componentes, estilos, utilidades y contratos fuera de los tests siguen con sus extensiones originales y no tienen implementación. Cada responsable los completa junto con sus pruebas.

## 8. Trabajo con TDD y commits

La unidad de avance es un comportamiento concreto. Puede requerir varios archivos de prueba e implementación, pero no se adelantan otras funcionalidades ni se completan tareas de otro integrante.

- **RED:** el runner funciona y la prueba falla por la capacidad que falta. Un error de sintaxis o una importación equivocada se corrige antes de registrar la evidencia del RED.
- **GREEN:** se implementa la solución mínima y se verifica la misma prueba, conservando la cobertura existente.
- **REFACTOR:** se elimina duplicación o se mejora la organización manteniendo el comportamiento. Se hace cuando existe una mejora justificable.

Ejemplos del formato usado en esta base:

```text
RED test: comprobar aislamiento de handlers de MSW entre pruebas
GREEN chore: reiniciar los handlers de MSW después de cada prueba
REFACTOR test: parametrizar las pruebas de montaje y aislamiento del DOM
```

Los cambios de documentación, dependencias o mantenimiento que no constituyen una etapa de TDD usan su tipo sin forzar un prefijo, por ejemplo `docs: actualizar la guía del frontend` o `chore: instalar Zod 4 con versión exacta`.

Cada integrante guarda sus propios commits. Durante el trabajo asistido, el asistente prepara cambios y verificaciones y se detiene entre etapas; no crea commits. Se conservan los commits RED, GREEN y REFACTOR en el historial y se evita un squash que borre esa evidencia. El flujo de integración y la revisión cruzada están en la planificación.

Las consultas de componentes se hacen por rol, etiqueta o texto. `getByTestId` se reserva para los casos sin una alternativa adecuada. Las futuras pruebas de interacción pueden crear una sesión con `userEvent.setup()`; la dependencia ya está instalada.

## 9. Qué falta y quién lo integra

| Responsable | Trabajo que sigue pendiente |
| --- | --- |
| Homero | Cliente HTTP único, esquemas Zod y tipos inferidos, fixtures y handlers de contratos, carga del menú y errores de H2/H3. Corrección del JSON inválido en el backend. |
| Matias | Ampliación de productos en API, selector de café, pastelería y Bootstrap personalizado con SASS. |
| Federico | Context, reducer, interfaz del carrito, formato de precios y Playwright. |
| Nicolas | Mesas y pedidos en API, estado predeterminado, reset/seed, lectura de URL, confirmación y seguimiento. |

Homero integrará el proveedor del carrito cuando Federico lo entregue y coordinará el comando `test:e2e` con su configuración de Playwright. Los contratos de productos, pedidos, mesas y seed se acuerdan con el equipo antes de cerrar los esquemas; las propuestas de la planificación todavía no son respuestas implementadas de la API.

El cliente HTTP será el único módulo que hará llamadas de la aplicación a la API. Los precios unitarios y el total confirmado vendrán de la API; los futuros subtotales del carrito serán orientativos. No se reproducirán las fórmulas del dominio en el frontend.

## 10. Estado de verificación y cierre de la base

Durante la preparación se verificaron `npm test`, `npm run build` y `npm run lint` desde la raíz: 38 tests de backend y 7 de frontend, compilación de ambas aplicaciones y lint correcto. También se verificó el arranque aislado de Vite al inicializar el frontend. Esto no certifica las funcionalidades del TP3 ni los E2E, todavía pendientes.

El cierre previo a compartir la base incluye ejecutar `npm run install:all` para comprobar una instalación limpia con los lockfiles y verificar el arranque de ambas aplicaciones siguiendo el README. Esa comprobación final queda pendiente al momento de esta actualización documental.

La auditoría de dependencias del frontend reporta actualmente tres paquetes afectados en la cadena de Vitest 3: `@vitest/mocker` (moderado), `tinypool` y `vitest` (críticos). Para consultar el detalle desde la raíz:

```bash
npm --prefix frontend audit
```

La versión mayor 3 de Vitest está fijada por la consigna; npm propone una actualización mayor para resolver estos avisos. El cambio de versión debe coordinarse con ese requisito. La instalación de Zod no modificó las versiones de Vitest ni resolvió estos avisos.
