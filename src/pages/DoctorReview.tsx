import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Save, ArrowLeft, FileText, User, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockPatient } from '@/data/mockData';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from '@/components/ui/scroll-area';
import { generatePresignedUrl } from '@/services/aws-s3.service';

// Set worker from CDN to avoid build issues
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const DoctorReview = () => {
  const { reportId } = useParams();
  const [searchParams] = useSearchParams();
  const fileKey = searchParams.get('key');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      if (fileKey && !fileKey.startsWith('mock-')) {
        try {
          const url = await generatePresignedUrl(fileKey);
          setDocumentUrl(url);
        } catch (error) {
          console.error("Failed to generate URL", error);
          toast({
            title: "Error loading document",
            description: "Could not retrieve the file from secure storage.",
            variant: "destructive"
          });
        }
      } else {
          // Fallback to mock data if no key provided or if it's a mock key
          // In a real mock scenario, we might use a blob URL if passed, but for cross-device demo we use a static PDF
          setDocumentUrl("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf");
      }
    };
    fetchUrl();
  }, [fileKey, toast]);

  // Mock data - in real app fetch by reportId
  const reportData = {
    patientName: mockPatient.name,
    date: new Date().toLocaleDateString(),
    type: "Lab Report",
    url: documentUrl
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleSubmit = () => {
    if (!notes.trim()) {
        toast({
            title: "Empty Review",
            description: "Please add your suggestions before submitting.",
            variant: "destructive"
        });
        return;
    }

    setLoading(true);
    // Mock API call
    setTimeout(() => {
        setLoading(false);
        toast({
            title: "Review Submitted",
            description: "Patient has been notified of your suggestions.",
        });
        navigate('/doctor/dashboard');
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b px-6 py-3 flex items-center justify-between bg-card z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/doctor/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Report Review
            </h1>
            <div className="text-xs text-muted-foreground flex items-center gap-3">
              <span className="flex items-center gap-1"><User className="h-3 w-3" /> {reportData.patientName}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {reportData.date}</span>
              <span className="bg-muted px-1.5 rounded text-[10px] font-mono">ID: {reportId?.slice(0, 8)}...</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Submit Review
            </Button>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
            {/* Left: Document Viewer */}
            <ResizablePanel defaultSize={60} minSize={30}>
                <div className="h-full bg-slate-100 p-4 overflow-auto flex justify-center">
                     <div className="shadow-lg">
                        {reportData.url ? (
                            <Document
                                file={reportData.url}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={
                                    <div className="flex items-center justify-center h-96">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                }
                                error={
                                    <div className="flex items-center justify-center h-96 bg-white p-8 text-destructive">
                                        Failed to load document. (CORS or Network Error)
                                    </div>
                                }
                            >
                                {Array.from(new Array(numPages), (el, index) => (
                                    <Page 
                                        key={`page_${index + 1}`} 
                                        pageNumber={index + 1} 
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                        className="mb-4"
                                        width={600}
                                    />
                                ))}
                            </Document>
                        ) : (
                            <div className="flex items-center justify-center h-96">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                <span className="ml-2 text-muted-foreground">Retrieving secure document...</span>
                            </div>
                        )}
                     </div>
                </div>
            </ResizablePanel>
            
            <ResizableHandle />

            {/* Right: Doctor Suggestions */}
            <ResizablePanel defaultSize={40} minSize={25}>
                <ScrollArea className="h-full">
                    <div className="p-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Doctor's Suggestions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea 
                                    placeholder="Type your findings, diagnosis, and suggestions here..." 
                                    className="min-h-[300px] resize-none text-base p-4 leading-relaxed"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" onClick={() => setNotes(n => n + "Patient needs to schedule a follow-up appointment.\n")}>
                                    + Schedule Follow-up
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => setNotes(n => n + "Prescription renewed.\n")}>
                                    + Renew Prescription
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => setNotes(n => n + "Lab results are within normal range.\n")}>
                                    + Normal Results
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DoctorReview;
