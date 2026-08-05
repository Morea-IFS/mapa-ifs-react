# Documento de Especificação de Requisitos de Software (SRS) — MERO

> **Sistema:** MERO — *Mapa de Espaços, Recursos e Orientação*  
> **Instituição:** Instituto Federal de Sergipe (IFS) — Projeto Morea  
> **Padrão:** IEEE 830 / ISO/IEC/IEEE 29148  
> **Versão:** 1.0.0

---

## 1. Introdução

Este documento especifica a totalidade dos **Requisitos Funcionais (RF)**, **Requisitos Não Funcionais (RNF)** e **Regras de Negócio (RN)** da aplicação **MERO**. A especificação segue padrões de engenharia de software realistas para garantir rastreabilidade, testabilidade e clareza arquitetural.

---

## 2. Requisitos Funcionais (RF)

### 2.1 Subsistema de Mapeamento e Cartografia Interativa

| ID | Nome do Requisito | Descrição Detalhada do Requisito |
| :--- | :--- | :--- |
| **RF-001** | Visualização do Mapa Interativo 2D | O sistema deve exibir um mapa cartográfico interativo 2D do campus do IFS utilizando o motor Leaflet com suporte a controle de zoom, arraste e navegação fluida. |
| **RF-002** | Coordenadas Cartesianas Personalizadas | O sistema deve utilizar a projeção cartesiana simples do Leaflet (`L.CRS.Simple`) para mapear as imagens vetoriais/plantas baixas do campus sem depender de serviços externos de mapas de satélite. |
| **RF-003** | Carregamento Assíncrono do Mapa | O sistema deve carregar dinamicamente o mapa interativo 2D sem renderização no servidor (SSR: false), exibindo um indicador visual de carregamento (spinner) até que todos os ativos estejam prontos. |
| **RF-004** | Alternância de Andares do Campus | O sistema deve disponibilizar botões de seleção de andar (**Térreo**, **Andar Superior** e **Subsolo**), alterando a imagem de fundo do mapa e filtrando os blocos visíveis correspondentes. |
| **RF-005** | Transição Suave Entre Andares | O sistema deve aplicar um efeito visual de sobreposição (*fade/transition*) de 200ms durante a troca de andar para evitar oscilações ou cortes bruscos de renderização. |
| **RF-006** | Marcadores Personalizados de Bloco | O sistema deve renderizar marcadores visuais estilizados para cada bloco presente no andar ativo, apresentando cores exclusivas por bloco e efeito de pulso luminoso animado. |
| **RF-007** | Efeito de Pulso nos Marcadores de Bloco | O sistema deve apresentar um efeito visual de pulso luminoso animado em torno dos marcadores de bloco para facilitar a identificação visual no mapa. |
| **RF-008** | Popups Informativos de Bloco | O sistema deve abrir um popup ao clicar no marcador de um bloco, exibindo seu nome, descrição textual resumida, contagem de andares, contagem total de salas e um botão para acessar os detalhes completos. |
| **RF-009** | Estatísticas nos Popups de Bloco | O sistema deve exibir a contagem dinâmica de andares e salas dentro dos popups e nos cartões de cada bloco. |
| **RF-010** | Destaque da Rota com Opacidade Reduzida | O sistema deve reduzir automaticamente a opacidade dos marcadores de bloco padrão para 45% enquanto uma rota estiver ativa, destacando o caminho no mapa. |
| **RF-011** | Ajuste Automático de Fronteiras (*FitBounds*) | O sistema deve recalcular as fronteiras de visualização do mapa (*fitBounds*) na inicialização para garantir enquadramento perfeito da planta baixa na tela do usuário. |
| **RF-012** | Restrição de Fronteiras do Mapa | O sistema deve impor limites de navegação (*maxBoundsViscosity*) para evitar que o usuário arraste a visualização para fora das fronteiras das plantas baixas do campus. |

---

### 2.2 Subsistema de Roteamento e Pathfinding (Algoritmo A*)

