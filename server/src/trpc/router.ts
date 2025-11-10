import { initTRPC } from "@trpc/server";
import { translationRouter } from "./translation";

// initialize tRPC
const t = initTRPC.create();

export const appRouter = t.router({
    translation: translationRouter,
});

export type AppRouter = typeof appRouter;
