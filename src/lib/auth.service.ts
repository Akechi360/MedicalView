
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { UserRole } from '@/types';
import type { RegisterFormValuesNoConfirm } from '@/components/auth/RegisterForm';
// Firebase Auth related imports are removed if solely for Google Sign-In.
// If other Firebase auth methods (e.g. email link) were planned, some might remain.
// For now, assuming Google was the only Firebase auth.

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
  };
  error?: unknown;
}

export async function registerUser(data: RegisterFormValuesNoConfirm): Promise<AuthResponse> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, message: 'User with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        role: data.role,
        ...(data.role === 'PATIENT' && data.dateOfBirth && data.gender && {
          patientProfile: {
            create: {
              fullName: data.fullName,
              dateOfBirth: data.dateOfBirth,
              gender: data.gender,
            }
          }
        }),
        ...(data.role === 'DOCTOR' && data.specialty && {
          specialty: data.specialty,
        }),
      },
       select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      }
    });

    return {
      success: true,
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.fullName,
        role: newUser.role as UserRole,
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { 
        return { success: false, message: `An account with this email already exists. Fields: ${error.meta?.target}` };
      }
    }
    return { success: false, message: 'Registration failed. Please try again.', error };
  }
}


export async function loginUser(email: string, passwordAttempt: string, role: UserRole): Promise<AuthResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    if (user.role !== role) {
        return { success: false, message: `Incorrect role selected. Expected ${user.role}, but you selected ${role}.` };
    }

    const isPasswordValid = await bcrypt.compare(passwordAttempt, user.password);

    if (!isPasswordValid) {
      return { success: false, message: 'Incorrect password for the selected role.' };
    }
    
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      message: 'Login successful.',
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.fullName,
        role: userWithoutPassword.role as UserRole,
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed due to a server error. Please try again.', error };
  }
}

// signInWithGoogle function removed
// syncFirebaseUserWithPrisma function removed
