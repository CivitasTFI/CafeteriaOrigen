import { Request, Response, NextFunction } from "express";

export function errorHandler(
  _err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(500).json({
    error: "Error interno del servidor",
  });
}