import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Trash2, Users, Calendar, Shield, Activity, CheckCircle2, Clock, Video, MapPin } from "lucide-react";
import { API_URL } from "@/contexts/AuthContext";

type Tab = "therapists" | "students" | "activity";

interface Therapist {
  id: string;
  name: string;
  email: string;
  specialty: string;
  is_approved: boolean;
  created_at: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  university_id: string;
  created_at: string;
}

interface SessionActivity {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  therapist_id: string;
  type: string;
  time_slot: string;
  status: string;
  created_at: string;
}

interface Stats {
  therapists: number;
  students: number;
  sessions: number;
  pendingApprovals: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("therapists");
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [activity, setActivity] = useState<SessionActivity[]>([]);
  const [stats, setStats] = useState<Stats>({ therapists: 0, students: 0, sessions: 0, pendingApprovals: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTherapist, setNewTherapist] = useState({ name: "", email: "", specialty: "", password: "" });
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const fetchAll = async () => {
    try {
      const [statsRes, therapistsRes, studentsRes, activityRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`),
        fetch(`${API_URL}/api/admin/therapists`),
        fetch(`${API_URL}/api/admin/students`),
        fetch(`${API_URL}/api/admin/activity`),
      ]);
      const [statsData, therapistsData, studentsData, activityData] = await Promise.all([
        statsRes.json(), therapistsRes.json(), studentsRes.json(), activityRes.json(),
      ]);
      setStats(statsData);
      setTherapists(therapistsData.therapists || []);
      setStudents(studentsData.students || []);
      setActivity(activityData.activity || []);
    } catch {
      toast({ title: "Error", description: "Failed to load data from server.", variant: "destructive" });
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAddTherapist = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/therapists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTherapist),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      } else {
        toast({ title: "Therapist Added ✅", description: `${newTherapist.name} has been added and approved.` });
        setNewTherapist({ name: "", email: "", specialty: "", password: "" });
        setShowAddForm(false);
        fetchAll();
      }
    } catch {
      toast({ title: "Error", description: "Failed to connect to server.", variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleApprove = async (id: string, name: string) => {
    try {
      await fetch(`${API_URL}/api/admin/therapists/${id}/approve`, { method: "PATCH" });
      toast({ title: "Approved ✅", description: `${name} is now approved to practice.` });
      fetchAll();
    } catch {
      toast({ title: "Error", description: "Failed to approve.", variant: "destructive" });
    }
  };

  const handleRemove = async (id: string, name: string) => {
    try {
      await fetch(`${API_URL}/api/admin/therapists/${id}`, { method: "DELETE" });
      toast({ title: "Removed", description: `${name} has been removed.` });
      fetchAll();
    } catch {
      toast({ title: "Error", description: "Failed to remove.", variant: "destructive" });
    }
  };

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "therapists", label: "Therapists", icon: UserPlus },
    { id: "students", label: "Students", icon: Users },
    { id: "activity", label: "Session Activity", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-7 w-7 text-primary" />
                <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground mb-8">Manage therapists, monitor student activity, and oversee sessions.</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { icon: UserPlus, label: "Therapists", value: stats.therapists },
                { icon: Users, label: "Students", value: stats.students },
                { icon: Calendar, label: "Sessions", value: stats.sessions },
                { icon: Clock, label: "Pending Approvals", value: stats.pendingApprovals },
              ].map((stat) => (
                <div key={stat.label} className="p-5 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Therapists Tab ── */}
            {activeTab === "therapists" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-xl font-semibold text-foreground">Manage Therapists</h2>
                  <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Therapist
                  </Button>
                </div>

                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-6 rounded-2xl bg-card border border-primary/30 mb-6"
                  >
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Add New Therapist</h3>
                    <form onSubmit={handleAddTherapist} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="t-name">Full Name</Label>
                        <Input id="t-name" placeholder="Dr. Jane Smith" value={newTherapist.name}
                          onChange={(e) => setNewTherapist({ ...newTherapist, name: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="t-email">Email</Label>
                        <Input id="t-email" type="email" placeholder="jane@mindbridge.com" value={newTherapist.email}
                          onChange={(e) => setNewTherapist({ ...newTherapist, email: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="t-specialty">Specialty</Label>
                        <Input id="t-specialty" placeholder="Anxiety & Depression" value={newTherapist.specialty}
                          onChange={(e) => setNewTherapist({ ...newTherapist, specialty: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="t-password">Initial Password</Label>
                        <Input id="t-password" type="password" placeholder="••••••••" value={newTherapist.password}
                          onChange={(e) => setNewTherapist({ ...newTherapist, password: e.target.value })} required />
                      </div>
                      <div className="md:col-span-2 flex gap-3">
                        <Button type="submit" disabled={adding}>{adding ? "Creating..." : "Create Therapist Account"}</Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Pending Applications */}
                {therapists.filter(t => !t.is_approved).length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Pending Applications
                      </span>
                      <span className="text-xs font-bold bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                        {therapists.filter(t => !t.is_approved).length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {therapists.filter(t => !t.is_approved).map((t) => (
                        <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/30 flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground">{t.name}</span>
                              <Badge variant="secondary" className="text-yellow-600 bg-yellow-500/15">Awaiting Approval</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{t.email} · {t.specialty}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Applied: {new Date(t.created_at).toLocaleDateString("en-IN")}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApprove(t.id, t.name)}
                              className="bg-green-600 hover:bg-green-700 text-white">
                              <CheckCircle2 className="h-4 w-4 mr-1" /> Accept
                            </Button>
                            <Button size="sm" variant="outline"
                              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleRemove(t.id, t.name)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved Therapists */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Approved Therapists</p>
                  <div className="space-y-3">
                    {therapists.filter(t => t.is_approved).length === 0 && (
                      <p className="text-muted-foreground text-sm">No approved therapists yet.</p>
                    )}
                    {therapists.filter(t => t.is_approved).map((t) => (
                      <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="p-4 rounded-xl bg-card border border-border flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{t.name}</span>
                            <Badge variant="default">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{t.email} · {t.specialty}</p>
                        </div>
                        <Button size="sm" variant="outline"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleRemove(t.id, t.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Students Tab ── */}
            {activeTab === "students" && (
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-5">Registered Students</h2>
                <div className="space-y-3">
                  {students.length === 0 && <p className="text-muted-foreground text-sm">No students registered yet.</p>}
                  {students.map((s, i) => (
                    <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                        {s.name?.[0] || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.email} · ID: {s.university_id || "—"}</p>
                      </div>
                      <p className="text-xs text-muted-foreground shrink-0">
                        {new Date(s.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Activity Tab ── */}
            {activeTab === "activity" && (
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-5">Session Activity</h2>
                <div className="space-y-3">
                  {activity.length === 0 && <p className="text-muted-foreground text-sm">No sessions booked yet.</p>}
                  {activity.map((a, i) => {
                    const statusColor =
                      a.status === "CONFIRMED" ? "text-green-500 bg-green-500/10" :
                        a.status === "CANCELLED" ? "text-destructive bg-destructive/10" :
                          "text-yellow-500 bg-yellow-500/10";
                    return (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="p-4 rounded-xl bg-card border border-border flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${a.type === "VIRTUAL" ? "bg-blue-500/10 text-blue-500" : "bg-orange-500/10 text-orange-500"}`}>
                            {a.type === "VIRTUAL" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {a.student_name || a.student_email || a.student_id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              With: {a.therapist_id} · {a.time_slot}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusColor}`}>
                          {a.status}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
