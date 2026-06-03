# Scorevant

Scorevant is a professional-grade officiating assistant, tournament management platform, and live scoring system built specifically for modern racket sports. Designed for tournament directors, referees, umpires, players, and spectators, it delivers a premium real-time experience for managing and broadcasting matches across multiple disciplines.

Supporting **Badminton, Tennis, Table Tennis, Squash, and Pickleball**, Scorevant combines tournament administration, intelligent scoring automation, live match tracking, spectator broadcasting, and resilient offline support within a single high-performance ecosystem.

---

## Overview

Scorevant was engineered to solve the operational challenges faced during competitive racket sport events. From generating tournament brackets and managing courts to officiating live matches and broadcasting scores in real time, the platform provides a seamless workflow from tournament setup to final results.

The system is powered by a highly optimized match engine architecture, secure authentication infrastructure, optional realtime synchronization, and a premium accessibility-focused user interface.

---

## Key Features

### Match Engine Architecture

At the core of Scorevant is a robust pure-function rules engine integrated with a `useReducer` state machine.

The engine accurately handles sport-specific scoring systems including:

* Tennis Deuce and Advantage logic
* Tiebreak scoring
* Rally scoring formats
* Badminton point-cap rules
* Table Tennis match progression
* Squash and Pickleball scoring variations

Key benefits include:

* Deterministic state transitions
* Instant O(1) undo and rollback operations
* Zero known scoring edge-case failures
* Fully predictable match history reconstruction
* Offline-safe state recovery

---

### Secure Authentication

Scorevant includes a complete authentication layer powered by NestJS.

Features include:

* User registration and login
* JWT-based authentication
* bcrypt password hashing
* Protected API endpoints
* User profile retrieval
* Secure session persistence

Available endpoints:

```http
POST /auth/register
POST /auth/login
GET  /auth/me
```

All protected requests automatically include JWT authorization tokens through the frontend API layer.

---

### Tournament Management

The platform supports complete tournament lifecycle management.

Administrators can:

* Create tournaments
* Register participants
* Seed players
* Generate brackets
* Assign courts
* Manage match queues
* Launch officiated matches directly from bracket views
* Track tournament progression in real time

All tournament operations are powered by a NestJS backend and React Query-powered frontend architecture.

---

### Realtime Spectator Broadcasting

Scorevant supports optional realtime synchronization through Supabase Realtime channels.

When enabled, spectators can receive live score updates without refreshing the page.

Features include:

* Instant score propagation
* Match state synchronization
* Multi-device broadcasting
* Venue display support
* Low-latency spectator experiences

If Supabase is not configured, all tournament and officiating functionality remains fully operational.

---

### Spectator Display Mode

A dedicated spectator experience allows matches to be broadcast on large screens, mobile devices, or remote viewing stations.

Officials can simply:

1. Open a live match
2. Select **Copy Live Link**
3. Share the generated URL

The spectator view automatically reflects ongoing score updates and match events.

---

### Offline Persistence & Recovery

Tournament environments are not always connected.

To ensure uninterrupted operation, Scorevant provides automatic persistence using local storage fallbacks.

Benefits include:

* Recovery after accidental tab closure
* Network interruption resilience
* Automatic state restoration
* Seamless continuation of active matches
* Reduced risk of scoring data loss

---

### Accessibility First

Accessibility is treated as a core platform requirement rather than an afterthought.

Implemented features include:

* High Contrast Mode detection
* Reduced Motion support
* Screen reader optimization
* Keyboard navigation support
* Accessible modal focus trapping
* Adaptive visual fallbacks

When users enable high-contrast preferences at the operating system level, advanced visual effects such as glassmorphism are automatically replaced with accessibility-friendly alternatives.

---

### Premium Interface Design

Scorevant utilizes a bespoke **Liquid Gold Design System** focused on clarity, responsiveness, and visual prestige.

Interface highlights include:

* Glassmorphic surfaces
* Fluid page transitions
* Magnetic interactive controls
* Cinematic motion design
* Responsive layouts
* Performance-optimized animations
* Interactive parallax environments

All animations gracefully degrade when reduced-motion preferences are detected.

---

# Technology Stack

## Frontend

| Category         | Technology               |
| ---------------- | ------------------------ |
| Framework        | React 19 + Vite          |
| Language         | TypeScript               |
| State Management | React Hooks + useReducer |
| Data Fetching    | React Query              |
| Realtime         | Supabase JS (Optional)   |
| Styling          | Tailwind CSS v4          |
| Animations       | Framer Motion            |
| Icons            | Lucide React             |
| Routing          | Wouter                   |

---

## Backend

| Category          | Technology     |
| ----------------- | -------------- |
| Framework         | NestJS         |
| Database          | MongoDB        |
| ODM               | Mongoose       |
| Authentication    | JWT + Passport |
| Password Security | bcrypt         |

---

# Architecture

```text
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── lib/
│   └── public/
│
├── backend/
│   └── src/
│       ├── auth/
│       ├── court/
│       ├── tournament/
│       └── schemas/
│
└── README.md
```

---

# Getting Started

## Prerequisites

Before running the project, ensure the following dependencies are available:

* Node.js v20 or newer
* MongoDB instance
* Supabase project (optional)

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd scorevant
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

---

## Backend Configuration

Create a `.env` file inside the `backend/` directory:

```env
PORT=3000

MONGODB_URI=mongodb://localhost:27017/SCOREVANT

JWT_SECRET=your-jwt-secret-at-least-32-chars

# Optional
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
```

---

## Frontend Configuration

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000

# Optional
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Running the Application

Both services must be running simultaneously.

### Frontend

```bash
cd frontend
npm run dev
```

### Backend

```bash
cd backend
npm start
```

---

# Authentication API

### Register

```http
POST /auth/register
```

Creates a new account and returns a JWT access token.

---

### Login

```http
POST /auth/login
```

Authenticates an existing user and returns a JWT access token.

---

### Current User

```http
GET /auth/me
```

Requires:

```http
Authorization: Bearer <token>
```

Returns the authenticated user's profile information.

---

# Verification Checklist

After setup:

1. Start backend and frontend services.
2. Open the application.
3. Create a new account using **Create One**.
4. Sign in successfully.
5. Confirm redirection to the dashboard.
6. Create or access a tournament.
7. Verify authenticated API requests.
8. Launch a match and validate scoring functionality.
9. Test spectator mode and live-link sharing.

---

# Troubleshooting

### Login Displays "Failed to Fetch"

Verify:

* Backend is running
* API URL matches `VITE_API_BASE_URL`
* Port `3000` is accessible

---

### MongoDB Database Naming Issues

Windows environments may behave differently with inconsistent database naming.

Use a single database name consistently:

```env
SCOREVANT
```

---

### Spectator Updates Not Synchronizing

Verify:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Realtime functionality is optional and does not affect core platform features.

---

# Design System

### Liquid Gold

| Property           | Value                 |
| ------------------ | --------------------- |
| Primary Color      | `#F4C542`             |
| Background         | `#000000`             |
| Accent Style       | Liquid Gold           |
| Motion System      | Physics-Based Springs |
| Accessibility Mode | Automatic Adaptation  |

### Visual Principles

* Premium competitive sports aesthetic
* Minimal latency perception
* Accessibility-first interactions
* Responsive by default
* Motion with graceful degradation
* High readability under tournament conditions

---

# Vision

Scorevant aims to become the definitive digital officiating and tournament operations platform for racket sports. By combining intelligent match management, professional-grade officiating tools, resilient offline support, realtime broadcasting, and a modern user experience, it provides everything required to run competitive events with confidence and precision.
