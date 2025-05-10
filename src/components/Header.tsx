import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-black text-white  shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo-kpg.png" 
            alt="KeepGoings Logo" 
            width={150} 
            height={40} 
            className="h-10 w-auto"
          />
        </Link>
        
        {/* Navegação Desktop */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-blue-600 font-medium hover:text-blue-800">Home</Link>
          <Link href="/servicos" className="hover:text-blue-600 transition">Serviços</Link>
          <Link href="/sobre" className="hover:text-blue-600 transition">Sobre Nós</Link>
          <Link href="/blog" className="hover:text-blue-600 transition">Blog</Link>
          <Link href="/contato" className="hover:text-blue-600 transition">Contato</Link>
        </nav>
        
        {/* Botão CTA e Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/demo" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition hidden md:block"
          >
            Solicitar Demonstração
          </Link>
          {/* Ícone do menu mobile */}
          <button className="md:hidden text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Menu Mobile (oculto por padrão) */}
      <div className="md:hidden bg-white py-2 px-4 shadow-md hidden">
        <Link href="/" className="block py-2 border-b">Home</Link>
        <Link href="/servicos" className="block py-2 border-b">Serviços</Link>
        <Link href="/sobre" className="block py-2 border-b">Sobre Nós</Link>
        <Link href="/blog" className="block py-2 border-b">Blog</Link>
        <Link href="/contato" className="block py-2">Contato</Link>
      </div>
    </header>
  );
}