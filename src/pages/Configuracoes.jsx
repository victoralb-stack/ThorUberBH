import { useState } from 'react'

function Configuracoes() {
  const [precoCombustivel, setPrecoCombustivel] =
    useState(
      localStorage.getItem(
        'thoruberbh-combustivel'
      ) || '6.00'
    )

  const [
    percentualManutencao,
    setPercentualManutencao,
  ] = useState(
    localStorage.getItem(
      'thoruberbh-manutencao'
    ) || '10'
  )

  function salvarConfiguracoes() {
    const preco = Number(
      precoCombustivel
    )

    const percentual = Number(
      percentualManutencao
    )

    if (preco <= 0) {
      alert(
        'Informe um preço de combustível maior que zero.'
      )
      return
    }

    if (
      percentual < 0 ||
      percentual > 100
    ) {
      alert(
        'O percentual de manutenção deve estar entre 0% e 100%.'
      )
      return
    }

    localStorage.setItem(
      'thoruberbh-combustivel',
      String(preco)
    )

    localStorage.setItem(
      'thoruberbh-manutencao',
      String(percentual)
    )

    alert('Configurações salvas')
  }

  return (
    <div>
      <h2>Configurações</h2>

      <div className="card">
        <label>
          ⛽ Preço do Combustível (R$/L)
        </label>

        <input
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          value={precoCombustivel}
          onChange={(e) =>
            setPrecoCombustivel(
              e.target.value
            )
          }
        />

        <label>
          🔧 Reserva para Manutenção (%)
        </label>

        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          inputMode="decimal"
          value={percentualManutencao}
          onChange={(e) =>
            setPercentualManutencao(
              e.target.value
            )
          }
        />
      </div>

      <button
        onClick={salvarConfiguracoes}
      >
        Salvar Configurações
      </button>
    </div>
  )
}

export default Configuracoes