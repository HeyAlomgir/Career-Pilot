# CareerPilot 🚀

**AI-Powered Job & Freelance Marketplace** — connecting job seekers with employers through intelligent, AI-driven job matching, resume insight, and a smart conversational assistant.

Built as a full-stack Agentic AI application demonstrating modern web development, secure authentication, role-based authorization, and practical LLM integration.

---

## 🔗 Live Links

| | Link |
|---|---|
| **Live Website** | [https://your-live-url.vercel.app](#) |
| **Frontend Repository** | [GitHub — Frontend](#) |
| **Backend Repository** | [GitHub — Backend](#) |

---

## 🧠 AI Features

CareerPilot implements two substantial Agentic AI features:

1. **AI Chat Assistant** — A context-aware conversational assistant that understands the platform, helps users navigate features, and maintains conversation history with a typing indicator and suggested prompts.
2. **AI Smart Recommendation Engine** — Analyzes a job seeker's application history to recommend the most relevant open jobs, improving with each new application.

Both features are powered by the **Groq API** (Llama 3.3 70B).

---

## 🛠 Tech Stack

### Frontend
- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + **HeroUI** component library
- **Better Auth** (email/password, Google OAuth, role-based access)
- **Recharts** for dashboard analytics
- **Framer Motion** for animations
- **React Hot Toast** for notifications

### Backend
- **Node.js** + **Express** + **TypeScript**
- **MongoDB** (native driver)
- Role-based middleware authorization

### AI Integration
- **Groq API** (Llama 3.3 70B Versatile)

### Other Services
- **imgbb** — image hosting for job images and profile avatars

---

## ✨ Core Features

- 🔐 Authentication: Email/Password, Google OAuth, Demo Login (auto-fill), role-based (Job Seeker / Employer)
- 🧭 Role-based dashboards with sidebar navigation and analytics (Recharts)
- 💼 Job listing with search, category & location filters, sorting, and pagination
- 📄 Job details page with bookmarking and a review/rating system
- 📝 Post, manage, and delete job listings (Employer)
- 📨 Apply to jobs with a structured application form (Job Seeker)
- ✅ Accept / Reject applicants (Employer)
- 📊 My Applications tracker with status badges (Job Seeker)
- 🌗 Dark / Light mode
- 💬 Floating AI Chat Assistant available site-wide
- 🎯 AI-powered job recommendations on the seeker dashboard
- 📱 Fully responsive across mobile, tablet, and desktop

---

## 📁 Project Structure

```
career-pilot-client/        # Frontend (Next.js)
├── src/
│   ├── app/                # Pages (App Router)
│   ├── components/         # Reusable UI components
│   └── lib/                # Auth client, utilities
└── ...

career-pilot-server/         # Backend (Express)
├── server.ts                # All routes and server entry point
└── ...
```

---

## ⚙️ Getting Started (Local Setup)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key ([console.groq.com](https://console.groq.com))
- imgbb API key ([api.imgbb.com](https://api.imgbb.com))
- Google OAuth credentials ([console.cloud.google.com](https://console.cloud.google.com))

### 1. Clone the repositories
```bash
git clone <frontend-repo-url> career-pilot-client
git clone <backend-repo-url> career-pilot-server
```

### 2. Backend Setup
```bash
cd career-pilot-server
npm install
```

Create a `.env` file:
```dotenv
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
FRONTEND_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd career-pilot-client
npm install
```

Create a `.env.local` file:
```dotenv
MONGODB_URI=your_mongodb_atlas_connection_string
BETTER_AUTH_SECRET=your_random_secret
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Run the frontend:
```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## 🔑 Demo Login

The Sign In page includes one-click demo login buttons for course evaluators:

| Role | Access |
|---|---|
| **Job Seeker Demo** | Browse jobs, apply, bookmark, review, view AI recommendations |
| **Employer Demo** | Post jobs, manage listings, review applicants |

---

## 👤 Author

Built by **Alomgir Hossain** as part of the SCIC-13 Agentic AI Full Stack Project assignment.