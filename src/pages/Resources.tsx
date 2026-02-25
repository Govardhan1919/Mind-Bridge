import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, Brain, Heart, Headphones, Leaf, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = [
  { label: "All", value: "all" },
  { label: "Anxiety", value: "anxiety" },
  { label: "Depression", value: "depression" },
  { label: "Stress", value: "stress" },
  { label: "Mindfulness", value: "mindfulness" },
  { label: "Self-Care", value: "self-care" },
];

const resources = [
  {
    icon: Brain,
    title: "Understanding Anxiety",
    description: "Learn about anxiety triggers and evidence-based coping strategies to manage daily stress.",
    category: "Anxiety",
    type: "Article",
  },
  {
    icon: Headphones,
    title: "Guided Sleep Meditation",
    description: "A 20-minute guided meditation designed to help you unwind and fall asleep peacefully.",
    category: "Mindfulness",
    type: "Audio",
  },
  {
    icon: Heart,
    title: "Building Healthy Relationships",
    description: "Tips for setting boundaries and nurturing supportive connections in college life.",
    category: "Self-Care",
    type: "Article",
  },
  {
    icon: Leaf,
    title: "Breathing Exercises",
    description: "Simple box-breathing and 4-7-8 techniques to calm your nervous system in minutes.",
    category: "Stress",
    type: "Exercise",
  },
  {
    icon: Sun,
    title: "Morning Routine for Mental Health",
    description: "Start your day with intention using this research-backed morning wellness routine.",
    category: "Self-Care",
    type: "Guide",
  },
  {
    icon: BookOpen,
    title: "Recognizing Depression",
    description: "Understanding the signs and when to seek professional help. You deserve support.",
    category: "Depression",
    type: "Article",
  },
];

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Self-Help Resources
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Curated articles, exercises, and guides to support your mental health journey.
              </p>
            </motion.div>

            {/* Category filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Resource cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {resources.map((resource, i) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:shadow-glow-primary transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <resource.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">{resource.type}</Badge>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{resource.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{resource.description}</p>
                  <span className="text-xs text-primary font-medium">{resource.category}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
