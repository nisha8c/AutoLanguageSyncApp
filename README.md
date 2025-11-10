# 🌍 AutoLanguageSyncApp  
> **AI-Powered Cloud Translation Manager** — one English source → instant multilingual support across frontend & backend.

---

## 🧭 Overview  

**LinguaSync** is a centralized, AI-driven translation system that automatically syncs multilingual content between your frontend and backend.  
You only maintain **one English JSON file**, and LinguaSync handles:  

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
git clone https://github.com/yourusername/linguasync.git
cd linguasync
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
DATABASE_URL=postgresql://user:password@localhost:5432/linguasync
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







