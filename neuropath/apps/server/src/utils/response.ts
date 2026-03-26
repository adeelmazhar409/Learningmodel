import { Response } from "express";

/*
  What this file does:
  --------------------
  Every API response from our server should look the same.
  Instead of each controller writing res.json() differently,
  they all call one of these helpers.

  Success response shape:
  {
    "success": true,
    "data": { ...whatever data... }
  }

  Error responses are handled by error.middleware.ts, not here.

  Why this matters:
  -----------------
  The frontend knows exactly what shape every response will be.
  It always checks response.data to get the actual content.
  This makes the frontend code much simpler and more predictable.

  Usage in a controller:
  ----------------------
  import { sendSuccess, sendCreated } from "../utils/response";

  // Return data with 200 OK
  sendSuccess(res, { user, session });

  // Return data with 201 Created (for new resources)
  sendCreated(res, { recording });

  // Return 204 No Content (for deletes)
  sendNoContent(res);
*/

/* 200 OK — the most common response */
export function sendSuccess<T>(res: Response, data: T): void {
  res.status(200).json({ success: true, data });
}

/* 201 Created — used when a new resource is created */
export function sendCreated<T>(res: Response, data: T): void {
  res.status(201).json({ success: true, data });
}

/* 204 No Content — used for successful deletes */
export function sendNoContent(res: Response): void {
  res.status(204).send();
}
