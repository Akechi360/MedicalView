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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, User, Cake, Phone, Mail, MapPin, AlertTriangle, Pill } from 'lucide-react';
import { format } from 'date-fns';
import type { Patient } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; 
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const patientFormSchema = z.object({
  fullName: z.string().min(2, { message: 'El nombre completo debe tener al menos 2 caracteres.' }),
  dateOfBirth: z.date({ required_error: 'La fecha de nacimiento es obligatoria.' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], { required_error: 'El género es obligatorio.' }),
  nationalId: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email({ message: 'Dirección de correo electrónico inválida.' }).optional().or(z.literal('')),
  address: z.string().optional(),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientFormClientProps {
  initialData?: Patient; 
}

export function PatientFormClient({ initialData }: PatientFormClientProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          dateOfBirth: new Date(initialData.dateOfBirth), 
        }
      : {
          fullName: '',
          gender: undefined, 
          nationalId: '',
          contactPhone: '',
          contactEmail: '',
          address: '',
          allergies: '',
          currentMedications: '',
        },
  });

  async function onSubmit(data: PatientFormValues) {
    console.log('Datos del paciente:', data);
    toast({
      title: isEditing ? 'Paciente Actualizado (Simulado)' : 'Paciente Creado (Simulado)',
      description: `El paciente ${data.fullName} ha sido ${isEditing ? 'actualizado' : 'guardado'}.`,
    });
    router.push('/patients'); 
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><User className="text-primary"/> Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar género" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Masculino</SelectItem>
                        <SelectItem value="FEMALE">Femenino</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                        <SelectItem value="PREFER_NOT_TO_SAY">Prefiero no decirlo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Nacional / DNI</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><Phone className="text-primary"/> Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Teléfono</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+34 123 456 789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="paciente@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Calle Principal 123, Ciudad, País" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><AlertTriangle className="text-primary"/> Información Médica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alergias</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Penicilina, Cacahuetes" {...field} />
                  </FormControl>
                  <FormDescription>Liste las alergias conocidas, separadas por comas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentMedications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicamentos Actuales</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Metformina 500mg diarios, Lisinopril 10mg diarios" {...field} />
                  </FormControl>
                  <FormDescription>Liste los medicamentos actuales y sus dosis.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            {isEditing ? 'Guardar Cambios' : 'Crear Paciente'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
