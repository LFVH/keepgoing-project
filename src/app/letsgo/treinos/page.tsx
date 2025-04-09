'use client'

import { Panel, PanelGroup, Avatar, Loader } from "rsuite"
import { toast } from "react-toastify"
import { useSearchParams, useRouter } from "next/navigation"
import { LuAward,LuPencil } from "react-icons/lu"
import { FaTrashAlt } from "react-icons/fa"
import { useQuery } from "@tanstack/react-query"
import CreateTreino from "./components/create-treino"
import EditTreino from "./components/update-treino"
import { Button } from '@/components/ui/button';
import { startTransition } from "react"
const fetchTreinos = async () => {
    const response = await fetch(`/api/treino`, { method: "GET" });
    const data = await response.json();
    return data.data || [];
  };
const Treinos = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { 
    data: treinos,
    isLoading,
    isSuccess,
    refetch,
    isFetching,
    isError, 
    error,
   } = useQuery({
    queryKey: ["getTreinosUsuario"],
    initialData: [],
    queryFn: () => fetchTreinos(),
  })

  if (isLoading || isFetching) {
    return <Loader/>;
  }
  
  if (isError) {
    console.error("Erro ao buscar treinos:", error);
    return <p>Erro ao carregar dados</p>;
  }

  const handleDeleteTreino = (id: string) => {
    toast.promise(
      (async () => {
        const response = await fetch(`/api/treino/${id}`, { 
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
  const isCreateTreinoModalOpen = searchParams.get("criar-treino") === "open"
  const editEventModal =
    searchParams.get("editar-treino") === "open" &&
    searchParams.get("treino")?.trim() !== ""

  const handleSuccess = () => {
    refetch(); 
    startTransition(() => router.push("?"));
  };
  return (
    
    <div className="p-4 max-w-4xl mx-auto">
  <div className="mb-4">
    {isCreateTreinoModalOpen || editEventModal ? (
      <Button 
        title="Voltar" 
        onClick={() => router.push("?")}
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        Voltar
      </Button>
    ) : (
      <Button
        title="Adicionar"
        onClick={() => router.push("?criar-treino=open")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Adicionar
      </Button>
    )}
  </div>

  {isCreateTreinoModalOpen && (
    <CreateTreino onSuccess={handleSuccess}/>
  )}

  {editEventModal && (
    <EditTreino onSuccess={handleSuccess}/>
  )}

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {isSuccess && treinos &&
      treinos.map((treino: any) => {
        return (
          <div 
            key={treino.id}  
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 relative"
          >
            <Panel eventKey={treino.id} header="" className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full p-4">
              <div className="flex items-start space-x-3">
                {/* Quadrado com a cor do treino */}
                <div 
                  className="w-5 h-5 rounded-sm flex-shrink-0 mt-1" 
                  style={{ backgroundColor: treino.corCalendario || '#cccccc' }}
                />
                
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-lg font-semibold text-gray-800">{treino?.nome}</span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-1">
                    {/* Comentário geral truncado */}
                    <div className="flex-grow pr-4">
                      {treino?.comentarioGeral && (
                        <p className="text-gray-600 text-sm">
                          {treino.comentarioGeral.length > 60 
                            ? `${treino.comentarioGeral.substring(0, 60)}...` 
                            : treino.comentarioGeral}
                        </p>
                      )}
                    </div>
                    
                    {/* Botões alinhados à direita */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`?editar-treino=open&treino=${treino.id}`)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                        title="Editar"
                      >
                        <LuPencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTreino(treino.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="Excluir"
                      >
                        <FaTrashAlt className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
          </div>
        )
      })}
  </div>
</div>
  )
}

export default Treinos
