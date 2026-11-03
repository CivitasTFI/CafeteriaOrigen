import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
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

  res.status(500).json({
    error: "Error interno del servidor",
  });
}
