import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { 
  UserPlus, 
  ShieldPlus, 
  Archive, 
  Wallet, 
  Phone, 
  Activity, 
  Edit, 
  Banknote, 
  CheckCircle, 
  Ban, 
  RefreshCw, 
  FileText, 
  LogOut 
} from "lucide-react";

export default function Home() {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null;
  });

  const [feirantes, setFeirantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [totalArrecadado, setTotalArrecadado] = useState(0);

  // Estados dos Formulários
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [qtdBancasZinco, setQtdBancasZinco] = useState(0);
  const [qtdBancasMadeira, setQtdBancasMadeira] = useState(0);
  const [erroModal, setErroModal] = useState("");

  // Estados dos Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [feiranteEditando, setFeiranteEditando] = useState(null);
  
  const [modalLogoutAberto, setModalLogoutAberto] = useState(false);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [feiranteSelecionado, setFeiranteSelecionado] = useState(null);
  const [valorPago, setValorPago] = useState("");
  const [mensagemPagamento, setMensagemPagamento] = useState("");

  // Estados dos Inativos
  const [modalInativosAberto, setModalInativosAberto] = useState(false);
  const [feirantesInativos, setFeirantesInativos] = useState([]);
  const [loadingInativos, setLoadingInativos] = useState(false);

  const navigate = useNavigate();

  // Função utilitária para converter números no padrão BRL (R$ 0,00)
  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const carregarDadosDaTela = async () => {
    try {
      const respostaFeirantes = await api.get("/api/feirantes");
      setFeirantes(respostaFeirantes.data);

      const respostaPagamentos = await api.get("/api/pagamentos/hoje");
      setTotalArrecadado(respostaPagamentos.data.totalArrecadado || 0);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setErro("Não foi possível carregar os dados da feira. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Acesso negado. Faça login primeiro!");
      navigate("/login");
    } else {
      carregarDadosDaTela();
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  const abrirModalInativos = async () => {
    setModalInativosAberto(true);
    setLoadingInativos(true);
    try {
      const resposta = await api.get("/api/feirantes/inativos");
      setFeirantesInativos(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar inativos:", error);
    } finally {
      setLoadingInativos(false);
    }
  };

  const handleReativar = async (id) => {
    try {
      await api.put(`/api/feirantes/${id}`, { ativo: true });
      setModalInativosAberto(false);
      setIsLoading(true);
      await carregarDadosDaTela();
    } catch (error) {
      alert("Erro ao reativar feirante.");
    }
  };

  const abrirModalCadastro = () => {
    setNome(""); setWhatsapp(""); setQtdBancasZinco(0); setQtdBancasMadeira(0);
    setErroModal(""); setModalAberto(true);
  };

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setErroModal("");
    try {
      const response = await api.post("/api/feirantes", {
        nome, whatsapp,
        qtdBancasZinco: Number(qtdBancasZinco),
        qtdBancasMadeira: Number(qtdBancasMadeira),
      });
      setFeirantes([...feirantes, response.data.feirante || response.data]);
      setModalAberto(false);
    } catch (error) {
      setErroModal(error.response?.data?.mensagem || "Erro ao cadastrar.");
    }
  };

  const abrirModalEditar = (feirante) => {
    setFeiranteEditando(feirante);
    setNome(feirante.nome);
    setWhatsapp(feirante.whatsapp || "");
    setQtdBancasZinco(feirante.qtdBancasZinco);
    setQtdBancasMadeira(feirante.qtdBancasMadeira);
    setErroModal("");
    setModalEditarAberto(true);
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    setErroModal("");
    try {
      const id = feiranteEditando._id || feiranteEditando.id;
      const response = await api.put(`/api/feirantes/${id}`, {
        nome, whatsapp,
        qtdBancasZinco: Number(qtdBancasZinco),
        qtdBancasMadeira: Number(qtdBancasMadeira),
      });
      setFeirantes(feirantes.map(f => 
        (f._id || f.id) === id ? { ...f, ...response.data, pagouHoje: f.pagouHoje } : f
      ));
      setModalEditarAberto(false);
      setFeiranteEditando(null);
    } catch (error) {
      setErroModal(error.response?.data?.mensagem || "Erro ao editar feirante.");
    }
  };

  const handleDesativar = async () => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja desativar o feirante ${feiranteEditando.nome}? Ele sairá da lista principal.`
    );
    if (!confirmacao) return;

    try {
      const id = feiranteEditando._id || feiranteEditando.id;
      await api.delete(`/api/feirantes/${id}`);
      setFeirantes(feirantes.filter(f => (f._id || f.id) !== id));
      setModalEditarAberto(false);
      setFeiranteEditando(null);
    } catch (error) {
      setErroModal(error.response?.data?.mensagem || "Erro ao desativar feirante.");
    }
  };

  const abrirModalPagamento = (feirante) => {
    setFeiranteSelecionado(feirante);
    setValorPago(feirante.valorTotal || 0); 
    setMensagemPagamento("");
    setModalPagamentoAberto(true);
  };

  const handleRegistrarPagamento = async (e) => {
    e.preventDefault();
    setMensagemPagamento("");
    try {
      const valorConvertido = Number(valorPago);
      await api.post("/api/pagamentos", {
        feiranteId: feiranteSelecionado._id || feiranteSelecionado.id,
        valorPago: valorConvertido,
      });

      setMensagemPagamento("✅ Pagamento registrado com sucesso!");
      setTotalArrecadado(prevTotal => prevTotal + valorConvertido);
      
      setFeirantes(feirantes.map((f) =>
          (f._id || f.id) === (feiranteSelecionado._id || feiranteSelecionado.id)
            ? { ...f, pagouHoje: true }
            : f,
      ));

      setTimeout(() => {
        setModalPagamentoAberto(false);
        setFeiranteSelecionado(null);
      }, 1500);
    } catch (error) {
      setMensagemPagamento("❌ " + (error.response?.data?.mensagem || "Erro ao registrar."));
    }
  };

  return (
    <div className="p-4 relative min-h-screen bg-gray-50">
      {usuario && (
        <h1 className="text-2xl font-bold text-gray-800">
          Bem-vindo, {usuario.nome || usuario.login}!
        </h1>
      )}

      {/* Botões do Topo */}
      <div className="mt-6 flex flex-wrap gap-4">
        <button onClick={abrirModalCadastro} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-semibold transition">
          <UserPlus size={18} />
          Novo Feirante
        </button>
        <button onClick={() => navigate("/cadastro-cobrador")} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-900 font-semibold transition">
          <ShieldPlus size={18} />
          Novo Cobrador
        </button>
        <button onClick={abrirModalInativos} className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-400 font-semibold transition">
          <Archive size={18} />
          Ver Inativos
        </button>
      </div>

      {/* PAINEL FLUTUANTE (STICKY) */}
      <div className="sticky top-4 z-40 bg-green-600 text-white p-4 rounded-lg shadow-lg flex justify-between items-center mt-6 mb-6">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-green-100 uppercase tracking-wider">Caixa do Dia</span>
          <span className="font-extrabold text-2xl">{formatarMoeda(totalArrecadado)}</span>
        </div>
        <div className="bg-green-700 p-3 rounded-full text-green-100">
          <Wallet size={28} />
        </div>
      </div>

      {/* LISTA PRINCIPAL */}
      <div className="mt-4">
        <h2 className="text-xl font-bold text-gray-800">Lista de Feirantes Ativos</h2>
        {erro && <p className="text-red-500 font-semibold mt-2">{erro}</p>}

        {isLoading ? (
          <p className="text-gray-500 mt-2">⏳ Carregando feirantes...</p>
        ) : feirantes.length === 0 ? (
          <p className="text-gray-500 mt-2">Nenhum feirante ativo encontrado.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {feirantes.map((feirante) => (
              <li key={feirante._id || feirante.id} className="p-4 border rounded-lg shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white">
                <div className="flex-1">
                  <strong className="text-lg text-gray-900">{feirante.nome}</strong>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <Phone size={14} className="text-gray-400" /> 
                    {feirante.whatsapp || "Não informado"}
                  </p>
                  <p className="text-sm text-gray-800 font-semibold mt-1">
                    Bancas: Zinco ({feirante.qtdBancasZinco}) | Madeira ({feirante.qtdBancasMadeira})
                  </p>
                  <p className="text-sm text-green-700 font-bold mt-1">
                    Total: {formatarMoeda(feirante.valorTotal)}
                  </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => abrirModalEditar(feirante)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-bold shadow-sm transition">
                    <Edit size={16} />
                    Editar
                  </button>

                  {feirante.pagouHoje ? (
                    <button disabled className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-200 text-gray-500 px-4 py-2 rounded font-bold cursor-not-allowed shadow-inner border border-gray-300">
                      <CheckCircle size={16} />
                      Recebido
                    </button>
                  ) : (
                    <button onClick={() => abrirModalPagamento(feirante)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold shadow-sm transition">
                      <Banknote size={16} />
                      Receber
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 border-t pt-4 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/relatorio")}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 font-semibold shadow transition w-full sm:w-auto"
        >
          <FileText size={18} />
          Fechar Caixa (Relatório)
        </button>
        <button 
          onClick={() => setModalLogoutAberto(true)} 
          className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 font-semibold transition w-full sm:w-auto"
        >
          <LogOut size={18} />
          Encerrar Expediente
        </button>
      </div>

      {/* MODAL DE INATIVOS */}
      {modalInativosAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <Archive size={20} className="text-gray-500" />
              Feirantes Inativos
            </h2>
            <div className="overflow-y-auto flex-1 mb-4 border rounded p-2 bg-gray-50">
              {loadingInativos ? (
                <p className="text-gray-500 text-center p-4">⏳ Buscando inativos...</p>
              ) : feirantesInativos.length === 0 ? (
                <p className="text-gray-500 text-center p-4">Nenhum feirante inativo.</p>
              ) : (
                <ul className="space-y-2">
                  {feirantesInativos.map((feirante) => (
                    <li key={feirante._id || feirante.id} className="p-3 border bg-white rounded flex justify-between items-center gap-2">
                      <div>
                        <strong className="text-gray-700">{feirante.nome}</strong>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Phone size={12} /> {feirante.whatsapp || "Sem número"}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleReativar(feirante._id || feirante.id)}
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 border border-blue-300 px-3 py-2 rounded hover:bg-blue-200 font-semibold text-sm transition"
                      >
                        <RefreshCw size={14} />
                        Restaurar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={() => setModalInativosAberto(false)} className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 font-semibold transition">
              Fechar Arquivo
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO E EDIÇÃO */}
      {(modalAberto || modalEditarAberto) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {modalEditarAberto ? <><Edit size={20} className="text-yellow-500"/> Editar Feirante</> : <><UserPlus size={20} className="text-blue-600"/> Cadastrar Feirante</>}
            </h2>
            {erroModal && <p className="text-red-500 text-sm mb-3">{erroModal}</p>}

            <form onSubmit={modalEditarAberto ? handleEditar : handleCadastrar} className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Nome: *</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full border rounded p-2 mt-1"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">WhatsApp:</label>
                <input type="text" placeholder="(00) 00000-0000" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full border rounded p-2 mt-1"/>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700">Zinco (R$ 10)</label>
                  <input type="number" min="0" value={qtdBancasZinco} onChange={(e) => setQtdBancasZinco(e.target.value)} required className="w-full border rounded p-2 mt-1"/>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700">Madeira (R$ 5)</label>
                  <input type="number" min="0" value={qtdBancasMadeira} onChange={(e) => setQtdBancasMadeira(e.target.value)} required className="w-full border rounded p-2 mt-1"/>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold shadow-sm transition">Salvar</button>
                  <button type="button" onClick={() => { setModalAberto(false); setModalEditarAberto(false); }} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 font-semibold shadow-sm transition">Cancelar</button>
                </div>
                
                {modalEditarAberto && (
                  <button type="button" onClick={handleDesativar} className="flex items-center justify-center gap-2 w-full mt-2 bg-red-100 text-red-700 py-2 rounded hover:bg-red-200 font-semibold border border-red-300 transition">
                    <Ban size={18} />
                    Desativar Feirante
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE PAGAMENTO */}
      {modalPagamentoAberto && feiranteSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-1 text-gray-800 flex items-center gap-2">
              <Banknote size={20} className="text-green-600"/> Registrar Pagamento
            </h2>
            <p className="text-gray-600 mb-1">Feirante: <strong>{feiranteSelecionado.nome}</strong></p>
            <p className="text-sm text-gray-500 mb-3">Valor sugerido: {formatarMoeda(feiranteSelecionado.valorTotal)}</p>
            
            {mensagemPagamento && (
              <p className={`text-sm mb-3 font-semibold flex items-center gap-1 ${mensagemPagamento.includes("✅") ? "text-green-600" : "text-red-500"}`}>
                {mensagemPagamento}
              </p>
            )}
            <form onSubmit={handleRegistrarPagamento} className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Valor Pago (R$):</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0.1" 
                  value={valorPago} 
                  onChange={(e) => setValorPago(e.target.value)} 
                  required 
                  className="w-full border rounded p-3 mt-1 text-lg font-bold text-green-700"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold transition">Confirmar</button>
                <button type="button" onClick={() => setModalPagamentoAberto(false)} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 font-semibold transition">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE LOGOUT */}
      {modalLogoutAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-2 text-gray-800 flex justify-center items-center gap-2">
              <LogOut size={24} className="text-red-500"/> Sair do Sistema
            </h2>
            <p className="text-gray-600 mb-6">Tem certeza que deseja desconectar da sua conta?</p>
            <div className="flex gap-3">
              <button onClick={handleLogout} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold transition">Sim, Sair</button>
              <button onClick={() => setModalLogoutAberto(false)} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 font-semibold transition">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}