'use client'
import CalendarioTreinos from '@/components/Calendario';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Loader } from 'rsuite';
const fetchDiario = async () => {
    const response = await fetch(`/api/letsgo/diario`, { method: "GET" });
    const data = await response.json();
    return data.data || [];
  };
export default function Page() {
    const { 
    data: linhas,
    isLoading,
    isSuccess,
    refetch,
    isFetching,
    isError, 
    error,
   } = useQuery({
    queryKey: ["getTreinosUsuario"],
    initialData: [],
    queryFn: () => fetchDiario(),
  })

  if (isLoading || isFetching) {
    return <Loader/>;
  }
  
  if (isError) {
    console.error("Erro ao buscar em /diario:", error);
    return <p>Erro ao carregar dados</p>;
  }

  return (
    <div className="grid gap-4 md:gap-8">
      <div>
        <h1 className="text-center text-2xl font-bold mb-4">Meu Calendário de Treinos</h1>
        <CalendarioTreinos linhasDiario={linhas} />
      </div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center justify-start h-full">
          <Button asChild title="Registrar treino feito!" variant="treino" size="treino" >
            <Link href="/letsgo/diario?boa-segue-firme=open">
            Registrar Treino Realizado
            </Link>
          </Button>
          <Button asChild title="Histórico de treinos já realizados" variant="treino" size="treino" >
            <Link href="/letsgo/diario">
                Histórico - treinos realizados
            </Link>
          </Button>
          <Button asChild title="Ver, Adicionar ou Remover treinos pre cadastrados" variant="treino" size="treino" >
            <Link href="/letsgo/treinos">
              Plano de treinos
            </Link>
          </Button>
          <Button asChild title="Ver, Adicionar ou Remover treinos pre cadastrados" variant="treino" size="treino" >
            <Link href="/letsgo/statistics">
              Estatísticas
            </Link>
          </Button>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
              Parabéns! Treine, registre, avance!
          </ol>
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