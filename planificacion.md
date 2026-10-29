# Planificación del TP3 — Cafetería Origen

Integrantes: **Homero, Federico, Matias y Nicolas**.  
Fuente: `TP3.pdf`, páginas 1 a 5.  
Objetivo: construir el menú de mesa sobre la API del Parcial I, con los cambios mínimos pedidos, desarrollo con TDD y pruebas en todos los niveles exigidos.

## 1. Estado actual del repositorio

El proyecto tiene una API en Node.js, Express y TypeScript con `strict: true`, organizada en modelos, datos, servicios, controladores y rutas. Los productos y pedidos se almacenan en memoria.

| Área | Qué existe | Qué falta para TP3 |
| --- | --- | --- |
| Productos | Catálogo de 20 productos; clases `Producto`, `Cafe`, `Expreso`, `Filtrado` y `Pasteleria`; cálculo de precios en el dominio. | Exponer `tipo` y datos estructurados de tamaño y origen, con su descripción, para armar el selector sin interpretar nombres. |
| Consulta de productos | `GET /productos` y `GET /productos/:id` ya devuelven `id`, `nombre` y `precio`, calculado con `calcularPrecio()`. | Ampliar ambas respuestas y actualizar sus tests, algunos de los cuales comparan el objeto completo. |
| Pedidos | Alta y consulta por ID, validación de cantidades y productos, respuesta con ítems, estado y total. | Aceptar, validar, guardar y devolver `mesaId` opcional. Asignar `pendiente` cuando no se envía estado: hoy el servicio recibe el estado del cliente sin valor por defecto. |
| Errores | Respuestas `{ "error": "mensaje" }` en los errores previstos; middleware genérico de 500. | Cubrir cuerpos malformados y validaciones faltantes; evitar que errores del cliente, como JSON inválido, terminen como 500. |
| Conexión desde el navegador | Express con JSON y tres grupos de rutas. | Configurar CORS o proxy de Vite hacia la API. |
| Preparación de E2E | Función interna `reiniciarPedidos()` que vacía pedidos y reinicia IDs. | Endpoints HTTP de reset y seed disponibles únicamente con `NODE_ENV=test`. |
| Frontend | No existe `frontend/`. | Crear la aplicación completa con el stack y los niveles de pruebas requeridos. |
| Regresión | Jest y Supertest para API, dominio y reportes. | Mantener esta cobertura mientras se agregan las pruebas de TP3. |

Verificación inicial: `npm test -- --runInBand` pasó **9 suites y 38 tests**. La comprobación `tsc --noEmit` también pasó. Esto describe la base existente, no el cumplimiento de TP3.

El reparto anterior del Parcial I sirve como referencia de experiencia. Para equilibrar TP3, cada integrante tendrá implementación y pruebas propias; Federico pasa a ocuparse del carrito y los E2E, porque los reportes ya están implementados.

## 2. Acuerdos iniciales y contrato compartido

Estas son decisiones propuestas para comenzar; deben quedar documentadas en el README antes de implementar las pantallas.

1. **Ubicación y herramientas:** crear `frontend/` con Vite + React + TypeScript estricto y sin `any`. Fijar versiones exactas compatibles con las mayores exigidas: Vite 7, Vitest 3, MSW 2 y Zod 4; guardar el lockfile y verificar una versión de Node compatible. Mantener Jest y Supertest en la API.
2. **Productos:** conservar IDs y precios actuales. Agregar `tipo: "expreso" | "filtrado" | "pasteleria"`; para cafés, exponer `tamanio` y `variedad: { nombre, descripcion }`. La descripción debe incluir acidez, cuerpo y notas de cada origen. `gramosCafe` puede exponerse como en el ejemplo del PDF, pero el frontend no lo usará para calcular precios.
3. **Mesas:** acordar un conjunto explícito de mesas válidas que incluya la 4 del ejemplo. No hay una cantidad de mesas definida en el PDF. `mesaId` omitido significa retiro en barra; una mesa no existente enviada a la API produce 400 o 404. Un valor ausente o inválido de `?mesa` en la URL se interpreta como barra y no se envía como una mesa inválida.
4. **Pedidos:** `POST /pedidos` acepta `{ mesaId?, items: [{ productoId, cantidad }] }` y asigna `pendiente` por defecto. Conservar la respuesta actual `{ mensaje, pedido }`; `pedido` debe incluir `id`, `items`, `estado`, `total` y `mesaId` cuando corresponda. Mantener `GET /pedidos/:id` como objeto directo del pedido con esa información.
5. **Precios:** la API define los precios unitarios y el total confirmado. El carrito solo multiplica los precios recibidos por las cantidades y suma subtotales orientativos. La confirmación muestra exactamente el total devuelto por la API.
6. **Red y validación:** usar un único cliente HTTP y esquemas Zod para cada respuesta consumida, incluidos los errores. Derivar los tipos con `z.infer`; validar antes de utilizar los datos. Ningún componente hará `fetch` directo.
7. **Conectividad:** usar como opción inicial un proxy de Vite hacia Express; documentar puertos y rutas para desarrollo y E2E.
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

