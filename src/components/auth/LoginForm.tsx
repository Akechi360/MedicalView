
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
// Firebase specific imports for Google Sign-In are removed

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.enum(['DOCTOR', 'PATIENT', 'ADMIN'], { required_error: "You must select a role."})
});

type LoginFormValues = z.infer<typeof loginSchema>;

const USER_ROLE_KEY = 'currentUserRole';
const USER_DATA_KEY = 'currentUserData'; 

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
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(result.user));
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

  // handleGoogleSignIn function and related logic removed

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
      {/* "Or continue with" separator and Google Sign-In button removed */}
    </div>
  );
}