| ID | Nome do Requisito | Descrição Detalhada do Requisito |
| :--- | :--- | :--- |
| **RF-013** | Traçado de Rotas Mais Curtas (A*) | O sistema deve calcular o menor caminho entre um ponto de origem e um ponto de destino selecionados pelo usuário utilizando o algoritmo de busca espacial A* (A-Star). |
| **RF-014** | Matriz de Adjacência do Grafo | O sistema deve construir uma matriz de adjacência a partir do grafo espacial (`navigationGraph.ts`), ponderando as distâncias euclidianas e pesos específicos de transição. |
| **RF-015** | Painel Lateral de Roteamento (`RouteDrawer`) | O sistema deve disponibilizar um painel lateral retrátil (Drawer) para que o usuário informe o ponto de origem e o ponto de destino da navegação. |
| **RF-016** | Seleção de Salas por Combobox com Busca | O sistema deve oferecer campos de seleção de salas do tipo Combobox com autocompletar, apresentando a "Entrada" fixada como a primeira opção sugerida tanto na Origem quanto no Destino. |
| **RF-017** | Roteamento Inteligente "Banheiro Mais Próximo" | O sistema deve permitir a seleção do destino virtual "Banheiro", identificando e calculando dinamicamente a rota até o sanitário mais próximo em relação à origem informada. |
| **RF-018** | Modo de Navegação para Baixa Mobilidade | O sistema deve disponibilizar uma chave seletora para acessibilidade que, quando ativada, reconfigura o grafo de navegação em tempo real para ignorar escadas e utilizar obrigatoriamente rampas acessíveis. |
| **RF-019** | Navegação Multi-Andar por Escadas | O sistema deve calcular rotas que conectem nós em andares diferentes através de pontos de transição por escadas (`type: 'stairs'`), indicando ao usuário quando subir ou descer. |
| **RF-020** | Navegação Multi-Andar por Rampas | O sistema deve suportar pontos de transição por rampas de acessibilidade (`type: 'ramp'`) conectando andares sem a exigência de escadas. |
| **RF-021** | Validação de Origem e Destino Idênticos | O sistema deve validar os campos de rota e exibir uma mensagem de erro em destaque caso o usuário tente selecionar o mesmo local como origem e destino. |
| **RF-022** | Validação de Seleção Incompleta | O sistema deve impedir a execução do cálculo de rota se a origem ou o destino não tiverem sido devidamente selecionados. |
| **RF-023** | Renderização Visual de Rotas Animadas | O sistema deve desenhar a rota calculada diretamente sobre o mapa utilizando polilinhas com efeito visual pontilhado animado (`route-animated-dash`), setas de sentido do fluxo e marcadores distintivos. |
| **RF-024** | Setas Indicatórias de Sentido do Fluxo | O sistema deve calcular o ângulo de cada segmento da rota e renderizar setas direcionais intermediárias para indicar visualmente a direção correta do deslocamento. |
| **RF-025** | Marcadores Exclusivos de Origem e Destino | O sistema deve renderizar marcadores destacados com os rótulos "Origem" e "Destino" sobre os nós inicial e final do trajeto no andar atualmente visível. |
| **RF-026** | Marcadores Visuais de Troca de Andar | O sistema deve renderizar um marcador com ícone explicativo (🪜 para escada, ♿ para rampa) exatamente no ponto onde a rota exige a mudança de andar. |
| **RF-027** | Estimativa de Tempo de Deslocamento a Pé | O sistema deve calcular e exibir o tempo estimado de caminhada com base na distância total calculada pelo algoritmo A* (ex: "< 1 min a pé", "~1–2 min a pé", "~3–5 min a pé"). |
| **RF-028** | Ajuste Automático do Andar pela Rota | Ao traçar uma rota, o sistema deve ajustar automaticamente o andar exibido no mapa para o andar onde fica a sala de origem selecionada. |
| **RF-029** | Isolamento dos Trechos da Rota por Andar | O sistema deve filtrar e renderizar no mapa apenas os trechos da polilinha referentes ao andar atualmente selecionado pelo usuário. |
| **RF-030** | Guia Passo a Passo da Rota (`RouteSteps`) | O sistema deve fornecer uma lista sequencial com os passos da rota no painel lateral, informando trocas de andar, subida/descida por rampas ou escadas e pontos de referência pelo caminho. |
| **RF-031** | Resumo de Trocas de Andar no Banner | O banner de rota ativa deve indicar explicitamente a quantidade de trocas de andar necessárias ou a informação "mesmo andar". |
| **RF-032** | Fechamento Automático do Drawer ao Traçar | O painel lateral de busca de rotas deve se fechar automaticamente assim que uma rota válida for encontrada e exibida no mapa. |
| **RF-033** | Limpeza Fácil de Rota Ativa | O sistema deve permitir limpar a rota ativa com um clique, redefinindo o mapa e o painel para o estado padrão de navegação livre. |
| **RF-034** | Tratamento de Rota Não Encontrada | O sistema deve exibir um alerta explicativo amigável caso não exista caminho viável entre os pontos selecionados (ex: ao buscar rotas acessíveis para locais sem rampas). |

