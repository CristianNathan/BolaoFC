import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, senha })
      localStorage.setItem('token', res.data.token)
      navigate('/home')
    } catch {
      setErro('Email ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>⚽ BolãoFC</div>
        <h1 style={styles.title}>Entrar</h1>
        <p style={styles.sub}>Faça seu palpite. Seja o campeão.</p>

        <form onSubmit={handleLogin} style={styles.form}>
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

          {erro && <p style={styles.erro}>{erro}</p>}

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={styles.footer}>
          Não tem conta?{' '}
          <Link to="/register" style={styles.link}>Cadastre-se</Link>
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
