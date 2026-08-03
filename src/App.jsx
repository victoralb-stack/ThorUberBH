import { useEffect, useState } from 'react'

import Dashboard from './pages/Dashboard'
import Historico from './pages/Historico'
import Jornada from './pages/Jornada'
import Configuracoes from './pages/Configuracoes'

import { jornadas as jornadasIniciais } from './data/jornadas'

function App() {
  const [tela, setTela] = useState('dashboard')

  const [jornadas, setJornadas] = useState(() => {
    const precoCombustivelAtual = Number(
      localStorage.getItem('thoruberbh-combustivel') || 6
    )

    const jornadasSalvas = localStorage.getItem(
      'thoruberbh-jornadas'
    )

    const jornadasCarregadas = jornadasSalvas
      ? JSON.parse(jornadasSalvas)
      : jornadasIniciais

    return jornadasCarregadas.map((jornada) => ({
      ...jornada,
      precoCombustivel:
        Number(jornada.precoCombustivel) > 0
          ? Number(jornada.precoCombustivel)
          : precoCombustivelAtual,
    }))
  })

  useEffect(() => {
    localStorage.setItem(
      'thoruberbh-jornadas',
      JSON.stringify(jornadas)
    )
  }, [jornadas])

  function adicionarJornada(novaJornada) {
    setJornadas((jornadasAtuais) => [
      ...jornadasAtuais,
      {
        ...novaJornada,
        id: Date.now(),
      },
    ])
  }

  function excluirJornada(id) {
    setJornadas((jornadasAtuais) =>
      jornadasAtuais.filter(
        (jornada) => jornada.id !== id
      )
    )
  }

  function renderizarTela() {
    switch (tela) {
      case 'historico':
        return (
          <Historico
            jornadas={jornadas}
            excluirJornada={excluirJornada}
          />
        )

      case 'jornada':
        return (
          <Jornada
            adicionarJornada={adicionarJornada}
            voltarDashboard={() =>
              setTela('dashboard')
            }
          />
        )

      case 'configuracoes':
        return <Configuracoes />

      default:
        return (
          <Dashboard jornadas={jornadas} />
        )
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🚗 ThorUberBH</h1>

        <p>
          Desempenho operacional para motoristas de aplicativo
        </p>
      </header>

      <nav className="menu">
        <button
          className={
            tela === 'dashboard'
              ? 'menu-active'
              : ''
          }
          onClick={() => setTela('dashboard')}
        >
          📊 Dashboard
        </button>

        <button
          className={
            tela === 'historico'
              ? 'menu-active'
              : ''
          }
          onClick={() => setTela('historico')}
        >
          📋 Histórico
        </button>

        <button
          className={
            tela === 'jornada'
              ? 'menu-active'
              : ''
          }
          onClick={() => setTela('jornada')}
        >
          ➕ Jornada
        </button>

        <button
          className={
            tela === 'configuracoes'
              ? 'menu-active'
              : ''
          }
          onClick={() => setTela('configuracoes')}
        >
          ⚙️ Config
        </button>
      </nav>

      <main>{renderizarTela()}</main>
    </div>
  )
}

export default App