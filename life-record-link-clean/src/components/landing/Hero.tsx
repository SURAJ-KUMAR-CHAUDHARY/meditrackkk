import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Activity, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const floatingCards = [
  { icon: FileText, label: 'Medical Records', delay: 0 },
  { icon: Activity, label: 'Health Analytics', delay: 0.2 },
  { icon: Lock, label: 'Secure Access', delay: 0.4 },
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 medical-grid opacity-30" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">HIPAA Compliant & Secure</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Your Entire Medical History.{' '}
              <span className="gradient-text">One Secure Place.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-xl">
              Stop carrying files. MediTrack centralizes your prescriptions, reports, 
              and history for better diagnosis and faster treatment.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/auth">
                <Button variant="hero" size="xl">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/auth?role=doctor">
                <Button variant="hero-outline" size="xl">
                  For Doctors
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-12 mt-16"
            >
              {[
                { value: '50K+', label: 'Patients' },
                { value: '2K+', label: 'Doctors' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Right floating cards */}
          <div className="relative h-[500px] hidden lg:block">
            {floatingCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: card.delay + 0.4, duration: 0.6 }}
                className={`absolute glass-card p-6 hover-lift cursor-pointer ${
                  index === 0 ? 'top-0 right-0 w-64' :
                  index === 1 ? 'top-32 left-0 w-72' :
                  'bottom-20 right-10 w-60'
                }`}
                style={{
                  animation: `float ${6 + index}s ease-in-out infinite ${index * 0.5}s`
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                    <card.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">{card.label}</div>
                    <div className="text-sm text-muted-foreground">Encrypted</div>
                  </div>
                </div>
                
                {/* Mock content lines */}
                <div className="mt-4 space-y-2">
                  <div className="h-2 bg-muted rounded-full w-full" />
                  <div className="h-2 bg-muted rounded-full w-3/4" />
                  <div className="h-2 bg-muted rounded-full w-1/2" />
                </div>
              </motion.div>
            ))}
            
            {/* Central shield icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-24 h-24 rounded-3xl gradient-bg flex items-center justify-center shadow-2xl shadow-primary/40">
                <Shield className="w-12 h-12 text-primary-foreground" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
