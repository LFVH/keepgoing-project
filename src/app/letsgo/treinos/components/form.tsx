"use client"
//import Button from "@/app/_components/elementos/button"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams  } from "next/navigation"

export interface IForm {
  id?      : string,
  nome     : string,
  coment   : string,
  corCalendario : string,
}

const FormTreino = ({ onSuccess }: any) => {
  const searchParams = useSearchParams()
  const treinoId = searchParams.get("treino")
  const { data: treino, isSuccess, isLoading } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: [ treinoId],
    enabled: !!treinoId,
    queryFn: async () => {
      const response = await fetch(`/api/treino/${treinoId}`, { method: "GET" });
      const data = await response.json();
      return data.treino || [];
    },
  })
  const { register, handleSubmit, setValue, reset} = useForm<IForm>()
  const [isEditing, setIsEditing] = useState(false);
  const [setorSelecionado, setSetorSelecionado] = useState("");
  const [areaSelecionada, setAreaSelecionada] = useState("");
  // const { 
  //   data: setoresSelect
  //  } = useQuery({
  //   queryKey: ["getSetoresSelect"],
  //   initialData: [],
  //   queryFn: async () => {
  //     const response = await api.get(`/pessoas/setorAtual`)
  //     return response.data.body.data || []
  //   },
  // })


  //const areasDisponiveis = setoresSelect.find((setor:any) => setor.id === setorSelecionado)?.areas || [];

  useEffect(() => {
      const setDataValues = () => {
        if (isSuccess && treino) {
          setIsEditing(true);
          setSetorSelecionado(treino?.setorId);
          setAreaSelecionada(treino?.area);
          reset({
            id       : treino?.id,
            nome     : treino?.nome     || "",
            coment : treino?.comentarioGeral || "",
            corCalendario : treino?.corCalendario || "",
          })
        }
      }
      setDataValues()
    }, [treino, isSuccess, reset, setValue]);

    async function handleTreino(
      id: string | null,
      nome: string,
      comment: string,
      corCalendario: string,
    ) {
      try {
    
        const treino = {
          nome,
          comentarioGeral: comment,
          corCalendario: corCalendario,
        };
    
        const response = id ? await fetch(`/api/treino/${id}`, { method: "PUT",headers: {
          "Content-Type": "application/json", 
        }, body: JSON.stringify(treino), }) : await fetch(`/api/treino`, { method: "POST",headers: {
          "Content-Type": "application/json", 
        },body: JSON.stringify(treino), }); 
        if (!response.ok) {
          return response.json.toString ; 
        }
      } catch (error: any) {
        console.log(error);
        throw new Error(
          error?.response?.data.body.message
            ? error?.response?.data.body.message
            : error.message
        );
      }
    }

    const onSubmit = async (data: IForm) => {
      const nome = data.nome.trim();
      const comment = data.coment.trim();
      const corCalendario = data.corCalendario.trim();
    
      if (!nome) {
        throw new Error("O nome é obrigatório");
      }
      if (
        isEditing &&
        nome === treino?.nome &&
        comment === treino?.comentarioGeral &&
        corCalendario === treino?.corCalendario
      ) {
        toast.info("Nenhuma alteração detectada.");
        return;
      }
    
      toast.promise(
        handleTreino(
          isEditing ? data?.id ?? null : null,
          nome,
          comment,
          corCalendario,
        ),
        {
          error: {
            render({ data }: any) {
              return data.message || "Erro ao salvar dados";
            },
          },
          pending: isEditing ? "Atualizando ..." : "Criando ...",
          success: {
            render({ data }): any {
              onSuccess();
              return data || (isEditing ? "Atualização finalizada com sucesso" : "Treino criado com sucesso");
            },
          },
        }
      );
    };
  return (
<div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm">
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    <div className="space-y-4">
      {/* Nome Field */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <input
          {...register("nome")}
          id="nome"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

        <div>
          <label htmlFor="coments" className="block text-sm font-medium text-gray-700 mb-1">
            Comentários sobre o treino
          </label>
          <input
            {...register("coment")}
            id="comment"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="corCalendario" className="block text-sm font-medium text-gray-700 mb-1">
            Comentários sobre o treino
          </label>
          <input
            {...register("corCalendario")}
            id="corCalendario"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
       

      {/* Setor and Area Selects */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Setor
          </label>
          <select
            value={setorSelecionado}
            onChange={(e) => {
              setSetorSelecionado(e.target.value);
              setAreaSelecionada(""); 
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione um setor</option>
            {/* {setoresSelect.map((setor:any) => (
              <option key={setor.id} value={setor.id}>
                {setor.nome}
              </option>
            ))} */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Área
          </label>
          <select
            value={areaSelecionada}
            onChange={(e) => setAreaSelecionada(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!setorSelecionado}
          >
            <option value="">Selecione uma área</option>
            {/* {areasDisponiveis.map((area:any) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))} */}
          </select>
        </div>
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        <span>Processando...</span>
      ) : isEditing ? (
        'Salvar'
      ) : (
        'Adicionar'
      )}
    </button>
  </form>
</div>
  )
}

export default FormTreino
