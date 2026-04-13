import { useState } from 'react';
import api from '../services/api'; // Importa a configuração do Axios que você criou
import '../App.css'; 

export default function Bolao() {
  const [nomeBolao, setNomeBolao] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);

  async function handleCriarBolao(e) {
    e.preventDefault();
    setMensagem('');
    setErro(false);

    try {
      // 1. Recupera o usuário logado para definir quem é o dono
      const userData = localStorage.getItem('user');
      if (!userData) {
        setMensagem("Usuário não logado!");
        setErro(true);
        return;
      }
      const user = JSON.parse(userData);

      // 2. Monta o objeto para o Spring
      const novoBolao = {
        nome: nomeBolao,
        dono: { id: user.id } // Certifique-se que seu Back espera o objeto 'dono'
      };

      // 3. Faz a chamada POST
      const response = await api.post('/boloes', novoBolao);
      
      setMensagem("Bolão criado com sucesso!");
      setNomeBolao(''); // Limpa o campo
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao criar bolão.");
      setErro(true);
    }
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <div className="card-grid" style={{ display: 'flex', gap: '20px' }}>
        
        {/* Card de Criar Bolão */}
        <div className="auth-container" style={{ maxWidth: '400px' }}>
          <h3>+ Criar Bolão</h3>
          <form className="auth-form" onSubmit={handleCriarBolao}>
            <input 
              type="text" 
              placeholder="Nome do bolão" 
              value={nomeBolao}
              onChange={(e) => setNomeBolao(e.target.value)}
              required
            />
            <button type="submit" style={{ backgroundColor: '#00e676' }}>
              Criar
            </button>
          </form>
          
          {mensagem && (
            <p style={{ color: erro ? '#ff5252' : '#00e676', marginTop: '10px' }}>
              {mensagem}
            </p>
          )}
        </div>

        {/* Card de Entrar com Código (Só visual por enquanto) */}
        <div className="auth-container" style={{ maxWidth: '400px' }}>
          <h3>🔗 Entrar com Código</h3>
          <form className="auth-form">
            <input type="text" placeholder="Código de convite" />
            <button type="button" style={{ backgroundColor: '#2979ff' }}>
              Entrar
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}