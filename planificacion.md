# Planificación del TP3 — Cafetería Origen

Integrantes: **Homero, Federico, Matias y Nicolas**.  
Fuente: `TP3.pdf`, páginas 1 a 5.  
Objetivo: construir el menú de mesa sobre la API del Parcial I, con los cambios mínimos pedidos, desarrollo con TDD y pruebas en todos los niveles exigidos.

## 1. Estado actual del repositorio

El proyecto tiene una API en Node.js, Express y TypeScript con `strict: true`, organizada en modelos, datos, servicios, controladores y rutas. Los productos y pedidos se almacenan en memoria.

La API, sus configuraciones, dependencias y pruebas están en `backend/`. `frontend/` tiene una base de React, Vite y TypeScript estricto, herramientas de pruebas, manejo de errores HTTP/JSON/red, validación genérica de respuestas exitosas con Zod y mocks compartidos de errores. Las pantallas del menú siguen pendientes. El `package.json` raíz agrupa los comandos de instalación, desarrollo, pruebas, compilación y lint, manteniendo separados los paquetes de backend y frontend.

La documentación se centraliza en la raíz: [README.md](README.md) es la entrada general y describe la API actual; [FRONTEND.md](FRONTEND.md) explica la base del frontend, las pruebas y el flujo TDD. Esta planificación conserva las tareas y propuestas del TP3. Las propuestas de contratos no deben confundirse con funcionalidades ya implementadas.

| Área | Qué existe | Qué falta para TP3 |
| --- | --- | --- |
| Productos | Catálogo de 20 productos y precios del dominio conservados. Los modelos incorporan `tipo`, `tipoCafe`, `tamaño` y `variedad` según corresponda; servicio interno `buscarProducto()` con filtros y tres tests. | Devolver tipo, tamaño, origen y su descripción en el JSON de los endpoints; acordar los campos finales con el frontend. |
| Consulta de productos | `GET /productos` y `GET /productos/:id` ya devuelven `id`, `nombre` y `precio`, calculado con `calcularPrecio()`. | Ampliar ambas respuestas y actualizar sus tests, algunos de los cuales comparan el objeto completo. |
| Pedidos | Alta y consulta por ID, validación de cantidades y productos, respuesta con ítems, estado y total. | Aceptar, validar, guardar y devolver `mesaId` opcional. Asignar `pendiente` cuando no se envía estado: hoy el servicio recibe el estado del cliente sin valor por defecto. |
| Errores | JSON inválido responde 400 con `{ error }`; errores internos conservan 500. El cliente conserva los mensajes válidos de la API y muestra mensajes claros ante errores de contrato, JSON no interpretable y fallos de conexión. | Conectar estos errores con las pantallas y completar las validaciones de pedidos y mesas de la API. |
| Conexión desde el navegador | Vite redirige `/productos` y `/pedidos`, incluidas subrutas, a `http://localhost:3000`. `solicitarJson()` utiliza rutas del mismo origen y admite `RequestInit`. | Conectar las funciones específicas y las pantallas; definir la conexión de producción al preparar el despliegue. |
| Preparación de E2E | Función interna `reiniciarPedidos()` que vacía pedidos y reinicia IDs. | Endpoints HTTP de reset y seed disponibles únicamente con `NODE_ENV=test`. |
| Frontend | Aplicación mínima con encabezado. `solicitarValidado()` valida con un esquema recibido y devuelve el tipo inferido; `erroresApi` y `crearHandlerError()` permiten simular errores GET/POST. | Completar los esquemas definitivos y funciones específicas de productos/pedidos, sus fixtures de éxito y las pantallas. Bootstrap/SASS y Playwright siguen pendientes. |
| Regresión | 42 tests de backend en 10 suites y 35 de frontend en 8 archivos. `npm test` raíz ejecuta ambos paquetes sin servidores externos levantados. | Mantener esa cobertura e incorporar las pruebas de funcionalidades restantes y los E2E reales. |

