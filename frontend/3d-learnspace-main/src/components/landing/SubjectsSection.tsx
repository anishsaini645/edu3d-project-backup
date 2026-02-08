import { motion } from 'framer-motion';
import { 
  FlaskConical, 
  Calculator, 
  Heart, 
  Cpu, 
  Palette,
  Atom,
  Globe2,
  Building
} from 'lucide-react';

const subjects = [
  {
    icon: FlaskConical,
    name: 'Chemistry',
    models: 120,
    description: 'Molecules, compounds, reactions',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Atom,
    name: 'Physics',
    models: 95,
    description: 'Forces, waves, quantum mechanics',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Heart,
    name: 'Biology & Medical',
    models: 150,
    description: 'Anatomy, cells, organs',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: Calculator,
    name: 'Mathematics',
    models: 80,
    description: 'Geometry, graphs, functions',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Cpu,
    name: 'Engineering',
    models: 110,
    description: 'Machines, circuits, structures',
    gradient: 'from-slate-500 to-zinc-600',
  },
  {
    icon: Palette,
    name: 'Art & Design',
    models: 65,
    description: 'Sculptures, architecture, crafts',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    icon: Globe2,
    name: 'Geography',
    models: 45,
    description: 'Terrains, maps, ecosystems',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Building,
    name: 'History',
    models: 70,
    description: 'Monuments, artifacts, civilizations',
    gradient: 'from-amber-600 to-yellow-600',
  },
];

export function SubjectsSection() {
  return (
    <section id="subjects" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-display-md font-bold mb-4">
            Explore <span className="gradient-text">Every Subject</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From molecular chemistry to ancient monuments, our library covers 
            curriculum-aligned 3D models across all major disciplines.
          </p>
        </motion.div>

        {/* Subjects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="glass rounded-2xl p-6 hover-lift cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <subject.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-1">{subject.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{subject.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary">{subject.models} models</span>
                <span className="ar-badge">AR Ready</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
