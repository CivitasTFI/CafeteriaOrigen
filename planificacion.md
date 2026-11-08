# Planificación del TP3 — Cafetería Origen

Integrantes: **Homero, Federico, Matias y Nicolas**.  
Fuente: `TP3.pdf`, páginas 1 a 5.  
Objetivo: construir el menú de mesa sobre la API del Parcial I, con los cambios mínimos pedidos, desarrollo con TDD y pruebas en todos los niveles exigidos.

## 1. Estado actual del repositorio

El proyecto tiene una API en Node.js, Express y TypeScript con `strict: true`, organizada en modelos, datos, servicios, controladores y rutas. Los productos y pedidos se almacenan en memoria.

La API, sus configuraciones, dependencias y pruebas están en `backend/`. Ambos GET de productos exponen el contrato ampliado de Matias. El frontend lo consume con Zod y muestra el menú con carga, errores y reintento. `App` monta `CarritoProvider` y la interfaz del carrito de Federico, con cantidades, subtotal orientativo y controles accesibles. F3 incorpora Playwright y tres E2E iniciales con API real, integrados mediante #26. H2 sin mesa está integrado mediante #28. La rama actual `feature/mesa-pedidos` completa N1 con mesas del 1 al 8, compatibilidad con `develop`, cobertura HTTP y refactor, pendiente de actualizar e integrar mediante la PR #27. El `package.json` raíz agrupa los comandos de ambos paquetes, incluido `test:e2e`.

La documentación se centraliza en la raíz: [README.md](README.md) es la entrada general y describe la API actual; [FRONTEND.md](FRONTEND.md) explica la base del frontend, las pruebas y el flujo TDD. Esta planificación conserva las tareas y propuestas del TP3. Las propuestas de contratos no deben confundirse con funcionalidades ya implementadas.

| Área | Qué existe | Qué falta para TP3 |
| --- | --- | --- |
| Productos | Ambos GET ampliados, 22 casos HTTP para los 20 productos y 404, precios fijos y metadatos completos. Buscador con IDs exactos en sus pruebas. | Selector y pastelería en la interfaz (M2), con sus pruebas. |
| Consulta de productos | `esquemaProducto` distingue café/pastelería; `listarProductos()` y `useMenu` conservan el contrato completo. Tipos y fixtures derivados del esquema. | Conectar los componentes de selección cuando estén listos. |
| Cliente de pedidos | Esquemas de ítem, pedido y creación; `crearPedido(items)` y `consultarPedido(id)` con Zod; fixtures y handlers. 47 tests integrados mediante #28. | Ampliar `mesaId` con el contrato de N1 después de integrar #27 y conectar confirmación/seguimiento en N3. |
| Pedidos | N1 completo en esta rama: mesa opcional del 1 al 8 o barra, conservada en creación/listado/detalle; mantiene estados, IDs e importes validados. | Integrar #27; adaptar H2 y la interfaz para enviar y conservar la mesa. |
| Errores | Middleware centraliza validaciones e IDs mal formados (400), JSON inválido (400), cuerpo demasiado grande (413) y fallo interno (500 genérico). N1 agrega rechazo de mesas con 400 sin alterar pedidos, facturación ni IDs. | Mostrar los errores en confirmación conservando el carrito. |
| Carrito | Context/reducer con `VACIAR`, acciones sobre `ProductoBase`, interfaz montada en App y 14 casos de componente. Subtotal identificado como orientativo. | Agregado desde selector/pastelería reales y confirmación; vaciar solo tras éxito y revisar 375 px. |
| Reportes | Facturación acumulada validada en cada suma; acepta el máximo seguro y devuelve 400 si lo supera. Tres tests integrados en #25. | Mantener la regresión al modificar pedidos. |
| Conexión desde el navegador | Proxy Vite para `/productos` y `/pedidos`. Menú, creación y consulta de pedidos usan el cliente HTTP único; la pantalla actual solo conecta el menú. | Pantallas de pedidos; conexión de producción al preparar el despliegue. |
| Preparación de E2E | Playwright arranca API en `NODE_ENV=test` y Vite reales. Existe `reiniciarPedidos()` internamente. | Endpoints HTTP de reset/seed y su ejecución antes de cada E2E. |
| Frontend | Menú con carga/reintento, lógica/interfaz del carrito, cliente de pedidos y tres E2E iniciales a 375 px. | Selector, pastelería, mesas, confirmación/seguimiento, Bootstrap/SASS y recorrido E2E completo. |
| Regresión | 100 tests de backend en 16 suites, 156 de Vitest en 22 archivos: 256 habituales y tres E2E de Playwright aprobados; build y lint pasan. | Cobertura de las funcionalidades restantes y recorrido completo con reset/seed. |

Desde la actualización documental del PR #19 (estado hasta #17), Matias conectó el servicio a los endpoints en #18. Homero agregó 19 tests en #20 y uno en #21: el frontend pasó de 73 a 93 casos. El PR #24 integró las primeras correcciones generales, con 80 tests de backend. Federico agregó 12 casos en #23: diez de componente, uno de Context y otro de App; el frontend pasó a 105. El PR #25 incorpora cuatro regresiones del carrito y tres casos de facturación: 109 de frontend y 83 de backend. El PR #26 agrega tres E2E iniciales, ejecutados por separado, y #28 otros 47 casos de frontend, llegando a 156. En N1, Nicolas suma cuatro unitarios y Homero 13 casos HTTP: el backend alcanza 100.

