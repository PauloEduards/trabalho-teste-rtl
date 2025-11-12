import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
// Importe 'test' de 'vitest' para usar o 'test.each'
import { describe, it, expect, test } from 'vitest';

import IMC from './imc';

describe('IMC component', () => {
  // Teste 1: Verifica se os elementos principais estão na tela
  it('renders inputs and button', () => {
    render(<IMC />);
    
    // A forma correta de encontrar os inputs é pelo seu texto de label
    expect(screen.getByLabelText(/Peso \(kg\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Altura \(m\)/i)).toBeInTheDocument();
    
    // O seletor para o botão estava correto
    expect(screen.getByRole('button', { name: /Calcular IMC/i })).toBeInTheDocument();
  });

  // Teste 2: Testa a primeira categoria (Abaixo do peso)
  it('shows "Abaixo do peso" for IMC < 18.5 and formats to two decimals', async () => {
    render(<IMC />);
    // Seleciona os elementos usando o método correto
    const pesoInput = screen.getByLabelText(/Peso \(kg\)/i);
    const alturaInput = screen.getByLabelText(/Altura \(m\)/i);
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    // Simula a digitação do usuário
    await userEvent.type(pesoInput, '50');
    await userEvent.type(alturaInput, '1.75');
    await userEvent.click(button);

    // Usa findByText para esperar o resultado aparecer (assíncrono)
    expect(await screen.findByText(/Seu IMC é 16.33 - Abaixo do peso/i)).toBeInTheDocument();
  });

  // Teste 3: Teste parametrizado para as outras categorias
  // Note que os valores de IMC são pré-calculados para garantir exatidão
  const testCases = [
    { peso: '68', altura: '1.75', imc: '22.20', expected: 'Peso normal' },
    { peso: '80', altura: '1.75', imc: '26.12', expected: 'Sobrepeso' },
    { peso: '95', altura: '1.75', imc: '31.02', expected: 'Obesidade grau I' },
    { peso: '110', altura: '1.75', imc: '35.92', expected: 'Obesidade grau II' },
  ];

  // Usa 'test.each' para rodar um teste isolado para cada item do array
  // Isso evita o erro de 'render' dentro de um loop
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

      // Verifica o resultado exato
      expect(await screen.findByText(new RegExp(`Seu IMC é ${imc} - ${expected}`, 'i'))).toBeInTheDocument();
    }
  );

  // Teste 4: Teste para a categoria mais alta
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

  // Teste 5: Teste de erro para peso inválido
  it('shows error when peso is non-positive', async () => {
    render(<IMC />);
    const pesoInput = screen.getByLabelText(/Peso \(kg\)/i);
    const alturaInput = screen.getByLabelText(/Altura \(m\)/i);
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await userEvent.type(pesoInput, '0');
    await userEvent.type(alturaInput, '1.75');
    await userEvent.click(button);

    // Verifica a mensagem de erro exata do seu componente
    expect(await screen.findByText(/O peso deve ser um valor positivo/i)).toBeInTheDocument();
  });

  // Teste 6: Teste de erro para altura inválida (corrigido)
  it('shows error when altura is non-positive', async () => {
    render(<IMC />);
    const pesoInput = screen.getByLabelText(/Peso \(kg\)/i);
    const alturaInput = screen.getByLabelText(/Altura \(m\)/i);
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await userEvent.type(pesoInput, '70');
    await userEvent.type(alturaInput, '0'); // Lógica correta
    await userEvent.click(button);

    // Verifica a mensagem de erro exata do seu componente
    expect(await screen.findByText(/A altura deve ser um valor positivo/i)).toBeInTheDocument();
  });
});