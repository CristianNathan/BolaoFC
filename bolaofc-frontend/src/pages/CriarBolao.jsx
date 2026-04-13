import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LIGAS_DISPONIVEIS = [
  { id: 2013, nome: 'Brasileirão Série A 🇧🇷' }, { id: 2021, nome: 'Premier League 🏴' },
  { id: 2014, nome: 'La Liga 🇪🇸' }, { id: 2019, nome: 'Serie A 🇮🇹' },
  { id: 2002, nome: 'Bundesliga 🇩🇪' }, { id: 2015, nome: 'Ligue 1 🇫🇷' },
  { id: 2001, nome: 'Champions League 🇪🇺' }, { id: 2000, nome: 'Copa do Mundo 🏆' },
];

export default function CriarBolao() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    pontosCheio: 10,
    pontosVencedor: 5,
    publico: true,
    limiteParticipantes: 50,
    dataEncerramento: '',
    ligasIds: []
  });

  const handleToggleLiga = (id) => {
    setFormData(prev => ({
      ...prev,
      ligasIds: prev.ligasIds.includes(id) 
        ? prev.ligasIds.filter(l => l !== id) 
        : [...prev.ligasIds, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.ligasIds.length === 0) return alert("Selecione ao menos uma liga!");
    try {
      await api.post('/bolaos', formData);
      navigate('/meus-boloes');
    } catch (err) {
      alert("Erro ao criar bolão");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏆 Configurar Novo Bolão</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* NOME */}
        <div style={styles.section}>
          <label style={styles.label}>Nome do Bolão</label>
          <input 
            style={styles.input} 
            placeholder="Ex: Bolão dos Amigos"
            onChange={e => setFormData({...formData, nome: e.target.value})}
            required
          />
        </div>

        {/* REGRAS DE PONTOS */}
        <div style={styles.section}>
          <label style={styles.label}>Regras de Pontuação</label>
          <div style={styles.row}>
            <div style={{flex: 1}}>
              <span style={styles.subLabel}>Placar Exato</span>
              <input type="number" style={styles.input} value={formData.pontosCheio} 
                onChange={e => setFormData({...formData, pontosCheio: e.target.value})} />
            </div>
            <div style={{flex: 1}}>
              <span style={styles.subLabel}>Apenas Vencedor</span>
              <input type="number" style={styles.input} value={formData.pontosVencedor} 
                onChange={e => setFormData({...formData, pontosVencedor: e.target.value})} />
            </div>
          </div>
        </div>

        {/* CONFIGURAÇÕES DE ACESSO */}
        <div style={styles.section}>
          <div style={styles.row}>
            <div style={{flex: 1}}>
              <label style={styles.label}>Privacidade</label>
              <select style={styles.input} onChange={e => setFormData({...formData, publico: e.target.value === 'true'})}>
                <option value="true">Público (Todos veem)</option>
                <option value="false">Privado (Só com código)</option>
              </select>
            </div>
            <div style={{flex: 1}}>
              <label style={styles.label}>Limite de Pessoas</label>
              <input type="number" style={styles.input} value={formData.limiteParticipantes} 
                onChange={e => setFormData({...formData, limiteParticipantes: e.target.value})} />
            </div>
          </div>
        </div>

        {/* CAMPEONATOS */}
        <div style={styles.section}>
          <label style={styles.label}>Escolha os Campeonatos</label>
          <div style={styles.gridLigas}>
            {LIGAS_DISPONIVEIS.map(liga => (
              <button
                key={liga.id} type="button"
                onClick={() => handleToggleLiga(liga.id)}
                style={{
                  ...styles.ligaBtn,
                  backgroundColor: formData.ligasIds.includes(liga.id) ? '#00e676' : '#21262d',
                  color: formData.ligasIds.includes(liga.id) ? '#0d1117' : '#fff'
                }}
              >
                {liga.nome}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" style={styles.btnCriar}>LANÇAR BOLÃO</button>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: '40px', backgroundColor: '#0d1117', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
  title: { fontSize: '32px', marginBottom: '30px', color: '#00e676', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '25px', maxWidth: '600px' },
  section: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { fontSize: '16px', fontWeight: 'bold', color: '#8b949e' },
  subLabel: { fontSize: '12px', color: '#8b949e', display: 'block', marginBottom: '5px' },
  row: { display: 'flex', gap: '20px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#161b22', color: '#fff', width: '100%', boxSizing: 'border-box' },
  gridLigas: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  ligaBtn: { padding: '10px 15px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' },
  btnCriar: { padding: '18px', borderRadius: '8px', border: 'none', backgroundColor: '#238636', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }
};