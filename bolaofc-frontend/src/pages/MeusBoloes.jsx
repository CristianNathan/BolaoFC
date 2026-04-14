import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function MeusBoloes() {
  const navigate = useNavigate();
  const [meusBoloes, setMeusBoloes] = useState([]); // Criados por mim ou participando
  const [boloesPublicos, setBoloesPublicos] = useState([]); // Disponíveis para entrar
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os dados do Back-end
    Promise.all([
      api.get('/api/bolao/meus'),
      api.get('/api/bolao/publicos')
    ])
      .then(([resMeus, resPublicos]) => {
        setMeusBoloes(resMeus.data);
        setBoloesPublicos(resPublicos.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar bolões", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/home')} style={styles.backBtn}>
          ← Voltar
        </button>
        <h2>🏆 Meus Bolões</h2>
      </header>

      <main style={styles.main}>
        <section>
          <h3>Seus Grupos</h3>
          <div style={styles.grid}>
            {meusBoloes.length > 0 ? meusBoloes.map(b => (
              <div key={b.id} style={styles.card}>
                <h4>{b.nome}</h4>
                <p>Código: <strong>{b.codigoConvite}</strong></p>

                <button
                  onClick={() => navigate(`/bolao/${b.id}`)}
                  style={styles.btnAcessar}
                >
                  Detalhes
                </button>
              </div>
            )) : (
              <p style={styles.empty}>
                Você ainda não participa de nenhum bolão.
              </p>
            )}
          </div>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h3>Explorar Bolões Públicos 🌍</h3>
          <div style={styles.grid}>
            {boloesPublicos.map(b => (
              <div key={b.id} style={styles.cardPublico}>
                <h4>{b.nome}</h4>
                <p>{b.participantes} participantes</p>

                <button style={styles.btnEntrar}>
                  Entrar Agora
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f2027',
    color: '#fff',
    padding: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#00e676',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  main: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #00e676'
  },
  cardPublico: {
    background: 'rgba(255,255,255,0.05)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #aaa'
  },
  btnAcessar: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    background: '#00e676',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  btnEntrar: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    background: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  empty: {
    color: '#888',
    fontSize: '14px'
  }
};