
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { UserRole } from '@/types';
import type { RegisterFormValuesNoConfirm } from '@/components/auth/RegisterForm';


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
      return { success: false, message: 'Un usuario con este correo electrónico ya existe.' };
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
      message: 'Usuario registrado exitosamente.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.fullName,
        role: newUser.role as UserRole,
      }
    };
  } catch (error) {
    console.error('Error de registro:', error);
    if (error instanceof prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { 
        return { success: false, message: `Ya existe una cuenta con este correo electrónico. Campos: ${error.meta?.target}` };
      }
    }
    return { success: false, message: 'El registro falló. Por favor, inténtalo de nuevo.', error };
  }
}


export async function loginUser(email: string, passwordAttempt: string, role: UserRole): Promise<AuthResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'Usuario no encontrado.' };
    }

    if (user.role !== role) {
        return { success: false, message: `Rol incorrecto seleccionado. Se esperaba ${user.role}, pero seleccionaste ${role}.` };
    }

    const isPasswordValid = await bcrypt.compare(passwordAttempt, user.password);

    if (!isPasswordValid) {
      return { success: false, message: 'Contraseña incorrecta para el rol seleccionado.' };
    }
    
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      message: 'Inicio de sesión exitoso.',
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.fullName,
        role: userWithoutPassword.role as UserRole,
      }
    };
  } catch (error) {
    console.error('Error de inicio de sesión:', error);
    return { success: false, message: 'El inicio de sesión falló debido a un error del servidor. Por favor, inténtalo de nuevo.', error };
  }
}
