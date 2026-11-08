# Cafetería Origen

Proyecto del Grupo 14 para Programación IV, Tecnicatura Universitaria en Programación, UTN FRBB. Incluye una API Express y el frontend del TP3 en React.

| Integrante | Legajo |
| --- | --- |
| Homero Colombo | 23086 |
| Matías Oviedo | 22737 |
| Nicolás Espulef | 22901 |
| Federico Heinrich | 21317 |

## Documentación

| Documento | Contenido |
| --- | --- |
| [FRONTEND.md](FRONTEND.md) | Arquitectura, cliente HTTP, carrito y pruebas del frontend. |
| [planificacion.md](planificacion.md) | Reparto del TP3, tareas completadas, pendientes y dependencias. |
| [TP3.pdf](TP3.pdf) | Consigna académica. |
| [Reparto del Parcial I](<Reparto del trabajo – Cafetería Origen (Parcial I).md>) | Referencia de la base de backend y del reparto del primer parcial. |

## Requisitos e instalación

Se necesita npm y Node.js compatible con `^20.19.0 || >=22.12.0`.

Desde la raíz del repositorio:

```powershell
npm run install:all
```

Este comando ejecuta `npm ci` en `backend/` y `frontend/` usando sus lockfiles. La raíz solo agrupa comandos y no tiene dependencias propias.

## Desarrollo

Iniciar la API en una terminal:

```powershell
npm run dev:backend
```

Iniciar el frontend en otra:

```powershell
npm run dev:frontend
```

| Aplicación | Dirección predeterminada |
| --- | --- |
| API Express | `http://localhost:3000` |
| Frontend Vite | `http://localhost:5173` |

El proxy de Vite envía `/productos` y `/pedidos`, incluidas sus subrutas, a la API sin cambiar el nombre de la ruta. `/reportes` se consulta directamente en el backend. Si se cambia el puerto de la API mediante `PORT`, también se debe ajustar el destino en `frontend/vite.config.ts`.

Los pedidos se guardan en memoria y se pierden al reiniciar el servidor.

## Comandos

Todos se ejecutan desde la raíz.

| Comando | Función |
| --- | --- |
| `npm run install:all` | Instalar ambos paquetes desde sus lockfiles. |
| `npm run dev:backend` / `npm run dev:frontend` | Iniciar cada aplicación en desarrollo. |
| `npm test` | Ejecutar Jest del backend y Vitest del frontend. |
| `npm run test:backend` / `npm run test:frontend` | Ejecutar las pruebas de un paquete. |
| `npm run test:watch:backend` / `npm run test:watch:frontend` | Ejecutar pruebas en modo watch. |
| `npm run test:e2e` | Ejecutar Playwright con frontend y API reales. |
| `npm run build` | Compilar ambos paquetes y comprobar tipos, incluidos tests y configuraciones del frontend. |
| `npm run build:backend` / `npm run build:frontend` | Compilar un paquete. |
| `npm run lint` | Revisar el frontend con ESLint. |

Para verificar el sistema:

```powershell
npm test
npm run build
npm run lint
```

