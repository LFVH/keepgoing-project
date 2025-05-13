import Link from "next/link";

export default function CtaSection() {
    return (
      <section className="bg-green-400 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Pronto para transformar seu corpo?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Planeje, Treine, Registre, Evolua!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/contato" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-bold transition"
            >
              Bora
            </Link>
            <Link 
              href="/demo" 
              className="bg-transparent border-2 border-white hover:bg-blue-700 px-6 py-3 rounded-md font-bold transition"
            >
              Solicitar Demonstração
            </Link>
          </div>
        </div>
      </section>
    );
  }