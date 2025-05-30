import { DiagnosisFormClient } from '@/components/ai/DiagnosisFormClient';
import { Brain } from 'lucide-react';

export default function AiDiagnosisPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="text-center">
        <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary">Diagnóstico Asistido por IA</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Ingrese el historial médico y los síntomas actuales del paciente para obtener sugerencias de diagnóstico impulsadas por IA.
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-500 mt-2">
          <strong>Descargo de responsabilidad:</strong> Esta herramienta proporciona sugerencias con fines informativos únicamente y no sustituye el consejo, diagnóstico o tratamiento médico profesional. Siempre busque el consejo de un proveedor de salud calificado.
        </p>
      </header>
      
      <DiagnosisFormClient />
    </div>
  );
}
