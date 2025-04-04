"use client"

import { Panel, PanelGroup, Avatar, Loader } from "rsuite"
import { useEffect, useState } from "react";
import { toast } from "react-toastify"
import { useSearchParams, useRouter } from "next/navigation"
import { LuAward,LuPencil } from "react-icons/lu"
import { FaTrashAlt } from "react-icons/fa"
import { useQuery } from "@tanstack/react-query"
import CreateTreino from "./components/create-treino"
import EditTreino from "./components/update-treino"
const fetchTreinos = async () => {
    const response = await fetch(`/api/treino`, { method: "GET" });
    const data = await response.json();
    return data.data || [];
  };
const Treinos = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = new URLSearchParams(searchParams.toString()) || ""
  const [idSetor, setIdSetor] = useState<string | null>(searchParams.get("setorId"));

  useEffect(() => {
    // Atualiza o estado sempre que os parâmetros da URL mudam
    const newIdSetor = searchParams.get("setorId");
    if (newIdSetor !== idSetor) {
      setIdSetor(newIdSetor); // Atualiza o estado
    }
  }, [searchParams, idSetor]); // Reage à mudança de searchParams e ao idSetor
  const { 
    data: treinos,
    isLoading,
    isSuccess,
    refetch,
    isFetching,
    isError, 
    error,
   } = useQuery({
    queryKey: ["getTreinosUsuario",idSetor],
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
    toast.promise(fetch(`/api/treino/${id}`, { method: "DELETE" }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Erro ao excluir");
        }
      }), {
      error: {
        render({ data }: any) {
          return (
            data?.response?.data?.message || "Houve um erro ao tentar excluir"
          )
        },
      },
      pending: "Excluindo ...",
      success: {
        async render({ data }) {
          refetch()
          return "Excluido com sucesso"
        },
      },
    })
  }
  const isCreateTreinoModalOpen = searchParams.get("criar-treino") === "open"
  const editEventModal =
    searchParams.get("editar-treino") === "open" &&
    searchParams.get("treino")?.trim() !== ""
  return (
    <div>
      {isCreateTreinoModalOpen && (<CreateTreino  
            onSuccess={() => {
            refetch()
            router.push("?")
          }}
        />
      )}
      {editEventModal && (<EditTreino
            onSuccess={() => {
            refetch()
            router.push("?")
          }}
        />
      )}
      <div className="line-input">
        <div className="input-container">
          <label>Gestão/Setores:</label>
        </div>
      </div>

      <div className="painelMembros">
        {isSuccess && treinos &&
          treinos.map((treino: any) => {
            return (
              <div key={treino.id}  className="item">
                <Panel eventKey={treino.id} header="">
                    <div className="info">
                      <span className="nome">{treino?.nome}</span>
                    </div>
                    <div
                      onClick={() => {
                        router.push(
                          `?editar-treino=open&treino=${treino.id}`
                        )
                      } }
                      className="edit"
                    >
                      <LuPencil />
                    </div>
                    <div
                      onClick={() => handleDeleteTreino(treino.id)}
                      className="deletePage"
                    >
                      <FaTrashAlt />
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
