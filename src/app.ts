import express from "express";
import { notFound } from "./middleware/notFound";

const app = express();

app.use(express.json());

app.use(notFound);

export default app;