- [ ] Crear `frontend/` con Vite, React y TypeScript, con `strict: true` y sin `any`.
- [ ] Fijar las versiones del stack exigido y configurar Vitest, React Testing Library, user-event, jest-dom, entorno DOM y MSW 2.
- [ ] Separar el descubrimiento de pruebas: Jest ejecuta las de la API y Vitest las del frontend; evitar que uno recoja las del otro.
- [ ] Configurar el proxy de Vite y scripts para desarrollo, compilación y pruebas.
- [ ] Definir con el equipo la estructura de módulos y preparar el montaje de la aplicación y del proveedor de carrito.
- [ ] Integrar comandos raíz para que `npm test` ejecute pruebas de API y frontend sin necesitar un servidor API levantado; `npm run test:e2e` ejecutará Playwright. Coordinar este último script con Federico.

### H2. Implementar contratos y cliente HTTP

- [ ] Crear esquemas Zod de productos, creación de pedido, consulta de pedido y respuesta de error, respetando el contrato real acordado.
- [ ] Derivar sus tipos con `z.infer` y centralizar todas las llamadas en un solo módulo cliente.
- [ ] Validar las respuestas exitosas y de error antes de usarlas; informar respuestas incompatibles, fallos de red y errores HTTP de manera comprensible.
- [ ] Entregar funciones de listar productos, crear pedido y consultar pedido por ID para que los demás componentes las consuman.
- [ ] Preparar fixtures y handlers compartidos de MSW 2 con `http` y `HttpResponse`, usando rutas, códigos y envoltorios reales.
- [ ] Escribir pruebas de validación de respuestas, errores HTTP y red; verificar que el cliente conserve el mensaje válido `{ error }` de la API.

### H3. Cargar el menú y reforzar errores de API

- [ ] Modelar la carga como unión discriminada: `cargando`, `error` con mensaje o `listo` con productos.
- [ ] Mostrar indicador de carga, mensaje de error y botón de reintento; conectar los productos reales con selector y pastelería de Matias.
- [ ] Probar con MSW carga correcta, error 500 con reintento, API caída y respuesta de productos que no cumple el contrato.
- [ ] Ajustar el middleware de API para responder 400 con `{ error }` ante JSON inválido; conservar 500 para errores internos y añadir tests.

### H4. Documentar y coordinar la integración

- [ ] Actualizar README: instalación, ejecución de API y frontend, entorno de test, cada nivel de pruebas y contrato HTTP consumido.
- [ ] Documentar las decisiones de mesas, el ejemplo de pedido del PDF y los comandos de reset/seed para E2E.
- [ ] Coordinar la comprobación final de scripts, compilación y ausencia de conflictos entre configuraciones.

**Archivos previstos:** `frontend/package.json`, configuraciones Vite/Vitest/TypeScript, `frontend/src/api/`, `frontend/src/test/`, componente de carga del menú, `src/middleware/errorHandler.ts`, scripts raíz y `README.md`.

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

