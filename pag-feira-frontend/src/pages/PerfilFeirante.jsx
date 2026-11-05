import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, CircleUser } from "lucide-react";

export default function PerfilFeirante() {
  const { id } = useParams();
  const [feirante, setFeirante] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarFeirante() {
      try {
        const resposta = await axios.get(`http://localhost:5000/api/feirantes/${id}`, {
        headers: {
          Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYzAzZDQ2Y2M4ZDQ0ZTcyMWNjNDkxYyIsImlhdCI6MTc5MjU0MDI0MywiZXhwIjoxNzkyNTgzNDQzfQ.IV8qR1zIA0sg_nSbIhpRbBbavD6IdfM3OsFgTGjRuAM'}`
        }
      });
        setFeirante(resposta.data);
      } catch (erro) {
        setErro("Feirante não encontrado!", erro);
      }
    }

    buscarFeirante();
  }, [id]);
  // 1. Verificação de erro (Prioridade máxima)
  if (erro) {
    return (
      <div className="p-4 flex flex-col items-start">
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4" 
          title="Voltar"
        >
          <ArrowLeft />
        </Link>
        <div className="text-red-500 font-bold">{erro}</div>
      </div>
    );
  }

  // 2. Verificação de carregamento
  if (!feirante) {
    return <div className="p-4 text-gray-500">Carregando perfil...</div>
  }

  // 3. Sucesso! Renderiza o perfil completo
  return (
    <div className="p-4 flex flex-col items-center">
      <Link 
        to="/" 
        className="self-start flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" 
        title="Voltar"
      >
        <ArrowLeft />
      </Link>
      
      <CircleUser className="w-32 h-32 mb-4 mt-4 text-gray-400" strokeWidth={1.5} />
      <h1 className="text-2xl font-bold">{feirante.nome}</h1>
      {/* <p className="text-sm font-medium text-gray-600 mt-2">{feirante.descricao}</p> */}
    </div>
  );
}