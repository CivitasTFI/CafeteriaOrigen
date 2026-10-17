import express from "express";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { catalogoProductos } from "./data/catalogo";

const app = express();

app.use(express.json());

app.get("/productos", (_req, res) => {
  res.status(200).json(catalogoProductos);
});

app.use(notFound);
app.use(errorHandler);

export default app;