La base inicial tenía 38 tests de backend y 7 de infraestructura del frontend. Ahora el backend agrega un test de JSON inválido y tres del buscador de productos. El frontend agrega diez del esquema de errores, diez del cliente HTTP, cuatro de validación de respuestas exitosas y cuatro de handlers compartidos.

Verificación del **4 de noviembre de 2026**, con los avances integrados hasta el PR #12: pasaron desde la raíz `npm test` (**42 tests de backend y 35 de frontend**), `npm run build` y `npm run lint`. La compilación del frontend comprueba también los tipos de sus tests y de la configuración de Vitest. Quedan 12 archivos de pruebas vacíos con extensión `.pending`; cada responsable los activa al empezar su ciclo RED. No representan cobertura implementada.

La base y los avances siguientes ya están integrados en `develop`. La comprobación de instalación limpia con `npm run install:all` y el arranque conjunto siguen pendientes de registro. También faltan el proveedor del carrito, los E2E, las ampliaciones HTTP de productos y pedidos y las funcionalidades del menú.

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
| `docs/documentacion-general` | #10 | Primera actualización de avances y tareas completadas; esta misma rama se reutiliza para la actualización actual. |
| `feature/validacion-respuestas` | #11 | Validación genérica de respuestas exitosas, tipo inferido y cuatro pruebas; refactor de la preparación de MSW de esas pruebas. |
| `feature/mocks-errores-compartidos` | #12 | Fixtures de errores y handler reutilizable GET/POST; cuatro pruebas y refactor de las opciones de petición de esos casos. |

H2 y H3 tienen avances parciales. El buscador del backend tampoco completa M1 ni reemplaza la función de selección que M2 necesita en el frontend.

El reparto anterior del Parcial I sirve como referencia de experiencia. Para equilibrar TP3, cada integrante tendrá implementación y pruebas propias; Federico pasa a ocuparse del carrito y los E2E, porque los reportes ya están implementados.

## 2. Acuerdos iniciales y contrato compartido

Las decisiones de infraestructura de los puntos 1 y 7 y el contrato de errores del punto 6 ya están implementados. Los contratos ampliados de productos y pedidos, las mesas, las reglas de negocio y el seed siguen pendientes de acuerdo e implementación antes de las pantallas.

1. **Ubicación y herramientas:** `frontend/` ya utiliza Vite + React + TypeScript estricto y una regla de ESLint que rechaza `any` explícito. Vite 7, Vitest 3, MSW 2 y Zod 4 están instalados con versiones exactas y lockfile. El requisito de Node es `^20.19.0 || >=22.12.0`. La API mantiene Jest y Supertest en su propio paquete.
2. **Productos:** conservar IDs y precios actuales. La propuesta HTTP es `tipo: "expreso" | "filtrado" | "pasteleria"`; para cafés, `tamanio` y `variedad: { nombre, descripcion }`. Los modelos actuales usan internamente `tipo: "cafe" | "pasteleria"`, `tipoCafe`, `tamaño` y `variedad` como texto. Esos campos aún no salen de los endpoints: acordar su representación pública antes de cerrar los esquemas Zod. La descripción debe incluir acidez, cuerpo y notas. `gramosCafe` puede exponerse como en el ejemplo del PDF, pero el frontend no lo usará para calcular precios.
3. **Mesas:** acordar un conjunto explícito de mesas válidas que incluya la 4 del ejemplo. No hay una cantidad de mesas definida en el PDF. `mesaId` omitido significa retiro en barra; una mesa no existente enviada a la API produce 400 o 404. Un valor ausente o inválido de `?mesa` en la URL se interpreta como barra y no se envía como una mesa inválida.
4. **Pedidos:** `POST /pedidos` acepta `{ mesaId?, items: [{ productoId, cantidad }] }` y asigna `pendiente` por defecto. Conservar la respuesta actual `{ mensaje, pedido }`; `pedido` debe incluir `id`, `items`, `estado`, `total` y `mesaId` cuando corresponda. Mantener `GET /pedidos/:id` como objeto directo del pedido con esa información.
5. **Precios:** la API define los precios unitarios y el total confirmado. El carrito solo multiplica los precios recibidos por las cantidades y suma subtotales orientativos. La confirmación muestra exactamente el total devuelto por la API.
6. **Red y validación:** `solicitarJson()` lee JSON y maneja errores HTTP/JSON/red; su resultado es `unknown`. `solicitarValidado(ruta, esquema, opciones?)` agrega validación de éxito y devuelve `z.infer<Esquema>`. Las futuras funciones de endpoints deben usar esta última. Faltan los esquemas definitivos de productos/pedidos y sus funciones específicas. Ningún componente hará `fetch` directo.
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
- [ ] Confirmar con el equipo la estructura compartida y montar el proveedor del carrito cuando Federico lo implemente.
- [ ] Integrar `npm run test:e2e` con la configuración de Playwright de Federico.
- [ ] Completar la verificación final de instalación limpia y arranque de ambas aplicaciones.

