import { useState } from 'react';
import { PatientSidebar } from '@/components/dashboard/PatientSidebar';
import { DocumentUpload } from '@/components/dashboard/DocumentUpload';
import { QRCodeGenerator } from '@/components/dashboard/QRCodeGenerator';
import { mockPatient } from '@/data/mockData';
import { motion } from 'framer-motion';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  status: 'uploading' | 'complete' | 'error';
  fileUrl?: string;
  fileKey?: string;
}

const PatientUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Mock file keys for QR generation - in real app, this would come from actual uploads
  const fileKeys = uploadedFiles
    .filter(file => file.status === 'complete' && file.fileKey)
    .map(file => file.fileKey!)
    .slice(0, 10); // Limit to 10 files for QR

  return (
    <div className="flex min-h-screen bg-background">
      <PatientSidebar />

      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Upload & Share Documents</h1>
          <p className="text-muted-foreground">
            Upload your medical documents securely and generate QR codes for doctor access
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <DocumentUpload />
          </motion.div>

          {fileKeys.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <QRCodeGenerator
                patientId={mockPatient.id}
                patientName={mockPatient.name}
                fileKeys={fileKeys}
              />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientUpload;
