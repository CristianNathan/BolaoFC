import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LIGAS_DISPONIVEIS = [
  { id: 'PL', nome: 'Premier League' },
  { id: 'PD', nome: 'La Liga' },
  { id: 'BL1', nome: 'Bundesliga' },
  { id: 'SA', nome: 'Serie A' },
  { id: 'FL1', nome: 'Ligue 1' },
  { id: 'BSA', nome: 'Brasileirão' },
  { id: 'CL', nome: 'Champions League' },
];

export default function MeusBoloes() {
  const navigate = useNavigate();
  const [meusBoloes, setMeusBoloes] = useState([]);
  const [boloesPublicos, setBoloesPublicos] = useState([]);
  const [ligasSelecionadas, setLigasSelecionadas] = useState([]); // ✅ ALTERADO
  const [loading, setLoading] = useState(true);
  const [loadingPublicos, setLoadingPublicos] = useState(false);

  useEffect(() => {
    api.get('/api/bolao/meus')
      .then(res => setMeusBoloes(res.data))
      .catch(err => console.error("Erro ao buscar meus bolões", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoadingPublicos(true);

    const url = ligasSelecionadas.length > 0
      ? `/api/bolao/publicos?ligas=${ligasSelecionadas.join(',')}`
      : '/api/bolao/publicos';

    api.get(url)
      .then(res => setBoloesPublicos(res.data))
      .catch(err => console.error("Erro ao buscar bolões públicos", err))
      .finally(() => setLoadingPublicos(false));
  }, [ligasSelecionadas]);

  const handleChip = (ligaId) => {
    setLigasSelecionadas(prev =>
      prev.includes(ligaId)
        ? prev.filter(l => l !== ligaId)
        : [...prev, ligaId]
    );
  };

  const handleEntrar = async (codigoConvite) => {
    try {
      await api.post('/api/bolao/entrar', { codigoConvite });
      const res = await api.get('/api/bolao/meus');
      setMeusBoloes(res.data);
      alert('Você entrou no bolão!');
    } catch (err) {
      alert('Erro ao entrar no bolão.');
      console.error(err);
    }
  };

  if (loading) return <p style={{ color: '#fff', padding: 20 }}>Carregando...</p>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/home')} style={styles.backBtn}>
          ← Voltar
        </button>
        <h2>🏆 Meus Bolões</h2>
      </header>

      <main style={styles.main}>

        {/* MEUS BOLÕES */}
        <section>
          <h3 style={styles.sectionTitle}>Seus Grupos</h3>
          <div style={styles.grid}>
            {meusBoloes.length > 0 ? meusBoloes.map(b => (
              <div key={b.id} style={styles.card}>
                <h4 style={styles.cardTitle}>{b.nome}</h4>
                <p style={styles.cardCodigo}>Código: <strong>{b.codigoConvite}</strong></p>
                {b.ligasPermitidas?.length > 0 && (
                  <div style={styles.ligasWrap}>
                    {b.ligasPermitidas.map(l => (
                      <span key={l} style={styles.ligaTag}>
                        {LIGAS_DISPONIVEIS.find(x => x.id === l)?.nome ?? l}
                      </span>
                    ))}
                  </div>
                )}
                <button onClick={() => navigate(`/bolao/${b.id}`)} style={styles.btnAcessar}>
                  Detalhes
                </button>
              </div>
            )) : (
              <p style={styles.empty}>Você ainda não participa de nenhum bolão.</p>
            )}
          </div>
        </section>

        {/* EXPLORAR PÚBLICOS */}
        <section style={{ marginTop: '48px' }}>
          <h3 style={styles.sectionTitle}>Explorar Bolões Públicos 🌍</h3>

          {/* Chips */}
          <div style={styles.chipsWrap}>
            {LIGAS_DISPONIVEIS.map(liga => (
              <button
                key={liga.id}
                onClick={() => handleChip(liga.id)}
                style={{
                  ...styles.chip,
                  ...(ligasSelecionadas.includes(liga.id) ? styles.chipAtivo : {})
                }}
              >
                {liga.nome}
              </button>
            ))}
          </div>

          {/* Cards públicos */}
          {loadingPublicos ? (
            <p style={styles.empty}>Buscando bolões...</p>
          ) : boloesPublicos.length > 0 ? (
            <div style={styles.grid}>
              {boloesPublicos.map(b => (
                <div key={b.id} style={styles.cardPublico}>
                  <h4 style={styles.cardTitle}>{b.nome}</h4>
                  <p style={styles.cardCodigo}>Código: <strong>{b.codigoConvite}</strong></p>
                  <p style={styles.cardDono}>Criado por: <strong>{b.dono?.nickname ?? 'Desconhecido'}</strong></p>
                  {b.ligasPermitidas?.length > 0 && (
                    <div style={styles.ligasWrap}>
                      {b.ligasPermitidas.map(l => (
                        <span key={l} style={styles.ligaTag}>
                          {LIGAS_DISPONIVEIS.find(x => x.id === l)?.nome ?? l}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => handleEntrar(b.codigoConvite)}
                    style={styles.btnEntrar}
                  >
                    Entrar Agora
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.empty}>
              {ligasSelecionadas.length > 0
                ? 'Nenhum bolão público encontrado para essas ligas.'
                : 'Nenhum bolão público disponível.'}
            </p>
          )}
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
    fontWeight: 'bold',
    fontSize: '14px'
  },
  main: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  sectionTitle: {
    marginBottom: '16px',
    fontSize: '18px',
    color: '#eee'
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
    border: '1px solid #555'
  },
  cardTitle: {
    margin: '0 0 8px',
    fontSize: '16px'
  },
  cardCodigo: {
    fontSize: '13px',
    color: '#ccc',
    margin: '0 0 6px'
  },
  cardDono: {
    fontSize: '12px',
    color: '#aaa',
    margin: '0 0 10px'
  },
  ligasWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '12px'
  },
  ligaTag: {
    background: 'rgba(0,230,118,0.15)',
    color: '#00e676',
    border: '1px solid #00e676',
    borderRadius: '20px',
    padding: '2px 10px',
    fontSize: '11px'
  },
  btnAcessar: {
    width: '100%',
    padding: '10px',
    marginTop: '4px',
    background: '#00e676',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  btnEntrar: {
    width: '100%',
    padding: '10px',
    marginTop: '4px',
    background: 'transparent',
    border: '1px solid #00e676',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#00e676'
  },
  chipsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px'
  },
  chip: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #555',
    background: 'transparent',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s'
  },
  chipAtivo: {
    background: '#00e676',
    border: '1px solid #00e676',
    color: '#0f2027',
    fontWeight: 'bold'
  },
  empty: {
    color: '#888',
    fontSize: '14px'
  }
};