"use client"
import { useEffect, useRef, useState } from "react"
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { unstable_cacheLife } from "next/cache"

export interface IForm {
  id?: string,
  treinoId: number | null,
  comment: string | null,
  peso: number | null,
  data: string | null,
}
interface ExercicioOption {
  id: number
  nome: string
}
interface TreinoOption {
  id: number
  nome: string
}


interface AddExecucaoForm {
  exercicioId: number | null
  reps: string | undefined
  sets: string | undefined
  carga: string | undefined
  comentarioExec: string | undefined
  minutos: number | null     
  segundos: number | null
  tempo: number | null
}


interface Execucao {
  id: number,
  reps: number,
  sets: number,
  carga: number,
  tempo: number,
  percepcao: string,
  exercicio: {
    id: number,
    nome: string
  },
  comentarioExecucao?: string
}

interface LinhaComExecucoes {
  comentarioGeral: string
  id: number,
  data: Date,
  pesoCorporal: number,
  treino: {
    id: number,
    nome: string
  },
  execucoes: Execucao[]
}

const FormDiario = ({ onSuccess }: any) => {
  const router = useRouter();
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>()
  const [isSearching, setIsSearching] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [isAddExecucaoOpen, setIsAddExecucaoOpen] = useState(false) ;
  //const [exerciciosVazios, setExerciciosVazios] = useState<number[]>([]);
  const [exerciciosOptions, setExerciciosOptions] = useState<ExercicioOption[]>([])
  const [treinosOptions, setTreinosOptions] = useState<ExercicioOption[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTreinoTerm, setSearchTreinoTerm] = useState('')
  const [selectedExercicio, setSelectedExercicio] = useState<ExercicioOption | null>(null);
  const [selectedTreino, setSelectedTreino] = useState<TreinoOption | null>(null);
  const [addExecucaoForm, setAddExecucaoForm] = useState<AddExecucaoForm>({
    exercicioId: null,
    reps: '',
    sets: '',
    carga: '',
    comentarioExec: '',
    minutos: 0,
    segundos: 0,
    tempo: null, 
  })
  const searchParams = useSearchParams()
  const registroId = searchParams.get("registro")
  const { data: linha, isSuccess, isLoading,isError, refetch } = useQuery<LinhaComExecucoes>({
    refetchOnWindowFocus: false,
    queryKey: ['diario', registroId],
    enabled: !!registroId,
    queryFn: async () => {
      if (isNaN(Number(registroId))) {
        router.push('/letsgo/diario');
        return null;
      }
      const response = await fetch(`/api/diario/${registroId}`, { method: "GET" });
      const data = await response.json();
      return data.linha || null;
    },
  })
  const { register, handleSubmit, setValue, reset, getValues,formState: { errors },watch  } = useForm<IForm>({
    defaultValues: {
      data: new Date().toISOString().slice(0, 16) 
    }
  });

  const currentTreinoId = watch("treinoId");
  const currentData = watch("data");

  useEffect(() => {
    const setDataValues = () => {
      if (isSuccess && linha) {
        setIsEditing(true);
        const rawDate = linha?.data || "";
        const formattedDate = rawDate 
          ? new Date(rawDate).toISOString().slice(0, 16)
          : "";
        reset({
          id: linha?.id.toString(),
          data: formattedDate,
          comment: linha?.comentarioGeral || "",
          peso: linha?.pesoCorporal || undefined,
          treinoId: linha?.treino?.id || null,
        })
        setSelectedTreino({id: linha?.treino?.id, nome: linha?.treino?.nome});
      }
    }
    setDataValues()
  }, [linha, isSuccess, reset, setValue]);

  async function handleLinha(
    id: string | null,
    data: string | null,
    comment: string | undefined,
    peso: number | null,
    treinoId: number | null,
  ) {
    try {
      const diario = {
        data,
        comentarioGeral: comment,
        pesoCorporal: peso,
        treinoId,
      };
      console.log(diario);
      const response = id ? await fetch(`/api/diario/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diario),
      }) : await fetch(`/api/diario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diario),
      });
      
      if (!response.ok) {
        toast.error("!response.ok");
        return response.json.toString;
      }
      return response.json();
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data.body.message
          ? error?.response?.data.body.message
          : error.message
      );
    }
  }

  const handleRemoveExecucao = async (execucaoId: number) => {
    try {
      const response = await fetch(`/api/execucaoreal/${execucaoId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diarioId: registroId,
        }),

      });

      if (!response.ok) {
        console.log("!response.ok")
        toast.error("Falha ao remover execução");
      }

      toast.success("Execução removida com sucesso");
      refetch();
    } catch (error) {
      toast.error("Erro ao remover execução");
      console.error(error);
    }
  };

    const handleRemoveExercicio = async (exercicio?: ExercicioOption) => {
      if (!confirm('Remover as execuções e o exercício "'+ exercicio?.nome + '" desse registro?' )) return;
      try {
        const response = await fetch(`/api/execucaoreal/exercicio/${exercicio?.id}`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registroId,
          }),
  
        });
  
        if (!response.ok) {
          console.log("!response.ok")
          toast.error("Falha ao remover");
        }
  
        toast.success("Removido com sucesso");
        refetch();
      } catch (error) {
        toast.error("Erro ao remover");
        console.error(error);
      }
    };
  
  const fetchTreinos = async (term = '', treino?: TreinoOption) => {
    try {
      if(treino){
        setSelectedTreino(treino);
        setValue("treinoId", treino.id);

        setSearchTreinoTerm(term)
      } else if (term.length >= 2){
        setIsSearching(true)
        const response = await fetch(`/api/treinos?search=${term}`)
        const responseData = await response.json()
        setTreinosOptions(responseData.treinos)
      }
    } catch (error) {
      console.error("Erro ao buscar treinos: ", error)
    } finally {
      setIsSearching(false)
    }
  }

  const fetchExercicios = async (term = '', exercicio?: ExercicioOption) => {
    try {
      if(exercicio){
        setSelectedExercicio(exercicio);
        setAddExecucaoForm(prev => ({ ...prev, exercicioId: exercicio.id }));

        setSearchTerm(term)
      } else if (term.length >= 2){
        setIsSearching(true)
        const response = await fetch(`/api/exercicios?search=${term}`)
        const responseData = await response.json()
        setExerciciosOptions(responseData.exercicios)
      }
    } catch (error) {
      console.error("Erro ao buscar exercícios: ", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleOpenAddExecucao = async (exercicio?: ExercicioOption) => {
    if (!registroId) {
      try {
        const response = await saveLinha(getValues());
        if (!response || !response.data?.id) {
          console.log("Falha ao salvar o registro");
          return;
        }
    
        await router.push(
          `?editar-diario=open&registro=${response.data.id}&fastaddexec=true`,
          { scroll: false }
        );
      } catch (error) {
        console.log("Erro durante o submit:", error);
      } finally {
        console.log("Finalizado o processo");
      }
    
      return;
    }
    await fetchExercicios('',exercicio)
    setIsAddExecucaoOpen(true)
  }

  const handleCloseAddExecucao = () => {
    const hasChanges = addExecucaoForm.exercicioId || addExecucaoForm.reps || addExecucaoForm.sets || addExecucaoForm.carga;

    const shouldClose = !hasChanges || confirm('Você tem alterações não salvas. Deseja realmente fechar?');
  
    if (shouldClose) {
      resetAddExecucaoForm();
      setIsAddExecucaoOpen(false);
      router.push(`?editar-diario=open&registro=${registroId}`);
    }
  }

  const resetAddExecucaoForm = () => {
    setAddExecucaoForm({
      exercicioId: null,
      reps: '',
      sets: '',
      carga: '',
      comentarioExec: '',
      minutos: null,
      segundos: null,
      tempo: null,
    })
    setSearchTerm('')
    setSelectedExercicio(null);
  }
  
  const handleSearchTreinos = async (term: string) => {
    setSearchTreinoTerm(term)
  
    if (searchTimeout) clearTimeout(searchTimeout)
    if (term.length >= 2) {
      const timeout = setTimeout(() => {
        fetchTreinos(term)
      }, 300)
      setSearchTimeout(timeout)
    } else {
      setTreinosOptions([])
    }
  }

  const handleSearchExercicios = async (term: string) => {
    setSearchTerm(term)
  
    // Cancela o timeout anterior
    if (searchTimeout) clearTimeout(searchTimeout)
    
    // Só pesquisa após 300ms do último caractere digitado
    if (term.length >= 2) {
      const timeout = setTimeout(() => {
        fetchExercicios(term)
      }, 300)
      setSearchTimeout(timeout)
    } else {
      setExerciciosOptions([])
    }
  }
  
  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout)
    }
  }, [searchTimeout])

  const handleAddExecucaoSubmit = async (shouldClose: boolean) => {
    // Validação
    if (!addExecucaoForm.exercicioId) {
      toast.error('Selecione um exercício')
      return
    }""

    const {
      reps = parseInt(addExecucaoForm.reps ? addExecucaoForm.reps : ''),
      sets = parseInt(addExecucaoForm.sets ? addExecucaoForm.sets : ''),
      carga = parseFloat(addExecucaoForm.carga ? addExecucaoForm.carga : ''),
      comentarioExec = addExecucaoForm.comentarioExec || "",
      tempo = addExecucaoForm.tempo,
    } = addExecucaoForm;

    try {
      const response = await fetch('/api/execucaoreal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diarioId: registroId,
          exercicioId: addExecucaoForm.exercicioId,
          reps: reps,
          sets: sets,
          carga: carga,
          comentarioExecucao: comentarioExec,
          tempo: tempo,
          //isEmpty: (exerciciosVazios.includes(addExecucaoForm.exercicioId))
          //ordem: nrOrdem,
        }),
      })

      if (!response.ok) { 
        console.log("(!response.ok)");
        toast.error('Falha ao adicionar execução')
      }

      toast.success('Execução adicionada com sucesso')
      refetch()

      if (shouldClose) {
        resetAddExecucaoForm()
        setIsAddExecucaoOpen(false)
      } else {
        setAddExecucaoForm(prev => ({
          ...prev,
          reps: '',
          sets: '',
          carga: '',
          comentarioExec:'',
        }))
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro ao adicionar execução')
    }
  }

  const onSubmit = async (data: IForm) => {
    const result = await saveLinha(data);
    if (result) {
      onSuccess();
    }
  };

  const saveLinha = async (data: IForm) => {
    const dataLinha = data.data;
    const comment = data?.comment?.trim();
    const peso = data.peso;
    const treinoId = data.treinoId;
  
    if (!dataLinha) {
      toast.error("Data é obrigatório");
      return;
    }
  
    if (
      isEditing &&
      dataLinha === new Date(linha?.data ? linha?.data : "").toISOString().slice(0, 16) &&
      comment === linha?.comentarioGeral &&
      peso === linha?.pesoCorporal &&
      treinoId === linha?.treino.id
    ) {
      toast.info("Nenhuma alteração detectada.");
      return;
    }
  
    try {
      const diarioSalvo = await toast.promise(
        handleLinha(
          isEditing ? data?.id ?? null : null,
          dataLinha,
          comment,
          peso,
          treinoId,
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
              return data.message || (isEditing ? "Atualização finalizada com sucesso" : "Registro criado com sucesso");
            },
          },
        }
      );
      return diarioSalvo;
    } catch (error) {
      toast.error("Erro ao submeter os dados.");
      return null;
    }
  };

  const execucoesPorExercicio = (() => {
    const agrupado: Record<number, { exercicio: { id: number, nome: string }, execucoes: Execucao[] }> = {};
    //const tempExerciciosVazios: number[] = []
    linha?.execucoes?.forEach((execucao) => {
      // Verifica se todos os campos relevantes estão vazios/zero
      const camposVazios = 
        (!execucao.reps || execucao.reps === 0) &&
        (!execucao.sets || execucao.sets === 0) &&
        (!execucao.comentarioExecucao || execucao.comentarioExecucao.trim() === "") &&
        (!execucao.tempo || execucao.tempo === 0) &&
        (!execucao.percepcao || execucao.percepcao.trim() === "");
  
      // Se NÃO estiverem todos vazios (ou seja, se pelo menos um campo tem valor válido)
      const exercicioId = execucao.exercicio.id;
      if (!agrupado[exercicioId]) {
        agrupado[exercicioId] = {
          exercicio: execucao.exercicio,
          execucoes: []
        };
      }
      if (!camposVazios) {
        agrupado[exercicioId].execucoes.push(execucao);
      }
      //  else{
      //   tempExerciciosVazios.push(exercicioId);
      // }
    });
    //setExerciciosVazios(tempExerciciosVazios);
    return Object.values(agrupado);
  })();

  const handleTreinoClick = async (treino: TreinoOption) => {

    const shouldOverride = confirm('Deseja sobrescrever todos os exercicios/execucões pelos do treino selecionado?');
   
    setSelectedTreino(treino);
    setValue("treinoId", treino.id);
    setSearchTreinoTerm('');
  
    try {
      const responseSubmit = await saveLinha(getValues());
  
      if (!responseSubmit || !responseSubmit.data?.id) {
        console.log("Falha ao salvar o registro");
        throw new Error('Falha ao alterar treino');
      }
      
      const diarioId = registroId ? registroId : responseSubmit.data?.id;
      if(!diarioId){
        throw new Error('Erro ID 3988672');
      }
      if(shouldOverride){
        const response = await fetch(`/api/migrarExecucao/${treino.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            diarioId,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Erro ao migrar execução');
        }
      }
      await router.push(
        `?editar-diario=open&registro=${diarioId}`,
        { scroll: false })
    } catch (error) {
      console.error('Erro complicado: ', error);
    }
  };

  const isValidDate = !isNaN((new Date(currentData ? currentData : "")).getTime());
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            {/* Seletor de Treino */}
            <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Treino*</label>
            <input
              type="text"
              placeholder="Buscar treinos..."
              value={selectedTreino ? selectedTreino.nome : searchTreinoTerm}
              onChange={(e) => {
                if (selectedTreino && e.target.value !== selectedTreino.nome) {
                  setSelectedTreino(null);
                  setValue("treinoId", null);
                }
                handleSearchTreinos(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />

            {isSearching && <div className="text-sm text-gray-500">Buscando...</div>}
            
            {!selectedTreino && searchTreinoTerm && (
                <div className="
                absolute          // Posiciona sobre outros elementos
                z-50              // Garante que fique acima de tudo
                w-full           // Largura igual ao input
                mt-1             // Espaço do input
                max-h-40          // Altura máxima
                overflow-y-auto  // Rolagem automática
                bg-white          // Fundo branco
                border           // Borda
                rounded-md       // Cantos arredondados
                shadow-lg        // Sombra para efeito de elevação
              ">
                  {treinosOptions.map(treino => (
                    <div
                      key={treino.id}
                      className={`p-2 hover:bg-gray-100 cursor-pointer ${currentTreinoId  === treino.id ? 'bg-blue-100' : ''}`}
                      onClick={() => handleTreinoClick(treino)}
                    >
                      {treino.nome}
                    </div>
                  ))}
                </div>
            )}
            </div>
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                Data do Registro *
              </label>
              <input
                {...register("data", {
                  required: "A data é obrigatória",
                  valueAsDate: true,
                })}
                id="data"
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.data ? "border-red-500" : "border-gray-300"
                }`}
              />
            {errors.data && (
              <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>
            )}
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Comentários sobre o treino
              </label>
              <input
                {...register("comment")}
                id="comment"
                type="text"
                placeholder="Prestar atenção no movimento."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">
              Peso Corporal (kg)
              </label>
              <input
                {...register("peso", { valueAsNumber: true })}
                id="peso"
                type="number"
                step="0.01"
                min="0"
                max="999.99"
                placeholder="72.50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={() => handleOpenAddExecucao()}
              className={`px-3 py-1 text-white rounded ${
                currentTreinoId && currentData ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!currentTreinoId || !currentData || !isValidDate}
            >
              Adicionar Exercício
            </button>
            {(!currentTreinoId || !currentData) && (
              <span className="text-red-500 text-sm">
                {!currentTreinoId && !currentData
                  ? "Selecione um treino e uma data"
                  : !currentTreinoId
                  ? "Selecione um treino"
                  : "Selecione uma data"}
              </span>
            )}
          </div>
        </div>
        {execucoesPorExercicio && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Exercícios do Treino</h3>
            {execucoesPorExercicio.map(({ exercicio, execucoes }) => {
            const execucoesOrdenadas = (execucoes || []).sort((a, b) => a.id - b.id);
            return (
              
              <div key={exercicio.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">{exercicio.nome}</h4>
                  <button
                    type="button"
                    onClick={() => handleOpenAddExecucao(exercicio)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    +Execução
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercicio(exercicio)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-900"
                  >
                    Remover tudo
                  </button>
                </div>
                {execucoes && (
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Repetições
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Séries
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Carga (kg)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tempo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comentário
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {execucoesOrdenadas && execucoesOrdenadas.map((execucao: any) => (
                      <tr key={execucao.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {execucao.reps}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {execucao.sets}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {execucao.carga}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {execucao.tempo != null ? 
                          `${Math.floor(execucao.tempo / 60).toString().padStart(2, '0')}:${(execucao.tempo % 60).toString().padStart(2, '0')}`
                          : '--:--' /* ou '00:00' se preferir */
                        }
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {execucao.comentarioExecucao || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveExecucao(execucao.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                )}
              </div>
            )})}
          </div>
        )}

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
        <Dialog open={isAddExecucaoOpen||searchParams.get("fastaddexec")==="true"} onClose={handleCloseAddExecucao} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
        
          <DialogPanel className="w-full max-w-md rounded bg-white p-6 relative">
          <button
            onClick={handleCloseAddExecucao}
            className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Fechar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
            <DialogTitle className="text-lg font-bold mb-4">Adicionar Execução</DialogTitle>

            <div className="space-y-4">
              {/* Seletor de Exercício */}
              <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Exercício</label>
              <input
                type="text"
                placeholder="Buscar exercício..."
                value={selectedExercicio ? selectedExercicio.nome : searchTerm}
                onChange={(e) => {
                  // Se tiver um exercício selecionado e o usuário começar a digitar, limpa a seleção
                  if (selectedExercicio && e.target.value !== selectedExercicio.nome) {
                    setSelectedExercicio(null);
                    setAddExecucaoForm(prev => ({ ...prev, exercicioId: null }));
                  }
                  handleSearchExercicios(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />

              {isSearching && <div className="text-sm text-gray-500">Buscando...</div>}
              
              {!selectedExercicio && searchTerm && (
                  <div className="
                  absolute          // Posiciona sobre outros elementos
                  z-50              // Garante que fique acima de tudo
                  w-full           // Largura igual ao input
                  mt-1             // Espaço do input
                  max-h-40          // Altura máxima
                  overflow-y-auto  // Rolagem automática
                  bg-white          // Fundo branco
                  border           // Borda
                  rounded-md       // Cantos arredondados
                  shadow-lg        // Sombra para efeito de elevação
                ">
                    {exerciciosOptions.map(exercicio => (
                      <div
                        key={exercicio.id}
                        className={`p-2 hover:bg-gray-100 cursor-pointer ${addExecucaoForm.exercicioId === exercicio.id ? 'bg-blue-100' : ''}`}
                        onClick={() => {
                          setSelectedExercicio(exercicio);
                          setAddExecucaoForm(prev => ({ ...prev, exercicioId: exercicio.id }));
                          // Limpa a busca mantendo o item selecionado
                          setSearchTerm('');
                        }}
                      >
                        {exercicio.nome}
                      </div>
                    ))}
                  </div>
              )}
            </div>

              {/* Campos numéricos */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repetições</label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    step="1"
                    value={addExecucaoForm.reps}
                    onChange={(e) => setAddExecucaoForm(prev => ({ ...prev, reps: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Séries</label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    step="1"
                    value={addExecucaoForm.sets}
                    onChange={(e) => setAddExecucaoForm(prev => ({ ...prev, sets: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carga (kg)</label>
                  <input
                    type="number"
                    min="0"
                    max="9999.99"
                    step="0.10"
                    value={addExecucaoForm.carga}
                    onChange={(e) => setAddExecucaoForm(prev => ({ ...prev, carga: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo de Execução (ex.: Prancha Isométrica)
                </label>
                <div className="flex space-x-2">
                  {/* Input de Minutos (0-120) */}
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={addExecucaoForm.minutos ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const minutos = value === '' ? null : Math.min(360, Math.max(0, parseInt(value)) || 0);
                      const segundos = addExecucaoForm.segundos || 0;
                      setAddExecucaoForm(prev => ({
                        ...prev,
                        minutos,
                        tempo: (minutos === null || minutos === 0) && segundos === 0 ? null : (minutos || 0) * 60 + segundos
                      }));
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Backspace' || e.key === 'Delete') {
                        // Permite que o valor seja completamente apagado
                        if ((e.target as HTMLInputElement).value === '0') {
                          setAddExecucaoForm(prev => ({
                            ...prev,
                            minutos: null,
                            tempo: addExecucaoForm.segundos || addExecucaoForm.segundos === 0 ? (addExecucaoForm.segundos || 0) : null
                          }));
                        }
                      }
                    }}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Minutos"
                  />

                  {/* Input de Segundos (0-59) */}
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={addExecucaoForm.segundos ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const segundos = value === '' ? null : Math.min(59, Math.max(0, parseInt(value) || 0));
                      const minutos = addExecucaoForm.minutos || 0;
                      setAddExecucaoForm(prev => ({
                        ...prev,
                        segundos,
                        tempo: (segundos === null || segundos === 0) && minutos === 0 ? null : (minutos || 0) * 60 + (segundos || 0)
                      }));
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Backspace' || e.key === 'Delete') {
                        // Permite que o valor seja completamente apagado
                        if ((e.target as HTMLInputElement).value === '0') {
                          setAddExecucaoForm(prev => ({
                            ...prev,
                            segundos: null,
                            tempo: addExecucaoForm.minutos || addExecucaoForm.minutos === 0 ? (addExecucaoForm.minutos || 0) * 60 : null
                          }));
                        }
                      }
                    }}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Segundos"
                  />
                </div>
              </div>
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comentário</label>
            <input
              type="text"
              value={addExecucaoForm.comentarioExec}
              onChange={(e) => setAddExecucaoForm(prev => ({ ...prev, comentarioExec: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => handleAddExecucaoSubmit(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Adicionar e manter
              </button>
              <button
                type="button"
                onClick={() => handleAddExecucaoSubmit(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Adicionar e fechar
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      </form>
    </div>
  )
}

export default FormDiario