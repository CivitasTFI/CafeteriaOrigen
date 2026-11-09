# Planificación del TP3 — Cafetería Origen

El trabajo se organiza según [TP3.pdf](TP3.pdf). Los ticks indican tareas implementadas y probadas; se actualizan al completar una tarea. La instalación y API están en [README.md](../README.md) y la arquitectura y pruebas del frontend en [FRONTEND.md](FRONTEND.md).

## Reparto y estado actual

| Integrante | Responsabilidad | Estado |
| --- | --- | --- |
| Homero | Herramientas, cliente HTTP, Zod, carga del menú y documentación. | H1, H2 y H3 completos; H4 espera el cierre del sistema. |
| Federico | Lógica/interfaz del carrito y E2E con API real. | F1 completo; F2 espera integración con pedidos. F3 prepara datos y cubre selección/carrito móvil; falta confirmación y seguimiento. |
| Matias | Productos de API, selector de café, pastelería y estilos. | M1 y M2 completos. M3 tiene estilos y menú/carrito móvil listos; falta revisar las futuras pantallas de pedidos. |
| Nicolas | Mesas/pedidos de API, reset/seed, URL, confirmación y seguimiento. | N1 y N2 completos; N3 tiene componentes de mesa y confirmación preparados. Faltan su conexión a App y el seguimiento. |

## Acuerdos compartidos

- Los productos se seleccionan por campos separados: `tipo`, `tipoCafe`, `tamaño` y `variedad`. Los contratos completos están en README.
- Los precios unitarios y el total confirmado provienen de la API. El carrito muestra subtotales orientativos, sin reproducir las fórmulas del dominio.
- Las mesas válidas son los enteros del 1 al 8, por decisión del grupo. Omitir la mesa significa barra. En la URL, una mesa ausente o inválida debe interpretarse como barra.
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

- [x] Implementar el cliente común con errores HTTP/JSON/red y validación Zod de respuestas exitosas.
- [x] Definir contratos y tipos inferidos de errores, productos, ítems, pedidos y respuesta de creación.
- [x] Entregar `listarProductos()`, `buscarProductos(criterios)`, `obtenerProducto(id)`, `crearPedido(items, mesaId?)` y `consultarPedido(id)`.
- [x] Admitir mesa opcional del 1 al 8, conservarla en respuestas y omitirla para barra.
- [x] Compartir fixtures tipados y handlers MSW de productos, pedidos para mesa/barra y errores.
- [x] Probar cuerpos y rutas, respuestas válidas/incompatibles, límites y errores; completar los refactores correspondientes.

### H3. Menú y errores — completo

- [x] Implementar `MenuPage`, `useMenu` y `ContenedorCatalogo` con estados de carga, error, reintento y productos disponibles.
- [x] Probar carga y recuperación ante errores HTTP, de conexión y de contrato.
- [x] Conectar el catálogo recibido con el selector de café y la pastelería, compartiendo el carrito y la recuperación ante errores.

### H4. Documentación e integración — parcial

- [x] Documentar instalación, comandos, arquitectura y contratos implementados.
- [x] Mantener el reparto y las tareas completadas/pendientes.
- [x] Documentar las vistas Pedir/Ver/Buscar, el filtro puro, la búsqueda HTTP, los estilos y la cobertura móvil con carrito cargado.
- [ ] Documentar el recorrido E2E completo cuando esté implementado; el contrato de reset/seed ya está documentado en README.
- [ ] Coordinar la verificación final de comandos, configuraciones y documentación del sistema completo.

## Tareas de Federico

### F1. Lógica del carrito — completo

- [x] Implementar Context, proveedor, hook y reducer puro.
- [x] Agregar, acumular, restar, eliminar y vaciar productos; restar desde uno quita el ítem.
- [x] Conservar ID, nombre, precio y cantidad; calcular subtotales orientativos y formatear precios.
- [x] Probar acciones, estado compartido, subtotales y formato.

### F2. Interfaz del carrito — parcial

- [x] Mostrar ítems, cantidades, subtotales y estado vacío.
- [x] Incorporar controles accesibles y bloquear confirmación con carrito vacío.
- [x] Montar el carrito en App y probar controles, última unidad y productos con precios distintos.
- [ ] Integrar con Nicolas el vaciado solo después del éxito y la conservación del carrito ante fallos.
- [x] Revisar el selector, la pastelería y el carrito cargado a 375 px, sin controles recortados ni scroll horizontal.

### F3. E2E con API real — parcial

- [x] Configurar Playwright, Chromium, servidores reales y `NODE_ENV=test` para la API.
- [x] Probar el catálogo real, navegación, selector y carrito cargado a 375 px; mantener la confirmación bloqueada en vacío.
- [x] Verificar el agregado de dos expresos medianos de Colombia y un muffin, con subtotal orientativo de $17.220.
- [x] Preparar los datos antes de cada E2E mediante seed, que reinicia los pedidos y carga ocho casos conocidos; comprobar la respuesta 201.
- [ ] Probar el recorrido `/?mesa=4`: elegir café, agregar pastelería, revisar carrito y confirmar ID, estado y total recibidos.
- [ ] Consultar el estado sin recargar y comprobar el recorrido completo a 375 px sin scroll horizontal.

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

### M3. Estilos y accesibilidad — parcial

- [x] Incorporar Bootstrap personalizado con variables SASS declaradas antes de importarlo.
- [x] Definir estilos compartidos y controles etiquetados con nombres accesibles.
- [x] Revisar selector, pastelería y carrito cargado a 375 px sin recortes ni scroll horizontal.
- [ ] Revisar las pantallas de confirmación y seguimiento a 375 px cuando N3 esté disponible.

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

