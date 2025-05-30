import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from "@vercel/speed-insights/next"

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: 'MediView Hub',
  description: 'Gestión integral de pacientes para profesionales médicos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${lato.variable} font-sans antialiased`}>
        {children}
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
