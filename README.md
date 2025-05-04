Here’s a clear and professional `README.md` file for your **Node.js + Express.js backend** project:

---

# 🧠 Smart Notes Backend API

This is the **backend server** for the **Smart Notes App**, built with **Node.js**, **Express**, **MongoDB**, and **JWT authentication**. It includes AI-powered note summarization and tag suggestion using **Google Gemini**.

> 🔗 **Live API Endpoint:**
> [https://smartnotesbackend-production.up.railway.app](https://smartnotesbackend-production.up.railway.app)

---

## ⚙️ Features

* ✅ User registration & login with JWT tokens (stored in cookies)
* 🔒 Secure protected routes using middleware
* 📓 CRUD operations on notes (Create, Read, Update, Delete)
* 🔍 Search notes by title/content
* 🏷️ AI-suggested tags using Gemini (Google Generative AI)
* ✨ Clean REST API architecture
* 🌐 CORS setup for frontend integration

---

## 🛠️ Tech Stack

* **Node.js + Express.js**
* **MongoDB + Mongoose**
* **JWT + Cookies for Authentication**
* **bcryptjs** for password hashing
* **Google Gemini API** for AI features
* **dotenv**, **cors**, **cookie-parser** for environment config and request handling

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Shanmuk587/SmartNotesBackend.git
cd SmartNotesBackend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Update CORS in Backend app.js 

> 🔄 For local development, update the CORS origin in the backend (app.js`):  

**Locate the CORS setup code:**  

```js
app.use(cors({
  origin: 'https://smartnotesfrontend-production.up.railway.app', // React app origin
  credentials: true,
  sameSite: 'none', // allow cookies to be sent
}));
```

**🔁 Replace it with:**

```js
app.use(cors({
  origin: 'http://localhost:5173', // Local Vite/React app
  credentials: true,
  sameSite: 'none',
}));
```

---

### 4. Setup Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
NODE_ENV=production
GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ Keep this file private. Never commit `.env` to GitHub.

### 4. Run the Server

#### For development (auto-restarts on change):

```bash
npm run dev
```

The server will start at `http://localhost:3000`

---

## 📡 API Routes Overview

### 🔐 Auth Routes (`/api/auth`)

| Method | Endpoint    | Description                         |
| ------ | ----------- | ----------------------------------- |
| POST   | `/register` | Register a new user                 |
| POST   | `/login`    | Login existing user                 |
| GET    | `/logout`   | Logout user                         |
| GET    | `/me`       | Get current user info *(Protected)* |

---

### 📓 Notes Routes (`/api/notes`)

> All note routes are protected (require valid JWT token in cookies).

| Method | Endpoint         | Description                   |
| ------ | ---------------- | ----------------------------- |
| GET    | `/`              | Get all notes with pagination |
| GET    | `/search?query=` | Search notes by title/content |
| POST   | `/suggest-tags`  | Get AI-suggested tags         |
| POST   | `/`              | Create a new note             |
| GET    | `/:id`           | Get note by ID                |
| PUT    | `/:id`           | Update note by ID             |
| DELETE | `/:id`           | Delete note by ID             |

---

## 🧠 AI Integration

Uses **Google Gemini API** to:

* Auto-generate note summaries.
* Suggest tags based on note content.

This is handled on the backend via `POST /api/notes/suggest-tags`.

---
