import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { API_URL } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Video, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Session {
    id: string;
    therapist_id: string;
    therapist_name: string;
    type: string;
    time_slot: string;
    status: string;
    meeting_link: string | null;
}

const MySessions = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) { setLoading(false); return; }
        const user = JSON.parse(userStr);

        fetch(`${API_URL}/api/sessions/my?studentId=${user.id}`)
            .then((r) => r.json())
            .then((data) => {
                setSessions(data.sessions || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getStatusColor = (status: string) => {
        if (status === "CONFIRMED") return "text-green-500 bg-green-500/10";
        if (status === "CANCELLED") return "text-destructive bg-destructive/10";
        return "text-yellow-500 bg-yellow-500/10";
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                        <h1 className="font-display text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                            <CalendarDays className="h-8 w-8 text-primary" />
                            My Sessions
                        </h1>
                        <p className="text-muted-foreground">All your upcoming and past therapy sessions.</p>
                    </motion.div>

                    {loading ? (
                        <p className="text-muted-foreground">Loading sessions...</p>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-20 rounded-2xl border border-dashed border-border">
                            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-medium text-foreground mb-2">No sessions yet</p>
                            <p className="text-muted-foreground text-sm mb-6">
                                Book your first therapy session to get started.
                            </p>
                            <Link to="/book-session">
                                <Button>Book a Session</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sessions.map((session, i) => {
                                const [date, ...timeParts] = session.time_slot.split(" ");
                                const time = timeParts.join(" ");
                                const d = new Date(date);
                                const dateStr = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
                                const isVirtual = session.type === "VIRTUAL";

                                return (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        className="bg-card rounded-2xl border border-border p-6 space-y-4"
                                    >
                                        {/* Session info row */}
                                        <div className="flex items-start justify-between gap-4 flex-wrap">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-foreground font-semibold">
                                                    {isVirtual
                                                        ? <Video className="h-4 w-4 text-primary" />
                                                        : <MapPin className="h-4 w-4 text-primary" />}
                                                    {isVirtual ? "Virtual Session" : "In-Person Session"}
                                                </div>
                                                <p className="text-sm text-muted-foreground">With: <span className="text-foreground">{session.therapist_name || session.therapist_id}</span></p>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {dateStr}</span>
                                                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {time}</span>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusColor(session.status)}`}>
                                                {session.status}
                                            </span>
                                        </div>

                                        {/* Teams Join Link — only for virtual sessions */}
                                        {isVirtual && (
                                            session.meeting_link ? (
                                                <a
                                                    href={session.meeting_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 w-full p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors group"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                                        {/* Microsoft Teams icon */}
                                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M20.625 6h-4.125v12h4.125A1.875 1.875 0 0 0 22.5 16.125V7.875A1.875 1.875 0 0 0 20.625 6z" />
                                                            <path d="M12 2.25a3.375 3.375 0 1 1 0 6.75 3.375 3.375 0 0 1 0-6.75zm6 6H6.375A2.625 2.625 0 0 0 3.75 10.875v6.375A2.625 2.625 0 0 0 6.375 19.875h11.25A2.625 2.625 0 0 0 20.25 17.25v-6.375A2.625 2.625 0 0 0 18 8.25z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Join Microsoft Teams Meeting</p>
                                                        <p className="text-xs text-muted-foreground truncate">{session.meeting_link}</p>
                                                    </div>
                                                    <ExternalLink className="h-4 w-4 text-blue-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                                                        <Clock className="h-4 w-4 text-yellow-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Awaiting Teams Link</p>
                                                        <p className="text-xs text-muted-foreground">Your therapist will add the meeting link soon.</p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MySessions;
