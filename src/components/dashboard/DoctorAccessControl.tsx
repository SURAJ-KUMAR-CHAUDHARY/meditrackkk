import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Shield, ShieldOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { mockDoctors, Doctor } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const DoctorAccessControl = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const { toast } = useToast();

  const toggleAccess = (doctorId: string) => {
    setDoctors(doctors.map(doc => {
      if (doc.id === doctorId) {
        const newAccess = !doc.accessGranted;
        toast({
          title: newAccess ? 'Access Granted' : 'Access Revoked',
          description: newAccess 
            ? `${doc.name} can now view your medical records.`
            : `${doc.name} can no longer view your records.`,
        });
        return { 
          ...doc, 
          accessGranted: newAccess,
          accessExpiry: newAccess ? getDefaultExpiry() : undefined
        };
      }
      return doc;
    }));
  };

  const getDefaultExpiry = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Doctor Access Control</h2>
          <p className="text-muted-foreground">Manage which doctors can view your medical records</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4"
      >
        {doctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card-solid p-5 hover-lift"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  doctor.accessGranted ? 'gradient-bg' : 'bg-muted'
                }`}>
                  <User className={`w-6 h-6 ${
                    doctor.accessGranted ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`} />
                </div>
                
                <div>
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {doctor.specialization} • {doctor.hospital}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                {doctor.accessGranted && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Expires: {formatDate(doctor.accessExpiry)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  {doctor.accessGranted ? (
                    <Shield className="w-5 h-5 text-primary" />
                  ) : (
                    <ShieldOff className="w-5 h-5 text-muted-foreground" />
                  )}
                  <Switch
                    checked={doctor.accessGranted}
                    onCheckedChange={() => toggleAccess(doctor.id)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
