'use client'

import { Panel, PanelGroup, Avatar, Loader } from "rsuite"
import { toast } from "react-toastify"
import { useSearchParams, useRouter } from "next/navigation"
import { LuPencil } from "react-icons/lu"
import { FaTrashAlt } from "react-icons/fa"
import { useQuery } from "@tanstack/react-query"
import CreateLinhaDiario from "./components/create-diario"
import EditLinhaDiario from "./components/update-diario"
import { Button } from '@/components/ui/button';
import { startTransition } from "react"
import { format } from 'date-fns';
import PlusIcon from "@heroicons/react/24/outline/PlusIcon"
const fetchDiario = async () => {
    const response = await fetch(`/api/letsgo/diario`, { method: "GET" });
    const data = await response.json();
    return data.data || [];
  };
const Linhas = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

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

  const handleDeleteTreino = (id: string) => {
    toast.promise(
      (async () => {
        const response = await fetch(`/api/letsgo/diario/${id}`, { 
          method: "DELETE" 
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao excluir");
        }
        await refetch();
      })(),
      {
        pending: "Excluindo...",
        success: "Excluído com sucesso",
        error: {
          render({ data }: { data: Error }) {
            return data.message;
          }
        }
      }
    );
  }
  const isCreateDiarioModalOpen = searchParams.get("boa-segue-firme") === "open"
  const editDiarioModal =
    searchParams.get("editar-diario") === "open" &&
    searchParams.get("registro")?.trim() !== ""

  const handleSuccess = () => {
    console.log("entrou no original")
    refetch(); 
    startTransition(() => router.push("?"));
  };
  return (  
    
    <div className="p-4 max-w-4xl mx-auto">
    {/* Header Buttons */}
    <div className="flex justify-between items-center">
      <Button 
        title="Voltar ao início" 
        onClick={() => router.push("/letsgo")}
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow transition-colors duration-200"
      >
        Voltar ao início
      </Button>
      
      <div className="mb-4">
        {isCreateDiarioModalOpen || editDiarioModal ? (
          <Button 
            title="Voltar" 
            onClick={() => router.push("?")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow transition-colors duration-200"
          >
            Voltar
          </Button>
        ) : (
          <Button
            title="Adicionar"
            onClick={() => { router.push("?boa-segue-firme=open");}}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition-colors duration-200"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        )}
      </div>
    </div>
    {(linhas.length === 0) && (
      <div className="text-center">Seus treinos registrados aparecerão aqui (↓↑)</div>
    )}
      {isCreateDiarioModalOpen && (
        <CreateLinhaDiario onSuccess={handleSuccess}/>
      )}

      {editDiarioModal && (
        <EditLinhaDiario onSuccess={handleSuccess}/>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isSuccess && linhas && (
  <div className="space-y-2">
    {Object.entries(
      linhas.reduce((acc: Record<string, typeof linhas[0][]>, linha: any) => {
        const dateKey = format(new Date(linha.data), 'dd/MM/yyyy');
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(linha);
        return acc;
      }, {} as Record<string, typeof linhas[0][]>)
    ).map(([date, dayLines]) => (
      <div key={date} className="w-full">
        {/* Linha da data */}
        <div className="text-sm font-medium text-gray-600 mb-1 ml-1">{date}</div>
        
        {/* Container dos itens - agora com wrap */}
        <div className="flex flex-row gap-2 w-full">
          {(dayLines as typeof linhas[0][]).map((linha) => (
            <div 
              key={linha.id} 
              className="flex-1 min-w-[200px] max-w-[300px] border rounded-md p-2 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-2 h-full">
                <div 
                  className="w-3 h-3 rounded-sm mt-1 flex-shrink-0" 
                  style={{ backgroundColor: linha?.treino?.corCalendario || '#cccccc' }}
                />
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500">
                      {format(new Date(linha.data), 'HH:mm')}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => router.push(`?editar-diario=open&registro=${linha.id}`)}
                        className="text-gray-400 hover:text-blue-500 p-0.5"
                      >
                        <LuPencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteTreino(linha.id)}
                        className="text-gray-400 hover:text-red-500 p-0.5"
                      >
                        <FaTrashAlt className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="font-medium text-sm mt-0.5 truncate">
                    {linha?.treino?.nome || '------'}
                  </p>
                  
                  {linha?.comentarioGeral && (
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {linha.comentarioGeral}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  )
}

export default Linhas
