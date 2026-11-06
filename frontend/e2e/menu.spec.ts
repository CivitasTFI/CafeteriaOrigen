import { expect, test } from "@playwright/test";

test("muestra los 20 productos de la API real", async ({ page }) => {
  await page.goto("/");

  const menu = page.getByRole("list", {
    name: "Productos del menú",
  });

  await expect(menu.getByRole("listitem")).toHaveCount(20);
  await expect(menu.getByText("Expreso Pocillo Brasil", {
    exact: true,
  })).toBeVisible();
});