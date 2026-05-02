# 🇮🇳 India Smart Election Information Platform

A production-ready, AI-powered web application designed to simplify election-related information for Indian citizens. This platform provides real-time data, interactive tools, and personalized voter assistance.

## 🚀 Live Demo
**Production URL:** [https://eci-platform-674338647718.us-central1.run.app](https://eci-platform-674338647718.us-central1.run.app)

---

## ✨ Key Features

### 🗺️ Interactive Voter Guide
- Step-by-step registration and voting process.
- Tailored guides for first-time and returning voters.

### 📅 Election Timeline
- Real-time countdown to election phases.
- State-specific phase tracking (based on 2024 Lok Sabha schedules).

### 📍 Booth Locator (Interactive Map)
- Find nearest polling stations using geolocation.
- Filter by wheelchair accessibility and search radius.
- Powered by **Leaflet.js** and OpenStreetMap.

### 🤖 AI Election Assistant
- Instant answers to complex election queries (eligibility, documents, deadlines).
- Powered by **Google Gemini AI**.

### 📊 Election Analytics
- Visualized voter turnout trends from 2014 to 2024.
- Comparison of national and state-level statistics.

### 👤 Personalized Dashboard
- Secure login via **NextAuth.js**.
- Progress tracking for registration steps.
- Custom notification management.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **Backend**: Next.js API Routes.
- **Database**: PostgreSQL (hosted on Supabase) with **Prisma ORM**.
- **AI**: Google Generative AI (Gemini 1.5 Flash).
- **Maps**: Leaflet & React-Leaflet.
- **Deployment**: Google Cloud Run.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL Database
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd eci-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your_postgresql_url"
   GEMINI_API_KEY="your_gemini_api_key"
   NEXTAUTH_SECRET="your_random_secret"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```

5. **Run Locally:**
   ```bash
   npm run dev
   ```

---

## 🚢 Deployment

The project is optimized for **Google Cloud Run**. To deploy from source:

```bash
gcloud run deploy eci-platform --source . --region us-central1 --allow-unauthenticated
```

---

## 📜 Disclaimer
*This platform is an independent project for educational and civic information purposes. It is NOT an official Election Commission of India (ECI) website. All official data is sourced from [eci.gov.in](https://eci.gov.in).*

---

**Built with ❤️ for Indian Democracy.**
