import { useState, useEffect } from 'react';
import api from '../services/api'; 

export default function Home() {
  const [codigoBolao, setCodigoBolao] = useState('');
  const [jogos, setJogos] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('PROXIMOS'); 
  const [loading, setLoading] = useState(true);

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

  // FUNÇÃO PARA TRADUZIR NOMES E ADICIONAR EMOJIS
  const formatarNomeCompeticao = (nome) => {
    const nomesAmigaveis = {
      'Primera Division': 'La Liga 🇪🇸',
      'Premier League': 'Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'Campeonato Brasileiro Série A': 'Brasileirão 🇧🇷',
      'UEFA Champions League': 'Champions League 🏆',
      'Bundesliga': 'Bundesliga 🇩🇪',
      'Serie A': 'Série A Tim 🇮🇹',
      'Ligue 1': 'Ligue 1 🇫🇷'
    };
    return nomesAmigaveis[nome] || nome;
  };

  // FUNÇÃO PARA FORMATAR DATA E HORA
  const formatarDataJogo = (dataIso) => {
    const dataJogo = new Date(dataIso);
    const hoje = new Date();
    
    // Opções para formatar apenas o dia e mês
    const diaMes = dataJogo.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const hora = dataJogo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Verifica se o jogo é hoje
    if (dataJogo.toDateString() === hoje.toDateString()) {
      return `Hoje às ${hora}`;
    }
    return `${diaMes} às ${hora}`;
  };

  const jogosAoVivo = jogos.filter(j => j.status === 'IN_PLAY' || j.status === 'PAUSED');
  const jogosProximos = jogos.filter(j => j.status === 'TIMED' || j.status === 'SCHEDULED');
  const jogosFinalizados = jogos.filter(j => j.status === 'FINISHED');

  const getJogosExibidos = () => {
    if (abaAtiva === 'AO_VIVO') return jogosAoVivo;
    if (abaAtiva === 'FINALIZADOS') return jogosFinalizados;
    return jogosProximos;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>⚽ Bolão ABC</div>
        <button style={styles.logoutBtn} onClick={() => window.location.href = '/login'}>Sair</button>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Jogos Reais</h2>
          
          <div style={styles.tabs}>
            <button onClick={() => setAbaAtiva('AO_VIVO')} style={abaAtiva === 'AO_VIVO' ? styles.tabActive : styles.tab}>
              Ao Vivo ({jogosAoVivo.length})
            </button>
            <button onClick={() => setAbaAtiva('PROXIMOS')} style={abaAtiva === 'PROXIMOS' ? styles.tabActive : styles.tab}>
              Próximos
            </button>
            <button onClick={() => setAbaAtiva('FINALIZADOS')} style={abaAtiva === 'FINALIZADOS' ? styles.tabActive : styles.tab}>
              Finalizados
            </button>
          </div>
          
          {loading ? (
            <p style={styles.loadingText}>Buscando informações no campo... ⏳</p>
          ) : getJogosExibidos().length > 0 ? (
            getJogosExibidos().map(jogo => (
              <div key={jogo.id} style={styles.gameCard}>
                
                <div style={styles.leagueBadge}>
                   {formatarNomeCompeticao(jogo.competition.name)}
                </div>

                <div style={styles.matchContent}>
                  <div style={styles.teamInfo}>
                    <img src={jogo.homeTeam.crest} alt="escudo" style={styles.crest} />
                    <span style={styles.teamName}>{jogo.homeTeam.name}</span>
                  </div>
                  
                  <div style={styles.scoreBoard}>
                    <div style={styles.scoreText}>
                      {/* Mostra o placar se o jogo começou/terminou, senão mostra "VS" */}
                      {jogo.status === 'TIMED' ? 'VS' : `${jogo.score.fullTime.home ?? 0} - ${jogo.score.fullTime.away ?? 0}`}
                    </div>
                    <div style={styles.timeBadge}>
                      {jogo.status === 'IN_PLAY' 
                        ? '🔴 AO VIVO' 
                        : formatarDataJogo(jogo.utcDate)}
                    </div>
                  </div>

                  <div style={styles.teamInfo}>
                    <img src={jogo.awayTeam.crest} alt="escudo" style={styles.crest} />
                    <span style={styles.teamName}>{jogo.awayTeam.name}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.emptyText}>Nenhum jogo nesta categoria para o período.</p>
          )}
        </section>

        <section style={styles.actionSection}>
          <div style={styles.actionCard}>
            <h3>Criar novo Bolão</h3>
            <p style={styles.cardSub}>Organize sua galera e defina as regras.</p>
            <button style={styles.btnPrimary}>+ Novo Bolão</button>
          </div>

          <div style={styles.actionCard}>
            <h3>Entrar em um Bolão</h3>
            <input 
              style={styles.input} 
              placeholder="Digite o código (ex: ABC-123)"
              value={codigoBolao}
              onChange={(e) => setCodigoBolao(e.target.value)}
            />
            <button style={styles.btnSecondary}>Entrar no Grupo</button>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f2027', color: '#fff', fontFamily: "'Segoe UI', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', padding: '20px 5%', background: 'rgba(0,0,0,0.3)', alignItems: 'center' },
  logo: { fontSize: '24px', fontWeight: 'bold', color: '#00e676' },
  logoutBtn: { background: 'transparent', border: '1px solid #ff5252', color: '#ff5252', borderRadius: '5px', padding: '5px 15px', cursor: 'pointer' },
  main: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' },
  sectionTitle: { marginBottom: '20px', fontSize: '22px', fontWeight: 'bold' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '25px' },
  tabActive: { background: '#00e676', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#000' },
  tab: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' },
  gameCard: { background: 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.1)' },
  leagueBadge: { fontSize: '11px', textTransform: 'uppercase', color: '#00e676', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center', letterSpacing: '1px' },
  matchContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  teamInfo: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '35%', gap: '8px' },
  teamName: { fontSize: '13px', textAlign: 'center' },
  crest: { width: '35px', height: '35px', objectFit: 'contain' },
  scoreBoard: { textAlign: 'center', width: '30%' },
  scoreText: { fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px' },
  timeBadge: { fontSize: '11px', color: '#00e676', marginTop: '5px', fontWeight: 'bold' },
  actionSection: { marginTop: '50px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  actionCard: { background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', padding: '30px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' },
  cardSub: { color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '15px' },
  input: { width: '90%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', marginBottom: '15px', outline: 'none' },
  btnPrimary: { background: '#00e676', border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', color: '#000', width: '100%' },
  btnSecondary: { background: '#fff', border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', color: '#000', width: '100%' },
  loadingText: { textAlign: 'center', color: '#00e676' },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: '20px' }
};