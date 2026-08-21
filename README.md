# 🚀 TravelJang

> Personalized travel planning based on tourism data, health conditions, and user preferences.

---

# 📌 About

## Why was this project created?

Travelers with chronic conditions often need to consider medication schedules, meal timing, dietary restrictions, and physical activity in addition to sightseeing.

Existing travel services primarily focus on recommending destinations without sufficiently considering each user's health conditions.

## What problem does it solve?

TravelJang generates personalized travel itineraries by combining public tourism data with users' health conditions and travel preferences.

The service helps users enjoy safer and more personalized trips by considering factors such as:

- Medication schedules
- Meal timing
- Dietary preferences and restrictions
- Walking distance
- Physical activity
- Health-related travel constraints

## Who is it for?

This service is designed for:

- Travelers managing chronic conditions such as diabetes, hypertension, or dyslipidemia
- Users who need health-aware travel schedules
- Anyone seeking a safer and more personalized travel planning experience

## What are the main goals?

- Provide personalized travel itineraries based on tourism and health data
- Balance sightseeing, dining, rest, and health management
- Support AI-based itinerary generation and modification
- Improve itinerary reliability through rule-based validation

---

# 🏗️ System Architecture

The overall system consists of the following components:

- Frontend
- Backend
- AI Server
- Database
- External APIs

> The architecture diagram will be added after the system structure is finalized.

---

# ✨ Key Features

> 🚧 The following features are currently under development.

## 🔐 Authentication

- User sign-up and sign-in
- Access Token and Refresh Token management
- Authentication state management
- Protected page access

## 🧳 Core Features

- AI-powered travel itinerary generation
- Health-aware travel scheduling
- Personalized tourism recommendations
- Travel itinerary detail views
- Itinerary modification and management

## 🤖 AI Features

- Natural language itinerary modification
- AI-based itinerary validation
- Health condition and nutrition analysis
- Personalized travel recommendations

---

# 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Language | TypeScript 6 |
| Library | React 19 |
| Build Tool | Vite 8 |
| Linter | ESLint 10 |
| Package Manager | npm |

---

# 📁 Project Structure

```text
FE/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report-issue-template.md
│   │   ├── feature-request-issue-template.md
│   │   └── refactor-issue-template.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

> The project structure will be expanded as pages, components, API services, hooks, and shared utilities are implemented.

---

# 🚀 Getting Started

## Prerequisites

Before running the project, make sure the following software is installed:

- Node.js
- npm
- Git

Check the installed versions:

```bash
node --version
npm --version
git --version
```

---

## 1. Clone Repository

```bash
git clone https://github.com/team-planb-dev/FE.git
cd FE
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Run the Development Server

```bash
npm run dev
```

After the development server starts, open:

```text
http://localhost:5173
```

---

## 4. Run Code Validation

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

---

## 5. Preview the Production Build

```bash
npm run preview
```

---

# 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Runs TypeScript compilation and creates a production build |
| `npm run lint` | Runs ESLint for the entire project |
| `npm run preview` | Previews the production build locally |

---

# 🔐 Environment Variables

No environment variables are required for the current frontend starter project.

When backend API integration begins, required environment variables should be documented in an `.env.example` file.

Example:

```env
VITE_API_BASE_URL=http://localhost:8080
```

> Actual secrets, API keys, and private environment values must not be committed to Git.

---

# 🧪 Testing

An automated frontend testing framework has not been configured yet.

Testing tools and commands will be documented after the testing environment is added.

---

# 🚢 Deployment

The frontend deployment environment is currently under development.

Deployment configuration and production URLs will be documented after they are finalized.

---

# 👥 Team

| Role | Name | GitHub |
|---|---|---|
| PM | 이승협 | - |
| Designer | 조예원 | - |
| Backend | 강우주 | [wooju-kang](https://github.com/wooju-kang) |
| Backend | 이윤서 | [xYunaL](https://github.com/xYunaL) |
| Frontend | 임성은 | [sungeunlim03](https://github.com/sungeunlim03) |

---
