import { motion } from 'framer-motion';
import { 
  Rotate3D, 
  Users, 
  Trophy, 
  Smartphone, 
  Brain, 
  Globe,
  Zap,
  Shield
} from 'lucide-react';

const features = [
  {
    icon: Rotate3D,
    title: 'Interactive 3D Models',
    description: 'Rotate, zoom, and explode complex models. Add labels and annotations for deeper understanding.',
    color: 'from-primary to-accent',
  },
  {
    icon: Smartphone,
    title: 'AR-Ready Experiences',
    description: 'View models in augmented reality. Bring learning to life in your physical space.',
    color: 'from-secondary to-primary',
  },
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Learn together with classmates. Share annotations and work on models simultaneously.',
    color: 'from-accent to-secondary',
  },
  {
    icon: Trophy,
    title: 'Gamified Learning',
    description: 'Earn XP points, collect badges, and climb leaderboards as you master concepts.',
    color: 'from-primary to-secondary',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Get personalized learning paths and intelligent recommendations based on your progress.',
    color: 'from-secondary to-accent',
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description: 'Learn in your preferred language with support for multiple Indian and global languages.',
    color: 'from-accent to-primary',
  },
  {
    icon: Zap,
    title: 'Optimized Performance',
    description: 'Smooth experience on any device, including low-end computers and tablets.',
    color: 'from-primary to-accent',
  },
  {
    icon: Shield,
    title: 'Accessible Design',
    description: 'Keyboard navigation, screen reader support, and high-contrast modes for everyone.',
    color: 'from-secondary to-accent',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 gradient-glow opacity-30 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-display-md font-bold mb-4">
            Why <span className="gradient-text">3D Learning</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Traditional textbooks can only show you pictures. With 3D models, you can explore, 
            interact, and truly understand complex concepts.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl p-6 hover-lift group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
