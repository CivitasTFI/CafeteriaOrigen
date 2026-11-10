# Planificación del TP3 — Cafetería Origen

Registro del reparto y del alcance entregado según [TP3.pdf](TP3.pdf). Las tareas de los cuatro integrantes están implementadas, probadas e integradas en `main`; los ticks identifican ese trabajo completado. La instalación y API están en [README.md](../README.md) y la arquitectura y pruebas del frontend en [FRONTEND.md](FRONTEND.md).

## Reparto y tareas completadas

| Integrante | Responsabilidad | Estado |
| --- | --- | --- |
| Homero | Herramientas, cliente HTTP, Zod, carga del menú y documentación. | H1, H2, H3 y H4 completos. |
| Federico | Lógica/interfaz del carrito y E2E con API real. | F1, F2 y F3 completos, incluido el recorrido de confirmación y seguimiento. |
| Matias | Productos de API, selector de café, pastelería y estilos. | M1, M2 y M3 completos; recorrido móvil verificado. |
| Nicolas | Mesas/pedidos de API, reset/seed, URL, confirmación y seguimiento. | N1, N2 y N3 completos y conectados a App. |

## Acuerdos compartidos

- Los productos se seleccionan por campos separados: `tipo`, `tipoCafe`, `tamaño` y `variedad`. Los contratos completos están en README.
- Los precios unitarios y el total confirmado provienen de la API. El carrito muestra subtotales orientativos, sin reproducir las fórmulas del dominio.
- Las mesas válidas son los enteros del 1 al 8, por decisión del grupo. Omitir la mesa significa barra. En la URL, una mesa ausente o inválida se interpreta como barra.
- El frontend usa `crearPedido(items, mesaId?)` y `consultarPedido(id)`. Antes de enviar, transforma el carrito a `{ productoId, cantidad }`. No envía estado; la API asigna `pendiente`.
- Los componentes consultan mediante el cliente HTTP y validan respuestas con Zod. Los tipos se derivan con `z.infer` y se mantiene TypeScript estricto sin `any` explícito.
- Pedir y Ver productos reciben el catálogo validado mediante `ContenedorCatalogo`. El selector y la pastelería lo filtran en memoria; la vista Buscar productos consulta `/productos/buscar`, que rechaza filtros repetidos.

## Tareas de Homero

### H1. Herramientas — completo

- [x] Preparar Vite, React, TypeScript estricto y ESLint.
- [x] Configurar Vitest, Testing Library, MSW y separación de pruebas backend/frontend.
- [x] Configurar el proxy y los comandos raíz de instalación, desarrollo, pruebas, build y lint.
- [x] Integrar el proveedor compartido del carrito y los comandos de Playwright.

### H2. Contratos y cliente HTTP — completo

- [x] Implementar el cliente común con errores HTTP/JSON/red, límite de 15 segundos para conexión/cuerpo y validación Zod de respuestas exitosas.
- [x] Definir contratos y tipos inferidos de errores, productos, ítems, pedidos y respuesta de creación.
- [x] Entregar `listarProductos()`, `buscarProductos(criterios)`, `obtenerProducto(id)`, `crearPedido(items, mesaId?)` y `consultarPedido(id)`.
- [x] Admitir mesa opcional del 1 al 8, conservarla en respuestas y omitirla para barra.
- [x] Compartir fixtures tipados y handlers MSW de productos, pedidos para mesa/barra y errores.
- [x] Probar cuerpos y rutas, respuestas válidas/incompatibles, límites y errores; completar los refactores correspondientes.

### H3. Menú y errores — completo

- [x] Implementar `MenuPage`, `useMenu` y `ContenedorCatalogo` con estados de carga, error, reintento y productos disponibles.
- [x] Probar carga y recuperación ante errores HTTP, de conexión y de contrato.
- [x] Conectar el catálogo recibido con el selector de café y la pastelería, compartiendo el carrito y la recuperación ante errores.

### H4. Documentación e integración — completo

- [x] Documentar instalación, comandos, arquitectura y contratos implementados.
- [x] Documentar el reparto y el alcance completado por cada integrante.
- [x] Documentar las vistas Pedir/Ver/Buscar, el filtro puro, la búsqueda HTTP, los estilos y la cobertura móvil con carrito cargado.
- [x] Documentar el recorrido E2E completo y el contrato de reset/seed.
- [x] Verificar tests, E2E, build, lint, configuraciones y documentación del sistema completo.

## Tareas de Federico

### F1. Lógica del carrito — completo

- [x] Implementar Context, proveedor, hook y reducer puro.
- [x] Agregar, acumular, restar, eliminar y vaciar productos; restar desde uno quita el ítem.
- [x] Conservar ID, nombre, precio y cantidad; calcular subtotales orientativos y formatear precios.
- [x] Probar acciones, estado compartido, subtotales y formato.

