
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { User, UserRole } from '@/types'; // Assuming UserRole is defined in your types
import type { RegisterFormValuesNoConfirm } from '@/components/auth/RegisterForm'; // We'll define this type later

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name?: string | null; // Prisma's string? becomes string | null
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
        // Patient specific fields, if role is PATIENT
        ...(data.role === 'PATIENT' && data.dateOfBirth && data.gender && {
          patientProfile: {
            create: {
              fullName: data.fullName, // Duplicate fullName for patient profile for simplicity
              dateOfBirth: data.dateOfBirth,
              gender: data.gender,
              // Other patient profile fields can be added here if needed
            }
          }
        }),
        // Doctor specific fields, if role is DOCTOR
        ...(data.role === 'DOCTOR' && data.specialty && {
          specialty: data.specialty,
        }),
        // Admin doesn't have extra fields during registration by default here
      },
       select: { // Select only necessary fields to return
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
        role: newUser.role as UserRole, // Cast because Prisma returns string for enum
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed. Please try again.', error };
  }
}


export async function loginUser(email: string, password tentativo: string, role: UserRole): Promise<AuthResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    if (user.role !== role) {
        return { success: false, message: `Incorrect role selected for this user. Expected ${user.role}.` };
    }

    const isPasswordValid = await bcrypt.compare(password tentativo, user.password);

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password.' };
    }
    
    // Do not send password back, even the hash
    const { password, ...userWithoutPassword } = user;


    return {
      success: true,
      message: 'Login successful.',
      user: { // Ensure the returned user object matches the structure expected by the frontend
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.fullName, // Assuming fullName is the display name
        role: userWithoutPassword.role as UserRole,
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed. Please try again.', error };
  }
}
