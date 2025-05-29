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
  medicalHistory: z.string().min(10, { message: 'Medical history must be at least 10 characters.' }),
  currentSymptoms: z.string().min(10, { message: 'Current symptoms must be at least 10 characters.' }),
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
        title: 'Diagnosis Suggested',
        description: 'AI has provided diagnostic suggestions.',
      });
    } catch (err) {
      console.error('AI Diagnosis Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get diagnosis: ${errorMessage}`);
      toast({
        title: 'Error',
        description: `Failed to get diagnosis: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Patient Information</CardTitle>
        <CardDescription>
          Provide detailed medical history and current symptoms for analysis.
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
                  <FormLabel className="text-lg">Medical History</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Patient is a 45-year-old male with a history of hypertension and type 2 diabetes..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include past illnesses, surgeries, medications, allergies, family history, and relevant lifestyle factors.
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
                  <FormLabel className="text-lg">Current Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Reports persistent cough for 2 weeks, low-grade fever, fatigue, and occasional shortness of breath..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe all current symptoms, including onset, duration, severity, and any aggravating or relieving factors.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="min-w-[180px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get AI Diagnosis Suggestions'
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
                <h3 className="font-semibold text-lg">Analysis Error</h3>
                <p className="text-sm">{error}</p>
            </div>
           </div>
        </div>
      )}

      {diagnosisResult && (
        <div className="p-6 border-t">
          <div className="flex items-center text-primary mb-4">
            <Lightbulb className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-semibold">AI Diagnostic Suggestions</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Possible Diagnoses / Next Steps:</h3>
              {diagnosisResult.suggestions.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 bg-muted/50 p-4 rounded-md">
                  {diagnosisResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-foreground/90">{suggestion}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific suggestions provided.</p>
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Reasoning:</h3>
              <p className="text-foreground/90 whitespace-pre-wrap bg-muted/50 p-4 rounded-md">{diagnosisResult.reasoning || "No reasoning provided."}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