La guía de la base está en [FRONTEND.md](FRONTEND.md). La infraestructura implementada incluye registro de jest-dom, limpieza del DOM, inicio/cierre y reinicio de handlers de MSW, verificación de tipos de los tests y pruebas del proxy. H2 ya incorpora el esquema de errores, el cliente genérico y fixtures/handlers de errores; las pantallas y los contratos específicos de productos/pedidos siguen pendientes.

### H2. Implementar contratos y cliente HTTP

- [x] Crear `esquemaError` para validar el contrato `{ error: string }`.
- [x] Derivar el tipo `ErrorApi` con `z.infer`.
- [x] Preparar `solicitarJson(ruta, opciones?)` como base del módulo HTTP, con rutas del mismo origen y opciones `RequestInit`.
- [x] Detectar respuestas HTTP fallidas, validar su cuerpo con `esquemaError` y lanzar un error que conserve el mensaje de la API.
- [x] Cubrir el contrato de errores con diez pruebas unitarias y el cliente con tres pruebas MSW para 400, 404 y 500.
- [ ] Crear los esquemas Zod de productos, creación de pedido y consulta de pedido según los contratos definitivos de la API.
- [x] Implementar `solicitarValidado()` para validar respuestas exitosas con el esquema recibido y devolver su tipo con `z.infer`.
- [x] Informar con un mensaje claro cuando una respuesta de error no cumpla el contrato: campo ausente, mensaje no textual o respuesta nula.
- [x] Informar de manera comprensible respuestas HTML, JSON incompleto y cuerpo vacío.
- [x] Informar de manera comprensible un fallo de conexión con la API.
- [x] Completar diez pruebas del cliente HTTP y cuatro de validación genérica de respuestas exitosas.
- [x] Preparar fixtures `erroresApi` y `crearHandlerError()` con MSW 2, respetando rutas, métodos, códigos y mensajes del backend.
- [x] Verificar los handlers compartidos con cuatro escenarios: ID de pedido inválido, producto inexistente, pedido sin ítems y error interno.
- [ ] Entregar funciones de listar productos, crear pedido y consultar pedido por ID para que los demás componentes las consuman.
- [ ] Preparar fixtures y handlers compartidos de respuestas exitosas cuando estén definidos los contratos de productos/pedidos.
- [ ] Completar las pruebas específicas de esos esquemas y funciones, incluido el cuerpo real enviado a `POST /pedidos`.

La parte genérica de validación y errores de H2 está implementada. `mocks/handlers.ts` exporta una fábrica reutilizable; las pruebas la registran explícitamente con `server.use(...)`, sin handlers iniciales en el servidor compartido. Los fixtures de productos y pedidos y sus esquemas de producción siguen vacíos. El esquema de producto de `respuestas.test.ts` es local a esa prueba y describe la respuesta actual de la API; no cierra el contrato ampliado de M1.

### H3. Cargar el menú y reforzar errores de API

