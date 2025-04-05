import './globals.css';
import React, { Suspense } from 'react';
import ClientProviders from "@/utils/Providers"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}){
  return (
  
      <html lang="pt">
        <body>
        
          <ClientProviders>

          <Suspense fallback={<div>Carregando página...</div>}>
              {children}
          </Suspense>
          </ClientProviders>
        </body>
      </html>
  )
}