---

### 2.3 Subsistema de Interface do Usuário e Navegação (UI/UX)

| ID | Nome do Requisito | Descrição Detalhada do Requisito |
| :--- | :--- | :--- |
| **RF-035** | Menu Lateral Responsivo (Sidebar) | O sistema deve disponibilizar uma barra de navegação lateral com links diretos para o Mapa Geral e para todas as páginas individuais de blocos do campus. |
| **RF-036** | Menu Mobile do Tipo Hambúrguer | Em telas menores (smartphones), o sistema deve transformar a barra lateral em um menu retrátil acionado por botão hambúrguer animado com overlay escurecido de fundo. |
| **RF-037** | Fechamento de Painéis via Backdrop | O sistema deve permitir fechar a Sidebar ou o painel de rotas clicando em qualquer área externa escurecida (backdrop). |
| **RF-038** | Banner de Rota Ativa na Tela Principal | O sistema deve exibir um banner fixo no topo do mapa indicando que uma rota está ativa, quantas trocas de andar são necessárias, se a rota é acessível e um botão para limpar a rota ativa. |
| **RF-039** | Indicador Visual no Botão de Rota do Header | O botão do cabeçalho deve alterar sua cor de fundo e exibir um ponto luminoso pulsante quando houver uma rota ativa calculada. |
| **RF-040** | Grade de Acesso Rápido aos Blocos | A página inicial deve apresentar uma grade de cartões de acesso rápido no rodapé com nome, descrição, quantidade de andares, total de salas e a cor de destaque de cada bloco. |
| **RF-041** | Identificação Visual de Cores por Bloco | Cada bloco deve ter uma cor temática associada que se reflete na borda, marca d'água, marcadores e detalhes visuais dos cartões. |
| **RF-042** | Alternância de Temas Claro e Escuro | O sistema deve permitir que o usuário alterne entre temas claro e escuro, atualizando as cores de fundo, cartões, bordas e textos via variáveis CSS. |
| **RF-043** | Persistência da Preferência de Tema | O sistema deve armazenar a preferência de tema do usuário no `localStorage` do navegador para manter o padrão em acessos futuros. |
| **RF-044** | Transições de Entrada de Tela (Animations) | A interface deve utilizar animações suaves de entrada (*fade-in*, *slide-in*) ao abrir a página inicial, cartões e painéis laterais. |
| **RF-045** | Atualização de Status nos Botões | Durante o cálculo do algoritmo A*, os botões de ação devem apresentar estado desabilitado com indicador de carregamento (*Aria-busy*). |

---

### 2.4 Subsistema de Acessibilidade e Inclusão (a11y)

