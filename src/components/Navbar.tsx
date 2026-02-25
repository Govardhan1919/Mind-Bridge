import { Link } from "react-router-dom";
import { Heart, Menu, X, LogOut, CalendarDays } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Resources", to: "/resources" },
  { label: "Book Session", to: "/book-session" },
  { label: "Support Groups", to: "/support-groups" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, logout, role } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          <span className="font-display text-xl font-semibold text-foreground">MindBridge</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <div className="flex items-center gap-3 ml-4">
              <span className="text-sm text-foreground capitalize">Hi, {role}</span>
              <Link
                to="/my-sessions"
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20"
              >
                <CalendarDays className="h-4 w-4" />
                My Sessions
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} title="Sign Out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <div className="pt-2 border-t border-border mt-2">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => { logout(); setOpen(false); }}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </nav>
  );
}
