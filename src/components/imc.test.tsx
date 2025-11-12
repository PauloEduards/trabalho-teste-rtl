import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, test } from 'vitest';

import IMC from './imc';

describe('IMC component', () => {
  it('renders inputs and button', () => {
    render(<IMC />);
    
    expect(screen.getByLabelText(/Peso \(kg\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Altura \(m\)/i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /Calcular IMC/i })).toBeInTheDocument();
  });

  it('shows "Abaixo do peso" for IMC < 18.5 and formats to two decimals', async () => {
    render(<IMC />);
    const pesoInput = screen.getByLabelText(/Peso \(kg\)/i);
    const alturaInput = screen.getByLabelText(/Altura \(m\)/i);
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await userEvent.type(pesoInput, '50');
    await userEvent.type(alturaInput, '1.75');
    await userEvent.click(button);

    expect(await screen.findByText(/Seu IMC é 16.33 - Abaixo do peso/i)).toBeInTheDocument();
  });

  const testCases = [
    { peso: '68', altura: '1.75', imc: '22.20', expected: 'Peso normal' },
    { peso: '80', altura: '1.75', imc: '26.12', expected: 'Sobrepeso' },
    { peso: '95', altura: '1.75', imc: '31.02', expected: 'Obesidade grau I' },
    { peso: '110', altura: '1.75', imc: '35.92', expected: 'Obesidade grau II' },
  ];

  test.each(testCases)(
    'classifies $expected (IMC $imc) for peso $peso and altura $altura',
    async ({ peso, altura, imc, expected }) => {
      render(<IMC />);
      const pesoInput = screen.getByLabelText(/Peso \(kg\)/i);
      const alturaInput = screen.getByLabelText(/Altura \(m\)/i);
      const button = screen.getByRole('button', { name: /Calcular IMC/i });

      await userEvent.type(pesoInput, peso);
      await userEvent.type(alturaInput, altura);
      await userEvent.click(button);

      expect(await screen.findByText(new RegExp(`Seu IMC é ${imc} - ${expected}`, 'i'))).toBeInTheDocument();
    }
  );

  it('shows Obesidade grau III for very high IMC', async () => {
    render(<IMC />);
    const pesoInput = screen.getByLabelText(/Peso \(kg\)/i);
    const alturaInput = screen.getByLabelText(/Altura \(m\)/i);
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await userEvent.type(pesoInput, '130');
    await userEvent.type(alturaInput, '1.60');
    await userEvent.click(button);

    expect(await screen.findByText(/Seu IMC é 50.78 - Obesidade grau III/i)).toBeInTheDocument();
  });

  it('shows error when peso is non-positive', async () => {
    render(<IMC />);
    const pesoInput = screen.getByLabelText(/Peso \(kg\)/i);
    const alturaInput = screen.getByLabelText(/Altura \(m\)/i);
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await userEvent.type(pesoInput, '0');
    await userEvent.type(alturaInput, '1.75');
    await userEvent.click(button);

    expect(await screen.findByText(/O peso deve ser um valor positivo/i)).toBeInTheDocument();
  });

  it('shows error when altura is non-positive', async () => {
    render(<IMC />);
    const pesoInput = screen.getByLabelText(/Peso \(kg\)/i);
    const alturaInput = screen.getByLabelText(/Altura \(m\)/i);
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await userEvent.type(pesoInput, '70');
    await userEvent.type(alturaInput, '0');
    await userEvent.click(button);

    expect(await screen.findByText(/A altura deve ser um valor positivo/i)).toBeInTheDocument();
  });
});