Las pruebas de Jest/Vitest no requieren servidores externos. Los requisitos y comandos de Playwright están en [Pruebas E2E](FRONTEND.md#pruebas-e2e).

Para ejecutar un archivo específico:

```powershell
npm run test:backend -- --runTestsByPath tests/integration/pedidos.mesa.test.ts
npm run test:frontend -- src/test/integration/pedidos.api.test.ts
```

Después del build, `npm --prefix backend start` ejecuta la API compilada y `npm --prefix frontend run preview` permite inspeccionar el frontend compilado. La configuración de despliegue se define por separado.

## Estructura

```text
backend/
  src/          # Modelos, datos, servicios, controladores, rutas y middleware
  tests/        # Unitarios e integración con Jest/Supertest
frontend/
  src/          # Aplicación React y pruebas con Vitest/MSW
  e2e/          # Pruebas Playwright
README.md
FRONTEND.md
planificacion.md
TP3.pdf
```

## API

| Método | Ruta | Respuesta exitosa |
| --- | --- | --- |
| GET | `/productos` | Lista de productos. |
| GET | `/productos/:id` | Un producto. |
| POST | `/pedidos` | 201 con `{ mensaje, pedido }`. |
| GET | `/pedidos` | Lista de pedidos. |
| GET | `/pedidos/:id` | Pedido directo. |
| GET | `/reportes/facturacion` | `{ facturacion: number }`. |
| GET | `/reportes/mas-vendido` | `{ productosMasVendidos }`. |
-------------------------------------------------------
| POST | `/__test__/seed` | 200 con `{ mensaje }` |
| POST | `/__test__/reset` |  201 con `{ mensaje }` |
Requisito: configurar la variable de entorno NODE_ENV=test para habilitar estas rutas. Fuera de este entorno no estarán disponibles y responderán con 404.

Datos cargados: el seed genera los datos iniciales necesarios para realizar pruebas, incluyendo los pedidos de ejemplo y sus respectivos datos asociados.
### Productos

El catálogo tiene 20 productos: nueve expresos, nueve filtrados y dos opciones de pastelería. Listado y detalle usan el mismo contrato; los precios provienen de `calcularPrecio()` del dominio.

| Campo | Café | Pastelería |
| --- | --- | --- |
| `id`, `nombre`, `precio` | ID numérico, nombre y precio. | Mismos campos comunes. |
| `tipo` | `"cafe"` | `"pasteleria"` |
| `tipoCafe` | `"expreso"` o `"filtrado"` | Se omite. |
| `tamaño` | `"pocillo"`, `"mediano"` o `"taza grande"` | Se omite. |
| `variedad` | `{ nombre, descripcion }`, con origen `brasil`, `colombia` o `etiopia`. | `"muffin de chocolate"` o `"torta selva negra"`. |

Ejemplos de productos:

```json
[
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
  },
  {
    "id": 19,
    "nombre": "Muffin de Chocolate",
    "tipo": "pasteleria",
    "variedad": "muffin de chocolate",
    "precio": 2500
  }
]
```

Las descripciones de acidez, cuerpo y notas están en `variedadesDescripcion`, dentro de `backend/src/services/formar-respuesta.service.ts`. El frontend selecciona por los campos del contrato, sin extraer información de `nombre` ni reproducir las fórmulas de precios.

### Pedidos y mesas

`POST /pedidos` recibe `{ items: [{ productoId, cantidad }], mesaId?, estado? }`.

- Los IDs de producto y las cantidades deben ser enteros positivos seguros; debe existir al menos un ítem.
- Las mesas válidas son los enteros del **1 al 8**. Ese conjunto es una decisión del grupo. Omitir `mesaId` significa retiro en barra y la respuesta también omite el campo.
- Si se omite `estado`, la API asigna `"pendiente"`. Un estado explícito debe ser texto con algún carácter distinto de espacio; no hay un catálogo cerrado de estados.
- La API calcula el total. Cantidades, subtotales y totales fuera del rango seguro se rechazan antes de guardar.
- Un pedido rechazado conserva los pedidos anteriores, la facturación y la secuencia de IDs.

Ejemplo del PDF:

```json
{
  "mesaId": 4,
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ]
}
```

Respuesta 201, suponiendo que es el primer pedido del servidor:

```json
{
  "mensaje": "El pedido se guardó correctamente",
  "pedido": {
    "id": 1,
    "items": [
      { "productoId": 5, "cantidad": 2 },
      { "productoId": 19, "cantidad": 1 }
    ],
    "estado": "pendiente",
    "mesaId": 4,
    "total": 17220
  }
}
```

`GET /pedidos/:id` devuelve directamente el objeto `pedido`; el listado devuelve esos objetos en un arreglo. Las funciones para consumirlos desde React están en [Cliente HTTP](FRONTEND.md#cliente-http).

### Errores

Los errores tienen la forma `{ "error": "mensaje" }`.

| Situación | HTTP y comportamiento |
| --- | --- |
| Cuerpo, ítems, estado o ID mal formados | 400 con el mensaje de validación. |
| Mesa positiva fuera del conjunto, como 9 | 400 con `Mesa inexistente`. |
| Mesa cero, negativa, decimal o de tipo incorrecto, incluido `null` | 400 con `Debe ingresar un número válido`; no se convierten textos a números. |
| Producto o pedido consultado inexistente | 404 con el mensaje correspondiente. |
| JSON malformado / cuerpo demasiado grande | 400 / 413 con un mensaje claro. |
| Fallo interno | 500 con `Error interno del servidor`. |

Si la facturación acumulada supera el rango de enteros seguros, el reporte responde 400 con `La facturación total supera el rango de enteros seguros`; los pedidos existentes se conservan.

### Ejemplo en PowerShell

Con la API iniciada:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/productos" -Method Get

$pedidoJson = '{"mesaId":4,"items":[{"productoId":5,"cantidad":2},{"productoId":19,"cantidad":1}]}'
$creacion = Invoke-RestMethod -Uri "http://localhost:3000/pedidos" -Method Post -ContentType "application/json" -Body $pedidoJson
$creacion

Invoke-RestMethod -Uri "http://localhost:3000/pedidos/$($creacion.pedido.id)" -Method Get
Invoke-RestMethod -Uri "http://localhost:3000/reportes/facturacion" -Method Get
```

La creación y la consulta conservan mesa 4, estado `pendiente` y total **17220**. Para barra, omitir `mesaId`. Cambiarlo por 9 permite comprobar el rechazo 400.
