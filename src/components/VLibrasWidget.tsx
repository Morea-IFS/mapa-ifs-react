'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

// Declaramos a estrutura exata para o TypeScript, substituindo o "any"
// e garantindo a tipagem segura do construtor Widget.
declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => void;
    };
  }
}

export default function VLibrasWidget() {
  const [mounted, setMounted] = useState(false);

  // Espera montar no lado do cliente para evitar erro fatal de "Hydration Mismatch" 
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div 
        // @ts-expect-error - Atributo customizado exigido pela biblioteca VLibras
        vw="true" 
        className="enabled"
      >
        <div vw-access-button="true" className="active"></div>
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>

      <Script 
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.VLibras) {
             new window.VLibras.Widget('https://vlibras.gov.br/app');
          }
        }}
      />
    </>
  );
}