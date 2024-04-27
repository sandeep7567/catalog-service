import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import config from "config";

import categoryRouter from "./category/category-router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.json({ ok: config.get("server.port") });
});

app.use("/categories", categoryRouter);

app.use(globalErrorHandler);

export default app;
