'use client';

import React, { useState, useMemo } from 'react';
import type { Appointment, AppointmentStatus } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, parse, startOfDay, isEqual, isSameMonth, addMonths, subMonths } from 'date-fns';
import { PlusCircle, ChevronLeft, ChevronRight, Clock, User, Edit, Trash2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface AppointmentCalendarClientProps {
  initialAppointments: Appointment[];
}

const appointmentFormSchema = z.object({
  patientFullName: z.string().min(1, "El nombre del paciente es obligatorio"),
  dateTime: z.date({ required_error: "La fecha y hora son obligatorias" }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:mm)"),
  durationMinutes: z.number().min(5, "La duración debe ser de al menos 5 minutos"),
  reason: z.string().optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED', 'RESCHEDULED']).default('SCHEDULED'),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export function AppointmentCalendarClient({ initialAppointments }: AppointmentCalendarClientProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientFullName: '',
      dateTime: new Date(),
      time: format(new Date(), "HH:mm"),
      durationMinutes: 30,
      reason: '',
      status: 'SCHEDULED',
    },
  });
  
  React.useEffect(() => {
    if (editingAppointment) {
      const combinedDateTime = new Date(editingAppointment.dateTime);
      form.reset({
        patientFullName: editingAppointment.patientFullName || '',
        dateTime: combinedDateTime,
        time: format(combinedDateTime, "HH:mm"),
        durationMinutes: editingAppointment.durationMinutes,
        reason: editingAppointment.reason || '',
        status: editingAppointment.status,
      });
    } else {
      form.reset({
        patientFullName: '',
        dateTime: selectedDate || new Date(),
        time: format(selectedDate || new Date(), "HH:mm"),
        durationMinutes: 30,
        reason: '',
        status: 'SCHEDULED',
      });
    }
  }, [editingAppointment, form, selectedDate]);


  const appointmentsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return appointments
      .filter(app => isEqual(startOfDay(new Date(app.dateTime)), startOfDay(selectedDate)))
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [appointments, selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && !isSameMonth(date, currentMonth)) {
      setCurrentMonth(date);
    }
  };
  
  const handleNewAppointment = () => {
    setEditingAppointment(null);
    const baseDate = selectedDate || new Date();
    form.reset({
        patientFullName: '',
        dateTime: baseDate,
        time: format(baseDate, "HH:mm"), 
        durationMinutes: 30,
        reason: '',
        status: 'SCHEDULED',
    });
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    toast({ title: "Cita Eliminada (Simulado)", variant: "destructive" });
  };

  function onSubmit(values: AppointmentFormValues) {
    const [hours, minutes] = values.time.split(':').map(Number);
    const combinedDateTime = new Date(values.dateTime);
    combinedDateTime.setHours(hours, minutes, 0, 0);

    const newOrUpdatedAppointment: Appointment = {
      id: editingAppointment?.id || Math.random().toString(36).substring(7),
      patientFullName: values.patientFullName,
      dateTime: combinedDateTime,
      durationMinutes: values.durationMinutes,
      reason: values.reason,
      status: values.status,
      patientId: editingAppointment?.patientId || `p-${Math.random().toString(36).substring(7)}`,
      doctorId: editingAppointment?.doctorId || 'doc-default',
      createdAt: editingAppointment?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingAppointment) {
      setAppointments(prev => prev.map(app => app.id === editingAppointment.id ? newOrUpdatedAppointment : app));
      toast({ title: "Cita Actualizada (Simulado)" });
    } else {
      setAppointments(prev => [...prev, newOrUpdatedAppointment]);
      toast({ title: "Cita Programada (Simulado)" });
    }
    setIsFormOpen(false);
    setEditingAppointment(null);
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Calendario</CardTitle>
                <Button variant="default" size="sm" onClick={handleNewAppointment}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Nueva Cita
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="p-0 w-full"
                classNames={{
                    caption_label: "text-base font-medium",
                    head_cell: "w-full",
                    day: cn("h-10 w-10", selectedDate && "aria-selected:bg-primary aria-selected:text-primary-foreground"),
                    day_today: "bg-accent text-accent-foreground",
                }}
                components={{
                    DayContent: ({ date }) => {
                    const dayAppointments = appointments.filter(app => isEqual(startOfDay(new Date(app.dateTime)), startOfDay(date)));
                    return (
                        <div className="relative h-full w-full flex items-center justify-center">
                        {format(date, "d")}
                        {dayAppointments.length > 0 && (
                            <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-accent-foreground"></span>
                        )}
                        </div>
                    );
                    },
                }}
                />
            </CardContent>
        </Card>
        {selectedDate && (
            <Card>
                <CardHeader>
                    <CardTitle>Añadir Rápido para {format(selectedDate, 'PPP')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={handleNewAppointment}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Cita
                    </Button>
                </CardContent>
            </Card>
        )}
      </div>

      <div className="md:col-span-2">
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-xl">
              Citas para {selectedDate ? format(selectedDate, 'PPP') : 'fecha seleccionada'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointmentsOnSelectedDate.length > 0 ? (
              appointmentsOnSelectedDate.map(app => (
                <AppointmentCard 
                  key={app.id} 
                  appointment={app}
                  onEdit={() => handleEditAppointment(app)}
                  onDelete={() => handleDeleteAppointment(app.id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-lg h-full">
                 <Info className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  {selectedDate ? "No hay citas para esta fecha." : "Selecciona una fecha para ver las citas."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAppointment ? 'Editar Cita' : 'Nueva Cita'}</DialogTitle>
            <DialogDescription>
              {editingAppointment ? 'Actualiza los detalles de esta cita.' : `Programa una nueva cita para ${selectedDate ? format(selectedDate, 'PPP') : ''}.`}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="patientFullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Paciente</FormLabel>
                    <FormControl><Input placeholder="Juan Pérez" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="dateTime"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Fecha</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={'outline'}
                                className={cn('w-full pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}
                            >
                                {field.value ? format(field.value, 'PPP') : <span>Seleccionar fecha</span>}
                                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Hora (HH:mm)</FormLabel>
                        <FormControl><Input type="time" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (minutos)</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo de la Cita</FormLabel>
                    <FormControl><Textarea placeholder="Ej: Chequeo anual, seguimiento" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar estado" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="SCHEDULED">Programada</SelectItem>
                        <SelectItem value="COMPLETED">Completada</SelectItem>
                        <SelectItem value="CANCELED">Cancelada</SelectItem>
                        <SelectItem value="RESCHEDULED">Reprogramada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                <Button type="submit">{editingAppointment ? 'Guardar Cambios' : 'Programar Cita'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: () => void;
  onDelete: () => void;
}

function AppointmentCard({ appointment, onEdit, onDelete }: AppointmentCardProps) {
  const appointmentTime = format(new Date(appointment.dateTime), 'p');
  const endTime = format(new Date(new Date(appointment.dateTime).getTime() + appointment.durationMinutes * 60000), 'p');
  
  const getStatusInfo = (status: AppointmentStatus): { text: string, color: string } => {
    switch(status) {
      case 'SCHEDULED': return { text: 'Programada', color: 'bg-blue-500' };
      case 'COMPLETED': return { text: 'Completada', color: 'bg-green-500' };
      case 'CANCELED': return { text: 'Cancelada', color: 'bg-red-500' };
      case 'RESCHEDULED': return { text: 'Reprogramada', color: 'bg-yellow-500' };
      default: return { text: 'Desconocido', color: 'bg-gray-500' };
    }
  };
  const statusInfo = getStatusInfo(appointment.status);

  return (
    <Card className="overflow-hidden shadow-sm relative">
      <div className={`w-2 h-full absolute left-0 top-0 ${statusInfo.color}`}></div>
      <CardHeader className="pl-5 pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">{appointment.patientFullName}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3" /> {appointmentTime} - {endTime} ({appointment.durationMinutes} min)
          </CardDescription>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full text-white ${statusInfo.color}`}>
            {statusInfo.text}
        </span>
      </CardHeader>
      <CardContent className="pl-5 pt-0 pb-3">
        {appointment.reason && <p className="text-sm text-muted-foreground">Motivo: {appointment.reason}</p>}
        <p className="text-xs text-muted-foreground">Médico: {appointment.doctorName || 'N/A'}</p>
      </CardContent>
      <CardFooter className="pl-5 pb-3 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onEdit}><Edit className="mr-1 h-4 w-4" /> Editar</Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive/90"><Trash2 className="mr-1 h-4 w-4" /> Eliminar</Button>
      </CardFooter>
    </Card>
  );
}
