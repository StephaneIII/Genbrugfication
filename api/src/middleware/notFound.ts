import { NextFunction, Request, Response } from 'express'

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`)
  next(error)
}
