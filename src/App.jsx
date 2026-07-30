import { useEffect, useState } from 'react'

import Dashboard from './pages/Dashboard'
import Historico from './pages/Historico'
import Jornada from './pages/Jornada'
import Configuracoes from './pages/Configuracoes'

import { jornadas as jornadasIniciais } from './data/jornadas'

function App() {
  const [tela, setTela] = useState('dashboard')

  const [jornadas, setJornadas] = useState(() => {
    const jornadasSalvas =
      localStorage.getItem('thoruberbh-jornadas')

    if (jornadasSalvas) {
      return JSON.parse(jornadasSalvas)
    }

    return jornadasIniciais
  })

  useEffect(() => {
    localStorage.setItem(
      'thoruberbh-jornadas',
      JSON.stringify(jornadas)
    )
  }, [jornadas])

  function adicionarJornada(novaJornada) {
    setJornadas([
      ...jornadas,
      {
        ...novaJornada,
        id: Date.now(),
      },
    ])
  }

  function excluirJornada(id) {
    setJornadas(
      jornadas.filter(
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
          Desempenho operacional para
          motoristas de aplicativo
        </p>
      </header>

      <nav className="menu">
        <button
          className={
            tela === 'dashboard'
              ? 'menu-active'
              : ''
          }
          onClick={() =>
            setTela('dashboard')
          }
        >
          📊 Dashboard
        </button>

        <button
          className={
            tela === 'historico'
              ? 'menu-active'
              : ''
          }
          onClick={() =>
            setTela('historico')
          }
        >
          📋 Histórico
        </button>

        <button
          className={
            tela === 'jornada'
              ? 'menu-active'
              : ''
          }
          onClick={() =>
            setTela('jornada')
          }
        >
          ➕ Jornada
        </button>

        <button
          className={
            tela === 'configuracoes'
              ? 'menu-active'
              : ''
          }
          onClick={() =>
            setTela('configuracoes')
          }
        >
          ⚙️ Config
        </button>
      </nav>

      <main>{renderizarTela()}</main>
    </div>
  )
}

export default App