# Planificación del TP3 — Cafetería Origen

Integrantes: **Homero, Federico, Matias y Nicolas**.  
Fuente: `TP3.pdf`, páginas 1 a 5.  
Objetivo: construir el menú de mesa sobre la API del Parcial I, con los cambios mínimos pedidos, desarrollo con TDD y pruebas en todos los niveles exigidos.

## 1. Estado actual del repositorio

El proyecto tiene una API en Node.js, Express y TypeScript con `strict: true`, organizada en modelos, datos, servicios, controladores y rutas. Los productos y pedidos se almacenan en memoria.

La API, sus configuraciones, dependencias y pruebas están en `backend/`. Ambos GET de productos ya exponen el contrato ampliado de Matias. El frontend lo consume con Zod y muestra el menú con carga, errores y reintento. `App` monta `CarritoProvider`; reducer, Context, subtotales y formato de precios están implementados, con tipos y exportaciones corregidos. La interfaz del carrito sigue pendiente. El `package.json` raíz agrupa los comandos de ambos paquetes.

La documentación se centraliza en la raíz: [README.md](README.md) es la entrada general y describe la API actual; [FRONTEND.md](FRONTEND.md) explica la base del frontend, las pruebas y el flujo TDD. Esta planificación conserva las tareas y propuestas del TP3. Las propuestas de contratos no deben confundirse con funcionalidades ya implementadas.

| Área | Qué existe | Qué falta para TP3 |
| --- | --- | --- |
| Productos | Ambos GET ampliados, 22 casos HTTP para los 20 productos y 404, precios fijos y metadatos completos. Buscador con IDs exactos en sus pruebas. | Selector y pastelería en la interfaz (M2), con sus pruebas. |
| Consulta de productos | `esquemaProducto` distingue café/pastelería; `listarProductos()` y `useMenu` conservan el contrato completo. Tipos y fixtures derivados del esquema. | Funciones, contratos y mocks de pedidos; conectar los componentes de selección cuando estén listos. |
| Pedidos | Alta y consulta por ID; estado predeterminado `pendiente`; rechazo de estados, estructuras, IDs e importes incorrectos antes de guardar, con conservación de pedidos y facturación. | Aceptar, validar, guardar y devolver `mesaId` opcional. |
| Errores | Middleware centraliza validaciones e IDs mal formados (400), JSON inválido (400), cuerpo demasiado grande (413) y fallo interno (500 genérico). El menú permite reintentar. | Validación de mesas y errores de confirmación que conserven el carrito. |
| Conexión desde el navegador | Proxy Vite para `/productos` y `/pedidos`. `App` monta `MenuPage`, que consulta a través del cliente HTTP único. | Funciones y pantallas de pedidos; conexión de producción al preparar el despliegue. |
| Preparación de E2E | Función interna `reiniciarPedidos()` que vacía pedidos y reinicia IDs. | Endpoints HTTP de reset y seed disponibles únicamente con `NODE_ENV=test`. |
| Frontend | Menú con nombres, carga, error y reintento; proveedor del carrito probado; instalación limpia, arranque conjunto y cliente real registrados. | Selector, pastelería, carrito visual, pedidos, Bootstrap/SASS y Playwright. |
| Regresión | 80 tests de backend en 15 suites y 93 de frontend en 18 archivos aprobados; ambos paquetes compilan y lint pasa. | Funcionalidades restantes, pruebas en navegador y E2E. |

Desde la actualización documental del PR #19 (estado hasta #17), Matias conectó el servicio a los endpoints en #18, sin aumentar la cantidad de tests. Homero agregó 19 tests en #20 (16 del esquema ampliado y tres rechazos de la consulta) y uno en #21 para el proveedor compartido: el frontend pasó de 73 a 93 casos.

Verificación del **6 de noviembre de 2026**, sobre `fix/correcciones-generales` hasta `013c044`: `npm test` pasó con **80 tests de backend y 93 de frontend (173 en total)**; build completo y lint también pasaron. La instalación limpia quedó registrada el 5 de noviembre. El 6 se iniciaron los scripts de desarrollo en 3000/5173: el cliente real validó 20 productos a través del proxy y se verificaron creación, consulta y rechazo de pedidos. Los servidores propios se cerraron al finalizar. Las auditorías de producción están en cero en ambos paquetes; desarrollo conserva 20 afectados en backend y 9 en frontend, sin altos ni críticos. Quedan **8 archivos `.pending`**, que no representan cobertura implementada.

La tabla histórica siguiente registra lo integrado en `develop`. Las correcciones posteriores están verificadas en `fix/correcciones-generales`, preparadas para PR. El ID mal formado ya está corregido y el arranque conjunto registrado. Mesas, pantallas restantes y E2E siguen siendo tareas pendientes del TP3; también quedan los avisos de desarrollo documentados.

### Avances integrados en `develop`