### F2. Interfaz del carrito — completo

- [x] Mostrar ítems, cantidades, subtotales y estado vacío.
- [x] Incorporar controles accesibles y bloquear confirmación con carrito vacío.
- [x] Montar el carrito en App y probar controles, última unidad y productos con precios distintos.
- [x] Integrar con Nicolas el vaciado solo después del éxito y la conservación del carrito ante fallos; bloquear su edición durante el envío.
- [x] Revisar el selector, la pastelería y el carrito cargado a 375 px, sin controles recortados ni scroll horizontal.

### F3. E2E con API real — completo

- [x] Configurar Playwright, Chromium, servidores reales y `NODE_ENV=test` para la API.
- [x] Probar el catálogo real, navegación, selector y carrito cargado a 375 px; mantener la confirmación bloqueada en vacío.
- [x] Verificar el agregado de dos expresos medianos de Colombia y un muffin, con subtotal orientativo de $17.220.
- [x] Preparar los datos antes de cada E2E mediante seed, que reinicia los pedidos y carga ocho casos conocidos; comprobar la respuesta 201.
- [x] Probar el recorrido `/?mesa=4`: elegir café, agregar pastelería, revisar carrito y confirmar ID, estado y total recibidos.
- [x] Consultar el estado sin recargar y comprobar el recorrido completo a 375 px sin scroll horizontal.
- [x] Probar barra ante una mesa inválida y el rechazo de la API con carrito conservado y reintento exitoso; conservar el seguimiento anterior si falla un nuevo pedido y reemplazarlo después del éxito.

## Tareas de Matias

### M1. Productos de la API — completo

- [x] Mantener los 20 productos, sus IDs y las fórmulas de `calcularPrecio()`.
- [x] Incorporar clasificación, bebida, tamaño y origen según el tipo, y búsqueda interna con filtros opcionales.
- [x] Exponer `/productos/buscar` con filtros opcionales, rechazo 400 de criterios inválidos/repetidos y 404 sin coincidencias; mantener MSW consistente con la API.
- [x] Exponer representaciones coherentes de café/pastelería en ambos GET, con descripciones de acidez, cuerpo y notas.
- [x] Probar búsqueda, armado de respuestas, catálogo completo, detalles, precios y producto inexistente.
- [x] Entregar el contrato público documentado y consumido por Zod y MSW.

### M2. Selector de café y pastelería — completo

- [x] Implementar y probar `filtrarProductos()` para buscar por bebida, tamaño y origen en el catálogo recibido.
- [x] Ofrecer selección en tres pasos: expreso/filtrado; pocillo/mediano/taza grande; Colombia/Etiopía/Brasil.
- [x] Mostrar descripciones y, al elegir bebida y tamaño, el precio de API de cada origen.
- [x] Bloquear agregar hasta completar una combinación válida; limpiar el origen al cambiar bebida o tamaño.
- [x] Agregar al Context el café elegido y ambas opciones de pastelería, mostrando sus precios.
- [x] Probar selección, cambios, bloqueo del botón, precios y agregado al carrito.
- [x] Ofrecer navegación entre Pedir, Ver productos y Buscar productos, conservando el carrito; mostrar el detalle desde el catálogo y manejar su ausencia.

### M3. Estilos y accesibilidad — completo

- [x] Incorporar Bootstrap personalizado con variables SASS declaradas antes de importarlo.
- [x] Definir estilos compartidos y controles etiquetados con nombres accesibles.
- [x] Revisar selector, pastelería y carrito cargado a 375 px sin recortes ni scroll horizontal.
- [x] Revisar las pantallas de confirmación y seguimiento a 375 px, con controles etiquetados y sin recortes ni scroll horizontal.

## Tareas de Nicolas

### N1. Mesas y pedidos en API — completo

- [x] Admitir mesas 1–8 o barra y conservar la mesa en creación, listado y detalle.
- [x] Asignar estado predeterminado y conservar estados explícitos válidos.
- [x] Validar cuerpo, ítems, productos, cantidades, estados e importes; centralizar errores sin guardar pedidos inválidos.
- [x] Probar mesa/barra, rechazos, conservación de pedidos/facturación/IDs y el ejemplo del PDF con total 17220.

### N2. Reset y seed — completo

- [x] Crear `POST /__test__/reset` y `POST /__test__/seed`, disponibles únicamente con `NODE_ENV=test`.
- [x] Reutilizar `reiniciarPedidos()` para vaciar pedidos y reiniciar IDs; definir datos iniciales deterministas.
- [x] Probar sus efectos y que las rutas no existan fuera del entorno de test.
- [x] Documentar el contrato y coordinar su uso con Federico.

