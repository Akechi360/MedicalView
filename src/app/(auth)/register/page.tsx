
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Stethoscope, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[480px] bg-card p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto p-3 bg-primary rounded-full mb-4 inline-block">
            <UserPlus className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-primary">
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join MediView Hub as a Doctor or Patient.
          </p>
        </div>
        <RegisterForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Login here
          </Link>
          .
        </p>
         <p className="px-8 text-center text-sm text-muted-foreground mt-2">
          By registering, you agree to our{' '}
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
