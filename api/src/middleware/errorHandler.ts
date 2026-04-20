import { NextFunction, Request, Response } from 'express'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res.status(404).json({ error: err.message })
}
