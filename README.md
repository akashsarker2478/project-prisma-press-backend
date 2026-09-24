# 🚀 Project Prisma Press Backend

A clean, scalable, and type-safe RESTful API built with **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**.

---

## 🛠️ Tech Stack & Features

- **Language:** TypeScript
- **Framework:** Express.js
- **Database & ORM:** PostgreSQL with Prisma ORM
- **Authentication & Security:** Bcrypt.js for Password Hashing
- **Architecture:** Modular Architecture with Controller-Service Pattern
- **Utilities:** Centralized Error Handling (`catchAsync` HOF) & Generic Response Formatter (`sendResponse`)

---

## 📁 Environment Setup

Create a `.env` file in the root directory and configure the environment variables as shown in `.env.example`:

DATABASE_URL="your connection string here"
BCRYPT_SALT_ROUNDS=10
PORT=5000
APP_URL=http://localhost:5000

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

1. Clone the Repository:
git clone https://github.com/akashsarker2478/project-prisma-press-backend.git
cd project-prisma-press-backend

2. Install Dependencies:
npm install

3. Database Migration & Prisma Generation:
npx prisma generate
npx prisma migrate dev

4. Run the Application:
npm run dev

The server will be running live at http://localhost:5000

---

## 📌 API Endpoints Summary

- POST /api/users/register - Register a new user with profile creation
- POST /api/auth/login - Authenticate and log in a user
- GET /api/users/me - Get logged-in user profile (Protected with Auth Middleware)
- put /api/users/my-profile - update user profile (Protected with Auth Middleware)
---

## 🧪 API Testing
You can import the Postman collection file `Prisma Press Backend.postman_collection.json` located in the root directory to test all endpoints.

## 🔒 Best Practices Implemented

- Conventional Commits
- Centralized Async Error Handling
- Generic Response Formatting
- Environment Variable Protection