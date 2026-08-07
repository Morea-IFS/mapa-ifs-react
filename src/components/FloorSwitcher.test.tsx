import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FloorSwitcher from './FloorSwitcher';

describe('Componente FloorSwitcher', () => {
  const mockOnFloorChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os botões de andar com os atributos corretos', () => {
    render(<FloorSwitcher currentFloor="terreo" onFloorChange={mockOnFloorChange} />);

    const groupElement = screen.getByRole('group', { name: 'Selecionar andar do mapa' });
    expect(groupElement).toBeInTheDocument();

    const subsoloBtn = screen.getByRole('button', { name: 'Ver mapa do Subsolo' });
    const terreoBtn = screen.getByRole('button', { name: 'Ver mapa do Térreo' });
    const superiorBtn = screen.getByRole('button', { name: 'Ver mapa do Superior' });

    expect(subsoloBtn).toBeInTheDocument();
    expect(terreoBtn).toBeInTheDocument();
    expect(superiorBtn).toBeInTheDocument();
  });

  it('deve marcar o andar atual com aria-pressed="true"', () => {
    render(<FloorSwitcher currentFloor="terreo" onFloorChange={mockOnFloorChange} />);

    expect(screen.getByRole('button', { name: 'Ver mapa do Térreo' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Ver mapa do Subsolo' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Ver mapa do Superior' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('deve chamar onFloorChange com o andar correto ao clicar em um botão', () => {
    render(<FloorSwitcher currentFloor="terreo" onFloorChange={mockOnFloorChange} />);

    const subsoloBtn = screen.getByRole('button', { name: 'Ver mapa do Subsolo' });
    fireEvent.click(subsoloBtn);

    expect(mockOnFloorChange).toHaveBeenCalledTimes(1);
    expect(mockOnFloorChange).toHaveBeenCalledWith('subsolo');
  });

  it('deve chamar onFloorChange ao mudar para o andar Superior', () => {
    render(<FloorSwitcher currentFloor="terreo" onFloorChange={mockOnFloorChange} />);

    const superiorBtn = screen.getByRole('button', { name: 'Ver mapa do Superior' });
    fireEvent.click(superiorBtn);

    expect(mockOnFloorChange).toHaveBeenCalledWith('superior');
  });
});