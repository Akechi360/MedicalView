import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Users, CalendarDays, Brain } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-6 shadow-lg">
          <Stethoscope className="h-16 w-16 text-primary-foreground" />
        </div>
        <h1 className="text-5xl font-bold text-primary mb-2">MediView Hub</h1>
        <p className="text-xl text-foreground/80">
          Your Comprehensive Patient Management Solution.
        </p>
      </header>

      <main className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
        <FeatureCard
          icon={<Users className="h-8 w-8 text-accent" />}
          title="Patient Management"
          description="Securely manage patient profiles, medical history, and more."
        />
        <FeatureCard
          icon={<CalendarDays className="h-8 w-8 text-accent" />}
          title="Appointment Scheduling"
          description="Efficiently schedule and track patient appointments with an intuitive calendar."
        />
        <FeatureCard
          icon={<Brain className="h-8 w-8 text-accent" />}
          title="AI-Assisted Diagnosis"
          description="Leverage AI to get suggestions for diagnoses based on patient data."
        />
         <FeatureCard
          icon={<Stethoscope className="h-8 w-8 text-accent" />}
          title="DICOM Viewing"
          description="Upload and view DICOM studies seamlessly within patient records."
        />
      </main>

      <Link href="/dashboard">
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md">
          Access Dashboard
        </Button>
      </Link>

      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} MediView Hub. All rights reserved.</p>
        <p>Designed for medical professionals by medical professionals.</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="items-center">
        <div className="p-3 rounded-full bg-accent/10 mb-2">
            {icon}
        </div>
        <CardTitle className="text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-foreground/70">{description}</p>
      </CardContent>
    </Card>
  );
}