| ID | Nome do Requisito | Descrição Detalhada do Requisito |
| :--- | :--- | :--- |
| **RF-046** | Tradução Simultânea em Libras (VLibras) | O sistema deve integrar o widget oficial do VLibras, permitindo a tradução de conteúdos textuais da interface para a Língua Brasileira de Sinais para usuários surdos ou com deficiência auditiva. |
| **RF-047** | Alternativa em Texto para Deficientes Visuais | O mapa interativo deve fornecer uma estrutura em texto oculta (`sr-only`) descrevendo os blocos visíveis e os passos da rota para navegação não visual. |
| **RF-048** | Notificações de Status ARIA em Tempo Real | O sistema deve atualizar regiões `aria-live="polite"` e `aria-live="assertive"` sempre que uma rota for calculada ou limpa, informando o status a usuários com leitores de tela. |
| **RF-049** | Rotulagem Completa de Atributos ARIA | Todos os elementos interativos devem possuir atributos `aria-label`, `aria-expanded`, `aria-hidden` e `role` adequados. |
| **RF-050** | Navegação Acessível por Teclado | Todos os componentes interativos (combobox, botões, links e menus) devem suportar navegação por teclado (Tab, Enter, Esc e setas direcionais). |
| **RF-051** | Sanitização e Normalização da Busca Textual | O sistema deve desconsiderar diferenças de maiúsculas/minúsculas e acentuação gráfica na busca textual por salas no campo Combobox. |
| **RF-052** | Limitação de Opções Visíveis na Combobox | O campo de busca de salas deve limitar visualmente o resultado a no máximo 60 opções com rolagem vertical para garantir fluidez na renderização. |
| **RF-053** | Destaque de Opção Virtual "Auto" na Busca | A opção virtual "Banheiro (Mais Próximo)" deve receber destaque visual com badge "Auto" no topo da lista de sugestões. |
| **RF-054** | Suporte a Sanitários Acessíveis no Grafo | O grafo de navegação deve contemplar nós de banheiros adaptados para pessoas com deficiência. |
| **RF-055** | Suporte a Atalho de Teclado `Esc` | O sistema deve permitir o fechamento rápido de modais, drawers e menus suspensos ao pressionar a tecla `Esc`. |

---

### 2.5 Subsistema de Detalhamento de Espaços e Monitoramento IoT

| ID | Nome do Requisito | Descrição Detalhada do Requisito |
| :--- | :--- | :--- |
| **RF-056** | Página Individual por Bloco (`/bloco/[id]`) | O sistema deve fornecer uma página detalhada para cada bloco, apresentando informações detalhadas, descrição das atividades e imagens em alta resolução das plantas baixas por andar. |
| **RF-057** | Visualização da Planta Baixa por Bloco | A página do bloco deve exibir imagens esquemáticas individuais de cada andar do bloco com efeito de zoom visual. |
| **RF-058** | Efeito Zoom nas Imagens das Plantas | A página do bloco deve permitir a expansão/zoom visual nas imagens das plantas baixas ao passar o cursor ou clicar. |
| **RF-059** | Tabela de Salas e Setores por Bloco | A página do bloco deve listar todas as salas e setores do andar correspondente, identificando códigos (ex: A01, B02, C03) e seus respetivos nomes. |
| **RF-060** | Integração com Dashboard Energético (Morea) | O sistema deve fornecer um link direto de acesso aos painéis em tempo real de monitoramento do consumo elétrico e eficiência energética (Projeto Morea) para os blocos que possuem telemetria ativada. |
| **RF-061** | Renderização Condicional de Banners IoT | O banner de telemetria energética só deve ser exibido nas páginas de blocos que possuírem um código de dashboard cadastrado (`energyDashboardId`). |
| **RF-062** | Botão de Retorno Rápido ao Mapa Geral | As páginas individuais de blocos devem possuir um link visível de retorno rápido para a tela do Mapa Geral no topo do cabeçalho. |
| **RF-063** | Tratamento de Blocos Inexistentes (Tela 404) | O sistema deve exibir uma tela de aviso amigável com opção de retorno ao mapa caso o usuário acesse uma URL de bloco inexistente (ex: `/bloco/id-invalido`). |
| **RF-064** | Exibição de Categorias de Laboratórios | O sistema deve diferenciar visualmente laboratórios de pesquisa, salas de aula teóricas e setores administrativos no detalhamento dos blocos. |
| **RF-065** | Exibição da Quantidade Total de Salas | O sistema deve calcular e exibir o somatório total de salas registradas em todos os andares do bloco. |
| **RF-066** | Suporte a Links Seguros Externos | Todos os links direcionados para domínios externos (como o projeto Morea) devem ser abertos em nova aba com segurança reforçada. |

