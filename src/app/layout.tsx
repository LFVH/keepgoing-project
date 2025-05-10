import './globals.css';
import React, { Suspense } from 'react';
import ClientProviders from "@/utils/Providers"
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CtaSection from '@/components/CtaSection';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Keep Going - Diário de Treinos',
  description: 'Transforme seu corpo com seu esforço e com registro diário de progresso',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        <div className="min-h-screen flex flex-col">
          {/* Header com navegação */}
          <Header />
          
          {/* Conteúdo principal */}
          <main className="flex-grow">
          <ClientProviders>
          <Suspense fallback={<div>Carregando página...</div>}>
              {children}
          </Suspense>
          </ClientProviders>
          </main>
          
          {/* Seção CTA antes do footer */}
          <CtaSection />
          
          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}