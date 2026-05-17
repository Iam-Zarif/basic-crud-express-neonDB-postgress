import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { useRouter } from "./modules/user/user.route";
import { profileRouter } from "./modules/profile/profile.route";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello, TypeScript Express!",
  });
});

app.use("/api/users", useRouter);
app.use("/api/profile", profileRouter)

export default app;
