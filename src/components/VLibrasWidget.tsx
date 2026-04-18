'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function VLibrasWidget() {
  const [mounted, setMounted] = useState(false);

  // Espera montar no lado do cliente para evitar erro fatal de "Hydration Mismatch" 
  // que estava destruindo os botões do site e o carregamento do mapa!
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div 
        // @ts-ignore
        vw="true" className="enabled"
      >
        <div 
          // @ts-ignore
          vw-access-button="true" className="active"
        ></div>
        <div 
          // @ts-ignore
          vw-plugin-wrapper="true"
        >
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>

      <Script 
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore
          if (window.VLibras) {
             // @ts-ignore
             new window.VLibras.Widget('https://vlibras.gov.br/app');
          }
        }}
      />
    </>
  );
}
