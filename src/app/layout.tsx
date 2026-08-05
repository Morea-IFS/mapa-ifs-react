import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SideBar from '@/components/SideBar';
import { ThemeProvider } from '@/components/ThemeProvider';

import VLibrasWidget from '@/components/VLibrasWidget';

import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MERO — Campus Interativo',
  description: 'Mapa interativo do campus IFS - Navegue pelos blocos, laboratórios e setores',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          {/* Menu principal */}
          <SideBar />
          
          {/* Tradutor Interativo em Libras */}
          <VLibrasWidget />

          {/* Área principal restrita ao tamanho do sidebar */}
          <main className="ml-0 lg:ml-65 transition-all duration-400 ease-in-out min-h-screen flex flex-col justify-between">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