El [contrato de reset/seed](../README.md#datos-de-prueba-reset-y-seed) detalla respuestas y datos iniciales. Reset responde 200 y deja el próximo ID en 1; seed responde 201, reemplaza los pedidos por ocho casos conocidos y deja el próximo ID en 9. F3 utiliza seed antes de cada E2E mediante la función compartida `prepararApi`.

### N3. Mesa, confirmación y seguimiento — completo

`App` conecta la mesa desde la URL, el encabezado, el carrito y la confirmación. Desde el pedido confirmado se puede consultar su estado sin recargar ni ingresar nuevamente el ID.

- [x] Leer `?mesa=N` con una función pura; probar valores válidos, ausencia, tipos y números inválidos o fuera de rango.
- [x] Mostrar mesa o retiro en barra en el encabezado de App.
- [x] Enviar la confirmación con ítems y mesa mediante el cliente H2; bloquear carrito vacío y envíos repetidos.
- [x] Mostrar ID, estado y total de API en el componente de confirmación; vaciar el carrito únicamente después del éxito.
- [x] Mostrar errores HTTP, de conexión, timeout o contrato conservando el carrito y el último pedido confirmado.
- [x] Conectar los componentes a App y pasar la mesa leída de la URL; bloquear selección, navegación y edición mientras se envía.
- [x] Consultar desde la confirmación el estado del ID recibido, sin recargar, con carga, error y reintento; mantener un único estado visible y descartar actualizaciones de pedidos anteriores.
- [x] Probar con MSW los componentes de creación para mesa/barra, cuerpo del POST, bloqueo, rechazo con carrito conservado y contrato incompatible.
- [x] Probar la integración en App y el seguimiento con MSW, incluidos errores de red/contrato, consultas repetidas e IDs fuera de rango seguro.

## Funcionalidades del PDF

| N.º | Funcionalidad | Comportamiento entregado |
| --- | --- | --- |
| 1 | Mesa desde QR/URL o barra. | Implementado y conectado a App; mesa válida o retiro en barra. |
| 2 | Menú desde API, carga, error y reintento. | Implementado y probado. |
| 3 | Café en tres pasos, descripciones y precios por origen. | Implementado y probado. |
| 4 | Pastelería con precio y agregado. | Implementado y conectado al carrito. |
| 5 | Carrito, cantidades, subtotales, quitar y bloqueo en vacío. | Implementado y conectado al agregado real de café/pastelería. |
| 6 | Confirmación con ID, estado y total de API. | Implementado y probado desde App y con la API real. |
| 7 | Consulta de estado sin recargar. | Disponible desde la confirmación, con carga, error y reintento. |
| 8 | Rechazo visible y carrito conservado. | Implementado; probado con MSW y un rechazo real de API seguido de reintento. |
| 9 | Uso a 375 px sin scroll horizontal. | Selector, carrito, confirmación y seguimiento verificados con el recorrido completo. |

## Metodología y entrega

- El trabajo está integrado en `main` mediante Pull Requests de las ramas de funcionalidades y correcciones, con participación de los cuatro integrantes.
- El historial conserva ciclos **RED → GREEN → REFACTOR**, junto con commits de correcciones (`fix:`), cobertura de regresión (`test:`) y documentación (`docs:`).
- Las pruebas de API utilizan Jest/Supertest. El frontend separa unitarios, componentes e integración con Vitest/Testing Library/MSW de los E2E con Playwright y API real.
- Las pruebas de interfaz consultan por rol, etiqueta o texto. Los handlers MSW reproducen las rutas, códigos y errores de la API; cada E2E prepara sus datos mediante seed.
- La documentación describe el uso, los contratos y el alcance entregado. El detalle de commits y revisiones permanece en Git y en las Pull Requests.

### Checklist de entrega

- [x] Backend y frontend conviven en el repositorio con comandos de instalación, desarrollo y pruebas.
- [x] API de productos y pedidos, proxy, cliente HTTP validado y carrito implementados con sus pruebas.
- [x] Bootstrap personalizado con SASS y controles del menú accesibles a 375 px.
- [x] Nueve funcionalidades implementadas, incluida la mesa desde URL, confirmación y seguimiento.
- [x] Reset/seed disponibles solo en test y preparación de datos antes de cada E2E mediante seed.
- [x] Recorrido completo de compra y seguimiento a 375 px verificado.
- [x] Tests, E2E, build y lint del sistema completo aprobados y documentados.
- [x] Funcionalidades integradas en `main` mediante Pull Requests.
- [x] Historial con participación de los cuatro integrantes y ciclos TDD visibles.
