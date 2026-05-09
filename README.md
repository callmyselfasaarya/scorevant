# Scorevant

Scorevant is a professional-grade officiating assistant, tournament manager, and live scoring platform designed for racket sports. It provides a sleek, high-performance interface for tracking matches in Badminton, Tennis, Table Tennis, Squash, and Pickleball, ensuring precision and providing a premium, realtime experience for officials, players, and spectators alike.

## ✨ Core Features

- **🏆 Match Engine Architecture**: A robust pure-function rules engine seamlessly integrated with a `useReducer` state machine. It handles disparate logic perfectly—from Tennis (Deuce/Ad, Tiebreaks) to Rally Scoring (Table Tennis, Badminton cap rules) with 0 edge-case bugs and instant O(1) state rollbacks/undos.
- **⚡ Realtime Synchronization**: Deep integration with **Supabase Realtime** (`supabase.channel`). The officiating console automatically broadcasts every single point, server change, and state update over WebSockets with sub-second latency.
- **📺 Spectator Display Mode**: A dedicated, live-updating spectator view. Umpires can simply click "Copy Live Link" to share a direct broadcast of the match to any screen in the venue.
- **🏅 Tournament Management**: End-to-end tournament operations powered by a NestJS backend and React Query. Features include creating tournaments, seeding players, generating brackets, and launching directly into an officiated match directly from the bracket UI.
- **💾 Offline & Persistence Support**: The officiating engine features automatic offline persistence using a local storage fallback. If an umpire accidentally closes the tab or loses internet connection, the state is fully preserved and seamlessly restored when re-opened.
- **♿ Production-Ready Accessibility**: Features High Contrast Mode detection (`@media (prefers-contrast: more)`) that intelligently disables glassmorphism for legibility, full `useReducedMotion` support to disable complex animations, screen reader optimization, and compliant focus trapping for modals.
- **🎬 Premium Cinematic UI**: High-performance Framer Motion animations, "Liquid Gold" design language, Magnetic Buttons, fluid page transitions, and interactive parallax backgrounds.

## 🚀 Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Data & Realtime**: [Supabase JS](https://supabase.com/) & [React Query](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [Wouter](https://github.com/molecula-js/wouter)

### Backend
- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: MongoDB (via Mongoose schemas) for Tournament operations
- **Realtime / Auth**: Supabase (Postgres & WebSockets)

## 📂 Project Structure

```text
.
├── Frontend/           # Core React application
│   ├── src/
│   │   ├── components/ # Reusable UI (Buttons, Modals, Scoreboards)
│   │   ├── pages/      # Landing, Scoreboard, Setup, Tournaments, Spectate
│   │   ├── hooks/      # useMatchState, useMatchHistory
│   │   ├── types/      # TypeScript definitions
│   │   └── lib/        # Utility functions, scoring logic, API client
│   └── public/         # Static brand assets and logos
├── backend/            # NestJS API Server
│   └── src/
│       ├── auth/       # Authentication modules
│       ├── court/      # Court assignment & queues
│       ├── tournament/ # Tournament bracket generation & match logic
│       └── schemas/    # MongoDB schemas
└── README.md           # Documentation
```

## 🛠️ Getting Started

### Prerequisites
- Node.js v20+
- A Supabase Project (for Realtime and Auth)
- MongoDB instance (for Tournament storage)

### Installation
1. Clone the repository
2. Install dependencies for both frontend and backend:
```bash
# In frontend directory
npm install

# In backend directory
npm install
```

### Environment Setup
Create a `.env` file in the `Frontend/` directory:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Running Development Servers
You will need to run both servers concurrently:

**Frontend**:
```bash
cd Frontend
npm run dev
```

**Backend**:
```bash
cd backend
npm start
```

## 🎨 Design System
Scorevant uses a bespoke "Liquid Gold" design system that responds automatically to system-level accessibility preferences:
- **Primary Color**: `#F4C542` (Gold)
- **Background**: `#000000` (Pure Black)
- **Glassmorphism**: Layered `backdrop-filter: blur()` utilities (falls back to solid borders in High Contrast Mode)
- **Motion**: Physics-based springs and cinematic tweens (falls back to snap transitions when Reduced Motion is enabled by the OS)
