# Pruebas del frontend

Desde `frontend/`, `npm test` ejecuta todas las pruebas implementadas sin levantar la API.

Los archivos terminados en `.pending` son lugares reservados de la estructura inicial. Permanecen vacíos, Vitest no los ejecuta y no representan cobertura implementada.

Al comenzar una funcionalidad:

1. Quitar únicamente el sufijo `.pending` del archivo correspondiente.
2. Escribir el primer test y ejecutarlo para comprobar el RED por el comportamiento faltante.
3. Guardar el commit RED antes de implementar.
4. Implementar lo mínimo para GREEN y guardar ese commit.
5. Refactorizar cuando corresponda, conservando las pruebas verdes y registrando el cambio por separado.

Por ejemplo, `components/Carrito.test.tsx.pending` pasa a llamarse `components/Carrito.test.tsx` cuando Federico empiece esas pruebas.

Para ejecutar un archivo concreto:

```bash
npm test -- src/test/components/App.test.tsx
```

Vitest descubre automáticamente archivos `.test.ts`, `.test.tsx`, `.spec.ts` y `.spec.tsx` dentro de `src/test/`. Los E2E de Playwright viven en `e2e/` y se ejecutarán mediante su comando separado cuando estén implementados.
