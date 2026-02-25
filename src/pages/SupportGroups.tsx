import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, MessageCircle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const groups = [
  {
    title: "Anxiety Support Circle",
    description: "A safe space to share experiences with anxiety and learn coping strategies together.",
    members: 24,
    nextSession: "Every Monday, 6 PM",
    tags: ["Anxiety", "Coping Skills"],
  },
  {
    title: "First-Year Transitions",
    description: "For freshmen navigating the challenges of college life, homesickness, and new environments.",
    members: 32,
    nextSession: "Every Wednesday, 5 PM",
    tags: ["Adjustment", "Community"],
  },
  {
    title: "Stress & Burnout Recovery",
    description: "Discuss academic pressure, perfectionism, and sustainable strategies for balance.",
    members: 18,
    nextSession: "Every Thursday, 7 PM",
    tags: ["Stress", "Academic"],
  },
  {
    title: "Mindfulness & Meditation",
    description: "Weekly guided meditation sessions followed by open discussion about mindfulness practice.",
    members: 40,
    nextSession: "Every Friday, 4 PM",
    tags: ["Mindfulness", "Meditation"],
  },
];

const forumPosts = [
  { author: "Anonymous", time: "2h ago", content: "Does anyone else struggle with Sunday anxiety before the week starts? Any tips?", replies: 12 },
  { author: "Anonymous", time: "5h ago", content: "Just completed my first therapy session. It was scary but so worth it. Don't hesitate to try!", replies: 24 },
  { author: "Anonymous", time: "1d ago", content: "Looking for accountability partners for daily meditation. Anyone interested?", replies: 8 },
];

const SupportGroups = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Support Groups
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Connect with peers in moderated group sessions. Everything shared here stays here.
              </p>
            </motion.div>

            {/* Groups */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
              {groups.map((group, i) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:shadow-glow-primary transition-all duration-300"
                >
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{group.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {group.members} members</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {group.nextSession}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Join <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Peer Forum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                Peer Forum
              </h2>
              <div className="space-y-4">
                {forumPosts.map((post, i) => (
                  <div key={i} className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                    <p className="text-foreground text-sm mb-3">{post.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.author} · {post.time}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {post.replies} replies</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SupportGroups;
