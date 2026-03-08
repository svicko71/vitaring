import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Activity, Bluetooth, Brain, Clock, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/", icon: Activity, label: "Dashboard" },
  { to: "/pairing", icon: Bluetooth, label: "Pairing" },
  { to: "/insights", icon: Brain, label: "Insights" },
  { to: "/history", icon: Clock, label: "History" },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">VitaRing</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-ring" />
              <span className="text-xs text-muted-foreground">Simulating</span>
            </div>
            <button onClick={signOut} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Sign out">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-xl bg-background/90 border-t border-border/50">
        <div className="container max-w-5xl mx-auto flex items-center justify-around h-16 px-4">
          {navItems.map(item => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink key={item.to} to={item.to} className="flex flex-col items-center gap-1 relative px-3 py-1">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 w-8 h-1 rounded-full gradient-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
