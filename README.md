# Capstone Front-End — SkillsGap AI

SkillsGap AI merupakan platform berbasis AI untuk membantu pengguna menemukan rekomendasi karier berdasarkan analisis CV, portfolio, sertifikat, dan skillset yang dimiliki.

Frontend ini dibangun menggunakan React + Vite dengan integrasi API Gateway dan AI Service berbasis FastAPI.

---

# Fitur Utama

* Login menggunakan Google Authentication (Firebase)
* Upload CV / Portfolio / Sertifikat berbentuk PDF
* Analisis skillset menggunakan AI
* Input skill manual
* Rekomendasi career path berdasarkan skill
* AI Assistant Chat
* Responsive sidebar & mobile layout
* Auto scroll hasil analisis
* Loading state saat AI processing

---

# Tech Stack

## Frontend

* React 19
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* Lucide React Icons
* Firebase Authentication

## Backend & AI Service

* Express.js API Gateway
* FastAPI AI Service
* Gemini AI API

---

# Installation

Clone repository:

```bash
git clone <repository-url>
cd skills-gap
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Buat file `.env` lalu isi:

```env
VITE_API_URL=http://localhost:5000/api/v1

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

# Running Project

Menjalankan development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# Struktur Folder

```txt
src/
├── components/
├── layouts/
├── pages/
├── services/
├── routes/
├── assets/
└── main.jsx
```

---

# API Integration

Frontend menggunakan networking calls dengan Axios untuk berkomunikasi dengan:

* Express API Gateway
* FastAPI AI Service

Contoh endpoint:

```txt
POST /job-role/recommend
POST /document/upload
```

---

# AI Analysis Flow

## Skill Input Only

User memasukkan skill manual → dikirim ke AI → menghasilkan rekomendasi karier.

## CV Only

User upload CV PDF → AI mengekstrak skill → menghasilkan rekomendasi karier.

## Combined Analysis

User upload CV + input skill manual → AI menggabungkan seluruh skill → menghasilkan rekomendasi karier yang lebih akurat.

---

# Checklist Main Quest (Frontend)

* [x] Menggunakan networking calls untuk berinteraksi dengan API pada proyek.
* [x] Menggunakan module bundler (Vite) untuk membangun proyek aplikasi web.

---

# Developer

Capstone Project — SkillsGap AI

Dibangun untuk kebutuhan Career Pathing & Skills Gap Analysis berbasis AI.
