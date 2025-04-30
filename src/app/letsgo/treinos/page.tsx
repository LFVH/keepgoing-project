'use client'

import { Panel, PanelGroup, Avatar, Loader } from "rsuite"
import { toast } from "react-toastify"
import { useSearchParams, useRouter } from "next/navigation"
import { LuAward,LuPencil } from "react-icons/lu"
import { FaArchive, FaUndo } from 'react-icons/fa';
import { FaTrashAlt } from "react-icons/fa"
import { useQuery } from "@tanstack/react-query"
import CreateTreino from "./components/create-treino"
import EditTreino from "./components/update-treino"
import { Button } from '@/components/ui/button';
import { PlusIcon, CheckIcon, ArchiveBoxIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { startTransition, useState } from "react"
const fetchTreinos = async (ativo?: boolean | null) => {
  const url = `/api/treino${ativo !== null ? `?ativo=${ativo}` : ''}`;
  const response = await fetch(url, { method: "GET" });
  const data = await response.json();
  return data.data || [];
};
const Treinos = () => { 
  const [filtroAtivo, setFiltroAtivo] = useState<boolean | null>(true);
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
    queryKey: ["getTreinosUsuario",filtroAtivo],
    initialData: [],
    queryFn: () => fetchTreinos(filtroAtivo),
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
    console.log("entrou no original")
    refetch(); 
    startTransition(() => router.push("?"));
  };
  const toggleTreinoStatus = async (treinoId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/treino/${treinoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAtivo: !currentStatus }),
      });
  
      if (!response.ok) {
        throw new Error('Falha ao atualizar status');
      }
  
      // Atualiza a lista de treinos após a mudança
      refetch();
    } catch (error) {
      console.error('Erro ao alternar status:', error);
      // Você pode adicionar um toast de erro aqui se quiser
    }
  };
  return (
    
    <div className="p-4 max-w-4xl mx-auto space-y-4">
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
        {isCreateTreinoModalOpen || editEventModal ? (
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
            onClick={() => {
              setFiltroAtivo(true);
              router.push("?criar-treino=open");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition-colors duration-200"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        )}
      </div>
    </div>
  
    {/* Filter Buttons */}
    <div className="flex gap-2 mb-4">
      <Button
        title="Mostrar ativos"
        onClick={() => setFiltroAtivo(true)}
        className={`px-4 py-2 rounded-md shadow transition-colors duration-200 ${
          filtroAtivo === true 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
      >
        <CheckIcon className="mr-2 h-4 w-4" />
        Ativos
      </Button>
      
      <Button
        title="Mostrar arquivados"
        onClick={() => setFiltroAtivo(false)}
        className={`px-4 py-2 rounded-md shadow transition-colors duration-200 ${
          filtroAtivo === false 
            ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
      >
        <ArchiveBoxIcon className="mr-2 h-4 w-4" />
        Arquivados
      </Button>
      
      <Button
        title="Mostrar todos"
        onClick={() => setFiltroAtivo(null)}
        className={`px-4 py-2 rounded-md shadow transition-colors duration-200 ${
          filtroAtivo === null 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
      >
        <ListBulletIcon className="mr-2 h-4 w-4" />
        Todos
      </Button>
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
                        <p title={treino.comentarioGeral} className="text-gray-600 text-sm">
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
                        onClick={() => toggleTreinoStatus(treino.id, treino.isAtivo)}
                        className={`p-1 rounded-full transition-colors ${
                          treino.isAtivo
                            ? 'text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50'
                            : 'text-green-500 hover:text-green-700 hover:bg-green-50'
                        }`}
                        title={treino.isAtivo ? "Arquivar" : "Ativar"}
                      >
                        {treino.isAtivo ? (
                          <FaArchive className="w-5 h-5" /> // Ícone para arquivar
                        ) : (
                          <FaUndo className="w-5 h-5" /> // Ícone para reativar
                        )}
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
