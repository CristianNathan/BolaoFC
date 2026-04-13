import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PalpitesBolao() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [partidas, setPartidas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get(`http://localhost:8080/partidas/bolao/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setPartidas(res.data);
            setCarregando(false);
        })
        .catch(err => {
            console.error("Ainda deu erro:", err.response?.status);
            setCarregando(false);
        });
    }, [id]);

    const handleSalvarPalpite = async (partidaId, casa, fora) => {
        try {
            const token = localStorage.getItem('token');

            await axios.post(
                'http://localhost:8080/palpites',
                {
                    palpiteCasa: casa,
                    palpiteFora: fora,
                    partida: { id: partidaId },
                    bolao: { id: id }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Palpite registrado!");
        } catch (err) {
            alert(err.response?.data || "Erro ao salvar");
        }
    };

    if (carregando) return <p style={{ color: 'white' }}>Carregando jogos da sua liga...</p>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#121214', minHeight: '100vh', color: 'white' }}>
            <button onClick={() => navigate('/meus-boloes')} style={{ marginBottom: '20px' }}>
                ← Voltar
            </button>

            <h1>Próximos Jogos</h1>
            <p>Selecione seu placar para os jogos da liga escolhida:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                {partidas.length > 0 ? partidas.map(jogo => (
                    <div
                        key={jogo.id}
                        style={{
                            backgroundColor: '#202024',
                            padding: '20px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: '1px solid #323238'
                        }}
                    >
                        <div style={{ flex: 1, textAlign: 'right' }}>{jogo.timeCasa}</div>

                        <div style={{ display: 'flex', gap: '10px', margin: '0 20px' }}>
                            <input
                                type="number"
                                id={`casa-${jogo.id}`}
                                style={{
                                    width: '40px',
                                    textAlign: 'center',
                                    borderRadius: '4px',
                                    border: 'none',
                                    padding: '5px'
                                }}
                            />

                            <span>x</span>

                            <input
                                type="number"
                                id={`fora-${jogo.id}`}
                                style={{
                                    width: '40px',
                                    textAlign: 'center',
                                    borderRadius: '4px',
                                    border: 'none',
                                    padding: '5px'
                                }}
                            />
                        </div>

                        <div style={{ flex: 1, textAlign: 'left' }}>{jogo.timeFora}</div>

                        <button
                            onClick={() => {
                                const c = document.getElementById(`casa-${jogo.id}`).value;
                                const f = document.getElementById(`fora-${jogo.id}`).value;
                                handleSalvarPalpite(jogo.id, c, f);
                            }}
                            style={{
                                marginLeft: '20px',
                                backgroundColor: '#00875f',
                                color: 'white',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Confirmar
                        </button>
                    </div>
                )) : (
                    <p>Nenhum jogo futuro encontrado para esta liga.</p>
                )}
            </div>
        </div>
    );
}