---

### 2.6 Subsistema de Ferramentas de Desenvolvedor (`/calibrar`)

| ID | Nome do Requisito | Descrição Detalhada do Requisito |
| :--- | :--- | :--- |
| **RF-067** | Ferramenta Dev de Calibração (`/calibrar`) | O sistema deve fornecer uma página exclusiva de desenvolvimento onde é possível clicar na imagem da planta baixa para capturar coordenadas cartesianas percentuais `(x%, y%)`. |
| **RF-068** | Linhas de Mira Dinâmicas (Crosshair) | A ferramenta de calibração deve desenhar linhas guias dinâmicas acompanhando o cursor do mouse e destacando as coordenadas exatas em tempo real. |
| **RF-069** | Seleção de Tipos de Nós na Calibração | Na ferramenta de calibração, o desenvolvedor deve poder selecionar o tipo de nó (`room`, `corridor`, `junction`, `stairs`, `ramp`, `entrance`) e informar seu rótulo/código. |
| **RF-070** | Exibição Alternável de Nós Existentes | A página `/calibrar` deve permitir ligar/desligar a renderização dos nós já existentes no arquivo de dados para servir como guia de alinhamento. |
| **RF-071** | Remoção Individual de Nós na Calibração | A ferramenta de calibração deve listar todos os nós adicionados na sessão e permitir remover nós individualmente antes de exportar. |
| **RF-072** | Exportação do Grafo em Código TypeScript | A ferramenta `/calibrar` deve formatar automaticamente os nós posicionados em código TypeScript pronto para ser copiado e colado em `navigationGraph.ts`. |
| **RF-073** | Exportação do Grafo em JSON | A ferramenta `/calibrar` deve permitir o download dos nós colocados em arquivo `.json` individualizado por andar (`nav_nodes_terreo.json`, etc.). |
| **RF-074** | Geração Automática de IDs de Nós | Se o desenvolvedor não informar um ID customizado na calibração, o sistema deve gerar um identificador único baseado no andar e horário de criação. |
| **RF-075** | Legenda Visual de Cores por Tipo de Nó | A ferramenta `/calibrar` deve apresentar uma legenda de cores identificando visualmente salas, corredores, junções, escadas e rampas sobre o mapa. |

---

### 2.7 Subsistema de Resiliência, Busca e Validação

