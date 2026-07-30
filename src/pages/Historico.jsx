function Historico({
  jornadas,
  excluirJornada,
}) {
  function formatarData(dataTexto) {
    const data = new Date(dataTexto)

    return data.toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }
    )
  }

  const precoCombustivel = Number(
    localStorage.getItem(
      'thoruberbh-combustivel'
    ) || 6
  )

  let receitaTotalGeral = 0
  let corridasTotalGeral = 0
  let horasTotalGeral = 0

  jornadas.forEach((jornada) => {
    receitaTotalGeral +=
      jornada.uberReceita +
      jornada.noventa9Receita

    corridasTotalGeral +=
      jornada.uberCorridas +
      jornada.noventa9Corridas

    horasTotalGeral += jornada.horas
  })

  const reaisPorHoraMedio =
    horasTotalGeral > 0
      ? receitaTotalGeral /
        horasTotalGeral
      : 0

  return (
    <div>
      <h2>Histórico</h2>

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

      {jornadas.length === 0 && (
        <p>Nenhuma jornada cadastrada.</p>
      )}

      {jornadas
        .slice()
        .reverse()
        .map((jornada) => {
          const receitaTotal =
            jornada.uberReceita +
            jornada.noventa9Receita

          const totalCorridas =
            jornada.uberCorridas +
            jornada.noventa9Corridas

          const reaisPorHora =
            jornada.horas > 0
              ? receitaTotal /
                jornada.horas
              : 0

          const reaisPorKm =
            jornada.km > 0
              ? receitaTotal /
                jornada.km
              : 0

          const litrosConsumidos =
            jornada.consumo > 0
              ? jornada.km /
                jornada.consumo
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
                    {jornada.horas.toFixed(1)}h
                  </strong>

                  <p>Horas</p>
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
                  excluirJornada(jornada.id)
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