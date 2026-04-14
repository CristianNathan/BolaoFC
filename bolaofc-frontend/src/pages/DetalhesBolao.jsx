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

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const resBolao = await api.get(`/api/bolao/${id}`);
        setBolao(resBolao.data);
        const resPartidas = await api.get(`/api/partidas/bolao/${id}`);
        setPartidas(resPartidas.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) carregarDados();
  }, [id]);

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
      .then(() => setConfirmados(prev => ({ ...prev, [partidaId]: true })))
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
    const data = new Date(dataStr);
    const hoje = new Date();
    const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (data.toDateString() === hoje.toDateString()) return `Hoje às ${hora}`;
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ` às ${hora}`;
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
          {/* Botão meus palpites */}
          <button onClick={() => navigate('/meus-palpites')} style={s.meusPalpitesBtn}>
            📋 Meus Palpites
          </button>
          {/* Código de convite */}
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
              partidas.map(jogo => (
                <div key={jogo.id} style={s.gameCard}>

                  <div style={s.leagueBadge}>
                    {formatarNomeLiga(jogo.liga)}
                  </div>

                  <div style={s.matchContent}>
                    {/* Time da casa */}
                    <div style={s.teamInfo}>
                      {jogo.escudoCasa
                        ? <img src={jogo.escudoCasa} alt={jogo.timeCasa} style={s.crest} />
                        : <div style={s.crestFallback}>{jogo.timeCasa?.substring(0, 3).toUpperCase()}</div>
                      }
                      <span style={s.teamName}>{jogo.timeCasa}</span>
                    </div>

                    {/* Centro */}
                    <div style={s.scoreBoard}>
                      <div style={s.inputsRow}>
                        <input
                          type="number" min="0" max="20" placeholder="0"
                          style={s.scoreInput}
                          onChange={e => handleInputPalpite(jogo.id, 'golsCasa', e.target.value)}
                        />
                        <span style={s.vsSep}>VS</span>
                        <input
                          type="number" min="0" max="20" placeholder="0"
                          style={s.scoreInput}
                          onChange={e => handleInputPalpite(jogo.id, 'golsFora', e.target.value)}
                        />
                      </div>
                      <div style={s.timeBadge}>{formatarData(jogo.dataPartida)}</div>
                    </div>

                    {/* Time de fora */}
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
                    style={confirmados[jogo.id] ? s.btnSaved : s.btnConfirm}
                  >
                    {confirmados[jogo.id] ? '✓ Palpite salvo!' : 'Confirmar Palpite'}
                  </button>
                </div>
              ))
            )}
          </section>
        ) : (
          <section>
            <h3 style={s.sectionTitle}>Ranking do Grupo</h3>
            <div style={s.gameCard}>
              <p style={{ color: '#aaa', textAlign: 'center' }}>
                1º {bolao?.dono?.nome || 'Dono'} — 0 pts
              </p>
            </div>
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
  vsSep: { fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
  timeBadge: { fontSize: 11, color: '#00e676', fontWeight: 'bold' },
  btnConfirm: { width: '100%', padding: 10, background: '#00e676', color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 'bold', cursor: 'pointer' },
  btnSaved: { width: '100%', padding: 10, background: 'transparent', color: '#00e676', border: '1px solid #00e676', borderRadius: 8, fontSize: 13, fontWeight: 'bold', cursor: 'default' },
};