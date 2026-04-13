import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function MeusBoloes() {
  const [boloes, setBoloes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    buscarMeusBoloes()
  }, [])

  async function buscarMeusBoloes() {
    try {
      const res = await api.get('/bolaos/meus')
      setBoloes(res.data)
    } catch (err) {
      console.error("Erro ao carregar bolões", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.container}>
      <header style={s.header}>
        <span style={s.logo} onClick={() => navigate('/home')}>
          ⚽ BolãoFC
        </span>

        <button onClick={() => navigate('/home')} style={s.btnVoltar}>
          Voltar aos Jogos
        </button>
      </header>

      <main style={s.main}>
        <h1 style={s.title}>Meus Bolões</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div style={s.grid}>
            {boloes.map((bolao) => (
              <div key={bolao.id} style={s.card}>

                <div>
                  <h3 style={s.nome}>{bolao.nome}</h3>

                  <span style={s.badge}>
                    {bolao.publico ? '🌍 Público' : '🔒 Privado'}
                  </span>

                  <p style={s.codigo}>
                    Código: <strong>{bolao.codigoConvite}</strong>
                  </p>
                </div>

                <div style={s.regras}>
                  <span>🎯 {bolao.pontosCheio} pts (Placar)</span>
                  <span>🏆 {bolao.pontosVencedor} pts (Vitória)</span>
                </div>

                <div style={s.botoes}>

                  <button
                    style={s.btnRanking}
                    onClick={() => navigate(`/ranking/${bolao.id}`)}
                  >
                    🏆 Abrir Bolão
                  </button>

                  <button
                    style={s.btnPalpite}
                    onClick={() => navigate(`/bolao/${bolao.id}`)}
                  >
                    ⚽ Fazer Palpite
                  </button>

                </div>

              </div>
            ))}

            {boloes.length === 0 && (
              <p style={{ color: '#8b949e' }}>
                Você ainda não participa de nenhum bolão.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

const s = {
  container: {
    minHeight: '100vh',
    background: '#0d1117',
    color: '#fff',
    fontFamily: 'sans-serif'
  },

  header: {
    padding: '20px 40px',
    background: '#161b22',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00e676',
    cursor: 'pointer'
  },

  btnVoltar: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid #30363d',
    padding: '8px 15px',
    borderRadius: 6,
    cursor: 'pointer'
  },

  main: {
    padding: '40px'
  },

  title: {
    marginBottom: '30px',
    fontSize: 28
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },

  card: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: 14,
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
  },

  nome: {
    margin: 0,
    fontSize: 20
  },

  badge: {
    fontSize: 11,
    background: '#21262d',
    padding: '4px 10px',
    borderRadius: 20,
    color: '#8b949e',
    display: 'inline-block',
    marginTop: 8
  },

  codigo: {
    fontSize: 13,
    color: '#8b949e',
    marginTop: 10
  },

  regras: {
    display: 'flex',
    gap: '12px',
    fontSize: 13,
    color: '#00e676'
  },

  botoes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  btnRanking: {
    background: '#30363d',
    border: 'none',
    padding: '12px',
    borderRadius: 8,
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.2s'
  },

  btnPalpite: {
    background: 'linear-gradient(135deg,#00e676,#00c853)',
    border: 'none',
    padding: '12px',
    borderRadius: 8,
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.2s'
  }
}