| ID | Nome do Requisito | Descrição Detalhada do Requisito |
| :--- | :--- | :--- |
| **RF-076** | Agrupamento de Segmentos Desconectados | O componente `RouteOverlay` deve agrupar nós da rota em múltiplos segmentos isolados caso o percurso saia e retorne ao mesmo andar posteriormente. |
| **RF-077** | Preservação de Estado da Rota em Trocas Manuais | O sistema deve manter a rota calculada ativa mesmo quando o usuário alternar manualmente os andares do mapa. |
| **RF-078** | Resolução Dinâmica de Nós de Banheiro | O sistema deve filtrar todos os nós cadastrados como `bathroom` ou que contenham a palavra no rótulo para determinar a menor distância euclidiana acumulada. |
| **RF-079** | Validação de Conexões de Arestas no Grafo | O sistema deve ignorar arestas inválidas ou cujos nós de origem/destino não existam no mapa cadastrado. |
| **RF-080** | Prevenção de Duplicidade na Calibração | Ao adicionar um nó com ID já existente na sessão de calibração, o sistema deve substituir a posição anterior para evitar nós duplicados. |
| **RF-081** | Suporte a Filtro por Rótulo ou Código | O campo de busca de salas deve retornar resultados tanto pelo código da sala (ex: `C01`) quanto por seu nome descritivo (ex: `Lab. Informática`). |
| **RF-082** | Atribuição de Pesos Específicos em Transições | O grafo deve permitir a definição de pesos customizados (`weight`) para conexões verticais entre andares (ex: peso 15 para escadas, peso 18 para rampas). |
| **RF-083** | Suporte a Nós de Entrada de Bloco | O grafo deve registrar nós específicos do tipo `entrance` demarcando os pontos exatos onde os corredores principais acessam o interior dos blocos. |
| **RF-084** | Suporte a Locais Especiais e Containers | O sistema deve permitir o cadastramento e roteamento para estruturas anexas, como auditórios, containers, galpão e ginásio poliesportivo. |
| **RF-085** | Destaque Visual no Item Selecionado do Combobox | A lista de sugestões da combobox deve indicar com destaque o item atualmente selecionado. |

---

## 3. Requisitos Não Funcionais (RNF)

### 3.1 Desempenho e Eficiência (Performance)

| ID | Nome do Requisito | Descrição Detalhada do Requisito |
| :--- | :--- | :--- |
| **RNF-001** | Desempenho e Carregamento Rápido | O sistema deve carregar os componentes de mapeamento de forma assíncrona (`dynamic import`) com tempo de resposta inicial inferior a 2 segundos em conexões padrão de internet. |
| **RNF-002** | Operação de Roteamento Client-Side | O cálculo de rotas e o algoritmo A* devem ser executados integralmente no lado do cliente (navegador) com tempo de processamento inferior a 50 milissegundos. |
| **RNF-003** | Latência de Resposta do Autocompletar | A filtragem de sugestões na busca por salas deve ser instantânea, com tempo de resposta imperceptível (< 10ms) ao digitar no Combobox. |
| **RNF-004** | Taxa de Quadros de Animação em 60 FPS | Transições de tela, abertura de painéis e a animação da rota devem ser processadas via aceleração de hardware mantendo taxa constante de 60 FPS. |
| **RNF-005** | Gerenciamento Eficiente de Memória na DOM | O componente `RouteOverlay` deve destruir e limpar camadas Leaflet anteriores (`clearLayers`) ao alterar rotas ou desmontar componentes para evitar vazamentos de memória (*memory leaks*). |
| **RNF-006** | Otimização de Fontes e Recursos Web | A aplicação deve utilizar estratégias de otimização de fontes com `next/font` para garantir renderização rápida de tipografia sem atraso visual (*FOUT/FOIT*). |

---

### 3.2 Usabilidade, Responsividade e Acessibilidade (UX/a11y)

| ID | Nome do Requisito | Descrição Detalhada do Requisito |
| :--- | :--- | :--- |
| **RNF-007** | Design Responsivo Mobile-First | A interface deve adaptar layouts, gavetas laterais, botões e tamanhos de fonte sem quebra de conteúdo para telas de 320px até monitores 4K. |
| **RNF-008** | Acessibilidade Semântica e WCAG | Todos os elementos interativos devem possuir atributos `aria-label`, `aria-expanded`, `aria-hidden`, `aria-live` e `role` adequados para conformidade com a WCAG 2.1 AA. |
| **RNF-009** | Suporte a Alto Contraste no Modo Escuro | As cores das linhas de rota (`#00d9ff`), textos e bordas no modo escuro devem possuir taxa de contraste superior a 4.5:1 para garantir legibilidade. |
| **RNF-010** | Suporte a Gestos Touch | O mapa interativo em dispositivos móveis deve responder a gestos de pinça para zoom (*pinch zoom*) e arraste por toque (*drag*) com física de atrito suave. |
| **RNF-011** | Prevenção de Erros de Hidratação SSR | Componentes com dependência estrita da DOM (Leaflet e VLibras) devem utilizar carregamento dinâmico (`next/dynamic` sem SSR) ou verificação de montagem no cliente (`mounted state`). |
| **RNF-012** | Compatibilidade com Leitores de Tela | A interface deve ser plenamente compatível com os principais leitores de tela do mercado (NVDA, JAWS, VoiceOver e TalkBack). |

