import React, { useState } from 'react';
import './imc.css';

interface IMCProps {}

const IMC: React.FC<IMCProps> = () => {
  const [peso, setPeso] = useState<string>('');
  const [altura, setAltura] = useState<string>('');
  const [resultado, setResultado] = useState<string>('');
  const [erro, setErro] = useState<string>('');

  const calcularIMC = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setResultado('');

    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);

    // Validações
    if (pesoNum <= 0) {
      setErro('O peso deve ser um valor positivo');
      return;
    }

    if (alturaNum <= 0) {
      setErro('A altura deve ser um valor positivo');
      return;
    }

    // Cálculo do IMC
    const imc = pesoNum / (alturaNum * alturaNum);
    let classificacao = '';

    if (imc < 18.5) {
      classificacao = 'Abaixo do peso';
    } else if (imc >= 18.5 && imc <= 24.9) {
      classificacao = 'Peso normal';
    } else if (imc >= 25.0 && imc <= 29.9) {
      classificacao = 'Sobrepeso';
    } else if (imc >= 30.0 && imc <= 34.9) {
      classificacao = 'Obesidade grau I';
    } else if (imc >= 35.0 && imc <= 39.9) {
      classificacao = 'Obesidade grau II';
    } else if (imc >= 40.0) {
      classificacao = 'Obesidade grau III';
    }

    setResultado(`Seu IMC é ${imc.toFixed(2)} - ${classificacao}`);
  };

  return (
    <div className="imc-container">
      <h2>Calculadora de IMC</h2>
      <form className="imc-form" onSubmit={calcularIMC}>
        <div className="input-group">
          <label htmlFor="peso">Peso (kg):</label>
          <input
            id='peso'
            type="number"
            step="0.1"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            required
            placeholder="Ex: 70.5"
          />
        </div>
        <div className="input-group">
          {/* CORREÇÃO AQUI: 
            Alterado de "Altura" para "altura" (minúsculo) 
            para corresponder ao id="altura" do input.
          */}
          <label htmlFor="altura">Altura (m):</label>
          <input
            id='altura'
            type="number"
            step="0.01"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            required
            placeholder="Ex: 1.75"
          />
        </div>
        <button className="calc-button" type="submit">
          Calcular IMC
        </button>
      </form>

      {erro && <div className="resultado erro">{erro}</div>}
      {resultado && <div className="resultado sucesso">{resultado}</div>}
    </div>
  );
};

export default IMC;