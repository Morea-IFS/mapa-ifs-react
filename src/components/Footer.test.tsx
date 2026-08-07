import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './Footer';

describe('Componente Footer', () => {
  it('deve renderizar o título MERO e a descrição do projeto', () => {
    render(<Footer />);

    const meroElements = screen.getAllByText('MERO');
    expect(meroElements).toHaveLength(2);
    expect(meroElements[0]).toBeInTheDocument();

    expect(
      screen.getByText(/Mapa de Espaços, Recursos e Orientação/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Instituto Federal de Sergipe \(IFS\)/i)
    ).toBeInTheDocument();
  });

  it('deve renderizar o link externo para o Projeto MOREA com atributos de segurança', () => {
    render(<Footer />);

    const linkElement = screen.getByRole('link', { name: /Projeto MOREA/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://morea-ifs.org/');
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('deve renderizar as informações sobre acessibilidade (VLibras e Baixa Mobilidade)', () => {
    render(<Footer />);

    expect(screen.getByText('VLibras')).toBeInTheDocument();
    expect(screen.getByText('Baixa Mobilidade')).toBeInTheDocument();
  });

  it('deve exibir o ano atual dinamicamente no copyright', () => {
    const currentYear = new Date().getFullYear();

    render(<Footer />);

    expect(
      screen.getByText(new RegExp(`© ${currentYear}`, 'i'))
    ).toBeInTheDocument();
  });
});