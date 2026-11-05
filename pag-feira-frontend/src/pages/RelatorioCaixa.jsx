import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RelatorioCaixa() {
  const [relatorio, setRelatorio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarRelatorio() {
      try {
        const resposta = await api.get("/api/pagamentos/hoje");
        setRelatorio(resposta.data);
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);
        setErro("Não foi possível carregar os dados do fechamento.");
      } finally {
        setIsLoading(false);
      }
    }
    carregarRelatorio();
  }, []);

  const formatarMoeda = (valor) => {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

const enviarWhatsApp = () => {
    if (!relatorio) return;

    const dataHoje = new Date().toLocaleDateString("pt-BR");
    
    // Usando formatação sem caracteres especiais problemáticos
    let texto = `*FECHAMENTO DE CAIXA - ${dataHoje}*\n\n`;
    texto += `*Total Arrecadado:* ${formatarMoeda(relatorio.totalArrecadado)}\n`;
    texto += `*Pagamentos Recebidos:* ${relatorio.totalPagamentos}\n\n`;
    texto += `*Detalhamento de Recebimentos:*\n\n`;

    relatorio.pagamentos.forEach((pag) => {
      const nomeFeirante = pag.feiranteId?.nome || "Feirante Excluído";
      texto += `- *${nomeFeirante}* : ${formatarMoeda(pag.valorPago)}\n`;
    });

    texto += `\n_Feira Control - Gerenciamento Inteligente_`;

    const linkWhatsApp = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(linkWhatsApp, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Fechamento do Dia</h1>
          <button 
            onClick={() => navigate("/home")} 
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-400 transition"
          >
            Voltar
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-500 text-center mt-10">⏳ Carregando relatório...</p>
        ) : erro ? (
          <div className="bg-red-50 text-red-700 p-4 rounded border-l-4 border-red-500">
            {erro}
          </div>
        ) : relatorio ? (
          <>
            {/* Cartões de Resumo */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-600 text-white p-4 rounded-lg shadow-md">
                <p className="text-green-100 text-sm font-semibold uppercase">Total Arrecadado</p>
                <p className="text-3xl font-extrabold mt-1">{formatarMoeda(relatorio.totalArrecadado)}</p>
              </div>
              <div className="bg-white border p-4 rounded-lg shadow-md">
                <p className="text-gray-500 text-sm font-semibold uppercase">Qtd. Pagamentos</p>
                <p className="text-3xl font-extrabold text-gray-800 mt-1">{relatorio.totalPagamentos}</p>
              </div>
            </div>

            {/* Lista Detalhada */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <h2 className="font-bold text-gray-700 border-b pb-2 mb-3">Histórico de Recebimentos</h2>
              
              {relatorio.pagamentos.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum pagamento registrado hoje.</p>
              ) : (
                <ul className="space-y-2">
                  {relatorio.pagamentos.map((pag) => (
                    <li key={pag._id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="font-medium text-gray-800">
                        {pag.feiranteId?.nome || "Feirante Excluído"}
                      </span>
                      <span className="text-green-700 font-bold">
                        {formatarMoeda(pag.valorPago)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Botão do WhatsApp */}
            <button 
              onClick={enviarWhatsApp}
              disabled={relatorio.totalPagamentos === 0}
              className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2 ${
                relatorio.totalPagamentos === 0 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-green-500 hover:bg-green-600 hover:shadow-lg"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              Enviar Relatório no WhatsApp
            </button>
          </>
        ) : null}

      </div>
    </div>
  );
}