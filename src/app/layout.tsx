import './globals.css';
import React from 'react';
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

            {children}
          </ClientProviders>
        </body>
      </html>
  )
}


