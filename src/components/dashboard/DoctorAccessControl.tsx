import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Shield, 
  ShieldOff, 
  ChevronDown, 
  FileText, 
  Pill, 
  ClipboardList, 
  PenLine, 
  Share2,
  Clock,
  Settings
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { mockDoctors, Doctor, AccessPermission, defaultPermissions } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const permissionLabels: Record<keyof AccessPermission, { label: string; icon: React.ElementType; description: string }> = {
  viewHistory: { label: 'View Medical History', icon: ClipboardList, description: 'Access complete medical timeline' },
  viewPrescriptions: { label: 'View Prescriptions', icon: Pill, description: 'See current and past medications' },
  viewReports: { label: 'View Reports', icon: FileText, description: 'Access lab results and imaging' },
  addRecords: { label: 'Add New Records', icon: PenLine, description: 'Add consultation notes and updates' },
  shareWithOthers: { label: 'Share with Specialists', icon: Share2, description: 'Refer data to other doctors' },
};

export const DoctorAccessControl = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [expandedDoctor, setExpandedDoctor] = useState<string | null>(null);
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
          accessExpiry: newAccess ? getDefaultExpiry() : undefined,
          permissions: newAccess ? { ...defaultPermissions } : doc.permissions,
        };
      }
      return doc;
    }));
  };

  const togglePermission = (doctorId: string, permission: keyof AccessPermission) => {
    setDoctors(doctors.map(doc => {
      if (doc.id === doctorId) {
        const newPermissions = {
          ...doc.permissions,
          [permission]: !doc.permissions[permission],
        };
        toast({
          title: 'Permission Updated',
          description: `${permissionLabels[permission].label} ${newPermissions[permission] ? 'enabled' : 'disabled'} for ${doc.name}.`,
        });
        return { ...doc, permissions: newPermissions };
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

  const getActivePermissionsCount = (permissions: AccessPermission) => {
    return Object.values(permissions).filter(Boolean).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Doctor Access Control</h2>
          <p className="text-muted-foreground">Manage which doctors can view and update your medical records</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4"
      >
        {doctors.map((doctor, index) => (
          <Collapsible
            key={doctor.id}
            open={expandedDoctor === doctor.id}
            onOpenChange={(open) => setExpandedDoctor(open ? doctor.id : null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-solid overflow-hidden"
            >
              {/* Main Card Header */}
              <div className="p-5">
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
                  
                  <div className="flex items-center gap-4">
                    {doctor.accessGranted && (
                      <>
                        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Expires: {formatDate(doctor.accessExpiry)}</span>
                        </div>
                        {doctor.lastAccessed && (
                          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Last: {formatDate(doctor.lastAccessed)}</span>
                          </div>
                        )}
                      </>
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

                {/* Expand Button for Permissions */}
                {doctor.accessGranted && (
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-4 text-muted-foreground hover:text-foreground"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      <span>
                        {getActivePermissionsCount(doctor.permissions)} of {Object.keys(permissionLabels).length} permissions active
                      </span>
                      <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${
                        expandedDoctor === doctor.id ? 'rotate-180' : ''
                      }`} />
                    </Button>
                  </CollapsibleTrigger>
                )}
              </div>

              {/* Permissions Panel */}
              <CollapsibleContent className="border-t border-border/50 bg-muted/30">
                <div className="p-5 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">
                    Granular Permissions
                  </h4>
                  {(Object.keys(permissionLabels) as Array<keyof AccessPermission>).map((key) => {
                    const { label, icon: Icon, description } = permissionLabels[key];
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-background/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doctor.permissions[key] ? 'bg-primary/10' : 'bg-muted'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              doctor.permissions[key] ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{label}</p>
                            <p className="text-xs text-muted-foreground">{description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={doctor.permissions[key]}
                          onCheckedChange={() => togglePermission(doctor.id, key)}
                        />
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </motion.div>
          </Collapsible>
        ))}
      </motion.div>
    </div>
  );
};