Verificación del **6 de noviembre de 2026**, en `feature/mesa-pedidos` hasta `18911cd`, con `develop` incorporado hasta `b520964` mediante `be018cc`: `npm test` pasó con **100 tests de backend y 156 de frontend (256 en total)**; `npm run test:e2e` aprobó otros **tres casos** con Chromium y servidores reales. Build y lint también pasaron después de los 13 casos HTTP y del REFACTOR de mesas. La comprobación de tipos sin emisión también pasó en ambas etapas. N1 no agrega dependencias a las de `develop`. Las instalaciones previas de frontend/Chromium, instalación limpia de ambos paquetes y arranque manual conservan sus registros. La auditoría previa del 6, anterior a Playwright, registró cero afectados de producción, 20 de desarrollo en backend y 9 en frontend, sin altos ni críticos; no se repitió para N1. Quedan **7 archivos `.pending`**, que no representan cobertura implementada. La reserva `integration/pedidos.test.tsx.pending` es de la interfaz de N3; el cliente HTTP sin mesa de H2 ya tiene tests propios.

La tabla histórica siguiente registra lo integrado en `develop`, incluidos los PR #24, #23, #25, #26 y #28. N1 se detalla aparte porque todavía requiere actualizar e integrar la PR #27. Ampliación de H2 con mesa, selección, pedidos desde la pantalla, estilos y recorrido E2E completo siguen pendientes del TP3; también quedan los avisos de desarrollo documentados.

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
| `docs/documentacion-general` | #19 | Actualización hasta #17 y registro de los problemas de integración, ya corregidos. |
| `feature/actualizar-get-productos` | #18 | Matias: conecta normalización y respuestas ampliadas a ambos GET, actualiza tests y conserva el 404. |
| `fix/integracion-carrito` | #20 | Homero: contrato ampliado Zod y tipos inferidos, consulta/mocks actualizados, fixtures compartidos, corrección de import/mocks del carrito y separación Context/proveedor. 19 tests nuevos. |
| `feature/proveedor-carrito` | #21 | Homero: monta `CarritoProvider` en `App` y prueba el estado compartido entre botón y resumen independientes. Ciclo RED/GREEN/REFACTOR. |
| `docs/documentacion-general` | #22 | Documentación del estado hasta #21 y del contrato de productos y carrito. |
| `fix/correcciones-generales` | #24 | Homero: validaciones de pedidos y errores, catálogo completo, ajustes de dependencias/ts-jest y arranque conjunto; 80 tests de backend y 93 de frontend en esa etapa. |
| `feature/f2-interfazCarrito` | #23 | Federico: carrito visual e ítems, controles, subtotales, confirmación bloqueada en vacío, `VACIAR` y acciones con `ProductoBase`; 12 tests nuevos. |
| `fix/correcciones-generales` | #25 | Homero: subtotal orientativo, cuatro regresiones del carrito, facturación acumulada segura con tres tests y documentación; 192 casos de Jest/Vitest aprobados. |
| `feature/f3-api-e2e` | #26 | Federico: Playwright con API/frontend reales, comando `test:e2e`, configuración de tipos y tres regresiones de menú, ancho móvil y carrito vacío. |
| `feature/contratos-pedidos` | #28 | Homero: esquemas Zod y tipos inferidos, creación/consulta HTTP, fixtures y handlers de pedidos sin mesa; 47 tests y documentación. |

### Primera etapa de correcciones, integrada en el PR #24

Homero integró los siguientes avances sin modificar las fórmulas ni los 20 productos de Matias:

