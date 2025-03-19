import { NextFunction, Request, Response } from "express";

export function middlewareForError(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    console.error(err.stack);

    if (
        err.message &&
        (err.message.includes("Record not found") ||
            err.message.includes("Not found"))
    ) {
        res.status(404).json({ message: err.message });
    }

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
        } else if (err.code === "P2025") {
            res.status(404).json({ message: "Record not found" });
        } else {
            res.status(500).json({ message: `Error: ${err}` });
        }
    } else {
        res.status(500).json({ message: "Internal server error" });
    }
}
