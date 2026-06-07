import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [codigoBolao, setCodigoBolao] = useState('');
  const [jogos, setJogos] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('PROXIMOS');
  const [loading, setLoading] = useState(true);
  const [entrando, setEntrando] = useState(false);
  const [ligaSelecionada, setLigaSelecionada] = useState('TODAS');

  useEffect(() => {
    api.get('/api/futebol/jogos-reais')
      .then(response => {
        setJogos(response.data.matches || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar jogos:", err);
        setLoading(false);
      });
  }, []);

  const handleAbaAtiva = (aba) => {
    setAbaAtiva(aba);
    setLigaSelecionada('TODAS');
  };

  const formatarNomeCompeticao = (nome) => {
    const nomesAmigaveis = {
      'FIFA World Cup':                '🌍 Copa do Mundo 2026',
      'Primera Division':              'La Liga 🇪🇸',
      'Premier League':                'Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'Campeonato Brasileiro Série A': 'Brasileirão 🇧🇷',
      'UEFA Champions League':         'Champions League 🏆',
      'Bundesliga':                    'Bundesliga 🇩🇪',
      'Serie A':                       'Série A Tim 🇮🇹',
      'Ligue 1':                       'Ligue 1 🇫🇷',
    };
    return nomesAmigaveis[nome] || nome;
  };

  const formatarDataJogo = (dataIso) => {
    const dataJogo = new Date(dataIso);
    const hoje = new Date();
    const diaMes = dataJogo.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const hora = dataJogo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (dataJogo.toDateString() === hoje.toDateString()) {
      return `Hoje às ${hora}`;
    }
    return `${diaMes} às ${hora}`;
  };

  const jogosAoVivo = jogos.filter(j => j.status === 'IN_PLAY' || j.status === 'PAUSED');
  const jogosProximos = jogos
    .filter(j => j.status === 'TIMED' || j.status === 'SCHEDULED')
    .sort((a, b) => {
      // Copa do Mundo sempre no topo
      const aWC = a.competition.name === 'FIFA World Cup' ? -1 : 0;
      const bWC = b.competition.name === 'FIFA World Cup' ? -1 : 0;
      if (aWC !== bWC) return aWC - bWC;
      return new Date(a.utcDate) - new Date(b.utcDate);
    });
  const jogosFinalizados = jogos
    .filter(j => j.status === 'FINISHED')
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

  const getJogosDaAba = () => {
    if (abaAtiva === 'AO_VIVO') return jogosAoVivo;
    if (abaAtiva === 'FINALIZADOS') return jogosFinalizados;
    return jogosProximos;
  };

  const ligasUnicas = ['TODAS', ...new Set(getJogosDaAba().map(j => j.competition.name))];

  const getJogosExibidos = () => {
    const lista = getJogosDaAba();
    if (ligaSelecionada !== 'TODAS') {
      return lista.filter(j => j.competition.name === ligaSelecionada);
    }
    return lista;
  };

  const handleEntrarBolao = async () => {
    if (!codigoBolao.trim()) return alert("Digite um código!");

    setEntrando(true);
    try {
      await api.post('/api/bolao/entrar', { codigoConvite: codigoBolao.trim() });
      alert("Você entrou no bolão com sucesso! 🎉");
      setCodigoBolao('');
      navigate('/meus-boloes');
    } catch (err) {
      console.error("Erro ao entrar no bolão:", err);
      const msg = err.response?.data || "Código inválido ou bolão não encontrado.";
      alert(msg);
    } finally {
      setEntrando(false);
    }
  };

  const temCopaDoMundo = jogos.some(j => j.competition.name === 'FIFA World Cup');

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>⚽ Bolão FC</div>
        <div style={styles.navActions}>
          <button style={styles.meusBoloesBtn} onClick={() => navigate('/meus-boloes')}>
            🏆 Meus Bolões
          </button>
          <button style={styles.logoutBtn} onClick={() => navigate('/login')}>
            Sair
          </button>
        </div>
      </header>

      <main style={styles.main}>

        {/* Banner Copa do Mundo — aparece só quando há jogos da Copa */}
        {temCopaDoMundo && (
          <div style={styles.worldCupBanner}>
            <div style={styles.worldCupBannerInner}>
              <span style={styles.worldCupBannerIcon}>🌍</span>
              <div>
                <div style={styles.worldCupBannerTitle}>Copa do Mundo 2026</div>
                <div style={styles.worldCupBannerSub}>
                  EUA · México · Canadá — jogos disponíveis abaixo
                </div>
              </div>
              <button
                style={styles.worldCupBannerBtn}
                onClick={() => {
                  handleAbaAtiva('PROXIMOS');
                  setLigaSelecionada('FIFA World Cup');
                }}
              >
                Ver jogos →
              </button>
            </div>
          </div>
        )}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Jogos Reais</h2>

          <div style={styles.tabs}>
            <button
              onClick={() => handleAbaAtiva('AO_VIVO')}
              style={abaAtiva === 'AO_VIVO' ? styles.tabActive : styles.tab}
            >
              Ao Vivo ({jogosAoVivo.length})
            </button>
            <button
              onClick={() => handleAbaAtiva('PROXIMOS')}
              style={abaAtiva === 'PROXIMOS' ? styles.tabActive : styles.tab}
            >
              Próximos
            </button>
            <button
              onClick={() => handleAbaAtiva('FINALIZADOS')}
              style={abaAtiva === 'FINALIZADOS' ? styles.tabActive : styles.tab}
            >
              Finalizados
            </button>
          </div>

          {/* Filtro por liga */}
          {!loading && ligasUnicas.length > 2 && (
            <div style={styles.leagueFilter}>
              {ligasUnicas.map(liga => {
                const isWC = liga === 'FIFA World Cup';
                const isActive = ligaSelecionada === liga;
                return (
                  <button
                    key={liga}
                    onClick={() => setLigaSelecionada(liga)}
                    style={
                      isActive && isWC
                        ? styles.leagueCardWorldCupActive
                        : isActive
                        ? styles.leagueCardActive
                        : isWC
                        ? styles.leagueCardWorldCup
                        : styles.leagueCard
                    }
                  >
                    {liga === 'TODAS' ? '⚽ Todas' : formatarNomeCompeticao(liga)}
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <p style={styles.loadingText}>Buscando informações no campo... ⏳</p>
          ) : getJogosExibidos().length > 0 ? (
            getJogosExibidos().map(jogo => {
              const isWorldCup = jogo.competition.name === 'FIFA World Cup';
              return (
                <div
                  key={jogo.id}
                  style={{
                    ...styles.gameCard,
                    ...(isWorldCup ? styles.gameCardWorldCup : {}),
                  }}
                >
                  {/* Faixa de destaque Copa do Mundo */}
                  {isWorldCup && (
                    <div style={styles.worldCupStrip}>
                      🏆 COPA DO MUNDO FIFA 2026
                    </div>
                  )}

                  <div
                    style={{
                      ...styles.leagueBadge,
                      ...(isWorldCup ? styles.leagueBadgeWorldCup : {}),
                    }}
                  >
                    {formatarNomeCompeticao(jogo.competition.name)}
                  </div>

                  <div style={styles.matchContent}>
                    <div style={styles.teamInfo}>
                      <img src={jogo.homeTeam.crest} alt="escudo" style={styles.crest} />
                      <span style={styles.teamName}>{jogo.homeTeam.name}</span>
                    </div>

                    <div style={styles.scoreBoard}>
                      <div
                        style={{
                          ...styles.scoreText,
                          ...(isWorldCup ? styles.scoreTextWorldCup : {}),
                        }}
                      >
                        {jogo.status === 'TIMED' || jogo.status === 'SCHEDULED'
                          ? 'VS'
                          : `${jogo.score.fullTime.home ?? 0} - ${jogo.score.fullTime.away ?? 0}`}
                      </div>
                      <div
                        style={{
                          ...styles.timeBadge,
                          ...(isWorldCup ? styles.timeBadgeWorldCup : {}),
                        }}
                      >
                        {jogo.status === 'IN_PLAY' ? '🔴 AO VIVO' : formatarDataJogo(jogo.utcDate)}
                      </div>
                    </div>

                    <div style={styles.teamInfo}>
                      <img src={jogo.awayTeam.crest} alt="escudo" style={styles.crest} />
                      <span style={styles.teamName}>{jogo.awayTeam.name}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={styles.emptyText}>Nenhum jogo nesta categoria para o período.</p>
          )}
        </section>

        <section style={styles.actionSection}>
          <div style={styles.actionCard}>
            <h3>Criar novo Bolão</h3>
            <p style={styles.cardSub}>Organize sua galera e defina as regras.</p>
            <button style={styles.btnPrimary} onClick={() => navigate('/criar-bolao')}>
              + Novo Bolão
            </button>
          </div>

          <div style={styles.actionCard}>
            <h3>Entrar em um Bolão</h3>
            <p style={styles.cardSub}>Possui um código de convite?</p>
            <input
              style={styles.input}
              placeholder="Digite o código (ex: ABC-123)"
              value={codigoBolao}
              onChange={(e) => setCodigoBolao(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEntrarBolao()}
            />
            <button style={styles.btnSecondary} onClick={handleEntrarBolao} disabled={entrando}>
              {entrando ? 'Entrando...' : 'Entrar no Grupo'}
            </button>
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
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 5%',
    background: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#00e676' },
  navActions: { display: 'flex', gap: '15px', alignItems: 'center' },
  meusBoloesBtn: {
    background: 'rgba(0, 230, 118, 0.1)',
    border: '1px solid #00e676',
    color: '#00e676',
    borderRadius: '8px',
    padding: '8px 15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: '0.3s',
  },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: '#ff5252',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  main: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' },

  // ─── Banner Copa do Mundo ───────────────────────────────────────────────────
  worldCupBanner: {
    background: 'linear-gradient(135deg, #003d1f 0%, #005c2e 50%, #003d1f 100%)',
    border: '1px solid rgba(255, 215, 0, 0.4)',
    borderRadius: '16px',
    padding: '20px 25px',
    marginBottom: '35px',
    boxShadow: '0 0 30px rgba(255, 215, 0, 0.08)',
  },
  worldCupBannerInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  worldCupBannerIcon: { fontSize: '36px', flexShrink: 0 },
  worldCupBannerTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: '4px',
  },
  worldCupBannerSub: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
  },
  worldCupBannerBtn: {
    marginLeft: 'auto',
    flexShrink: 0,
    background: '#ffd700',
    border: 'none',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '13px',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  // ─── Seção de jogos ────────────────────────────────────────────────────────
  section: {},
  sectionTitle: { marginBottom: '20px', fontSize: '22px', fontWeight: 'bold' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '25px' },
  tabActive: {
    background: '#00e676',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#000',
  },
  tab: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
  },

  // ─── Filtro de ligas ───────────────────────────────────────────────────────
  leagueFilter: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '6px',
    marginBottom: '20px',
    scrollbarWidth: 'none',
  },
  leagueCard: {
    flexShrink: 0,
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid transparent',
    color: '#ccc',
    borderRadius: '20px',
    padding: '7px 16px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  leagueCardActive: {
    flexShrink: 0,
    background: 'rgba(0,230,118,0.1)',
    border: '1.5px solid #00e676',
    color: '#00e676',
    borderRadius: '20px',
    padding: '7px 16px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  // Filtro Copa do Mundo — tom dourado
  leagueCardWorldCup: {
    flexShrink: 0,
    background: 'rgba(255,215,0,0.07)',
    border: '1.5px solid rgba(255,215,0,0.4)',
    color: '#ffd700',
    borderRadius: '20px',
    padding: '7px 16px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  leagueCardWorldCupActive: {
    flexShrink: 0,
    background: 'rgba(255,215,0,0.2)',
    border: '1.5px solid #ffd700',
    color: '#ffd700',
    borderRadius: '20px',
    padding: '7px 16px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    boxShadow: '0 0 10px rgba(255,215,0,0.2)',
  },

  // ─── Cards de jogo ─────────────────────────────────────────────────────────
  gameCard: {
    background: 'rgba(255,255,255,0.05)',
    padding: '15px 25px',
    borderRadius: '12px',
    marginBottom: '15px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  // Variante Copa do Mundo
  gameCardWorldCup: {
    background: 'linear-gradient(135deg, rgba(0,100,60,0.35), rgba(0,50,30,0.5))',
    border: '1px solid rgba(255, 215, 0, 0.35)',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.07)',
  },
  // Faixa dourada no topo do card
  worldCupStrip: {
    background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.15), transparent)',
    color: '#ffd700',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '2px',
    textAlign: 'center',
    padding: '4px',
    borderRadius: '6px',
    marginBottom: '10px',
  },
  leagueBadge: {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#00e676',
    fontWeight: 'bold',
    marginBottom: '12px',
    textAlign: 'center',
    letterSpacing: '1px',
  },
  leagueBadgeWorldCup: {
    color: '#ffd700',
    fontSize: '12px',
    letterSpacing: '2px',
  },
  matchContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '35%',
    gap: '8px',
  },
  teamName: { fontSize: '13px', textAlign: 'center' },
  crest: { width: '35px', height: '35px', objectFit: 'contain' },
  scoreBoard: { textAlign: 'center', width: '30%' },
  scoreText: { fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px' },
  scoreTextWorldCup: { color: '#ffd700' },
  timeBadge: { fontSize: '11px', color: '#00e676', marginTop: '5px', fontWeight: 'bold' },
  timeBadgeWorldCup: { color: '#ffd700' },

  // ─── Seção de ações ────────────────────────────────────────────────────────
  actionSection: {
    marginTop: '50px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  actionCard: {
    background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
    padding: '30px',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  cardSub: { color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '15px' },
  input: {
    width: '90%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.2)',
    color: '#fff',
    marginBottom: '15px',
    outline: 'none',
  },
  btnPrimary: {
    background: '#00e676',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    color: '#000',
    width: '100%',
  },
  btnSecondary: {
    background: '#fff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    color: '#000',
    width: '100%',
  },
  loadingText: { textAlign: 'center', color: '#00e676' },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: '20px' },
};