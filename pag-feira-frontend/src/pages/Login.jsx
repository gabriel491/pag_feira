import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye, EyeOff, LogIn } from "lucide-react";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [erroVisual, setErroVisual] = useState("");
  
  // Novo estado para o "olhinho" da senha
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setErroVisual("");

    try {
      const resposta = await api.post("/api/auth/login", { 
        login: userName, 
        senha 
      });
      
      localStorage.setItem("userName", userName);
      localStorage.setItem("token", resposta.data.token);
      navigate("/home");

    } catch (error) {
      if (error.response) {
        setErroVisual(error.response.data.mensagem);
      } else {
        setErroVisual("Erro ao conectar ao servidor!");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-green-800 p-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all">
        
        <div className="text-center mb-8">
          <div className="bg-green-100 text-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            {/* Substituímos o emoji pelo ícone do Lucide */}
            <ShoppingCart size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800">Controle de Feira</h1>
          <p className="text-sm text-gray-500 mt-1">Faça login para iniciar a cobrança</p>
        </div>

        {erroVisual && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm font-semibold">
            {erroVisual}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Usuário (Login)
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="Digite seu usuário"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                // Alterna entre texto visível e bolinhas
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              
              {/* Botão de Mostrar/Ocultar usando ícones */}
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-green-600 transition"
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 ${
              isLoading 
                ? "bg-green-400 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
            }`}
          >
            <LogIn size={20} />
            {isLoading ? "Entrando..." : "Acessar Sistema"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Sistema seguro exclusivo para cobradores.
          </p>
        </div>
      </div>
    </div>
  );
}