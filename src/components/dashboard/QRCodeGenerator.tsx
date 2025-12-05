import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Clock, Share2, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  generateQRCodeWithAccessLink,
  generateQRCodeWithEncodedData,
  downloadQRCode,
  getQRCodeFilename,
  QRCodeData,
} from '@/services/qrcode.service';

interface QRCodeGeneratorProps {
  patientId: string;
  patientName: string;
  fileKeys: string[];
  records?: QRCodeData['records'];
}

export const QRCodeGenerator = ({ 
  patientId, 
  patientName, 
  fileKeys,
  records = []
}: QRCodeGeneratorProps) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrType, setQrType] = useState<'link' | 'data'>('link');
  const [expiryTime, setExpiryTime] = useState<string>('3600');
  const { toast } = useToast();

  const handleGenerateQR = async () => {
    setIsGenerating(true);
    try {
      let qrCode: string;

      if (qrType === 'link') {
        // Generate QR with temporary access link
        qrCode = await generateQRCodeWithAccessLink(
          fileKeys,
          patientId,
          parseInt(expiryTime)
        );
        toast({
          title: 'QR Code Generated',
          description: `Temporary access link valid for ${parseInt(expiryTime) / 3600} hour(s)`,
        });
      } else {
        // Generate QR with encoded data
        const qrData: QRCodeData = {
          patientId,
          patientName,
          records: records.length > 0 ? records : fileKeys.map(key => ({
            date: new Date().toISOString(),
            type: 'Medical Record',
            title: 'Patient Document',
            fileKey: key,
          })),
          generatedDate: new Date().toISOString(),
        };
        qrCode = await generateQRCodeWithEncodedData(qrData);
        toast({
          title: 'QR Code Generated',
          description: 'Data encoded in QR code for offline access',
        });
      }

      setQrCodeImage(qrCode);
      setShowQRModal(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate QR code',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeImage) {
      const filename = getQRCodeFilename(qrType, patientId);
      downloadQRCode(qrCodeImage, filename);
      toast({
        title: 'Downloaded',
        description: 'QR code saved to your device',
      });
    }
  };

  const handleShareQR = async () => {
    if (qrCodeImage) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeImage);
        const blob = await response.blob();
        const file = new File([blob], getQRCodeFilename(qrType, patientId), { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Medical Records QR Code',
            text: 'Scan this QR code to access medical records',
            files: [file],
          });
          toast({
            title: 'Shared',
            description: 'QR code shared successfully',
          });
        } else {
          // Fallback: copy to clipboard
          toast({
            title: 'Share not supported',
            description: 'Use the download button to save the QR code',
            variant: 'default',
          });
        }
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="glass-card-solid p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Generate QR Code for Doctor Access
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>QR Code Type</Label>
              <Select value={qrType} onValueChange={(value: 'link' | 'data') => setQrType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Temporary Access Link</div>
                        <div className="text-xs text-muted-foreground">
                          Doctor scans to view via secure link
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="data">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Encoded Data</div>
                        <div className="text-xs text-muted-foreground">
                          Doctor scans to import data directly
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {qrType === 'link' && (
              <div className="space-y-2">
                <Label>Link Expiry Time</Label>
                <Select value={expiryTime} onValueChange={setExpiryTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1800">30 minutes</SelectItem>
                    <SelectItem value="3600">1 hour</SelectItem>
                    <SelectItem value="7200">2 hours</SelectItem>
                    <SelectItem value="21600">6 hours</SelectItem>
                    <SelectItem value="86400">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button 
              onClick={handleGenerateQR} 
              disabled={isGenerating || fileKeys.length === 0}
              className="w-full"
              variant="gradient"
            >
              <QrCode className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate QR Code'}
            </Button>

            {fileKeys.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Upload some documents first to generate QR code
              </p>
            )}
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">How it works:</strong>
            <br />
            • <strong>Temporary Link:</strong> Doctor scans QR to access files via secure temporary URL
            <br />
            • <strong>Encoded Data:</strong> Medical information is embedded in QR for offline access
          </p>
        </div>
      </div>

      {/* QR Code Display Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Medical Records QR Code</DialogTitle>
            <DialogDescription>
              Show this QR code to your doctor to share your medical records
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {qrCodeImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-4 rounded-xl flex items-center justify-center"
              >
                <img 
                  src={qrCodeImage} 
                  alt="Medical Records QR Code" 
                  className="w-full max-w-[300px] h-auto"
                />
              </motion.div>
            )}

            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Patient:</span> {patientName}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Records:</span> {fileKeys.length} file(s)
              </div>
              {qrType === 'link' && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Expires in:</span> {parseInt(expiryTime) / 3600} hour(s)
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleDownloadQR} 
                variant="outline" 
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                onClick={handleShareQR} 
                variant="outline" 
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
