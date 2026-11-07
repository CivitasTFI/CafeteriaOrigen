# Reparto del trabajo — Cafetería Origen (Parcial I)

Referencia del alcance del primer parcial y de la base de backend. El reparto vigente del TP3 y su estado están en [planificacion.md](planificacion.md).

## Responsabilidades

| Integrante | Módulo del Parcial I |
| --- | --- |
| Matias | Modelos de productos, catálogo y cálculo de precios. |
| Nicolas | Modelo, almacenamiento en memoria, servicios y endpoints de pedidos. |
| Federico | Facturación, cantidades vendidas y producto más vendido. |
| Homero | Base Express, endpoints de productos, integración, README y video. |

## Dominio y API

- El catálogo contiene 20 productos: nueve expresos, nueve filtrados y dos opciones de pastelería.
- El precio del café se calcula como `precioBase + gramos × precioPorGramo`; pastelería usa su precio base.
- El precio por gramo es Brasil 140, Colombia 180 y Etiopía 240. Los tamaños de expreso usan 18/27/36 g y los de filtrado 6/15/25 g.
- Los pedidos guardan ítems y estado; su total suma el precio de cada producto por su cantidad.
- Los reportes calculan facturación, cantidades vendidas y productos más vendidos a partir de los pedidos.
- Los tests cubren precios, validaciones, consultas, reportes sin pedidos, empates y creación de pedidos con consulta de reportes.

Los contratos HTTP vigentes, incluidos los campos agregados para TP3, se consultan en [README.md](README.md#api).

## Video del Parcial I

Duración de 5 a 8 minutos, en MP4 o mediante un enlace no listado. Debe incluir nombres y legajos, explicación de cada integrante sobre su parte, ejecución de tests y una demostración de requests a la API.
