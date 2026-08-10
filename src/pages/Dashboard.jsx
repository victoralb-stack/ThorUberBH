import { useState } from 'react'

const MILISSEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24

function obterDataLocalAtual() {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function criarDataLocal(dataTexto) {
  if (!dataTexto) {
    return null
  }

  const [ano, mes, dia] = dataTexto.split('-').map(Number)

  if (!ano || !mes || !dia) {
    return null
  }

  return new Date(ano, mes - 1, dia)
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatarTempo(horasDecimais) {
  const minutosTotais = Math.round((Number(horasDecimais) || 0) * 60)
  const horas = Math.floor(minutosTotais / 60)
  const minutos = minutosTotais % 60

  return `${horas}h ${String(minutos).padStart(2, '0')}min`
}

function formatarQuilometragem(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

function formatarDiaMes(data) {
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

function obterInicioSemana(data) {
  const inicio = new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate()
  )

  const diaDaSemana = inicio.getDay()
  const diferencaParaSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana

  inicio.setDate(inicio.getDate() + diferencaParaSegunda)
  inicio.setHours(0, 0, 0, 0)

  return inicio
}

function obterFimSemana(data) {
  const fim = obterInicioSemana(data)

  fim.setDate(fim.getDate() + 6)
  fim.setHours(23, 59, 59, 999)

  return fim
}

function obterSemanaDentroDoMes(data) {
  const ano = data.getFullYear()
  const mes = data.getMonth()
  const primeiroDiaDoMes = new Date(ano, mes, 1)
  const ultimoDiaDoMes = new Date(ano, mes + 1, 0)
  const inicioPrimeiraSemana = obterInicioSemana(primeiroDiaDoMes)
  const inicioSemanaDaData = obterInicioSemana(data)
  const fimSemanaDaData = obterFimSemana(data)

  const diferencaEmDias = Math.round(
    (inicioSemanaDaData.getTime() - inicioPrimeiraSemana.getTime()) /
      MILISSEGUNDOS_POR_DIA
  )

  const numeroSemana = Math.floor(diferencaEmDias / 7) + 1

  const inicioPeriodo =
    inicioSemanaDaData < primeiroDiaDoMes
      ? primeiroDiaDoMes
      : inicioSemanaDaData

  const fimPeriodo =
    fimSemanaDaData > ultimoDiaDoMes
      ? ultimoDiaDoMes
      : fimSemanaDaData

  return {
    numeroSemana,
    inicioPeriodo,
    fimPeriodo,
  }
}

function Dashboard({ jornadas }) {
  const [periodo, setPeriodo] = useState('tudo')
  const [dataEspecifica, setDataEspecifica] = useState(
    obterDataLocalAtual()
  )

  const hoje = criarDataLocal(obterDataLocalAtual())
  const inicioSemanaAtual = obterInicioSemana(hoje)
  const fimSemanaAtual = obterFimSemana(hoje)

  const jornadasFiltradas = jornadas.filter((jornada) => {
    const data = criarDataLocal(jornada.data)

    if (!data) {
      return false
    }

    if (periodo === 'data') {
      return jornada.data === dataEspecifica
    }

    if (periodo === 'semana') {
      return data >= inicioSemanaAtual && data <= fimSemanaAtual
    }

    if (periodo === 'mes') {
      return (
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear()
      )
    }

    if (periodo === 'ano') {
      return data.getFullYear() === hoje.getFullYear()
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

  jornadasFiltradas.forEach((jornada) => {
    const uberReceita = Number(jornada.uberReceita) || 0
    const noventa9Receita = Number(jornada.noventa9Receita) || 0
    const uberCorridas = Number(jornada.uberCorridas) || 0
    const noventa9Corridas = Number(jornada.noventa9Corridas) || 0
    const horas = Number(jornada.horas) || 0
    const km = Number(jornada.km) || 0
    const consumo = Number(jornada.consumo) || 0
    const precoCombustivel =
      Number(jornada.precoCombustivel) ||
      Number(localStorage.getItem('thoruberbh-combustivel') || 6)

    receitaTotal += uberReceita + noventa9Receita
    totalCorridas += uberCorridas + noventa9Corridas
    totalHoras += horas
    totalKm += km

    if (consumo > 0) {
      somaConsumo += consumo
      quantidadeConsumos += 1
      custoCombustivel += (km / consumo) * precoCombustivel
    }
  })

  const reaisPorHora = totalHoras > 0 ? receitaTotal / totalHoras : 0
  const reaisPorKm = totalKm > 0 ? receitaTotal / totalKm : 0
  const consumoMedio =
    quantidadeConsumos > 0 ? somaConsumo / quantidadeConsumos : 0
  const reservaManutencao = receitaTotal * 0.1
  const lucroEstimado = receitaTotal - custoCombustivel - reservaManutencao

  function obterGrupoGrafico(jornada) {
    const data = criarDataLocal(jornada.data)

    if (!data) {
      return null
    }

    const ano = data.getFullYear()
    const mes = data.getMonth()

    if (periodo === 'data' || periodo === 'semana') {
      return {
        chave: jornada.data,
        ordem: data.getTime(),
        rotulo: formatarDiaMes(data),
      }
    }

    if (periodo === 'mes') {
      const semana = obterSemanaDentroDoMes(data)

      return {
        chave: `${ano}-${mes + 1}-semana-${semana.numeroSemana}`,
        ordem: semana.inicioPeriodo.getTime(),
        rotulo:
          `Semana ${semana.numeroSemana}: ` +
          `${formatarDiaMes(semana.inicioPeriodo)} a ` +
          `${formatarDiaMes(semana.fimPeriodo)}`,
      }
    }

    if (periodo === 'ano') {
      const numeroBimestre = Math.floor(mes / 2) + 1
      const nomesBimestres = [
        'Jan/Fev',
        'Mar/Abr',
        'Mai/Jun',
        'Jul/Ago',
        'Set/Out',
        'Nov/Dez',
      ]

      return {
        chave: `${ano}-bimestre-${numeroBimestre}`,
        ordem: ano * 10 + numeroBimestre,
        rotulo: nomesBimestres[numeroBimestre - 1],
      }
    }

    return {
      chave: String(ano),
      ordem: ano,
      rotulo: String(ano),
    }
  }

  const gruposGrafico = {}

  jornadasFiltradas.forEach((jornada) => {
    const grupo = obterGrupoGrafico(jornada)

    if (!grupo) {
      return
    }

    if (!gruposGrafico[grupo.chave]) {
      gruposGrafico[grupo.chave] = {
        chave: grupo.chave,
        ordem: grupo.ordem,
        rotulo: grupo.rotulo,
        uberReceita: 0,
        noventa9Receita: 0,
      }
    }

    gruposGrafico[grupo.chave].uberReceita +=
      Number(jornada.uberReceita) || 0

    gruposGrafico[grupo.chave].noventa9Receita +=
      Number(jornada.noventa9Receita) || 0
  })

  let dadosGrafico = Object.values(gruposGrafico).sort(
    (primeiro, segundo) => primeiro.ordem - segundo.ordem
  )

  if (periodo === 'tudo' && dadosGrafico.length > 7) {
    dadosGrafico = dadosGrafico.slice(-7)
  }

  const receitaMaxima =
    dadosGrafico.length > 0
      ? Math.max(
          ...dadosGrafico.map(
            (grupo) => grupo.uberReceita + grupo.noventa9Receita
          ),
          1
        )
      : 1

  const tituloGrafico = {
    data: 'Receita da Data',
    semana: 'Receita por Dia',
    mes: 'Receita por Semana',
    ano: 'Receita por Bimestre',
    tudo: 'Receita por Ano',
  }[periodo]

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="card">
        <label>Período</label>

        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
        >
          <option value="data">Data específica</option>
          <option value="semana">Semana atual</option>
          <option value="mes">Mês atual</option>
          <option value="ano">Ano</option>
          <option value="tudo">Tudo</option>
        </select>

        {periodo === 'data' && (
          <>
            <label>Escolha a data</label>

            <input
              type="date"
              value={dataEspecifica}
              onChange={(e) => setDataEspecifica(e.target.value)}
            />
          </>
        )}
      </div>

      <div className="cards">
        <div className="card">
          <h3>Receita</h3>
          <div className="kpi-value">{formatarMoeda(receitaTotal)}</div>
        </div>

        <div className="card">
          <h3>Corridas</h3>
          <div className="kpi-value">{totalCorridas}</div>
        </div>

        <div className="card">
          <h3>R$/Hora</h3>
          <div className="kpi-value">{formatarMoeda(reaisPorHora)}</div>
        </div>

        <div className="card">
          <h3>R$/KM</h3>
          <div className="kpi-value">{formatarMoeda(reaisPorKm)}</div>
        </div>

        <div className="card">
          <h3>Horas</h3>
          <div className="kpi-value">{formatarTempo(totalHoras)}</div>
        </div>

        <div className="card">
          <h3>KM Rodados</h3>
          <div className="kpi-value">
            {formatarQuilometragem(totalKm)} km
          </div>
        </div>

        <div className="card">
          <h3>⛽ Combustível</h3>
          <div className="kpi-value">
            {formatarMoeda(custoCombustivel)}
          </div>
        </div>

        <div className="card">
          <h3>Consumo Médio</h3>
          <div className="kpi-value">{consumoMedio.toFixed(1)} km/l</div>
        </div>

        <div className="card">
          <h3>Lucro Estimado</h3>
          <div className="kpi-value">{formatarMoeda(lucroEstimado)}</div>
        </div>

        <div className="card">
          <h3>🔧 Reserva</h3>
          <div className="kpi-value">
            {formatarMoeda(reservaManutencao)}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>📈 {tituloGrafico}</h3>

        {dadosGrafico.length === 0 && (
          <p>Nenhuma jornada encontrada neste período.</p>
        )}

        {dadosGrafico.map((grupo) => {
          const receitaGrupo =
            grupo.uberReceita + grupo.noventa9Receita

          const larguraTotal =
            receitaGrupo > 0
              ? (receitaGrupo / receitaMaxima) * 100
              : 0

          const proporcaoUber =
            receitaGrupo > 0
              ? (grupo.uberReceita / receitaGrupo) * 100
              : 0

          const proporcao99 =
            receitaGrupo > 0
              ? (grupo.noventa9Receita / receitaGrupo) * 100
              : 0

          return (
            <div
              key={grupo.chave}
              style={{ marginBottom: '20px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '6px',
                }}
              >
                <strong>{grupo.rotulo}</strong>
                <strong>{formatarMoeda(receitaGrupo)}</strong>
              </div>

              <div
                style={{
                  width: `${larguraTotal}%`,
                  minWidth: receitaGrupo > 0 ? '4px' : '0',
                  height: '22px',
                  display: 'flex',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  background: '#e5e7eb',
                }}
              >
                <div
                  style={{
                    width: `${proporcaoUber}%`,
                    background: '#2563eb',
                  }}
                />

                <div
                  style={{
                    width: `${proporcao99}%`,
                    background: '#22c55e',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                  marginTop: '6px',
                  fontSize: '12px',
                }}
              >
                <span>🟦 Uber: {formatarMoeda(grupo.uberReceita)}</span>
                <span>🟩 99: {formatarMoeda(grupo.noventa9Receita)}</span>
              </div>
            </div>
          )
        })}
      </div>

      <p>{jornadasFiltradas.length} jornada(s)</p>
    </div>
  )
}

export default Dashboard
