import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setErro('')

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(nickname)) {
      setErro('Nickname inválido. Use só letras, números e _ (3 a 20 caracteres).')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/register', { nickname, email, senha })
      navigate('/login')
    } catch (err) {
      const msg = err?.response?.data?.message
      setErro(msg || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>⚽ BolãoFC</div>
        <h1 style={styles.title}>Criar conta</h1>
        <p style={styles.sub}>Entre no jogo. Dispute com os melhores.</p>

        <form onSubmit={handleRegister} style={styles.form}>
          <label style={styles.label}>Nickname</label>
          <input
            style={styles.input}
            type="text"
            placeholder="ex: matheus_07"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            required
          />
          <p style={styles.hint}>Só letras, números e _ (3 a 20 caracteres)</p>

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label style={styles.label}>Senha</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />

          <label style={styles.label}>Confirmar senha</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={confirmarSenha}
            onChange={e => setConfirmarSenha(e.target.value)}
            required
          />

          {erro && <p style={styles.erro}>{erro}</p>}

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p style={styles.footer}>
          Já tem conta?{' '}
          <Link to="/login" style={styles.link}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '400px',
    color: '#fff',
  },
  badge: {
    background: '#00e676',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '13px',
    padding: '4px 12px',
    borderRadius: '20px',
    display: 'inline-block',
    marginBottom: '24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 4px',
  },
  sub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
    marginTop: '8px',
  },
  hint: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    margin: '2px 0 0',
  },
  input: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
  },
  erro: {
    color: '#ff5252',
    fontSize: '13px',
    margin: '4px 0',
  },
  btn: {
    marginTop: '16px',
    background: '#00e676',
    color: '#000',
    fontWeight: '700',
    fontSize: '15px',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    marginTop: '24px',
  },
  link: {
    color: '#00e676',
    textDecoration: 'none',
    fontWeight: '600',
  },
}