import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
  const gabriel = await prisma.user.create({
    data: {
      name: "gabriel Silva de freitas",
      email: "gab@gmail.com",
      image: "https://avatars.githubusercontent.com/u/52713690?v=4",
    },
  })
  const categoria1 = await prisma.categorias.create({
    data: {
      titulo: "Entreterimento",
    },
  })
  const tag1 = await prisma.tags.create({
    data: {
      titulo: "tecnologia",
    },
  })
  const NOTICIA1 = await prisma.noticia.create({
    data: {
      titulo: "Teste da priemria noticia",
      slug: "teste-da-primeira-noticia",
      capa: "",
      categorias: {
        connect: {
          id: categoria1.id,
        },
      },
      tags: {
        connect: {
          id: tag1.id,
        },
      },
      conteudo: {},
      resumo: "Esteé,ooo resumo da priemira oticia publicada no novo site",
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
