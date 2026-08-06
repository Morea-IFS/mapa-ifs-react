'use client';

import {Compass, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-borda bg-fundo-secundario/80 backdrop-blur-md mt-16 transition-colors duration-300">
      <div className="max-w-300 mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* Sobre */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-destaque via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                <Compass size={18} aria-hidden />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-destaque to-purple-400 bg-clip-text text-transparent">
                MERO
              </span>
            </div>
            <p className="text-xs text-texto-secundario leading-relaxed max-w-md">
              <strong className="text-texto-principal">Mapa de Espaços, Recursos e Orientação</strong>, um sistema de navegação cartográfica interativa do Instituto Federal de Sergipe (IFS). Projetado para facilitar a localização de salas, blocos e rotas acessíveis no campus.
            </p>
          </div>

          {/* Recursos & Institucional */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-texto-principal">
              Recursos
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-texto-auxiliar">
              <li>
                <a 
                  href="https://morea-ifs.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-destaque transition-colors duration-150 flex items-center gap-1"
                >
                  Projeto MOREA <ExternalLink size={10} aria-hidden />
                </a>
              </li>
              <li className="pt-1 text-[11px] leading-relaxed text-texto-auxiliar">
                Integrado com suporte a <strong className="text-texto-secundario">VLibras</strong> e navegação com filtro para <strong className="text-texto-secundario">Baixa Mobilidade</strong>.
              </li>
            </ul>
          </div>

        </div>

        {/* Linha Divisória de Rodapé */}
        <div className="pt-6 border-t border-borda/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-texto-auxiliar">
          <p>
            © {currentYear} <strong className="text-texto-secundario">MERO</strong>
          </p>
          <p className="flex items-center gap-1">
            Mais um <strong className="text-destaque font-medium">Projeto Morea</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
