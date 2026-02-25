import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Video, MapPin, CheckCircle2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface Therapist {
  id: string;
  name: string;
  specialty: string;
}

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

// Generate next 7 days as selectable days
function getNextDays(count = 7) {
  const days = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label = `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]}`;
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({ label, value });
  }
  return days;
}

const days = getNextDays(7);

const BookSession = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loadingTherapists, setLoadingTherapists] = useState(true);
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
  const [sessionType, setSessionType] = useState<"virtual" | "in-person" | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  // Fetch approved therapists from backend
  useEffect(() => {
    fetch(`${API_URL}/api/sessions/therapists`)
      .then((r) => r.json())
      .then((data) => {
        setTherapists(Array.isArray(data) ? data : []);
        setLoadingTherapists(false);
      })
      .catch(() => setLoadingTherapists(false));
  }, []);

  // Fetch booked slots whenever therapist + day changes
  useEffect(() => {
    if (selectedTherapist === null || !selectedDay) return;
    const therapistId = therapists[selectedTherapist].id;
    fetch(`${API_URL}/api/sessions/slots?therapistId=${therapistId}&day=${selectedDay}`)
      .then((r) => r.json())
      .then((data) => setBookedSlots(data.bookedSlots || []))
      .catch(() => setBookedSlots([]));
  }, [selectedTherapist, selectedDay]);

  // Reset downstream selections when therapist changes
  const handleSelectTherapist = (i: number) => {
    setSelectedTherapist(i);
    setSessionType(null);
    setSelectedDay(null);
    setSelectedTime(null);
    setBookedSlots([]);
  };

  // Reset day + time when session type changes
  const handleSelectSessionType = (type: "virtual" | "in-person") => {
    setSessionType(type);
    setSelectedDay(null);
    setSelectedTime(null);
    setBookedSlots([]);
  };

  const handleConfirmBooking = async () => {
    if (selectedTherapist === null || !sessionType || !selectedDay || !selectedTime) return;
    setIsBooking(true);
    try {
      const userStr = localStorage.getItem("user");
      const studentId = userStr ? JSON.parse(userStr).id : "anonymous";
      const therapist = therapists[selectedTherapist];
      const timeSlotFull = `${selectedDay} ${selectedTime}`;

      const response = await fetch(`${API_URL}/api/sessions/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          therapistId: therapist.id,
          type: sessionType,
          timeSlot: timeSlotFull,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast({ title: "Booking Failed", description: data.error || "An error occurred.", variant: "destructive" });
      } else {
        toast({
          title: "Session Booked! 🎉",
          description: `Your ${sessionType === "virtual" ? "Virtual" : "In-Person"} session with ${therapist.name} on ${days.find(d => d.value === selectedDay)?.label} at ${selectedTime} is confirmed.`,
        });
        // Mark slot as booked locally
        setBookedSlots((prev) => [...prev, selectedTime]);
        setSelectedTime(null);
      }
    } catch {
      toast({ title: "Error", description: "Failed to connect to the server.", variant: "destructive" });
    } finally {
      setIsBooking(false);
    }
  };

  const fadeSlide = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Book a Therapy Session
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                Schedule a confidential session with one of our licensed therapists.
              </p>
              <Link
                to="/my-sessions"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors border border-primary/20"
              >
                <CalendarDays className="h-4 w-4" />
                View My Sessions
              </Link>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-12">
              {/* Step 1: Choose therapist */}
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Step 1 — Choose a Therapist
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {therapists.map((t, i) => (
                    <motion.button
                      key={t.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleSelectTherapist(i)}
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 ${selectedTherapist === i
                        ? "border-primary bg-secondary shadow-glow-primary"
                        : "border-border bg-card hover:border-primary/50"
                        }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-semibold text-lg mb-4">
                        {t.image}
                      </div>
                      <h3 className="font-display font-semibold text-foreground">{t.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{t.specialty}</p>
                      <p className="text-xs text-primary mt-2 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {t.available}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Step 2: Session type */}
              <AnimatePresence>
                {selectedTherapist !== null && (
                  <motion.div key="session-type" {...fadeSlide} className="overflow-hidden">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      Step 2 — Select Session Type
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { type: "virtual" as const, icon: <Video className="h-6 w-6" />, label: "Virtual Session", desc: "Connect from anywhere via secure video call." },
                        { type: "in-person" as const, icon: <MapPin className="h-6 w-6" />, label: "One-on-One Session", desc: "Meet your therapist in person at our local clinic." },
                      ].map(({ type, icon, label, desc }) => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectSessionType(type)}
                          className={`p-6 rounded-2xl border text-left transition-all duration-300 flex items-start gap-4 ${sessionType === type
                            ? "border-primary bg-secondary shadow-glow-primary"
                            : "border-border bg-card hover:border-primary/50"
                            }`}
                        >
                          <div className={`p-3 rounded-full ${sessionType === type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            {icon}
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-foreground text-lg">{label}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 3: Choose day */}
              <AnimatePresence>
                {sessionType !== null && (
                  <motion.div key="day-picker" {...fadeSlide}>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Step 3 — Select a Day
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {days.map((day) => (
                        <button
                          key={day.value}
                          onClick={() => { setSelectedDay(day.value); setSelectedTime(null); }}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${selectedDay === day.value
                            ? "bg-primary text-primary-foreground border-primary shadow-glow-primary"
                            : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
                            }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 4: Choose time */}
              <AnimatePresence>
                {selectedDay !== null && (
                  <motion.div key="time-picker" {...fadeSlide}>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Step 4 — Select a Time Slot
                    </h2>
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary inline-block" />Available</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-destructive inline-block" />Already Booked</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {timeSlots.map((time) => {
                        const isBooked = bookedSlots.includes(time);
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => !isBooked && setSelectedTime(time)}
                            disabled={isBooked}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${isBooked
                              ? "bg-destructive/20 text-destructive border border-destructive/40 cursor-not-allowed"
                              : isSelected
                                ? "bg-primary text-primary-foreground shadow-glow-primary"
                                : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                              }`}
                          >
                            {time} {isBooked ? "✗" : ""}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 5: Confirm */}
              <AnimatePresence>
                {selectedTime && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-card-gradient rounded-2xl border border-border p-8"
                  >
                    <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Confirm Your Session
                    </h2>
                    <div className="space-y-3 text-sm text-muted-foreground mb-8 p-4 bg-background/50 rounded-xl border border-border/50">
                      <p className="flex items-center gap-2"><span className="text-foreground flex w-24">Therapist:</span> <span className="font-medium text-foreground">{selectedTherapist !== null ? therapists[selectedTherapist].name : ""}</span></p>
                      <p className="flex items-center gap-2"><span className="text-foreground flex w-24">Type:</span> <span className="font-medium text-foreground">{sessionType === "virtual" ? "Virtual (Video Call)" : "In-Person (Clinic)"}</span></p>
                      <p className="flex items-center gap-2"><span className="text-foreground flex w-24">Day:</span> <span className="font-medium text-foreground">{days.find(d => d.value === selectedDay)?.label}</span></p>
                      <p className="flex items-center gap-2"><span className="text-foreground flex w-24">Time:</span> <span className="font-medium text-foreground">{selectedTime}</span></p>
                      <p className="flex items-center gap-2"><span className="text-foreground flex w-24">Duration:</span> <span className="font-medium text-foreground">50 minutes</span></p>
                    </div>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto shadow-glow-primary"
                      onClick={handleConfirmBooking}
                      disabled={isBooking}
                    >
                      {isBooking ? "Booking..." : "Confirm Booking"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BookSession;
