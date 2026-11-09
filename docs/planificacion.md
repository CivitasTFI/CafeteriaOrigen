# Planificación del TP3 — Cafetería Origen

El trabajo se organiza según [TP3.pdf](TP3.pdf). Los ticks indican tareas implementadas y probadas; se actualizan al completar una tarea. La instalación y API están en [README.md](../README.md) y la arquitectura y pruebas del frontend en [FRONTEND.md](FRONTEND.md).

## Reparto y estado actual

| Integrante | Responsabilidad | Estado |
| --- | --- | --- |
| Homero | Herramientas, cliente HTTP, Zod, carga del menú y documentación. | H1 y H2 completos; H3 espera componentes de M2 y H4 acompaña el cierre del sistema. |
| Federico | Lógica/interfaz del carrito y E2E con API real. | F1 completo; F2 espera integración con pedidos y revisión móvil; F3 tiene preparación de datos y cuatro E2E, con el recorrido completo pendiente. |
| Matias | Productos de API, selector de café, pastelería y estilos. | M1 completo; M2 y M3 pendientes. |
| Nicolas | Mesas/pedidos de API, reset/seed, URL, confirmación y seguimiento. | N1 y N2 completos e integrados en develop; N3 pendiente. |

## Acuerdos compartidos

- Los productos se seleccionan por campos separados: `tipo`, `tipoCafe`, `tamaño` y `variedad`. Los contratos completos están en README.
- Los precios unitarios y el total confirmado provienen de la API. El carrito muestra subtotales orientativos, sin reproducir las fórmulas del dominio.
- Las mesas válidas son los enteros del 1 al 8, por decisión del grupo. Omitir la mesa significa barra. En la URL, una mesa ausente o inválida debe interpretarse como barra.
- El frontend usa `crearPedido(items, mesaId?)` y `consultarPedido(id)`. Antes de enviar, transforma el carrito a `{ productoId, cantidad }`. No envía estado; la API asigna `pendiente`.
- Los componentes consultan mediante el cliente HTTP y validan respuestas con Zod. Los tipos se derivan con `z.infer` y se mantiene TypeScript estricto sin `any` explícito.

## Tareas de Homero

### H1. Herramientas — completo

- [x] Preparar Vite, React, TypeScript estricto y ESLint.
- [x] Configurar Vitest, Testing Library, MSW y separación de pruebas backend/frontend.
- [x] Configurar el proxy y los comandos raíz de instalación, desarrollo, pruebas, build y lint.
- [x] Integrar el proveedor compartido del carrito y los comandos de Playwright.

### H2. Contratos y cliente HTTP — completo

- [x] Implementar el cliente común con errores HTTP/JSON/red y validación Zod de respuestas exitosas.
- [x] Definir contratos y tipos inferidos de errores, productos, ítems, pedidos y respuesta de creación.
- [x] Entregar `listarProductos()`, `crearPedido(items, mesaId?)` y `consultarPedido(id)`.
- [x] Admitir mesa opcional del 1 al 8, conservarla en respuestas y omitirla para barra.
- [x] Compartir fixtures tipados y handlers MSW de productos, pedidos para mesa/barra y errores.
- [x] Probar cuerpos y rutas, respuestas válidas/incompatibles, límites y errores; completar los refactores correspondientes.

### H3. Menú y errores — parcial

- [x] Implementar `MenuPage` y `useMenu` con estados de carga, error, reintento y productos disponibles.
- [x] Probar carga y recuperación ante errores HTTP, de conexión y de contrato.
- [ ] Conectar el menú con el selector de café y la pastelería cuando M2 esté disponible.

### H4. Documentación e integración — parcial

- [x] Documentar instalación, comandos, arquitectura y contratos implementados.
- [x] Mantener el reparto y las tareas completadas/pendientes.
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
- [ ] Revisar el carrito cargado a 375 px con Matias.

### F3. E2E con API real — parcial

- [x] Configurar Playwright, Chromium, servidores reales y `NODE_ENV=test` para la API.
- [x] Probar menú real, ancho móvil de la pantalla actual y confirmación bloqueada en vacío.
- [x] Preparar los datos antes de cada E2E mediante seed, que reinicia los pedidos y carga ocho casos conocidos; comprobar la respuesta 201.
- [ ] Probar el recorrido `/?mesa=4`: elegir café, agregar pastelería, revisar carrito y confirmar ID, estado y total recibidos.
- [ ] Consultar el estado sin recargar y comprobar el recorrido completo a 375 px sin scroll horizontal.

## Tareas de Matias

### M1. Productos de la API — completo

- [x] Mantener los 20 productos, sus IDs y las fórmulas de `calcularPrecio()`.
- [x] Incorporar clasificación, bebida, tamaño y origen según el tipo, y búsqueda interna con filtros opcionales.
- [x] Exponer representaciones coherentes de café/pastelería en ambos GET, con descripciones de acidez, cuerpo y notas.
- [x] Probar búsqueda, armado de respuestas, catálogo completo, detalles, precios y producto inexistente.
- [x] Entregar el contrato público documentado y consumido por Zod y MSW.

