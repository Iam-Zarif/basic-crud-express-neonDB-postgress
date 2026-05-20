import express, {
  type Application,
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { useRouter } from "./modules/user/user.route";
import { profileRouter } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.routes";
import logger from "./middleware/logger";
import cookieparser from "cookie-parser";
import cors from "cors"
import GlobalErrorHandler from "./middleware/GlobalErrorHandler";

const app: Application = express();
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(logger);

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello, TypeScript Express!",
  });
});


app.use(GlobalErrorHandler);


app.use("/api/users", useRouter);
app.use("/api/profile", profileRouter)
app.use("/api/auth", authRouter);

export default app;
