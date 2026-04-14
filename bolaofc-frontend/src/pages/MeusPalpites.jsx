import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function MeusPalpites() {
  const navigate = useNavigate();
  const [palpites, setPalpites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/palpites/meus')
      .then(res => setPalpites(res.data))
      .catch(err => console.error("Erro ao buscar palpites:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatarData = (dataStr) => {
    if (!dataStr) return '—';
    const data = new Date(dataStr);
    const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ` às ${hora}`;
  };

  const formatarNomeLiga = (codigo) => {
    const nomes = {
      'CL': 'Champions League 🏆',
      'PL': 'Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'BSA': 'Brasileirão 🇧🇷',
      'PD': 'La Liga 🇪🇸',
      'BL1': 'Bundesliga 🇩🇪',
      'SA': 'Série A Tim 🇮🇹',
      'FL1': 'Ligue 1 🇫🇷',
    };
    return nomes[codigo] || codigo;
  };

  const getStatusInfo = (palpite) => {
    if (palpite.status === 'PENDENTE') return { label: 'Aguardando', color: '#aaa' };
    if (palpite.status === 'CORRETO')  return { label: '✓ Acertou!', color: '#00e676' };
    if (palpite.status === 'ERRADO')   return { label: '✗ Errou', color: '#ff5252' };
    return { label: palpite.status, color: '#aaa' };
  };

  if (loading) return (
    <div style={s.container}>
      <p style={{ color: '#00e676', textAlign: 'center', paddingTop: 80 }}>Carregando palpites...</p>
    </div>
  );

  return (
    <div style={s.container}>
      <header style={s.header}>
        <button onClick={() => navigate('/meus-boloes')} style={s.backBtn}>← Voltar</button>
        <span style={s.logo}>⚽ Meus Palpites</span>
        <div />
      </header>

      <main style={s.main}>
        {/* Resumo no topo */}
        <div style={s.resumoRow}>
          <div style={s.resumoCard}>
            <span style={s.resumoNum}>{palpites.length}</span>
            <span style={s.resumoLabel}>palpites feitos</span>
          </div>
          <div style={s.resumoCard}>
            <span style={s.resumoNum}>
              {palpites.reduce((acc, p) => acc + (p.pontosGanhos || 0), 0)}
            </span>
            <span style={s.resumoLabel}>pontos totais</span>
          </div>
          <div style={s.resumoCard}>
            <span style={s.resumoNum}>
              {palpites.filter(p => p.status === 'CORRETO').length}
            </span>
            <span style={s.resumoLabel}>acertos</span>
          </div>
        </div>

        <h3 style={s.sectionTitle}>Histórico</h3>

        {palpites.length === 0 ? (
          <div style={s.emptyCard}>
            <p>Você ainda não fez nenhum palpite.</p>
            <button onClick={() => navigate('/meus-boloes')} style={s.btnGo}>
              Ir para meus bolões
            </button>
          </div>
        ) : (
          palpites.map(palpite => {
            const partida = palpite.partida;
            const statusInfo = getStatusInfo(palpite);
            const finalizada = partida?.status === 'FINALIZADA';

            return (
              <div key={palpite.id} style={s.gameCard}>

                {/* Liga + bolão */}
                <div style={s.cardHeader}>
                  <span style={s.leagueBadge}>{formatarNomeLiga(partida?.liga)}</span>
                  <span style={s.bolaoBadge}>📋 {palpite.bolao?.nome}</span>
                </div>

                {/* Times */}
                <div style={s.matchContent}>

                  {/* Time da casa */}
                  <div style={s.teamInfo}>
                    {partida?.escudoCasa
                      ? <img src={partida.escudoCasa} alt={partida.timeCasa} style={s.crest} />
                      : <div style={s.crestFallback}>{partida?.timeCasa?.substring(0, 3).toUpperCase()}</div>
                    }
                    <span style={s.teamName}>{partida?.timeCasa}</span>
                  </div>

                  {/* Centro */}
                  <div style={s.scoreBoard}>
                    {/* Meu palpite */}
                    <div style={s.meuPalpiteLabel}>meu palpite</div>
                    <div style={s.meuPalpiteScore}>
                      {palpite.palpiteCasa} × {palpite.palpiteFora}
                    </div>

                    {/* Resultado final (se acabou) */}
                    {finalizada && (
                      <>
                        <div style={s.resultadoLabel}>resultado</div>
                        <div style={s.resultadoScore}>
                          {partida.golsCasa} × {partida.golsFora}
                        </div>
                      </>
                    )}

                    {!finalizada && (
                      <div style={s.timeBadge}>{formatarData(partida?.dataPartida)}</div>
                    )}
                  </div>

                  {/* Time de fora */}
                  <div style={s.teamInfo}>
                    {partida?.escudoFora
                      ? <img src={partida.escudoFora} alt={partida.timeFora} style={s.crest} />
                      : <div style={s.crestFallback}>{partida?.timeFora?.substring(0, 3).toUpperCase()}</div>
                    }
                    <span style={s.teamName}>{partida?.timeFora}</span>
                  </div>
                </div>

                {/* Rodapé: status + pontos */}
                <div style={s.cardFooter}>
                  <span style={{ ...s.statusBadge, color: statusInfo.color, borderColor: statusInfo.color }}>
                    {statusInfo.label}
                  </span>
                  {palpite.pontosGanhos > 0 && (
                    <span style={s.pontosBadge}>+{palpite.pontosGanhos} pts</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

const s = {
  container: { minHeight: '100vh', background: '#0f2027', color: '#fff', fontFamily: "'Segoe UI', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  backBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  logo: { fontSize: 18, fontWeight: 'bold', color: '#00e676' },
  main: { maxWidth: 800, margin: '0 auto', padding: '30px 20px' },
  resumoRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 30 },
  resumoCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  resumoNum: { fontSize: 28, fontWeight: 'bold', color: '#00e676' },
  resumoLabel: { fontSize: 11, color: '#aaa', textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  emptyCard: { background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 12, padding: 40, textAlign: 'center', color: '#aaa', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' },
  btnGo: { background: '#00e676', border: 'none', color: '#000', padding: '10px 24px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', fontSize: 13 },
  gameCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '15px 25px', marginBottom: 15 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  leagueBadge: { fontSize: 11, color: '#00e676', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  bolaoBadge: { fontSize: 11, color: '#aaa' },
  matchContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  teamInfo: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '35%', gap: 8 },
  crest: { width: 52, height: 52, objectFit: 'contain' },
  crestFallback: { width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', color: '#fff' },
  teamName: { fontSize: 13, textAlign: 'center', color: '#fff' },
  scoreBoard: { textAlign: 'center', width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  meuPalpiteLabel: { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 },
  meuPalpiteScore: { fontSize: 22, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  resultadoLabel: { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  resultadoScore: { fontSize: 16, fontWeight: 'bold', color: '#00e676', letterSpacing: 2 },
  timeBadge: { fontSize: 11, color: '#00e676', fontWeight: 'bold', marginTop: 4 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 },
  statusBadge: { fontSize: 12, fontWeight: 'bold', border: '1px solid', padding: '3px 10px', borderRadius: 20 },
  pontosBadge: { fontSize: 13, fontWeight: 'bold', color: '#00e676' },
};