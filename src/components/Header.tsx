'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  return (
    <header className="bg-black text-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bebas flex items-center text-green-600 font-bold">
          <Image 
            src="/logo-kpg.png" 
            alt="KeepGoing Logo" 
            width={75} 
            height={20} 
            className="object-contain"
          />
          KeepGoingDiary
        </Link>
        
        {/* Navegação Desktop */}
        <nav className="hidden md:flex space-x-8 items-center">
          
          {isLoggedIn ? (
            <>
            <Link href="/letsgo" className="hover:text-blue-400 transition">Início/Calendário</Link>
            <Link href="/letsgo/diario" className="hover:text-blue-400 transition">Meu Diário</Link>
            <Link href="/letsgo/treinos" className="hover:text-blue-400 transition">Plano de Treinos</Link>
            <Link href="/statistics" className="block py-2 border-b border-gray-800">Estatísticas</Link>
            </>
          ) : (
            <>
            <Link href="/" className="hover:text-blue-400 transition">Início</Link>
            <Link href="/#servicos" className="hover:text-blue-400 transition">Benefícios</Link>
            <Link href="/#precos" className="hover:text-blue-400 transition">Preços</Link>
            </>
          )}
        </nav>
        
        {/* Botões de Ação */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  href="/letsgo/diario" 
                  className="flex items-center space-x-2 hover:text-blue-400"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                    {session.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm">{session.user.name || 'Usuário'}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition"
                >
                  Sair
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="bg-transparent hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium transition hidden md:block"
              >
                Entrar
              </Link>
              <Link 
                href="/registro" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition hidden md:block"
              >
                Comece Grátis
              </Link>
            </>
          )}
          
          {/* Ícone do menu mobile */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Menu Mobile (oculto por padrão) */}
      <div className="md:hidden bg-gray-900 py-2 px-4 shadow-md hidden">
        {isLoggedIn ? (
          <>
            <Link href="/letsgo" className="hover:text-blue-400 transition">Início/Calendário</Link>
            <Link href="/letsgo/diario" className="hover:text-blue-400 transition">Meu Diário</Link>
            <Link href="/letsgo/treinos" className="hover:text-blue-400 transition">Plano de Treinos</Link>
            <Link href="/statistics" className="block py-2 border-b border-gray-800">Estatísticas</Link>
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block py-2 text-red-400 w-full text-left"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link href="/" className="block py-2 border-b border-gray-800">Início</Link>
            <Link href="/#servicos" className="block py-2 border-b border-gray-800">Benefícios</Link>
            <Link href="/#precos" className="block py-2 border-b border-gray-800">Preços</Link>
            <Link href="/login" className="block py-2 border-b border-gray-800">Entrar</Link>
            <Link href="/signup" className="block py-2 text-blue-400">Comece Grátis</Link>
          </>
        )}
      </div>
    </header>
  );
}