import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import productsRouter from "./routes/productRoutes";
import { middlewareForError } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan("dev"));

// const func = (req: Request, res: Response, next: NextFunction): any => {
//   throw new Error("there was an error");
// };

// app.get("/error", func);

app.use("/products", productsRouter);
app.use(middlewareForError);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port!`);
});
