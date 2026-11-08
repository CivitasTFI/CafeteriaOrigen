// @vitest-environment node

import { normalize, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import ts from "typescript";
import { expect, test } from "vitest";

const frontendPath = fileURLToPath(new URL("../../../", import.meta.url));

function leerConfiguracion(ruta: string) {
  const configuracion = ts.getParsedCommandLineOfConfigFile(ruta, {}, {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic(diagnostico) {
      throw new Error(
        ts.flattenDiagnosticMessageText(diagnostico.messageText, "\n"),
      );
    },
  });

  if (configuracion === undefined) {
    throw new Error(`No se pudo leer la configuración: ${ruta}`);
  }

  return configuracion;
}

test("la solución de TypeScript incluye los tests, el setup y la configuración de Vitest", () => {
  const solucion = leerConfiguracion(resolve(frontendPath, "tsconfig.json"));
  const archivosIncluidos = (solucion.projectReferences ?? []).flatMap(
    (referencia) =>
      leerConfiguracion(ts.resolveProjectReferencePath(referencia)).fileNames.map(
        (ruta) => normalize(ruta),
      ),
  );

  const archivosEsperados = [
    "src/test/components/App.test.tsx",
    "src/test/integration/msw.test.ts",
    "src/test/unit/configuracionTypescript.test.ts",
    "src/test/setup.ts",
    "vitest.config.ts",
  ].map((ruta) => resolve(frontendPath, ruta));

  expect(archivosIncluidos).toEqual(expect.arrayContaining(archivosEsperados));
});
