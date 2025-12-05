import { PatientSidebar } from '@/components/dashboard/PatientSidebar';
import { DocumentUpload } from '@/components/dashboard/DocumentUpload';
import { motion } from 'framer-motion';

const PatientUpload = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <PatientSidebar />
      
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
          <p className="text-muted-foreground">
            Scan or upload your medical documents securely
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DocumentUpload />
        </motion.div>
      </main>
    </div>
  );
};

export default PatientUpload;
