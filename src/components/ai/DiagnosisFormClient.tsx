'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { suggestDiagnosis, type SuggestDiagnosisInput, type SuggestDiagnosisOutput } from '@/ai/flows/suggest-diagnosis';
import React, { useState } from 'react';
import { Loader2, Lightbulb, AlertTriangle } from 'lucide-react';

const diagnosisFormSchema = z.object({
  medicalHistory: z.string().min(10, { message: 'El historial médico debe tener al menos 10 caracteres.' }),
  currentSymptoms: z.string().min(10, { message: 'Los síntomas actuales deben tener al menos 10 caracteres.' }),
});

type DiagnosisFormValues = z.infer<typeof diagnosisFormSchema>;

export function DiagnosisFormClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<SuggestDiagnosisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisFormSchema),
    defaultValues: {
      medicalHistory: '',
      currentSymptoms: '',
    },
  });

  async function onSubmit(data: DiagnosisFormValues) {
    setIsLoading(true);
    setDiagnosisResult(null);
    setError(null);
    try {
      const input: SuggestDiagnosisInput = {
        medicalHistory: data.medicalHistory,
        currentSymptoms: data.currentSymptoms,
      };
      const result = await suggestDiagnosis(input);
      setDiagnosisResult(result);
      toast({
        title: 'Diagnóstico Sugerido',
        description: 'La IA ha proporcionado sugerencias de diagnóstico.',
      });
    } catch (err) {
      console.error('Error de Diagnóstico IA:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(`Error al obtener el diagnóstico: ${errorMessage}`);
      toast({
        title: 'Error',
        description: `Error al obtener el diagnóstico: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Información del Paciente</CardTitle>
        <CardDescription>
          Proporcione el historial médico detallado y los síntomas actuales para el análisis.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Historial Médico</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Paciente masculino de 45 años con antecedentes de hipertensión y diabetes tipo 2..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Incluya enfermedades pasadas, cirugías, medicamentos, alergias, antecedentes familiares y factores de estilo de vida relevantes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentSymptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Síntomas Actuales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Refiere tos persistente desde hace 2 semanas, fiebre baja, fatiga y disnea ocasional..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describa todos los síntomas actuales, incluyendo inicio, duración, gravedad y cualquier factor agravante o atenuante.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="min-w-[220px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                'Obtener Sugerencias de Diagnóstico IA'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {error && (
        <div className="p-6 border-t border-destructive/50 bg-destructive/10">
           <div className="flex items-start text-destructive">
            <AlertTriangle className="h-6 w-6 mr-3 flex-shrink-0" />
            <div>
                <h3 className="font-semibold text-lg">Error de Análisis</h3>
                <p className="text-sm">{error}</p>
            </div>
           </div>
        </div>
      )}

      {diagnosisResult && (
        <div className="p-6 border-t">
          <div className="flex items-center text-primary mb-4">
            <Lightbulb className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-semibold">Sugerencias de Diagnóstico IA</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Posibles Diagnósticos / Próximos Pasos:</h3>
              {diagnosisResult.suggestions.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 bg-muted/50 p-4 rounded-md">
                  {diagnosisResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-foreground/90">{suggestion}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No se proporcionaron sugerencias específicas.</p>
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Razonamiento:</h3>
              <p className="text-foreground/90 whitespace-pre-wrap bg-muted/50 p-4 rounded-md">{diagnosisResult.reasoning || "No se proporcionó razonamiento."}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
