'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { blocos } from '@/data/blocos';
import ThemeSwitcher from './ThemeSwitcher';
import { Map, MapPin } from 'lucide-react';

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Overlay Escurecido para Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-3000 animate-in fade-in duration-300 md:hidden" 
          onClick={closeSidebar} 
        />
      )}

      {/* Botão Hambúrguer Mobile */}
      <button
        className={`fixed top-4 left-4 z-5000 w-12 h-12 flex flex-col justify-center items-center gap-1.25 bg-fundo-secundario/80 backdrop-blur-md border border-borda rounded-md cursor-pointer transition-all duration-300 hover:bg-fundo-cartao hover:border-destaque hover:shadow-[0_0_15px_var(--color-destaque-fraco)] md:hidden`}
        onClick={toggleSidebar}
        aria-label={isOpen ? "Fechar Menu" : "Abrir Menu Principal"}
        aria-expanded={isOpen}
        aria-controls="menu-lateral"
      >
        <span className={`block w-5 h-0.5 bg-texto-principal rounded-xs transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.75' : ''}`} aria-hidden="true" />
        <span className={`block w-5 h-0.5 bg-texto-principal rounded-xs transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} aria-hidden="true" />
        <span className={`block w-5 h-0.5 bg-texto-principal rounded-xs transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.75' : ''}`} aria-hidden="true" />
      </button>

      {/* Painel da SideBar */}
      <aside 
        id="menu-lateral"
        role="navigation"
        aria-label="Navegação Principal do Campus"
        className={`fixed top-0 left-0 w-65 max-w-[85vw] h-dvh bg-fundo-secundario/95 backdrop-blur-xl border-r border-borda z-4000 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
        aria-hidden={!isOpen}
      >
        {/* Cabeçalho */}
        <div className="pl-16 md:pl-5 pr-5 pt-6 pb-4 border-b border-borda min-h-19 flex items-center">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" aria-hidden="true"><Map className="text-destaque" /></span>
            <span className="text-lg font-bold bg-linear-to-br from-destaque to-indigo-500 bg-clip-text text-transparent tracking-tight">
              If Map
            </span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5" aria-label="Navegação de Setores e Blocos">
          <Link
            href="/"
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 relative ${
              isActive('/') 
                ? 'bg-destaque-fraco text-destaque' 
                : 'text-texto-secundario hover:bg-white/5 hover:text-texto-principal'
            }`}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            {isActive('/') && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 bg-destaque rounded-r-sm" aria-hidden="true" />}
            <span className="w-5 flex justify-center" aria-hidden="true"><MapPin size={18} /></span>
            <span>Mapa Geral</span>
          </Link>

          <div className="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-texto-auxiliar" aria-hidden="true">
            <span>Blocos</span>
          </div>

          {blocos.map((bloco) => (
            <Link
              key={bloco.id}
              href={`/bloco/${bloco.id}`}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 relative ${
                isActive(`/bloco/${bloco.id}`) 
                  ? 'bg-destaque-fraco text-destaque' 
                  : 'text-texto-secundario hover:bg-white/5 hover:text-texto-principal'
              }`}
              aria-current={isActive(`/bloco/${bloco.id}`) ? 'page' : undefined}
            >
              {isActive(`/bloco/${bloco.id}`) && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 bg-destaque rounded-r-sm" />}
              <span
                className="w-2 h-2 rounded-full shrink-0 ml-1.5 shadow-[0_0_6px_currentColor]"
                style={{ backgroundColor: bloco.color || 'var(--color-destaque)' }}
              />
              <span>{bloco.name}</span>
            </Link>
          ))}
        </nav>

        {/* Rodapé / Switcher de Tema */}
        <div className="p-4 border-t border-borda flex flex-col gap-3">
          <ThemeSwitcher />
          <div className="text-center">
            <span className="text-[11px] tracking-wide text-texto-auxiliar">Projeto Morea · IFS</span>
          </div>
        </div>
      </aside>
    </>
  );
}