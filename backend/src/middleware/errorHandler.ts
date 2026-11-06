import { Request, Response, NextFunction } from "express";
import { ErrorValidacion } from "../errors/error-validacion";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ErrorValidacion) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (
    err instanceof SyntaxError &&
    "type" in err &&
    err.type === "entity.parse.failed"
  ) {
    res.status(400).json({
      error: "El cuerpo de la solicitud contiene JSON inválido",
    });
    return;
  }

  if (
    err instanceof Error &&
    "type" in err &&
    err.type === "entity.too.large"
  ) {
    res.status(413).json({
      error: "El cuerpo de la solicitud supera el tamaño permitido",
    });
    return;
  }

  res.status(500).json({
    error: "Error interno del servidor",
  });
}
