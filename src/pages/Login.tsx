import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth, API_URL } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [studentForm, setStudentForm] = useState({ email: "", password: "" });
  const [therapistForm, setTherapistForm] = useState({ email: "", password: "" });
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/book-session";

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: studentForm.email, password: studentForm.password, requestedRole: "STUDENT" })
      });
      const data = await response.json();

      if (!response.ok) {
        toast({ title: "Login Failed", description: data.error || "An error occurred.", variant: "destructive" });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      login("student", data.user);
      toast({ title: "Student Login Successful", description: "Welcome back!" });
      navigate(from, { replace: true });
    } catch (err) {
      toast({ title: "Error", description: "Failed to connect to the server.", variant: "destructive" });
    }
  };

  const handleTherapistLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: therapistForm.email, password: therapistForm.password, requestedRole: "THERAPIST" })
      });
      const data = await response.json();

      if (!response.ok) {
        toast({ title: "Login Failed", description: data.error || "An error occurred.", variant: "destructive" });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      login("therapist", data.user);
      toast({ title: "Therapist Login Successful", description: "Welcome to your dashboard." });
      navigate("/therapist-dashboard", { replace: true });
    } catch (err) {
      toast({ title: "Error", description: "Failed to connect to the server.", variant: "destructive" });
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminForm.email, password: adminForm.password, requestedRole: "ADMIN" })
      });
      const data = await response.json();
      if (!response.ok) {
        toast({ title: "Login Failed", description: data.error || "An error occurred.", variant: "destructive" });
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      login("admin", data.user);
      toast({ title: "Admin Login Successful", description: "Welcome, Admin." });
      navigate("/admin-dashboard", { replace: true });
    } catch {
      toast({ title: "Error", description: "Failed to connect to the server.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            <span className="font-display text-2xl font-bold text-foreground">MindBridge</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Sign in to your account</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-glow-primary">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="therapist">Therapist</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="student@university.edu"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="student-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={studentForm.password}
                      onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full">Sign In as Student</Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="therapist">
              <form onSubmit={handleTherapistLogin} className="space-y-4">
                <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3 mb-2">
                  Therapist accounts are created by the admin. Use the credentials provided to you.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="therapist-email">Email</Label>
                  <Input
                    id="therapist-email"
                    type="email"
                    placeholder="therapist@mindbridge.com"
                    value={therapistForm.email}
                    onChange={(e) => setTherapistForm({ ...therapistForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapist-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="therapist-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={therapistForm.password}
                      onChange={(e) => setTherapistForm({ ...therapistForm, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full">Sign In as Therapist</Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3 mb-2">
                  Administrator access only. Use your admin credentials.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input id="admin-email" type="email" placeholder="admin@mindbridge.com"
                    value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Input id="admin-password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                      value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full">Sign In as Admin</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-primary transition-colors">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
