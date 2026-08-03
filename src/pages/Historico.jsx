import { useState } from 'react'

function criarDataLocal(dataTexto) {
  const [ano, mes, dia] = dataTexto
    .split('-')
    .map(Number)

  return new Date(ano, mes - 1, dia)
}

function formatarData(dataTexto) {
  if (!dataTexto) {
    return 'Data não informada'
  }

  return criarDataLocal(
    dataTexto
  ).toLocaleDateString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }
  )
}

function formatarTempo(horasDecimais) {
  const minutosTotais = Math.round(
    (Number(horasDecimais) || 0) * 60
  )

  const horas = Math.floor(
    minutosTotais / 60
  )

  const minutos = minutosTotais % 60

  return `${horas}h ${String(minutos).padStart(2, '0')}min`
}

function Historico({
  jornadas,
  excluirJornada,
}) {
  const [app, setApp] =
    useState('todos')

  function obterReceita(jornada) {
    if (app === 'uber') {
      return Number(
        jornada.uberReceita
      ) || 0
    }

    if (app === '99') {
      return Number(
        jornada.noventa9Receita
      ) || 0
    }

    return (
      (Number(
        jornada.uberReceita
      ) || 0) +
      (Number(
        jornada.noventa9Receita
      ) || 0)
    )
  }

  function obterCorridas(jornada) {
    if (app === 'uber') {
      return Number(
        jornada.uberCorridas
      ) || 0
    }

    if (app === '99') {
      return Number(
        jornada.noventa9Corridas
      ) || 0
    }

    return (
      (Number(
        jornada.uberCorridas
      ) || 0) +
      (Number(
        jornada.noventa9Corridas
      ) || 0)
    )
  }

  const jornadasExibidas =
    jornadas.filter((jornada) => {
      if (app === 'uber') {
        return (
          (Number(
            jornada.uberCorridas
          ) || 0) > 0 ||
          (Number(
            jornada.uberReceita
          ) || 0) > 0
        )
      }

      if (app === '99') {
        return (
          (Number(
            jornada.noventa9Corridas
          ) || 0) > 0 ||
          (Number(
            jornada.noventa9Receita
          ) || 0) > 0
        )
      }

      return true
    })

  let receitaTotalGeral = 0
  let corridasTotalGeral = 0
  let horasTotalGeral = 0

  jornadasExibidas.forEach(
    (jornada) => {
      receitaTotalGeral +=
        obterReceita(jornada)

      corridasTotalGeral +=
        obterCorridas(jornada)

      horasTotalGeral +=
        Number(jornada.horas) || 0
    }
  )

  const reaisPorHoraMedio =
    horasTotalGeral > 0
      ? receitaTotalGeral /
        horasTotalGeral
      : 0

  return (
    <div>
      <h2>Histórico</h2>

      <div className="card">
        <label>Aplicativo</label>

        <select
          value={app}
          onChange={(e) =>
            setApp(e.target.value)
          }
        >
          <option value="todos">
            Todos
          </option>

          <option value="uber">
            Uber
          </option>

          <option value="99">
            99
          </option>
        </select>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Receita Total</h3>

          <div className="kpi-value">
            {receitaTotalGeral.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              }
            )}
          </div>
        </div>

        <div className="card">
          <h3>Corridas</h3>

          <div className="kpi-value">
            {corridasTotalGeral}
          </div>
        </div>

        <div className="card">
          <h3>R$/Hora Médio</h3>

          <div className="kpi-value">
            {reaisPorHoraMedio.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              }
            )}
          </div>
        </div>
      </div>

      <br />

      {jornadasExibidas.length === 0 && (
        <p>
          Nenhuma jornada encontrada para este aplicativo.
        </p>
      )}

      {jornadasExibidas
        .slice()
        .sort((a, b) =>
          b.data.localeCompare(a.data)
        )
        .map((jornada) => {
          const receitaTotal =
            obterReceita(jornada)

          const totalCorridas =
            obterCorridas(jornada)

          const horas =
            Number(jornada.horas) || 0

          const km =
            Number(jornada.km) || 0

          const consumo =
            Number(jornada.consumo) || 0

          const precoCombustivel =
            Number(
              jornada.precoCombustivel
            ) ||
            Number(
              localStorage.getItem(
                'thoruberbh-combustivel'
              ) || 6
            )

          const reaisPorHora =
            horas > 0
              ? receitaTotal / horas
              : 0

          const reaisPorKm =
            km > 0
              ? receitaTotal / km
              : 0

          const litrosConsumidos =
            consumo > 0
              ? km / consumo
              : 0

          const custoCombustivel =
            litrosConsumidos *
            precoCombustivel

          const reservaManutencao =
            receitaTotal * 0.1

          const lucroEstimado =
            receitaTotal -
            custoCombustivel -
            reservaManutencao

          return (
            <div
              key={jornada.id}
              className="card"
            >
              <h3>
                📅 {formatarData(jornada.data)}
              </h3>

              <div className="cards">
                <div>
                  <strong>
                    {receitaTotal.toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      }
                    )}
                  </strong>

                  <p>Receita</p>
                </div>

                <div>
                  <strong>
                    {lucroEstimado.toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      }
                    )}
                  </strong>

                  <p>Lucro</p>
                </div>

                <div>
                  <strong>
                    {totalCorridas}
                  </strong>

                  <p>Corridas</p>
                </div>

                <div>
                  <strong>
                    {formatarTempo(horas)}
                  </strong>

                  <p>Tempo</p>
                </div>

                <div>
                  <strong>
                    {reaisPorHora.toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      }
                    )}
                  </strong>

                  <p>R$/Hora</p>
                </div>

                <div>
                  <strong>
                    {reaisPorKm.toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      }
                    )}
                  </strong>

                  <p>R$/KM</p>
                </div>
              </div>

              <button
                onClick={() =>
                  excluirJornada(
                    jornada.id
                  )
                }
              >
                Excluir Jornada
              </button>
            </div>
          )
        })}
    </div>
  )
}

export default Historico