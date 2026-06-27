# Bento Link Hub with Real-Time Click Analytics

A premium, full-stack multi-tenant personal link directory (similar to Linktree or Bento.me) built using the MERN stack (MongoDB, Express, React, Node.js). 

This application renders a dynamic Bento Grid of links fetched directly from the database and tracks user engagement by recording click analytics. It also includes an admin panel with secure JWT authentication and responsive analytics charts.

---

## Folder Structure

```text
Task1/
├── server/               # Express.js Backend
│   ├── middleware/       # JWT Auth Middleware
│   ├── models/           # Mongoose Schemas (User, Link)
│   ├── routes/           # API Endpoints (Auth, Links)
│   ├── .env              # Backend Environment Variables (not committed)
│   ├── server.js         # Entry Point
│   └── test-api.js       # Node Automated API Testing Script
├── client/               # React (Vite) Frontend
│   ├── src/
│   │   ├── components/   # BentoCard, SkeletonGrid, PrivateRoute
│   │   ├── hooks/        # useFetchLinks custom hook
│   │   ├── pages/        # Home, Login, Dashboard
│   │   ├── App.jsx       # Routing & Navigation Layout
│   │   ├── index.css     # Premium styling system & glassmorphism
│   │   └── main.jsx      # Entry Point
│   └── .env              # Client Environment Variables (not committed)
└── README.md             # Project documentation & setup instructions
```

---

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Backend Server Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   JWT_SECRET=supersecretjwtkeyforbentolinkhubdashboard
   
   # Optional: Set your own MongoDB URI. 
   # If left commented or blank, the server will automatically download and start 
   # a sandboxed in-memory database using mongodb-memory-server (zero configuration required!).
   # MONGO_URI=mongodb://localhost:27017/bento-hub
   ```

### 2. Frontend Client Setup
1. Open a new terminal window and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure frontend environment variables. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

## Running the Project Locally

### 1. Start the Backend Server
From the `server` directory, run:
```bash
npm start
```
*Note: On the very first launch, if you did not provide a `MONGO_URI`, it may take a minute to download the sandboxed in-memory MongoDB database binary.*

### 2. Start the Frontend Client
From the `client` directory, run:
```bash
npm run dev
```
The application will be running locally at `http://localhost:5173/`.

---

## Verifying & Testing the API

To verify the backend API endpoints function correctly:
1. Ensure the backend server is running (`npm start` inside `server/`).
2. Run the automated test suite script from the `server` directory:
   ```bash
   node test-api.js
   ```
The script will run a sequential test logging user registration, JWT login, protected link creation, click increment tracking, and link deletion.

---

## Technical Specifications

### MongoDB Models
- **User Schema**: Unique, indexed email and hashed password (10 salt rounds with `bcryptjs`).
- **Link Schema**: Trimmed titles, regular expression validated URLs, custom width/height grid spans (1-4), and atomic `clickCount` incrementation.

### Security
All write and delete operations (`POST /api/links`, `DELETE /api/links/:id`) are protected behind a JWT authorization middleware. Clients must send a `Authorization: Bearer <token>` header.

### Admin Dashboard Charts
We utilize `recharts` to display live click count distributions with custom animated Bar and Pie charts, allowing admins to see which of their bento cards are driving the most engagement.
