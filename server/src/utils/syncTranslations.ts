import fs from "fs";
import path from "path";
import { prisma } from "../prismaClient";
import { translateText } from "./translateAI";
import {backendMessages} from "../messages/en";

export async function syncTranslations() {
    const baseLang = "en";
    const enFile = path.resolve(__dirname, "../../locales/en.json");
    const configFile = path.resolve(__dirname, "../../locales/config.json");
    const localesDir = path.resolve(__dirname, "../../locales");

    //const enData = JSON.parse(fs.readFileSync(enFile, "utf8")) as Record<string, string>;
    const frontendData = JSON.parse(fs.readFileSync(enFile, "utf8")) as Record<string, string>;
    const combinedData = { ...frontendData, ...backendMessages };

    const { supportedLangs } = JSON.parse(fs.readFileSync(configFile, "utf8")) as { supportedLangs: string[] };
    const targetLangs = supportedLangs.filter((l) => l !== baseLang);

    console.log("🔄 Syncing translations...");

    for (const [key, newText] of Object.entries(combinedData)) {
        // 1️⃣ Fetch old English text before updating
        const oldEnglish = await prisma.translation.findUnique({
            where: { key_language: { key, language: baseLang } },
        });

        const englishChanged = oldEnglish && oldEnglish.text !== newText;

        // 2️⃣ Upsert English (create or update)
        await prisma.translation.upsert({
            where: { key_language: { key, language: baseLang } },
            update: { text: newText },
            create: { key, language: baseLang, text: newText },
        });

        // 3️⃣ For each other language
        for (const lang of targetLangs) {
            const existing = await prisma.translation.findUnique({
                where: { key_language: { key, language: lang } },
            });

            if (!existing || englishChanged) {
                const translated = await translateText(newText, lang);
                await prisma.translation.upsert({
                    where: { key_language: { key, language: lang } },
                    update: { text: translated },
                    create: { key, language: lang, text: translated },
                });

                const label = !existing ? "(new)" : "(updated)";
                console.log(`🌐 [${lang}] ${key} ${label} → ${translated}`);
            }
        }
    }

    // 4️⃣ Re-write JSONs
    for (const lang of supportedLangs) {
        const translations = await prisma.translation.findMany({ where: { language: lang } });
        const data = Object.fromEntries(translations.map((t) => [t.key, t.text]));
        fs.writeFileSync(path.join(localesDir, `${lang}.json`), JSON.stringify(data, null, 2), "utf8");
    }

    console.log("✅ Translations synced successfully.");
}

if (require.main === module) {
    syncTranslations().finally(() => process.exit());
}
