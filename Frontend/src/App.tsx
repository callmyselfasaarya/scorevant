import { lazy, Suspense } from "react";
import { Route, Router as WouterRouter, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./components/MotionWrappers";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Lazy load pages for route splitting
const Landing = lazy(() => import("@/pages/Landing"));
const Home = lazy(() => import("@/pages/Home"));
const Scoreboard = lazy(() => import("@/pages/Scoreboard"));
const History = lazy(() => import("@/pages/History"));
const Tournaments = lazy(() => import("@/pages/Tournaments"));
const TournamentDetails = lazy(() => import("@/pages/TournamentDetails"));
const LiveCourts = lazy(() => import("@/pages/LiveCourts"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Spectate = lazy(() => import("@/pages/Spectate"));
const Documentation = lazy(() => import("@/pages/Documentation"));

const queryClient = new QueryClient();

// Accessible loading fallback
const PageLoader = () => (
  <div 
    className="min-h-screen flex items-center justify-center bg-black"
    role="status"
    aria-label="Loading page..."
  >
    <div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Switch>
          <Route path="/">
            <PageTransition>
              <Landing />
            </PageTransition>
          </Route>
          <Route path="/login">
            <PageTransition>
              <Login />
            </PageTransition>
          </Route>
          <Route path="/register">
            <PageTransition>
              <Register />
            </PageTransition>
          </Route>
          <Route path="/dashboard">
            <PageTransition>
              <ProtectedRoute component={Dashboard} />
            </PageTransition>
          </Route>
          <Route path="/tournaments">
            <PageTransition>
              <ProtectedRoute component={Tournaments} />
            </PageTransition>
          </Route>
          <Route path="/tournaments/:id">
            <PageTransition>
              <ProtectedRoute component={TournamentDetails} />
            </PageTransition>
          </Route>
          <Route path="/courts">
            <PageTransition>
              <ProtectedRoute component={LiveCourts} />
            </PageTransition>
          </Route>
          <Route path="/setup">
            <PageTransition>
              <ProtectedRoute component={Home} />
            </PageTransition>
          </Route>
          <Route path="/scoreboard">
            <PageTransition>
              <ProtectedRoute component={Scoreboard} />
            </PageTransition>
          </Route>
          <Route path="/history">
            <PageTransition>
              <History />
            </PageTransition>
          </Route>
          <Route path="/spectate/:id">
            <PageTransition>
              <Spectate />
            </PageTransition>
          </Route>
          <Route path="/docs">
            <PageTransition>
              <Documentation />
            </PageTransition>
          </Route>
          <Route>
            <PageTransition>
              <NotFound />
            </PageTransition>
          </Route>
        </Switch>
      </AnimatePresence>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base="/">
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