### N3. Mesa, confirmación y seguimiento — parcial

`leerMesa`, `Encabezado`, `ConfirmarPedido` y `ConfirmacionPedido` están disponibles como componentes y utilidades probados. Todavía no están conectados a App; el botón de confirmar de la pantalla actual conserva su comportamiento anterior.

- [x] Leer `?mesa=N` con una función pura; probar valores válidos, ausencia, tipos y números inválidos o fuera de rango.
- [x] Preparar el encabezado para mostrar mesa o retiro en barra.
- [x] Preparar la confirmación con ítems y mesa mediante el cliente H2; bloquear carrito vacío y envíos repetidos.
- [x] Mostrar ID, estado y total de API en el componente de confirmación; vaciar el carrito únicamente después del éxito.
- [x] Mostrar errores HTTP, de conexión o contrato conservando el carrito y permitir reintentar.
- [ ] Conectar los componentes a App y pasar la mesa leída de la URL, coordinando el estado de envío con la interfaz del carrito.
- [ ] Consultar el estado por ID sin recargar, con estados de carga y error.
- [x] Probar con MSW los componentes de creación para mesa/barra, cuerpo del POST, bloqueo, rechazo con carrito conservado y contrato incompatible.
- [ ] Probar la integración en App y el seguimiento con MSW.

## Dependencias y próximo trabajo

| Trabajo | Qué necesita |
| --- | --- |
| N3: conexión y seguimiento | Componentes de encabezado y confirmación, cliente HTTP, Context y selección disponibles; falta montar el flujo en App y completar el seguimiento. |
| F2: vaciado y conservación ante fallos | Integración con la confirmación de N3. |
| M3: revisión móvil restante | Pantallas de confirmación y seguimiento de N3. |
| F3: recorrido completo | Confirmación y seguimiento de N3; revisión visual con M3. La selección y la preparación de datos ya están implementadas. |
| H4: cierre documental | Contratos y pantallas finales de N3 y recorrido completo de F3. |

**Para Homero:** H1, H2 y H3 están terminados. De H4 quedan la documentación y la verificación del flujo completo cuando N3/F3 estén disponibles; no hace falta repetir la integración del selector y la pastelería.

## Funcionalidades del PDF

| N.º | Funcionalidad | Estado actual |
| --- | --- | --- |
| 1 | Mesa desde QR/URL o barra. | API, lectura de URL y encabezado preparados; conexión a App pendiente. |
| 2 | Menú desde API, carga, error y reintento. | Implementado y probado. |
| 3 | Café en tres pasos, descripciones y precios por origen. | Implementado y probado. |
| 4 | Pastelería con precio y agregado. | Implementado y conectado al carrito. |
| 5 | Carrito, cantidades, subtotales, quitar y bloqueo en vacío. | Implementado y conectado al agregado real de café/pastelería. |
| 6 | Confirmación con ID, estado y total de API. | API, cliente y componentes listos; conexión a la pantalla pendiente de N3. |
| 7 | Consulta de estado sin recargar. | Cliente listo; interfaz pendiente de N3. |
| 8 | Rechazo visible y carrito conservado. | Componente probado ante errores; integración en App pendiente de N3/F2. |
| 9 | Uso a 375 px sin scroll horizontal. | Selector y carrito cargado verificados sin recortes; faltan pantallas de pedidos y recorrido completo. |

## Metodología y entrega

- Trabajar un comportamiento por vez mediante **RED → GREEN → REFACTOR**, verificando el resultado de cada etapa. En el trabajo asistido se espera autorización antes de avanzar a la siguiente.
- Usar commits separados: `RED: descripción`, `GREEN: descripción` y `REFACTOR: descripción`. El refactor debe tener una mejora justificable y conservar los tests verdes.
- Si una prueba nueva ya pasa, registrarla como regresión sin romper código para fabricar un RED. Documentación y cobertura existente usan `docs:` y `test:`.
- Mantener tests de API con Jest/Supertest; unitarios, componentes e integración de frontend con Vitest/Testing Library/MSW; pocos E2E con Playwright y API real, incluyendo un recorrido completo y la preparación de datos mediante seed antes de cada test.
- Consultar la interfaz por rol, etiqueta o texto. Usar `getByTestId` cuando no haya una alternativa adecuada.
- Cada integrante guarda sus commits y trabaja en sus tareas. El asistente entrega comandos y no ejecuta `git add`, `git commit` ni `git push`; cambiar ramas requiere autorización.
- Integrar por PR con revisión cruzada y preservar la evidencia TDD. Homero revisa a Federico; Federico a Homero; Matias a Nicolas; Nicolas a Matias. La entrega final debe quedar en `main`.
- Mantener la documentación centrada en uso, contratos vigentes y tareas completadas/pendientes. El historial detallado permanece en Git.

### Checklist de entrega

- [x] Backend y frontend conviven en el repositorio con comandos de instalación, desarrollo y pruebas.
- [x] API de productos y pedidos, proxy, cliente HTTP validado y carrito implementados con sus pruebas.
- [x] Incorporar Bootstrap personalizado con SASS y controles del menú accesibles a 375 px.
- [ ] Completar las nueve funcionalidades, incluida la mesa desde URL, confirmación y seguimiento.
- [x] Habilitar reset/seed solo en test y preparar los datos de cada E2E mediante seed.
- [ ] Aprobar el recorrido completo de compra y seguimiento a 375 px.
- [ ] Ejecutar tests, build y lint sobre el sistema completo, y actualizar sus instrucciones finales.
- [ ] Completar revisiones cruzadas e integrar la entrega en `main`, con participación de los cuatro integrantes y TDD visible.
