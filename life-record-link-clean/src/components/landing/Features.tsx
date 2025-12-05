import { motion } from 'framer-motion';
import { Database, ScanLine, Sparkles, Share2, Clock, Bell } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'Digital Lifetime Record',
    description: 'From birth to aged care, keep every prescription and report permanently stored.',
    color: 'from-primary to-secondary',
  },
  {
    icon: ScanLine,
    title: 'Smart Scan & Upload',
    description: 'Instantly digitize handwritten notes and physical reports with your camera.',
    color: 'from-secondary to-accent',
  },
  {
    icon: Sparkles,
    title: 'AI Medical Summaries',
    description: 'AI condenses complex histories into quick, readable summaries for your doctor.',
    color: 'from-accent to-primary',
  },
  {
    icon: Share2,
    title: 'Secure Doctor Access',
    description: 'Grant temporary access to specific doctors with one-click sharing controls.',
    color: 'from-primary to-accent',
  },
  {
    icon: Clock,
    title: 'Timeline View',
    description: 'Visual chronological timeline of your complete medical history at a glance.',
    color: 'from-secondary to-primary',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss medications, checkups, or vaccination schedules with smart alerts.',
    color: 'from-accent to-secondary',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const Features = () => {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need for{' '}
            <span className="gradient-text">better health management</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to give you complete control over your medical information.
          </p>
        </motion.div>
        
        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="glass-card-solid p-8 hover-lift group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
