import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" fill="currentColor" />
            <span className="font-display text-lg font-semibold text-foreground">MindBridge</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/resources" className="hover:text-primary transition-colors">Resources</Link>
            <Link to="/book-session" className="hover:text-primary transition-colors">Book Session</Link>
            <Link to="/support-groups" className="hover:text-primary transition-colors">Support Groups</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 MindBridge. If you're in crisis, call 988.
          </p>
        </div>
      </div>
    </footer>
  );
}
