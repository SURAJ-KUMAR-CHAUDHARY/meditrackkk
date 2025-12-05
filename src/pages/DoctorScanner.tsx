import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Html5QrcodeScanner } from 'html5-qrcode';

const DoctorScanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, disableFlip: false },
      false
    );

    const onScanSuccess = (decodedText: string, decodedResult: any) => {
      if (!scanned) {
        setScanned(true);
        if (decodedText.includes('/doctor/review/')) {
          const url = new URL(decodedText);
          const reportId = url.pathname.split('/').pop();
          const fileKey = url.searchParams.get('key');

          toast({
            title: "QR Code Detected",
            description: "Redirecting to report review...",
          });
          
          setTimeout(() => {
             navigate(`/doctor/review/${reportId}${fileKey ? `?key=${encodeURIComponent(fileKey)}` : ''}`);
          }, 500);
        } else {
          console.warn("Invalid QR content:", decodedText);
          toast({
            title: "Invalid QR Code",
            description: "The scanned QR code does not contain a valid report link.",
            variant: "destructive"
          });
          setScanned(false);
        }
        html5QrcodeScanner.clear().catch(error => console.error("Failed to clear html5QrcodeScanner", error));
      }
    };

    const onScanError = (errorMessage: string) => {
      // console.warn(errorMessage);
    };

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    return () => {
      html5QrcodeScanner.clear().catch(error => console.error("Failed to clear html5QrcodeScanner on unmount", error));
    };
  }, [navigate, toast, scanned]);

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
             <div id="reader" style={{ width: '100%', height: '100%' }}></div>
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
