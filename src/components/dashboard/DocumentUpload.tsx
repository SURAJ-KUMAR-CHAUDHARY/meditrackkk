import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  QrCode, 
  FileText, 
  X, 
  Check, 
  Image as ImageIcon,
  Loader2,
  ScanLine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { uploadFileToS3, isAWSConfigured } from '@/services/aws-s3.service';

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

const documentTypes = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'report', label: 'Lab Report' },
  { value: 'imaging', label: 'Imaging/X-Ray' },
  { value: 'discharge', label: 'Discharge Summary' },
  { value: 'vaccination', label: 'Vaccination Record' },
  { value: 'other', label: 'Other' },
];

export const DocumentUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const [documentDate, setDocumentDate] = useState('');
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = async (fileList: FileList | null) => {
    if (!fileList) return;

    if (!documentType) {
      toast({
        title: 'Missing Information',
        description: 'Please select a document type before uploading.',
        variant: 'destructive',
      });
      return;
    }
    
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'uploading' as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Upload files to AWS S3
    const fileArray = Array.from(fileList);
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const uploadedFileRef = newFiles[i];

      try {
        if (isAWSConfigured()) {
          // Upload to AWS S3
          const userId = 'patient-' + Math.random().toString(36).substr(2, 9); // In real app, use actual user ID
          const result = await uploadFileToS3(file, userId, documentType);
          
          setFiles(prev => prev.map(f => 
            f.id === uploadedFileRef.id 
              ? { ...f, status: 'complete', fileUrl: result.fileUrl, fileKey: result.fileKey } 
              : f
          ));
          
          toast({
            title: 'File Uploaded to AWS',
            description: `${file.name} has been uploaded successfully to S3.`,
          });
        } else {
          // Fallback: simulate upload (for development without AWS)
          await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
          
          setFiles(prev => prev.map(f => 
            f.id === uploadedFileRef.id ? { ...f, status: 'complete' } : f
          ));
          
          toast({
            title: 'File Uploaded (Mock)',
            description: `${file.name} uploaded. Configure AWS for real uploads.`,
          });
        }
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === uploadedFileRef.id ? { ...f, status: 'error' } : f
        ));
        
        toast({
          title: 'Upload Failed',
          description: error instanceof Error ? error.message : `Failed to upload ${file.name}`,
          variant: 'destructive',
        });
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [documentType]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleQRScan = () => {
    setShowQRModal(true);
  };

  const handleCameraScan = () => {
    setShowCameraModal(true);
  };

  const simulateQRScan = () => {
    toast({
      title: 'QR Code Scanned',
      description: 'Medical document link detected. Fetching document...',
    });
    setShowQRModal(false);
    
    // Simulate document fetch
    setTimeout(() => {
      const mockFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: 'lab_results_qr.pdf',
        type: 'application/pdf',
        size: 245000,
        status: 'complete',
      };
      setFiles(prev => [...prev, mockFile]);
      toast({
        title: 'Document Retrieved',
        description: 'Lab results have been added to your records.',
      });
    }, 1500);
  };

  const simulateCameraScan = () => {
    toast({
      title: 'Document Captured',
      description: 'Processing image with OCR...',
    });
    setShowCameraModal(false);
    
    setTimeout(() => {
      const mockFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: 'scanned_prescription.jpg',
        type: 'image/jpeg',
        size: 1200000,
        status: 'complete',
      };
      setFiles(prev => [...prev, mockFile]);
      toast({
        title: 'Document Digitized',
        description: 'Handwritten prescription has been scanned and saved.',
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Upload Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Drag & Drop Zone */}
        <motion.div
          className={`col-span-1 md:col-span-2 border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Drop files here or click to upload</h3>
            <p className="text-muted-foreground text-sm">
              Supports PDF, Images, and Documents up to 10MB
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <motion.button
            onClick={handleCameraScan}
            className="w-full glass-card-solid p-4 hover-lift flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <Camera className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold">Scan Document</h4>
              <p className="text-sm text-muted-foreground">Use camera to digitize</p>
            </div>
          </motion.button>

          <motion.button
            onClick={handleQRScan}
            className="w-full glass-card-solid p-4 hover-lift flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <QrCode className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold">Scan QR Code</h4>
              <p className="text-sm text-muted-foreground">Import from hospital</p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Document Details Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-solid p-6"
      >
        <h3 className="font-semibold mb-4">Document Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="doc-type">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="doc-date">Document Date</Label>
            <Input
              id="doc-date"
              type="date"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <h3 className="font-semibold">Uploaded Files</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card-solid p-4 flex items-center gap-4"
                >
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {file.status === 'uploading' && (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    )}
                    {file.status === 'complete' && (
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                    {file.status === 'error' && (
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                        <X className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="w-8 h-8 rounded-full hover:bg-destructive/10 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Point your camera at a hospital QR code to import documents
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-4 border-2 border-primary/50 rounded-lg" />
              <motion.div
                className="absolute left-4 right-4 h-0.5 bg-primary"
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <QrCode className="w-16 h-16 text-muted-foreground/50" />
            </div>
            <Button onClick={simulateQRScan} className="w-full">
              <ScanLine className="w-4 h-4 mr-2" />
              Simulate QR Scan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Scan Modal */}
      <Dialog open={showCameraModal} onOpenChange={setShowCameraModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Document</DialogTitle>
            <DialogDescription>
              Position the document within the frame for best results
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-4 border-2 border-dashed border-primary/50 rounded-lg" />
              <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-background/80 rounded-full text-xs">
                Align document edges
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCameraModal(false)}>
                Cancel
              </Button>
              <Button onClick={simulateCameraScan} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
