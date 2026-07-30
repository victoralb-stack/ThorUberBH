import { useState } from 'react'

function Jornada({
  adicionarJornada,
  voltarDashboard,
}) {
  const hoje = new Date()
    .toISOString()
    .split('T')[0]

  const [data, setData] = useState(hoje)
  const [uberCorridas, setUberCorridas] = useState('')
  const [uberReceita, setUberReceita] = useState('')
  const [noventa9Corridas, setNoventa9Corridas] = useState('')
  const [noventa9Receita, setNoventa9Receita] = useState('')
  const [horas, setHoras] = useState('')
  const [km, setKm] = useState('')
  const [consumo, setConsumo] = useState('')
  const [observacao, setObservacao] = useState('')

  function salvarJornada() {
    adicionarJornada({
      data,
      uberCorridas: Number(uberCorridas),
      uberReceita: Number(uberReceita),
      noventa9Corridas: Number(
        noventa9Corridas
      ),
      noventa9Receita: Number(
        noventa9Receita
      ),
      horas: Number(horas),
      km: Number(km),
      consumo: Number(consumo),
      observacao,
    })

    voltarDashboard()
  }

  return (
    <div>
      <h2>Nova Jornada</h2>

      <div className="card">
        <label>📅 Data</label>

        <input
          type="date"
          value={data}
          onChange={(e) =>
            setData(e.target.value)
          }
        />
      </div>

      <div className="card">
        <h3>🚗 Uber</h3>

        <label>Corridas</label>

        <input
          type="number"
          value={uberCorridas}
          onChange={(e) =>
            setUberCorridas(e.target.value)
          }
        />

        <label>Receita (R$)</label>

        <input
          type="number"
          value={uberReceita}
          onChange={(e) =>
            setUberReceita(e.target.value)
          }
        />
      </div>

      <div className="card">
        <h3>🟢 99</h3>

        <label>Corridas</label>

        <input
          type="number"
          value={noventa9Corridas}
          onChange={(e) =>
            setNoventa9Corridas(
              e.target.value
            )
          }
        />

        <label>Receita (R$)</label>

        <input
          type="number"
          value={noventa9Receita}
          onChange={(e) =>
            setNoventa9Receita(
              e.target.value
            )
          }
        />
      </div>

      <div className="card">
        <label>
          ⏱ Horas Trabalhadas
        </label>

        <input
          type="number"
          step="0.1"
          value={horas}
          onChange={(e) =>
            setHoras(e.target.value)
          }
        />

        <label>📍 KM Rodados</label>

        <input
          type="number"
          value={km}
          onChange={(e) =>
            setKm(e.target.value)
          }
        />

        <label>⛽ Consumo Médio</label>

        <input
          type="number"
          step="0.1"
          value={consumo}
          onChange={(e) =>
            setConsumo(e.target.value)
          }
        />
      </div>

      <div className="card">
        <label>📝 Observação</label>

        <textarea
          rows="4"
          value={observacao}
          onChange={(e) =>
            setObservacao(
              e.target.value
            )
          }
        />
      </div>

      <button onClick={salvarJornada}>
        Salvar Jornada
      </button>
    </div>
  )
}

export default Jornada