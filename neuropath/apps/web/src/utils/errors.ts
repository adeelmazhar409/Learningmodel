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

/* 401 — Unauthenticated (no token, expired token) */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}


/* 409 — Conflict (e.g. duplicate email on signup) */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = "ConflictError";
  }
}