'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting possible diagnoses or next steps
 * based on a patient's medical history and current symptoms.
 *
 * @exports suggestDiagnosis - An async function that takes patient information and returns diagnostic suggestions.
 * @exports SuggestDiagnosisInput - The input type for the suggestDiagnosis function.
 * @exports SuggestDiagnosisOutput - The output type for the suggestDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDiagnosisInputSchema = z.object({
  medicalHistory: z
    .string()
    .describe('The complete medical history of the patient.'),
  currentSymptoms: z.string().describe('The current symptoms reported by the patient.'),
});

export type SuggestDiagnosisInput = z.infer<typeof SuggestDiagnosisInputSchema>;

const SuggestDiagnosisOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of possible diagnoses or next steps to consider.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested diagnoses or next steps.'),
});

export type SuggestDiagnosisOutput = z.infer<typeof SuggestDiagnosisOutputSchema>;

export async function suggestDiagnosis(input: SuggestDiagnosisInput): Promise<SuggestDiagnosisOutput> {
  return suggestDiagnosisFlow(input);
}

const suggestDiagnosisPrompt = ai.definePrompt({
  name: 'suggestDiagnosisPrompt',
  input: {schema: SuggestDiagnosisInputSchema},
  output: {schema: SuggestDiagnosisOutputSchema},
  prompt: `You are an AI assistant helping doctors by suggesting possible diagnoses and next steps based on a patient's medical history and current symptoms.

  Medical History: {{{medicalHistory}}}
  Current Symptoms: {{{currentSymptoms}}}

  Based on this information, provide a list of possible diagnoses or next steps to consider. Also, explain the reasoning behind each suggestion.

  Format your response as a JSON object with a 'suggestions' array and a 'reasoning' field.`,
});

const suggestDiagnosisFlow = ai.defineFlow(
  {
    name: 'suggestDiagnosisFlow',
    inputSchema: SuggestDiagnosisInputSchema,
    outputSchema: SuggestDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await suggestDiagnosisPrompt(input);
    return output!;
  }
);
