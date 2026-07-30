import { useState } from 'react'

function Configuracoes() {
  const [precoCombustivel, setPrecoCombustivel] =
    useState(
      localStorage.getItem(
        'thoruberbh-combustivel'
      ) || '6.00'
    )

  function salvarConfiguracoes() {
    localStorage.setItem(
      'thoruberbh-combustivel',
      precoCombustivel
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
          step="0.01"
          value={precoCombustivel}
          onChange={(e) =>
            setPrecoCombustivel(
              e.target.value
            )
          }
        />
      </div>

      <button onClick={salvarConfiguracoes}>
        Salvar Configurações
      </button>
    </div>
  )
}

export default Configuracoes