- [x] Cantidades seguras y control de subtotales/total antes de guardar; cuatro casos HTTP de rechazo conservan pedidos y facturación.
- [x] Estructura del cuerpo e ítems con mensajes claros; tres casos HTTP y helper compartido `validarObjeto()`.
- [x] Estados enviados válidos y `pendiente` por defecto; cinco casos HTTP incluyen creación y consulta por ID y conservación de un estado explícito.
- [x] `ErrorValidacion`, middleware centralizado y respuestas 400/413/500; dos casos nuevos cubren tamaño e incidente interno simulado.
- [x] Cobertura permanente del catálogo: 22 casos HTTP y fixture independiente; los tres tests del buscador ahora comprueban resultados completos.
- [x] body-parser 2.4.0 y qs 6.17.1; override de tinypool 2.1.2 para Vitest 3.2.7; ts-jest 29.4.15 e `isolatedModules` con `strict` conservado.
- [x] Instalación limpia, pruebas en procesos/hilos y repetición del menú en watch, registradas en [FRONTEND.md](FRONTEND.md#dependencias-de-desarrollo-y-auditoría).
- [x] Validar `productoId` como entero positivo seguro antes de usarlo en búsquedas o mensajes. Tres tests HTTP cubren ID ausente, objeto simple y objeto con `toString` numérico: responden 400 y conservan los datos. El ciclo RED/GREEN/REFACTOR incluye `validarIdProducto()`; el 500 reproducido quedó corregido.
- [x] Registrar el arranque conjunto en 3000/5173: página y módulo de entrada servidos, cliente real/Zod con 20 productos, pedido sin mesa ni estado con 201/`pendiente`/17220, GET por ID y rechazos 400. Se conservaron el pedido válido y su facturación y se cerraron los procesos propios. No reemplaza las pruebas del navegador ni valida mesa 4.

### Segunda etapa de correcciones, integrada en el PR #25

Tras los merges #24 y #23, Homero volvió a `fix/correcciones-generales` e incorporó `origin/develop` mediante avance rápido hasta `5b179d5`.

- [x] Identificar el subtotal general como orientativo y actualizar la expectativa de App; conservar el cálculo y los importes.
- [x] Cubrir restar y eliminar la última unidad, mostrando vacío y bloqueando la confirmación; dos casos parametrizados de regresión.
- [x] Cubrir sumar café y restar pastelería con precios distintos, conservando las cantidades y subtotales del otro producto; dos regresiones adicionales.
- [x] Validar cada suma de facturación acumulada; aceptar `Number.MAX_SAFE_INTEGER` y lanzar `ErrorValidacion` al superarlo, con respuesta HTTP 400 y mensaje claro.
- [x] Agregar dos tests unitarios del límite y un test HTTP con seis pedidos individualmente válidos; el backend pasa de 80 a 83 casos.
- [x] Extraer `renderizarCarrito()`, `prepararCarritoConCafeYPasteleria()` y `crearPedidosConTotales()`, y parametrizar las formas de quitar la última unidad; refactores separados.
- [x] Ejecutar la validación general: 192 tests, build de ambos paquetes y lint aprobados.
- [x] Actualizar README, FRONTEND y planificación con merges, conteos, contrato del reporte y tareas terminadas.

| Corrección | RED | GREEN | REFACTOR |
| --- | --- | --- | --- |
| Subtotal orientativo | `88dc0e3` | `d43f500` | `9545d34` |
| Facturación acumulada segura | `4a4f545` | `0d7472e` | `756524a` |

Los cuatro escenarios del carrito se registraron como cobertura existente en `92b2b9f` y `41cfb8b`; sus refactores son `2b6c8a8` y `e2f96f4`. Pasaron con la implementación existente, por lo que no se fabricó un RED.

### Avance inicial de F3, integrado en el PR #26

- [x] Instalar Playwright 1.65.0 y configurar Chromium a 375 × 812 con API y frontend reales, sin reutilizar servidores existentes.
- [x] Integrar `test:e2e` en frontend y raíz e incluir configuración y pruebas en la comprobación de TypeScript.
- [x] Agregar tres regresiones de navegador: carga de 20 productos reales, ausencia de scroll horizontal en la pantalla actual y bloqueo de confirmación en vacío.
- [x] Incorporar `develop` hasta `42f5657` y combinar la documentación con los avances ya integrados de #25.
- [x] Verificar esa integración con 192 tests habituales, tres E2E, build y lint aprobados.

Los tres E2E no usan todavía reset/seed ni cubren la compra completa. La comprobación móvil se limita a la pantalla actual con carrito vacío. Los detalles y comandos están en FRONTEND.

### Avances de H2, integrados en el PR #28

Homero completó los contratos y funciones de pedidos sin mesa en `feature/contratos-pedidos`, sobre `develop` hasta `c52f215`. La entrega ya está integrada mediante #28 (`b520964`); su extensión con mesa sigue pendiente:

- [x] Definir `esquemaItemPedido`, `esquemaPedido` y `esquemaRespuestaCrearPedido`; derivar `ItemPedido`, `Pedido` y `RespuestaCrearPedido` con `z.infer`.
- [x] Validar IDs/cantidades positivos seguros, ítems no vacíos, estado textual no blanco y total entero seguro no negativo. Conservar estados personalizados sin recortar espacios.
- [x] Implementar `crearPedido(items)` con POST JSON y respuesta `{ mensaje, pedido }`; comprobar cabecera, cuerpo exacto y una sola solicitud.
- [x] Implementar `consultarPedido(id)` con GET por ID y respuesta de pedido directo; conservar los datos recibidos.
- [x] Reutilizar el cliente validado y cubrir errores HTTP, de red, JSON y contrato, incluidos 400/404/500 según la operación.
- [x] Compartir fixtures `pedidoApi` y `respuestaCrearPedidoApi` con producto 5 × 2, producto 19 × 1 y total 17220 para barra; agregar el error de pedido inexistente.
- [x] Entregar `crearHandlerCreacionPedido()` (POST 201) y `crearHandlerConsultaPedido()` (GET 200 por el ID configurado), sin reproducir cálculos del backend.
- [x] Agregar 47 tests: 28 de esquemas, 17 de funciones HTTP y dos de handlers compartidos.
- [x] Verificar en esa etapa 239 tests habituales, tres E2E, build y lint; documentar contratos, comandos, avances y dependencias.
- [ ] Ampliar H2 con `mesaId` usando el contrato de N1 de esta rama, después de integrar #27.

| Comportamiento | RED | GREEN | REFACTOR |
| --- | --- | --- | --- |
| Esquema del pedido y tipo inferido | `b81bea2` | `d078574` | `069957d` |
| Esquema de respuesta de creación | `317f6b0` | `080cb2f` | `e1f6c5e` |
| Creación de pedidos mediante HTTP | `67add93` | `aac7a77` | `7f5d368` |
| Consulta de pedidos mediante HTTP | `bd354c2` | `dcbb7b7` | `17dae78` |
| Handler compartido de creación | `f9cc9c8` | `fb27401` | `8d9ee12` |
| Handler compartido de consulta | `4719206` | `f51a883` | `3a6a35a` |

La centralización del fixture de pedido quedó en `88f401e`. Las regresiones adicionales están en `776bf2d`, `edb9052`, `3ade9c2` y `50fa715`: ya pasaban con el comportamiento existente y se registraron como cobertura, sin fabricar RED. Los refactores extraen el esquema del ítem, centralizan fixtures y preparación de MSW y quitan comprobaciones redundantes en los tests de handlers. Los mensajes históricos conservan su formato original.

### Avances de N1 en `feature/mesa-pedidos`, PR #27 pendiente

Nicolas agregó la mesa opcional al modelo, almacenamiento, servicio y respuesta, definió las mesas del 1 al 8 e incorporó cuatro casos unitarios. Homero integró `develop` y resolvió las incompatibilidades conservando esas funcionalidades y las validaciones existentes:

- [x] Conservar `crearPedido(items, estado = "pendiente", mesaId?)` y el orden estado/mesa en almacenamiento y modelo; mantener estados explícitos válidos.
- [x] Conservar la validación del cuerpo y el middleware común, junto con las reglas de ítems, productos, cantidades e importes seguros.
- [x] Rechazar mesas inválidas/inexistentes con `ErrorValidacion` y HTTP 400; conservar los fallos internos como 500. El PDF admite 400 o 404 para mesas inexistentes.
- [x] Agregar 13 casos HTTP permanentes: mesas 1/4/8, barra con estado explícito y nueve entradas rechazadas.
- [x] Comprobar que los rechazos no alteren pedidos, facturación ni secuencia de IDs; verificar el ejemplo de mesa 4 con total 17220.
- [x] Extraer `validarMesaPedido()` como función privada, conservando reglas, mensajes y orden de validación después de los ítems.
- [x] Verificar 256 tests habituales, tres E2E, build y lint; actualizar README, FRONTEND y planificación.
- [ ] Subir la rama actualizada e integrar la PR #27 en `develop`.

| Aporte | Commits |
| --- | --- |
| Nicolas: mesa opcional con prueba e implementación | `57d9edf` (RED), `3d02e5c` (GREEN). |
| Nicolas: rechazo de mesa inexistente | `d7f0e6f` (RED), `09de13f` (GREEN). |
| Nicolas: estado predeterminado y ajustes originales | `ccd5780` (RED), `397ec4b` (GREEN), `a3b4bd6` (ajustes de tests). |
| Homero: integrar `develop` y conservar compatibilidad | `be018cc`. |
| Homero: 13 casos HTTP de regresión | `003099a`. |
| Homero: extraer validación de mesa | `18911cd` (REFACTOR). |

El merge restaura la validación y conservación del estado que ya existían en `develop`. Las firmas finales de esta rama conservan esos contratos y agregan la mesa. Los 13 casos nuevos ya pasaban con el comportamiento integrado y se registraron como regresión, sin fabricar un RED.

H2 sin mesa está integrado mediante #28; su extensión con `mesaId` utiliza el contrato de N1 disponible en esta rama y espera su integración mediante #27. H3 espera selector y pastelería de M2. M1 y F1 están integrados. La parte principal de F2 está implementada y probada; faltan la coordinación con la confirmación y la revisión móvil del carrito cargado. F3 tiene infraestructura y tres casos iniciales integrados en #26; faltan reset/seed, compra y seguimiento. Los avisos de desarrollo restantes requieren migraciones revisadas o un parche mantenido.

El reparto anterior del Parcial I sirve como referencia de experiencia. Para equilibrar TP3, cada integrante tendrá implementación y pruebas propias; Federico pasa a ocuparse del carrito y los E2E, porque los reportes ya están implementados.

## 2. Acuerdos iniciales y contrato compartido

Están implementadas infraestructura, contrato ampliado de productos, errores, carga del menú y lógica/interfaz del carrito compartido. H2 sin mesa está integrado mediante #28 y N1 agrega mesa a la API en esta rama. Faltan su integración, soporte de mesa en H2, reset/seed, controles reales de selección y pantallas de pedidos.

1. **Ubicación y herramientas:** `frontend/` ya utiliza Vite + React + TypeScript estricto y una regla de ESLint que rechaza `any` explícito. Vite 7, Vitest 3, MSW 2 y Zod 4 están instalados con versiones exactas y lockfile. El requisito de Node es `^20.19.0 || >=22.12.0`. La API mantiene Jest y Supertest en su propio paquete.
2. **Productos, contrato vigente:** ambos GET conservan `id`, `nombre` y `precio`. Para café: `tipo: "cafe"`, `tipoCafe: "expreso" | "filtrado"`, `tamaño` y `variedad: { nombre, descripcion }`. Para pastelería: `tipo: "pasteleria"` y variedad textual. Zod y MSW ya usan esta estructura. Reemplaza la propuesta anterior con `tipo: "expreso"` y `tamanio`; el PDF permite variar nombres conservando la información. `gramosCafe` no se expone ni se necesita para calcular precios en el frontend.
3. **Mesas, contrato de N1:** las mesas válidas son los enteros del **1 al 8**, incluida la 4 del ejemplo. La cantidad es una decisión del grupo, no una exigencia del PDF. Omitir `mesaId` significa barra y el JSON de respuesta omite el campo. La mesa 9 produce 400 con `{ error: "Mesa inexistente" }`; tipos incorrectos, cero, negativos y decimales producen 400 con `{ error: "Debe ingresar un número válido" }`. Un `null` enviado explícitamente es inválido. En N3, un valor ausente o inválido de `?mesa` debe interpretarse como barra y no enviarse como mesa inválida.
4. **Pedidos:** N1 acepta `{ mesaId?, items: [{ productoId, cantidad }], estado? }` y devuelve `{ mensaje, pedido }`, con `id`, `items`, `estado`, `total` y `mesaId` cuando corresponde. `GET /pedidos/:id` devuelve directamente el pedido; el listado usa la misma representación. `estado` conserva su contrato previo, con `pendiente` predeterminado y textos explícitos válidos. **Disponible en develop mediante #28:** cliente y contratos frontend sin mesa. **Disponible en esta rama, pendiente de #27:** soporte completo de mesa en API y 13 casos HTTP. **Pendiente de H2:** ampliar sus esquemas, función, fixtures, handlers y tests con mesa. Ejemplos y comandos en [README.md](README.md#contrato-de-mesas-y-pedidos-en-api-n1).
5. **Precios:** la API define los precios unitarios y el total confirmado. El carrito solo multiplica los precios recibidos por las cantidades y suma subtotales identificados como orientativos. La confirmación deberá mostrar exactamente el total devuelto por la API.
6. **Red y validación:** `solicitarJson()` devuelve `unknown` y maneja HTTP/JSON/red. `solicitarValidado()` aplica Zod y devuelve el tipo inferido. `listarProductos(): Promise<Productos>` usa `esquemaProductos`, una lista de la unión discriminada de café/pastelería. `crearPedido(items: ItemPedido[]): Promise<RespuestaCrearPedido>` y `consultarPedido(id: number): Promise<Pedido>` usan el mismo cliente. Los componentes no hacen `fetch` directo. N3 debe transformar los ítems del carrito a `{ productoId, cantidad }`: la función de creación serializa el arreglo recibido sin filtrar propiedades adicionales. Detalles y ejemplos en [FRONTEND.md](FRONTEND.md#contratos-y-cliente-de-pedidos-h2).
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
- [x] Integrar `npm run test:e2e` con la configuración de Playwright de Federico (PR #26 integrado en `develop`).
- [x] Verificar la instalación limpia de ambos paquetes con `npm run install:all` (5 de noviembre, rama de correcciones).
- [x] Registrar el arranque conjunto de ambas aplicaciones y la conexión del cliente real a través del proxy (6 de noviembre, puertos 3000/5173).

La guía está en [FRONTEND.md](FRONTEND.md). Están implementados cliente, productos ampliados, mocks, menú, proveedor e interfaz del carrito. Tests, compilación y lint pasan; instalación limpia y arranque conjunto están registrados. El comando E2E está integrado en frontend y raíz y ejecuta tres casos iniciales.

### H2. Implementar contratos y cliente HTTP

- [x] Crear `esquemaError` para validar el contrato `{ error: string }`.
- [x] Derivar el tipo `ErrorApi` con `z.infer`.
- [x] Preparar `solicitarJson(ruta, opciones?)` como base del módulo HTTP, con rutas del mismo origen y opciones `RequestInit`.
- [x] Detectar respuestas HTTP fallidas, validar su cuerpo con `esquemaError` y lanzar un error que conserve el mensaje de la API.
- [x] Cubrir el contrato de errores con diez pruebas unitarias y el cliente con tres pruebas MSW para 400, 404 y 500.
- [x] Conservar esquemas y tipos base de los campos comunes de productos.
- [x] Implementar `esquemaProducto` y `esquemaProductos` para el contrato ampliado y derivar `Producto` y `Productos` con `z.infer`.
- [x] Crear los esquemas de ítem, pedido directo y respuesta de creación sin mesa; derivar `ItemPedido`, `Pedido` y `RespuestaCrearPedido` con `z.infer` (PR #28).
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
- [x] Entregar `crearPedido(items)` y `consultarPedido(id)`, con fixtures y handlers de éxito POST 201 / GET 200.
- [x] Cubrir el cuerpo real enviado a `POST /pedidos`, cabecera JSON y una sola solicitud; comprobar el GET por el ID recibido.
- [x] Cubrir pedidos con 28 tests de esquemas, 17 del cliente y dos de handlers; conservar errores HTTP, red, JSON y contrato.
- [ ] Ampliar los esquemas, tipos inferidos, función de creación, fixtures, handlers y tests con `mesaId`, usando el contrato de N1 después de integrar #27.

H2 dispone de contratos de errores, productos ampliados y pedidos sin mesa, cliente, funciones y mocks reutilizables, ya integrados mediante #28. `productosApi` reúne `cafeApi` y `pasteleriaApi` (IDs 5 y 19) con todos sus campos; no es el catálogo completo. `pedidoApi` contiene producto 5 × 2 y producto 19 × 1, estado `pendiente` y total 17220; `respuestaCrearPedidoApi` agrega el envoltorio de creación. El estado se conserva sin recortar espacios ni imponer un catálogo cerrado; el total lo determina la API. La función actual solo recibe ítems y no envía `estado` ni `mesaId`. El esquema elimina `mesaId` si aparece en la respuesta, por lo que debe ampliarse antes de integrar pedidos con mesa en N3. N1 ya entrega el contrato de backend en esta rama. Los casos que ya pasaban con el cliente común se registraron como regresiones, sin inventar ciclos RED/GREEN.

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
- [x] Registrar los merges #24 y #23, las nuevas correcciones de subtotal/facturación y los resultados de la verificación general de 192 tests.
- [x] Documentar el contrato público ampliado de productos, con ejemplos de café/pastelería y sus esquemas Zod.
- [x] Documentar Chromium, puertos y comandos E2E de la preparación inicial de F3.
- [x] Registrar el merge #26 y actualizar README, FRONTEND y planificación con contratos, funciones, fixtures/handlers y 47 tests nuevos de H2; verificación de 239 tests habituales y tres E2E, build y lint.
- [x] Registrar el merge #28 y los avances de N1 en la PR #27: compatibilidad, 13 casos HTTP, refactor y verificación general de 256 tests habituales, tres E2E, build y lint.
- [ ] Completar la documentación de los contratos HTTP definitivos y la preparación E2E con reset/seed cuando se implementen.
- [x] Documentar las mesas 1–8, retiro en barra, errores 400 y ejemplo del PDF con total 17220, incluidos comandos Bash y PowerShell.
- [ ] Documentar los contratos y comandos de reset/seed para E2E cuando N2 esté implementado.
- [x] Verificar los scripts disponibles de tests, compilación y lint después de los merges y las correcciones generales.
- [ ] Coordinar la comprobación final de scripts y configuraciones cuando estén integradas las funcionalidades restantes y los E2E.

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
- [x] Incorporar `VACIAR` y `vaciarCarrito()` con un test de Context, y usar `ProductoBase` para las acciones por producto (Federico, PR #23).

F1 tiene ahora 14 casos de lógica y utilidades: seis del reducer, cinco del Context, dos de subtotales y uno de formato. Las operaciones son `AGREGAR`, `RESTAR`, `ELIMINAR` y `VACIAR`; repetir un producto acumula cantidad y restar desde 1 lo quita. `formatoPrecio(1000)` devuelve `$1.000`. Las acciones reciben `ProductoBase`, compatible con los campos comunes de café y pastelería. Homero corrigió la integración en #20 y montó el proveedor en #21; Federico agregó la interfaz y otro caso de App en #23. F3 tiene tres E2E iniciales y conserva pendiente el recorrido completo.

### F2. Construir la interfaz del carrito

- [x] Mostrar producto, cantidad, subtotal por ítem y subtotal general orientativo.
- [x] Agregar controles accesibles para sumar, restar y quitar; mostrar el estado vacío.
- [x] Deshabilitar la confirmación si el carrito está vacío y exponer a Nicolas los ítems para enviar el pedido.
- [ ] Acordar con Nicolas que el carrito se vacía únicamente después de una confirmación exitosa; cualquier fallo conserva su contenido.
- [x] Probar con Testing Library y user-event agregar, sumar, restar, quitar y bloquear la confirmación en vacío.
- [x] Montar `Carrito` junto a `MenuPage` en el proveedor compartido y comprobarlo mediante el segundo test de App (PR #23).
- [x] Identificar el subtotal como orientativo y cubrirlo en componente y App (segunda etapa de Homero).
- [x] Cubrir restar/eliminar la última unidad y la transición habilitado/bloqueado de la confirmación; dos casos parametrizados de regresión.
- [x] Cubrir sumar café y restar pastelería con precios distintos, sin modificar las cantidades y subtotales del otro producto; dos regresiones.
- [ ] Revisar con Matias que el carrito respete el ancho de 375 px.

`Carrito.test.tsx` ejecuta 14 casos. `Carrito` e `ItemCarrito` funcionan bajo el proveedor real, pero `MenuPage` todavía muestra nombres sin botones de agregar y la confirmación no envía pedidos. La integración con M2/N3 y el vaciado después del éxito conservan sus tareas pendientes.

### F3. Implementar los E2E con API real

- [x] Configurar Playwright y el arranque de frontend y API reales con `NODE_ENV=test` para la API.
- [ ] Ejecutar `POST /__test__/reset` y `POST /__test__/seed` antes de cada test; coordinar datos y contrato con Nicolas.
- [ ] Cubrir al menos un recorrido: abrir `/?mesa=4`, elegir café, agregar pastelería, revisar carrito, confirmar y ver número, estado y total del pedido.
- [ ] Consultar el estado desde la confirmación y comprobar que funciona sin recargar la página.
- [ ] Ejecutar el recorrido con viewport de 375 px y verificar ausencia de scroll horizontal.
- [x] Conectar `npm run test:e2e` en frontend y raíz y documentar instalación de Chromium, puertos y ejecución.
- [x] Comprobar la carga de los 20 productos desde API real.
- [x] Comprobar ausencia de scroll horizontal a 375 px en la pantalla actual con carrito vacío.
- [x] Comprobar bloqueo de confirmación con carrito vacío en Chromium.

**Avance parcial de Federico, integrado mediante #26:** `frontend/e2e/menu.spec.ts` contiene esos tres casos y `playwright.config.ts` usa Chromium a 375 × 812 con servidores administrados por Playwright. El build comprueba también los tipos de configuración y pruebas E2E. En esa integración se aprobaron 83 tests del backend, 109 de Vitest y tres E2E; con H2 se llegó a 83 + 156. La verificación actual de N1 alcanza 100 + 156 y tres E2E, con build y lint aprobados. El backend ya cubre mesa 4 por HTTP; reset/seed, mesa desde URL, selección, compra y seguimiento en navegador conservan sus tareas pendientes. La prueba móvil inicial no certifica el carrito cargado ni las pantallas futuras.

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
- [x] Completar cobertura HTTP de filtrados y pastelería, restaurar la longitud esperada de 20 productos y reforzar la regresión de precios/campos (Homero, PR #24).

El PR #2 agrega búsqueda interna, #15 prepara respuestas y #18 las conecta a ambos GET. El PR #24 restaura la longitud 20 y comprueba todos los campos y precios del listado y de los 20 detalles, además del 404: 22 casos HTTP ya integrados en `develop`. Sus datos esperados están en `backend/tests/fixtures/productos.ts`, independientes del código de producción. Los dos tests unitarios del servicio siguen usando cafés; los HTTP cubren también filtrados y pastelería. Los textos y ejemplos están en [README.md](README.md#contrato-público-de-productos).

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

**Completado en `feature/mesa-pedidos` hasta `18911cd`, pendiente de integrar mediante #27.** Nicolas implementó la base; Homero incorporó `develop`, corrigió la compatibilidad y agregó cobertura HTTP, refactor y documentación.

- [x] Definir las mesas válidas del 1 al 8 y agregar `mesaId` opcional al modelo, almacenamiento, servicio y respuesta de pedidos.
- [x] Aceptar pedidos sin mesa para retirar en barra; rechazar mesa inválida o inexistente con 400 y `{ error }`, sin guardar el pedido.
- [x] Asignar `pendiente` por defecto y conservar estados explícitos válidos (Homero, PR #24).
- [x] Validar cuerpo como objeto, ítems como arreglo no vacío y cada ítem como objeto; rechazar cantidades e importes inseguros antes de guardar.
- [x] Rechazar un ID numérico de producto inexistente y cantidades inválidas; conservar pruebas previas y agregar cobertura de estados y estructuras.
- [x] Completar la validación de tipo/formato de `productoId`, con pruebas de ID ausente y objetos; impedir el 500 reproducido con `{"toString":0}` (Homero, PR #24).
- [x] Mantener `GET /pedidos/:id` con estado, ítems y total; agregar `mesaId` cuando exista y mantener consistente el listado de pedidos.
- [x] Escribir tests de pedidos con mesa y barra, mesa inexistente, cuerpo inválido, producto inexistente y consulta por ID; conservar las suites anteriores y agregar 13 casos HTTP de mesas.
- [x] Verificar el ejemplo: mesa 4, producto 5 × 2 y producto 19 × 1 devuelve 201, `pendiente` y total **17220**.
- [x] Conservar firmas compatibles y estados explícitos, centralizar rechazos con `ErrorValidacion` y extraer `validarMesaPedido()` con los tests en verde.

Los 13 casos HTTP son tres de mesas válidas (1, 4 y 8), uno para barra con estado explícito y nueve de rechazo (9, 0, -1, 4.5, `"4"`, `null`, `{}`, `[]`, `true`). Cada rechazo conserva pedidos y facturación previos y comprueba que el siguiente pedido válido reciba ID 2. Las respuestas de barra omiten `mesaId`. La descripción y los comandos están en [README.md](README.md#contrato-de-mesas-y-pedidos-en-api-n1).

### N2. Exponer reset y seed para E2E

- [x] Crear `POST /__test__/reset` y `POST /__test__/seed`, registradas únicamente cuando `NODE_ENV=test`.
- [x] Reutilizar `reiniciarPedidos()` para vaciar los pedidos y reiniciar IDs; definir un seed determinista con mesas y datos necesarios para el recorrido.
- [x] Probar los efectos de reset y seed y la ausencia de ambas rutas fuera del entorno de test.
- [x] Entregar a Federico las rutas y datos de preparación antes de completar los E2E con reset/seed.

### N3. Implementar mesa, confirmación y seguimiento en el frontend

H2 entrega `crearPedido(items)`, `consultarPedido(id)`, tipos inferidos, fixtures y handlers compartidos de éxito/error, ya integrados mediante #28. La confirmación y el seguimiento siguen pendientes de esta tarea; los tests HTTP de H2 no reemplazan sus pruebas de interfaz. El backend de N1 está completo en esta rama; el envío y conservación de mesa en el frontend requieren integrar #27 y ampliar H2. N3 debe aplicar el conjunto de mesas 1–8 al interpretar la URL y tratar valores ausentes o inválidos como barra.

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

Los nombres de archivos nuevos son orientativos. Homero integra scripts y configuraciones comunes, Matias mantiene el SASS compartido y Nicolas coordina las rutas de test. El flujo general usa ramas por funcionalidad. Por decisión explícita de Homero, las correcciones se concentraron en `fix/correcciones-generales`, integradas mediante #24 y #25. F3 inicial está integrado mediante #26 y H2 sin mesa mediante #28. La rama actual `feature/mesa-pedidos` incorporó `develop` hasta `b520964` y completa N1; todavía requiere actualizar e integrar la PR #27.

El flujo utilizado ya integra las ramas por funcionalidad en `develop` mediante PR; allí están la inicialización y los avances registrados en la sección 1. La entrega final en `main` sigue pendiente y es requisito de la consigna. Se deben conservar los commits que muestran RED, GREEN y REFACTOR.

**Próximo paso:** guardar esta actualización documental en `feature/mesa-pedidos` y subir la rama para actualizar la PR #27 a `develop`, conservando los commits originales, el merge, los tests y el REFACTOR. Después del merge y de volver a `develop` actualizado, comenzar el RED de H2 para conservar `mesaId` opcional en el esquema de pedido; las siguientes etapas ampliarán la creación, fixtures, handlers y tests. H3 continúa cuando M2 esté listo. Nicolas puede avanzar con N2 y las partes independientes de N3; la confirmación con mesa necesita la ampliación de H2. Federico completa F3 cuando estén N2/N3 y M2. Los avisos de desarrollo restantes requieren una migración revisada o un parche mantenido, respetando el stack del PDF. Cualquier edición de código requiere autorización previa del usuario.

## 9. Cobertura de las nueve funcionalidades del PDF

| N.º | Funcionalidad | Responsable | Estado actual | Verificación principal |
| --- | --- | --- | --- | --- |
| 1 | Mesa desde QR o retiro en barra. | Nicolas | API de mesa/barra lista en N1; URL y encabezado pendientes de N3. | HTTP de mesas aprobado; faltan unitarios de URL, encabezado y E2E con mesa 4. |
| 2 | Menú desde API, carga, error y reintento. | Homero | Implementada y probada. | Integración MSW de éxito, 500, red caída y contrato inválido. |
| 3 | Café en tres pasos, descripción, precios por origen y botón deshabilitado. | Matias | Pendiente; datos de API disponibles. | Unitarios de búsqueda y pruebas del selector. |
| 4 | Pastelería con precio y agregado. | Matias | Pendiente; datos de API disponibles. | Pruebas de ambos productos y agregado al Context. |
| 5 | Carrito con cantidades, subtotales, quitar y bloqueo en vacío. | Federico | Probada como componente; falta conectar el agregado real de M2. | Unitarios del reducer, Context, 14 casos de componente y dos de App. |
| 6 | Confirmación con mesa e ítems, ID, estado y total de API. | Nicolas | API lista en N1; falta integrar #27, ampliar H2 con mesa y construir la pantalla en N3. | N1 prueba POST con mesa; faltan contrato/cliente frontend con mesa, pantalla y E2E real. |
| 7 | Consulta de estado sin recargar. | Nicolas | Pantalla pendiente; `consultarPedido()` y su contrato están listos en H2. | H2 prueba GET por ID; faltan integración de seguimiento y recorrido Playwright. |
| 8 | Mensaje de rechazo y conservación del carrito. | Nicolas, con cliente de Homero y Context de Federico | Pendiente de la confirmación; cliente propaga errores de creación/consulta y Context está disponible. | H2 prueba mensajes de error; falta integración 4xx que compruebe mensaje e ítems conservados. |
| 9 | Uso a 375 px sin scroll horizontal. | Matias coordina; todos ajustan sus componentes. | Pantalla actual verificada; faltan carrito cargado y pantallas restantes. | E2E inicial de Federico y posterior revisión del recorrido completo. |

## 10. TDD y pruebas obligatorias

- **Ciclo por funcionalidad:** escribir y ejecutar un test que falle por la conducta faltante; guardar ese test en un commit; implementar y guardar el código que lo vuelve verde en un commit posterior; refactorizar conservando los tests verdes.
- **Cobertura de comportamiento existente:** si una nueva prueba pasa con la implementación actual, registrar el test como cobertura de regresión; no romper código para fabricar un RED. Así se incorporaron al menú los casos de fallo de red y respuesta incompatible.
- **Refactores de las siguientes tareas:** después de guardar el GREEN, revisar mejoras de organización o duplicación del código y las pruebas recién agregados. Registrar el REFACTOR por separado, con los tests en verde, sin reorganizar funciones terminadas de etapas anteriores.
- **Formato vigente de commits:** `RED: descripción`, `GREEN: descripción` y `REFACTOR: descripción`, con las etapas en mayúsculas por indicación de Homero y sin repetir la palabra refactor. Los mensajes históricos no se reescriben. Documentación, dependencias y cobertura de comportamiento existente usan su tipo (`docs`, `chore`, `test`) sin inventar una etapa TDD. Cada integrante realiza sus propios commits.
- **Trabajo asistido:** una tarea por vez, con autorización previa para editar y para pasar a la siguiente etapa. El asistente no ejecuta `git add`, `git commit` ni `git push`, ni modifica el staging; tampoco crea, cambia, renombra o elimina ramas sin autorización explícita. Cada cierre indica archivos, cambios, pruebas ejecutadas/resultados, comandos exactos para verificar y guardar el commit, y próximo paso sin ejecutarlo. Los PR incluyen una descripción detallada del problema, cambios, funcionamiento, cobertura, resultados y pendientes.
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
- [x] Completar la cobertura HTTP de todos los tipos y de los 20 productos (22 casos integrados mediante #24).
- [x] Pedidos admiten mesa opcional, validan sus datos y devuelven estado, ítems y total; errores previstos responden 400/404 con `{ error }` (N1 completo en esta rama, pendiente de #27).
- [x] Proxy de Vite o CORS resuelve la conexión desde el navegador.
- [ ] Reset y seed funcionan por HTTP solo con `NODE_ENV=test` y se ejecutan antes de cada E2E.
- [x] Versiones exigidas fijadas y configuración de TypeScript estricto sin `any` explícito en el frontend.
- [x] Mecanismo genérico de validación de respuestas exitosas con Zod y tipos inferidos, y manejo de errores HTTP/JSON/red.
- [x] Contrato público de productos validado con Zod y tipos inferidos, conservando los campos ampliados.
- [x] Crear esquemas y tipos inferidos, funciones HTTP, fixtures y handlers de las respuestas de pedidos de la API actual, con 47 tests nuevos en H2.
- [x] Integrar H2 sin mesa en `develop` mediante el PR #28.
- [ ] Integrar N1 mediante #27 y ampliar los contratos, funciones, fixtures, handlers y tests de H2 con `mesaId`.
- [x] Carga del menú mediante unión discriminada, cliente HTTP único y ausencia de `fetch` en componentes.
- [x] Reducer y Context del carrito implementados y probados.
- [x] Tipos y fixtures del carrito alineados; Context separado del proveedor, montado en App y probado.
- [x] Interfaz del carrito montada en App, controles y estados probados, incluido quitar la última unidad.
- [x] El carrito usa los precios recibidos e identifica el subtotal como orientativo, con pruebas de precios distintos.
- [ ] La pantalla de confirmación muestra el total devuelto por la API.
- [x] La facturación acumulada mantiene el rango seguro o devuelve un error controlado; tres casos nuevos cubren el cambio.
- [ ] Bootstrap personalizado con variables SASS antes de su importación y controles etiquetados.
- [ ] Interfaz funcional a 375 px sin scroll horizontal.
- [x] Pruebas implementadas en verde: 100 de backend y 156 de frontend (256 en total), verificadas el 6 de noviembre de 2026 hasta `18911cd`; mesas/barra, contratos/cliente/handlers, IDs mal formados y límites de facturación cubiertos con tests permanentes.
- [x] Compilación de backend/frontend y lint correctos, incluidos tipos de los tests.
- [x] Playwright, comando `test:e2e` y tres pruebas iniciales con API real aprobadas; compra completa y reset/seed siguen pendientes.
- [ ] Completar y aprobar los niveles de pruebas exigidos para todas las funcionalidades, incluidos los E2E reales.
- [ ] README explica instalación, API, frontend, contratos y todos los comandos de pruebas.
- [ ] Ramas por funcionalidad integradas por PR a `main`, TDD visible en commits y participación de los cuatro integrantes.
