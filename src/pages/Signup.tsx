import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/contexts/AuthContext";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    universityId: "",
    password: "",
    confirmPassword: "",
  });
  const [therapistForm, setTherapistForm] = useState({
    name: "",
    email: "",
    specialty: "",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentForm.password !== studentForm.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/signup/student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentForm.name,
          email: studentForm.email,
          universityId: studentForm.universityId,
          password: studentForm.password
        })
      });
      const data = await response.json();

      if (!response.ok) {
        toast({ title: "Signup Failed", description: data.error || "An error occurred.", variant: "destructive" });
        return;
      }

      toast({ title: "Account Created", description: "Your student account has been successfully created. Please login." });
      navigate("/login");
    } catch (err) {
      toast({ title: "Error", description: "Failed to connect to the server.", variant: "destructive" });
    }
  };

  const handleTherapistSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (therapistForm.password !== therapistForm.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/signup/therapist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: therapistForm.name,
          email: therapistForm.email,
          specialty: therapistForm.specialty,
          password: therapistForm.password
        })
      });
      const data = await response.json();

      if (!response.ok) {
        toast({ title: "Application Failed", description: data.error || "An error occurred.", variant: "destructive" });
        return;
      }

      toast({
        title: "Application Submitted",
        description: "Your therapist account requires admin approval. We will notify you once approved."
      });
      navigate("/");
    } catch (err) {
      toast({ title: "Error", description: "Failed to connect to the server.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
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
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join as a student to access mental health support</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-glow-primary">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="therapist">Therapist</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleStudentSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Full Name</Label>
                  <Input
                    id="student-name"
                    placeholder="John Doe"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email">University Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="ID@kluniversity.in"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="universityId">University ID</Label>
                  <Input
                    id="universityId"
                    placeholder=""
                    value={studentForm.universityId}
                    onChange={(e) => setStudentForm({ ...studentForm, universityId: e.target.value })}
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
                <div className="space-y-2">
                  <Label htmlFor="student-confirm-password">Confirm Password</Label>
                  <Input
                    id="student-confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={studentForm.confirmPassword}
                    onChange={(e) => setStudentForm({ ...studentForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Create Student Account</Button>
              </form>
            </TabsContent>

            <TabsContent value="therapist">
              <form onSubmit={handleTherapistSignup} className="space-y-4">
                <div className="bg-secondary/50 p-4 rounded-lg mb-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Notice:</p>
                  Therapist accounts are subject to verification. After signing up, an administrator will review your application. You will not be able to log in until your account is approved.
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapist-name">Full Name with Title</Label>
                  <Input
                    id="therapist-name"
                    placeholder="Dr. Jane Smith"
                    value={therapistForm.name}
                    onChange={(e) => setTherapistForm({ ...therapistForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapist-email">Professional Email</Label>
                  <Input
                    id="therapist-email"
                    type="email"
                    placeholder="jane.smith@kluniversity.in"
                    value={therapistForm.email}
                    onChange={(e) => setTherapistForm({ ...therapistForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Primary Specialty</Label>
                  <Input
                    id="specialty"
                    placeholder="e.g., Anxiety, Relationships, Depression"
                    value={therapistForm.specialty}
                    onChange={(e) => setTherapistForm({ ...therapistForm, specialty: e.target.value })}
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
                <div className="space-y-2">
                  <Label htmlFor="therapist-confirm-password">Confirm Password</Label>
                  <Input
                    id="therapist-confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={therapistForm.confirmPassword}
                    onChange={(e) => setTherapistForm({ ...therapistForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Apply as Therapist</Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-primary transition-colors">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
