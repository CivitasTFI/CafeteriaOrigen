import express from "express";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { catalogoProductos, obtenerProducto } from "./data/catalogo";

const app = express();

app.use(express.json());

app.get("/productos", (_req, res) => {
  res.status(200).json(catalogoProductos);
});

app.get("/productos/:id", (req, res) => {
  const producto = obtenerProducto(Number(req.params.id));

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado",
    });
  }

  return res.status(200).json(producto);
});

app.use(notFound);
app.use(errorHandler);

export default app;