---

### 3.3 Confiabilidade, Segurança e Privacidade

| ID | Nome do Requisito | Descrição Detalhada do Requisito |
| :--- | :--- | :--- |
| **RNF-013** | Autonomia de Serviços Externos | O mapa e o roteamento devem funcionar sem dependência de APIs de terceiros (como Google Maps ou Mapbox), garantindo total autonomia e custo zero de infraestrutura. |
| **RNF-014** | Privacidade e Proteção de Dados | O sistema não deve coletar, armazenar ou transmitir dados pessoais ou geolocalização externa dos usuários para servidores terceiros. |
| **RNF-015** | Segurança em Links Externos | Todos os links externos (como os dashboards IoT do Morea) devem utilizar o atributo `rel="noopener noreferrer"` para prevenir vulnerabilidades de *tabnabbing*. |
| **RNF-016** | Resiliência de Interface e Tratamento de Erros | A aplicação deve conter tratamentos de erro graciosos em componentes de rota e telas de fallback para evitar falhas em cascata na aplicação. |
| **RNF-017** | Operação Irrestrita Pós-Carregamento | Uma vez carregada a aplicação no navegador, o sistema de roteamento e visualização das plantas baixas deve funcionar sem necessidade de novas requisições de rede. |

---

### 3.4 Manutenibilidade, Arquitetura e Engenharia de Software

| ID | Nome do Requisito | Descrição Detalhada do Requisito |
| :--- | :--- | :--- |
| **RNF-018** | Tipagem Estática Rigorosa (TypeScript) | 100% do código-fonte deve utilizar TypeScript com tipagem estrita para dados, grafos, componentes e propriedades, sem o uso de `any` implícito. |
| **RNF-019** | Qualidade de Código e Linter | Todo o código deve estar em conformidade com as regras estritas do ESLint 9 (`eslint-config-next`), prevenindo vazamento de variáveis e imports não utilizados. |
| **RNF-020** | Arquitetura de Componentes Reutilizáveis | O código da interface deve ser estruturado em componentes React modulares e isolados, facilitando a manutenção e adição de novos recursos. |
| **RNF-021** | Padronização Visual com Tailwind v4 | A estilização deve utilizar o Tailwind CSS v4 e variáveis CSS centralizadas no `globals.css` para manter consistência em temas e componentes. |
| **RNF-022** | Gerenciamento de Estado sem Redundância | O estado das rotas e andares deve ser gerenciado de forma reativa nos componentes superiores sem gerar renderizações desnecessárias da DOM. |
| **RNF-023** | Escalabilidade do Grafo Espacial | O módulo de navegação deve ser projetado para permitir a adição ilimitada de novos nós e arestas sem comprometer o tempo de execução do A*. |
| **RNF-024** | Portabilidade para Deploy Serverless | A aplicação deve ser totalmente portátil para hospedagem em plataformas serverless como Vercel, Netlify, Cloudflare Pages ou conteinerização via Docker. |
| **RNF-025** | Compatibilidade Multi-Navegador | O sistema deve ser totalmente compatível com as versões recentes dos principais navegadores do mercado (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge e Opera). |
| **RNF-026** | Imutabilidade das Estruturas de Dados do Grafo | Os arrays e mapas que contêm a definição de nós (`NAV_NODES`) e arestas (`NAV_EDGES`) devem ser imutáveis durante a execução do roteador. |
| **RNF-027** | Semântica de URLs Limpas | As rotas da aplicação devem seguir a semântica do Next.js App Router (ex: `/`, `/bloco/[id]`, `/calibrar`). |
| **RNF-028** | Otimização de Imagens | As imagens de plantas baixas devem utilizar o componente `next/image` para otimização automática de tamanho e formato. |
| **RNF-029** | Baixo Consumo de Processamento CPU | As animações e o algoritmo A* devem ser otimizados para evitar consumo excessivo de bateria e CPU em dispositivos móveis. |
| **RNF-030** | Validação Estática em Tempo de Compilação | Erros de tipos e propriedades incompatíveis devem ser interceptados na etapa de build (`npm run build`). |
| **RNF-031** | Padronização de Nomenclatura | O código deve adotar convenções de nomes claras (PascalCase para componentes, camelCase para variáveis/funções, UPPER_CASE para constantes). |
| **RNF-032** | Testabilidade dos Módulos de Grafo | A função de roteamento `findPath` e a construção de adjacência devem ser isoladas de efeitos colaterais visuais para permitir testes unitários. |
| **RNF-033** | Expansão Simples para Novos Campi | A estrutura de dados dos blocos e do grafo deve ser preparada para permitir a inclusão de múltiplos campi no futuro. |
| **RNF-034** | Documentação Interna de Código | Funções complexas de manipulação geográfica (como conversão de coordenadas % para `LatLng` e ângulos de setas) devem conter comentários explicativos. |
| **RNF-035** | Separação Clara Entre Dados e Apresentação | Os dados das plantas e blocos (`blocos.ts`) devem estar estritamente desvinculados da lógica de renderização visual dos componentes React. |

