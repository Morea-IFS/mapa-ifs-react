# MERO Mobile — Mapa de Espaços, Recursos e Orientação (IFS)

Aplicativo móvel desenvolvido com **React Native**, **Expo** e **TypeScript** baseado no sistema web **MERO** do Instituto Federal de Sergipe (IFS) — Campus Aracaju.

---

## 📱 Funcionalidades

- **🗺️ Mapa Interativo do Campus (Leaflet em SVG nativo):**
  - Alternância de andares: **Térreo**, **Andar Superior** e **Subsolo**.
  - Marcadores de blocos (A a H) posicionados via coordenadas percentuais idênticas à planta cartográfica original.
  - Indicadores animados, popups rápidos e transições suaves.
- **🧭 Algoritmo de Navegação A\* (Pathfinding):**
  - Cálculo de rota mais curta entre quaisquer salas, entradas e pontos de interesse do campus.
  - Suporte ao filtro de **Acessibilidade Motora** (exclusão de escadas, priorizando rampas acessíveis).
  - Atalho inteligente para **Banheiro mais próximo**.
  - Instruções textuais passo a passo com ícones (`🪜 Escadas`, `♿ Rampas`, `📍 Salas`, `🏢 Trocas de andar`).
- **🏢 Detalhes dos Blocos:**
  - Visualização de plantas baixas esquemáticas de cada andar.
  - Listagem completa de salas, laboratórios, departamentos e setores com seus códigos.
  - Integração direta com o dashboard de **Consumo Elétrico** do Projeto MOREA.
- **🎨 Identidade Visual e Acessibilidade:**
  - 3 temas: **Escuro (Padrão)**, **Claro** e **Alto Contraste**.
  - Paleta de cores oficial (#00d9ff, #0a0a0f, cores identificadoras dos blocos A a H).
  - Persistência da preferência de tema via AsyncStorage.

---

## 🚀 Como Executar

### 1. Pré-requisitos
- Node.js (v18 ou superior)
- App **Expo Go** instalado no seu celular (Android ou iOS)

### 2. Iniciar o servidor de desenvolvimento
```bash
cd mapa-ifs-mobile
npm start
```

### 3. Rodar no Celular
- Abra o aplicativo **Expo Go** no celular.
- Escaneie o QR Code exibido no terminal.

### 4. Rodar nos Emuladores / Web
- Para Android: pressione `a` no terminal (ou `npm run android`)
- Para iOS: pressione `i` no terminal (ou `npm run ios`)
- Para Web: pressione `w` no terminal (ou `npm run web`)

---

## 📁 Estrutura do Projeto

```
mapa-ifs-mobile/
├── assets/                  # Imagens gerais e plantas de cada bloco
│   ├── mapa_geral.png
│   ├── mapa_geral_superior.png
│   ├── mapa_geral_subsolo.png
│   └── mapas/               # Plantas dos blocos A até H
├── src/
│   ├── components/
│   │   ├── AboutModal.tsx    # Modal institucional do IFS / Projeto Morea
│   │   ├── BlocoCard.tsx     # Card estilizado de acesso rápido aos blocos
│   │   ├── CampusMap.tsx     # Motor de renderização do mapa e rotas SVG
│   │   ├── FloorSwitcher.tsx # Seletor de andares (Subsolo, Térreo, Superior)
│   │   ├── Header.tsx        # Topbar com branding MERO e ações de tema
│   │   ├── RouteDrawer.tsx   # Modal de cálculo de rotas com A*
│   │   └── ThemeModal.tsx    # Seletor de temas (Escuro, Claro, Alto Contraste)
│   ├── data/
│   │   ├── blocos.ts         # Dados de todos os blocos, andares e salas
│   │   └── navigationGraph.ts# Grafo e algoritmo A* de busca de rotas
│   ├── screens/
│   │   ├── HomeScreen.tsx    # Tela principal do mapa e acesso rápido
│   │   └── BlocoDetailScreen.tsx # Tela de detalhes do bloco e plantas
│   ├── theme/
│   │   ├── colors.ts         # Paleta de cores oficial (3 temas)
│   │   └── ThemeContext.tsx  # Contexto com persistência local
│   └── types/
│       ├── index.ts          # Tipos de dados (Bloco, Sala, Rota, etc.)
│       └── navigation.ts     # Tipagem das rotas React Navigation
├── App.tsx                   # Ponto de entrada e configuração da navegação
├── app.json                  # Manifesto e configurações do Expo
├── package.json
└── tsconfig.json
```
