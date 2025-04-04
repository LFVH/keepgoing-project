"use client"
//import Button from "@/app/_components/elementos/button"
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams  } from "next/navigation"

export interface IForm {
  id?      : string,
  name     : string,
  telefone : string,
  whatsapp : string,
  email    : string,
  cargo    : string,
  area     : string,
  image    : File,
}

const FormPessoa = ({ onSuccess }: any) => {
  const searchParams = useSearchParams()
  const router = useRouter();
  const treinoId = searchParams.get("pessoa")
  const { data: pessoa, isSuccess, isLoading } = useQuery({
    initialData: [],
    refetchOnWindowFocus: false,
    queryKey: [ treinoId],
    enabled: !!treinoId,
    queryFn: async () => {
      const response = await fetch(`/api/treino/${treinoId}`, { method: "GET" });
      const data = await response.json();
      return data.data || [];
    },
  })
  const imageInput = useRef<{ file: File } | null>(null);
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
        if (isSuccess && pessoa) {
          setIsEditing(true);
          setSetorSelecionado(pessoa?.setorId);
          setAreaSelecionada(pessoa?.area);
          reset({
            id       : pessoa?.id,
            name     : pessoa?.name     || "",
            telefone : pessoa?.telefone || "",
            whatsapp : pessoa?.whatsapp || "",
            email    : pessoa?.email    || "",
            cargo    : pessoa?.cargo    || "",
            area     : pessoa?.area     || "",
          })
        }
      }
      setDataValues()
    }, [pessoa, isSuccess, reset, setValue]);

    async function handlePessoa(
      id: string | null,
      name: string,
      telefone: string,
      whatsapp: string,
      email: string,
      cargo: string,
      area: string,
      setorId: string,
      image: File | null,
      existingImageUrl?: string
    ) {
      try {
        const imageUrl = existingImageUrl || ""; 
    
        const pessoa = {
          name,
          telefone,
          whatsapp,
          email,
          cargo,
          area,
          setorId,
        };
    
        const response = id ? await fetch(`/api/treino/${id}`, { method: "PUT" }) : await fetch(`/api/treino`, { method: "POST" }); 
        if (response.status === 200 && response.json) {
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
      const image = imageInput.current?.file || null;
      const name = data.name.trim();
      const telefone = data.telefone.trim();
      const whatsapp = data.whatsapp.trim();
      const email = data.email.trim();
      const cargo = data.cargo.trim();
      const area = areaSelecionada;
      const setorId = setorSelecionado;
    
      if (!name) {
        throw new Error("O nome é obrigatório");
      }
      if (
        isEditing &&
        name === pessoa?.name &&
        telefone === pessoa?.telefone &&
        whatsapp === pessoa?.whatsapp &&
        email === pessoa?.email &&
        cargo === pessoa?.cargo &&
        area === pessoa?.area &&
        setorId === pessoa?.setorId &&
        !image
      ) {
        toast.info("Nenhuma alteração detectada.");
        return;
      }
    
      toast.promise(
        handlePessoa(
          isEditing ? data?.id ?? null : null,
          name,
          telefone,
          whatsapp,
          email,
          cargo,
          area,
          setorId,
          image,
          isEditing ? pessoa?.image : undefined
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
              return data || (isEditing ? "Atualização finalizada com sucesso" : "Pessoa inserida com sucesso");
            },
          },
        }
      );
    };
  return (
    <div>
      <div className="content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="line-input">
            <div className="column-input">
              <div className="input-container">
                <label htmlFor="name">Nome</label>
                <input {...register("name")} id="name" type="title"/>
              </div>
              <div className="line-input">
                <div className="input-container">
                  <label htmlFor="email">E-mail</label>
                  <input {...register("email")} id="email" type="email"/>
                </div>
                <div className="input-container">
                  <label htmlFor="telefone">Telefone</label>
                  <input {...register("telefone")} id="telefone" type="text"/>
                </div>
                <div className="input-container">
                  <label htmlFor="whatsapp">Whatsapp</label>
                  <input {...register("whatsapp")} id="whatsapp" type="text"/>
                </div>
                <div className="input-container">
                  <label htmlFor="cargo">Cargo</label>
                  <input {...register("cargo")} id="cargo" type="text"/>
                </div>
              </div>
              <div className="line-input">
                <div className="flex flex-col gap-4">
                  <select
                    value={setorSelecionado}
                    onChange={(e) => {
                      setSetorSelecionado(e.target.value);
                      setAreaSelecionada(""); 
                    }}
                    className="border p-2 rounded"
                  >
                    <option value="">Selecione um setor</option>
                    {/* {setoresSelect.map((setor:any) => (
                      <option key={setor.id} value={setor.id}>
                        {setor.nome}
                      </option>
                    ))} */}
                  </select>
                  <select
                    value={areaSelecionada}
                    onChange={(e) => setAreaSelecionada(e.target.value)}
                    className="border p-2 rounded"
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
          </div>

          { <Button 
          disabled={isLoading} type="submit"
          title={isEditing ? "Salvar" : "Adicionar"} onClick={() => {}} /> }
        </form>
      </div>
    </div>
  )
}

export default FormPessoa