- [ ] Incorporar `tipo` y los metadatos necesarios para seleccionar cafés por bebida, tamaño y origen; exponer descripción de acidez, cuerpo y notas de cada origen.
- [ ] Mantener los 20 productos, IDs y fórmulas actuales de `calcularPrecio()`.
- [ ] Ampliar `GET /productos` y `GET /productos/:id` con una representación coherente de café y pastelería.
- [ ] Evitar que el frontend deba extraer tipo, tamaño u origen del texto de `nombre`.
- [ ] Actualizar tests de ambos endpoints y agregar cobertura de los nuevos campos y tipos; mantener la regresión de precios y el 404 de producto inexistente.
- [ ] Entregar ejemplos reales del contrato a Homero para Zod y MSW.

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

**Archivos principales:** `src/models/`, `src/data/catalogo.ts`, `src/controllers/productos.controllers.ts`, tests de productos y nuevos módulos de selección, pastelería y estilos en `frontend/src/`.

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

**Archivos principales:** `src/models/pedido.ts`, `src/data/pedidos.ts`, servicio y controlador de pedidos, nuevas rutas de test y su registro en `src/app.ts`, tests de API y módulos de mesa, confirmación y seguimiento en `frontend/src/`.

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
- **Historial y PR:** una rama por funcionalidad y un PR a `main`, con revisión cruzada. Preservar los commits que muestran rojo y verde; evitar un squash que elimine esa evidencia. Cada integrante aporta commits frecuentes de sus tareas durante el desarrollo.
- **API:** conservar Jest/Supertest y agregar tests para cada cambio exigido: productos ampliados, mesa, pedidos, errores, conexión por proxy o CORS y reset/seed.
- **Unitarios con Vitest:** muchos casos de reducer del carrito, búsqueda de café, formato de precio y lectura de mesa desde URL; también esquemas y funciones puras que lo requieran.
- **Componentes:** Vitest + React Testing Library + user-event + jest-dom para selector, pastelería y carrito.
- **Integración con MSW 2:** menos casos que unitarios; cubrir carga, pedido completo y cuerpo del POST, rechazo 4xx con carrito conservado, 500 con reintento, API caída y respuesta incompatible con Zod. Los handlers imitan la API propia.
- **E2E con Playwright:** pocos recorridos; al menos uno completo con frontend y API reales, con reset y seed antes de cada test.
- **Consultas de UI:** buscar por rol, etiqueta o texto, con `getByRole`/`getByLabelText` y sus variantes asincrónicas; usar `getByTestId` solo si no hay una alternativa adecuada.
- **Ejecución:** `npm test` debe funcionar sin servidores externos y ejecutar unitarios, componentes e integración; `npm run test:e2e` ejecuta los recorridos reales con la preparación documentada.

## 11. Checklist de entrega

- [ ] API original y `frontend/` conviven en el mismo repositorio.
- [ ] Los nueve comportamientos del menú están implementados contra la API del grupo.
- [ ] Ambos endpoints de productos incluyen precio de dominio y tipo, más la información necesaria para la selección.
- [ ] Pedidos admiten mesa opcional, validan sus datos y devuelven estado, ítems y total; errores previstos responden 400/404 con `{ error }`.
- [ ] Proxy de Vite o CORS resuelve la conexión desde el navegador.
- [ ] Reset y seed funcionan por HTTP solo con `NODE_ENV=test` y se ejecutan antes de cada E2E.
- [ ] Versiones exigidas fijadas, TypeScript estricto sin `any`, esquemas Zod y tipos inferidos.
- [ ] Carga mediante unión discriminada, carrito en Context, cliente HTTP único y ausencia de `fetch` en componentes.
- [ ] Precios y total confirmado salen de API; el subtotal del carrito está identificado como orientativo.
- [ ] Bootstrap personalizado con variables SASS antes de su importación y controles etiquetados.
- [ ] Interfaz funcional a 375 px sin scroll horizontal.
- [ ] Tests de API, unitarios, componentes, integración y E2E pasan; la compilación también pasa.
- [ ] README explica instalación, API, frontend, contratos y todos los comandos de pruebas.
- [ ] Ramas por funcionalidad integradas por PR a `main`, TDD visible en commits y participación de los cuatro integrantes.
