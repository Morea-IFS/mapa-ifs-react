# MERO — Mapa de Espaços, Recursos e Orientação

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat-square&logo=leaflet&logoColor=white)

> **MERO** é uma aplicação web interativa desenvolvida para o **Instituto Federal de Sergipe (IFS)** no âmbito do **Projeto Morea**. O objetivo é facilitar a localização espacial, navegação guiada e acessibilidade para alunos, professores, servidores e visitantes no campus.

---

## Visão Geral do Projeto

Navegar em grandes campi educacionais pode ser um desafio. O MERO resolve esse problema oferecendo um **mapa interativo de múltiplos andares** combinado com um **sistema de roteamento dinâmico inteligente (A*)**, permitindo que qualquer pessoa trace a rota mais rápida até uma sala, laboratório, setor administrativo ou banheiro no campus.

O projeto foi construído focando em **experiência do usuário (UX)**, **desempenho**, **design moderno** e **acessibilidade universal**.

---

## Principais Funcionalidades

- **Mapeamento Interativo Multi-Andar**: Visualização das plantas baixas do campus divididas por andares (**Térreo**, **Andar Superior** e **Subsolo**), integradas via Leaflet (`L.CRS.Simple`).
- **Motor de Roteamento Inteligente (Algoritmo A*)**:
  - Traça o caminho mais curto entre qualquer sala de origem e destino no campus.
  - Suporta transição suave entre andares por escadas e rampas.
  - **Desenho da Rota Animada**: Exibe linhas pontilhadas animadas, setas direcionais do sentido de deslocamento e marcadores de transição.
- **Destino Inteligente ("Banheiro Mais Próximo")**: Ao selecionar o destino virtual "Banheiro", o sistema calcula dinamicamente qual o sanitário mais próximo a partir da localização atual.
- **Modo Baixa Mobilidade / Acessibilidade**: Opção que reconfigura o grafo de navegação em tempo real, desconsiderando escadas e priorizando rampas de acessibilidade para cadeirantes ou pessoas com restrições de mobilidade.
- **Suporte a Libras (VLibras)**: Widget integrado para tradução em tempo real de conteúdos para a Língua Brasileira de Sinais.
- **Monitoramento Energético (Projeto Morea)**: Integração com painéis IoT em tempo real para acompanhamento do consumo elétrico dos blocos do IFS.
- **Responsivo & Dark Mode**: Interface otimizada para dispositivos móveis e desktops, com alternância de temas claro/escuro.
- **Ferramenta de Calibração Visual (`/calibrar`)**: Interface para desenvolvedores marcarem e exportarem rapidamente as coordenadas percentuais `(x%, y%)` dos nós do mapa.

---

## Como Funciona o Sistema de Navegação

A navegação no MERO é baseada em uma estrutura de **Grafo Espacial** definida em `src/data/navigationGraph.ts`:

1. **Nós (`NAV_NODES`)**: Representam pontos de interesse no mapa com coordenadas percentuais `(x%, y%)`, andar (`floor`) e tipo (`room`, `corridor`, `junction`, `stairs`, `ramp`, `bathroom`).
2. **Arestas (`NAV_EDGES`)**: Representam as conexões físicas trafegáveis entre os nós. Arestas que envolvem escadas são marcadas e desativadas automaticamente quando a opção **Baixa Mobilidade** está ativa.
3. **Algoritmo A* (A-Star)**: Quando o usuário seleciona origem e destino, o algoritmo avalia as distâncias euclidianas e pesos de transição para determinar a rota ideal e gerar as instruções passo a passo.

```
[ Origem (Sala) ] ── (Corredor) ──> [ Junção ] ── (Escada / Rampa) ──> [ Andar Superior ] ──> [ Destino ]
```

---

## Tecnologias Utilizadas

- **Core**: Next.js 16 (App Router) & React 19
- **Linguagem**: TypeScript 5
- **Mapeamento**: Leaflet 1.9.4 + `react-leaflet` 5
- **Estilização**: Tailwind CSS v4 + Vanilla CSS Variables
- **Animações**: Framer Motion
- **Ícones**: Lucide React
- **Acessibilidade**: VLibras Widget
- **Testes**: Jest 29 + React Testing Library 16

---

## Estrutura do Projeto

