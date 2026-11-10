import { expect, test, type Page } from "@playwright/test";
import { prepararApi } from "./fixtures/api";

test.beforeEach(async ({ request }) => {
  await prepararApi(request);
});

async function agregarPedidoDeEjemplo(page: Page) {
  await page.getByRole("radio", { name: "Expreso", exact: true }).check();
  await page.getByRole("radio", { name: "Mediano", exact: true }).check();
  await page.getByRole("radio", { name: /Colombia/ }).check();
  const agregarCafe = page.getByRole("button", { name: "Agregar café al carrito", exact: true });
  await agregarCafe.click();
  await agregarCafe.click();
  await page.getByRole("button", { name: "Agregar Muffin de Chocolate", exact: true }).click();
}

async function comprobarAnchoMovil(page: Page) {
  const controlesRecortados = await page.locator("input, button, label").evaluateAll(
    (controles) => controles.filter((control) => {
      const limites = control.getBoundingClientRect();
      return limites.width > 0 && (
        limites.left < 0 || limites.right > document.documentElement.clientWidth
      );
    }).map((control) => control.id || control.textContent?.trim()),
  );
  expect(controlesRecortados).toEqual([]);
  const medidas = await page.evaluate(() => ({
    contenido: document.documentElement.scrollWidth,
    visible: document.documentElement.clientWidth,
  }));
  expect(medidas.contenido).toBeLessThanOrEqual(medidas.visible);
}

test("muestra el catálogo, selector de café y pastelería", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Ver productos" }).click();

  const menu = page.getByRole("list", {
    name: "Productos del menú",
  });
  await expect(menu.getByRole("listitem")).toHaveCount(20);

  await page.getByRole("button", { name: "Pedir" }).click();

  await expect(
    page.getByRole("heading", { name: "Café", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Pastelería", exact: true }),
  ).toBeVisible();
});

test("mantiene los controles y el carrito dentro de 375 px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  await agregarPedidoDeEjemplo(page);

  await expect(page.getByText("Cantidad: 2", { exact: true })).toBeVisible();
  await expect(page.getByText("Cantidad: 1", { exact: true })).toBeVisible();
  await expect(page.getByText("Subtotal orientativo: $17.220", {
    exact: true,
  })).toBeVisible();
  await expect(page.getByRole("button", {
    name: "Confirmar pedido",
  })).toBeEnabled();

  await comprobarAnchoMovil(page);
});

test("impide confirmar un pedido con el carrito vacío", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("Tu carrito está vacio", { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Confirmar pedido" }),
  ).toBeDisabled();
});
test("comienza con los ocho pedidos del seed", async ({ request }) => {
  const respuesta = await request.get("http://localhost:3000/pedidos");

  expect(respuesta.status()).toBe(200);
  expect(await respuesta.json()).toHaveLength(8);
});

for (const caso of [
  { nombre: "mesa 4", ruta: "/?mesa=4", mesaId: 4, encabezado: "mesa 4" },
  { nombre: "barra con mesa inválida", ruta: "/?mesa=abc", mesaId: undefined, encabezado: "retiro en barra" },
]) {
  test(`confirma y sigue un pedido real para ${caso.nombre} a 375 px`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(caso.ruta);
    await expect(page.getByRole("banner").getByText(caso.encabezado, { exact: true })).toBeVisible();
    await agregarPedidoDeEjemplo(page);
    await comprobarAnchoMovil(page);

    const [creacion] = await Promise.all([
      page.waitForResponse((respuesta) => new URL(respuesta.url()).pathname === "/pedidos" && respuesta.request().method() === "POST"),
      page.getByRole("button", { name: "Confirmar pedido" }).click(),
    ]);
    expect(creacion.status()).toBe(201);
    expect(creacion.request().postDataJSON()).toEqual({
      items: [{ productoId: 5, cantidad: 2 }, { productoId: 19, cantidad: 1 }],
      ...(caso.mesaId === undefined ? {} : { mesaId: caso.mesaId }),
    });
    expect(await creacion.json()).toMatchObject({
      pedido: { id: 9, estado: "pendiente", total: 17220 },
    });

    const confirmacion = page.getByRole("region", { name: "Pedido confirmado" });
    await expect(confirmacion.getByText("Número de pedido: 9", { exact: true })).toBeVisible();
    await expect(confirmacion.getByText("Estado: pendiente", { exact: true })).toBeVisible();
    await expect(confirmacion.getByText("Total: $17.220", { exact: true })).toBeVisible();
    await expect(page.getByText("Tu carrito está vacio", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirmar pedido" })).toBeDisabled();
    await expect(page.getByLabel("ID del pedido")).toHaveCount(0);
    await comprobarAnchoMovil(page);

    const navegaciones: string[] = [];
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) navegaciones.push(frame.url());
    });
    const [consulta] = await Promise.all([
      page.waitForResponse((respuesta) => new URL(respuesta.url()).pathname === "/pedidos/9" && respuesta.request().method() === "GET"),
      confirmacion.getByRole("button", { name: "Consultar estado" }).click(),
    ]);
    expect(consulta.status()).toBe(200);
    await expect(confirmacion.getByText("Estado: pendiente", { exact: true })).toBeVisible();
    await expect(confirmacion.getByText(/^Estado(?: actual)?:/)).toHaveCount(1);
    expect(navegaciones).toEqual([]);
    await comprobarAnchoMovil(page);
  });
}

