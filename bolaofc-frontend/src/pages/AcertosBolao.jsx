import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AcertosBolao() {
  const navigate = useNavigate();
  const [palpites, setPalpites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bolaoSelecionado, setBolaoSelecionado] = useState('todos');
  const [boloes, setBoloes] = useState([]);

  useEffect(() => {
    api.get('/api/palpites/meus')
      .then(res => {
        const todos = res.data;
        setPalpites(todos);

        // Extrai bolões únicos dos palpites
        const boloesMap = {};
        todos.forEach(p => {
          if (p.bolao?.id) {
            boloesMap[p.bolao.id] = p.bolao.nome;
          }
        });
        setBoloes(Object.entries(boloesMap).map(([id, nome]) => ({ id, nome })));
      })
      .catch(err => console.error('Erro ao buscar palpites:', err))
      .finally(() => setLoading(false));
  }, []);

  const acertos = palpites.filter(p => p.status === 'CORRETO');

  const acertosFiltrados = bolaoSelecionado === 'todos'
    ? acertos
    : acertos.filter(p => p.bolao?.id === bolaoSelecionado);

  const getTipoAcerto = (palpite) => {
    const partida = palpite.partida;
    if (!partida) return { label: 'Acerto', color: '#00e676', icon: '✓' };

    const placarExato =
      palpite.palpiteCasa === partida.golsCasa &&
      palpite.palpiteFora === partida.golsFora;

    if (placarExato) {
      return { label: 'Placar exato', color: '#ffd700', icon: '🎯' };
    }
    return { label: 'Acertou vencedor', color: '#00e676', icon: '✓' };
  };

  const formatarNomeLiga = (codigo) => {
    const nomes = {
      'CL': 'Champions League 🏆',
      'PL': 'Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'BSA': 'Brasileirão 🇧🇷',
      'PD': 'La Liga 🇪🇸',
      'BL1': 'Bundesliga 🇩🇪',
      'SA': 'Serie A 🇮🇹',
      'FL1': 'Ligue 1 🇫🇷',
    };
    return nomes[codigo] || codigo;
  };

  const totalPontos = acertosFiltrados.reduce((acc, p) => acc + (p.pontosGanhos || 0), 0);
  const placaresExatos = acertosFiltrados.filter(p => getTipoAcerto(p).label === 'Placar exato').length;
  const vencedores = acertosFiltrados.filter(p => getTipoAcerto(p).label === 'Acertou vencedor').length;

  if (loading) return (
    <div style={s.container}>
      <p style={{ color: '#00e676', textAlign: 'center', paddingTop: 80 }}>Carregando acertos...</p>
    </div>
  );

  return (
    <div style={s.container}>
      <header style={s.header}>
        <button onClick={() => navigate(-1)} style={s.backBtn}>← Voltar</button>
        <span style={s.logo}>🎯 Meus Acertos</span>
        <div />
      </header>

      <main style={s.main}>

        {/* Cards de resumo */}
        <div style={s.resumoRow}>
          <div style={s.resumoCard}>
            <span style={s.resumoNum}>{acertosFiltrados.length}</span>
            <span style={s.resumoLabel}>acertos</span>
          </div>
          <div style={s.resumoCard}>
            <span style={{ ...s.resumoNum, color: '#ffd700' }}>{placaresExatos}</span>
            <span style={s.resumoLabel}>placares exatos</span>
          </div>
          <div style={s.resumoCard}>
            <span style={s.resumoNum}>{vencedores}</span>
            <span style={s.resumoLabel}>acertou vencedor</span>
          </div>
          <div style={{ ...s.resumoCard, gridColumn: '1 / -1' }}>
            <span style={{ ...s.resumoNum, fontSize: 32 }}>{totalPontos}</span>
            <span style={s.resumoLabel}>pontos ganhos com acertos</span>
          </div>
        </div>

        {/* Filtro por bolão */}
        <div style={s.filtroRow}>
          <button
            onClick={() => setBolaoSelecionado('todos')}
            style={{ ...s.filtroBtn, ...(bolaoSelecionado === 'todos' ? s.filtroBtnAtivo : {}) }}
          >
            Todos os bolões
          </button>
          {boloes.map(b => (
            <button
              key={b.id}
              onClick={() => setBolaoSelecionado(b.id)}
              style={{ ...s.filtroBtn, ...(bolaoSelecionado === b.id ? s.filtroBtnAtivo : {}) }}
            >
              📋 {b.nome}
            </button>
          ))}
        </div>

        {/* Lista de acertos */}
        {acertosFiltrados.length === 0 ? (
          <div style={s.emptyCard}>
            <span style={{ fontSize: 40 }}>😔</span>
            <p style={{ color: '#aaa', margin: 0 }}>
              {bolaoSelecionado === 'todos'
                ? 'Você ainda não tem acertos.'
                : 'Nenhum acerto neste bolão ainda.'}
            </p>
            <button onClick={() => navigate('/meus-boloes')} style={s.btnGo}>
              Ir para meus bolões
            </button>
          </div>
        ) : (
          acertosFiltrados.map(palpite => {
            const partida = palpite.partida;
            const tipo = getTipoAcerto(palpite);

            return (
              <div key={palpite.id} style={{ ...s.gameCard, borderLeft: `3px solid ${tipo.color}` }}>

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
                    <div style={s.meuPalpiteLabel}>meu palpite</div>
                    <div style={s.meuPalpiteScore}>
                      {palpite.palpiteCasa} × {palpite.palpiteFora}
                    </div>
                    <div style={s.resultadoLabel}>resultado</div>
                    <div style={s.resultadoScore}>
                      {partida?.golsCasa} × {partida?.golsFora}
                    </div>
                  </div>

                  <div style={s.teamInfo}>
                    {partida?.escudoFora
                      ? <img src={partida.escudoFora} alt={partida.timeFora} style={s.crest} />
                      : <div style={s.crestFallback}>{partida?.timeFora?.substring(0, 3).toUpperCase()}</div>
                    }
                    <span style={s.teamName}>{partida?.timeFora}</span>
                  </div>
                </div>

                {/* Rodapé: tipo de acerto + pontos */}
                <div style={s.cardFooter}>
                  <span style={{ ...s.tipoBadge, color: tipo.color, borderColor: tipo.color }}>
                    {tipo.icon} {tipo.label}
                  </span>
                  {palpite.pontosGanhos > 0 && (
                    <span style={{ ...s.pontosBadge, color: tipo.color }}>
                      +{palpite.pontosGanhos} pts
                    </span>
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

  resumoRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 },
  resumoCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  resumoNum: { fontSize: 28, fontWeight: 'bold', color: '#00e676' },
  resumoLabel: { fontSize: 11, color: '#aaa', textAlign: 'center' },

  filtroRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 },
  filtroBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#aaa', padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, transition: 'all 0.2s' },
  filtroBtnAtivo: { background: 'rgba(0,230,118,0.15)', border: '1px solid #00e676', color: '#00e676', fontWeight: 'bold' },

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

  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 },
  tipoBadge: { fontSize: 12, fontWeight: 'bold', border: '1px solid', padding: '3px 10px', borderRadius: 20 },
  pontosBadge: { fontSize: 13, fontWeight: 'bold' },
};