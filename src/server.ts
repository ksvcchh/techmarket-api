import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import productsRouter from "./routes/product.route";
import categoriesRouter from "./routes/category.route";
import reviewsRouter from "./routes/review.route";
import usersRouter from "./routes/user.route";
import { middlewareForError } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan("dev"));

app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/reviews", reviewsRouter);
app.use("/users", usersRouter);

app.use(middlewareForError);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT} port!`);
    });
}

export default app;
