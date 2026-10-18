import express from "express";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { catalogoProductos, obtenerProducto } from "./data/catalogo";
import { getFacturacionTotal, getProductoMasVendido } from "./controllers/reportes.controllers";
import { getPedido, getPedidoID, postPedidos } from "./controllers/pedidos.controllers";

const app = express();

app.use(express.json());

app.get("/productos", (_req, res) => {
  const productos = catalogoProductos.map((producto) => ({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.calcularPrecio(),
  }));

  res.status(200).json(productos);
});

app.get("/productos/:id", (req, res) => {
  const producto = obtenerProducto(Number(req.params.id));

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado",
    });
  }

  return res.status(200).json({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.calcularPrecio(),
  });
});
app.get("/reportes/facturacion", getFacturacionTotal);
app.get("/reportes/mas-vendido", getProductoMasVendido);

//pedidos
app.get("/pedidos/todos", getPedido );
app.get("/pedidos/:id", getPedidoID);
app.post("/pedidos", postPedidos);

app.use(notFound);
app.use(errorHandler);

export default app;