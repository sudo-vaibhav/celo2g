import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import "express-async-errors";
import cors from "cors";
import router from "./routers";
import dotenv from "dotenv";
dotenv.config({
  path: __dirname + "/../.env",
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", router);

app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(err);
    return res.status(500).send({ errors: [err.toString()] });
  }
);

export default app;
