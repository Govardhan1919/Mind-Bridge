import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
            Your mental health matters
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            A safe space for your{" "}
            <span className="text-gradient">mental well-being</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Access professional counseling, self-help resources, and connect with peers who understand. You're not alone on this journey.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="shadow-glow-primary">
              <Link to="/book-session">
                Book a Session <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/resources">Explore Resources</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: BookOpen,
    title: "Self-Help Resources",
    description: "Articles, guided meditations, and exercises curated by mental health professionals.",
    link: "/resources",
  },
  {
    icon: Calendar,
    title: "Virtual Therapy",
    description: "Schedule confidential one-on-one sessions with licensed therapists.",
    link: "/book-session",
  },
  {
    icon: Users,
    title: "Peer Support Groups",
    description: "Join moderated forums and group sessions with students who understand.",
    link: "/support-groups",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How we support you
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Comprehensive tools and services designed to support every step of your mental health journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link
                to={feature.link}
                className="block p-8 rounded-2xl bg-background border border-border hover:shadow-glow-primary transition-all duration-300 group h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center bg-card-gradient rounded-3xl p-12 md:p-16 border border-border"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to take the first step?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Whether you need someone to talk to or resources to explore on your own, we're here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="shadow-glow-primary">
              <Link to="/book-session">
                Schedule Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
