import { PatientSidebar } from '@/components/dashboard/PatientSidebar';
import { AISummary } from '@/components/dashboard/AISummary';
import { motion } from 'framer-motion';

const PatientAISummary = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <PatientSidebar />
      
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">AI Health Summary</h1>
          <p className="text-muted-foreground">
            AI-powered analysis of your complete medical history
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AISummary />
        </motion.div>
      </main>
    </div>
  );
};

export default PatientAISummary;
