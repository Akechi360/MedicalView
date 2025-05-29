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
  patientFullName: z.string().min(1, "Patient name is required"),
  dateTime: z.date({ required_error: "Date and time are required" }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  durationMinutes: z.number().min(5, "Duration must be at least 5 minutes"),
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
    // Reset form with selectedDate or today
    const baseDate = selectedDate || new Date();
    form.reset({
        patientFullName: '',
        dateTime: baseDate,
        time: format(baseDate, "HH:mm"), // Default to current time or start of day
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
    toast({ title: "Appointment Deleted (Placeholder)", variant: "destructive" });
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
      toast({ title: "Appointment Updated (Placeholder)" });
    } else {
      setAppointments(prev => [...prev, newOrUpdatedAppointment]);
      toast({ title: "Appointment Scheduled (Placeholder)" });
    }
    setIsFormOpen(false);
    setEditingAppointment(null);
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Calendar</CardTitle>
                <Button variant="default" size="sm" onClick={handleNewAppointment}>
                    <PlusCircle className="mr-2 h-4 w-4" /> New Appointment
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
                    <CardTitle>Quick Add for {format(selectedDate, 'PPP')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={handleNewAppointment}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Appointment
                    </Button>
                </CardContent>
            </Card>
        )}
      </div>

      <div className="md:col-span-2">
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-xl">
              Appointments for {selectedDate ? format(selectedDate, 'PPP') : 'selected date'}
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
                  {selectedDate ? "No appointments for this date." : "Select a date to view appointments."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
            <DialogDescription>
              {editingAppointment ? 'Update the details for this appointment.' : `Schedule a new appointment for ${selectedDate ? format(selectedDate, 'PPP') : ''}.`}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="patientFullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
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
                        <FormLabel>Date</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={'outline'}
                                className={cn('w-full pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}
                            >
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                        <FormLabel>Time (HH:mm)</FormLabel>
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
                    <FormLabel>Duration (minutes)</FormLabel>
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
                    <FormLabel>Reason for Appointment</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Annual checkup, follow-up" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELED">Canceled</SelectItem>
                        <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit">{editingAppointment ? 'Save Changes' : 'Schedule Appointment'}</Button>
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
  
  const getStatusColor = (status: AppointmentStatus) => {
    switch(status) {
      case 'SCHEDULED': return 'bg-blue-500';
      case 'COMPLETED': return 'bg-green-500';
      case 'CANCELED': return 'bg-red-500';
      case 'RESCHEDULED': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className={`w-2 h-full absolute left-0 top-0 ${getStatusColor(appointment.status)}`}></div>
      <CardHeader className="pl-5 pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">{appointment.patientFullName}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3" /> {appointmentTime} - {endTime} ({appointment.durationMinutes} min)
          </CardDescription>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(appointment.status)}`}>
            {appointment.status}
        </span>
      </CardHeader>
      <CardContent className="pl-5 pt-0 pb-3">
        {appointment.reason && <p className="text-sm text-muted-foreground">Reason: {appointment.reason}</p>}
        <p className="text-xs text-muted-foreground">Doctor: {appointment.doctorName || 'N/A'}</p>
      </CardContent>
      <CardFooter className="pl-5 pb-3 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onEdit}><Edit className="mr-1 h-4 w-4" /> Edit</Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive/90"><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
      </CardFooter>
    </Card>
  );
}
