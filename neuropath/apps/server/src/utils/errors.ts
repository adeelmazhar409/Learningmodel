/*
  What this file does:
  --------------------
  JavaScript's built-in Error class just holds a message string.
  We need errors that also carry an HTTP status code so our
  error.middleware.ts knows what status to send back.

  AppError is our base error class. Every thrown error in this
  server should be an AppError (or one of its subclasses below).

  How to use it in a service or controller:
  -----------------------------------------
  import { AppError, NotFoundError, UnauthorizedError } from "../utils/errors";

  // Generic error with custom status
  throw new AppError("Something went wrong", 400);

  // Convenience subclasses (status code pre-set)
  throw new NotFoundError("Study pack not found");
  throw new UnauthorizedError("You must be logged in");
  throw new ForbiddenError("You cannot access this resource");
  throw new ConflictError("An account with this email already exists");
  throw new ValidationError("Email is required");

  The error.middleware.ts catches all of these and returns:
  {
    "success": false,
    "message": "Study pack not found",
    "code": 404
  }
*/

/* Base error class — all our errors extend this */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";

    /* Fixes the prototype chain for instanceof checks in TypeScript */
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/* 400 — Bad request (invalid input, missing fields, etc.) */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

/* 401 — Unauthenticated (no token, expired token) */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

/* 403 — Authenticated but not allowed to access this resource */
export class ForbiddenError extends AppError {
  constructor(message: string = "You do not have permission to access this resource") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

/* 404 — Resource does not exist */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

/* 409 — Conflict (e.g. duplicate email on signup) */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = "ConflictError";
  }
}

/* 429 — Too many requests */
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests. Please slow down.") {
    super(message, 429);
    this.name = "RateLimitError";
  }
}

/* 503 — External service unavailable (OpenAI, AssemblyAI, etc.) */
export class ServiceUnavailableError extends AppError {
  constructor(service: string) {
    super(`${service} is temporarily unavailable. Please try again later.`, 503);
    this.name = "ServiceUnavailableError";
  }
}
