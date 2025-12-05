import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const DoctorScanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scanned, setScanned] = useState(false);

  const handleResult = (result: any, error: any) => {
    if (result && !scanned) {
      const text = result?.text;
      if (text) {
        setScanned(true);
        // Parse URL to get reportId
        // Expected format: .../doctor/review/{reportId}
        // We look for the last occurrence of /doctor/review/
        if (text.includes('/doctor/review/')) {
          const parts = text.split('/doctor/review/');
          const reportId = parts[parts.length - 1];
          
          toast({
            title: "QR Code Detected",
            description: "Redirecting to report review...",
          });
          
          setTimeout(() => {
             navigate(`/doctor/review/${reportId}`);
          }, 500);
        } else {
          // Debounce error toast or just log
          console.warn("Invalid QR content:", text);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-white hover:bg-white/20"
        onClick={() => navigate('/doctor/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="max-w-sm w-full space-y-8 z-10">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold">Scan Patient QR</h1>
          <p className="text-white/70 mt-2">Align the QR code within the frame</p>
        </div>

        <Card className="overflow-hidden border-0 shadow-2xl relative aspect-square bg-black rounded-3xl">
           <div className="w-full h-full relative">
             <QrReader
                onResult={handleResult}
                constraints={{ facingMode: 'environment' }}
                containerStyle={{ width: '100%', height: '100%', paddingTop: 0 }}
                videoContainerStyle={{ paddingTop: 0 }}
                videoStyle={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
             />
           </div>
           
           {/* Overlay */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-white/30 rounded-lg relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary -translate-x-1 -translate-y-1"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-primary translate-x-1 -translate-y-1"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-primary -translate-x-1 translate-y-1"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary translate-x-1 translate-y-1"></div>
                <ScanLine className="w-full h-full text-primary/10 animate-pulse" />
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorScanner;
