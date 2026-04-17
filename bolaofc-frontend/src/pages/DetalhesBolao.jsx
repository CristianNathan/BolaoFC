import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DetalhesBolao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('PALPITES');
  const [loading, setLoading] = useState(true);
  const [bolao, setBolao] = useState(null);
  const [partidas, setPartidas] = useState([]);
  const [meusPalpites, setMeusPalpites] = useState({});
  const [confirmados, setConfirmados] = useState({});
  const [ranking, setRanking] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const [resBolao, resPartidas, resPalpites] = await Promise.all([
          api.get(`/api/bolao/${id}`),
          api.get(`/api/partidas/bolao/${id}`),
          api.get('/api/palpites/meus'),
        ]);

        setBolao(resBolao.data);
        setPartidas(resPartidas.data);

        const palpitesFeitos = {};
        resPalpites.data.forEach(p => {
          if (p.bolao?.id === id) {
            palpitesFeitos[p.partida.id] = {
              casa: p.palpiteCasa,
              fora: p.palpiteFora,
            };
          }
        });
        setConfirmados(palpitesFeitos);

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) carregarDados();
  }, [id]);

  useEffect(() => {
    if (abaAtiva === 'RANKING' && id) {
      setLoadingRanking(true);
      api.get(`/bolaos/${id}/ranking`)
        .then(res => setRanking(res.data))
        .catch(err => console.error("Erro ao carregar ranking:", err))
        .finally(() => setLoadingRanking(false));
    }
  }, [abaAtiva, id]);

  const handleInputPalpite = (partidaId, campo, valor) => {
    setMeusPalpites(prev => ({
      ...prev,
      [partidaId]: {
        ...prev[partidaId],
        [campo]: valor === "" ? "" : parseInt(valor)
      }
    }));
  };

  const salvarPalpite = (partidaId) => {
    if (confirmados[partidaId]) return;

    const palpite = meusPalpites[partidaId];
    if (!palpite || palpite.golsCasa === undefined || palpite.golsFora === undefined ||
        palpite.golsCasa === "" || palpite.golsFora === "") {
      alert("Preencha os dois placares antes de salvar!");
      return;
    }
    api.post('/api/palpites/salvar', {
      bolaoId: id,
      jogoId: partidaId,
      golsMandante: palpite.golsCasa,
      golsVisitante: palpite.golsFora
    })
      .then(() => setConfirmados(prev => ({
        ...prev,
        [partidaId]: { casa: palpite.golsCasa, fora: palpite.golsFora }
      })))
      .catch(err => alert("Erro ao salvar: " + (err.response?.data || "Erro de conexão")));
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(bolao?.codigoConvite);
    alert("Código copiado!");
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

  const formatarData = (dataStr) => {
    if (!dataStr) return '—';
    const dataUtc = dataStr.endsWith('Z') ? dataStr : dataStr + 'Z';
    const data = new Date(dataUtc);
    const hoje = new Date();
    const hora = data.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
    });
    const mesmaData = data.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) ===
                      hoje.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    if (mesmaData) return `Hoje às ${hora}`;
    const dataBr = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' });
    return `${dataBr} às ${hora}`;
  };

  const getMedalha = (pos) => {
    if (pos === 0) return '🥇';
    if (pos === 1) return '🥈';
    if (pos === 2) return '🥉';
    return `${pos + 1}º`;
  };

  if (loading) return (
    <div style={s.container}>
      <p style={{ color: '#00e676', textAlign: 'center', paddingTop: 80 }}>Carregando...</p>
    </div>
  );

  return (
    <div style={s.container}>

      {/* Header */}
      <header style={s.header}>
        <button onClick={() => navigate('/meus-boloes')} style={s.backBtn}>← Voltar</button>

        <div style={s.headerCenter}>
          <h2 style={s.bolaoTitle}>{bolao?.nome}</h2>
          <div style={s.ligasRow}>
            {bolao?.ligasPermitidas?.map(liga => (
              <span key={liga} style={s.ligaPill}>{liga}</span>
            ))}
          </div>
        </div>

        <div style={s.headerRight}>
          <button onClick={() => navigate('/meus-palpites')} style={s.meusPalpitesBtn}>
            📋 Meus Palpites
          </button>
          <div style={s.inviteBox}>
            <span style={s.inviteLabel}>Código de convite</span>
            <div style={s.inviteRow}>
              <strong style={s.inviteCode}>{bolao?.codigoConvite}</strong>
              <button onClick={copiarCodigo} style={s.copyBtn}>📋 Copiar</button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={s.tabs}>
        <button onClick={() => setAbaAtiva('PALPITES')} style={abaAtiva === 'PALPITES' ? s.tabActive : s.tab}>
          ⚽ Dar Palpites
        </button>
        <button onClick={() => setAbaAtiva('RANKING')} style={abaAtiva === 'RANKING' ? s.tabActive : s.tab}>
          🏆 Classificação
        </button>
      </div>

      <main style={s.main}>
        {abaAtiva === 'PALPITES' ? (
          <section>
            <h3 style={s.sectionTitle}>Próximos Jogos</h3>

            {partidas.length === 0 ? (
              <div style={s.emptyCard}>Nenhum jogo disponível para estas ligas.</div>
            ) : (
              partidas.map(jogo => {
                const jaConfirmado = !!confirmados[jogo.id];
                const palpiteFeito = confirmados[jogo.id];

                return (
                  <div key={jogo.id} style={s.gameCard}>
                    <div style={s.leagueBadge}>{formatarNomeLiga(jogo.liga)}</div>

                    <div style={s.matchContent}>
                      <div style={s.teamInfo}>
                        {jogo.escudoCasa
                          ? <img src={jogo.escudoCasa} alt={jogo.timeCasa} style={s.crest} />
                          : <div style={s.crestFallback}>{jogo.timeCasa?.substring(0, 3).toUpperCase()}</div>
                        }
                        <span style={s.teamName}>{jogo.timeCasa}</span>
                      </div>

                      <div style={s.scoreBoard}>
                        <div style={s.inputsRow}>
                          <input
                            type="number" min="0" max="20" placeholder="0"
                            style={jaConfirmado ? s.scoreInputLocked : s.scoreInput}
                            disabled={jaConfirmado}
                            value={jaConfirmado ? palpiteFeito.casa : (meusPalpites[jogo.id]?.golsCasa ?? '')}
                            onChange={e => handleInputPalpite(jogo.id, 'golsCasa', e.target.value)}
                          />
                          <span style={s.vsSep}>VS</span>
                          <input
                            type="number" min="0" max="20" placeholder="0"
                            style={jaConfirmado ? s.scoreInputLocked : s.scoreInput}
                            disabled={jaConfirmado}
                            value={jaConfirmado ? palpiteFeito.fora : (meusPalpites[jogo.id]?.golsFora ?? '')}
                            onChange={e => handleInputPalpite(jogo.id, 'golsFora', e.target.value)}
                          />
                        </div>
                        <div style={s.timeBadge}>{formatarData(jogo.dataPartida)}</div>
                      </div>

                      <div style={s.teamInfo}>
                        {jogo.escudoFora
                          ? <img src={jogo.escudoFora} alt={jogo.timeFora} style={s.crest} />
                          : <div style={s.crestFallback}>{jogo.timeFora?.substring(0, 3).toUpperCase()}</div>
                        }
                        <span style={s.teamName}>{jogo.timeFora}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => salvarPalpite(jogo.id)}
                      disabled={jaConfirmado}
                      style={jaConfirmado ? s.btnSaved : s.btnConfirm}
                    >
                      {jaConfirmado ? `✓ Palpite: ${palpiteFeito.casa} x ${palpiteFeito.fora}` : 'Confirmar Palpite'}
                    </button>
                  </div>
                );
              })
            )}
          </section>
        ) : (
          <section>
            <h3 style={s.sectionTitle}>Ranking do Grupo</h3>

            {loadingRanking ? (
              <p style={{ color: '#00e676', textAlign: 'center' }}>Carregando ranking...</p>
            ) : ranking.length === 0 ? (
              <div style={s.emptyCard}>Nenhum participante ainda.</div>
            ) : (
              ranking.map((participante, index) => (
                <div
                  key={participante.id}
                  style={{
                    ...s.rankingCard,
                    ...(index === 0 ? s.rankingFirst : {}),
                  }}
                >
                  <span style={s.rankingPos}>{getMedalha(index)}</span>
                  <span style={s.rankingNome}>{participante.nickname || '—'}</span>
                  <span style={s.rankingPontos}>{participante.pontosTotal ?? 0} pts</span>
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

const s = {
  container: { minHeight: '100vh', background: '#0f2027', color: '#fff', fontFamily: "'Segoe UI', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 12 },
  backBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  headerCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  bolaoTitle: { fontSize: 20, fontWeight: 'bold', margin: 0 },
  ligasRow: { display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  ligaPill: { background: 'rgba(0,230,118,0.1)', color: '#00e676', border: '1px solid #00e676', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 'bold' },
  headerRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 },
  meusPalpitesBtn: { background: 'rgba(0,230,118,0.1)', border: '1px solid #00e676', color: '#00e676', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 12 },
  inviteBox: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' },
  inviteLabel: { fontSize: 11, color: '#aaa', display: 'block', marginBottom: 4 },
  inviteRow: { display: 'flex', alignItems: 'center', gap: 8 },
  inviteCode: { fontSize: 16, color: '#00e676', letterSpacing: 2 },
  copyBtn: { background: '#00e676', border: 'none', color: '#000', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', fontSize: 11 },
  tabs: { display: 'flex', justifyContent: 'center', gap: 10, padding: '20px 0 0' },
  tab: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 20, cursor: 'pointer', fontSize: 13 },
  tabActive: { background: '#00e676', border: 'none', color: '#000', padding: '10px 24px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 'bold' },
  main: { maxWidth: 800, margin: '0 auto', padding: '30px 20px' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  emptyCard: { background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 12, padding: 40, textAlign: 'center', color: '#aaa' },
  gameCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '15px 25px', marginBottom: 15 },
  leagueBadge: { fontSize: 11, textTransform: 'uppercase', color: '#00e676', fontWeight: 'bold', marginBottom: 14, textAlign: 'center', letterSpacing: 1 },
  matchContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  teamInfo: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '35%', gap: 8 },
  crest: { width: 52, height: 52, objectFit: 'contain' },
  crestFallback: { width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', color: '#fff' },
  teamName: { fontSize: 13, textAlign: 'center', color: '#fff' },
  scoreBoard: { textAlign: 'center', width: '30%' },
  inputsRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 },
  scoreInput: { width: 44, height: 44, textAlign: 'center', fontSize: 18, fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' },
  scoreInputLocked: { width: 44, height: 44, textAlign: 'center', fontSize: 18, fontWeight: 'bold', border: '1px solid #00e676', borderRadius: 8, background: 'rgba(0,230,118,0.08)', color: '#00e676', outline: 'none', cursor: 'not-allowed' },
  vsSep: { fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
  timeBadge: { fontSize: 11, color: '#00e676', fontWeight: 'bold' },
  btnConfirm: { width: '100%', padding: 10, background: '#00e676', color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 'bold', cursor: 'pointer' },
  btnSaved: { width: '100%', padding: 10, background: 'transparent', color: '#00e676', border: '1px solid #00e676', borderRadius: 8, fontSize: 13, fontWeight: 'bold', cursor: 'default' },
  rankingCard: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 24px', marginBottom: 10 },
  rankingFirst: { border: '1px solid #00e676', background: 'rgba(0,230,118,0.07)' },
  rankingPos: { fontSize: 22, width: 36 },
  rankingNome: { fontSize: 15, fontWeight: 'bold', flex: 1, marginLeft: 12 },
  rankingPontos: { fontSize: 15, fontWeight: 'bold', color: '#00e676' },
};