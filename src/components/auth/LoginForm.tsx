
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, BriefcaseMedical, ShieldAlert, Loader2 } from 'lucide-react';
import React from 'react';
import type { UserRole } from '@/types';
import { loginUser, type AuthResponse } from '@/lib/auth.service';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.enum(['DOCTOR', 'PATIENT', 'ADMIN'], { required_error: "You must select a role."})
});

type LoginFormValues = z.infer<typeof loginSchema>;

const USER_ROLE_KEY = 'currentUserRole';
const USER_DATA_KEY = 'currentUserData'; // For storing user ID, name, email

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: undefined, 
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_ROLE_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    }

    const result: AuthResponse = await loginUser(data.email, data.password, data.role);

    if (result.success && result.user) {
      toast({
        title: 'Login Successful',
        description: `Welcome, ${result.user.name || result.user.email}! Role: ${result.user.role}.`,
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_ROLE_KEY, result.user.role);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(result.user)); // Store user data
      }
      router.push('/dashboard');
    } else {
       toast({
        title: 'Login Failed',
        description: result.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Placeholder for Google Sign-In logic.
    // In a real app, this would involve Firebase or another OAuth provider.
    // For now, simulate a PATIENT login.
    setTimeout(() => {
      toast({
        title: 'Google Sign-In (Placeholder)',
        description: 'This would initiate Google Sign-In flow. Simulating patient login.',
      });
      const mockPatientUser = { id: 'google-user', email: 'google.patient@example.com', name: 'Google Patient', role: 'PATIENT' as UserRole };
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_ROLE_KEY, 'PATIENT');
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(mockPatientUser));
      }
      router.push('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>I am a...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-2 md:justify-around"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="DOCTOR" id="role-doctor" disabled={isLoading} />
                      </FormControl>
                      <FormLabel htmlFor="role-doctor" className="font-normal flex items-center">
                        <BriefcaseMedical className="mr-2 h-4 w-4 text-primary" /> Doctor
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="PATIENT" id="role-patient" disabled={isLoading}/>
                      </FormControl>
                      <FormLabel htmlFor="role-patient" className="font-normal flex items-center">
                        <User className="mr-2 h-4 w-4 text-primary" /> Patient
                      </FormLabel>
                    </FormItem>
                     <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ADMIN" id="role-admin" disabled={isLoading}/>
                      </FormControl>
                      <FormLabel htmlFor="role-admin" className="font-normal flex items-center">
                        <ShieldAlert className="mr-2 h-4 w-4 text-destructive" /> Admin
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="name@example.com" {...field} className="pl-10" disabled={isLoading}/>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••" 
                      {...field} 
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
          <path
            fill="currentColor"
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.97-4.04 1.97-3.07 0-5.56-2.31-5.56-5.17s2.49-5.17 5.56-5.17c1.36 0 2.39.55 3.25 1.3l2.66-2.59C19.07 1.83 16.32.01 12.48.01 7.03.01 3.01 3.95 3.01 9.28s4.02 9.27 9.47 9.27c2.83 0 4.96-.93 6.6-2.62 1.72-1.62 2.55-3.88 2.55-6.19 0-.82-.07-1.62-.24-2.38z"
          ></path>
        </svg>
        Google
      </Button>
    </div>
  );
}
