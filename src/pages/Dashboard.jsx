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

function criarDataLocal(dataTexto) {
  const [ano, mes, dia] = dataTexto
    .split('-')
    .map(Number)

  return new Date(ano, mes - 1, dia)
}

function formatarTempo(horasDecimais) {
  const minutosTotais = Math.round(
    horasDecimais * 60
  )

  const horas = Math.floor(
    minutosTotais / 60
  )

  const minutos = minutosTotais % 60

  return `${horas}h ${String(minutos).padStart(2, '0')}min`
}

function Dashboard({ jornadas }) {
  const [periodo, setPeriodo] =
    useState('tudo')

  const [dataEspecifica, setDataEspecifica] =
    useState(obterDataLocalAtual())

  const jornadasFiltradas = jornadas.filter(
    (jornada) => {
      if (!jornada.data) {
        return false
      }

      const data = criarDataLocal(jornada.data)
      const hoje = criarDataLocal(
        obterDataLocalAtual()
      )

      if (periodo === 'data') {
        return jornada.data === dataEspecifica
      }

      if (periodo === 'semana') {
        const inicioHoje = new Date(
          hoje.getFullYear(),
          hoje.getMonth(),
          hoje.getDate()
        )

        const inicioJornada = new Date(
          data.getFullYear(),
          data.getMonth(),
          data.getDate()
        )

        const diferencaMs =
          inicioHoje.getTime() -
          inicioJornada.getTime()

        const diferencaDias = Math.floor(
          diferencaMs /
            (1000 * 60 * 60 * 24)
        )

        return (
          diferencaDias >= 0 &&
          diferencaDias <= 6
        )
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
    }
  )

  let receitaTotal = 0
  let totalCorridas = 0
  let totalHoras = 0
  let totalKm = 0
  let totalConsumo = 0
  let quantidadeConsumosValidos = 0
  let custoCombustivel = 0

  jornadasFiltradas.forEach((jornada) => {
    const uberReceita =
      Number(jornada.uberReceita) || 0

    const noventa9Receita =
      Number(jornada.noventa9Receita) || 0

    const uberCorridas =
      Number(jornada.uberCorridas) || 0

    const noventa9Corridas =
      Number(jornada.noventa9Corridas) || 0

    const horas = Number(jornada.horas) || 0
    const km = Number(jornada.km) || 0
    const consumo =
      Number(jornada.consumo) || 0

    const precoCombustivel =
      Number(jornada.precoCombustivel) ||
      Number(
        localStorage.getItem(
          'thoruberbh-combustivel'
        ) || 6
      )

    receitaTotal +=
      uberReceita + noventa9Receita

    totalCorridas +=
      uberCorridas + noventa9Corridas

    totalHoras += horas
    totalKm += km

    if (consumo > 0) {
      totalConsumo += consumo
      quantidadeConsumosValidos += 1

      custoCombustivel +=
        (km / consumo) *
        precoCombustivel
    }
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
    quantidadeConsumosValidos > 0
      ? totalConsumo /
        quantidadeConsumosValidos
      : 0

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
            (jornada) =>
              (Number(
                jornada.uberReceita
              ) || 0) +
              (Number(
                jornada.noventa9Receita
              ) || 0)
          ),
          1
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
          <option value="data">
            Data específica
          </option>

          <option value="semana">
            Últimos 7 dias
          </option>

          <option value="mes">
            Mês atual
          </option>

          <option value="ano">
            Ano atual
          </option>

          <option value="tudo">
            Tudo
          </option>
        </select>

        {periodo === 'data' && (
          <>
            <label>Escolha a data</label>

            <input
              type="date"
              value={dataEspecifica}
              onChange={(e) =>
                setDataEspecifica(
                  e.target.value
                )
              }
            />
          </>
        )}
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
          <h3>Corridas</h3>

          <div className="kpi-value">
            {totalCorridas}
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
          <h3>Horas</h3>

          <div className="kpi-value">
            {formatarTempo(totalHoras)}
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
        <h3>📈 Receita por Dia</h3>

        {jornadasFiltradas.length === 0 && (
          <p>
            Nenhuma jornada encontrada neste período.
          </p>
        )}

        {jornadasFiltradas
          .slice()
          .sort((a, b) =>
            a.data.localeCompare(b.data)
          )
          .map((jornada) => {
            const uberReceita =
              Number(
                jornada.uberReceita
              ) || 0

            const noventa9Receita =
              Number(
                jornada.noventa9Receita
              ) || 0

            const receitaTotalDia =
              uberReceita +
              noventa9Receita

            const largura =
              receitaTotalDia > 0
                ? (receitaTotalDia /
                    receitaMaxima) *
                  100
                : 0

            const larguraUber =
              receitaTotalDia > 0
                ? (uberReceita /
                    receitaTotalDia) *
                  100
                : 0

            const largura99 =
              receitaTotalDia > 0
                ? (noventa9Receita /
                    receitaTotalDia) *
                  100
                : 0

            const dataFormatada =
              criarDataLocal(
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
                    {dataFormatada}
                  </strong>

                  <strong>
                    {receitaTotalDia.toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      }
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    width: `${largura}%`,
                    minWidth:
                      receitaTotalDia > 0
                        ? '4px'
                        : '0',
                    height: '22px',
                    display: 'flex',
                    overflow: 'hidden',
                    borderRadius: '10px',
                    background:
                      '#e5e7eb',
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
                    gap: '10px',
                    marginTop: '6px',
                    fontSize: '12px',
                  }}
                >
                  <span>
                    🟦 Uber:{' '}
                    {uberReceita.toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      }
                    )}
                  </span>

                  <span>
                    🟩 99:{' '}
                    {noventa9Receita.toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      }
                    )}
                  </span>
                </div>
              </div>
            )
          })}
      </div>

      <p>
        {jornadasFiltradas.length} jornada(s)
      </p>
    </div>
  )
}

export default Dashboard