import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import axios from "axios";

export function useTranslations(lang: string) {
    return useQuery({
        queryKey: ["translations", lang],
        queryFn: async () => {
            const res = await axios.get(
                `http://localhost:4000/trpc/translation.getAll?input=${encodeURIComponent(JSON.stringify({ lang }))}`
            );
            const translations = res.data.result.data;
            i18next.addResourceBundle(lang, "translation", translations, true, true);
            return translations;
        },
        staleTime: 1000 * 60 * 60 * 24,
    });
}
