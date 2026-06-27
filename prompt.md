# MERN Full-Stack Bento Link Hub — Antigravity Internship Project Prompt

## Project Identity

**Project Name:** Full-Stack Bento Link Hub with Real-Time Click Analytics
**Stack:** MongoDB · Express.js · React.js · Node.js (MERN)
**Track:** Enterprise Software — Full-Stack Engineering Internship
**Structure:** 4 Interconnected Milestone Tasks

---

## What You Are Building

A multi-tenant, data-driven Bento Grid Link Hub where every card block is:
- Dynamically fetched from a MongoDB backend (no hardcoded data)
- Tracked with real-time click analytics per card
- Protected by JWT authentication for admin write operations
- Visualized in an admin dashboard with live charts

Think of it as a personal link-in-bio page, but fully powered by your own API, database, and analytics engine.

---

## Task 1 — Backend Architecture & Database Schema

### Goal
Set up the Node.js/Express server, connect to MongoDB, design the data model, and expose three REST API routes.

### Environment Setup
- Initialize a Node.js project (`npm init`)
- Install: `express`, `mongoose`, `cors`, `dotenv`
- Create a `.env` file to store your `MONGO_URI` and `PORT` (never commit this file)
- Add `.env` to `.gitignore`

### Mongoose Schema — `Link` Model

| Field | Type | Rules |
|---|---|---|
| `title` | String | Required, trimmed (no empty spaces) |
| `url` | String | Required, validated with a URL regex |
| `gridSpanX` | Number | Default: 1, min: 1, max: 4 |
| `gridSpanY` | Number | Default: 1, min: 1, max: 4 |
| `clickCount` | Number | Required, default: 0 |

### API Routes — `/api/links`

| Method | Endpoint | Behavior |
|---|---|---|
| `GET` | `/api/links` | Return all link documents, HTTP 200 |
| `POST` | `/api/links` | Validate and create a new link record |
| `PATCH` | `/api/links/click/:id` | Find by ID, atomically increment `clickCount` by 1 via `$inc`, return updated doc |

### Error Handling Rules
- Wrap all route logic in `try-catch` blocks
- Bad or missing document IDs → HTTP `404`
- Invalid request payloads → HTTP `400`
- Never let unhandled errors crash the server process

### Starter Boilerplate — `server.js`

```js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Database Stream Engaged'))
  .catch(err => console.error('Connection Failed:', err));

app.use('/api/links', require('./routes/linkRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
```

### Deliverables for Task 1
- [ ] Working server that connects to MongoDB
- [ ] `Link` model with all validations enforced
- [ ] All 3 API routes functional
- [ ] Postman screenshots of each route (GET, POST, PATCH) with sample JSON payloads

---

## Task 2 — Frontend API Connection & Dynamic Grid Hydration

### Goal
Build the React frontend, consume your Task 1 API, and render a fully dynamic Bento Grid where layout dimensions come from the database.

### Setup
- Create a React app (Vite recommended: `npm create vite@latest`)
- Install: `axios`
- Set your API base URL in an environment variable (e.g. `VITE_API_URL=http://localhost:5000`)

### Custom Hook — `useFetchLinks.js`

```js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchLinks = (url) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(url)
      .then(res => { setLinks(res.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [url]);

  return { links, loading, error };
};
```

### Component Requirements

**Loading State:** Show a skeleton grid (grey placeholder blocks) while data fetches.

**Error State:** Show a styled error card if the API is unreachable.

**Dynamic Grid Rendering:** Map over fetched link records. Apply grid span styles inline:

```jsx
style={{
  gridColumn: `span ${item.gridSpanX}`,
  gridRow: `span ${item.gridSpanY}`
}}
```

Do **not** use hardcoded CSS classes for layout — all sizing must come from the database.

**Click Tracking:** Each bento card's `onClick` handler must:
1. Fire a background `PATCH` request to `/api/links/click/:id`
2. Open the link URL in a new browser tab (`window.open(url, '_blank')`)
3. Not block or delay the user's navigation

### Deliverables for Task 2
- [ ] React app running and connected to your backend API
- [ ] Skeleton loading state visible during data fetch
- [ ] Error card shown when server is offline
- [ ] Bento grid rendering dynamically from DB records
- [ ] Click tracking firing silently on card interaction

---

## Task 3 — Identity Guarding & JWT Authentication

### Goal
Secure write operations behind a proper authentication gateway. Only registered, logged-in users can create or delete links.

### New Dependencies
Install: `bcryptjs`, `jsonwebtoken`

### User Schema

| Field | Type | Rules |
|---|---|---|
| `email` | String | Unique, indexed |
| `password` | String | Required, hashed before saving |

**Password rule:** Use `bcryptjs` with a minimum of **10 salt rounds** before storing any password in the database. Never store plaintext passwords.

