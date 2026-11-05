const Feirante = require("../models/Feirante");
const Pagamento = require("../models/Pagamento");

// 1. Criar um novo Feirante (POST)
exports.criar = async (req, res) => {
  try {
    const { nome, whatsapp, qtdBancasZinco, qtdBancasMadeira } = req.body;

    // Cria o feirante no banco de dados
    const novoFeirante = await Feirante.create({
      nome,
      whatsapp,
      qtdBancasZinco,
      qtdBancasMadeira,
    });

    res.status(201).json({
      mensagem: "Feirante cadastrado com sucesso!",
      feirante: novoFeirante,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao cadastrar feirante.", erro: error.message });
  }
};

// 2. Listar todos os Feirantes Ativos (GET)
exports.listar = async (req, res) => {
  try {
    // 1. Busca todos os feirantes ativos (1 consulta)
    const feirantes = await Feirante.find({ ativo: true });

    // 2. Define o início e o fim de HOJE
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const fimDoDia = new Date();
    fimDoDia.setHours(23, 59, 59, 999);

    // 3. Busca de uma só vez TODOS os pagamentos registrados hoje (1 consulta)
    const pagamentosHoje = await Pagamento.find({
      dataPagamento: { $gte: hoje, $lte: fimDoDia }
    });

    // 4. Extrai os IDs (em formato texto) de quem pagou hoje
    const idsPagaramHoje = pagamentosHoje.map(pag => pag.feiranteId.toString());

    // 5. Agora injetamos o status em cada feirante, sem precisar de Promise.all
    const feirantesComStatus = feirantes.map(feirante => {
      // Diferente de .toObject(), o .toJSON() garante que os campos virtuais (como valorTotal) venham
      const dadosFeirante = feirante.toJSON(); 

      // Compara o ID do feirante com a lista de quem pagou hoje
      const pagou = idsPagaramHoje.includes(dadosFeirante._id.toString());
      dadosFeirante.pagouHoje = pagou;
      
      // Mantém a sua lógica do último pagamento de forma simplificada
      dadosFeirante.dataUltimoPagamento = pagou ? "Pago hoje" : "Pagamento pendente";

      return dadosFeirante;
    });

    res.status(200).json(feirantesComStatus);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar feirantes.', erro: error.message });
  }
};

// 3. Editar Feirante
exports.editar = async (req, res) => {
  try {
    const idFeirante = req.params.id;
    const dadosAtualizados = req.body;

    // O { new: true } faz o Mongoose devolver o feirante já atualizado na resposta
    const feiranteEditado = await Feirante.findByIdAndUpdate(
      idFeirante,
      dadosAtualizados,
      { new: true },
    );

    if (!feiranteEditado) {
      return res.status(404).json({ mensagem: "Feirante não encontrado!" });
    }

    return res.status(200).json(feiranteEditado);

  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "erro ao editar feirante", erro: error.message });
  }
};

// 4. Desativar um Feirante (SOFT DELETE)
exports.excluir = async (req, res) => {
  try {
    const idFeirante = req.params.id;

    // Apaga o registro fisicamente do banco de dados
    const feiranteExcluido = await Feirante.findByIdAndUpdate(idFeirante, {
      ativo: false,
    });

    if (!feiranteExcluido) {
      return res.status(404).json({ mensagem: "Feirante não encontrado!" });
    }

    return res.status(200).json({ mensagem: "Feirante excluído com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao excluir feirante", erro: error.message });
  }
};

// 5. Deletar um Feirante (DELETE)
exports.excluirDefinitivamente = async (req, res) => {
  try {
    const idFeirante = req.params.id;
    const feiranteApagado = await Feirante.findByIdAndDelete(idFeirante);

    if (!feiranteApagado) {
      return res.status(404).json({ mensagem: "Feirante não encontrado." })
    }

    res.status(200).json({ mensagem: "Feirante apagado DEFINITIVAMENTE do banco de dados!" })
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao apagar feirante", erro: error.message })
  }
}

// 6. Listar um Feirante por ID (GET)
exports.buscarPorId = async (req, res) => {
  try {
    const idFeirante = req.params.id;
    const feirante = await Feirante.findById(idFeirante);

    if (!feirante) {
      return res.status(404).json({ mensagem: "Feirante não encontrado." })
    }

    res.status(200).json(feirante);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar feirante.', erro: error.message });
  }
};

// 7. Listar todos os Feirantes Inativos (Desativados)
exports.listarInativos = async (req, res) => {
  try {
    const inativos = await Feirante.find({ ativo: false });
    res.status(200).json(inativos);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar feirantes inativos.', erro: error.message });
  }
};