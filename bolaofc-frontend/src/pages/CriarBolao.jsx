import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CriarBolao() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    pontosPlacarExato: 10,
    pontosVencedor: 5,
    maxParticipantes: 50,
    privado: true,
    ligasPermitidas: []
  });

  const ligasDisponiveis = [
    { id: 'WC',  nome: 'Copa do Mundo', pais: '🌍', destaque: true },
    { id: 'BSA', nome: 'Brasileirão',   pais: '🇧🇷' },
    { id: 'PL',  nome: 'Premier League',pais: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'CL',  nome: 'Champions',     pais: '🏆' },
    { id: 'PD',  nome: 'La Liga',       pais: '🇪🇸' },
    { id: 'SA',  nome: 'Série A Tim',   pais: '🇮🇹' },
    { id: 'BL1', nome: 'Bundesliga',    pais: '🇩🇪' },
    { id: 'FL1', nome: 'Ligue 1',       pais: '🇫🇷' },
  ];

  const handleLigaToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      ligasPermitidas: prev.ligasPermitidas.includes(id)
        ? prev.ligasPermitidas.filter(l => l !== id)
        : [...prev.ligasPermitidas, id]
    }));
  };

  const handleNumberChange = (field, value) => {
    const numValue = parseInt(value, 10);
    setFormData({
      ...formData,
      [field]: isNaN(numValue) ? 0 : numValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.ligasPermitidas.length === 0) {
      alert("Selecione pelo menos uma liga para o seu bolão!");
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/bolao/criar', formData);
      navigate('/meus-boloes');
    } catch (err) {
      console.error(err);
      alert("Erro ao criar bolão. Verifique os dados ou sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const isWCSelecionada = formData.ligasPermitidas.includes('WC');

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={() => navigate('/home')} style={styles.backBtn}>← Voltar para Home</button>

        <h2 style={styles.title}>Configurar Novo Bolão</h2>
        <p style={styles.subtitle}>Defina as regras e a privacidade do seu grupo</p>

        <form onSubmit={handleSubmit}>
          {/* NOME DO BOLÃO */}
          <div style={styles.section}>
            <label style={styles.label}>Nome do Grupo</label>
            <input
              required
              style={styles.input}
              placeholder="Ex: Bolão dos Amigos"
              value={formData.nome}
              onChange={e => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>

          {/* MÁXIMO DE PARTICIPANTES */}
          <div style={styles.section}>
            <label style={styles.label}>Máximo de Participantes</label>
            <input
              type="number"
              style={styles.input}
              placeholder="Ex: 50"
              value={formData.maxParticipantes === 0 ? '' : formData.maxParticipantes}
              onChange={e => handleNumberChange('maxParticipantes', e.target.value)}
            />
            <p style={styles.infoText}>Limite de pessoas no grupo.</p>
          </div>

          {/* PRIVACIDADE */}
          <div style={styles.section}>
            <label style={styles.label}>Privacidade</label>
            <div style={styles.row}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, privado: true })}
                style={formData.privado ? styles.ligaActive : styles.liga}
              >
                🔒 Privado
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, privado: false })}
                style={!formData.privado ? styles.ligaActive : styles.liga}
              >
                🌍 Público
              </button>
            </div>
          </div>

          {/* REGRAS DE PONTOS */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Placar Exato</label>
              <input
                type="number"
                style={styles.input}
                value={formData.pontosPlacarExato === 0 ? '' : formData.pontosPlacarExato}
                onChange={e => handleNumberChange('pontosPlacarExato', e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Acertar Vencedor</label>
              <input
                type="number"
                style={styles.input}
                value={formData.pontosVencedor === 0 ? '' : formData.pontosVencedor}
                onChange={e => handleNumberChange('pontosVencedor', e.target.value)}
              />
            </div>
          </div>

          {/* SELEÇÃO DE LIGAS */}
          <div style={styles.section}>
            <label style={styles.label}>Ligas Permitidas</label>

            {/* Card especial Copa do Mundo */}
            {(() => {
              const wc = ligasDisponiveis.find(l => l.id === 'WC');
              const wcAtiva = formData.ligasPermitidas.includes('WC');
              return (
                <div
                  onClick={() => handleLigaToggle('WC')}
                  style={wcAtiva ? styles.wcCardActive : styles.wcCard}
                >
                  <span style={styles.wcEmoji}>🌍</span>
                  <div style={styles.wcInfo}>
                    <span style={wcAtiva ? styles.wcNomeActive : styles.wcNome}>
                      Copa do Mundo FIFA 2026
                    </span>
                    <span style={styles.wcSub}>EUA · México · Canadá</span>
                  </div>
                  <span style={wcAtiva ? styles.wcCheckActive : styles.wcCheck}>
                    {wcAtiva ? '✓' : '+'}
                  </span>
                </div>
              );
            })()}

            {/* Grid das outras ligas */}
            <div style={styles.grid}>
              {ligasDisponiveis
                .filter(l => l.id !== 'WC')
                .map(liga => (
                  <div
                    key={liga.id}
                    onClick={() => handleLigaToggle(liga.id)}
                    style={
                      formData.ligasPermitidas.includes(liga.id)
                        ? styles.ligaActive
                        : styles.liga
                    }
                  >
                    <span style={{ fontSize: '18px' }}>{liga.pais}</span>
                    <span style={{ fontSize: '12px' }}>{liga.nome}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Aviso se Copa do Mundo selecionada */}
          {isWCSelecionada && (
            <div style={styles.wcAviso}>
              🏆 Copa do Mundo incluída! Os palpites da Copa valerão os mesmos pontos configurados acima.
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.btnSubmit}>
            {loading ? 'Criando Bolão...' : 'GERAR MEU BOLÃO'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f2027',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    background: '#1a2a33',
    padding: '35px',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#00e676',
    cursor: 'pointer',
    marginBottom: '15px',
    padding: 0,
    fontWeight: 'bold',
  },
  title: { color: '#00e676', margin: '0 0 5px 0', fontSize: '24px' },
  subtitle: { color: '#aaa', fontSize: '13px', marginBottom: '25px' },
  section: { marginBottom: '20px' },
  label: {
    display: 'block',
    color: '#fff',
    fontSize: '13px',
    marginBottom: '8px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#0f2027',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  row: { display: 'flex', gap: '10px', marginBottom: '10px' },
  inputGroup: { flex: 1 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '10px' },
  liga: {
    padding: '10px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid #333',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    transition: '0.2s',
    flex: 1,
  },
  ligaActive: {
    padding: '10px',
    borderRadius: '8px',
    background: '#00e676',
    border: '1px solid #00e676',
    color: '#000',
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    fontWeight: 'bold',
    transition: '0.2s',
    flex: 1,
  },

  // ─── Copa do Mundo card especial ──────────────────────────────────────────
  wcCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    borderRadius: '10px',
    background: 'rgba(255,215,0,0.05)',
    border: '1.5px solid rgba(255,215,0,0.25)',
    cursor: 'pointer',
    marginBottom: '4px',
    transition: '0.2s',
  },
  wcCardActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    borderRadius: '10px',
    background: 'rgba(255,215,0,0.15)',
    border: '1.5px solid #ffd700',
    cursor: 'pointer',
    marginBottom: '4px',
    boxShadow: '0 0 14px rgba(255,215,0,0.12)',
    transition: '0.2s',
  },
  wcEmoji: { fontSize: '26px', flexShrink: 0 },
  wcInfo: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
  wcNome: { fontSize: '14px', color: '#ffd700', fontWeight: '600' },
  wcNomeActive: { fontSize: '14px', color: '#ffd700', fontWeight: '700' },
  wcSub: { fontSize: '11px', color: 'rgba(255,255,255,0.45)' },
  wcCheck: {
    fontSize: '18px',
    color: 'rgba(255,215,0,0.4)',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  wcCheckActive: {
    fontSize: '18px',
    color: '#ffd700',
    fontWeight: 'bold',
    flexShrink: 0,
  },

  // ─── Aviso Copa selecionada ────────────────────────────────────────────────
  wcAviso: {
    background: 'rgba(255,215,0,0.08)',
    border: '1px solid rgba(255,215,0,0.3)',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '12px',
    color: '#ffd700',
    marginBottom: '16px',
    lineHeight: '1.5',
  },

  infoText: { fontSize: '11px', color: '#888', marginTop: '5px' },
  btnSubmit: {
    width: '100%',
    padding: '16px',
    marginTop: '10px',
    borderRadius: '10px',
    border: 'none',
    background: '#00e676',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,230,118,0.3)',
  },
};