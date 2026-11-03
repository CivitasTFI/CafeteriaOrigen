import request from "supertest";
import express from "express";
import app from "../../src/app";
import { errorHandler } from "../../src/middleware/errorHandler";

describe("Aplicación", () => {
  test("debe responder 400 con un mensaje claro si el cuerpo contiene JSON inválido", async () => {
    const response = await request(app)
      .post("/pedidos")
      .set("Content-Type", "application/json")
      .send('{"items":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "El cuerpo de la solicitud contiene JSON inválido",
    });
  });

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
