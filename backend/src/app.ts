import express from "express";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import productosRouter from "./routes/productos.route";
import pedidosRouter from "./routes/pedidos.route";
import reportesRouter from "./routes/reportes.route";

const app = express();

app.use(express.json());

app.use("/productos", productosRouter);
app.use("/pedidos", pedidosRouter);
app.use("/reportes", reportesRouter);

app.use(notFound);
app.use(errorHandler);

export default app;