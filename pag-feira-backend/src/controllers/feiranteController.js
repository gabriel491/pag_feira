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
    const feirantes = await Feirante.find({ ativo: true });

    // O Promise.all avisa o Node para esperar todas as buscas no banco terminarem
    const feirantesComUltimoPag = await Promise.all(
      feirantes.map(async (feirante) => {
        const feiranteFormatado = feirante.toObject(); 

        const historico = await Pagamento.find({ feiranteId: feirante._id })
          .sort({ dataPagamento: -1 })
          .limit(1);
        
        if (historico.length > 0) {
          feiranteFormatado.dataUltimoPagamento = historico[0].dataPagamento;
        } else {
          feiranteFormatado.dataUltimoPagamento = "Nenhum pagamento registrado";
        }

        return feiranteFormatado;
      })
    );

    res.status(200).json(feirantesComUltimoPag);
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