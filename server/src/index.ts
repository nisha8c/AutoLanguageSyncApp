import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/context";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
