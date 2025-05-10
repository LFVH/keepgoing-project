import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna 1 - Logo e descrição */}
          <div>
            <Image 
              src="/logo-white.png" 
              alt="KeepGoinG Logo" 
              width={150} 
              height={40} 
              className="h-10 w-auto mb-4"
            />
            <p className="text-gray-300 text-sm">
              Soluções completas em marketing digital para alavancar seu negócio e gerar leads qualificados.
            </p>
          </div>
          
          {/* Coluna 2 - Links rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
              <li><Link href="/servicos" className="text-gray-300 hover:text-white transition">Serviços</Link></li>
              <li><Link href="/sobre" className="text-gray-300 hover:text-white transition">Sobre Nós</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition">Blog</Link></li>
              <li><Link href="/contato" className="text-gray-300 hover:text-white transition">Contato</Link></li>
            </ul>
          </div>
          
          {/* Coluna 3 - Serviços */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li><Link href="/servicos/geracao-leads" className="text-gray-300 hover:text-white transition">Geração de Leads</Link></li>
              <li><Link href="/servicos/marketing-conteudo" className="text-gray-300 hover:text-white transition">Marketing de Conteúdo</Link></li>
              <li><Link href="/servicos/seo" className="text-gray-300 hover:text-white transition">SEO</Link></li>
              <li><Link href="/servicos/midia-paga" className="text-gray-300 hover:text-white transition">Mídia Paga</Link></li>
              <li><Link href="/servicos/automacao-marketing" className="text-gray-300 hover:text-white transition">Automação de Marketing</Link></li>
            </ul>
          </div>
          
          {/* Coluna 4 - Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>Av. Paulista, 1000</p>
              <p>São Paulo - SP</p>
              <p>CEP: 01310-100</p>
              <p>Email: contato@email.com</p>
              <p>Telefone: (11) 9999-9999</p>
            </address>
          </div>
        </div>
        
        {/* Rodapé inferior */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} KeepGoinG. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/politica-privacidade" className="text-gray-400 hover:text-white text-sm transition">
              Política de Privacidade
            </Link>
            <Link href="/termos-uso" className="text-gray-400 hover:text-white text-sm transition">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}