### M2. Selector de café y pastelería — pendiente

- [ ] Implementar y probar una función pura de búsqueda por bebida, tamaño y origen entre los productos recibidos.
- [ ] Ofrecer selección en tres pasos: expreso/filtrado; pocillo/mediano/taza grande; Colombia/Etiopía/Brasil.
- [ ] Mostrar descripciones y, al elegir bebida y tamaño, el precio de API de cada origen.
- [ ] Bloquear agregar hasta completar una combinación válida; evitar selecciones incompatibles al cambiar opciones.
- [ ] Agregar al Context el café elegido y ambas opciones de pastelería, mostrando sus precios.
- [ ] Probar selección, cambios, bloqueo del botón, precios y agregado al carrito.

### M3. Estilos y accesibilidad — pendiente

- [ ] Incorporar Bootstrap personalizado con variables SASS declaradas antes de importarlo.
- [ ] Definir estilos compartidos y controles etiquetados con nombres accesibles.
- [ ] Revisar selector, pastelería, carrito y pantallas de pedidos a 375 px sin scroll horizontal.

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

El [contrato de reset/seed](../README.md#datos-de-prueba-reset-y-seed) detalla respuestas y datos iniciales. Reset responde 200 y deja el próximo ID en 1; seed responde 201, reemplaza los pedidos por ocho casos conocidos y deja el próximo ID en 9. N2 está integrado en develop. F3 utiliza seed antes de cada E2E mediante la función compartida `prepararApi`.

### N3. Mesa, confirmación y seguimiento — pendiente

- [ ] Leer `?mesa=N` con una función pura; probar valores válidos, ausencia, tipos y números inválidos o fuera de rango.
- [ ] Mostrar mesa o retiro en barra en el encabezado.
- [ ] Enviar ítems y mesa mediante el cliente H2; indicar carga y bloquear confirmaciones repetidas durante el envío.
- [ ] Mostrar ID, estado y total de API; vaciar el carrito únicamente después del éxito.
- [ ] Mostrar errores HTTP, de conexión o contrato conservando el carrito.
- [ ] Consultar el estado por ID sin recargar, con estados de carga y error.
- [ ] Probar con MSW el pedido para mesa/barra, cuerpo del POST, rechazo con carrito conservado, contrato incompatible y seguimiento.

## Dependencias y próximo trabajo

| Trabajo | Qué necesita |
| --- | --- |
| H3: conectar selección | Componentes de M2. |
| N2: reset/seed | Completado e integrado en develop; F3 ya utiliza seed para preparar los datos. |
| N3: confirmación y seguimiento | Cliente H2 y Context disponibles; puede desarrollarse con MSW mientras se termina la selección. |
| F2: vaciado y conservación ante fallos | Integración con la confirmación de N3. |
| F3: recorrido completo | N3 y M2; revisión visual con M3. La preparación de datos con N2 ya está implementada. |
| H4: cierre documental | Recorrido final de F3; el contrato de N2 ya está documentado. |

**Para Homero:** H2 está terminado. La siguiente implementación es conectar M2 en H3 cuando esos componentes estén listos; el cierre de H4 depende de las funcionalidades restantes.

## Funcionalidades del PDF

| N.º | Funcionalidad | Estado actual |
| --- | --- | --- |
| 1 | Mesa desde QR/URL o barra. | API y cliente listos; lectura de URL y encabezado pendientes. |
| 2 | Menú desde API, carga, error y reintento. | Implementado y probado. |
| 3 | Café en tres pasos, descripciones y precios por origen. | Pendiente de M2. |
| 4 | Pastelería con precio y agregado. | Pendiente de M2. |
| 5 | Carrito, cantidades, subtotales, quitar y bloqueo en vacío. | Componente probado; falta conectarlo al agregado real de M2. |
| 6 | Confirmación con ID, estado y total de API. | API y cliente listos; pantalla pendiente de N3. |
| 7 | Consulta de estado sin recargar. | Cliente listo; interfaz pendiente de N3. |
| 8 | Rechazo visible y carrito conservado. | Cliente y Context disponibles; integración pendiente de N3/F2. |
| 9 | Uso a 375 px sin scroll horizontal. | Pantalla actual verificada; faltan carrito cargado y recorrido completo. |

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
- [ ] Completar las nueve funcionalidades y Bootstrap personalizado con SASS.
- [x] Habilitar reset/seed solo en test y preparar los datos de cada E2E mediante seed.
- [ ] Aprobar el recorrido completo de compra y seguimiento a 375 px.
- [ ] Ejecutar tests, build y lint sobre el sistema completo, y actualizar sus instrucciones finales.
- [ ] Completar revisiones cruzadas e integrar la entrega en `main`, con participación de los cuatro integrantes y TDD visible.