```
mapa-ifs-react/
├── src/
│   ├── app/
│   │   ├── bloco/[id]/      # Página detalhada da planta e salas de cada bloco
│   │   ├── calibrar/        # Ferramenta dev para cadastro de pontos no mapa
│   │   ├── globals.css      # Estilos globais, temas e animações CSS da rota
│   │   ├── layout.tsx       # Layout base (Sidebar, ThemeProvider, VLibras)
│   │   └── page.tsx         # Página inicial com o Mapa Geral e Roteador
│   ├── assets/              # Plantas baixas (Imagens PNG dos andares)
│   ├── components/
│   │   ├── CampusMap.tsx    # Componente Leaflet do mapa interativo
│   │   ├── FloorSwitcher.tsx# Seletor de andares (Térreo/Superior/Subsolo)
│   │   ├── RouteDrawer.tsx  # Painel de busca e seleção de origem/destino
│   │   ├── RouteOverlay.tsx # Desenho SVG/Polyline da rota animada
│   │   ├── SideBar.tsx      # Barra de navegação lateral
│   │   └── VLibrasWidget.tsx# Componente de Libras
│   ├── data/
│   │   ├── blocos.ts          # Cadastro de blocos, salas e informações
│   │   └── navigationGraph.ts # Grafo espacial e algoritmo A*
│   └── types/               # Definições de tipos TypeScript
```

---

## Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** 18.x ou superior
- **npm**, **yarn**, **pnpm** ou **bun**

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Morea-IFS/mapa-ifs-react.git
   cd mapa-ifs-react
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000)

---

## Adicionando ou Ajustando Rotas (`/calibrar`)

Para adicionar novos pontos ou ajustar conexões no mapa:

1. Acesse `http://localhost:3000/calibrar` no ambiente de desenvolvimento.
2. Selecione o andar e o tipo de nó (`Sala`, `Corredor`, `Junção`, `Escada`, etc.).
3. Clique sobre o mapa para posicionar os pontos e obter as coordenadas exatas `(x%, y%)`.
4. Copie o trecho de código TypeScript gerado e cole em `src/data/navigationGraph.ts`.

---

## Testes Unitários

O MERO possui 100% de cobertura nos testes unitários e de integração das suas
funcionalidades críticas, garantindo alta estabilidade, prevenção de regressões
e validação de acessibilidade.

### Comandos de Teste:
- Executar todos os testes:
   npm run test
- Para executar um em específico é só apertar "p" depois de rodar o comando e escrever o nome do arquivo ou caminho em específico

### Suítes de Testes Cobertas (15 Test Suites / 71 Testes)

1. Páginas & Roteamento (src/app/):
   page.test.tsx: Interação na página principal, fluxo do drawer de rotas, limpeza de rotas e exibição de banners.
   layout.test.tsx: Renderização da estrutura global, sidebar, provedor de tema e widget VLibras.
   bloco/[id]/page.test.tsx: Renderização dos blocos e painéis de consumo de energia IoT.
   calibrar/page.test.tsx: Adição/remoção de nós no mapa, troca de andar e exportação de dados (JSON / TS).

2. Componentes de Interface (src/components/):
   CampusMap.test.tsx: Integração Leaflet, renderização e acessibilidade para leitores de tela (aria-label).
   RouteDrawer.test.tsx: Seleção de salas, busca assíncrona, sanitário mais próximo e descarte de rota com isolamento por timers.
   RouteOverlay.test.tsx: Validação do desenho de linhas SVG e marcadores de waypoints da rota.
   FloorSwitcher.test.tsx: Alternância entre andares e estados acessíveis.
   SideBar.test.tsx: Comportamento de abertura/fechamento em mobile e links.
   ThemeProvider.test.tsx e ThemeSwitcher.test.tsx: Alternância de temas (Claro, Escuro, Alto Contraste) e integração com localStorage.
   VLibrasWidget.test.tsx e Footer.test.tsx: Carregamento de scripts e informações institucionais.

3. Regras de Negócio e Algoritmos (src/data/ & src/types/):
   navigationGraph.test.ts: Integridade dos nós do mapa, unicidade de IDs e eficácia do algoritmo A* (filtro de acessibilidade, transição por rampas).
   blocos.test.ts: Estrutura de dados das salas e blocos institucionais do IFS.
   types/index.test.ts: Validação e tipagem do TypeScript.

---

## Licença e Créditos

Desenvolvido para o **Instituto Federal de Sergipe (IFS)** — **Projeto Morea**.
