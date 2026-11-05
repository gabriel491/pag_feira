import { Link } from 'react-router-dom';

export default function PaginaErro() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 text-center">
      {/* 1. Fundo do ecrã escuro */}
      
      {/* 2. O nosso novo Cartão Flutuante */}
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-2">Página não encontrada 🛑</p>
        <p className="text-gray-600 mb-8">Desculpe, a página que procura não existe ou foi movida.</p>
        
        <Link to="/" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 font-medium">
          Voltar para a Tela Inicial
        </Link>
      </div>

    </div>
  );
}