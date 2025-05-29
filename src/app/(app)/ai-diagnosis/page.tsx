import { DiagnosisFormClient } from '@/components/ai/DiagnosisFormClient';
import { Brain } from 'lucide-react';

export default function AiDiagnosisPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="text-center">
        <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary">AI-Assisted Diagnosis</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Enter patient's medical history and current symptoms to get AI-powered diagnostic suggestions.
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-500 mt-2">
          <strong>Disclaimer:</strong> This tool provides suggestions for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provider.
        </p>
      </header>
      
      <DiagnosisFormClient />
    </div>
  );
}
