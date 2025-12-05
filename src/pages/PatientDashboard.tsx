import { motion } from 'framer-motion';
import { Activity, FileText, Users, Calendar, AlertTriangle, Pill } from 'lucide-react';
import { PatientSidebar } from '@/components/dashboard/PatientSidebar';
import { TimelineView } from '@/components/dashboard/TimelineView';
import { mockPatient, mockMedicalEvents, mockDoctors } from '@/data/mockData';

const statCards = [
  { 
    icon: FileText, 
    label: 'Total Records', 
    value: mockMedicalEvents.length.toString(),
    color: 'from-primary to-secondary'
  },
  { 
    icon: Users, 
    label: 'Active Doctors', 
    value: mockDoctors.filter(d => d.accessGranted).length.toString(),
    color: 'from-secondary to-accent'
  },
  { 
    icon: Calendar, 
    label: 'Last Visit', 
    value: 'Dec 1',
    color: 'from-accent to-primary'
  },
  { 
    icon: AlertTriangle, 
    label: 'Allergies', 
    value: mockPatient.allergies.length.toString(),
    color: 'from-amber-500 to-orange-500'
  },
];

const PatientDashboard = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <PatientSidebar />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{mockPatient.name.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your health records
          </p>
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card-solid p-6 hover-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-3xl font-bold">{stat.value}</span>
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Quick Info Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Patient Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card-solid p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Patient Profile
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Blood Type</span>
                <span className="font-medium">{mockPatient.bloodType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age</span>
                <span className="font-medium">{mockPatient.age} years</span>
              </div>
            </div>
          </motion.div>
          
          {/* Allergies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card-solid p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Allergies
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockPatient.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-sm font-medium"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </motion.div>
          
          {/* Current Medications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card-solid p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              Current Medications
            </h3>
            <div className="space-y-2">
              {mockPatient.currentMedications.map((med) => (
                <div
                  key={med}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{med}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-6">Recent Medical History</h2>
          <TimelineView />
        </motion.div>
      </main>
    </div>
  );
};

export default PatientDashboard;
