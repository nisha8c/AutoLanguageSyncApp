import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function translateText(source: string, targetLang: string): Promise<string> {
    try {
        const prompt = `Translate the following text from English to ${targetLang}. Respond with translation only — no extra punctuation or quotes.
Text: ${source}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const output = completion.choices[0].message?.content?.trim() || source;

        // remove stray wrapping quotes if still present
        return output.replace(/^["']|["']$/g, "");
    } catch (error) {
        console.error(`❌ Translation failed (${targetLang}):`, error);
        return source;
    }
}
