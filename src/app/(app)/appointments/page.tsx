import { AppointmentCalendarClient } from "@/components/appointments/AppointmentCalendarClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Appointment } from "@/types";
import { PlusCircle, CalendarDays } from "lucide-react";

// Placeholder fetch function
async function getAppointments(): Promise<Appointment[]> {
  // In a real app, fetch appointments for the logged-in doctor or practice
  // For now, returning some sample data for demonstration
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  return [
    {
      id: '1',
      dateTime: new Date(today.setHours(9, 0, 0, 0)),
      durationMinutes: 30,
      patientId: 'p1',
      patientFullName: 'John Doe',
      doctorId: 'doc1',
      doctorName: 'Dr. Smith',
      status: 'SCHEDULED',
      reason: 'Annual Checkup',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      dateTime: new Date(today.setHours(10, 30, 0, 0)),
      durationMinutes: 45,
      patientId: 'p2',
      patientFullName: 'Jane Roe',
      doctorId: 'doc1',
      doctorName: 'Dr. Smith',
      status: 'SCHEDULED',
      reason: 'Follow-up Consultation',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      dateTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
      durationMinutes: 60,
      patientId: 'p3',
      patientFullName: 'Peter Pan',
      doctorId: 'doc2',
      doctorName: 'Dr. Jones',
      status: 'SCHEDULED',
      reason: 'New Patient Visit',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}


export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Appointment Management</h1>
          <p className="text-muted-foreground">
            View, schedule, and manage all appointments.
          </p>
        </div>
        {/* Placeholder for "New Appointment" button - could open a dialog from AppointmentCalendarClient */}
        {/* <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Appointment
        </Button> */}
      </div>
      <AppointmentCalendarClient initialAppointments={appointments} />
    </div>
  );
}
