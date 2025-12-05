import { PatientSidebar } from '@/components/dashboard/PatientSidebar';
import { DoctorAccessControl } from '@/components/dashboard/DoctorAccessControl';
import { motion } from 'framer-motion';

const PatientAccess = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <PatientSidebar />
      
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Doctor Access</h1>
          <p className="text-muted-foreground">
            Control which healthcare providers can view your records
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DoctorAccessControl />
        </motion.div>
      </main>
    </div>
  );
};

export default PatientAccess;