| Rama | PR | Resultado |
| --- | --- | --- |
| `feature/inicializacion` | #1 | Separación backend/frontend, herramientas, proxy, scripts y documentación inicial. |
| `feature/api-json-invalido` | #3 | Middleware y prueba de JSON inválido: 400 con mensaje claro; errores internos conservan 500. |
| `feature/contrato-errores-api` | #4 | Esquema Zod `{ error: string }`, tipo `ErrorApi` con `z.infer` y diez pruebas. |
| `feature/buscador-productos` | #2 | Campos internos de productos, filtros de búsqueda y tres pruebas de backend. No amplía todavía las respuestas de los endpoints. |
| `feature/cliente-http` | #5 | Base `solicitarJson()` y manejo de errores HTTP con validación Zod; tres pruebas MSW para 400, 404 y 500. |
| `feature/errores-contrato-http` | #6 | Mensaje claro ante errores sin campo `error`, con mensaje numérico o con respuesta nula. Tres pruebas nuevas. |
| `feature/respuestas-no-json` | #7 | Mensaje claro ante HTML, JSON incompleto y cuerpo vacío. Tres pruebas nuevas. |
| `refactor/cliente-http` | #8 | Separación de la interpretación de errores y preparación común de handlers GET en las pruebas. |
| `feature/fallos-red` | #9 | Mensaje claro ante fallos de conexión, una prueba nueva y extracción de la petición a una función interna. |
| `docs/documentacion-general` | #10 | Primera actualización de avances y tareas completadas. |
| `feature/validacion-respuestas` | #11 | Validación genérica de respuestas exitosas, tipo inferido y cuatro pruebas; refactor de la preparación de MSW de esas pruebas. |
| `feature/mocks-errores-compartidos` | #12 | Fixtures de errores y handler reutilizable GET/POST; cuatro pruebas y refactor de las opciones de petición de esos casos. |
| `docs/documentacion-general` | #13 | Segunda actualización documental. |
| `feature/consulta-productos` | #14 | Homero: esquemas base, tipos inferidos, fixture, handler y consulta validada; 18 tests y refactores de escenarios. |
| `feature/respuestas-productos` | #15 | Matias: interfaz discriminada, normalización, servicio de respuestas, descripciones y dos tests de café; conectado a HTTP después en #18. |
| `feature/f1-carrito` | #16 | Federico: reducer, Context, hook, subtotales y formato; 13 tests y ticks de F1. Integración de tipos/lint corregida después en #20. |
| `feature/carga-menu` | #17 | Homero: `MenuPage` integrada en `App`, `useMenu`, indicador/error accesibles y reintento; seis tests del menú y uno nuevo de App. |
| `docs/documentacion-general` | #19 | Actualización hasta #17 y registro de los problemas de integración, ya corregidos. Se reutiliza esta rama para el estado hasta #21. |
| `feature/actualizar-get-productos` | #18 | Matias: conecta normalización y respuestas ampliadas a ambos GET, actualiza tests y conserva el 404. |
| `fix/integracion-carrito` | #20 | Homero: contrato ampliado Zod y tipos inferidos, consulta/mocks actualizados, fixtures compartidos, corrección de import/mocks del carrito y separación Context/proveedor. 19 tests nuevos. |
| `feature/proveedor-carrito` | #21 | Homero: monta `CarritoProvider` en `App` y prueba el estado compartido entre botón y resumen independientes. Ciclo RED/GREEN/REFACTOR. |
| `docs/documentacion-general` | #22 | Documentación del estado hasta #21 y del contrato de productos y carrito. |

### Correcciones en `fix/correcciones-generales`, pendientes de PR

Homero preparó los siguientes avances sin modificar las fórmulas ni los 20 productos de Matias:

- [x] Cantidades seguras y control de subtotales/total antes de guardar; cuatro casos HTTP de rechazo conservan pedidos y facturación.
- [x] Estructura del cuerpo e ítems con mensajes claros; tres casos HTTP y helper compartido `validarObjeto()`.
- [x] Estados enviados válidos y `pendiente` por defecto; cinco casos HTTP incluyen creación y consulta por ID y conservación de un estado explícito.
- [x] `ErrorValidacion`, middleware centralizado y respuestas 400/413/500; dos casos nuevos cubren tamaño e incidente interno simulado.
- [x] Cobertura permanente del catálogo: 22 casos HTTP y fixture independiente; los tres tests del buscador ahora comprueban resultados completos.
- [x] body-parser 2.4.0 y qs 6.17.1; override de tinypool 2.1.2 para Vitest 3.2.7; ts-jest 29.4.15 e `isolatedModules` con `strict` conservado.
- [x] Instalación limpia, pruebas en procesos/hilos y repetición del menú en watch, registradas en [FRONTEND.md](FRONTEND.md#dependencias-de-desarrollo-y-auditoría).
- [x] Validar `productoId` como entero positivo seguro antes de usarlo en búsquedas o mensajes. Tres tests HTTP cubren ID ausente, objeto simple y objeto con `toString` numérico: responden 400 y conservan los datos. El ciclo RED/GREEN/REFACTOR incluye `validarIdProducto()`; el 500 reproducido quedó corregido.
- [x] Registrar el arranque conjunto en 3000/5173: página y módulo de entrada servidos, cliente real/Zod con 20 productos, pedido sin mesa ni estado con 201/`pendiente`/17220, GET por ID y rechazos 400. Se conservaron el pedido válido y su facturación y se cerraron los procesos propios. No reemplaza las pruebas del navegador ni valida mesa 4.

H2 conserva pendientes los contratos de pedidos; H3 espera selector y pastelería. M1 tiene cubierta su API en esta rama; F1 está integrado, mientras F2 y F3 siguen pendientes. Los avisos de desarrollo restantes requieren migraciones revisadas o un parche mantenido; no se consideran resueltos.

El reparto anterior del Parcial I sirve como referencia de experiencia. Para equilibrar TP3, cada integrante tendrá implementación y pruebas propias; Federico pasa a ocuparse del carrito y los E2E, porque los reportes ya están implementados.

## 2. Acuerdos iniciales y contrato compartido

Están implementadas infraestructura, contrato ampliado de productos, errores, carga del menú y operaciones del carrito compartido. Faltan los contratos de pedidos/mesas y seed y las pantallas restantes.

1. **Ubicación y herramientas:** `frontend/` ya utiliza Vite + React + TypeScript estricto y una regla de ESLint que rechaza `any` explícito. Vite 7, Vitest 3, MSW 2 y Zod 4 están instalados con versiones exactas y lockfile. El requisito de Node es `^20.19.0 || >=22.12.0`. La API mantiene Jest y Supertest en su propio paquete.
2. **Productos, contrato vigente:** ambos GET conservan `id`, `nombre` y `precio`. Para café: `tipo: "cafe"`, `tipoCafe: "expreso" | "filtrado"`, `tamaño` y `variedad: { nombre, descripcion }`. Para pastelería: `tipo: "pasteleria"` y variedad textual. Zod y MSW ya usan esta estructura. Reemplaza la propuesta anterior con `tipo: "expreso"` y `tamanio`; el PDF permite variar nombres conservando la información. `gramosCafe` no se expone ni se necesita para calcular precios en el frontend.
3. **Mesas:** acordar un conjunto explícito de mesas válidas que incluya la 4 del ejemplo. No hay una cantidad de mesas definida en el PDF. `mesaId` omitido significa retiro en barra; una mesa no existente enviada a la API produce 400 o 404. Un valor ausente o inválido de `?mesa` en la URL se interpreta como barra y no se envía como una mesa inválida.
4. **Pedidos, contrato objetivo del TP3:** aceptar `{ mesaId?, items: [{ productoId, cantidad }] }` y devolver `{ mensaje, pedido }`, con `id`, `items`, `estado`, `total` y `mesaId` cuando corresponda. `GET /pedidos/:id` debe devolver directamente el pedido. **Disponible en esta rama:** estado predeterminado `pendiente`, validación de ítems e IDs y total. **Pendiente:** `mesaId`; no confundir este objetivo con el contrato ya implementado.
5. **Precios:** la API define los precios unitarios y el total confirmado. El carrito solo multiplica los precios recibidos por las cantidades y suma subtotales orientativos. La confirmación muestra exactamente el total devuelto por la API.
6. **Red y validación:** `solicitarJson()` devuelve `unknown` y maneja HTTP/JSON/red. `solicitarValidado()` aplica Zod y devuelve el tipo inferido. `listarProductos(): Promise<Productos>` usa `esquemaProductos`, una lista de la unión discriminada de café/pastelería. `useMenu` conserva esos datos; los componentes no hacen `fetch` directo. Quedan pendientes los esquemas y funciones de pedidos.
7. **Conectividad:** el proxy de Vite hacia Express ya está configurado para `/productos` y `/pedidos`. README y FRONTEND documentan los puertos y las rutas de desarrollo; la preparación E2E se completará con Federico y Nicolas.
8. **Seguimiento:** ofrecer un botón para consultar `GET /pedidos/:id` sin recargar la página. El PDF no exige implementar un endpoint nuevo para cambiar el estado.
9. **Preparación de tests:** acordar respuestas de `POST /__test__/reset` y `POST /__test__/seed`, y datos iniciales deterministas. Ambas rutas quedan ausentes fuera de `NODE_ENV=test`.

## 3. Resumen del reparto

| Integrante | Responsabilidad principal | Entrega verificable | Revisión cruzada |
| --- | --- | --- | --- |
| Homero | Base del frontend, cliente HTTP, Zod, carga del menú, errores comunes y documentación. | Aplicación preparada, respuestas validadas, carga con reintento y comandos documentados. | Revisa carrito y E2E de Federico. |
| Federico | Context y reducer del carrito, interfaz del carrito y recorrido E2E real. | Carrito completo, pruebas de sus operaciones y Playwright con reset/seed. | Revisa infraestructura y cliente HTTP de Homero. |
| Matias | Contrato de productos en API, selector de café, pastelería y estilos compartidos. | Productos estructurados, selección en tres pasos y componentes accesibles a 375 px. | Revisa pedidos y mesas de Nicolas. |
| Nicolas | Mesas y pedidos en API, reset/seed, lectura de URL, confirmación y seguimiento. | Pedidos con mesa o barra, confirmación y consulta de estado; preparación HTTP para E2E. | Revisa productos y selección de Matias. |

Cada integrante escribe primero los tests de su funcionalidad y luego la implementación. La responsabilidad de Federico sobre E2E no reemplaza las pruebas que cada uno debe entregar sobre su propio código.

## 4. Tareas de Homero

### H1. Preparar el frontend y las herramientas

- [x] Inicializar `frontend/` con Vite, React y TypeScript, con `strict: true` y sin `any`.
- [x] Fijar las versiones del stack exigido y configurar Vitest, React Testing Library, user-event, jest-dom, entorno DOM y MSW 2.
- [x] Separar el descubrimiento de pruebas: Jest ejecuta las de la API y Vitest las del frontend; evitar que uno recoja las del otro.
- [x] Configurar el proxy de Vite y scripts para desarrollo, compilación y pruebas.
- [x] Preparar la estructura de módulos y el montaje inicial de `App`.
- [x] Integrar comandos raíz para que `npm test` ejecute las pruebas de API y frontend sin necesitar un servidor API levantado.
- [x] Alinear los tipos del carrito con Zod y resolver lint separando Context/proveedor (PR #20).
- [x] Montar `CarritoProvider` en `App` y probar la actualización compartida entre dos consumidores (PR #21).
- [ ] Integrar `npm run test:e2e` con la configuración de Playwright de Federico.
- [x] Verificar la instalación limpia de ambos paquetes con `npm run install:all` (5 de noviembre, rama de correcciones).
- [x] Registrar el arranque conjunto de ambas aplicaciones y la conexión del cliente real a través del proxy (6 de noviembre, puertos 3000/5173).

La guía está en [FRONTEND.md](FRONTEND.md). Están implementados cliente, productos ampliados, mocks, menú y proveedor. Tests, compilación y lint pasan; instalación limpia y arranque conjunto están registrados. La integración del comando E2E sigue pendiente con F3.

### H2. Implementar contratos y cliente HTTP

- [x] Crear `esquemaError` para validar el contrato `{ error: string }`.
- [x] Derivar el tipo `ErrorApi` con `z.infer`.
- [x] Preparar `solicitarJson(ruta, opciones?)` como base del módulo HTTP, con rutas del mismo origen y opciones `RequestInit`.
- [x] Detectar respuestas HTTP fallidas, validar su cuerpo con `esquemaError` y lanzar un error que conserve el mensaje de la API.
- [x] Cubrir el contrato de errores con diez pruebas unitarias y el cliente con tres pruebas MSW para 400, 404 y 500.
- [x] Conservar esquemas y tipos base de los campos comunes de productos.
- [x] Implementar `esquemaProducto` y `esquemaProductos` para el contrato ampliado y derivar `Producto` y `Productos` con `z.infer`.
- [ ] Crear los esquemas de creación y consulta de pedido según el contrato de N1.
- [x] Implementar `solicitarValidado()` para validar respuestas exitosas con el esquema recibido y devolver su tipo con `z.infer`.
- [x] Informar con un mensaje claro cuando una respuesta de error no cumpla el contrato: campo ausente, mensaje no textual o respuesta nula.
- [x] Informar de manera comprensible respuestas HTML, JSON incompleto y cuerpo vacío.
- [x] Informar de manera comprensible un fallo de conexión con la API.
- [x] Completar diez pruebas del cliente HTTP y cuatro de validación genérica de respuestas exitosas.
- [x] Preparar fixtures `erroresApi` y `crearHandlerError()` con MSW 2, respetando rutas, métodos, códigos y mensajes del backend.
- [x] Verificar los handlers compartidos con cuatro escenarios: ID de pedido inválido, producto inexistente, pedido sin ítems y error interno.
- [x] Entregar `listarProductos()` mediante el cliente HTTP con validación de la lista.
- [x] Preparar `productosApi` y `crearHandlerProductos()` para respuestas exitosas del contrato actual, incluidas listas vacías.
- [x] Cubrir productos con 11 tests base, 16 del esquema ampliado, dos del handler y ocho de la consulta.
- [x] Actualizar `listarProductos()`, `useMenu`, handler y fixtures al contrato ampliado; reutilizar `cafeApi` y `pasteleriaApi` en los tests del contrato y carrito.
- [ ] Entregar las funciones de crear pedido y consultar pedido por ID, con fixtures y handlers de éxito.
- [ ] Cubrir el cuerpo real enviado a `POST /pedidos` cuando se implemente su función.

H2 ya dispone de contratos de errores y productos ampliados, cliente, consulta y mocks reutilizables. `productosApi` reúne `cafeApi` y `pasteleriaApi` (IDs 5 y 19) con todos sus campos; no es el catálogo completo. Los módulos de pedidos siguen vacíos. Los casos de API caída y respuesta inválida del menú se registraron como cobertura existente, sin inventar ciclos RED/GREEN.

### H3. Cargar el menú y reforzar errores de API

- [x] Modelar la carga como unión discriminada en `useMenu`: `cargando`, `error` con mensaje o `listo` con productos.
- [x] Mostrar indicador accesible, mensaje de error y botón de reintento.
- [x] Crear `pages/MenuPage.tsx`, mostrar los nombres recibidos y montarla en `App`.
- [x] Extraer `IndicadorCarga`, `MensajeError` y `useMenu`; parametrizar los escenarios de recuperación.
- [x] Probar con MSW carga correcta, error 500 con reintento, API caída y respuesta incompatible: seis tests del menú y uno nuevo de App.
- [ ] Conectar los productos con el selector y la pastelería de Matias cuando estén disponibles.
- [x] Ajustar el middleware de API para responder 400 con `{ error }` ante JSON inválido; conservar 500 para errores internos y añadir tests.

### H4. Documentar y coordinar la integración

- [x] Centralizar en README y FRONTEND la instalación, ejecución, configuraciones, comandos y pruebas disponibles de la base, junto con el contrato actual de la API.
- [x] Actualizar README, FRONTEND y planificación hasta el PR #21, registrando la integración HTTP, las correcciones y el proveedor montado.
- [x] Documentar el contrato público ampliado de productos, con ejemplos de café/pastelería y sus esquemas Zod.
- [ ] Completar los contratos HTTP definitivos y los comandos E2E cuando se implementen.
- [ ] Documentar las decisiones de mesas, el ejemplo de pedido del PDF y los comandos de reset/seed para E2E.
- [ ] Coordinar la comprobación final de scripts, compilación y ausencia de conflictos entre configuraciones.

**Archivos previstos:** `frontend/package.json`, configuraciones Vite/Vitest/TypeScript, `frontend/src/api/`, `frontend/src/test/`, componente de carga del menú, `backend/src/middleware/errorHandler.ts`, scripts raíz, `README.md` y `FRONTEND.md`. Toda la documentación del proyecto se mantiene en la raíz.

**Aceptación:** el frontend puede consumir la API mediante el cliente, rechaza datos que no cumplen el contrato, permite reintentar la carga y las pruebas normales funcionan sin levantar Express.

## 5. Tareas de Federico

### F1. Desarrollar el carrito con Context y reducer puro

- [x] Crear el Context y un reducer puro para agregar, incrementar, decrementar y quitar productos.
- [x] Acumular cantidades al agregar el mismo producto; acordar que decrementar desde 1 quite el ítem y nunca genere cantidades negativas.
- [x] Mantener por ítem `productoId`, `nombre`, `precio` y `cantidad`.
- [x] Calcular subtotales orientativos por ítem y subtotal general, sin reproducir las fórmulas de precios del dominio.
- [x] Implementar y probar una función común de formato de precio para que Matias y Nicolas la reutilicen.
- [x] Escribir tests unitarios de cada acción, productos repetidos, eliminación, carrito vacío y subtotales.
- [x] Agregar `CarritoProvider`, `useCarrito` y cuatro pruebas de interacción con un componente de prueba.
- [x] Alinear los imports y mocks del carrito con el tipo `Producto` inferido del contrato ampliado; corrección de Homero en PR #20.
- [x] Resolver `react-refresh/only-export-components` separando `carrito.context.ts` de `CarritoContext.tsx`; corrección de Homero en PR #20.

F1 conserva los 13 tests de Federico: seis del reducer, cuatro del Context, dos de subtotales y uno de formato. Las operaciones son `AGREGAR`, `RESTAR` y `ELIMINAR`; repetir un producto acumula cantidad y restar desde 1 lo quita. `formatoPrecio(1000)` devuelve `$1.000`. Homero corrigió su integración en #20 y montó el proveedor con un test adicional de App en #21. La interfaz F2 y los E2E F3 siguen pendientes; los componentes de prueba no son la interfaz final del carrito.

### F2. Construir la interfaz del carrito

- [ ] Mostrar producto, cantidad, subtotal por ítem y subtotal general orientativo.
- [ ] Agregar controles accesibles para sumar, restar y quitar; mostrar el estado vacío.
- [ ] Deshabilitar la confirmación si el carrito está vacío y exponer a Nicolas los ítems para enviar el pedido.
- [ ] Acordar con Nicolas que el carrito se vacía únicamente después de una confirmación exitosa; cualquier fallo conserva su contenido.
- [ ] Probar con Testing Library y user-event agregar, sumar, restar, quitar y bloquear la confirmación en vacío.
- [ ] Revisar con Matias que el carrito respete el ancho de 375 px.

### F3. Implementar los E2E con API real

- [ ] Configurar Playwright y el arranque de frontend y API reales con `NODE_ENV=test` para la API.
- [ ] Ejecutar `POST /__test__/reset` y `POST /__test__/seed` antes de cada test; coordinar datos y contrato con Nicolas.
- [ ] Cubrir al menos un recorrido: abrir `/?mesa=4`, elegir café, agregar pastelería, revisar carrito, confirmar y ver número, estado y total del pedido.
- [ ] Consultar el estado desde la confirmación y comprobar que funciona sin recargar la página.
- [ ] Ejecutar el recorrido con viewport de 375 px y verificar ausencia de scroll horizontal.
- [ ] Conectar `npm run test:e2e` con Homero y documentar requisitos de instalación y ejecución de Playwright.

**Archivos previstos:** `frontend/src/context/`, reducer y componentes de carrito, utilidad de formato, pruebas unitarias y de componentes, configuración Playwright y `frontend/e2e/`.

**Aceptación:** el carrito conserva cantidades correctas, no permite confirmar vacío y el recorrido real es repetible con reset/seed antes de cada test.

## 6. Tareas de Matias

### M1. Ampliar los productos de la API

- [x] Incorporar en los modelos los campos internos `tipo`, `tipoCafe`, `tamaño` y `variedad` según corresponda.
- [x] Agregar el servicio interno `buscarProducto()` con filtros opcionales y tres pruebas de backend.
- [x] Mantener los 20 productos, IDs y fórmulas actuales de `calcularPrecio()`.
- [x] Crear `InterfazPropiedadesProducto` discriminada para normalizar cafés y pastelería; renombrar la interfaz de búsqueda para distinguir ambas responsabilidades.
- [x] Incorporar descripciones de Brasil, Colombia y Etiopía en `formar-respuesta.service.ts`.
- [x] Implementar `normalizarInput()`, `formarRespuestaObjeto()` y `formarRespuestaArray()`.
- [x] Agregar dos tests unitarios del armado de respuestas: un café y una lista de dos cafés.
- [x] Devolver tipo, bebida, tamaño, origen y descripción en el JSON de cafés (PR #18).
- [x] Ampliar ambos GET con las representaciones de café y pastelería del servicio de respuestas (PR #18).
- [x] Exponer campos separados para seleccionar sin extraer palabras de `nombre`.
- [x] Actualizar tests de ambos GET para el primer expreso y conservar el 404.
- [x] Disponer de ejemplos públicos de café/pastelería ya documentados y usados por Zod/MSW en #20.
- [x] Completar cobertura HTTP de filtrados y pastelería, restaurar la longitud esperada de 20 productos y reforzar la regresión de precios/campos (rama de correcciones de Homero).

El PR #2 agrega búsqueda interna, #15 prepara respuestas y #18 las conecta a ambos GET. La rama de correcciones restaura la longitud 20 y comprueba todos los campos y precios del listado y de los 20 detalles, además del 404: 22 casos HTTP. Sus datos esperados están en `backend/tests/fixtures/productos.ts`, independientes del código de producción. Los dos tests unitarios del servicio siguen usando cafés; los HTTP cubren también filtrados y pastelería. Los textos y ejemplos están en [README.md](README.md#contrato-público-de-productos).

**Ejemplo vigente:** `GET /productos/5` devuelve el contrato ya consumido por el frontend:

```json
{
  "id": 5,
  "nombre": "Expreso Mediano Colombia",
  "tipo": "cafe",
  "tipoCafe": "expreso",
  "tamaño": "mediano",
  "variedad": {
    "nombre": "colombia",
    "descripcion": "Acidez muy viva, cuerpo ligero y notas frutales"
  },
  "precio": 7360
}
```

Este contrato usa `tipo: "cafe"`, bebida en `tipoCafe`, `tamaño` con ñ y orígenes en minúsculas dentro de `variedad`. La pastelería usa `tipo: "pasteleria"` y variedad textual. La propuesta anterior con `tipo: "expreso"` y `tamanio` quedó reemplazada; el PDF permite variar nombres conservando la información. Zod, consulta, menú y fixtures ya están alineados.

### M2. Implementar el selector de café y la pastelería

- [ ] Crear una función pura que encuentre el producto por bebida, tamaño y origen entre los productos recibidos; probar combinaciones y ausencia de coincidencia.
- [ ] Implementar las elecciones de expreso o filtrado; pocillo, mediano o taza grande; Colombia, Etiopía o Brasil.
- [ ] Mostrar las descripciones de origen y, una vez elegidos bebida y tamaño, el precio recibido de API para cada origen.
- [ ] Deshabilitar agregar hasta completar las tres elecciones y encontrar una combinación válida. Al cambiar opciones, evitar conservar una selección incompatible.
- [ ] Agregar el producto elegido al Context de Federico.
- [ ] Mostrar muffin de chocolate y porción de torta selva negra, cada uno con precio de API y botón de agregar.
- [ ] Probar componentes: botón deshabilitado, selección completa, cambio de selección, precios por origen y agregado de pastelería.

### M3. Preparar estilos y accesibilidad compartida

- [ ] Incorporar Bootstrap personalizado con SASS; declarar las variables de colores de la cafetería antes de importar Bootstrap.
- [ ] Definir estilos y distribución de la página para que todos puedan reutilizarlos.
- [ ] Dar etiquetas y nombres accesibles a controles; coordinar con Federico y Nicolas la revisión de sus componentes.
- [ ] Comprobar selector, pastelería y página integrada a 375 px sin scroll horizontal.

**Archivos principales:** `backend/src/models/`, `backend/src/data/catalogo.ts`, `backend/src/controllers/productos.controllers.ts`, tests de productos en `backend/tests/` y nuevos módulos de selección, pastelería y estilos en `frontend/src/`.

**Aceptación:** se elige cualquier café por sus tres atributos, los precios salen de la API y ambas opciones de pastelería se agregan al carrito. Por ejemplo, el expreso mediano de Colombia muestra **$7.360**.

## 7. Tareas de Nicolas

### N1. Adaptar mesas y pedidos en la API

- [ ] Definir el conjunto de mesas válidas y agregar `mesaId` opcional al modelo, almacenamiento, servicio y respuesta de pedidos.
- [ ] Aceptar pedidos sin mesa para retirar en barra; rechazar mesa inválida o inexistente con 400 o 404 y `{ error }`, sin guardar el pedido.
- [x] Asignar `pendiente` por defecto y conservar estados explícitos válidos (corregido y probado por Homero en esta rama).
- [x] Validar cuerpo como objeto, ítems como arreglo no vacío y cada ítem como objeto; rechazar cantidades e importes inseguros antes de guardar.
- [x] Rechazar un ID numérico de producto inexistente y cantidades inválidas; conservar pruebas previas y agregar cobertura de estados y estructuras.
- [x] Completar la validación de tipo/formato de `productoId`, con pruebas de ID ausente y objetos; impedir el 500 reproducido con `{"toString":0}` (corregido por Homero en esta rama).
- [ ] Mantener `GET /pedidos/:id` con estado, ítems y total; agregar `mesaId` cuando exista y mantener consistente el listado de pedidos.
- [ ] Escribir tests de pedidos con mesa y barra, mesa inexistente, cuerpo inválido, producto inexistente y consulta por ID.
- [ ] Verificar el ejemplo: mesa 4, producto 5 × 2 y producto 19 × 1 devuelve 201, `pendiente` y total **17220**.

### N2. Exponer reset y seed para E2E

- [ ] Crear `POST /__test__/reset` y `POST /__test__/seed`, registradas únicamente cuando `NODE_ENV=test`.
- [ ] Reutilizar `reiniciarPedidos()` para vaciar los pedidos y reiniciar IDs; definir un seed determinista con mesas y datos necesarios para el recorrido.
- [ ] Probar los efectos de reset y seed y la ausencia de ambas rutas fuera del entorno de test.
- [ ] Entregar a Federico las rutas y datos de preparación antes de conectar Playwright.

### N3. Implementar mesa, confirmación y seguimiento en el frontend

- [ ] Leer `?mesa=N` mediante una función pura con tests: valor válido, ausencia, texto, cero, negativos, decimales y mesa fuera del conjunto permitido.
- [ ] Mostrar la mesa en el encabezado o indicar retiro en barra si falta o es inválida.
- [ ] Enviar `POST /pedidos` a través del cliente de Homero con los ítems del carrito y `mesaId` cuando corresponda.
- [ ] Indicar envío en curso y bloquear confirmaciones repetidas mientras se espera la respuesta.
- [ ] Mostrar ID, estado y total devueltos por API; vaciar el carrito solo después del éxito.
- [ ] Mostrar el mensaje devuelto por la API si rechaza el pedido, conservando el carrito. Mostrar también errores de red o contrato sin perderlo.
- [ ] Agregar consulta de estado con `GET /pedidos/:id`, sin recargar, con estados de carga y error.
- [ ] Escribir integración con MSW: pedido completo verificando el cuerpo del POST, pedido para barra, rechazo 4xx que conserva el carrito y consulta de estado. Cubrir respuesta de pedido incompatible con el contrato.

**Archivos principales:** `backend/src/models/pedido.ts`, `backend/src/data/pedidos.ts`, servicio y controlador de pedidos, nuevas rutas de test y su registro en `backend/src/app.ts`, tests de API en `backend/tests/` y módulos de mesa, confirmación y seguimiento en `frontend/src/`.

**Aceptación:** cada pedido queda asociado a la mesa correcta o a barra; la confirmación usa la respuesta de API, los errores conservan el carrito y el estado se puede consultar sin recargar.

## 8. Orden de trabajo y dependencias

No se fijan fechas porque el PDF no indica una fecha de entrega. Las etapas siguientes ordenan las dependencias.

| Etapa | Trabajo | Condición para avanzar |
| --- | --- | --- |
| 1. Contrato | Los cuatro acuerdan campos, mesas válidas, reglas del carrito, errores y datos de seed. Homero documenta; Matias y Nicolas aportan ejemplos. | Contrato escrito y responsabilidades de archivos compartidos acordadas. |
| 2. API preparada | Matias hace M1; Nicolas hace N1 y N2; Homero prepara herramientas H1 y corrige el middleware. Federico define casos del carrito y E2E. | Todos los cambios de API exigidos tienen tests y pasan. Según el PDF, se completa esta adaptación antes de empezar las funcionalidades del frontend. |
| 3. Funciones del menú | Homero hace H2/H3; Matias M2/M3; Federico F1/F2; Nicolas N3. | Cliente y esquemas primero; luego componentes conectados con sus pruebas. Cada tarea parte del test en rojo. |
| 4. Integración real | Federico hace F3 con apoyo de Nicolas para reset/seed y Homero para scripts. Matias revisa accesibilidad y ancho móvil. | Recorrido E2E real repetible y todos los niveles de pruebas en verde. |
| 5. Entrega | Homero consolida README; cada integrante verifica lo documentado para su módulo y realiza su revisión cruzada. | Checklist final completo y PR integrados a `main`. |

Los nombres de archivos nuevos son orientativos. Homero integra scripts y configuraciones comunes, Matias mantiene el SASS compartido y Nicolas coordina las rutas de test. El flujo general usa ramas por funcionalidad. Por decisión explícita de Homero, las correcciones de esta revisión se reúnen en una sola rama: `fix/correcciones-generales`.

El flujo utilizado ya integra las ramas por funcionalidad en `develop` mediante PR; allí están la inicialización y los avances registrados en la sección 1. La entrega final en `main` sigue pendiente y es requisito de la consigna. Se deben conservar los commits que muestran RED, GREEN y REFACTOR.

**Próximo paso de Homero:** guardar esta documentación, subir `fix/correcciones-generales` y abrir su PR a `develop`, conservando los commits TDD. Después del merge, volver a `develop` actualizado para continuar H2/H3 según el contrato de pedidos de N1 y los componentes de M2. Los avisos de desarrollo restantes requieren una migración revisada o un parche mantenido, respetando el stack del PDF. Cualquier edición de código requiere autorización previa del usuario.

## 9. Cobertura de las nueve funcionalidades del PDF

| N.º | Funcionalidad | Responsable | Verificación principal |
| --- | --- | --- | --- |
| 1 | Mesa desde QR o retiro en barra. | Nicolas | Unitarios de URL y encabezado; E2E con mesa 4. |
| 2 | Menú desde API, carga, error y reintento. | Homero | Integración MSW de éxito, 500, red caída y contrato inválido. |
| 3 | Café en tres pasos, descripción, precios por origen y botón deshabilitado. | Matias | Unitarios de búsqueda y pruebas del selector. |
| 4 | Pastelería con precio y agregado. | Matias | Pruebas de ambos productos y agregado al Context. |
| 5 | Carrito con cantidades, subtotales, quitar y bloqueo en vacío. | Federico | Unitarios del reducer y pruebas de componente. |
| 6 | Confirmación con mesa e ítems, ID, estado y total de API. | Nicolas | MSW verificando cuerpo enviado y E2E real. |
| 7 | Consulta de estado sin recargar. | Nicolas | Integración de seguimiento y recorrido Playwright. |
| 8 | Mensaje de rechazo y conservación del carrito. | Nicolas, con cliente de Homero y Context de Federico | Integración 4xx que comprueba mensaje e ítems conservados. |
| 9 | Uso a 375 px sin scroll horizontal. | Matias coordina; todos ajustan sus componentes. | Revisión móvil y comprobación E2E de Federico. |

## 10. TDD y pruebas obligatorias

- **Ciclo por funcionalidad:** escribir y ejecutar un test que falle por la conducta faltante; guardar ese test en un commit; implementar y guardar el código que lo vuelve verde en un commit posterior; refactorizar conservando los tests verdes.
- **Cobertura de comportamiento existente:** si una nueva prueba pasa con la implementación actual, registrar el test como cobertura de regresión; no romper código para fabricar un RED. Así se incorporaron al menú los casos de fallo de red y respuesta incompatible.
- **Refactores de las siguientes tareas:** después de guardar el GREEN, revisar mejoras de organización o duplicación del código y las pruebas recién agregados. Registrar el REFACTOR por separado, con los tests en verde, sin reorganizar funciones terminadas de etapas anteriores.
- **Formato de commits:** `RED test: descripción`, `GREEN tipo: descripción` y `REFACTOR: descripción`, sin repetir la palabra refactor. Documentación, dependencias y cobertura de comportamiento existente usan su tipo (`docs`, `chore`, `test`) sin inventar una etapa TDD. Cada integrante realiza sus propios commits; el asistente no los crea.
- **Reservas de pruebas:** quitar `.pending` del archivo correspondiente al comenzar la funcionalidad y escribir su primer test. La convención y los ejemplos están en FRONTEND; los archivos vacíos no se cuentan como pruebas implementadas.
- **Historial y PR:** una rama por funcionalidad y un PR a `main`, con revisión cruzada. Preservar los commits que muestran rojo y verde; evitar un squash que elimine esa evidencia. Cada integrante aporta commits frecuentes de sus tareas durante el desarrollo.
- **API:** conservar Jest/Supertest y agregar tests para cada cambio exigido: productos ampliados, mesa, pedidos, errores, conexión por proxy o CORS y reset/seed.
- **Unitarios con Vitest:** muchos casos de reducer del carrito, búsqueda de café, formato de precio y lectura de mesa desde URL; también esquemas y funciones puras que lo requieran.
- **Componentes:** Vitest + React Testing Library + user-event + jest-dom para selector, pastelería y carrito.
- **Integración con MSW 2:** menos casos que unitarios; cubrir carga, pedido completo y cuerpo del POST, rechazo 4xx con carrito conservado, 500 con reintento, API caída y respuesta incompatible con Zod. Los handlers imitan la API propia.
- **E2E con Playwright:** pocos recorridos; al menos uno completo con frontend y API reales, con reset y seed antes de cada test.
- **Consultas de UI:** buscar por rol, etiqueta o texto, con `getByRole`/`getByLabelText` y sus variantes asincrónicas; usar `getByTestId` solo si no hay una alternativa adecuada.
- **Ejecución:** `npm test` debe funcionar sin servidores externos y ejecutar unitarios, componentes e integración; `npm run test:e2e` ejecuta los recorridos reales con la preparación documentada.

## 11. Checklist de entrega

- [x] API original y `frontend/` conviven en el mismo repositorio.
- [ ] Los nueve comportamientos del menú están implementados contra la API del grupo.
- [x] Ambos endpoints de productos incluyen precio de dominio y clasificación, tamaño/origen y descripción según el tipo.
- [x] Completar la cobertura HTTP de todos los tipos y de los 20 productos (22 casos en esta rama).
- [ ] Pedidos admiten mesa opcional, validan sus datos y devuelven estado, ítems y total; errores previstos responden 400/404 con `{ error }`.
- [x] Proxy de Vite o CORS resuelve la conexión desde el navegador.
- [ ] Reset y seed funcionan por HTTP solo con `NODE_ENV=test` y se ejecutan antes de cada E2E.
- [x] Versiones exigidas fijadas y configuración de TypeScript estricto sin `any` explícito en el frontend.
- [x] Mecanismo genérico de validación de respuestas exitosas con Zod y tipos inferidos, y manejo de errores HTTP/JSON/red.
- [x] Contrato público de productos validado con Zod y tipos inferidos, conservando los campos ampliados.
- [ ] Crear los esquemas y funciones de las respuestas de pedidos.
- [x] Carga del menú mediante unión discriminada, cliente HTTP único y ausencia de `fetch` en componentes.
- [x] Reducer y Context del carrito implementados y probados.
- [x] Tipos y fixtures del carrito alineados; Context separado del proveedor, montado en App y probado.
- [ ] Precios y total confirmado salen de API; el subtotal del carrito está identificado como orientativo.
- [ ] Bootstrap personalizado con variables SASS antes de su importación y controles etiquetados.
- [ ] Interfaz funcional a 375 px sin scroll horizontal.
- [x] Pruebas implementadas en verde: 80 de backend y 93 de frontend, verificadas el 6 de noviembre de 2026; IDs mal formados cubiertos con tests permanentes.
- [x] Compilación de backend/frontend y lint correctos, incluidos tipos de los tests.
- [ ] Completar y aprobar los niveles de pruebas exigidos para todas las funcionalidades, incluidos los E2E reales.
- [ ] README explica instalación, API, frontend, contratos y todos los comandos de pruebas.
- [ ] Ramas por funcionalidad integradas por PR a `main`, TDD visible en commits y participación de los cuatro integrantes.
