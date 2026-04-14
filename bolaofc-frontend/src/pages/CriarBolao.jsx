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
    { id: 'BSA', nome: 'Brasileirão', pais: '🇧🇷' },
    { id: 'PL', nome: 'Premier League', pais: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'CL', nome: 'Champions League', pais: '🏆' },
    { id: 'PD', nome: 'La Liga', pais: '🇪🇸' },
    { id: 'SA', nome: 'Série A Tim', pais: '🇮🇹' },
    { id: 'BL1', nome: 'Bundesliga', pais: '🇩🇪' },
    { id: 'FL1', nome: 'Ligue 1', pais: '🇫🇷' }
  ];

  const handleLigaToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      ligasPermitidas: prev.ligasPermitidas.includes(id)
        ? prev.ligasPermitidas.filter(l => l !== id)
        : [...prev.ligasPermitidas, id]
    }));
  };

  // Função auxiliar para tratar a digitação de números e evitar o "04"
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
              onChange={e => setFormData({...formData, nome: e.target.value})}
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
                onClick={() => setFormData({...formData, privado: true})}
                style={formData.privado ? styles.ligaActive : styles.liga}
              >
                🔒 Privado
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, privado: false})}
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
            <div style={styles.grid}>
              {ligasDisponiveis.map(liga => (
                <div 
                  key={liga.id}
                  onClick={() => handleLigaToggle(liga.id)}
                  style={formData.ligasPermitidas.includes(liga.id) ? styles.ligaActive : styles.liga}
                >
                  <span style={{fontSize: '18px'}}>{liga.pais}</span>
                  <span style={{fontSize: '12px'}}>{liga.nome}</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.btnSubmit}>
            {loading ? 'Criando Bolão...' : 'GERAR MEU BOLÃO'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f2027', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  card: { background: '#1a2a33', padding: '35px', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  backBtn: { background: 'none', border: 'none', color: '#00e676', cursor: 'pointer', marginBottom: '15px', padding: 0, fontWeight: 'bold' },
  title: { color: '#00e676', margin: '0 0 5px 0', fontSize: '24px' },
  subtitle: { color: '#aaa', fontSize: '13px', marginBottom: '25px' },
  section: { marginBottom: '20px' },
  label: { display: 'block', color: '#fff', fontSize: '13px', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f2027', color: '#fff', outline: 'none', boxSizing: 'border-box' },
  row: { display: 'flex', gap: '10px', marginBottom: '10px' },
  inputGroup: { flex: 1 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' },
  liga: { padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: '#fff', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '3px', transition: '0.2s', flex: 1 },
  ligaActive: { padding: '10px', borderRadius: '8px', background: '#00e676', border: '1px solid #00e676', color: '#000', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '3px', fontWeight: 'bold', transition: '0.2s', flex: 1 },
  infoText: { fontSize: '11px', color: '#888', marginTop: '5px' },
  btnSubmit: { width: '100%', padding: '16px', marginTop: '10px', borderRadius: '10px', border: 'none', background: '#00e676', color: '#000', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,230,118,0.3)' }
};