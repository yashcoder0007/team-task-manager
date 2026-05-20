# 🌌 Team Task Manager - Midnight Tech Edition

A premium, high-fidelity full-stack web application for project and task management featuring advanced role-based access control (RBAC), built with a state-of-the-art **Midnight Tech** glassmorphism dark theme.

---

## ✨ Features

- **🛡️ Secure Authentication**: Full sign-up, login, and token-based persistency with JSON Web Tokens (JWT) and encrypted password hashing (bcryptjs).
- **🔑 Role-Based Access Control (RBAC)**:
  - **Admin**: Complete system control. Create, update, and manage projects; assign tasks to team members; manage/audit the team list.
  - **Member**: Personal dashboard. View assigned projects and tasks; update task progress and completion status.
- **📁 Advanced Project Management**: Group related tasks by projects, set goals, manage member assignment, and monitor overall project progress bars.
- **📝 High-Fidelity Task Management**: Create tasks with titles, detailed descriptions, priority markers (high, medium, low), and due dates. Filter tasks dynamically by status and priority.
- **📊 Real-Time Dashboard**: At-a-glance analytics with sleek count cards, progress gauges, and alert highlights for overdue items.
- **🎨 Premium Visual Experience**: Dark mode design ("Midnight Tech") using rich glassmorphic cards (`backdrop-blur-xl`), animated ambient glow background orbs, smooth hover scales, and clean neon accent colors.

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Modern component architecture and lightning-fast dev builds.
- **Tailwind CSS**: Utility-first CSS configured with custom neon primary gradients.
- **Framer Motion**: Smooth, organic transitions, entrance animations, and interactive hover scales.
- **Lucide Icons**: Crisp, vector icons for UI readability.
- **Axios & Context API**: Reactive global state management and centralized API communications.

### Backend
- **Node.js & Express.js**: RESTful API endpoints, routing, and rate-limiting middleware.
- **MongoDB & Mongoose**: Flexible document model for user, project, and task relationships.
- **Zod**: Robust request body validation schemas.

---

## 📁 Project Directory Structure

```text
ertha1/
├── client/                     # React Single Page Application (SPA)
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/         # Layout wrapper, glass header, and sidebar
│   │   ├── context/            # AuthContext state provider
│   │   ├── pages/              # Login, Signup, Dashboard, Projects, Tasks, Team
│   │   └── services/           # Axios interceptors and endpoints
│   ├── index.html
│   ├── tailwind.config.js       # Custom midnight palette and glow shadows
│   └── package.json
└── server/                     # Node.js REST API Server
    ├── src/
    │   ├── config/             # DB connection settings
    │   ├── controllers/        # Business logic for auth, projects, tasks, dashboard
    │   ├── middleware/         # Auth verification and validation middlewares
    │   ├── models/             # Mongoose schemas (User, Project, Task)
    │   ├── routes/             # Express route mappings
    │   ├── validations/        # Zod validation schemas
    │   ├── seed.js             # Seeding utility for demo data
    │   └── server.js           # Server entrypoint
    ├── .env                    # Environment credentials
    └── package.json
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js (>= 18.0.0)** and **npm** installed.

### 2. Quick Setup (Monorepo install)
Run the following in the root folder to install dependencies for both the frontend and backend:
```bash
npm install
```

### 3. Database Seeding
To populate the database (hosted live on MongoDB Atlas) with preconfigured users and tasks:
```bash
cd server
npm run seed
```

### 4. Running the App

#### Running in Development Mode
To launch the app with hot-reloading:
- **Backend (Port 5005)**:
  ```bash
  cd server
  npm run dev
  ```
- **Frontend (Port 5173)**:
  ```bash
  cd client
  npm run dev
  ```

#### Running in Production Mode (Unified Server)
To build the static frontend assets and serve them directly from the Express backend:
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```
2. Configure `.env` in `server/` to have `NODE_ENV=production` and `PORT=5005`.
3. Launch the server:
   ```bash
   cd server
   npm start
   ```
   Now access the complete application at `http://localhost:5005`.

---

## 🔑 Demo Access Credentials

- **Admin**: `admin@test.com` / `Admin@123`
- **Member (Yash Dhiman)**: `member@test.com` / `Member@123`

---

## 🌐 Railway Deployment Steps

This repository is optimized for one-click deployment on **Railway**:

1. **Push code to GitHub**: Create a repository and push the codebase.
2. **Deploy on Railway**: 
   - Connect your GitHub repository.
   - Railway automatically detects the root `package.json` and runs the `postinstall`, `build`, and `start` scripts.
3. **Configure Variables**:
   Add the following variables in the Railway dashboard:
   - `MONGO_URI`: `mongodb+srv://dj:DjAdmin123@cluster0.aosq7tw.mongodb.net/mini-Ertha?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `supersecretkey123`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-railway-app-url.up.railway.app`
