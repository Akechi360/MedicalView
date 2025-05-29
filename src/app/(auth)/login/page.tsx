import { LoginForm } from '@/components/auth/LoginForm';
import { Stethoscope } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] bg-card p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto p-3 bg-primary rounded-full mb-4 inline-block">
            <Stethoscope className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-primary">
            MediView Hub Login
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your dashboard.
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
