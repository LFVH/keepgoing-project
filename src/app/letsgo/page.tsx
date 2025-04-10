'use client'
import { Button } from '@/components/ui/button';
import { LogOutIcon } from '@/components/ui/icons';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="grid gap-4 md:gap-8">
          <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
             <Button asChild title="Registrar treino feito!" variant="treino" size="treino" >
                <Link href="/letsgo/diario?boa-segue-firme=open">
                Registrar Treino Realizado
                </Link>
             </Button>
              <Button asChild title="Histórico de treinos já realizados" variant="treino" size="treino" >
                <Link href="/letsgo/diario">
                   Histórico treinos realizados
                </Link>
              </Button>
              <Button asChild title="Ver, Adicionar ou Remover treinos pre cadastrados" variant="treino" size="treino" >
                <Link href="/letsgo/treinos">
                  Plano de treinos
                </Link>
              </Button>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
              <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
      
                  Obrigado! Treine, registre, avance!
      
              </ol>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="left-4 bottom-4 flex items-center gap-2 p-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition"
              > 
                <LogOutIcon className="w-5 h-5" /> Sair
              </button>
            </footer>
          </div>
    </div>
  );
}
      {/* <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Orders</CardTitle>
          <CardDescription>
            Your orders for today. Keep up the good work!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="flex flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    <Image
                      alt="Image"
                      className="rounded-md object-cover"
                      height="64"
                      src={order.image}
                      style={{
                        aspectRatio: '64/64',
                        objectFit: 'cover',
                      }}
                      width="64"
                    />
                    <div className="grid flex-1 gap-1">
                      <h3 className="font-semibold">{order.name}</h3>
                      <p className="text-sm text-gray-500">
                        Order ID: {order.orderId}
                      </p>
                    </div>
                  </div>

                  <Button size="sm">Track</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card> */}