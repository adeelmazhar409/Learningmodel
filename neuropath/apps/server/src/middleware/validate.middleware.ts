import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/errors";

/*
  What this file does:
  --------------------
  Before a controller runs, we want to make sure the request body
  contains the correct data in the correct format.

  This middleware takes a Zod schema and returns a new middleware
  function that validates req.body against it.

  If validation passes → the controller runs with clean, typed data.
  If validation fails  → a 400 error is returned with a clear message.

  How to use it in a route file:
  ------------------------------
  import { validate } from "../middleware/validate.middleware";
  import { z }        from "zod";

  const signupSchema = z.object({
    name:     z.string().min(1),
    email:    z.string().email(),
    password: z.string().min(8),
  });

  router.post("/signup", validate(signupSchema), authController.signup);

  Zod is a TypeScript schema library. Think of a schema as a
  description of what shape the data should be. If the actual
  data doesn't match that description, Zod throws a ZodError.
*/
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      /* Parse and validate — also strips unknown fields */
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        /* Build a human-readable error message from all validation failures */
        const messages = err.issues
          .map(issue => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        next(new AppError(`Validation failed — ${messages}`, 400));
      } else {
        next(err);
      }
    }
  };
}