import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, Activity, Brain, FileText, HardDriveUpload, Eye } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome, Doctor!</h1>
        <p className="text-muted-foreground">Here's an overview of your MediView Hub.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Patients"
          description="Manage patient records and medical histories."
          icon={<Users className="h-6 w-6 text-primary" />}
          value="120" // Placeholder
          footerText="View All Patients"
          link="/patients"
        />
        <DashboardCard
          title="Appointments"
          description="View and schedule upcoming appointments."
          icon={<CalendarDays className="h-6 w-6 text-primary" />}
          value="15 Today" // Placeholder
          footerText="Go to Calendar"
          link="/appointments"
        />
        <DashboardCard
          title="AI Diagnosis"
          description="Utilize AI for diagnostic assistance."
          icon={<Brain className="h-6 w-6 text-primary" />}
          value="Ready"
          footerText="Start AI Diagnosis"
          link="/ai-diagnosis"
        />
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground/90">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard
            title="New Patient"
            icon={<Users className="h-5 w-5" />}
            href="/patients/new"
          />
          <QuickActionCard
            title="New Appointment"
            icon={<CalendarDays className="h-5 w-5" />}
            href="/appointments#new" // Assuming modal or section identified by hash
          />
          <QuickActionCard
            title="Upload DICOM"
            icon={<HardDriveUpload className="h-5 w-5" />}
            href="/patients" // Navigate to patient list to select patient first
          />
          <QuickActionCard
            title="View Reports"
            icon={<FileText className="h-5 w-5" />}
            href="/patients" // Navigate to patient list
          />
        </div>
      </section>
      
      {/* Placeholder for recent activity or notifications */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground/90">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No recent activity to display.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: string;
  footerText: string;
  link: string;
}

function DashboardCard({ title, description, icon, value, footerText, link }: DashboardCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
      <CardFooter>
        <Link href={link} className="w-full">
          <Button variant="outline" className="w-full">
            {footerText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

interface QuickActionCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
}

function QuickActionCard({ title, icon, href }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardContent className="p-4 flex flex-col items-center justify-center gap-2 aspect-square">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-1">
            {icon}
          </div>
          <p className="text-sm font-medium text-center text-foreground">{title}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
