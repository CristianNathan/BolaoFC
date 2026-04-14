import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PalpitesBolao() {
    const { id } = useParams(); // Esse é o bolaoId
    const navigate = useNavigate();
    const [partidas, setPartidas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [palpites, setPalpites] = useState({}); // Armazena os valores dos inputs

    const carregarPartidas = async () => {
        setCarregando(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`http://localhost:8080/partidas/bolao/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPartidas(res.data);
        } catch (err) {
            console.error("Erro ao buscar partidas:", err.response?.status);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarPartidas();
    }, [id]);

    // Função para importar jogos reais caso a lista esteja vazia
    const importarJogosReais = async () => {
        const token = localStorage.getItem('token');
        try {
            // Chamando o endpoint que criamos no Java (ajuste a rota se necessário)
            await axios.post(`http://localhost:8080/partidas/importar/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Jogos importados da API com sucesso!");
            carregarPartidas(); // Recarrega a lista
        } catch (err) {
            alert("Erro ao importar: " + (err.response?.data || "Verifique a API externa"));
        }
    };

    const handleInputChange = (partidaId, campo, valor) => {
        setPalpites(prev => ({
            ...prev,
            [partidaId]: {
                ...prev[partidaId],
                [campo]: valor
            }
        }));
    };

    const handleSalvarPalpite = async (partidaId) => {
        const p = palpites[partidaId];
        if (!p || p.casa === undefined || p.fora === undefined) {
            alert("Preencha ambos os placares!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/palpites', {
                palpiteCasa: p.casa,
                palpiteFora: p.fora,
                partida: { id: partidaId },
                bolao: { id: id }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Palpite registrado com sucesso!");
        } catch (err) {
            alert(err.response?.data || "Erro ao salvar palpite");
        }
    };

    if (carregando) return <p style={{ color: 'white', padding: '20px' }}>Carregando jogos reais...</p>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#121214', minHeight: '100vh', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => navigate('/meus-boloes')} style={btnStyle}> ← Voltar </button>
                <button onClick={importarJogosReais} style={{ ...btnStyle, backgroundColor: '#323238' }}> 🔄 Sincronizar Jogos Reais </button>
            </div>

            <h1 style={{ marginTop: '20px' }}>Próximos Jogos Reais</h1>
            <p>Dê seu palpite para os jogos oficiais da liga:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                {partidas.length > 0 ? partidas.map(jogo => (
                    <div key={jogo.id} style={cardStyle}>
                        <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>{jogo.timeCasa}</div>

                        <div style={{ display: 'flex', gap: '10px', margin: '0 20px', alignItems: 'center' }}>
                            <input
                                type="number"
                                onChange={(e) => handleInputChange(jogo.id, 'casa', e.target.value)}
                                style={inputStyle}
                            />
                            <span>x</span>
                            <input
                                type="number"
                                onChange={(e) => handleInputChange(jogo.id, 'fora', e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ flex: 1, textAlign: 'left', fontWeight: 'bold' }}>{jogo.timeFora}</div>

                        <button onClick={() => handleSalvarPalpite(jogo.id)} style={confirmBtnStyle}>
                            Confirmar
                        </button>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <p>Nenhum jogo encontrado para este bolão.</p>
                        <button onClick={importarJogosReais} style={{ color: '#00b37e', background: 'none', border: '1px solid #00b37e', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
                            Clique aqui para buscar jogos reais da API
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Estilos rápidos para limpar o JSX
const btnStyle = { padding: '8px 16px', cursor: 'pointer', backgroundColor: '#202024', color: 'white', border: '1px solid #323238', borderRadius: '4px' };
const cardStyle = { backgroundColor: '#202024', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #323238' };
const inputStyle = { width: '45px', textAlign: 'center', borderRadius: '4px', border: 'none', padding: '8px', fontSize: '16px', fontWeight: 'bold' };
const confirmBtnStyle = { marginLeft: '20px', backgroundColor: '#00875f', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };