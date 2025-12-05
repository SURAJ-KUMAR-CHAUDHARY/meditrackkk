import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Heart, AlertTriangle, Pill, Activity, ChevronDown, ChevronUp, LogOut, ScanLine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NavLink } from '@/components/NavLink';
import { mockPatientsList, Patient } from '@/data/mockData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const DoctorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = mockPatientsList.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-border h-screen sticky top-0 flex flex-col">
        <div className="p-6 border-b border-border">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MediTrack</span>
          </NavLink>
        </div>
        
        {/* Search */}
        <div className="p-4 space-y-4">
          <NavLink
            to="/doctor/scan"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm"
          >
            <ScanLine className="w-5 h-5" />
            <span className="font-medium">Scan Patient QR</span>
          </NavLink>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>
        
        {/* Patient List */}
        <div className="flex-1 overflow-y-auto p-4 pt-0">
          <p className="text-xs font-medium text-muted-foreground mb-3 px-2">
            PATIENTS ({filteredPatients.length})
          </p>
          <div className="space-y-2">
            {filteredPatients.map((patient) => (
              <motion.button
                key={patient.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedPatient(patient)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  selectedPatient?.id === patient.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  selectedPatient?.id === patient.id
                    ? 'gradient-bg text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium text-sm">{patient.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {patient.age} years • {patient.bloodType}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Doctor Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold">
              SM
            </div>
            <div>
              <div className="font-medium text-sm">Dr. Sarah Mitchell</div>
              <div className="text-xs text-muted-foreground">General Physician</div>
            </div>
          </div>
          
          <NavLink
            to="/auth"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </NavLink>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Doctor Dashboard
          </h1>
          <p className="text-muted-foreground">
            View and manage patient records
          </p>
        </motion.div>
        
        {selectedPatient ? (
          <motion.div
            key={selectedPatient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Patient Header */}
            <div className="glass-card-solid p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                  <p className="text-muted-foreground">
                    {selectedPatient.age} years old • Blood Type: {selectedPatient.bloodType}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Patient Summary Accordion */}
            <div className="glass-card-solid p-6">
              <h3 className="font-semibold mb-4">Patient Summary</h3>
              
              <Accordion type="multiple" className="space-y-3">
                <AccordionItem value="allergies" className="border rounded-xl px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Allergies</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedPatient.allergies.length} known allergies
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="flex flex-wrap gap-2 ml-13">
                      {selectedPatient.allergies.length > 0 ? (
                        selectedPatient.allergies.map((allergy) => (
                          <span
                            key={allergy}
                            className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-sm font-medium"
                          >
                            {allergy}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No known allergies</span>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="medications" className="border rounded-xl px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Pill className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Current Medications</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedPatient.currentMedications.length} active prescriptions
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-2 ml-13">
                      {selectedPatient.currentMedications.length > 0 ? (
                        selectedPatient.currentMedications.map((med) => (
                          <div
                            key={med}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>{med}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No current medications</span>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="conditions" className="border rounded-xl px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-accent" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Recent Conditions</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedPatient.recentConditions.length} diagnoses
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="flex flex-wrap gap-2 ml-13">
                      {selectedPatient.recentConditions.length > 0 ? (
                        selectedPatient.recentConditions.map((condition) => (
                          <span
                            key={condition}
                            className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                          >
                            {condition}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No recent conditions</span>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-[60vh] text-center"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Select a Patient</h3>
            <p className="text-muted-foreground max-w-md">
              Choose a patient from the sidebar to view their medical records and health summary.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