---

## 4. Regras de Negócio (RN)

| ID | Nome da Regra | Descrição Detalhada da Regra de Negócio |
| :--- | :--- | :--- |
| **RN-001** | Exclusividade de Conexões de Baixa Mobilidade | Quando a opção "Baixa Mobilidade" estiver ativada, a matriz de adjacência do grafo DEVE excluir todas as arestas vinculadas a nós do tipo `stairs` (escadas). |
| **RN-002** | Resolução Dinâmica de Sanitários | A opção "Banheiro" DEVE obrigatoriamente varrer todos os nós do tipo `bathroom` no grafo e selecionar como destino aquele que resultar na menor distância total acumulada a partir da origem. |
| **RN-003** | Restrição de Pontos Idênticos | Uma rota NÃO PODE ser calculada se o identificador da sala de origem for estritamente igual ao identificador da sala de destino. |
| **RN-004** | Coerência de Transição Vertical | A troca de andar em uma rota SÓ PODE ocorrer através de nós explicitamente declarados com conectores (`connectsTo`) do tipo `stairs` ou `ramp`. |
| **RN-005** | Prioridade de Exibição do Andar de Origem | Ao finalizar o cálculo de uma rota válida, o mapa DEVE automaticamente alterar a visualização ativa para o andar correspondente à origem da rota. |
| **RN-006** | Visibilidade de Blocos por Andar | Um marcador de bloco SÓ DEVE ser exibido no mapa se o bloco possuir representação física cadastrada no andar atualmente selecionado pelo usuário. |
| **RN-007** | Acesso Público e Livre | Todas as funcionalidades de navegação, consulta de blocos e traçado de rotas DEVEM ser abertas ao público, sem exigência de autenticação ou cadastro. |
| **RN-008** | Telemetria Condicional de Energia | O link para o painel de consumo elétrico SÓ DEVE ser exibido em blocos que possuam um ID de dashboard (`energyDashboardId`) ativo no Projeto Morea. |
| **RN-009** | Restrição da Ferramenta de Calibração | A ferramenta `/calibrar` destina-se EXCLUSIVAMENTE ao ambiente de desenvolvimento para suporte no mapeamento de novas salas e rotas. |
| **RN-010** | Preservação da Rota em Troca Manual | Alternar manualmente o andar do mapa NÃO DEVE limpar a rota ativa; o sistema deve apenas ajustar os trechos visíveis para o novo andar selecionado. |
