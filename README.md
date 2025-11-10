# 🌍 AutoLanguageSyncApp  
> **AI-Powered Cloud Translation Manager** — one English source → instant multilingual support across frontend & backend.

100% usable in large, multi-page, high-performance apps.

If implemented with the current pattern (AI translation only at sync, and cached translations at runtime),
this setup scales easily to enterprise-level workloads — both frontend and backend.

```bash

[ en.json / backend messages ] 
          │
          ▼
 [ syncTranslations.ts ]
          │  (uses OpenAI for missing keys)
          ▼
 [ PostgreSQL (Translation table) ]
          │
   ┌──────┴──────────┐
   ▼                 ▼
Frontend (React)     Backend (tRPC)
 │                     │
 │  uses useTranslations() & i18next
 │  fetches translation.getAll(lang)
 │                     │
 │                     │  reads translations from DB
 │                     │  returns localized messages
 └──────────> User sees full localized UI & API responses

---
```

## 🧩 1️⃣ Translation Sync (Offline Process)
*(Executed when you run `npm run sync`)*

| Step | Action | Flow |
|------|---------|------|
| 1 | Developer updates `locales/en.json` or backend `messages/en.ts`. | English is the single source of truth. |
| 2 | Sync script reads English content. | Combines frontend + backend keys. |
| 3 | Prisma upserts English keys into `Translation` table. | Ensures all English entries exist. |
| 4 | For each other language: if missing or outdated → AI translates via OpenAI. | Generates localized text automatically. |
| 5 | Prisma updates DB + writes new JSON files for each language. | Keeps everything consistent. |

🧠 **Result:** Database + locale files are perfectly synced in all languages.

---

## 🖥️ 2️⃣ Frontend Runtime Logic

| Step | Component | Function |
|------|------------|----------|
| 1 | `useTranslations(lang)` | Fetches translations via tRPC → DB → caches with React Query. |
| 2 | `i18next.addResourceBundle()` | Loads translations dynamically into the i18next instance. |
| 3 | `i18next.changeLanguage(lang)` | Switches UI instantly without reload. |
| 4 | `t(key)` | Fetches localized text for the current language. |
| 5 | `trpcClient.translation.buttonClick.query({ lang })` | Calls backend API to fetch translated backend messages. |

💡 **Result:**  
The UI text and backend responses always match the same selected language — no page reloads, no redeploys.

---

## ⚙️ 3️⃣ Backend Runtime Logic

| Step | Module | Description |
|------|---------|-------------|
| 1 | `tRPC /translation.getAll` | Returns all key-value pairs for a given language (frontend fetch). |
| 2 | `tRPC /translation.buttonClick` | Returns specific translated backend message by key (`account_created`). |
| 3 | `Prisma` | Reads the translation from the database using `key_language` unique index. |
| 4 | **Fallback** | If translation is missing → returns English default text. |
| 5 | *(Optional)* Redis cache | Speeds up lookups for common requests. |

🧠 **Result:**  
Every backend API response is automatically localized for the active language.


## 🧭 Overview  

**AutoLanguageSyncApp** is a centralized, AI-driven translation system that automatically syncs multilingual content between your frontend and backend.  
You only maintain **one English JSON file**, and AutoLanguageSyncApp handles:  

- 🌐 Automatic translation into all configured languages  
- ⚡ Real-time language switching (frontend + backend)  
- 🔄 Centralized updates — no redeploy needed  
- 🤖 AI-assisted translation (OpenAI)  
- 🧱 Shared localization between client and server  

💡 **Architecture:** Cloud-based translation sync — all translations live in one centralized database and are fetched dynamically via tRPC.

---

## 🧱 Tech Stack

| Layer | Tech | Purpose |
|--------|------|----------|
| **Frontend** | React (Vite) + i18next + React Query | Dynamic multilingual UI |
| **Backend** | Node.js + Express + tRPC | Unified type-safe API |
| **Database** | PostgreSQL + Prisma ORM | Persistent translation store |
| **AI Translation** | OpenAI GPT-4o-mini | Automatic generation of translations |
| **Caching** | React Query + optional Redis | Performance and scalability |
| **Environment** | dotenv | Secure API key management |

---



