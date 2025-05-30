
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu, Search, UserCircle, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

const USER_ROLE_KEY = 'currentUserRole';
const USER_DATA_KEY = 'currentUserData';


export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Usuario");
  const [userInitial, setUserInitial] = useState<string>("U");


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserData = localStorage.getItem(USER_DATA_KEY);
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          const name = userData.name || userData.email || "Usuario";
          setUserName(name);
          setUserInitial(name.charAt(0).toUpperCase());
        } catch (e) {
          console.error("Error al parsear datos de usuario desde localStorage", e);
          setUserName("Usuario");
          setUserInitial("U");
        }
      } else {
        setUserName("Usuario");
        setUserInitial("U");
      }
    }
  }, [pathname]); 

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_ROLE_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    }
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden md:block font-semibold text-lg text-primary">MediView Hub</div>
      
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pacientes, citas..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={`https://placehold.co/40x40.png?text=${userInitial}`} alt={userName} data-ai-hint="user avatar"/>
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Alternar menú de usuario</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta ({userName})</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile"> 
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings"> 
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
