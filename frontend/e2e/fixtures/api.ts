import { expect, type APIRequestContext } from "@playwright/test";

export async function prepararApi(request: APIRequestContext){
  const respuesta = await request.post("http://localhost:3000/__test__/seed");
  expect(respuesta.status()).toBe(201);
}