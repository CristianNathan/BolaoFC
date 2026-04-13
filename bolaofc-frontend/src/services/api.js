import axios from 'axios';

// 1. PRIMEIRO: Criar a instância
const api = axios.create({
    baseURL: 'http://localhost:8080'
});

// 2. DEPOIS: Configurar os interceptors (usando a variável 'api' que já foi criada acima)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    let tokenFinal = token;

    if (!tokenFinal && userString) {
        try {
            const user = JSON.parse(userString);
            tokenFinal = user.token;
        } catch (e) {
            console.error("Erro ao ler user do localStorage", e);
        }
    }

    if (tokenFinal) {
        config.headers.Authorization = `Bearer ${tokenFinal}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 3. POR ÚLTIMO: Exportar
export default api;