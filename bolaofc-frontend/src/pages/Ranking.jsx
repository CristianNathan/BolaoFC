import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function Ranking() {
  const { id } = useParams();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userJson = localStorage.getItem('user');
  const usuarioLogadoId = userJson ? JSON.parse(userJson).id : null;

  async function buscarRanking() {
    try {
      setLoading(true);
      const res = await api.get(`/bolaos/${id}/ranking`);
      setRanking(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao carregar ranking:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarRanking();
  }, [id]);

  const renderPosicao = (index) => {
    if (index === 0) return <span style={{ fontSize: '20px' }}>🥇</span>;
    if (index === 1) return <span style={{ fontSize: '20px' }}>🥈</span>;
    if (index === 2) return <span style={{ fontSize: '20px' }}>🥉</span>;
    return `${index + 1}º`;
  };

  if (loading) return <div style={styles.container}>Carregando ranking...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/meus-boloes" style={styles.backLink}>← Voltar</Link>
        <h1 style={styles.title}>🏆 Ranking do Bolão</h1>
      </header>

      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Pos</th>
            <th style={styles.thLeft}>Participante</th>
            <th style={styles.th}>Placar Exato</th>
            <th style={styles.th}>Pontos</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((item, index) => {
            // AJUSTADO: Agora acessa item.usuario.id conforme o seu JSON
            const isMe = item.usuario?.id === usuarioLogadoId;
            
            return (
              <tr 
                key={item.id} // Usando o ID do registro de ranking
                style={{
                  ...styles.tr,
                  backgroundColor: isMe ? '#004d3b' : (index % 2 === 0 ? '#202024' : '#29292e'),
                  borderLeft: isMe ? '4px solid #00b37e' : '4px solid transparent'
                }}
              >
                <td style={styles.tdCenter}>{renderPosicao(index)}</td>
                <td style={styles.tdLeft}>
                  {/* AJUSTADO: Acessando o nome dentro do objeto usuario */}
                  {item.usuario?.nome} {isMe && <span style={styles.meBadge}>(Você)</span>}
                </td>
                <td style={styles.tdCenter}>{item.cheios || 0}</td>
                <td style={{ ...styles.tdCenter, fontWeight: 'bold', color: '#00b37e' }}>
                  {item.pontos}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {ranking.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#8d8d99' }}>
          Nenhum participante pontuou ainda.
        </p>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '40px 20px', backgroundColor: '#121214', minHeight: '100vh', color: '#fff' },
  header: { marginBottom: '30px' },
  backLink: { color: '#00b37e', textDecoration: 'none', marginBottom: '10px', display: 'block' },
  title: { fontSize: '24px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  thead: { backgroundColor: '#323238', color: '#8d8d99', textAlign: 'left' },
  th: { padding: '15px', textAlign: 'center', fontSize: '14px' },
  thLeft: { padding: '15px', textAlign: 'left', fontSize: '14px' },
  tr: { transition: '0.2s', borderBottom: '1px solid #323238' },
  tdCenter: { padding: '15px', textAlign: 'center' },
  tdLeft: { padding: '15px', textAlign: 'left' },
  meBadge: { fontSize: '10px', backgroundColor: '#00b37e', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', color: '#fff' }
};