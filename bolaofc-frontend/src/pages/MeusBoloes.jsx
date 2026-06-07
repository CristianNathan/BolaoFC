import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LIGAS_DISPONIVEIS = [
  { id: 'WC',  nome: 'Copa do Mundo', emoji: '🌍', destaque: true },
  { id: 'PL',  nome: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'PD',  nome: 'La Liga', emoji: '🇪🇸' },
  { id: 'BL1', nome: 'Bundesliga', emoji: '🇩🇪' },
  { id: 'SA',  nome: 'Serie A', emoji: '🇮🇹' },
  { id: 'FL1', nome: 'Ligue 1', emoji: '🇫🇷' },
  { id: 'BSA', nome: 'Brasileirão', emoji: '🇧🇷' },
  { id: 'CL',  nome: 'Champions League', emoji: '🏆' },
];

const getNomeLiga = (id) => LIGAS_DISPONIVEIS.find(x => x.id === id)?.nome ?? id;
const isWC = (id) => id === 'WC';

export default function MeusBoloes() {
  const navigate = useNavigate();
  const [meusBoloes, setMeusBoloes] = useState([]);
  const [boloesPublicos, setBoloesPublicos] = useState([]);
  const [ligasSelecionadas, setLigasSelecionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPublicos, setLoadingPublicos] = useState(false);

  const [confirmacaoSair, setConfirmacaoSair] = useState(null);
  const [modalDono, setModalDono] = useState(null);
  const [etapaDono, setEtapaDono] = useState('ESCOLHA');
  const [processando, setProcessando] = useState(false);

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
      prev.includes(ligaId) ? prev.filter(l => l !== ligaId) : [...prev, ligaId]
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
    }
  };

  const handleClicarSair = async (bolao) => {
    setProcessando(true);
    try {
      await api.delete(`/api/bolao/${bolao.id}/sair`);
      setMeusBoloes(prev => prev.filter(b => b.id !== bolao.id));
    } catch (err) {
      const msg = err.response?.data;
      if (msg === 'DONO') {
        setModalDono({ id: bolao.id, nome: bolao.nome });
        setEtapaDono('ESCOLHA');
      } else {
        alert('Erro ao sair do bolão.');
      }
    } finally {
      setProcessando(false);
    }
  };

  const handleConfirmarSair = async () => {
    if (!confirmacaoSair) return;
    setProcessando(true);
    try {
      await api.delete(`/api/bolao/${confirmacaoSair.id}/sair`);
      setMeusBoloes(prev => prev.filter(b => b.id !== confirmacaoSair.id));
      setConfirmacaoSair(null);
    } catch (err) {
      alert('Erro ao sair do bolão.');
    } finally {
      setProcessando(false);
    }
  };

  const handlePassarDono = async () => {
    if (!modalDono) return;
    setProcessando(true);
    try {
      await api.delete(`/api/bolao/${modalDono.id}/passar-dono`);
      setMeusBoloes(prev => prev.filter(b => b.id !== modalDono.id));
      setModalDono(null);
    } catch (err) {
      const msg = err.response?.data || 'Erro ao transferir o bolão.';
      alert(msg);
    } finally {
      setProcessando(false);
    }
  };

  const handleExcluirBolao = async () => {
    if (!modalDono) return;
    setProcessando(true);
    try {
      await api.delete(`/api/bolao/${modalDono.id}/excluir`);
      setMeusBoloes(prev => prev.filter(b => b.id !== modalDono.id));
      setModalDono(null);
    } catch (err) {
      alert('Erro ao excluir o bolão.');
    } finally {
      setProcessando(false);
    }
  };

  const fecharModalDono = () => {
    setModalDono(null);
    setEtapaDono('ESCOLHA');
  };

  if (loading) return <p style={{ color: '#fff', padding: 20 }}>Carregando...</p>;

  return (
    <div style={styles.container}>

      {/* MODAL — PARTICIPANTE COMUM */}
      {confirmacaoSair && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <p style={styles.modalIcon}>⚠️</p>
            <h3 style={styles.modalTitle}>Sair do bolão?</h3>
            <p style={styles.modalDesc}>
              Tem certeza que deseja sair de <strong>"{confirmacaoSair.nome}"</strong>? Seus palpites serão perdidos.
            </p>
            <div style={styles.modalBtns}>
              <button onClick={() => setConfirmacaoSair(null)} style={styles.btnCancelar} disabled={processando}>
                Cancelar
              </button>
              <button onClick={handleConfirmarSair} style={styles.btnPerigo} disabled={processando}>
                {processando ? 'Saindo...' : 'Sim, sair'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — DONO: ETAPA ESCOLHA */}
      {modalDono && etapaDono === 'ESCOLHA' && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <p style={styles.modalIcon}>👑</p>
            <h3 style={styles.modalTitle}>Você é o dono!</h3>
            <p style={styles.modalDesc}>
              O que deseja fazer com o bolão <strong>"{modalDono.nome}"</strong>?
            </p>
            <div style={styles.modalOpcoes}>
              <button onClick={() => setEtapaDono('CONFIRMAR_PASSAR')} style={styles.btnOpcao} disabled={processando}>
                <span style={styles.opcaoIcon}>🔄</span>
                <span style={styles.opcaoTexto}>
                  <strong>Passar o comando</strong>
                  <small>O participante mais antigo vira o novo dono e você sai</small>
                </span>
              </button>
              <button onClick={() => setEtapaDono('CONFIRMAR_EXCLUIR')} style={{ ...styles.btnOpcao, ...styles.btnOpcaoPerigo }} disabled={processando}>
                <span style={styles.opcaoIcon}>🗑️</span>
                <span style={styles.opcaoTexto}>
                  <strong>Excluir o bolão</strong>
                  <small>Remove o bolão e todos os participantes permanentemente</small>
                </span>
              </button>
            </div>
            <button onClick={fecharModalDono} style={{ ...styles.btnCancelar, width: '100%', marginTop: '12px' }} disabled={processando}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL — DONO: CONFIRMAR PASSAR COMANDO */}
      {modalDono && etapaDono === 'CONFIRMAR_PASSAR' && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <p style={styles.modalIcon}>🤔</p>
            <h3 style={styles.modalTitle}>Tem certeza?</h3>
            <p style={styles.modalDesc}>
              O comando do bolão <strong>"{modalDono.nome}"</strong> vai passar pro participante mais antigo e você sai. Isso não tem volta!
            </p>
            <div style={styles.modalBtns}>
              <button onClick={() => setEtapaDono('ESCOLHA')} style={styles.btnCancelar} disabled={processando}>
                Voltar
              </button>
              <button onClick={handlePassarDono} style={styles.btnPerigo} disabled={processando}>
                {processando ? 'Passando...' : 'Sim, passar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — DONO: CONFIRMAR EXCLUIR */}
      {modalDono && etapaDono === 'CONFIRMAR_EXCLUIR' && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <p style={styles.modalIcon}>🚨</p>
            <h3 style={styles.modalTitle}>Tem certeza?</h3>
            <p style={styles.modalDesc}>
              O bolão <strong>"{modalDono.nome}"</strong> vai ser excluído junto com todos os participantes e palpites. Isso não tem volta!
            </p>
            <div style={styles.modalBtns}>
              <button onClick={() => setEtapaDono('ESCOLHA')} style={styles.btnCancelar} disabled={processando}>
                Voltar
              </button>
              <button onClick={handleExcluirBolao} style={styles.btnPerigo} disabled={processando}>
                {processando ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      <header style={styles.header}>
        <button onClick={() => navigate('/home')} style={styles.backBtn}>← Voltar</button>
        <h2>🏆 Meus Bolões</h2>
      </header>

      <main style={styles.main}>

        {/* MEUS BOLÕES */}
        <section>
          <h3 style={styles.sectionTitle}>Seus Bolões</h3>
          <div style={styles.grid}>
            {meusBoloes.length > 0 ? meusBoloes.map(b => {
              const temCopa = b.ligasPermitidas?.includes('WC');
              return (
                <div key={b.id} style={{ ...styles.card, ...(temCopa ? styles.cardWorldCup : {}) }}>
                  {temCopa && <div style={styles.wcStrip}>🌍 Copa do Mundo 2026</div>}
                  <h4 style={styles.cardTitle}>{b.nome}</h4>
                  <p style={styles.cardCodigo}>Código: <strong>{b.codigoConvite}</strong></p>
                  {b.ligasPermitidas?.length > 0 && (
                    <div style={styles.ligasWrap}>
                      {b.ligasPermitidas.map(l => (
                        <span key={l} style={isWC(l) ? styles.ligaTagWC : styles.ligaTag}>
                          {getNomeLiga(l)}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={styles.cardActions}>
                    <button onClick={() => navigate(`/bolao/${b.id}`)} style={styles.btnAcessar}>
                      Detalhes
                    </button>
                    <button onClick={() => handleClicarSair(b)} style={styles.btnSair} disabled={processando}>
                      Sair
                    </button>
                  </div>
                </div>
              );
            }) : (
              <p style={styles.empty}>Você ainda não participa de nenhum bolão.</p>
            )}
          </div>
        </section>

        {/* EXPLORAR PÚBLICOS */}
        <section style={{ marginTop: '48px' }}>
          <h3 style={styles.sectionTitle}>Explorar Bolões Públicos 🌍</h3>

          <div style={styles.chipsWrap}>
            {LIGAS_DISPONIVEIS.map(liga => (
              <button
                key={liga.id}
                onClick={() => handleChip(liga.id)}
                style={{
                  ...styles.chip,
                  ...(ligasSelecionadas.includes(liga.id)
                    ? liga.destaque ? styles.chipAtivoWC : styles.chipAtivo
                    : liga.destaque ? styles.chipWC : {}),
                }}
              >
                {liga.emoji} {liga.nome}
              </button>
            ))}
          </div>

          {loadingPublicos ? (
            <p style={styles.empty}>Buscando bolões...</p>
          ) : boloesPublicos.length > 0 ? (
            <div style={styles.grid}>
              {boloesPublicos.map(b => {
                const temCopa = b.ligasPermitidas?.includes('WC');
                return (
                  <div key={b.id} style={{ ...styles.cardPublico, ...(temCopa ? styles.cardPublicoWC : {}) }}>
                    {temCopa && <div style={styles.wcStrip}>🌍 Copa do Mundo 2026</div>}
                    <h4 style={styles.cardTitle}>{b.nome}</h4>
                    <p style={styles.cardCodigo}>Código: <strong>{b.codigoConvite}</strong></p>
                    <p style={styles.cardDono}>Criado por: <strong>{b.dono?.nickname ?? 'Desconhecido'}</strong></p>
                    {b.ligasPermitidas?.length > 0 && (
                      <div style={styles.ligasWrap}>
                        {b.ligasPermitidas.map(l => (
                          <span key={l} style={isWC(l) ? styles.ligaTagWC : styles.ligaTag}>
                            {getNomeLiga(l)}
                          </span>
                        ))}
                      </div>
                    )}
                    <button onClick={() => handleEntrar(b.codigoConvite)} style={styles.btnEntrar}>
                      Entrar Agora
                    </button>
                  </div>
                );
              })}
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
  container: { minHeight: '100vh', background: '#0f2027', color: '#fff', padding: '20px' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  backBtn: { background: 'none', border: 'none', color: '#00e676', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  main: { maxWidth: '1000px', margin: '0 auto' },
  sectionTitle: { marginBottom: '16px', fontSize: '18px', color: '#eee' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' },

  // Cards meus bolões
  card: {
    background: 'rgba(255,255,255,0.05)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #00e676',
  },
  cardWorldCup: {
    background: 'linear-gradient(135deg, rgba(0,80,40,0.4), rgba(0,40,20,0.5))',
    border: '1px solid rgba(255,215,0,0.4)',
    boxShadow: '0 0 16px rgba(255,215,0,0.06)',
  },

  // Cards bolões públicos
  cardPublico: {
    background: 'rgba(255,255,255,0.05)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #555',
  },
  cardPublicoWC: {
    background: 'linear-gradient(135deg, rgba(0,80,40,0.3), rgba(0,40,20,0.4))',
    border: '1px solid rgba(255,215,0,0.35)',
    boxShadow: '0 0 14px rgba(255,215,0,0.05)',
  },

  // Faixa Copa do Mundo
  wcStrip: {
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '1.5px',
    color: '#ffd700',
    background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.12), transparent)',
    textAlign: 'center',
    padding: '4px',
    borderRadius: '6px',
    marginBottom: '10px',
  },

  cardTitle: { margin: '0 0 8px', fontSize: '16px' },
  cardCodigo: { fontSize: '13px', color: '#ccc', margin: '0 0 6px' },
  cardDono: { fontSize: '12px', color: '#aaa', margin: '0 0 10px' },
  ligasWrap: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
  ligaTag: {
    background: 'rgba(0,230,118,0.15)',
    color: '#00e676',
    border: '1px solid #00e676',
    borderRadius: '20px',
    padding: '2px 10px',
    fontSize: '11px',
  },
  ligaTagWC: {
    background: 'rgba(255,215,0,0.15)',
    color: '#ffd700',
    border: '1px solid rgba(255,215,0,0.5)',
    borderRadius: '20px',
    padding: '2px 10px',
    fontSize: '11px',
    fontWeight: '600',
  },
  cardActions: { display: 'flex', gap: '8px', marginTop: '4px' },
  btnAcessar: { flex: 1, padding: '10px', background: '#00e676', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', color: '#000' },
  btnSair: { padding: '10px 14px', background: 'transparent', border: '1px solid #ff5252', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', color: '#ff5252', fontSize: '13px' },
  btnEntrar: { width: '100%', padding: '10px', marginTop: '4px', background: 'transparent', border: '1px solid #00e676', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', color: '#00e676' },

  // Chips de filtro
  chipsWrap: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' },
  chip: { padding: '6px 14px', borderRadius: '20px', border: '1px solid #555', background: 'transparent', color: '#ccc', cursor: 'pointer', fontSize: '13px' },
  chipAtivo: { background: '#00e676', border: '1px solid #00e676', color: '#0f2027', fontWeight: 'bold' },
  chipWC: { border: '1px solid rgba(255,215,0,0.4)', color: '#ffd700', background: 'rgba(255,215,0,0.06)' },
  chipAtivoWC: { background: 'rgba(255,215,0,0.2)', border: '1px solid #ffd700', color: '#ffd700', fontWeight: 'bold' },

  empty: { color: '#888', fontSize: '14px' },

  // Modais
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#1a2e3b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px 28px', maxWidth: '400px', width: '90%', textAlign: 'center' },
  modalIcon: { fontSize: '36px', margin: '0 0 12px' },
  modalTitle: { fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px' },
  modalDesc: { fontSize: '14px', color: '#bbb', lineHeight: '1.5', margin: '0 0 24px' },
  modalBtns: { display: 'flex', gap: '10px' },
  modalOpcoes: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' },
  btnOpcao: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', cursor: 'pointer', color: '#fff', textAlign: 'left', width: '100%' },
  btnOpcaoPerigo: { border: '1px solid rgba(255,82,82,0.4)', background: 'rgba(255,82,82,0.08)' },
  opcaoIcon: { fontSize: '22px', flexShrink: 0 },
  opcaoTexto: { display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '13px' },
  btnCancelar: { flex: 1, padding: '11px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  btnPerigo: { flex: 1, padding: '11px', background: '#ff5252', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
};