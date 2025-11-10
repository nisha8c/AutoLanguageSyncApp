import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prismaClient";

const t = initTRPC.create();

export const translationRouter = t.router({
    getAll: t.procedure
        .input(z.object({ lang: z.string().default("en") }))
        .query(async ({ input }) => {
            const translations = await prisma.translation.findMany({
                where: { language: input.lang },
            });
            return Object.fromEntries(translations.map(t => [t.key, t.text]));
        }),

    buttonClick: t.procedure
        .input(z.object({ lang: z.string() }))
        .query(async ({ input }) => {
            // Get the translation from DB
            const record = await prisma.translation.findUnique({
                where: { key_language: { key: "account_created", language: input.lang } },
            });

            // fallback to English if missing
            const message = record?.text ?? "Your account has been created successfully!";

            return { message };
        }),
});
