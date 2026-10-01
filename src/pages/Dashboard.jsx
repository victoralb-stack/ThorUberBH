import { useState } from 'react'

function obterDataAtual() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function criarData(dataTexto) {
  if (!dataTexto) {
    return null
  }

  const [ano, mes, dia] = dataTexto.split('-').map(Number)

  if (!ano || !mes || !dia) {
    return null
  }

  return new Date(ano, mes - 1, dia)
}

function formatarData(data) {
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatarTempo(horasDecimais) {
  const minutosTotais = Math.round(
    (Number(horasDecimais) || 0) * 60
  )

  const horas = Math.floor(minutosTotais / 60)
  const minutos = minutosTotais % 60

  return `${horas}h ${String(minutos).padStart(2, '0')}min`
}

function formatarKm(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

function obterInicioSemana(data) {
  const inicio = new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate()
  )

  const diaSemana = inicio.getDay()
  const ajuste = diaSemana === 0 ? -6 : 1 - diaSemana

  inicio.setDate(inicio.getDate() + ajuste)
  inicio.setHours(0, 0, 0, 0)

  return inicio
}

function obterFimSemana(data) {
  const fim = obterInicioSemana(data)

  fim.setDate(fim.getDate() + 6)
  fim.setHours(23, 59, 59, 999)

  return fim
}

function obterSemanaDoMes(data) {
  const ano = data.getFullYear()
  const mes = data.getMonth()

  const primeiroDiaMes = new Date(ano, mes, 1)
  const ultimoDiaMes = new Date(ano, mes + 1, 0)

  const inicioPrimeiraSemana = obterInicioSemana(
    primeiroDiaMes
  )

  const inicioSemana = obterInicioSemana(data)
  const fimSemana = obterFimSemana(data)

  const diferencaDias = Math.round(
    (inicioSemana.getTime() -
      inicioPrimeiraSemana.getTime()) /
      (1000 * 60 * 60 * 24)
  )

  const numero = Math.floor(diferencaDias / 7) + 1

  return {
    numero,
    inicio:
      inicioSemana < primeiroDiaMes
        ? primeiroDiaMes
        : inicioSemana,
    fim:
      fimSemana > ultimoDiaMes
        ? ultimoDiaMes
        : fimSemana,
  }
}

function Dashboard({ jornadas }) {
  const hojeTexto = obterDataAtual()
  const hoje = criarData(hojeTexto)

  const [filtro, setFiltro] = useState('total')
  const [dataEspecifica, setDataEspecifica] =
    useState(hojeTexto)
  const [dataInicial, setDataInicial] =
    useState(hojeTexto)
  const [dataFinal, setDataFinal] =
    useState(hojeTexto)

  const inicioSemanaAtual = obterInicioSemana(hoje)
  const fimSemanaAtual = obterFimSemana(hoje)

  const jornadasFiltradas = jornadas.filter((jornada) => {
    const data = criarData(jornada.data)

    if (!data) {
      return false
    }

    if (filtro === 'data') {
      return jornada.data === dataEspecifica
    }

    if (filtro === 'periodo') {
      if (!dataInicial || !dataFinal) {
        return false
      }

      const inicio = criarData(dataInicial)
      const fim = criarData(dataFinal)

      return data >= inicio && data <= fim
    }

    if (filtro === 'semana') {
      return (
        data >= inicioSemanaAtual &&
        data <= fimSemanaAtual
      )
    }

    if (filtro === 'mes') {
      return (
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear()
      )
    }

    return true
  })

  let receitaTotal = 0
  let totalCorridas = 0
  let totalHoras = 0
  let totalKm = 0
  let somaConsumo = 0
  let quantidadeConsumos = 0
  let custoCombustivel = 0
  let reservaManutencao = 0

  jornadasFiltradas.forEach((jornada) => {
    const uberReceita =
      Number(jornada.uberReceita) || 0

    const receita99 =
      Number(jornada.noventa9Receita) || 0

    const receitaJornada =
      uberReceita + receita99

    const uberCorridas =
      Number(jornada.uberCorridas) || 0

    const corridas99 =
      Number(jornada.noventa9Corridas) || 0

    const horas =
      Number(jornada.horas) || 0

    const km =
      Number(jornada.km) || 0

    const consumo =
      Number(jornada.consumo) || 0

    const precoCombustivel =
      Number(jornada.precoCombustivel) ||
      Number(
        localStorage.getItem(
          'thoruberbh-combustivel'
        ) || 6
      )

    const percentualManutencao =
      jornada.percentualManutencao !== undefined
        ? Number(jornada.percentualManutencao)
        : 10

    receitaTotal += receitaJornada
    totalCorridas += uberCorridas + corridas99
    totalHoras += horas
    totalKm += km

    reservaManutencao +=
      receitaJornada *
      (percentualManutencao / 100)

    if (consumo > 0) {
      somaConsumo += consumo
      quantidadeConsumos += 1

      custoCombustivel +=
        (km / consumo) * precoCombustivel
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
    quantidadeConsumos > 0
      ? somaConsumo / quantidadeConsumos
      : 0

  const lucroEstimado =
    receitaTotal -
    custoCombustivel -
    reservaManutencao

  function obterGrupoGrafico(jornada) {
    const data = criarData(jornada.data)

    if (!data) {
      return null
    }

    if (
      filtro === 'data' ||
      filtro === 'periodo' ||
      filtro === 'semana'
    ) {
      return {
        chave: jornada.data,
        ordem: data.getTime(),
        rotulo: formatarData(data),
      }
    }

    if (filtro === 'mes') {
      const semana = obterSemanaDoMes(data)

      return {
        chave:
          `${data.getFullYear()}-` +
          `${data.getMonth()}-` +
          `${semana.numero}`,
        ordem: semana.inicio.getTime(),
        rotulo:
          `Semana ${semana.numero}: ` +
          `${formatarData(semana.inicio)} a ` +
          `${formatarData(semana.fim)}`,
      }
    }

    const ano = data.getFullYear()

    return {
      chave: String(ano),
      ordem: ano,
      rotulo: String(ano),
    }
  }

  const grupos = {}

  jornadasFiltradas.forEach((jornada) => {
    const grupo = obterGrupoGrafico(jornada)

    if (!grupo) {
      return
    }

    if (!grupos[grupo.chave]) {
      grupos[grupo.chave] = {
        ...grupo,
        uber: 0,
        noventa9: 0,
      }
    }

    grupos[grupo.chave].uber +=
      Number(jornada.uberReceita) || 0

    grupos[grupo.chave].noventa9 +=
      Number(jornada.noventa9Receita) || 0
  })

  let dadosGrafico = Object.values(grupos).sort(
    (a, b) => a.ordem - b.ordem
  )

  if (
    filtro === 'periodo' &&
    dadosGrafico.length > 7
  ) {
    dadosGrafico = dadosGrafico.slice(-7)
  }

  if (
    filtro === 'total' &&
    dadosGrafico.length > 7
  ) {
    dadosGrafico = dadosGrafico.slice(-7)
  }

  const receitaMaxima =
    dadosGrafico.length > 0
      ? Math.max(
          ...dadosGrafico.map(
            (grupo) =>
              grupo.uber +
              grupo.noventa9
          ),
          1
        )
      : 1

  const tituloGrafico = {
    data: 'Receita da Data',
    periodo: 'Receita por Dia',
    semana: 'Receita da Semana',
    mes: 'Receita por Semana',
    total: 'Receita Total',
  }[filtro]

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="card">
        <label>Período</label>

        <select
          value={filtro}
          onChange={(e) =>
            setFiltro(e.target.value)
          }
        >
          <option value="data">
            Data
          </option>

          <option value="periodo">
            Período
          </option>

          <option value="semana">
            Semana atual
          </option>

          <option value="mes">
            Mês atual
          </option>

          <option value="total">
            Total
          </option>
        </select>

        {filtro === 'data' && (
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

        {filtro === 'periodo' && (
          <>
            <label>Data inicial</label>

            <input
              type="date"
              value={dataInicial}
              onChange={(e) =>
                setDataInicial(
                  e.target.value
                )
              }
            />

            <label>Data final</label>

            <input
              type="date"
              value={dataFinal}
              onChange={(e) =>
                setDataFinal(
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
            {formatarMoeda(receitaTotal)}
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
            {formatarMoeda(reaisPorHora)}
          </div>
        </div>

        <div className="card">
          <h3>R$/KM</h3>
          <div className="kpi-value">
            {formatarMoeda(reaisPorKm)}
          </div>
        </div>

        <div className="card">
          <h3>Horas</h3>
          <div className="kpi-value">
            {formatarTempo(totalHoras)}
          </div>
        </div>

        <div className="card">
          <h3>KM Rodados</h3>
          <div className="kpi-value">
            {formatarKm(totalKm)} km
          </div>
        </div>

        <div className="card">
          <h3>⛽ Combustível</h3>
          <div className="kpi-value">
            {formatarMoeda(
              custoCombustivel
            )}
          </div>
        </div>

        <div className="card">
          <h3>Consumo Médio</h3>
          <div className="kpi-value">
            {consumoMedio.toFixed(1)} km/l
          </div>
        </div>

        <div className="card">
          <h3>Lucro Estimado</h3>
          <div className="kpi-value">
            {formatarMoeda(
              lucroEstimado
            )}
          </div>
        </div>

        <div className="card">
          <h3>🔧 Reserva</h3>
          <div className="kpi-value">
            {formatarMoeda(
              reservaManutencao
            )}
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{ marginTop: '20px' }}
      >
        <h3>📈 {tituloGrafico}</h3>

        {dadosGrafico.length === 0 && (
          <p>
            Nenhuma jornada encontrada neste período.
          </p>
        )}

        {dadosGrafico.map((grupo) => {
          const receita =
            grupo.uber +
            grupo.noventa9

          const largura =
            receita > 0
              ? (receita /
                  receitaMaxima) *
                100
              : 0

          const parteUber =
            receita > 0
              ? (grupo.uber /
                  receita) *
                100
              : 0

          const parte99 =
            receita > 0
              ? (grupo.noventa9 /
                  receita) *
                100
              : 0

          return (
            <div
              key={grupo.chave}
              style={{
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  gap: '12px',
                  marginBottom: '6px',
                }}
              >
                <strong>
                  {grupo.rotulo}
                </strong>

                <strong>
                  {formatarMoeda(
                    receita
                  )}
                </strong>
              </div>

              <div
                style={{
                  width: `${largura}%`,
                  minWidth:
                    receita > 0
                      ? '4px'
                      : '0',
                  height: '22px',
                  display: 'flex',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  background: '#e5e7eb',
                }}
              >
                <div
                  style={{
                    width: `${parteUber}%`,
                    background: '#2563eb',
                  }}
                />

                <div
                  style={{
                    width: `${parte99}%`,
                    background: '#22c55e',
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
                  {formatarMoeda(
                    grupo.uber
                  )}
                </span>

                <span>
                  🟩 99:{' '}
                  {formatarMoeda(
                    grupo.noventa9
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