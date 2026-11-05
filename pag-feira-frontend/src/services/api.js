import axios from "axios";

// 1. Instância central com suporte a cookies
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Permite o envio/recebimento de cookies HttpOnly
});

// 2. Interceptor de Envio: anexa o crachá de acesso em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Busca o Access Token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Interceptor de Resposta: monitora e renova tokens expirados
api.interceptors.response.use(
  (response) => response, // Requisições com sucesso passam direto
  async (error) => {
    const originalConfig = error.config;

    // Detecta expiração (401), ignora a rota de login, ignora a rota de renovação e verifica o _retry
    if (
      error.response?.status === 401 &&
      !originalConfig._retry &&
      originalConfig.url !== "/api/auth/login" && // NOVO: Não tenta renovar se o erro for senha errada
      originalConfig.url !== "/api/auth/renovar-token"
    ) {
      
      // NOVO: A TRAVA! Marca essa requisição como "já tentei renovar" para impedir o loop infinito
      originalConfig._retry = true; 

      try {
        const response = await api.post("/api/auth/renovar-token");
        const novoToken = response.data.token;

        // Salva o novo crachá
        localStorage.setItem("token", novoToken);
        
        // Atualiza a requisição original com o novo crachá
        originalConfig.headers.Authorization = `Bearer ${novoToken}`;

        // Reenvia a chamada original que havia falhado
        return api(originalConfig);
      } catch (refreshError) {
        // Se a própria rota de renovar falhar (RefreshToken expirou), limpa tudo e desloga
        localStorage.removeItem("token");
        
        // Redireciona para o login apenas se já não estiver na página de login
        if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
            window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;