### Auth Routes — `/api/auth`

| Method | Endpoint | Behavior |
|---|---|---|
| `POST` | `/api/auth/register` | Hash password, create user, return success |
| `POST` | `/api/auth/login` | Compare plain vs hashed password with `bcrypt.compare()`. On success, sign and return a JWT containing the user's ID |

### Auth Middleware

Write a standalone middleware function that:
1. Reads the `Authorization` header from incoming requests
2. Extracts the Bearer token string
3. Verifies the JWT signature using your secret key
4. Attaches the decoded user payload to `req.user`
5. Returns HTTP `401` if the token is missing, expired, or invalid

Apply this middleware to all `POST` and `DELETE` routes on `/api/links`.

### Deliverables for Task 3
- [ ] User registration and login routes functional
- [ ] Passwords stored hashed (verify in MongoDB Compass — no plaintext visible)
- [ ] JWT returned on login
- [ ] Protected routes returning `401` when accessed without a valid token
- [ ] Postman screenshots proving protected routes reject unauthorized requests

---

## Task 4 — Analytics Dashboard & Visual Reporting

### Goal
Build a protected admin dashboard in React that displays live click analytics as a chart.

### Private Route Guard

Create a `PrivateRoute` wrapper component that:
- Checks for a valid JWT in `localStorage` (or your chosen client-side storage)
- If the token exists → renders the protected component
- If missing → immediately redirects to `/login` using React Router

### Admin Dashboard Requirements

**Data Fetching:** On mount, fetch all link records from your API (with the auth token in the request header).

**Data Transformation:** Write a helper function that:
- Takes the raw links array
- Sorts records (e.g., by `clickCount` descending)
- Returns a clean array shaped for your chart library: `[{ name: 'Link Title', clicks: N }]`

**Chart Integration:** Use `recharts` or `chart.js` to render either:
- A **Bar Chart** mapping each link title on the X-axis to its click count on the Y-axis, or
- A **Pie Chart** showing click distribution proportionally across all cards

The chart must be **responsive** — use `ResponsiveContainer` (Recharts) or equivalent so it adapts to mobile viewports automatically.

### Deliverables for Task 4
- [ ] `/dashboard` route locked behind `PrivateRoute`
- [ ] Unauthenticated users redirected to `/login`
- [ ] Analytics chart rendering live data from the database
- [ ] Chart updates reflected when click counts change
- [ ] Mobile-responsive chart layout

---

## Submission Checklist

### Item A — Technical Documentation (Word Document)
- [ ] Step-by-step engineering log for all 4 tasks
- [ ] MongoDB collection screenshots (Compass or Atlas UI)
- [ ] Postman test logs for every API endpoint (with request & response JSON)
- [ ] React app screenshots (loading state, grid view, error state)
- [ ] Admin dashboard screenshot showing live chart

### Item B — LinkedIn Video Demo (1–2 minutes)
- [ ] Register a new mock account on screen
- [ ] Add a link record, watch it appear in the bento grid
- [ ] Click a bento card, show the click count increment in the database or dashboard
- [ ] Show the analytics chart updating in real time
- [ ] Post to LinkedIn with a professional caption tagging your mentor

### Item C — GitHub Repository
- [ ] Clean folder structure: `/server` and `/client` as separate subdirectories
- [ ] `.gitignore` excludes `node_modules/`, `.env`, and all build output folders
- [ ] `README.md` with setup instructions (how to install, configure `.env`, and run both server and client)
- [ ] Repository is public
- [ ] Submit the GitHub URL to the assigned Google Classroom portal or via DM

---

## Project Folder Structure (Recommended)

```
bento-link-hub/
├── server/
│   ├── models/
│   │   ├── Link.js
│   │   └── User.js
│   ├── routes/
│   │   ├── linkRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env              ← never commit
│   ├── .gitignore
│   └── server.js
└── client/
    ├── src/
    │   ├── hooks/
    │   │   └── useFetchLinks.js
    │   ├── components/
    │   │   ├── BentoCard.jsx
    │   │   ├── SkeletonGrid.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   └── Dashboard.jsx
    │   └── App.jsx
    ├── .env              ← VITE_API_URL only, never commit secrets
    └── package.json
```

---

## Engineering Standards to Follow

- Always use environment variables for URLs, secrets, and connection strings — no hardcoding
- Schema validations catch bad data at the database layer before it can corrupt records
- Client code must be decoupled from specific backend environments (use `VITE_API_URL`)
- Log errors cleanly server-side — never expose stack traces or file paths to API consumers
- Commit frequently with clear, descriptive messages (e.g. `feat: add JWT auth middleware`)
- Test every API route in Postman before wiring it to the frontend

---

*Good luck. Build it defensively, document everything, and ship clean code.*