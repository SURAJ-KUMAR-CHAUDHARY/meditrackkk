import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Check, Share2, Download, Loader2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { uploadFileToMockS3 } from '@/services/mock-storage.service';
import { mockPatient } from '@/data/mockData';
import { PatientSidebar } from '@/components/dashboard/PatientSidebar';
import { useToast } from '@/hooks/use-toast';

const PatientUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      // Auto upload on select as per flow "On file selection, upload the file"
      handleUpload(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file.",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async (fileToUpload: File) => {
    setUploading(true);
    try {
      // Mock S3 upload or real if configured
      const result = await uploadFileToMockS3(fileToUpload);
      
      // Generate unique ID
      const newReportId = crypto.randomUUID();
      setReportId(newReportId);
      
      // Store the fileKey to be used in the QR code
      setUploadedFileKey(result.key);
      
      // Simulate a small delay for better UX if upload was too fast
      setTimeout(() => {
        setUploading(false);
        setUploadComplete(true);
        toast({
          title: "Upload Complete",
          description: "Your report has been uploaded securely.",
        });
      }, 1000);
      
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file.",
        variant: "destructive"
      });
    }
  };

  const reviewUrl = reportId 
    ? `${window.location.origin}/doctor/review/${reportId}${uploadedFileKey ? `?key=${encodeURIComponent(uploadedFileKey)}` : ''}` 
    : '';

  return (
    <div className="flex min-h-screen bg-background">
      <PatientSidebar />
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Upload Medical Record</h1>
            <p className="text-muted-foreground mt-2">
              Upload your report to generate a QR code for your doctor.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!uploadComplete ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-dashed border-2 relative overflow-hidden">
                  <CardContent className="pt-6">
                    <div
                      className={`
                        flex flex-col items-center justify-center p-10 transition-colors duration-200 rounded-lg
                        ${isDragging ? 'bg-primary/10 border-primary' : 'bg-background'}
                        ${uploading ? 'opacity-50 pointer-events-none' : ''}
                      `}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        {uploading ? (
                          <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        ) : (
                          <Upload className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      
                      {uploading ? (
                        <div className="text-center">
                          <p className="text-lg font-medium">Uploading...</p>
                          <p className="text-sm text-muted-foreground">Securing your data</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <p className="text-lg font-medium">Drag & drop your file here</p>
                          <p className="text-sm text-muted-foreground">or click to browse</p>
                          <Button variant="outline" className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>
                            Select File
                          </Button>
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".pdf,image/*"
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <Card className="backdrop-blur-sm bg-white/50 border-primary/20 shadow-xl">
                  <CardHeader className="text-center">
                    <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-2">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle>Report Uploaded!</CardTitle>
                    <CardDescription>Share this QR code with your doctor</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-inner border">
                      {reportId && (
                        <QRCode
                          value={reviewUrl}
                          size={200}
                          level="H"
                          viewBox={`0 0 256 256`}
                        />
                      )}
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Report ID</p>
                      <p className="font-mono text-xs bg-muted px-2 py-1 rounded">{reportId}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center pb-6">
                    <Button className="w-full gap-2" onClick={() => {
                      setUploadComplete(false);
                      setFile(null);
                      setReportId(null);
                    }}>
                      <Upload className="h-4 w-4" />
                      Upload Another
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default PatientUpload;