test("un rechazo real conserva el carrito y permite confirmar al reintentar", async ({ page, request }) => {
  await page.goto("/?mesa=4");
  await agregarPedidoDeEjemplo(page);
  let intentos = 0;
  await page.route("**/pedidos", async (ruta) => {
    if (ruta.request().method() === "POST" && intentos++ === 0) {
      await ruta.continue({
        postData: JSON.stringify({
          mesaId: 9,
          items: [{ productoId: 5, cantidad: 2 }, { productoId: 19, cantidad: 1 }],
        }),
      });
      return;
    }
    await ruta.continue();
  });
  await page.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(page.getByRole("alert")).toHaveText("Mesa inexistente");
  await expect(page.getByText("Cantidad: 2", { exact: true })).toBeVisible();
  await expect(page.getByText("Cantidad: 1", { exact: true })).toBeVisible();
  await expect(page.getByText("Subtotal orientativo: $17.220", { exact: true })).toBeVisible();
  expect(await (await request.get("http://localhost:3000/pedidos")).json()).toHaveLength(8);
  await comprobarAnchoMovil(page);
  await page.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(page.getByText("Número de pedido: 9", { exact: true })).toBeVisible();
  await expect(page.getByText("Tu carrito está vacio", { exact: true })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
  expect(intentos).toBe(2);
});

test("conserva el seguimiento del pedido anterior si falla el siguiente y lo reemplaza tras el éxito", async ({ page, request }) => {
  await page.goto("/?mesa=4");
  await agregarPedidoDeEjemplo(page);
  await page.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(page.getByText("Número de pedido: 9", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Agregar Muffin de Chocolate", exact: true }).click();
  await page.route("**/pedidos", async (ruta) => {
    await ruta.continue({
      postData: JSON.stringify({ mesaId: 9, items: [{ productoId: 19, cantidad: 1 }] }),
    });
  });
  await page.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(page.getByRole("alert")).toHaveText("Mesa inexistente");
  const anterior = page.getByRole("region", { name: "Último pedido confirmado" });
  await expect(anterior.getByText("Número de pedido: 9", { exact: true })).toBeVisible();
  await expect(page.getByText("Subtotal orientativo: $2.500", { exact: true })).toBeVisible();
  const [consulta] = await Promise.all([
    page.waitForResponse((respuesta) => new URL(respuesta.url()).pathname === "/pedidos/9" && respuesta.request().method() === "GET"),
    anterior.getByRole("button", { name: "Consultar estado" }).click(),
  ]);
  expect(consulta.status()).toBe(200);
  await expect(anterior.getByText(/^Estado(?: actual)?:/)).toHaveCount(1);
  expect(await (await request.get("http://localhost:3000/pedidos")).json()).toHaveLength(9);
  await comprobarAnchoMovil(page);

  await page.unroute("**/pedidos");
  await page.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(page.getByText("Número de pedido: 10", { exact: true })).toBeVisible();
  await expect(page.getByText("Número de pedido: 9", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText("Tu carrito está vacio", { exact: true })).toBeVisible();
});
