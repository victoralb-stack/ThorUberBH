import { useState } from 'react'

function Dashboard({ jornadas }) {
  const [periodo, setPeriodo] = useState('tudo')
  const [app, setApp] = useState('todos')

  const precoCombustivel = Number(
    localStorage.getItem(
      'thoruberbh-combustivel'
    ) || 6
  )

  const jornadasFiltradas = jornadas.filter((jornada) => {
    const data = new Date(jornada.data)
    const hoje = new Date()

    if (periodo === 'hoje') {
      return data.toDateString() === hoje.toDateString()
    }

    if (periodo === 'semana') {
      const diferencaMs =
        hoje.getTime() - data.getTime()

      const diferencaDias =
        diferencaMs /
        (1000 * 60 * 60 * 24)

      return diferencaDias <= 7
    }

    if (periodo === 'mes') {
      return (
        data.getMonth() ===
          hoje.getMonth() &&
        data.getFullYear() ===
          hoje.getFullYear()
      )
    }

    if (periodo === 'ano') {
      return (
        data.getFullYear() ===
        hoje.getFullYear()
      )
    }

    return true
  })

  let receitaTotal = 0
  let totalCorridas = 0
  let totalHoras = 0
  let totalKm = 0
  let totalConsumo = 0

  jornadasFiltradas.forEach((jornada) => {
    if (app === 'uber') {
      receitaTotal += jornada.uberReceita
      totalCorridas += jornada.uberCorridas
    } else if (app === '99') {
      receitaTotal +=
        jornada.noventa9Receita

      totalCorridas +=
        jornada.noventa9Corridas
    } else {
      receitaTotal +=
        jornada.uberReceita +
        jornada.noventa9Receita

      totalCorridas +=
        jornada.uberCorridas +
        jornada.noventa9Corridas
    }

    totalHoras += jornada.horas
    totalKm += jornada.km
    totalConsumo += jornada.consumo
  })

  const reaisPorHora =
    totalHoras > 0
      ? receitaTotal / totalHoras
      : 0

  const reaisPorKm =
    totalKm > 0
      ? receitaTotal / totalKm
      : 0

  const consumoMedio =
    jornadasFiltradas.length > 0
      ? totalConsumo /
        jornadasFiltradas.length
      : 0

  const litrosConsumidos =
    consumoMedio > 0
      ? totalKm / consumoMedio
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

  const receitaMaxima =
    jornadasFiltradas.length > 0
      ? Math.max(
          ...jornadasFiltradas.map(
            (j) =>
              j.uberReceita +
              j.noventa9Receita
          )
        )
      : 1

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="card">
        <label>Período</label>

        <select
          value={periodo}
          onChange={(e) =>
            setPeriodo(e.target.value)
          }
        >
          <option value="hoje">
            Hoje
          </option>

          <option value="semana">
            Semana
          </option>

          <option value="mes">
            Mês
          </option>

          <option value="ano">
            Ano
          </option>

          <option value="tudo">
            Tudo
          </option>
        </select>

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
          <h3>Receita</h3>

          <div className="kpi-value">
            {receitaTotal.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              }
            )}
          </div>
        </div>

        <div className="card">
          <h3>Lucro Estimado</h3>

          <div className="kpi-value">
            {lucroEstimado.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              }
            )}
          </div>
        </div>

        <div className="card">
          <h3>⛽ Combustível</h3>

          <div className="kpi-value">
            {custoCombustivel.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              }
            )}
          </div>
        </div>

        <div className="card">
          <h3>🔧 Reserva</h3>

          <div className="kpi-value">
            {reservaManutencao.toLocaleString(
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
            {totalCorridas}
          </div>
        </div>

        <div className="card">
          <h3>Horas</h3>

          <div className="kpi-value">
            {totalHoras.toFixed(1)}h
          </div>
        </div>

        <div className="card">
          <h3>R$/Hora</h3>

          <div className="kpi-value">
            {reaisPorHora.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              }
            )}
          </div>
        </div>

        <div className="card">
          <h3>R$/KM</h3>

          <div className="kpi-value">
            {reaisPorKm.toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              }
            )}
          </div>
        </div>

        <div className="card">
          <h3>Consumo Médio</h3>

          <div className="kpi-value">
            {consumoMedio.toFixed(1)} km/l
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{ marginTop: '20px' }}
      >
        <h3>
          📈 Receita por Dia
        </h3>

        {jornadasFiltradas
          .slice()
          .reverse()
          .map((jornada) => {
            const receitaTotalDia =
              jornada.uberReceita +
              jornada.noventa9Receita

            const largura =
              (receitaTotalDia /
                receitaMaxima) *
              100

            const larguraUber =
              receitaTotalDia > 0
                ? (jornada.uberReceita /
                    receitaTotalDia) *
                  100
                : 0

            const largura99 =
              receitaTotalDia > 0
                ? (jornada.noventa9Receita /
                    receitaTotalDia) *
                  100
                : 0

            const data =
              new Date(
                jornada.data
              ).toLocaleDateString(
                'pt-BR',
                {
                  day: '2-digit',
                  month: '2-digit',
                }
              )

            return (
              <div
                key={jornada.id}
                style={{
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <strong>
                    {data}
                  </strong>

                  <strong>
                    {receitaTotalDia.toLocaleString(
                      'pt-BR',
                      {
                        style:
                          'currency',
                        currency:
                          'BRL',
                      }
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    width: `${largura}%`,
                    height: '22px',
                    display: 'flex',
                    overflow: 'hidden',
                    borderRadius:
                      '10px',
                  }}
                >
                  <div
                    style={{
                      width: `${larguraUber}%`,
                      background:
                        '#2563eb',
                    }}
                  />

                  <div
                    style={{
                      width: `${largura99}%`,
                      background:
                        '#22c55e',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    marginTop: '6px',
                    fontSize: '12px',
                  }}
                >
                  <span>
                    🟦 Uber:{' '}
                    {jornada.uberReceita.toLocaleString(
                      'pt-BR',
                      {
                        style:
                          'currency',
                        currency:
                          'BRL',
                      }
                    )}
                  </span>

                  <span>
                    🟩 99:{' '}
                    {jornada.noventa9Receita.toLocaleString(
                      'pt-BR',
                      {
                        style:
                          'currency',
                        currency:
                          'BRL',
                      }
                    )}
                  </span>
                </div>
              </div>
            )
          })}
      </div>

      <p>
        {jornadasFiltradas.length}{' '}
        jornada(s)
      </p>
    </div>
  )
}

export default Dashboard