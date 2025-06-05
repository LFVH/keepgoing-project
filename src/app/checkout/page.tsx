// src/app/checkout/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SignupForm } from '../signup/form';
import { loadStripe } from "@stripe/stripe-js";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [assinatura, setAssinatura] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && assinatura) {
      handlePayment(assinatura);
    }
  }, [status, assinatura]);

  const handlePayment = async (assinatura: number) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const checkoutResponse = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assinatura }),
      });

      const stripeClient = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUB_KEY as string
      );

      if (!stripeClient) throw new Error("Stripe failed to initialize.");

      const { sessionId } = await checkoutResponse.json();
      await stripeClient.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error(error);
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
  console.log(session)
  if (session?.status === 'ativo'){
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">Assinatura ativa!</h2>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Escolha seu plano
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Assine agora e tenha acesso a todos os conteúdos exclusivos
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Plano 1 */}
          <div 
            className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${assinatura === 1 ? 'ring-4 ring-purple-500 transform scale-105' : 'ring-1 ring-gray-200'}`}
            onClick={() => setAssinatura(1)}
          >
            <div className="px-6 py-8 bg-white">
              <h3 className="text-2xl font-bold text-center text-gray-900">Plano Mensal</h3>
              <div className="mt-4 flex justify-center">
                <span className="text-4xl font-extrabold text-gray-900">R$20,00</span>
                <span className="text-lg font-medium text-gray-500 self-end">/mês</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-gray-700">Registro de treinos</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-gray-700">Visualizar Progressão</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-gray-700">Registro diário</span>
                </li>

                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-gray-700">Acesso 24/7</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50 text-center">
              <button
                className={`w-full px-4 py-3 rounded-md font-medium ${assinatura === 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {assinatura === 1 ? 'Selecionado' : 'Selecionar'}
              </button>
            </div>
          </div>

          {/* Plano 2 (Destaque) */}
          <div 
            className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${assinatura === 2 ? 'ring-4 ring-purple-500 transform scale-105' : 'ring-2 ring-purple-300'}`}
            onClick={() => setAssinatura(2)}
          >
            <div className="px-6 py-8 bg-purple-700 text-white">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-bold rounded-bl-lg">
                MAIS POPULAR
              </div>
              <h3 className="text-2xl font-bold text-center">Plano semestral</h3>
              <div className="mt-4 flex justify-center">
                <span className="text-4xl font-extrabold">R$96,00</span>
                <span className="text-lg font-medium opacity-80 self-end">/trimestre</span>
              </div>
              <div className="mt-2 text-center text-purple-100">
                <span>Economize 20%</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3">Todos os benefícios do mensal</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3">Suporte prioritário</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50 text-center">
              <button
                className={`w-full px-4 py-3 rounded-md font-medium ${assinatura === 2 ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'}`}
              >
                {assinatura === 2 ? 'Selecionado' : 'Selecionar'}
              </button>
            </div>
          </div>

          {/* Plano 3 */}
          <div 
            className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${assinatura === 3 ? 'ring-4 ring-purple-500 transform scale-105' : 'ring-1 ring-gray-200'}`}
            onClick={() => setAssinatura(3)}
          >
            <div className="px-6 py-8 bg-white">
              <h3 className="text-2xl font-bold text-center text-gray-900">Plano Anual</h3>
              <div className="mt-4 flex justify-center">
                <span className="text-4xl font-extrabold text-gray-900">R$144,00</span>
                <span className="text-lg font-medium text-gray-500 self-end">/ano</span>
              </div>
              <div className="mt-2 text-center text-gray-500">
                <span>Economize 40%</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-gray-700">Todos os benefícios do trimestral</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-gray-700">Mais foco no que realmente faz diferença!</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50 text-center">
              <button
                className={`w-full px-4 py-3 rounded-md font-medium ${assinatura === 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {assinatura === 3 ? 'Selecionado' : 'Selecionar'}
              </button>
            </div>
          </div>
        </div>

        {assinatura && (
          <div className="mt-8 text-center">
            <button
              onClick={() => handlePayment(assinatura)}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Continuar para o pagamento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}