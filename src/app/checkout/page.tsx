// src/app/checkout/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SignupForm } from '../signup/form';
import { NextPage } from 'next';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      handlePayment();
    }
  }, [status]);

  const handlePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/pagamentorecebido', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao processar pagamento');
      }

      router.push('/letsgo');
    } catch (error) {
      console.error('Erro no pagamento:', error);
      // Mostrar feedback de erro para o usuário
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">Faça login para continuar</h2>
          <SignupForm 
            onLoginSuccess={() => {
              router.push('/checkout');
            }} 
          />
        </div>
      </div>
    );
  }

  if (status === 'loading' || isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">Processando...</h2>
          <p className="text-center">Por favor, aguarde enquanto processamos sua requisição.</p>
        </div>
      </div>
    );
  }

  return null;
}