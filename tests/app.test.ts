import request from "supertest";
import express from "express";
import app from "../src/app";
import { errorHandler } from "../src/middleware/errorHandler";

describe("Aplicación", () => {
  test("debe responder 404 para una ruta inexistente", async () => {
    const response = await request(app).get("/ruta-inexistente");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Recurso no encontrado",
    });
  });

  test("debe responder 500 ante un error interno", async () => {
    const testApp = express();

    testApp.get("/error", () => {
      throw new Error("Error de prueba");
    });

    testApp.use(errorHandler);

    const response = await request(testApp).get("/error");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Error interno del servidor",
    });
  });
});