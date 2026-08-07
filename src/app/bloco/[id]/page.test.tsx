import { render, screen } from '@testing-library/react';
import BlocoPage from './page';
import { useParams } from 'next/navigation';
import { getBlocoById } from '@/data/blocos';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/data/blocos', () => ({
  getBlocoById: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style }: any) => (
      <div className={className} style={style}>
        {children}
      </div>
    ),
    h1: ({ children, className, style }: any) => (
      <h1 className={className} style={style}>
        {children}
      </h1>
    ),
    p: ({ children, className }: any) => <p className={className}>{children}</p>,
  },
}));

// Mock do Next/Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === 'string' ? src : src?.src} alt={alt} className={className} />
  ),
}));

describe('Página BlocoPage (/bloco/[id])', () => {
  const mockBlocoData = {
    id: 'bloco-a',
    name: 'Bloco A',
    description: 'Descrição do Bloco A',
    color: '#ff0000',
    energyDashboardId: '12345',
    floors: [
      {
        name: 'Térreo',
        image: '/images/terreo.png',
        rooms: [
          { code: 'A01', name: 'Laboratório de Informática' },
          { code: 'A02', name: 'Coordenação' },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve renderizar a mensagem de erro quando o bloco não for encontrado', () => {
    (useParams as jest.Mock).mockReturnValue({ id: 'bloco-inexistente' });
    (getBlocoById as jest.Mock).mockReturnValue(undefined);

    render(<BlocoPage />);

    expect(screen.getByRole('heading', { level: 1, name: /bloco não encontrado/i })).toBeInTheDocument();
    expect(screen.getByText(/o bloco "bloco-inexistente" não existe no sistema/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar ao mapa/i })).toBeInTheDocument();
  });

  test('Deve renderizar os detalhes do bloco corretamente quando o ID for válido', () => {
    (useParams as jest.Mock).mockReturnValue({ id: 'bloco-a' });
    (getBlocoById as jest.Mock).mockReturnValue(mockBlocoData);

    render(<BlocoPage />);

    // Cabeçalho e Título
    expect(screen.getByRole('heading', { level: 1, name: 'Bloco A' })).toBeInTheDocument();
    expect(screen.getByText('Descrição do Bloco A')).toBeInTheDocument();

    // Contadores de Andares e Salas
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Andar')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Salas')).toBeInTheDocument();

    // Link do consumo elétrico
    const energyLink = screen.getByRole('link', { name: /ver painel de consumo elétrico do bloco a/i });
    expect(energyLink).toBeInTheDocument();
    expect(energyLink).toHaveAttribute('href', 'https://morea-ifs.org/device-fullscreen/12345/');

    // Plantas e Salas
    expect(screen.getByRole('heading', { level: 2, name: 'Térreo' })).toBeInTheDocument();
    expect(screen.getByAltText(/visão da planta baixa esquemática do térreo/i)).toBeInTheDocument();
    expect(screen.getByText('Laboratório de Informática')).toBeInTheDocument();
    expect(screen.getByText('Coordenação')).toBeInTheDocument();
  });

  test('Não deve renderizar o painel de consumo elétrico se energyDashboardId não estiver presente', () => {
    const blocoSemEnergia = { ...mockBlocoData, energyDashboardId: undefined };
    (useParams as jest.Mock).mockReturnValue({ id: 'bloco-a' });
    (getBlocoById as jest.Mock).mockReturnValue(blocoSemEnergia);

    render(<BlocoPage />);

    expect(screen.queryByRole('link', { name: /ver painel de consumo elétrico/i })).not.toBeInTheDocument();
  });
});