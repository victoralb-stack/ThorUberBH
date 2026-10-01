import { useState } from 'react'

function obterDataLocalAtual() {
  const agora = new Date()

  const ano = agora.getFullYear()

  const mes = String(
    agora.getMonth() + 1
  ).padStart(2, '0')

  const dia = String(
    agora.getDate()
  ).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function Jornada({
  adicionarJornada,
  voltarDashboard,
}) {
  const hoje = obterDataLocalAtual()

  const [data, setData] = useState(hoje)

  const [
    uberCorridas,
    setUberCorridas,
  ] = useState('')

  const [
    uberReceita,
    setUberReceita,
  ] = useState('')

  const [
    noventa9Corridas,
    setNoventa9Corridas,
  ] = useState('')

  const [
    noventa9Receita,
    setNoventa9Receita,
  ] = useState('')

  const [horas, setHoras] = useState('')
  const [minutos, setMinutos] = useState('')
  const [km, setKm] = useState('')
  const [consumo, setConsumo] = useState('')

  const [
    observacao,
    setObservacao,
  ] = useState('')

  function salvarJornada() {
    if (!data) {
      alert('Informe a data da jornada.')
      return
    }

    const horasInformadas =
      Number(horas) || 0

    const minutosInformados =
      Number(minutos) || 0

    if (
      minutosInformados < 0 ||
      minutosInformados > 59
    ) {
      alert(
        'Os minutos devem estar entre 0 e 59.'
      )
      return
    }

    const tempoTotal =
      horasInformadas +
      minutosInformados / 60

    const precoCombustivel = Number(
      localStorage.getItem(
        'thoruberbh-combustivel'
      ) || 6
    )

    const percentualManutencao = Number(
      localStorage.getItem(
        'thoruberbh-manutencao'
      ) || 10
    )

    adicionarJornada({
      data,

      uberCorridas:
        Number(uberCorridas) || 0,

      uberReceita:
        Number(uberReceita) || 0,

      noventa9Corridas:
        Number(noventa9Corridas) || 0,

      noventa9Receita:
        Number(noventa9Receita) || 0,

      horas: tempoTotal,

      km:
        Number(km) || 0,

      consumo:
        Number(consumo) || 0,

      observacao,

      precoCombustivel,

      percentualManutencao,
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
          min="0"
          inputMode="numeric"
          value={uberCorridas}
          onChange={(e) =>
            setUberCorridas(
              e.target.value
            )
          }
        />

        <label>Receita (R$)</label>

        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={uberReceita}
          onChange={(e) =>
            setUberReceita(
              e.target.value
            )
          }
        />
      </div>

      <div className="card">
        <h3>🟢 99</h3>

        <label>Corridas</label>

        <input
          type="number"
          min="0"
          inputMode="numeric"
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
          min="0"
          step="0.01"
          inputMode="decimal"
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
          ⏱ Tempo Trabalhado
        </label>

        <div className="tempo-grid">
          <div>
            <label className="campo-secundario">
              Horas
            </label>

            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="0"
              value={horas}
              onChange={(e) =>
                setHoras(e.target.value)
              }
            />
          </div>

          <div>
            <label className="campo-secundario">
              Minutos
            </label>

            <input
              type="number"
              min="0"
              max="59"
              inputMode="numeric"
              placeholder="0"
              value={minutos}
              onChange={(e) =>
                setMinutos(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        <label>📍 KM Rodados</label>

        <input
          type="number"
          min="0"
          step="0.1"
          inputMode="decimal"
          value={km}
          onChange={(e) =>
            setKm(e.target.value)
          }
        />

        <label>
          ⛽ Consumo Médio
        </label>

        <input
          type="number"
          min="0"
          step="0.1"
          inputMode="decimal"
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