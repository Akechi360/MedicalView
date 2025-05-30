import { AppointmentCalendarClient } from "@/components/appointments/AppointmentCalendarClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Appointment } from "@/types";
import { PlusCircle, CalendarDays } from "lucide-react";

// Placeholder fetch function
async function getAppointments(): Promise<Appointment[]> {
  // En una app real, se obtendrían las citas del médico o consultorio logueado
  // Por ahora, se devuelve un array vacío ya que se están eliminando los mocks
  return Promise.resolve([]);
}


export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Gestión de Citas</h1>
          <p className="text-muted-foreground">
            Ver, programar y gestionar todas las citas.
          </p>
        </div>
        {/* Placeholder para botón "Nueva Cita" - podría abrir un diálogo desde AppointmentCalendarClient */}
        {/* <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Nueva Cita
        </Button> */}
      </div>
      <AppointmentCalendarClient initialAppointments={appointments} />
    </div>
  );
}
