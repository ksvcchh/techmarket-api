import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import productsRouter from "./routes/product.route";
import reviewsRouter from "./routes/review.route";
import usersRouter from "./routes/user.route";

import { middlewareForError } from "./middleware/errorHandler";
import { connectToDatabase } from "./services/database.service";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(morgan("dev"));

connectToDatabase()
    .then(() => {
        app.use("/products", productsRouter);
        app.use("/reviews", reviewsRouter);
        app.use("/users", usersRouter);

        app.use(middlewareForError);

        if (process.env.NODE_ENV !== "test") {
            app.listen(PORT, () => {
                console.log(`Server is running on ${PORT} port!`);
            });
        }
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });

export default app;
