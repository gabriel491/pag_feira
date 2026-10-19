// src/controllers/pagamentoController.js
const Pagamento = require('../models/Pagamento');
const Feirante = require('../models/Feirante');

// 1. Registrar um novo pagamento (A cobrança do domingo)
exports.registrarPagamento = async (req, res) => {
  try {
    // Pegamos o ID do feirante e o valor pago que vieram do aplicativo (celular)
    const { feiranteId, valorPago } = req.body;
    
    // Pegamos o ID do cobrador que está logado (veio do Token JWT através do middleware)
    const cobradorId = req.cobrador.id; 

    // Opcional: Verificar se o feirante realmente existe antes de salvar o pagamento
    const feiranteExiste = await Feirante.findById(feiranteId);
    if (!feiranteExiste) {
      return res.status(404).json({ mensagem: 'Feirante não encontrado.' });
    }

    // Criamos o registro do pagamento no banco de dados
    const novoPagamento = await Pagamento.create({
      feiranteId,
      cobradorId,
      valorPago
    });

    res.status(201).json({
      mensagem: 'Pagamento registrado com sucesso!',
      pagamento: novoPagamento
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao registrar pagamento.', erro: error.message });
  }
};

// 2. Listar pagamentos do dia (Para o relatório de fechamento do WhatsApp)
exports.listarPagamentosDeHoje = async (req, res) => {
  try {
    // Descobre o início e o fim do dia de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Começo do dia (00:00)
    
    const fimDoDia = new Date();
    fimDoDia.setHours(23, 59, 59, 999); // Fim do dia (23:59)

    // Busca no banco os pagamentos cuja data está entre o começo e o fim de hoje
    // O .populate() serve para trazer os dados reais do Feirante e do Cobrador junto com os IDs
    const pagamentos = await Pagamento.find({
      dataPagamento: {
        $gte: hoje, // Maior ou igual ao começo do dia
        $lte: fimDoDia // Menor ou igual ao fim do dia
      }
    })
    .populate('feiranteId', 'nome') // Traz apenas o nome do feirante
    .populate('cobradorId', 'nome'); // Traz apenas o nome do cobrador

    // Calcula o valor total arrecadado no dia
    const totalArrecadado = pagamentos.reduce((total, p) => total + p.valorPago, 0);

    res.status(200).json({
      totalPagamentos: pagamentos.length,
      totalArrecadado,
      pagamentos
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar pagamentos.', erro: error.message });
  }
};