- [ ] Modelar la carga como unión discriminada: `cargando`, `error` con mensaje o `listo` con productos.
- [ ] Mostrar indicador de carga, mensaje de error y botón de reintento; conectar los productos reales con selector y pastelería de Matias.
- [ ] Probar con MSW carga correcta, error 500 con reintento, API caída y respuesta de productos que no cumple el contrato.
- [x] Ajustar el middleware de API para responder 400 con `{ error }` ante JSON inválido; conservar 500 para errores internos y añadir tests.

### H4. Documentar y coordinar la integración

- [x] Centralizar en README y FRONTEND la instalación, ejecución, configuraciones, comandos y pruebas disponibles de la base, junto con el contrato actual de la API.
- [x] Actualizar la documentación general con los avances integrados, las pruebas de errores y los pendientes reales de H2/H3.
- [ ] Completar la documentación del contrato HTTP consumido por las pantallas y los comandos E2E cuando se implementen.
- [ ] Documentar las decisiones de mesas, el ejemplo de pedido del PDF y los comandos de reset/seed para E2E.
- [ ] Coordinar la comprobación final de scripts, compilación y ausencia de conflictos entre configuraciones.

**Archivos previstos:** `frontend/package.json`, configuraciones Vite/Vitest/TypeScript, `frontend/src/api/`, `frontend/src/test/`, componente de carga del menú, `backend/src/middleware/errorHandler.ts`, scripts raíz, `README.md` y `FRONTEND.md`. Toda la documentación del proyecto se mantiene en la raíz.

**Aceptación:** el frontend puede consumir la API mediante el cliente, rechaza datos que no cumplen el contrato, permite reintentar la carga y las pruebas normales funcionan sin levantar Express.

## 5. Tareas de Federico

### F1. Desarrollar el carrito con Context y reducer puro

- [ ] Crear el Context y un reducer puro para agregar, incrementar, decrementar y quitar productos.
- [ ] Acumular cantidades al agregar el mismo producto; acordar que decrementar desde 1 quite el ítem y nunca genere cantidades negativas.
- [ ] Mantener por ítem el identificador, nombre, precio recibido de API y cantidad, utilizando los tipos derivados del contrato.
- [ ] Calcular subtotales orientativos por ítem y subtotal general, sin reproducir las fórmulas de precios del dominio.
- [ ] Implementar y probar una función común de formato de precio para que Matias y Nicolas la reutilicen.
- [ ] Escribir tests unitarios de cada acción, productos repetidos, eliminación, carrito vacío y subtotales.

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
- [ ] Hacer que la API devuelva el tipo de producto y, para los cafés, el tamaño, el origen y su descripción de acidez, cuerpo y notas.
- [ ] Ampliar `GET /productos` y `GET /productos/:id` con una representación coherente de café y pastelería.
- [ ] Evitar que el frontend deba extraer tipo, tamaño u origen del texto de `nombre`.
- [ ] Actualizar tests de ambos endpoints y agregar cobertura de los nuevos campos y tipos; mantener la regresión de precios y el 404 de producto inexistente.
- [ ] Entregar ejemplos reales del contrato a Homero para Zod y MSW.

El avance del PR #2 permite filtrar objetos del catálogo dentro del backend. `GET /productos` y `GET /productos/:id` todavía serializan solamente `id`, `nombre` y `precio`; por eso M1 continúa pendiente de completar.

**Qué datos deben salir de la API:** guardar los campos en los modelos es una parte; también deben incluirse en el JSON que recibe el frontend. El nombre se utiliza para mostrar el producto, y los campos separados permiten seleccionar bebida, tamaño y origen sin buscar palabras dentro de ese nombre. Ejemplo propuesto para un café, todavía pendiente de implementar en los endpoints:

```json
{
  "id": 5,
  "nombre": "Expreso Mediano Colombia",
  "tipo": "expreso",
  "tamanio": "mediano",
  "variedad": {
    "nombre": "Colombia",
    "descripcion": "Acidez media, cuerpo equilibrado y notas cítricas y florales"
  },
  "precio": 7360
}
```

