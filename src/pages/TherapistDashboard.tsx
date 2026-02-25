import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Stethoscope, Video, MapPin, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { API_URL } from "@/contexts/AuthContext";

interface Session {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  therapist_id: string;
  type: string;
  time_slot: string;
  status: string;
  meeting_link: string | null;
}

const TherapistDashboard = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSessions = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) { setLoading(false); return; }
    const user = JSON.parse(userStr);
    const res = await fetch(`${API_URL}/api/sessions/therapist?therapistId=${encodeURIComponent(user.id)}`);
    const data = await res.json();
    setSessions(data.sessions || []);
    setLoading(false);
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleSaveLink = async (sessionId: string) => {
    const link = linkInputs[sessionId];
    if (!link) return;
    setSavingId(sessionId);
    try {
      const res = await fetch(`${API_URL}/api/sessions/${sessionId}/meeting-link`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingLink: link }),
      });
      if (res.ok) {
        toast({ title: "✅ Link Saved", description: "Student will now see the Teams join link." });
        fetchSessions();
        setLinkInputs((prev) => { const n = { ...prev }; delete n[sessionId]; return n; });
      } else {
        toast({ title: "Error", description: "Could not save link.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to connect to server.", variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  };

  const virtualSessions = sessions.filter(s => s.type === "VIRTUAL");
  const inPersonSessions = sessions.filter(s => s.type === "IN-PERSON");

  const getStatusColor = (status: string) => {
    if (status === "CONFIRMED") return "text-green-500 bg-green-500/10";
    if (status === "CANCELLED") return "text-destructive bg-destructive/10";
    return "text-yellow-500 bg-yellow-500/10";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <Stethoscope className="h-7 w-7 text-primary" />
                <h1 className="font-display text-3xl font-bold text-foreground">Therapist Dashboard</h1>
              </div>
              <p className="text-muted-foreground mb-8">View your sessions and add Microsoft Teams meeting links for virtual sessions.</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: Calendar, label: "Total Sessions", value: sessions.length },
                { icon: Video, label: "Virtual", value: virtualSessions.length },
                { icon: MapPin, label: "In-Person", value: inPersonSessions.length },
              ].map((stat) => (
                <div key={stat.label} className="p-5 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Virtual Sessions — with Teams link management */}
            <div className="mb-10">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Virtual Sessions
                <span className="text-xs font-normal text-muted-foreground ml-1">— add Microsoft Teams link for each</span>
              </h2>

              {loading && <p className="text-muted-foreground text-sm">Loading...</p>}

              {!loading && virtualSessions.length === 0 && (
                <p className="text-sm text-muted-foreground">No virtual sessions booked yet.</p>
              )}

              <div className="space-y-4">
                {virtualSessions.map((s, i) => {
                  const [date, ...timeParts] = s.time_slot.split(" ");
                  const time = timeParts.join(" ");
                  const d = new Date(date);
                  const dateStr = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

                  return (
                    <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="p-5 rounded-2xl bg-card border border-border space-y-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="font-semibold text-foreground">{s.student_name || s.student_email || "Student"}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {dateStr}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {time}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(s.status)}`}>
                          {s.status}
                        </span>
                      </div>

                      {/* Teams link section */}
                      {s.meeting_link ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-0.5">Teams link set</p>
                            <p className="text-xs text-muted-foreground truncate">{s.meeting_link}</p>
                          </div>
                          <button
                            onClick={() => setLinkInputs(p => ({ ...p, [s.id]: s.meeting_link || "" }))}
                            className="text-xs text-primary hover:underline shrink-0"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mb-2 flex items-center gap-1">
                            <LinkIcon className="h-3.5 w-3.5" /> No Teams link added yet — student is waiting
                          </p>
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://teams.microsoft.com/l/meetup-join/..."
                              value={linkInputs[s.id] || ""}
                              onChange={(e) => setLinkInputs(p => ({ ...p, [s.id]: e.target.value }))}
                              className="text-xs h-8"
                            />
                            <Button size="sm" onClick={() => handleSaveLink(s.id)} disabled={savingId === s.id || !linkInputs[s.id]}>
                              {savingId === s.id ? "Saving..." : "Save"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Show change input when editing existing link */}
                      {s.meeting_link && linkInputs[s.id] !== undefined && (
                        <div className="flex gap-2 mt-1">
                          <Input
                            placeholder="https://teams.microsoft.com/l/meetup-join/..."
                            value={linkInputs[s.id]}
                            onChange={(e) => setLinkInputs(p => ({ ...p, [s.id]: e.target.value }))}
                            className="text-xs h-8"
                          />
                          <Button size="sm" onClick={() => handleSaveLink(s.id)} disabled={savingId === s.id}>
                            {savingId === s.id ? "Saving..." : "Update"}
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* In-Person Sessions */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                In-Person Sessions
              </h2>
              {!loading && inPersonSessions.length === 0 && (
                <p className="text-sm text-muted-foreground">No in-person sessions booked yet.</p>
              )}
              <div className="space-y-3">
                {inPersonSessions.map((s, i) => {
                  const [date, ...timeParts] = s.time_slot.split(" ");
                  const time = timeParts.join(" ");
                  const d = new Date(date);
                  const dateStr = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
                  return (
                    <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="p-4 rounded-xl bg-card border border-border flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="font-medium text-foreground">{s.student_name || s.student_email || "Student"}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {dateStr}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {time}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">In-Person</Badge>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TherapistDashboard;
