import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; 

export default function CadastroCobrador() {
  const navigate = useNavigate();
  
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    
    try {
      // Confirme se a rota no seu backend é exatamente esta (/api/auth/registrar)
      await api.post("/api/auth/registrar", { 
        nome,
        login,
        senha
      });
      
      setSucesso("Cobrador cadastrado com sucesso!");
      
      // Limpa os campos após o sucesso
      setNome("");
      setLogin("");
      setSenha("");
      
      // Aguarda 2 segundos e redireciona para a Home
      setTimeout(() => navigate("/"), 2000);
      
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao cadastrar cobrador.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Novo Cobrador</h2>
        
        {erro && <p className="text-red-500 font-semibold mb-4 text-center">{erro}</p>}
        {sucesso && <p className="text-green-600 font-semibold mb-4 text-center">{sucesso}</p>}
        
        <form onSubmit={handleCadastrar} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700">Nome Completo: *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full border rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Gabriel Macêdo"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Login (Usuário): *</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="w-full border rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: gabriel.admin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Senha: *</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength="6"
              className="w-full border rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo de 6 caracteres"
            />
          </div>
          
          <div className="flex gap-3 mt-4">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition"
            >
              Cadastrar
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/")} 
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 font-semibold transition"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}