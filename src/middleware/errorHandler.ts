import { NextFunction, Request, Response } from "express";

export function middlewareForError(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
}

// import { Request, Response, NextFunction } from "express";
// import { HttpError } from "../Errors/HttpError";

// export function middlewareForError(
//   err: Error | HttpError,
//   _req: Request,
//   res: Response,
//   _next: NextFunction,
// ) {
//   console.error(err.message);
//   if (err instanceof HttpError) {
//     if (err.status === 403) res.send("Forbidden");
//     else res.status(err.status).json({ message: err.message });
//   } else {
//     res.status(500).json({ message: "Internal server error " });
//   }
// }
