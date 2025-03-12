import { NextFunction, Request, Response } from "express";

export function middlewareForError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err.stack);
  if (err.code) {
    if (err.code === "23505") {
      res.status(409).json({
        message: "Duplicate value error.",
        detail: err.detail,
      });
    } else if (err.code === "23503") {
      res.status(400).json({
        message: "Foreign key constraint violation.",
        detail: err.detail,
      });
    } else if (err.code === "23502") {
      res.status(400).json({
        message: "Null value error; a required field is missing.",
        detail: err.detail,
      });
    } else {
      res.status(500).send(`Error: ${err}`);
    }
  } else {
    res.status(500).send("Internal Server Error");
  }
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