---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/yourusername/Auto.git](https://github.com/nisha8c/AutoLanguageSyncApp.git
cd AutoLanguageSyncApp (or whatever the foldername is)
```


### 2️⃣ Install dependencies
# Backend
```bash
cd server
npm install
```

# Frontend
```bash
cd ../client
npm install
```

# 🔑 Environment Variables

Inside /server/.env:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/auto-i18n
OPENAI_API_KEY=your_openai_api_key
PORT=4000
```

# 🧠 Database Setup
```bash
cd server
npx prisma migrate dev --name init
```

This creates your Translation table in PostgreSQL.


# 🚀 Run the App

Terminal 1 – Backend
```bash
cd server
npm run dev
```

# Terminal 2 – Frontend

```bash
cd client
npm run dev
```

### 🌐 Open your browser at http://localhost:5173

# 🔁 Syncing Translations

Whenever you change English source text or add new keys, run:

```bash
npm run sync
```

See the output

You’ll now see lines like:

```bash
🔁 [fr] welcome_message (updated) → Bonjour, je suis Nisha !
🔁 [de] welcome_message (updated) → Willkommen, ich bin Nisha!
🔁 [es] welcome_message (updated) → ¡Bienvenido, soy Nisha!
🔁 [it] welcome_message (updated) → Benvenuto, sono Nisha!
✅ Translations synced successfully.
```

## Sync Pipeline:

Reads locales/en.json (frontend) + messages/en.ts (backend)

Updates English entries in the DB

Auto-translates missing keys via OpenAI

Updates changed translations

Writes all language JSONs (e.g. fr.json, de.json)

✅ Keeps every language fully up-to-date automatically.

# 🌍 Add New Languages

1️⃣ Edit /server/locales/config.json:

```bash

{
  "supportedLangs": ["en", "fr", "de", "es", "it"]
}
```

2️⃣ Add a new language code (e.g. Portuguese):

```bash
{
  "supportedLangs": ["en", "fr", "de", "es", "it", "pt"]
}
```

3️⃣ Run:

```bash
npm run sync
```


✅ A new pt.json file and DB entries are created automatically.


# 💻 Frontend Usage

Fetch and cache translations:

```bash
const { isLoading } = useTranslations(lang);
const { t } = useTranslation();
```

Switch languages instantly:

```bash
await i18next.changeLanguage("fr");
```

✅ UI updates immediately without reload.

# 🧩 Backend Usage

Use any translation key dynamically:

```bash
const record = await prisma.translation.findUnique({
  where: { key_language: { key: "account_created", language: "fr" } },
});
return record?.text ?? "Your account has been created successfully!";
```

✅ Backend and frontend always show identical messages.




## 🔒 AI Translation Safety (GDPR Compliant)

| Aspect | Description |
|--------|--------------|
| **AI Usage** | AI is used **only during sync**, never at runtime. |
| **Data Privacy** | Only static English text is sent to OpenAI — **no user data** ever leaves your system. |
| **Custom Models** | You can replace OpenAI with your own **private or on-premise LLM endpoint**. |
| **Security** | All API keys are managed via `.env` and never exposed to the frontend. |
| **Compliance** | Follows **GDPR & enterprise data protection** standards (no personal data processing). |

---

## ⚡ Performance Tips

| Technique | Description |
|------------|-------------|
| **React Query cache** | Avoids refetching translations between renders. |
| **Prisma `@@unique` index** | Ensures fast DB lookups on `(key, language)`. |
| **Redis caching (optional)** | Adds a 1-hour TTL cache for backend translation lookups. |
| **Local JSON fallback** | Speeds up initial UI rendering during app load. |
| **AI prefetch offline** | Runs translation generation only during sync, not in production. |

---

## 🔁 Common Scenarios

| Scenario | Behavior |
|-----------|-----------|
| **Add key in `en.json`** | Added automatically across all supported languages during sync. |
| **Change English text** | Re-translated automatically to update all other languages. |
| **Add new language** | Creates new JSON + database entries instantly. |
| **Remove key from English** | Deletes corresponding keys from all languages. |
| **Click button in UI** | Fetches and displays backend-translated message in current language. |
| **Change dropdown language** | Frontend UI and backend API both update instantly. |

## 🧩 Cloud Translation Architecture

AutoLanguageSyncApp follows a cloud-based translation model:

All translations live centrally (DB or API)

Apps fetch and cache them dynamically

Translators/AI can update without redeploys

Unified store ensures consistency between frontend and backend

## 💎 Highlights

✅ One English source of truth
✅ Full automation with npm run sync
✅ Instantly multilingual via config
✅ Unified translations across client + server
✅ AI-assisted, secure, and scalable

# 🌐 Quick Start Demo
## Start backend

```bash
cd server && npm run dev
```

## Start frontend

```bash
cd client && npm run dev
```

### Open → http://localhost:5173

Switch language → text and backend responses update instantly ⚡

# ❤️ Author

Built with ❤️ by [Nisha] — powered by TypeScript, Prisma, tRPC, React, and OpenAI.


