import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTranslations } from "./hooks/useTranslations";
import "./i18n/i18n";
import i18next from "i18next";
import { trpcClient } from "./trpc/trpc";

export default function App() {
    const { t } = useTranslation();
    const [message, setMessage] = useState("");
    const [lang, setLang] = useState(i18next.language || "en");

    // ✅ Load translations for the current i18next language
    const { data: translations, isLoading } = useTranslations(lang);

    // ✅ Sync translations when i18next.language changes
    useEffect(() => {
        if (translations) {
            i18next.addResourceBundle(lang, "translation", translations, true, true);
        }
    }, [lang, translations]);

    // ✅ Always read the latest language directly from i18next
    const handleClick = async () => {
        const currentLang = i18next.language;
        const res = await trpcClient.translation.buttonClick.query({ lang: currentLang });
        setMessage(res.message);
    };

    // ✅ When user changes dropdown, update both React + i18next
    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        setLang(newLang);
        await i18next.changeLanguage(newLang);
    };

    if (isLoading) return <div>Loading translations...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-3xl font-bold">{t("welcome_message")}</h1>
            <p className="text-gray-600 mt-2">{t("subtitle")}</p>

            <select
                value={lang}
                onChange={handleLanguageChange}
                className="mt-4 border p-2 rounded"
            >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
                <option value="it">Italiano</option>
            </select>

            <button
                onClick={handleClick}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition"
            >
                {t("button_ok")}
            </button>

            {message && <p className="mt-4 text-lg text-green-700">{message}</p>}
        </div>
    );
}
