import CtaSection from '@/components/CtaSection';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* Hero Section */}
        <header className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transforme seus <span className="text-blue-400">treinos</span> em <span className="text-blue-400">conquistas</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            O diário digital que vai te ajudar a manter a consistência, acompanhar seu progresso e alcançar resultados extraordinários.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => router.push('/checkout')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105"
            >
              Comece Agora - 7 Dias Grátis
            </button>
            <button 
              onClick={() => router.push('/#servicos')} className="border-2 border-blue-400 text-blue-400 hover:bg-blue-900/30 font-bold py-4 px-8 rounded-lg text-lg transition duration-300">
              Conheça os Benefícios
            </button>
          </div>
          
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-blue-500 rounded-xl opacity-20 blur-3xl -z-10"></div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-2 max-w-4xl mx-auto">
              {/* Aqui iria a imagem do dashboard/app */}
              <div className="h-80 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Pré-visualização do Keep Going Diary</span>
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="py-20 bg-gray-800/50" id='servicos'>
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Por que milhares de pessoas escolhem o <span className="text-blue-400">Keep Going Diary</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition duration-300">
                <div className="text-blue-400 text-4xl mb-4">🏋️</div>
                <h3 className="text-xl font-bold mb-3">Registro Inteligente</h3>
                <p className="text-gray-300">
                  Anote seus treinos de forma rápida e organizada. Visualize seu histórico completo e identifique padrões para melhorar seu desempenho.
                </p>
              </div>
              
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition duration-300">
                <div className="text-blue-400 text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-3">Análise de Progresso</h3>
                <p className="text-gray-300">
                  Gráficos e estatísticas que mostram sua evolução. Veja como você está melhorando mês após mês e mantenha-se motivado.
                </p>
              </div>
              
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition duration-300">
                <div className="text-blue-400 text-4xl mb-4">💪</div>
                <h3 className="text-xl font-bold mb-3">Desafios Personalizados</h3>
                <p className="text-gray-300">
                  Perceba desafios baseados no seu nível atual. Supere seus limites com metas alcançáveis e mensuráveis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              O que dizem nossos <span className="text-blue-400">apoiadores</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                <p className="text-gray-300 italic mb-6">
                  "Depois de 3 meses usando o Keep Going Diary, finalmente consegui manter a consistência nos treinos. Vi meu desempenho melhorar e nunca me senti tão motivado!"
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-700 mr-4"></div>
                  <div>
                    <h4 className="font-bold">Luiz Vieira</h4>
                    <p className="text-gray-400 text-sm">Fundador do app</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900/50 to-gray-900/50" id='comecarhoje'>
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sua jornada fitness começa aqui
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Não deixe seus treinos caírem no esquecimento. Registre, analise e evolua com o Keep Going Diary.
            </p>
            
            <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Experimente grátis por 7 dias</h3>
              <p className="text-gray-300 mb-8">
                Depois, apenas R$19,90/mês. Cancele quando quiser.
              </p>
              
              <button 
              onClick={() => router.push('/checkout')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg text-lg transition duration-300 transform hover:scale-105">
                Quero Meu Diário de Treinos
              </button>
              
              <p className="text-sm text-gray-400 mt-6">
                🔒 Pagamento 100% seguro. Seu progresso merece essa ferramenta.
              </p>
            </div>
          </div>
        </section>

        <CtaSection />
      </div>
    </>
  );
};

export default Home;