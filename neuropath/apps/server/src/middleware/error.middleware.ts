import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { logger }   from "../utils/logger";

/*
  What this file does:
  --------------------
  Express has a special type of middleware for handling errors.
  It has FOUR parameters — (err, req, res, next) — and must be
  registered LAST in the Express app with app.use().

  Any time code in a controller or service does:
    throw new AppError("Something went wrong", 400)
  or
    next(someError)

  ...Express skips all normal middleware and routes and comes
  directly here. We then format the error into a clean JSON
  response so the frontend always gets a consistent error shape.

  Response format for ALL errors:
  {
    "success": false,
    "message": "Something went wrong",
    "code": 400
  }
*/
export function errorMiddleware(
  err:  Error,
  req:  Request,
  res:  Response,
  _next: NextFunction,
): void {
  /* Determine status code and message */
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message    = err instanceof AppError
    ? err.message
    : "An unexpected error occurred";

  /* Log all 500 errors (not expected errors like 401, 404, etc.) */
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.path} → ${statusCode}`, {
      message:    err.message,
      stack:      err.stack,
      body:       req.body,
    });
  } else {
    logger.warn(`${req.method} ${req.path} → ${statusCode}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code:    statusCode,
  });
}