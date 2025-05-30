
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { UserRole } from '@/types';
import type { RegisterFormValuesNoConfirm } from '@/components/auth/RegisterForm';
import { auth as firebaseAuth } from '@/lib/firebase'; // Firebase Auth instance
import { GoogleAuthProvider, signInWithPopup, type User as FirebaseUser } from 'firebase/auth';

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
    // Check if it's a Prisma known error (e.g., unique constraint)
    if (error instanceof prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint failed
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

// This function will run on the client-side due to Firebase SDK usage for popups.
// We mark it as client-callable but it will interact with server actions indirectly if needed
// or directly with Prisma if we adapt this to be an API route.
// For now, it will return Firebase user data, and Prisma sync would be handled after.
export async function signInWithGoogle(): Promise<AuthResponse> {
  // This function's body will be called from the client, so we can't use 'use server' here.
  // Instead, the component calling this will handle client-side Firebase logic
  // and then call a server action to sync with Prisma if needed.
  // This is a placeholder structure; the actual Firebase call will be in LoginForm.
  return { success: false, message: "signInWithGoogle needs to be called from client." };
}


export async function syncFirebaseUserWithPrisma(firebaseUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): Promise<AuthResponse> {
  'use server'; // This part IS a server action
  if (!firebaseUser.email) {
    return { success: false, message: "Google Sign-In did not provide an email address." };
  }

  try {
    let userInDb = await prisma.user.findUnique({
      where: { email: firebaseUser.email },
    });

    if (userInDb) {
      // User exists, return their data
      return {
        success: true,
        message: 'User successfully signed in with Google.',
        user: {
          id: userInDb.id,
          email: userInDb.email,
          name: userInDb.fullName,
          role: userInDb.role as UserRole,
        },
      };
    } else {
      // User does not exist, create them in Prisma
      // For simplicity, new Google users default to 'PATIENT' role and a placeholder password hash.
      // A real app might have a more complex onboarding or role selection.
      // Firebase handles actual auth; password here is just for Prisma model compatibility.
      const placeholderPassword = await bcrypt.hash(`firebase_${firebaseUser.uid}`, 10);
      
      const newUser = await prisma.user.create({
        data: {
          email: firebaseUser.email,
          fullName: firebaseUser.displayName || firebaseUser.email,
          password: placeholderPassword, // Required by schema, but Firebase handles auth
          role: 'PATIENT', // Default role for new Google sign-ups
          // Create a patient profile by default as well
          patientProfile: {
            create: {
              fullName: firebaseUser.displayName || firebaseUser.email,
              dateOfBirth: new Date('1900-01-01'), // Placeholder DOB
              gender: 'PREFER_NOT_TO_SAY', // Placeholder gender
            }
          }
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
        message: 'New user registered with Google and created in database.',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.fullName,
          role: newUser.role as UserRole,
        },
      };
    }
  } catch (error) {
    console.error('Prisma Sync Error after Google Sign-In:', error);
     if (error instanceof prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { 
        return { success: false, message: `Error syncing user: An account with this email already exists. Fields: ${error.meta?.target}` };
      }
    }
    return { success: false, message: 'Failed to sync user with database after Google Sign-In.', error };
  }
}
