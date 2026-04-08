import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/contexts/WalletContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NavigationDirectionProvider } from "@/contexts/NavigationDirection";
import { PageTransition } from "@/components/PageTransition";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index.tsx";
import SendTip from "./pages/SendTip.tsx";
import Activity from "./pages/Activity.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Leaderboard from "./pages/Leaderboard.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <NavigationDirectionProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/send" element={<PageTransition><SendTip /></PageTransition>} />
          <Route path="/activity" element={<PageTransition><Activity /></PageTransition>} />
          <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/profile/:address" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </NavigationDirectionProvider>
  );
}

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
