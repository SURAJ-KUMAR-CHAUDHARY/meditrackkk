import { motion } from 'framer-motion';
import { FileText, Pill, Activity, Syringe, Stethoscope, HeartPulse, Calendar, Building } from 'lucide-react';
import { mockMedicalEvents, MedicalEvent } from '@/data/mockData';

const getEventIcon = (type: MedicalEvent['type']) => {
  switch (type) {
    case 'diagnosis': return Activity;
    case 'prescription': return Pill;
    case 'report': return FileText;
    case 'surgery': return HeartPulse;
    case 'vaccination': return Syringe;
    case 'checkup': return Stethoscope;
    default: return FileText;
  }
};

const getEventColor = (type: MedicalEvent['type']) => {
  switch (type) {
    case 'diagnosis': return 'bg-amber-500';
    case 'prescription': return 'bg-primary';
    case 'report': return 'bg-accent';
    case 'surgery': return 'bg-destructive';
    case 'vaccination': return 'bg-emerald-500';
    case 'checkup': return 'bg-secondary';
    default: return 'bg-muted';
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

export const TimelineView = () => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
      
      <div className="space-y-6">
        {mockMedicalEvents.map((event, index) => {
          const Icon = getEventIcon(event.type);
          const colorClass = getEventColor(event.type);
          
          return (
            <motion.div
              key={event.id}
              variants={itemVariants}
              className="relative pl-20"
            >
              {/* Timeline dot */}
              <div className={`absolute left-6 w-5 h-5 rounded-full ${colorClass} border-4 border-background shadow-lg`} />
              
              {/* Card */}
              <div className="glass-card-solid p-6 hover-lift cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 bg-muted rounded-full">
                        {event.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)}
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{event.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Stethoscope className="w-4 h-4" />
                      {event.doctor}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Building className="w-4 h-4" />
                      {event.hospital}
                    </span>
                  </div>
                  
                  {event.attachments && event.attachments.length > 0 && (
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <FileText className="w-4 h-4" />
                      {event.attachments.length} attachment{event.attachments.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