Para pastelería, la respuesta propuesta incluye `id`, `nombre`, `tipo: "pasteleria"` y `precio`. Los campos de tamaño y origen corresponden a los cafés. Los nombres y la estructura final de estos campos se acuerdan antes de preparar los esquemas de producción del frontend.

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
- [ ] Asignar `pendiente` por defecto para que el frontend envíe solamente mesa e ítems, como en el PDF; mantener compatibilidad con las pruebas existentes cuando corresponda.
- [ ] Validar el cuerpo y los ítems en ejecución: arreglo no vacío, estructura correcta, producto existente y cantidad entera positiva.
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

Los nombres de archivos nuevos son orientativos. Para evitar conflictos, Homero integra cambios en scripts raíz y configuraciones comunes, Matias mantiene el SASS compartido y Nicolas coordina el registro de las rutas de test. Cada integrante trabaja en ramas por funcionalidad, no en una única rama para todo su trabajo.

El flujo utilizado ya integra las ramas por funcionalidad en `develop` mediante PR; allí están la inicialización y los avances registrados en la sección 1. La entrega final en `main` sigue pendiente y es requisito de la consigna. Se deben conservar los commits que muestran RED, GREEN y REFACTOR.

**Próximo paso de Homero:** completar la verificación pendiente de H1: instalación limpia con `npm run install:all` y arranque conjunto de API y frontend siguiendo el README, y registrar los resultados. Para cerrar H2 después, se necesitan los contratos de productos de M1 y pedidos de N1 para sus esquemas, funciones y fixtures específicos. Cualquier edición de código requiere autorización previa del usuario.

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
- **Refactores de las siguientes tareas:** después de guardar el GREEN, revisar mejoras de organización o duplicación del código y las pruebas recién agregados. Registrar el REFACTOR por separado, con los tests en verde, sin reorganizar funciones terminadas de etapas anteriores.
- **Formato de commits:** `RED test: descripción`, `GREEN tipo: descripción` y `REFACTOR tipo: descripción`. Un cambio administrativo, de documentación o dependencias usa su tipo (`chore`, `docs`, etc.) sin inventar una etapa TDD. Cada integrante realiza sus propios commits; el asistente no los crea.
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
- [ ] Ambos endpoints de productos incluyen precio de dominio y tipo, más la información necesaria para la selección.
- [ ] Pedidos admiten mesa opcional, validan sus datos y devuelven estado, ítems y total; errores previstos responden 400/404 con `{ error }`.
- [x] Proxy de Vite o CORS resuelve la conexión desde el navegador.
- [ ] Reset y seed funcionan por HTTP solo con `NODE_ENV=test` y se ejecutan antes de cada E2E.
- [x] Versiones exigidas fijadas y configuración de TypeScript estricto sin `any` explícito en el frontend.
- [x] Mecanismo genérico de validación de respuestas exitosas con Zod y tipos inferidos, y manejo de errores HTTP/JSON/red.
- [ ] Todas las respuestas de los endpoints consumidos tienen esquemas definitivos; faltan los de productos y pedidos.
- [ ] Carga mediante unión discriminada, carrito en Context, cliente HTTP único y ausencia de `fetch` en componentes.
- [ ] Precios y total confirmado salen de API; el subtotal del carrito está identificado como orientativo.
- [ ] Bootstrap personalizado con variables SASS antes de su importación y controles etiquetados.
- [ ] Interfaz funcional a 375 px sin scroll horizontal.
- [x] Pruebas actualmente implementadas en verde: 42 de backend y 35 de frontend; compilación de ambos paquetes y lint correctos.
- [ ] Completar y aprobar los niveles de pruebas exigidos para todas las funcionalidades, incluidos los E2E reales.
- [ ] README explica instalación, API, frontend, contratos y todos los comandos de pruebas.
- [ ] Ramas por funcionalidad integradas por PR a `main`, TDD visible en commits y participación de los cuatro integrantes.
