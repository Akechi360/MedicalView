
import { LoginForm } from '@/components/auth/LoginForm';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] bg-card p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto p-3 bg-primary rounded-full mb-4 inline-block">
            <Stethoscope className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-primary">
            Iniciar Sesión en MediView Hub
          </h1>
          <p className="text-sm text-muted-foreground">
            Selecciona tu rol e ingresa tus credenciales.
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            Regístrate aquí
          </Link>
          .
        </p>
        <p className="px-8 text-center text-sm text-muted-foreground mt-2">
          Al continuar, aceptas nuestros{' '}
          <a
            href="/terms" // Placeholder link
            className="underline underline-offset-4 hover:text-primary"
          >
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a
            href="/privacy" // Placeholder link
            className="underline underline-offset-4 hover:text-primary"
          >
            Política de Privacidad
          </a>
          .
        </p>
      </div>
    </div>
  );
}
