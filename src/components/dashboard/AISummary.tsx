import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockMedicalEvents, generateAISummary } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const AISummary = () => {
  const [summary, setSummary] = useState(generateAISummary(mockMedicalEvents));
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const regenerateSummary = async () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSummary(generateAISummary(mockMedicalEvents));
    setIsGenerating(false);
    toast({
      title: 'Summary Updated',
      description: 'Your AI health summary has been regenerated.',
    });
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied to Clipboard',
      description: 'Summary has been copied to your clipboard.',
    });
  };

  // Parse markdown-like formatting
  const formatSummary = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-foreground">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 text-muted-foreground">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-muted-foreground">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI Health Summary</h2>
            <p className="text-muted-foreground">Powered by advanced medical AI</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copySummary}
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={regenerateSummary}
            disabled={isGenerating}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-solid p-8"
      >
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Analyzing your medical history...</p>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            {formatSummary(summary)}
          </div>
        )}
      </motion.div>
      
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Note:</strong> This AI-generated summary is for informational purposes only 
          and should not replace professional medical advice. Always consult with your healthcare provider 
          for medical decisions.
        </p>
      </div>
    </div>
  );
};
